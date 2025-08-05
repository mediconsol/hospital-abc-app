"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DepartmentCostChart } from "@/components/charts/department-cost-chart"
import { mockDepartmentKPIs, mockRevenueKPIs } from "@/lib/mock-data"
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  Activity,
  Building2,
  Calendar,
  Filter,
  PieChart,
  BarChart3,
  Percent,
  Calculator,
  Award,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"

// KPI 데이터 타입
interface KPIMetric {
  id: string
  name: string
  current_value: number
  previous_value: number
  target_value: number
  unit: string
  format: "currency" | "percent" | "number"
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical" | "neutral"
  category: "financial" | "operational" | "quality" | "efficiency"
}

// 더미 KPI 데이터
const mockKPIMetrics: KPIMetric[] = [
  {
    id: "total_cost",
    name: "총 운영비용",
    current_value: 450000000,
    previous_value: 420000000,
    target_value: 430000000,
    unit: "원",
    format: "currency",
    trend: "up",
    status: "warning",
    category: "financial"
  },
  {
    id: "cost_per_patient",
    name: "환자당 원가",
    current_value: 125000,
    previous_value: 130000,
    target_value: 120000,
    unit: "원",
    format: "currency",
    trend: "down",
    status: "good",
    category: "efficiency"
  },
  {
    id: "profit_margin",
    name: "수익률",
    current_value: 0.185,
    previous_value: 0.165,
    target_value: 0.20,
    unit: "%",
    format: "percent",
    trend: "up",
    status: "good",
    category: "financial"
  },
  {
    id: "activity_efficiency",
    name: "활동 효율성",
    current_value: 0.82,
    previous_value: 0.78,
    target_value: 0.85,
    unit: "%",
    format: "percent",
    trend: "up",
    status: "good",
    category: "efficiency"
  },
  {
    id: "capacity_utilization",
    name: "가동률",
    current_value: 0.76,
    previous_value: 0.72,
    target_value: 0.80,
    unit: "%",
    format: "percent",
    trend: "up",
    status: "warning",
    category: "operational"
  },
  {
    id: "cost_variance",
    name: "예산 차이율",
    current_value: 0.045,
    previous_value: 0.065,
    target_value: 0.03,
    unit: "%",
    format: "percent",
    trend: "down",
    status: "warning",
    category: "financial"
  },
  {
    id: "quality_score",
    name: "품질 점수",
    current_value: 88.5,
    previous_value: 85.2,
    target_value: 90.0,
    unit: "점",
    format: "number",
    trend: "up",
    status: "good",
    category: "quality"
  },
  {
    id: "employee_productivity",
    name: "직원 생산성",
    current_value: 95.2,
    previous_value: 92.8,
    target_value: 100.0,
    unit: "점",
    format: "number",
    trend: "up",
    status: "good",
    category: "operational"
  }
]

export default function KPIReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // 필터링된 KPI 메트릭
  const filteredKPIs = selectedCategory === "all" 
    ? mockKPIMetrics 
    : mockKPIMetrics.filter(kpi => kpi.category === selectedCategory)

  // 유틸리티 함수들
  const formatValue = (value: number, format: "currency" | "percent" | "number", unit: string) => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0
        }).format(value)
      case "percent":
        return `${(value * 100).toFixed(1)}%`
      case "number":
        return `${value.toFixed(1)}${unit}`
      default:
        return value.toString()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600 bg-green-50 border-green-200"
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical": return "text-red-600 bg-red-50 border-red-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="h-3 w-3 text-green-600" />
      case "down": return <ArrowDown className="h-3 w-3 text-red-600" />
      default: return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getChangePercent = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // 카테고리별 통계
  const categoryStats = {
    financial: filteredKPIs.filter(kpi => kpi.category === "financial"),
    operational: filteredKPIs.filter(kpi => kpi.category === "operational"),
    efficiency: filteredKPIs.filter(kpi => kpi.category === "efficiency"),
    quality: filteredKPIs.filter(kpi => kpi.category === "quality")
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">KPI 대시보드</h1>
          <p className="text-muted-foreground">
            주요 성과 지표 및 분석 결과를 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 옵션
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">대상기간</Label>
              <Input
                id="period"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">KPI 카테고리</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="financial">재무지표</SelectItem>
                  <SelectItem value="operational">운영지표</SelectItem>
                  <SelectItem value="efficiency">효율성지표</SelectItem>
                  <SelectItem value="quality">품질지표</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewMode">보기 방식</Label>
              <Select value={viewMode} onValueChange={(value: "grid" | "list") => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">카드형</SelectItem>
                  <SelectItem value="list">목록형</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>액션</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  상세보기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              총 운영비용
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatValue(mockDepartmentKPIs.reduce((sum, dept) => sum + dept.total_cost, 0), "currency", "원")}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              전월 대비 +8.5%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              평균 단가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatValue(mockDepartmentKPIs.reduce((sum, dept) => sum + dept.total_cost, 0) / mockDepartmentKPIs.reduce((sum, dept) => sum + dept.fte, 0), "currency", "원")}
            </div>
            <div className="text-xs text-muted-foreground">
              FTE당 평균 원가
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              총 FTE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockDepartmentKPIs.reduce((sum, dept) => sum + dept.fte, 0).toFixed(1)}명
            </div>
            <div className="text-xs text-muted-foreground">
              전환인력 기준
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              수익성 비율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatValue(mockRevenueKPIs.filter(rev => rev.profit > 0).length / mockRevenueKPIs.length, "percent", "%")}
            </div>
            <div className="text-xs text-muted-foreground">
              수익 &gt; 원가 항목
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            핵심성과 지표 (KPI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredKPIs.map((kpi) => (
                <Card key={kpi.id} className={`border-l-4 ${getStatusColor(kpi.status)} border-l-current`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{kpi.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {kpi.category === "financial" ? "재무" :
                             kpi.category === "operational" ? "운영" :
                             kpi.category === "efficiency" ? "효율성" : "품질"}
                          </Badge>
                        </div>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xl font-bold">
                          {formatValue(kpi.current_value, kpi.format, kpi.unit)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          목표: {formatValue(kpi.target_value, kpi.format, kpi.unit)}
                        </div>
                        <Progress 
                          value={(kpi.current_value / kpi.target_value) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">전월 대비</span>
                        <span className={getChangePercent(kpi.current_value, kpi.previous_value) >= 0 ? "text-green-600" : "text-red-600"}>
                          {getChangePercent(kpi.current_value, kpi.previous_value) >= 0 ? "+" : ""}
                          {getChangePercent(kpi.current_value, kpi.previous_value).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredKPIs.map((kpi) => (
                <Card key={kpi.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="font-medium">{kpi.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {kpi.category === "financial" ? "재무" :
                             kpi.category === "operational" ? "운영" :
                             kpi.category === "efficiency" ? "효율성" : "품질"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatValue(kpi.current_value, kpi.format, kpi.unit)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            목표: {formatValue(kpi.target_value, kpi.format, kpi.unit)}
                          </div>
                        </div>
                        
                        <div className="text-right min-w-[80px]">
                          <div className={`text-sm font-medium ${getChangePercent(kpi.current_value, kpi.previous_value) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {getChangePercent(kpi.current_value, kpi.previous_value) >= 0 ? "+" : ""}
                            {getChangePercent(kpi.current_value, kpi.previous_value).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">전월 대비</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getTrendIcon(kpi.trend)}
                          <Badge variant={kpi.status === "good" ? "default" : kpi.status === "warning" ? "secondary" : "destructive"}>
                            {kpi.status === "good" ? "양호" : kpi.status === "warning" ? "주의" : "위험"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Chart Area */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            부서별 원가 차트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentCostChart data={mockDepartmentKPIs} />
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              부서별 성과 요약
            </CardTitle>
            <CardDescription>원가 효율성 기준 순위</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDepartmentKPIs
                .sort((a, b) => a.unit_cost - b.unit_cost)
                .slice(0, 5)
                .map((dept, index) => (
                  <div key={dept.department_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{dept.department_name}</p>
                        <p className="text-sm text-muted-foreground">
                          FTE: {dept.fte}명
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatValue(dept.unit_cost, "currency", "원")}</p>
                      <p className="text-sm text-muted-foreground">단가</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              수익성 분석
            </CardTitle>
            <CardDescription>손익 기준 수익코드 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRevenueKPIs
                .sort((a, b) => b.profit - a.profit)
                .map((revenue) => (
                  <div key={revenue.revenue_code_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {revenue.profit >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{revenue.revenue_code_name}</p>
                        <p className="text-sm text-muted-foreground">
                          건수: {revenue.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        revenue.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatValue(revenue.profit, "currency", "원")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatValue(revenue.profit_ratio, "percent", "%")}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            주요 분석 결과 및 권장사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                예산 초과 주의
              </h4>
              <p className="text-sm text-yellow-700">
                현재 총 운영비용이 목표 예산을 4.5% 초과하고 있습니다. 
                원가 구조 분석을 통한 개선이 필요합니다.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                우수 성과
              </h4>
              <p className="text-sm text-blue-700">
                수익률이 목표치에 근접(18.5%)하고 있으며, 
                활동 효율성도 전월 대비 개선되었습니다.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                긍정적 추세
              </h4>
              <p className="text-sm text-green-700">
                전체 수익코드의 {formatValue(mockRevenueKPIs.filter(rev => rev.profit > 0).length / mockRevenueKPIs.length, "percent", "%")}가 흑자를 기록하고 있어 
                안정적인 수익 구조를 보이고 있습니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
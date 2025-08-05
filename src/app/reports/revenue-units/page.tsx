"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Receipt,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Filter,
  Target,
  Activity,
  Building2,
  Percent,
  CreditCard
} from "lucide-react"

// 수익코드별 단가 데이터 타입
interface RevenueUnitCost {
  revenue_code_id: string
  revenue_code: string
  revenue_name: string
  category: string
  department_id: string
  department_name: string
  unit_cost: number
  unit_price: number
  margin: number
  margin_percent: number
  volume: number
  total_cost: number
  total_revenue: number
  total_profit: number
  profitability_ratio: number
  market_price: number
  competitive_index: number
  activities: {
    activity_id: string
    activity_name: string
    cost: number
    percentage: number
  }[]
  cost_breakdown: {
    material_cost: number
    labor_cost: number
    overhead_cost: number
    equipment_cost: number
  }
}

// 더미 데이터
const mockRevenueUnitCosts: RevenueUnitCost[] = [
  {
    revenue_code_id: "R001",
    revenue_code: "AA001",
    revenue_name: "일반진료 (초진)",
    category: "진료수가",
    department_id: "11",
    department_name: "내과",
    unit_cost: 35000,
    unit_price: 45000,
    margin: 10000,
    margin_percent: 22.2,
    volume: 450,
    total_cost: 15750000,
    total_revenue: 20250000,
    total_profit: 4500000,
    profitability_ratio: 0.286,
    market_price: 42000,
    competitive_index: 1.07,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 25000, percentage: 71.4 },
      { activity_id: "5", activity_name: "원무활동", cost: 6000, percentage: 17.1 },
      { activity_id: "2", activity_name: "간호활동", cost: 4000, percentage: 11.4 }
    ],
    cost_breakdown: {
      material_cost: 8000,
      labor_cost: 20000,
      overhead_cost: 5000,
      equipment_cost: 2000
    }
  },
  {
    revenue_code_id: "R002",
    revenue_code: "AA002",
    revenue_name: "일반진료 (재진)",
    category: "진료수가",
    department_id: "11",
    department_name: "내과",
    unit_cost: 25000,
    unit_price: 32000,
    margin: 7000,
    margin_percent: 21.9,
    volume: 680,
    total_cost: 17000000,
    total_revenue: 21760000,
    total_profit: 4760000,
    profitability_ratio: 0.280,
    market_price: 30000,
    competitive_index: 1.07,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 18000, percentage: 72.0 },
      { activity_id: "5", activity_name: "원무활동", cost: 4000, percentage: 16.0 },
      { activity_id: "2", activity_name: "간호활동", cost: 3000, percentage: 12.0 }
    ],
    cost_breakdown: {
      material_cost: 5000,
      labor_cost: 15000,
      overhead_cost: 3500,
      equipment_cost: 1500
    }
  },
  {
    revenue_code_id: "R003",
    revenue_code: "SU001",
    revenue_name: "일반수술 (소)",
    category: "수술수가",
    department_id: "12",
    department_name: "외과",
    unit_cost: 180000,
    unit_price: 250000,
    margin: 70000,
    margin_percent: 28.0,
    volume: 85,
    total_cost: 15300000,
    total_revenue: 21250000,
    total_profit: 5950000,
    profitability_ratio: 0.389,
    market_price: 240000,
    competitive_index: 1.04,
    activities: [
      { activity_id: "6", activity_name: "수술활동", cost: 120000, percentage: 66.7 },
      { activity_id: "1", activity_name: "진료활동", cost: 35000, percentage: 19.4 },
      { activity_id: "2", activity_name: "간호활동", cost: 25000, percentage: 13.9 }
    ],
    cost_breakdown: {
      material_cost: 50000,
      labor_cost: 90000,
      overhead_cost: 25000,
      equipment_cost: 15000
    }
  },
  {
    revenue_code_id: "R004",
    revenue_code: "SU002",
    revenue_name: "일반수술 (중)",
    category: "수술수가",
    department_id: "12",
    department_name: "외과",
    unit_cost: 320000,
    unit_price: 450000,
    margin: 130000,
    margin_percent: 28.9,
    volume: 42,
    total_cost: 13440000,
    total_revenue: 18900000,
    total_profit: 5460000,
    profitability_ratio: 0.406,
    market_price: 430000,
    competitive_index: 1.05,
    activities: [
      { activity_id: "6", activity_name: "수술활동", cost: 220000, percentage: 68.8 },
      { activity_id: "1", activity_name: "진료활동", cost: 60000, percentage: 18.8 },
      { activity_id: "2", activity_name: "간호활동", cost: 40000, percentage: 12.5 }
    ],
    cost_breakdown: {
      material_cost: 80000,
      labor_cost: 180000,
      overhead_cost: 40000,
      equipment_cost: 20000
    }
  },
  {
    revenue_code_id: "R005",
    revenue_code: "IM001",
    revenue_name: "CT 촬영",
    category: "영상검사",
    department_id: "13",
    department_name: "영상의학과",
    unit_cost: 85000,
    unit_price: 120000,
    margin: 35000,
    margin_percent: 29.2,
    volume: 320,
    total_cost: 27200000,
    total_revenue: 38400000,
    total_profit: 11200000,
    profitability_ratio: 0.412,
    market_price: 115000,
    competitive_index: 1.04,
    activities: [
      { activity_id: "3", activity_name: "영상촬영", cost: 60000, percentage: 70.6 },
      { activity_id: "1", activity_name: "진료활동", cost: 15000, percentage: 17.6 },
      { activity_id: "7", activity_name: "장비관리", cost: 10000, percentage: 11.8 }
    ],
    cost_breakdown: {
      material_cost: 20000,
      labor_cost: 35000,
      overhead_cost: 15000,
      equipment_cost: 15000
    }
  },
  {
    revenue_code_id: "R006",
    revenue_code: "IM002",
    revenue_name: "MRI 촬영",
    category: "영상검사",
    department_id: "13",
    department_name: "영상의학과",
    unit_cost: 150000,
    unit_price: 220000,
    margin: 70000,
    margin_percent: 31.8,
    volume: 180,
    total_cost: 27000000,
    total_revenue: 39600000,
    total_profit: 12600000,
    profitability_ratio: 0.467,
    market_price: 210000,
    competitive_index: 1.05,
    activities: [
      { activity_id: "3", activity_name: "영상촬영", cost: 105000, percentage: 70.0 },
      { activity_id: "1", activity_name: "진료활동", cost: 25000, percentage: 16.7 },
      { activity_id: "7", activity_name: "장비관리", cost: 20000, percentage: 13.3 }
    ],
    cost_breakdown: {
      material_cost: 35000,
      labor_cost: 65000,
      overhead_cost: 25000,
      equipment_cost: 25000
    }
  },
  {
    revenue_code_id: "R007",
    revenue_code: "LA001",
    revenue_name: "혈액검사 (기본)",
    category: "검사수가",
    department_id: "11",
    department_name: "내과",
    unit_cost: 15000,
    unit_price: 22000,
    margin: 7000,
    margin_percent: 31.8,
    volume: 850,
    total_cost: 12750000,
    total_revenue: 18700000,
    total_profit: 5950000,
    profitability_ratio: 0.467,
    market_price: 20000,
    competitive_index: 1.10,
    activities: [
      { activity_id: "4", activity_name: "검체검사", cost: 10000, percentage: 66.7 },
      { activity_id: "1", activity_name: "진료활동", cost: 3000, percentage: 20.0 },
      { activity_id: "5", activity_name: "원무활동", cost: 2000, percentage: 13.3 }
    ],
    cost_breakdown: {
      material_cost: 8000,
      labor_cost: 5000,
      overhead_cost: 1500,
      equipment_cost: 500
    }
  },
  {
    revenue_code_id: "R008",
    revenue_code: "LA002",
    revenue_name: "혈액검사 (정밀)",
    category: "검사수가",
    department_id: "11",
    department_name: "내과",
    unit_cost: 35000,
    unit_price: 55000,
    margin: 20000,
    margin_percent: 36.4,
    volume: 240,
    total_cost: 8400000,
    total_revenue: 13200000,
    total_profit: 4800000,
    profitability_ratio: 0.571,
    market_price: 50000,
    competitive_index: 1.10,
    activities: [
      { activity_id: "4", activity_name: "검체검사", cost: 25000, percentage: 71.4 },
      { activity_id: "1", activity_name: "진료활동", cost: 6000, percentage: 17.1 },
      { activity_id: "5", activity_name: "원무활동", cost: 4000, percentage: 11.4 }
    ],
    cost_breakdown: {
      material_cost: 20000,
      labor_cost: 10000,
      overhead_cost: 3500,
      equipment_cost: 1500
    }
  }
]

export default function RevenueUnitCostReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [sortBy, setSortBy] = useState("profitability_ratio")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterRevenue, setFilterRevenue] = useState("")

  // 데이터 필터링 및 정렬
  const filteredAndSortedData = mockRevenueUnitCosts
    .filter(item => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false
      if (selectedDepartment !== "all" && item.department_id !== selectedDepartment) return false
      if (filterRevenue && !item.revenue_name.includes(filterRevenue)) return false
      return true
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      switch (sortBy) {
        case "profitability_ratio":
          return (a.profitability_ratio - b.profitability_ratio) * multiplier
        case "margin_percent":
          return (a.margin_percent - b.margin_percent) * multiplier
        case "volume":
          return (a.volume - b.volume) * multiplier
        case "total_profit":
          return (a.total_profit - b.total_profit) * multiplier
        case "competitive_index":
          return (a.competitive_index - b.competitive_index) * multiplier
        default:
          return 0
      }
    })

  // 통계 계산
  const totalRevenue = filteredAndSortedData.reduce((sum, item) => sum + item.total_revenue, 0)
  const totalCost = filteredAndSortedData.reduce((sum, item) => sum + item.total_cost, 0)
  const totalProfit = filteredAndSortedData.reduce((sum, item) => sum + item.total_profit, 0)
  const avgProfitabilityRatio = filteredAndSortedData.reduce((sum, item) => sum + item.profitability_ratio, 0) / filteredAndSortedData.length
  const totalVolume = filteredAndSortedData.reduce((sum, item) => sum + item.volume, 0)
  const avgCompetitiveIndex = filteredAndSortedData.reduce((sum, item) => sum + item.competitive_index, 0) / filteredAndSortedData.length

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "진료수가": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "수술수가": return "bg-red-500/10 text-red-600 border-red-500/20"
      case "영상검사": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "검사수가": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getProfitabilityColor = (ratio: number) => {
    if (ratio >= 0.4) return "text-green-600"
    if (ratio >= 0.2) return "text-yellow-600"
    return "text-red-600"
  }

  const getCompetitiveColor = (index: number) => {
    if (index >= 1.05) return "text-green-600"
    if (index >= 0.95) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">수익코드별 단가 리포트</h1>
        <p className="text-muted-foreground">
          각 수익코드의 단가 구성과 수익성을 분석합니다.
        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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
              <Label htmlFor="category">수가분류</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="진료수가">진료수가</SelectItem>
                  <SelectItem value="수술수가">수술수가</SelectItem>
                  <SelectItem value="영상검사">영상검사</SelectItem>
                  <SelectItem value="검사수가">검사수가</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">담당부서</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="11">내과</SelectItem>
                  <SelectItem value="12">외과</SelectItem>
                  <SelectItem value="13">영상의학과</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">수익코드명</Label>
              <Input
                id="revenue"
                placeholder="코드명 검색"
                value={filterRevenue}
                onChange={(e) => setFilterRevenue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortBy">정렬기준</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profitability_ratio">수익성</SelectItem>
                  <SelectItem value="margin_percent">마진율</SelectItem>
                  <SelectItem value="volume">수량</SelectItem>
                  <SelectItem value="total_profit">총 이익</SelectItem>
                  <SelectItem value="competitive_index">경쟁력</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">정렬순서</Label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">내림차순</SelectItem>
                  <SelectItem value="asc">오름차순</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>액션</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  내보내기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              총 수익
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalRevenue.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredAndSortedData.length}개 코드 합계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              총 원가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalCost.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              총 비용
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              총 이익
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalProfit.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              이익률 {((totalProfit / totalRevenue) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              평균 수익성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getProfitabilityColor(avgProfitabilityRatio)}`}>
              {(avgProfitabilityRatio * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              수익성 지수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              경쟁력 지수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCompetitiveColor(avgCompetitiveIndex)}`}>
              {avgCompetitiveIndex.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              시장 대비 경쟁력
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Unit List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            수익코드별 단가 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAndSortedData.map((item) => (
            <Card key={item.revenue_code_id} className="border-l-4 border-l-green-500/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Revenue Code Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{item.revenue_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.revenue_code}
                        </Badge>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.department_name} • 수량 {item.volume}건 • 시장가 {item.market_price.toLocaleString()}원
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {item.unit_price.toLocaleString()}원
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getProfitabilityColor(item.profitability_ratio)}>
                          수익성 {(item.profitability_ratio * 100).toFixed(1)}%
                        </Badge>
                        <Badge variant={item.competitive_index >= 1.0 ? "default" : "destructive"}>
                          <span className={getCompetitiveColor(item.competitive_index)}>
                            경쟁력 {item.competitive_index.toFixed(2)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Cost and Margin Analysis */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">수익성 분석</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border">
                        <div className="text-sm font-medium">단위 원가</div>
                        <div className="text-lg font-semibold text-orange-600">
                          {item.unit_cost.toLocaleString()}원
                        </div>
                        <div className="text-xs text-muted-foreground">
                          총 원가: {item.total_cost.toLocaleString()}원
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border">
                        <div className="text-sm font-medium">단위 마진</div>
                        <div className="text-lg font-semibold text-green-600">
                          {item.margin.toLocaleString()}원
                        </div>
                        <div className="text-xs text-muted-foreground">
                          마진율: {item.margin_percent.toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                        <div className="text-sm font-medium">총 수익</div>
                        <div className="text-lg font-semibold text-primary">
                          {item.total_revenue.toLocaleString()}원
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.volume}건 × {item.unit_price.toLocaleString()}원
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border">
                        <div className="text-sm font-medium">총 이익</div>
                        <div className="text-lg font-semibold text-emerald-600">
                          {item.total_profit.toLocaleString()}원
                        </div>
                        <Progress 
                          value={item.profitability_ratio * 100} 
                          className="h-2 mt-1"
                        />
                        <div className="text-xs text-muted-foreground">
                          수익률 {(item.profitability_ratio * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      원가 구성 요소
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">재료비</span>
                          <Badge variant="outline" className="text-xs">
                            {((item.cost_breakdown.material_cost / item.unit_cost) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="font-semibold text-red-600">
                          {item.cost_breakdown.material_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.cost_breakdown.material_cost / item.unit_cost) * 100} 
                          className="h-2" 
                        />
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">인건비</span>
                          <Badge variant="outline" className="text-xs">
                            {((item.cost_breakdown.labor_cost / item.unit_cost) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="font-semibold text-blue-600">
                          {item.cost_breakdown.labor_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.cost_breakdown.labor_cost / item.unit_cost) * 100} 
                          className="h-2" 
                        />
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">간접비</span>
                          <Badge variant="outline" className="text-xs">
                            {((item.cost_breakdown.overhead_cost / item.unit_cost) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="font-semibold text-yellow-600">
                          {item.cost_breakdown.overhead_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.cost_breakdown.overhead_cost / item.unit_cost) * 100} 
                          className="h-2" 
                        />
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">장비비</span>
                          <Badge variant="outline" className="text-xs">
                            {((item.cost_breakdown.equipment_cost / item.unit_cost) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="font-semibold text-purple-600">
                          {item.cost_breakdown.equipment_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.cost_breakdown.equipment_cost / item.unit_cost) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Activity Distribution */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      활동별 원가 배분
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.activities.map((activity) => (
                        <div key={activity.activity_id} className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{activity.activity_name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activity.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="font-semibold text-teal-600">
                            {activity.cost.toLocaleString()}원
                          </div>
                          <Progress value={activity.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
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
  Target,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Stethoscope,
  UserCog,
  Download,
  Filter,
  PieChart,
  BarChart3,
  Activity,
  Eye,
  CheckCircle
} from "lucide-react"
import {
  CostObjectType,
  costObjectTypeLabels,
  costObjectTypeColors,
  getFinalCostObjects,
  getCostObjectsByType
} from "@/lib/cost-object-data"

// 원가대상별 원가 분석 데이터 타입
interface CostObjectAnalysis {
  cost_object_id: string
  cost_object_name: string
  cost_object_code: string
  type: CostObjectType
  level: number
  path: string
  is_final_target: boolean
  
  // 원가 정보
  direct_cost: number
  indirect_cost: number
  total_cost: number
  budget: number
  variance: number
  variance_percent: number
  
  // 효율성 지표
  cost_per_unit: number
  efficiency_score: number
  benchmark_comparison: number
  
  // 상세 원가 구성
  activities: {
    activity_id: string
    activity_name: string
    cost: number
    percentage: number
  }[]
  
  departments: {
    department_id: string
    department_name: string
    cost: number
    percentage: number
  }[]
  
  // 추세 데이터
  monthly_trend: {
    month: string
    cost: number
    budget: number
  }[]
}

// 더미 원가대상별 분석 데이터
const mockCostObjectAnalysis: CostObjectAnalysis[] = [
  {
    cost_object_id: "pc4",
    cost_object_name: "신장내과(외래)",
    cost_object_code: "PC004",
    type: "patient_care",
    level: 4,
    path: "pc1/pc2/pc3/pc4",
    is_final_target: true,
    direct_cost: 45000000,
    indirect_cost: 18000000,
    total_cost: 63000000,
    budget: 60000000,
    variance: 3000000,
    variance_percent: 5.0,
    cost_per_unit: 125000,
    efficiency_score: 85,
    benchmark_comparison: 1.02,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 35000000, percentage: 55.6 },
      { activity_id: "4", activity_name: "검체검사", cost: 15000000, percentage: 23.8 },
      { activity_id: "5", activity_name: "원무활동", cost: 8000000, percentage: 12.7 },
      { activity_id: "2", activity_name: "간호활동", cost: 5000000, percentage: 7.9 }
    ],
    departments: [
      { department_id: "11", department_name: "내과", cost: 40000000, percentage: 63.5 },
      { department_id: "21", department_name: "간호부", cost: 15000000, percentage: 23.8 },
      { department_id: "311", department_name: "원무팀", cost: 8000000, percentage: 12.7 }
    ],
    monthly_trend: [
      { month: "2025-01", cost: 63000000, budget: 60000000 },
      { month: "2024-12", cost: 58000000, budget: 60000000 },
      { month: "2024-11", cost: 61000000, budget: 60000000 }
    ]
  },
  {
    cost_object_id: "pc5",
    cost_object_name: "신장내과(입원)",
    cost_object_code: "PC005",
    type: "patient_care",
    level: 4,
    path: "pc1/pc2/pc3/pc5",
    is_final_target: true,
    direct_cost: 85000000,
    indirect_cost: 35000000,
    total_cost: 120000000,
    budget: 115000000,
    variance: 5000000,
    variance_percent: 4.3,
    cost_per_unit: 240000,
    efficiency_score: 78,
    benchmark_comparison: 1.08,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 60000000, percentage: 50.0 },
      { activity_id: "2", activity_name: "간호활동", cost: 35000000, percentage: 29.2 },
      { activity_id: "4", activity_name: "검체검사", cost: 15000000, percentage: 12.5 },
      { activity_id: "5", activity_name: "원무활동", cost: 10000000, percentage: 8.3 }
    ],
    departments: [
      { department_id: "11", department_name: "내과", cost: 70000000, percentage: 58.3 },
      { department_id: "21", department_name: "간호부", cost: 35000000, percentage: 29.2 },
      { department_id: "311", department_name: "원무팀", cost: 15000000, percentage: 12.5 }
    ],
    monthly_trend: [
      { month: "2025-01", cost: 120000000, budget: 115000000 },
      { month: "2024-12", cost: 112000000, budget: 115000000 },
      { month: "2024-11", cost: 118000000, budget: 115000000 }
    ]
  },
  {
    cost_object_id: "ed5",
    cost_object_name: "11병동(입원)",
    cost_object_code: "ED005",
    type: "execution_dept",
    level: 5,
    path: "ed1/ed2/ed3/ed4/ed5",
    is_final_target: true,
    direct_cost: 95000000,
    indirect_cost: 38000000,
    total_cost: 133000000,
    budget: 125000000,
    variance: 8000000,
    variance_percent: 6.4,
    cost_per_unit: 185000,
    efficiency_score: 72,
    benchmark_comparison: 1.12,
    activities: [
      { activity_id: "2", activity_name: "간호활동", cost: 70000000, percentage: 52.6 },
      { activity_id: "8", activity_name: "병동관리", cost: 35000000, percentage: 26.3 },
      { activity_id: "9", activity_name: "환자관리", cost: 28000000, percentage: 21.1 }
    ],
    departments: [
      { department_id: "21", department_name: "간호부", cost: 70000000, percentage: 52.6 },
      { department_id: "12", department_name: "외과", cost: 35000000, percentage: 26.3 },
      { department_id: "311", department_name: "원무팀", cost: 28000000, percentage: 21.1 }
    ],
    monthly_trend: [
      { month: "2025-01", cost: 133000000, budget: 125000000 },
      { month: "2024-12", cost: 128000000, budget: 125000000 },
      { month: "2024-11", cost: 130000000, budget: 125000000 }
    ]
  },
  {
    cost_object_id: "pd5",
    cost_object_name: "김원장",
    cost_object_code: "PD005",
    type: "prescribing_doctor",
    level: 5,
    path: "pd1/pd2/pd3/pd4/pd5",
    is_final_target: true,
    direct_cost: 25000000,
    indirect_cost: 8000000,
    total_cost: 33000000,
    budget: 30000000,
    variance: 3000000,
    variance_percent: 10.0,
    cost_per_unit: 65000,
    efficiency_score: 88,
    benchmark_comparison: 0.95,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 20000000, percentage: 60.6 },
      { activity_id: "10", activity_name: "영양상담", cost: 8000000, percentage: 24.2 },
      { activity_id: "5", activity_name: "원무활동", cost: 5000000, percentage: 15.2 }
    ],
    departments: [
      { department_id: "31", department_name: "재활의학과", cost: 25000000, percentage: 75.8 },
      { department_id: "32", department_name: "영양팀", cost: 8000000, percentage: 24.2 }
    ],
    monthly_trend: [
      { month: "2025-01", cost: 33000000, budget: 30000000 },
      { month: "2024-12", cost: 28000000, budget: 30000000 },
      { month: "2024-11", cost: 31000000, budget: 30000000 }
    ]
  },
  {
    cost_object_id: "exd4",
    cost_object_name: "박원장",
    cost_object_code: "EXD004",
    type: "executing_doctor",
    level: 4,
    path: "exd1/exd2/exd3/exd4",
    is_final_target: true,
    direct_cost: 55000000,
    indirect_cost: 22000000,
    total_cost: 77000000,
    budget: 72000000,
    variance: 5000000,
    variance_percent: 6.9,
    cost_per_unit: 154000,
    efficiency_score: 82,
    benchmark_comparison: 1.05,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 40000000, percentage: 51.9 },
      { activity_id: "2", activity_name: "간호활동", cost: 25000000, percentage: 32.5 },
      { activity_id: "8", activity_name: "병동관리", cost: 12000000, percentage: 15.6 }
    ],
    departments: [
      { department_id: "11", department_name: "내과", cost: 40000000, percentage: 51.9 },
      { department_id: "21", department_name: "간호부", cost: 25000000, percentage: 32.5 },
      { department_id: "311", department_name: "원무팀", cost: 12000000, percentage: 15.6 }
    ],
    monthly_trend: [
      { month: "2025-01", cost: 77000000, budget: 72000000 },
      { month: "2024-12", cost: 71000000, budget: 72000000 },
      { month: "2024-11", cost: 75000000, budget: 72000000 }
    ]
  }
]

export default function CostObjectReportPage() {
  const [selectedType, setSelectedType] = useState<CostObjectType>("patient_care")
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01")
  const [sortBy, setSortBy] = useState("total_cost")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterCostObject, setFilterCostObject] = useState("")
  const [showFinalTargetsOnly, setShowFinalTargetsOnly] = useState(true)

  // 데이터 필터링 및 정렬
  const filteredAndSortedData = mockCostObjectAnalysis
    .filter(item => {
      if (item.type !== selectedType) return false
      if (showFinalTargetsOnly && !item.is_final_target) return false
      if (filterCostObject && !item.cost_object_name.includes(filterCostObject)) return false
      return true
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      switch (sortBy) {
        case "total_cost":
          return (a.total_cost - b.total_cost) * multiplier
        case "efficiency_score":
          return (a.efficiency_score - b.efficiency_score) * multiplier
        case "variance_percent":
          return (a.variance_percent - b.variance_percent) * multiplier
        case "benchmark_comparison":
          return (a.benchmark_comparison - b.benchmark_comparison) * multiplier
        default:
          return 0
      }
    })

  // 통계 계산
  const totalCost = filteredAndSortedData.reduce((sum, item) => sum + item.total_cost, 0)
  const totalBudget = filteredAndSortedData.reduce((sum, item) => sum + item.budget, 0)
  const totalVariance = filteredAndSortedData.reduce((sum, item) => sum + item.variance, 0)
  const avgEfficiency = filteredAndSortedData.reduce((sum, item) => sum + item.efficiency_score, 0) / filteredAndSortedData.length
  const avgBenchmark = filteredAndSortedData.reduce((sum, item) => sum + item.benchmark_comparison, 0) / filteredAndSortedData.length

  const getTypeIcon = (type: CostObjectType) => {
    switch (type) {
      case "patient_care":
        return <Users className="h-4 w-4" />
      case "execution_dept":
        return <Building2 className="h-4 w-4" />
      case "prescribing_doctor":
        return <Stethoscope className="h-4 w-4" />
      case "executing_doctor":
        return <UserCog className="h-4 w-4" />
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600"
    if (variance < 0) return "text-green-600"
    return "text-gray-600"
  }

  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getBenchmarkColor = (ratio: number) => {
    if (ratio <= 0.95) return "text-green-600"
    if (ratio <= 1.05) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">원가대상별 원가 리포트</h1>
        <p className="text-muted-foreground">
          4가지 관점에서 원가대상별 원가 집계 및 분석 결과를 확인합니다.
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
              <Label htmlFor="type">원가대상 관점</Label>
              <Select value={selectedType} onValueChange={(value: CostObjectType) => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient_care">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      환자진료과
                    </div>
                  </SelectItem>
                  <SelectItem value="execution_dept">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      시행과
                    </div>
                  </SelectItem>
                  <SelectItem value="prescribing_doctor">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      처방의사
                    </div>
                  </SelectItem>
                  <SelectItem value="executing_doctor">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      시행의사
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="search">검색</Label>
              <Input
                id="search"
                placeholder="원가대상명 검색"
                value={filterCostObject}
                onChange={(e) => setFilterCostObject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortBy">정렬기준</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total_cost">총 원가</SelectItem>
                  <SelectItem value="efficiency_score">효율성 점수</SelectItem>
                  <SelectItem value="variance_percent">예산차이율</SelectItem>
                  <SelectItem value="benchmark_comparison">벤치마크 비교</SelectItem>
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
              <Label>옵션</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="final-targets"
                  checked={showFinalTargetsOnly}
                  onChange={(e) => setShowFinalTargetsOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="final-targets" className="text-sm">최종대상만</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>액션</Label>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-1" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              총 원가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalCost.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredAndSortedData.length}개 원가대상 합계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              총 예산
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalBudget.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              예산 대비 {((totalCost / totalBudget) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              예산 차이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
              {totalVariance > 0 ? "+" : ""}{totalVariance.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalVariance > 0 ? "예산 초과" : "예산 절약"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              평균 효율성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(avgEfficiency)}`}>
              {avgEfficiency.toFixed(1)}점
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              효율성 평가 점수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              벤치마크 비교
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getBenchmarkColor(avgBenchmark)}`}>
              {avgBenchmark.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              업계 평균 대비
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Object List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {getTypeIcon(selectedType)}
            {costObjectTypeLabels[selectedType]} 원가 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAndSortedData.map((item) => (
            <Card key={item.cost_object_id} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Cost Object Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{item.cost_object_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.cost_object_code}
                        </Badge>
                        <Badge variant="secondary" className={`text-xs ${costObjectTypeColors[item.type]}`}>
                          {costObjectTypeLabels[item.type]}
                        </Badge>
                        {item.is_final_target && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            최종대상
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {item.level} • 단위원가 {item.cost_per_unit.toLocaleString()}원
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {item.total_cost.toLocaleString()}원
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getEfficiencyColor(item.efficiency_score)}>
                          효율성 {item.efficiency_score}점
                        </Badge>
                        <Badge variant={item.variance > 0 ? "destructive" : "default"}>
                          <span className={getVarianceColor(item.variance)}>
                            {item.variance > 0 ? "+" : ""}{item.variance_percent.toFixed(1)}%
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Cost Analysis */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">원가 분석</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border">
                        <div className="text-sm font-medium">직접비</div>
                        <div className="text-lg font-semibold text-green-600">
                          {item.direct_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.direct_cost / item.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {((item.direct_cost / item.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border">
                        <div className="text-sm font-medium">간접비</div>
                        <div className="text-lg font-semibold text-orange-600">
                          {item.indirect_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(item.indirect_cost / item.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {((item.indirect_cost / item.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                        <div className="text-sm font-medium">예산 대비</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold">
                            {item.budget.toLocaleString()}원
                          </div>
                          {item.variance > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <Progress 
                          value={(item.total_cost / item.budget) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          달성률 {((item.total_cost / item.budget) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border">
                        <div className="text-sm font-medium">벤치마크</div>
                        <div className={`text-lg font-semibold ${getBenchmarkColor(item.benchmark_comparison)}`}>
                          {item.benchmark_comparison.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.benchmark_comparison <= 1.0 ? "업계 평균 이하" : "업계 평균 초과"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Distribution */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      활동별 원가 배분
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

                  {/* Department Distribution */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      부서별 원가 배분
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.departments.map((dept) => (
                        <div key={dept.department_id} className="p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{dept.department_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {dept.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="font-semibold text-primary">
                            {dept.cost.toLocaleString()}원
                          </div>
                          <Progress value={dept.percentage} className="h-2" />
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
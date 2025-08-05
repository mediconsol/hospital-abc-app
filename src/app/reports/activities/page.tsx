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
  Activity,
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
  Clock,
  Target,
  Building2,
  Percent
} from "lucide-react"
import { mockActivities } from "@/lib/mock-data"

// 활동별 원가 데이터 타입
interface ActivityCost {
  activity_id: string
  activity_name: string
  activity_code: string
  category: string
  total_cost: number
  direct_cost: number
  indirect_cost: number
  total_hours: number
  cost_per_hour: number
  employee_count: number
  department_count: number
  budget: number
  variance: number
  variance_percent: number
  efficiency_score: number
  departments: {
    department_id: string
    department_name: string
    cost: number
    hours: number
    percentage: number
  }[]
  cost_drivers: {
    driver_name: string
    cost: number
    percentage: number
  }[]
}

// 더미 데이터
const mockActivityCosts: ActivityCost[] = [
  {
    activity_id: "1",
    activity_name: "진료활동",
    activity_code: "ACT001",
    category: "직접활동",
    total_cost: 120000000,
    direct_cost: 85000000,
    indirect_cost: 35000000,
    total_hours: 2450,
    cost_per_hour: 48980,
    employee_count: 15,
    department_count: 3,
    budget: 115000000,
    variance: 5000000,
    variance_percent: 4.3,
    efficiency_score: 85,
    departments: [
      { department_id: "11", department_name: "내과", cost: 35000000, hours: 720, percentage: 29.2 },
      { department_id: "12", department_name: "외과", cost: 35000000, hours: 680, percentage: 29.2 },
      { department_id: "13", department_name: "영상의학과", cost: 8000000, hours: 160, percentage: 6.7 },
      { department_id: "21", department_name: "간호부", cost: 42000000, hours: 890, percentage: 35.0 }
    ],
    cost_drivers: [
      { driver_name: "환자 수", cost: 70000000, percentage: 58.3 },
      { driver_name: "진료시간", cost: 30000000, percentage: 25.0 },
      { driver_name: "의료진 수", cost: 20000000, percentage: 16.7 }
    ]
  },
  {
    activity_id: "2",
    activity_name: "간호활동",
    activity_code: "ACT002",
    category: "직접활동",
    total_cost: 95000000,
    direct_cost: 72000000,
    indirect_cost: 23000000,
    total_hours: 3200,
    cost_per_hour: 29688,
    employee_count: 18,
    department_count: 4,
    budget: 90000000,
    variance: 5000000,
    variance_percent: 5.6,
    efficiency_score: 78,
    departments: [
      { department_id: "21", department_name: "간호부", cost: 42000000, hours: 1400, percentage: 44.2 },
      { department_id: "11", department_name: "내과", cost: 5000000, hours: 200, percentage: 5.3 },
      { department_id: "12", department_name: "외과", cost: 13000000, hours: 520, percentage: 13.7 },
      { department_id: "13", department_name: "영상의학과", cost: 35000000, hours: 1080, percentage: 36.8 }
    ],
    cost_drivers: [
      { driver_name: "입원환자 수", cost: 50000000, percentage: 52.6 },
      { driver_name: "간호시간", cost: 30000000, percentage: 31.6 },
      { driver_name: "간호사 수", cost: 15000000, percentage: 15.8 }
    ]
  },
  {
    activity_id: "3",
    activity_name: "영상촬영",
    activity_code: "ACT003",
    category: "직접활동",
    total_cost: 68000000,
    direct_cost: 45000000,
    indirect_cost: 23000000,
    total_hours: 1850,
    cost_per_hour: 36757,
    employee_count: 8,
    department_count: 2,
    budget: 65000000,
    variance: 3000000,
    variance_percent: 4.6,
    efficiency_score: 88,
    departments: [
      { department_id: "13", department_name: "영상의학과", cost: 28000000, hours: 760, percentage: 41.1 },
      { department_id: "12", department_name: "외과", cost: 40000000, hours: 1090, percentage: 58.9 }
    ],
    cost_drivers: [
      { driver_name: "촬영건수", cost: 40000000, percentage: 58.8 },
      { driver_name: "장비가동시간", cost: 18000000, percentage: 26.5 },
      { driver_name: "기사 수", cost: 10000000, percentage: 14.7 }
    ]
  },
  {
    activity_id: "4",
    activity_name: "검체검사",
    activity_code: "ACT004",
    category: "지원활동",
    total_cost: 45000000,
    direct_cost: 32000000,
    indirect_cost: 13000000,
    total_hours: 1200,
    cost_per_hour: 37500,
    employee_count: 6,
    department_count: 2,
    budget: 42000000,
    variance: 3000000,
    variance_percent: 7.1,
    efficiency_score: 82,
    departments: [
      { department_id: "11", department_name: "내과", cost: 15000000, hours: 400, percentage: 33.3 },
      { department_id: "12", department_name: "외과", cost: 30000000, hours: 800, percentage: 66.7 }
    ],
    cost_drivers: [
      { driver_name: "검사건수", cost: 25000000, percentage: 55.6 },
      { driver_name: "검사시간", cost: 12000000, percentage: 26.7 },
      { driver_name: "검사실 수", cost: 8000000, percentage: 17.8 }
    ]
  },
  {
    activity_id: "5",
    activity_name: "원무활동",
    activity_code: "ACT005", 
    category: "지원활동",
    total_cost: 62000000,
    direct_cost: 45000000,
    indirect_cost: 17000000,
    total_hours: 2100,
    cost_per_hour: 29524,
    employee_count: 12,
    department_count: 5,
    budget: 58000000,
    variance: 4000000,
    variance_percent: 6.9,
    efficiency_score: 75,
    departments: [
      { department_id: "311", department_name: "원무팀", cost: 20000000, hours: 680, percentage: 32.4 },
      { department_id: "11", department_name: "내과", cost: 8000000, hours: 270, percentage: 12.9 },
      { department_id: "12", department_name: "외과", cost: 13000000, hours: 440, percentage: 21.0 },
      { department_id: "21", department_name: "간호부", cost: 5000000, hours: 170, percentage: 8.1 },
      { department_id: "321", department_name: "회계팀", cost: 16000000, hours: 540, percentage: 25.7 }
    ],
    cost_drivers: [
      { driver_name: "환자 수", cost: 35000000, percentage: 56.5 },
      { driver_name: "접수건수", cost: 15000000, percentage: 24.2 },
      { driver_name: "직원 수", cost: 12000000, percentage: 19.4 }
    ]
  },
  {
    activity_id: "6",
    activity_name: "수술활동",
    activity_code: "ACT006",
    category: "직접활동",
    total_cost: 65000000,
    direct_cost: 48000000,
    indirect_cost: 17000000,
    total_hours: 950,
    cost_per_hour: 68421,
    employee_count: 8,
    department_count: 1,
    budget: 62000000,
    variance: 3000000,
    variance_percent: 4.8,
    efficiency_score: 90,
    departments: [
      { department_id: "12", department_name: "외과", cost: 65000000, hours: 950, percentage: 100.0 }
    ],
    cost_drivers: [
      { driver_name: "수술건수", cost: 40000000, percentage: 61.5 },
      { driver_name: "수술시간", cost: 15000000, percentage: 23.1 },
      { driver_name: "의료진 수", cost: 10000000, percentage: 15.4 }
    ]
  }
]

export default function ActivityCostReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("total_cost")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterActivity, setFilterActivity] = useState("")

  // 데이터 필터링 및 정렬
  const filteredAndSortedData = mockActivityCosts
    .filter(activity => {
      if (selectedCategory !== "all" && activity.category !== selectedCategory) return false
      if (filterActivity && !activity.activity_name.includes(filterActivity)) return false
      return true
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      switch (sortBy) {
        case "total_cost":
          return (a.total_cost - b.total_cost) * multiplier
        case "cost_per_hour":
          return (a.cost_per_hour - b.cost_per_hour) * multiplier
        case "efficiency_score":
          return (a.efficiency_score - b.efficiency_score) * multiplier
        case "variance_percent":
          return (a.variance_percent - b.variance_percent) * multiplier
        default:
          return 0
      }
    })

  // 통계 계산
  const totalCost = filteredAndSortedData.reduce((sum, activity) => sum + activity.total_cost, 0)
  const totalHours = filteredAndSortedData.reduce((sum, activity) => sum + activity.total_hours, 0)
  const avgCostPerHour = totalHours > 0 ? totalCost / totalHours : 0
  const totalBudget = filteredAndSortedData.reduce((sum, activity) => sum + activity.budget, 0)
  const totalVariance = filteredAndSortedData.reduce((sum, activity) => sum + activity.variance, 0)
  const avgEfficiency = filteredAndSortedData.reduce((sum, activity) => sum + activity.efficiency_score, 0) / filteredAndSortedData.length

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "직접활동": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "지원활동": return "bg-green-500/10 text-green-600 border-green-500/20"
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600"
    if (variance < 0) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">활동별 원가 리포트</h1>
        <p className="text-muted-foreground">
          각 활동의 원가 정보와 효율성을 분석합니다.
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <Label htmlFor="category">활동분류</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="직접활동">직접활동</SelectItem>
                  <SelectItem value="지원활동">지원활동</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">활동명</Label>
              <Input
                id="activity"
                placeholder="활동명 검색"
                value={filterActivity}
                onChange={(e) => setFilterActivity(e.target.value)}
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
                  <SelectItem value="cost_per_hour">시간당 원가</SelectItem>
                  <SelectItem value="efficiency_score">효율성 점수</SelectItem>
                  <SelectItem value="variance_percent">예산차이율</SelectItem>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
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
              {filteredAndSortedData.length}개 활동 합계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              총 투입시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalHours.toLocaleString()}시간
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              평균 {Math.round(totalHours / filteredAndSortedData.length)}시간/활동
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              시간당 평균 원가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(avgCostPerHour).toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              시간당 평균 원가
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
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
      </div>

      {/* Activity List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            활동별 원가 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAndSortedData.map((activity) => (
            <Card key={activity.activity_id} className="border-l-4 border-l-blue-500/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Activity Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{activity.activity_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {activity.activity_code}
                        </Badge>
                        <Badge variant="secondary" className={getCategoryColor(activity.category)}>
                          {activity.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.total_hours}시간 • {activity.employee_count}명 참여 • {activity.department_count}개 부서
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {activity.total_cost.toLocaleString()}원
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getEfficiencyColor(activity.efficiency_score)}>
                          효율성 {activity.efficiency_score}점
                        </Badge>
                        <Badge variant={activity.variance > 0 ? "destructive" : "default"}>
                          <span className={getVarianceColor(activity.variance)}>
                            {activity.variance > 0 ? "+" : ""}{activity.variance_percent.toFixed(1)}%
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">원가 분석</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border">
                        <div className="text-sm font-medium">직접비</div>
                        <div className="text-lg font-semibold text-green-600">
                          {activity.direct_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(activity.direct_cost / activity.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {((activity.direct_cost / activity.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border">
                        <div className="text-sm font-medium">간접비</div>
                        <div className="text-lg font-semibold text-orange-600">
                          {activity.indirect_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(activity.indirect_cost / activity.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {((activity.indirect_cost / activity.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                        <div className="text-sm font-medium">시간당 원가</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {activity.cost_per_hour.toLocaleString()}원
                        </div>
                        <div className="text-xs text-muted-foreground">
                          총 {activity.total_hours}시간 투입
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border">
                        <div className="text-sm font-medium">예산 대비</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold">
                            {activity.budget.toLocaleString()}원
                          </div>
                          {activity.variance > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <Progress 
                          value={(activity.total_cost / activity.budget) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          달성률 {((activity.total_cost / activity.budget) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Distribution */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      부서별 배분 현황
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {activity.departments.map((dept) => (
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
                          <div className="text-xs text-muted-foreground">
                            투입시간: {dept.hours}시간
                          </div>
                          <Progress value={dept.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Drivers */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      원가동인 분석
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activity.cost_drivers.map((driver, index) => (
                        <div key={index} className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{driver.driver_name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {driver.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="font-semibold text-amber-700 dark:text-amber-400">
                            {driver.cost.toLocaleString()}원
                          </div>
                          <Progress value={driver.percentage} className="h-2" />
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
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
  Building2,
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
  FileText,
  Eye,
  Percent,
  Activity
} from "lucide-react"
import { mockEmployees, getDepartmentsByHospitalAndPeriod } from "@/lib/mock-data"

// 부서별 원가 데이터 타입
interface DepartmentCost {
  department_id: string
  department_name: string
  parent_department?: string
  level: number
  direct_cost: number
  indirect_cost: number
  total_cost: number
  employee_count: number
  cost_per_employee: number
  budget: number
  variance: number
  variance_percent: number
  activities: {
    activity_id: string
    activity_name: string
    cost: number
    percentage: number
  }[]
}

// 더미 데이터
const mockDepartmentCosts: DepartmentCost[] = [
  {
    department_id: "11",
    department_name: "내과",
    parent_department: "진료부",
    level: 2,
    direct_cost: 45000000,
    indirect_cost: 18000000,
    total_cost: 63000000,
    employee_count: 8,
    cost_per_employee: 7875000,
    budget: 60000000,
    variance: 3000000,
    variance_percent: 5.0,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 35000000, percentage: 55.6 },
      { activity_id: "4", activity_name: "검체검사", cost: 15000000, percentage: 23.8 },
      { activity_id: "5", activity_name: "원무활동", cost: 8000000, percentage: 12.7 },
      { activity_id: "2", activity_name: "간호활동", cost: 5000000, percentage: 7.9 }
    ]
  },
  {
    department_id: "12",
    department_name: "외과",
    parent_department: "진료부",
    level: 2,
    direct_cost: 52000000,
    indirect_cost: 21000000,
    total_cost: 73000000,
    employee_count: 6,
    cost_per_employee: 12166667,
    budget: 70000000,
    variance: 3000000,
    variance_percent: 4.3,
    activities: [
      { activity_id: "1", activity_name: "진료활동", cost: 35000000, percentage: 47.9 },
      { activity_id: "6", activity_name: "수술활동", cost: 25000000, percentage: 34.2 },
      { activity_id: "2", activity_name: "간호활동", cost: 13000000, percentage: 17.8 }
    ]
  },
  {
    department_id: "13",
    department_name: "영상의학과",
    parent_department: "진료부",
    level: 2,
    direct_cost: 28000000,
    indirect_cost: 12000000,
    total_cost: 40000000,
    employee_count: 3,
    cost_per_employee: 13333333,
    budget: 38000000,
    variance: 2000000,
    variance_percent: 5.3,
    activities: [
      { activity_id: "3", activity_name: "영상촬영", cost: 28000000, percentage: 70.0 },
      { activity_id: "1", activity_name: "진료활동", cost: 8000000, percentage: 20.0 },
      { activity_id: "7", activity_name: "장비관리", cost: 4000000, percentage: 10.0 }
    ]
  },
  {
    department_id: "21",
    department_name: "간호부",
    parent_department: "간호본부",
    level: 1,
    direct_cost: 38000000,
    indirect_cost: 15000000,
    total_cost: 53000000,
    employee_count: 4,
    cost_per_employee: 13250000,
    budget: 50000000,
    variance: 3000000,
    variance_percent: 6.0,
    activities: [
      { activity_id: "2", activity_name: "간호활동", cost: 42000000, percentage: 79.2 },
      { activity_id: "8", activity_name: "교육활동", cost: 6000000, percentage: 11.3 },
      { activity_id: "5", activity_name: "원무활동", cost: 5000000, percentage: 9.4 }
    ]
  },
  {
    department_id: "311",
    department_name: "원무팀",
    parent_department: "관리본부",
    level: 2,
    direct_cost: 18000000,
    indirect_cost: 7000000,
    total_cost: 25000000,
    employee_count: 3,
    cost_per_employee: 8333333,
    budget: 24000000,
    variance: 1000000,
    variance_percent: 4.2,
    activities: [
      { activity_id: "5", activity_name: "원무활동", cost: 20000000, percentage: 80.0 },
      { activity_id: "9", activity_name: "보험청구", cost: 3000000, percentage: 12.0 },
      { activity_id: "10", activity_name: "통계관리", cost: 2000000, percentage: 8.0 }
    ]
  },
  {
    department_id: "321",
    department_name: "회계팀",
    parent_department: "관리본부",
    level: 2,
    direct_cost: 15000000,
    indirect_cost: 6000000,
    total_cost: 21000000,
    employee_count: 3,
    cost_per_employee: 7000000,
    budget: 20000000,
    variance: 1000000,
    variance_percent: 5.0,
    activities: [
      { activity_id: "11", activity_name: "회계업무", cost: 16000000, percentage: 76.2 },
      { activity_id: "10", activity_name: "통계관리", cost: 3000000, percentage: 14.3 },
      { activity_id: "5", activity_name: "원무활동", cost: 2000000, percentage: 9.5 }
    ]
  }
]

export default function DepartmentCostReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("total_cost")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterDepartment, setFilterDepartment] = useState("")

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")

  // 데이터 필터링 및 정렬
  const filteredAndSortedData = mockDepartmentCosts
    .filter(dept => {
      if (selectedLevel !== "all" && dept.level.toString() !== selectedLevel) return false
      if (filterDepartment && !dept.department_name.includes(filterDepartment)) return false
      return true
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      switch (sortBy) {
        case "total_cost":
          return (a.total_cost - b.total_cost) * multiplier
        case "employee_count":
          return (a.employee_count - b.employee_count) * multiplier
        case "cost_per_employee":
          return (a.cost_per_employee - b.cost_per_employee) * multiplier
        case "variance_percent":
          return (a.variance_percent - b.variance_percent) * multiplier
        default:
          return 0
      }
    })

  // 통계 계산
  const totalCost = filteredAndSortedData.reduce((sum, dept) => sum + dept.total_cost, 0)
  const totalEmployees = filteredAndSortedData.reduce((sum, dept) => sum + dept.employee_count, 0)
  const avgCostPerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0
  const totalBudget = filteredAndSortedData.reduce((sum, dept) => sum + dept.budget, 0)
  const totalVariance = filteredAndSortedData.reduce((sum, dept) => sum + dept.variance, 0)
  const avgVariancePercent = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600"
    if (variance < 0) return "text-green-600" 
    return "text-gray-600"
  }

  const getVarianceBadgeVariant = (variance: number) => {
    if (Math.abs(variance) > 2000000) return "destructive"
    if (Math.abs(variance) > 1000000) return "secondary"
    return "outline"
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">부서별 원가 리포트</h1>
        <p className="text-muted-foreground">
          각 부서의 원가 정보와 예산 대비 실적을 분석합니다.
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
              <Label htmlFor="level">부서레벨</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="레벨 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="1">1레벨 (본부)</SelectItem>
                  <SelectItem value="2">2레벨 (팀/과)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서명</Label>
              <Input
                id="department"
                placeholder="부서명 검색"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
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
                  <SelectItem value="employee_count">직원 수</SelectItem>
                  <SelectItem value="cost_per_employee">인당 원가</SelectItem>
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
              {filteredAndSortedData.length}개 부서 합계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              총 직원 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalEmployees}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              평균 {Math.round(totalEmployees / filteredAndSortedData.length * 10) / 10}명/부서
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              인당 평균 원가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(avgCostPerEmployee).toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              직원 1인당 평균 원가
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              예산 차이율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
              {avgVariancePercent.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalVariance > 0 ? "예산 초과" : "예산 절약"} {Math.abs(totalVariance).toLocaleString()}원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            부서별 원가 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAndSortedData.map((dept) => (
            <Card key={dept.department_id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Department Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{dept.department_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {dept.parent_department}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Level {dept.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        직원 {dept.employee_count}명 • 인당 {dept.cost_per_employee.toLocaleString()}원
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {dept.total_cost.toLocaleString()}원
                      </div>
                      <Badge variant={getVarianceBadgeVariant(dept.variance)} className="mt-1">
                        <span className={getVarianceColor(dept.variance)}>
                          {dept.variance > 0 ? "+" : ""}{dept.variance_percent.toFixed(1)}%
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">원가 구성</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                        <div className="text-sm font-medium">직접비</div>
                        <div className="text-lg font-semibold text-green-600">
                          {dept.direct_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(dept.direct_cost / dept.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          전체 {((dept.direct_cost / dept.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                        <div className="text-sm font-medium">간접비</div>
                        <div className="text-lg font-semibold text-orange-600">
                          {dept.indirect_cost.toLocaleString()}원
                        </div>
                        <Progress 
                          value={(dept.indirect_cost / dept.total_cost) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          전체 {((dept.indirect_cost / dept.total_cost) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                        <div className="text-sm font-medium">예산 대비</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold">
                            {dept.budget.toLocaleString()}원
                          </div>
                          {dept.variance > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <Progress 
                          value={(dept.total_cost / dept.budget) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          달성률 {((dept.total_cost / dept.budget) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      주요 활동별 원가 배분
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {dept.activities.map((activity) => (
                        <div key={activity.activity_id} className="p-3 bg-accent/20 rounded-lg border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{activity.activity_name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activity.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="font-semibold text-primary">
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
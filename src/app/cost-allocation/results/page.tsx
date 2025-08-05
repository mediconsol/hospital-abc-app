"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  FileText,
  TrendingUp,
  Calculator,
  DollarSign,
  Activity,
  Building2,
  Users,
  Clock,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { getDepartmentsByHospitalAndPeriod, mockActivities } from "@/lib/mock-data"
import { allocationEngine, AllocationResult } from "@/lib/allocation-engine"
import { AllocationStage, allocationStageLabels } from "@/lib/allocation-data"

interface CostAllocationResult {
  id: string
  execution_id: string
  activity_id: string
  department_id: string
  total_cost: number
  unit_cost: number
  quantity: number
  revenue: number
  profit: number
  profit_margin: number
  execution_date: string
  period: string
  month: number
}

// Mock cost allocation results
const mockResults: CostAllocationResult[] = [
  {
    id: '1',
    execution_id: 'exec_20250101_001',
    activity_id: '1',
    department_id: '11',
    total_cost: 2175000,
    unit_cost: 15800,
    quantity: 137,
    revenue: 2400000,
    profit: 225000,
    profit_margin: 9.4,
    execution_date: '2025-01-01T10:30:00Z',
    period: '2025년',
    month: 1
  },
  {
    id: '2',
    execution_id: 'exec_20250101_001',
    activity_id: '2',
    department_id: '11',
    total_cost: 1845000,
    unit_cost: 8200,
    quantity: 225,
    revenue: 2100000,
    profit: 255000,
    profit_margin: 12.1,
    execution_date: '2025-01-01T10:30:00Z',
    period: '2025년',
    month: 1
  },
  {
    id: '3',
    execution_id: 'exec_20250101_001',
    activity_id: '3',
    department_id: '13',
    total_cost: 1950000,
    unit_cost: 25400,
    quantity: 77,
    revenue: 2250000,
    profit: 300000,
    profit_margin: 13.3,
    execution_date: '2025-01-01T10:30:00Z',
    period: '2025년',
    month: 1
  },
  {
    id: '4',
    execution_id: 'exec_20250101_001',
    activity_id: '4',
    department_id: '12',
    total_cost: 3250000,
    unit_cost: 118500,
    quantity: 27,
    revenue: 3800000,
    profit: 550000,
    profit_margin: 14.5,
    execution_date: '2025-01-01T10:30:00Z',
    period: '2025년',
    month: 1
  },
  {
    id: '5',
    execution_id: 'exec_20250101_001',
    activity_id: '5',
    department_id: '12',
    total_cost: 1125000,
    unit_cost: 35000,
    quantity: 32,
    revenue: 1350000,
    profit: 225000,
    profit_margin: 16.7,
    execution_date: '2025-01-01T10:30:00Z',
    period: '2025년',
    month: 1
  }
]

export default function CostAllocationResultsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025년")
  const [selectedMonth, setSelectedMonth] = useState("1")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedActivity, setSelectedActivity] = useState("all")
  const [selectedStage, setSelectedStage] = useState<AllocationStage | "all">("all")
  const [results] = useState<CostAllocationResult[]>(mockResults)
  const [activeTab, setActiveTab] = useState("results")
  const [searchTerm, setSearchTerm] = useState("")
  const [abcResults, setAbcResults] = useState<AllocationResult[]>([])
  const [showEngineResults, setShowEngineResults] = useState(false)

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const activities = mockActivities

  // Load ABC engine results
  const loadEngineResults = () => {
    const engineState = allocationEngine.getState()
    if (engineState.results.length > 0) {
      setAbcResults(engineState.results)
      setShowEngineResults(true)
    }
  }

  // Filter ABC engine results
  const filteredAbcResults = abcResults.filter(result => {
    if (selectedStage !== "all" && result.stage !== selectedStage) return false
    if (selectedDepartment !== "all") {
      // 부서 필터링 로직 (소스나 타겟에 부서 ID가 포함되어 있는지 확인)
      const deptMatch = result.source_id.includes(selectedDepartment) || 
                       result.target_id.includes(selectedDepartment)
      if (!deptMatch) return false
    }
    return true
  })

  // Filter traditional results
  const filteredResults = results.filter(result => {
    return (selectedDepartment === "all" || result.department_id === selectedDepartment) &&
           (selectedActivity === "all" || result.activity_id === selectedActivity) &&
           result.month.toString() === selectedMonth
  })

  // Calculate summary statistics
  const totalCost = filteredResults.reduce((sum, result) => sum + result.total_cost, 0)
  const totalRevenue = filteredResults.reduce((sum, result) => sum + result.revenue, 0)
  const totalProfit = filteredResults.reduce((sum, result) => sum + result.profit, 0)
  const avgProfitMargin = filteredResults.length > 0 
    ? filteredResults.reduce((sum, result) => sum + result.profit_margin, 0) / filteredResults.length 
    : 0

  // Department-wise analysis
  const deptAnalysis = departments.map(dept => {
    const deptResults = filteredResults.filter(r => r.department_id === dept.id)
    const deptCost = deptResults.reduce((sum, r) => sum + r.total_cost, 0)
    const deptRevenue = deptResults.reduce((sum, r) => sum + r.revenue, 0)
    const deptProfit = deptResults.reduce((sum, r) => sum + r.profit, 0)
    const profitMargin = deptRevenue > 0 ? (deptProfit / deptRevenue) * 100 : 0
    
    return {
      department: dept,
      cost: deptCost,
      revenue: deptRevenue,
      profit: deptProfit,
      profitMargin,
      activityCount: deptResults.length
    }
  }).filter(item => item.cost > 0).sort((a, b) => b.revenue - a.revenue)

  // Activity-wise analysis
  const activityAnalysis = activities.map(activity => {
    const actResults = filteredResults.filter(r => r.activity_id === activity.id)
    const actCost = actResults.reduce((sum, r) => sum + r.total_cost, 0)
    const actRevenue = actResults.reduce((sum, r) => sum + r.revenue, 0)
    const actProfit = actResults.reduce((sum, r) => sum + r.profit, 0)
    const profitMargin = actRevenue > 0 ? (actProfit / actRevenue) * 100 : 0
    const totalQuantity = actResults.reduce((sum, r) => sum + r.quantity, 0)
    const avgUnitCost = totalQuantity > 0 ? actCost / totalQuantity : 0
    
    return {
      activity,
      cost: actCost,
      revenue: actRevenue,
      profit: actProfit,
      profitMargin,
      quantity: totalQuantity,
      unitCost: avgUnitCost
    }
  }).filter(item => item.cost > 0).sort((a, b) => b.revenue - a.revenue)

  const getDepartmentName = (deptId: string) => {
    return departments.find(dept => dept.id === deptId)?.name || '알 수 없음'
  }

  const getActivityName = (actId: string) => {
    return activities.find(act => act.id === actId)?.name || '알 수 없음'
  }

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 15) return 'text-green-600'
    if (margin >= 10) return 'text-blue-600'
    if (margin >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProfitMarginBadge = (margin: number) => {
    if (margin >= 15) return 'bg-green-100 text-green-800'
    if (margin >= 10) return 'bg-blue-100 text-blue-800'
    if (margin >= 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const months = [
    { value: "1", label: "1월" },
    { value: "2", label: "2월" },
    { value: "3", label: "3월" },
    { value: "4", label: "4월" },
    { value: "5", label: "5월" },
    { value: "6", label: "6월" },
    { value: "7", label: "7월" },
    { value: "8", label: "8월" },
    { value: "9", label: "9월" },
    { value: "10", label: "10월" },
    { value: "11", label: "11월" },
    { value: "12", label: "12월" },
  ]

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">원가배분 결과 조회</h1>
        <p className="text-muted-foreground">
          실행된 원가배분 결과를 조회하고 분석합니다. 부서별, 활동별 수익성을 확인할 수 있습니다.
        </p>
      </div>

      {/* Filter Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            조회 조건
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">기간</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025년">2025년</SelectItem>
                  <SelectItem value="2024년">2024년</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">월</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">활동</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 활동" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 활동</SelectItem>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">배분 단계</Label>
              <Select value={selectedStage} onValueChange={(value: AllocationStage | "all") => setSelectedStage(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 단계" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 단계</SelectItem>
                  <SelectItem value="rtr">RTR: 공통원가 정산</SelectItem>
                  <SelectItem value="rta">RTA: 활동원가 전환</SelectItem>
                  <SelectItem value="ata1">ATA1: 자기부서 지원활동</SelectItem>
                  <SelectItem value="ata2">ATA2: 타부서 지원활동</SelectItem>
                  <SelectItem value="atc">ATC: 활동원가 배부</SelectItem>
                  <SelectItem value="rtc">RTC: 자원 직접배부</SelectItem>
                  <SelectItem value="etc">ETC: 비용 직접귀속</SelectItem>
                  <SelectItem value="xtc">XTC: 수익 직접귀속</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="결과 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>작업</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={loadEngineResults}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  ABC결과 로드
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  내보내기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 원가</p>
                <p className="text-2xl font-bold text-primary">
                  ₩{totalCost.toLocaleString()}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 수익</p>
                <p className="text-2xl font-bold text-green-600">
                  ₩{totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">순이익</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₩{totalProfit.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">평균 수익률</p>
                <p className={`text-2xl font-bold ${getProfitMarginColor(avgProfitMargin)}`}>
                  {avgProfitMargin.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">세부 결과</TabsTrigger>
          <TabsTrigger value="abc-results">8단계 ABC 결과</TabsTrigger>
          <TabsTrigger value="department">부서별 분석</TabsTrigger>
          <TabsTrigger value="activity">활동별 분석</TabsTrigger>
        </TabsList>

        {/* Detailed Results Tab */}
        <TabsContent value="results" className="flex-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                원가배분 상세 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium text-lg">
                            {getDepartmentName(result.department_id)} - {getActivityName(result.activity_id)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            실행 ID: {result.execution_id} • {result.execution_date.split('T')[0]}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getProfitMarginBadge(result.profit_margin)}>
                            수익률 {result.profit_margin.toFixed(1)}%
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {result.quantity}건
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">총 원가</span>
                          <div className="font-semibold text-primary">
                            ₩{result.total_cost.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">단위원가</span>
                          <div className="font-semibold">
                            ₩{result.unit_cost.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">수익</span>
                          <div className="font-semibold text-green-600">
                            ₩{result.revenue.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">순이익</span>
                          <div className={`font-semibold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₩{result.profit.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">수익률</span>
                          <div className={`font-semibold ${getProfitMarginColor(result.profit_margin)}`}>
                            {result.profit_margin.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          {result.period} {result.month}월 결과
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          상세보기
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <div>조회 조건에 해당하는 결과가 없습니다</div>
                    <div className="text-sm mt-1">필터를 조정하거나 원가배분을 먼저 실행해주세요</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABC Engine Results Tab */}
        <TabsContent value="abc-results" className="flex-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  8단계 ABC 배분 결과
                </div>
                <div className="flex items-center gap-2">
                  {showEngineResults ? (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {abcResults.length}건 로드됨
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      ABC 엔진 결과 없음
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showEngineResults && filteredAbcResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredAbcResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium text-lg">
                            {result.source_type === 'department' ? '부서' : 
                             result.source_type === 'activity' ? '활동' : 
                             result.source_type === 'account' ? '계정' : '원가대상'}: {result.source_id}
                            <span className="mx-2">→</span>
                            {result.target_type === 'department' ? '부서' : 
                             result.target_type === 'activity' ? '활동' : 
                             result.target_type === 'account' ? '계정' : '원가대상'}: {result.target_id}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            배분 ID: {result.id} • {new Date(result.execution_time).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {allocationStageLabels[result.stage]}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            비율: {(result.driver_ratio * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">배분 금액</span>
                          <div className="font-semibold text-primary">
                            ₩{result.amount.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">드라이버</span>
                          <div className="font-semibold">
                            {result.driver_id}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">계산 방법</span>
                          <div className="font-semibold">
                            {result.calculation_method}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">배분 비율</span>
                          <div className="font-semibold text-green-600">
                            {(result.driver_ratio * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {result.notes && (
                        <div className="pt-2 border-t text-sm text-muted-foreground">
                          {result.notes}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          {allocationStageLabels[result.stage]} 단계 결과
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          상세보기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <div className="text-lg font-medium mb-2">
                    {showEngineResults ? '조회 조건에 맞는 ABC 결과가 없습니다' : 'ABC 엔진 결과가 없습니다'}
                  </div>
                  <div className="text-sm">
                    {showEngineResults ? 
                      '필터 조건을 조정해주세요' : 
                      'ABC 배분을 먼저 실행하고 결과를 로드해주세요'
                    }
                  </div>
                  {!showEngineResults && (
                    <Button 
                      onClick={loadEngineResults} 
                      className="mt-4"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      ABC 결과 로드
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stage-wise Summary */}
          {showEngineResults && abcResults.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  단계별 배분 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'] as AllocationStage[]).map((stage) => {
                    const stageResults = abcResults.filter(r => r.stage === stage)
                    const stageTotal = stageResults.reduce((sum, r) => sum + r.amount, 0)
                    
                    return (
                      <div key={stage} className="text-center p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">
                          {allocationStageLabels[stage]}
                        </div>
                        <div className="font-semibold text-primary">
                          {stageResults.length}건
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ₩{stageTotal.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Department Analysis Tab */}
        <TabsContent value="department" className="flex-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                부서별 수익성 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptAnalysis.map((item, index) => (
                  <div key={item.department.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-medium text-lg">{item.department.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.activityCount}개 활동
                        </div>
                      </div>
                      <Badge className={getProfitMarginBadge(item.profitMargin)}>
                        수익률 {item.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">원가</span>
                        <div className="font-semibold text-primary">
                          ₩{item.cost.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">수익</span>
                        <div className="font-semibold text-green-600">
                          ₩{item.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">순이익</span>
                        <div className={`font-semibold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₩{item.profit.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Analysis Tab */}
        <TabsContent value="activity" className="flex-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                활동별 원가 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityAnalysis.map((item, index) => (
                  <div key={item.activity.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-medium text-lg">{item.activity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.activity.code} • {item.quantity}건
                        </div>
                      </div>
                      <Badge className={getProfitMarginBadge(item.profitMargin)}>
                        수익률 {item.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">총 원가</span>
                        <div className="font-semibold text-primary">
                          ₩{item.cost.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">단위원가</span>
                        <div className="font-semibold">
                          ₩{Math.round(item.unitCost).toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">수익</span>
                        <div className="font-semibold text-green-600">
                          ₩{item.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">순이익</span>
                        <div className={`font-semibold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₩{item.profit.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
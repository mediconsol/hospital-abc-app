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
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Calendar,
  Building2,
  Activity,
  DollarSign,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  Clock
} from "lucide-react"
import { getDepartmentsByHospitalAndPeriod, mockActivities } from "@/lib/mock-data"
import { allocationEngine, AllocationResult } from "@/lib/allocation-engine"
import { AllocationStage, allocationStageLabels } from "@/lib/allocation-data"

interface AnalysisData {
  period: string
  month: number
  total_cost: number
  total_revenue: number
  profit_margin: number
  activity_count: number
  department_count: number
}

interface TrendData {
  month: string
  cost: number
  revenue: number
  profit: number
  profitMargin: number
}

interface ComparisonData {
  department: string
  current_cost: number
  previous_cost: number
  current_revenue: number
  previous_revenue: number
  cost_variance: number
  revenue_variance: number
}

// Mock analysis data
const mockAnalysisData: AnalysisData[] = [
  { period: '2025년', month: 1, total_cost: 10420000, total_revenue: 13900000, profit_margin: 25.0, activity_count: 8, department_count: 6 },
  { period: '2024년', month: 12, total_cost: 9880000, total_revenue: 13200000, profit_margin: 25.2, activity_count: 8, department_count: 6 },
  { period: '2024년', month: 11, total_cost: 9650000, total_revenue: 12800000, profit_margin: 24.6, activity_count: 8, department_count: 6 },
]

const mockTrendData: TrendData[] = [
  { month: '2024-09', cost: 9200000, revenue: 12100000, profit: 2900000, profitMargin: 24.0 },
  { month: '2024-10', cost: 9400000, revenue: 12400000, profit: 3000000, profitMargin: 24.2 },
  { month: '2024-11', cost: 9650000, revenue: 12800000, profit: 3150000, profitMargin: 24.6 },
  { month: '2024-12', cost: 9880000, revenue: 13200000, profit: 3320000, profitMargin: 25.2 },
  { month: '2025-01', cost: 10420000, revenue: 13900000, profit: 3480000, profitMargin: 25.0 },
]

const mockComparisonData: ComparisonData[] = [
  {
    department: '내과',
    current_cost: 4125000,
    previous_cost: 3900000,
    current_revenue: 4500000,
    previous_revenue: 4200000,
    cost_variance: 5.8,
    revenue_variance: 7.1
  },
  {
    department: '외과',
    current_cost: 3175000,
    previous_cost: 3250000,
    current_revenue: 5150000,
    previous_revenue: 4980000,
    cost_variance: -2.3,
    revenue_variance: 3.4
  },
  {
    department: '영상의학과',
    current_cost: 1950000,
    previous_cost: 1850000,
    current_revenue: 2250000,
    previous_revenue: 2100000,
    cost_variance: 5.4,
    revenue_variance: 7.1
  },
  {
    department: '검사의학과',
    current_cost: 1170000,
    previous_cost: 1180000,
    current_revenue: 2000000,
    previous_revenue: 1920000,
    cost_variance: -0.8,
    revenue_variance: 4.2
  }
]

export default function CostAllocationAnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025년")
  const [selectedMonth, setSelectedMonth] = useState("1")
  const [comparisonPeriod, setComparisonPeriod] = useState("2024년")
  const [comparisonMonth, setComparisonMonth] = useState("12")
  const [activeTab, setActiveTab] = useState("overview")
  const [analysisType, setAnalysisType] = useState("trend") // trend, comparison, efficiency
  const [abcResults, setAbcResults] = useState<AllocationResult[]>([])
  const [showAbcAnalysis, setShowAbcAnalysis] = useState(false)

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const activities = mockActivities

  // Load ABC engine results
  const loadAbcResults = () => {
    const engineState = allocationEngine.getState()
    if (engineState.results.length > 0) {
      setAbcResults(engineState.results)
      setShowAbcAnalysis(true)
    }
  }

  // ABC 단계별 분석 데이터
  const getStageAnalysis = () => {
    const stageAnalysis = (['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'] as AllocationStage[]).map(stage => {
      const stageResults = abcResults.filter(r => r.stage === stage)
      const totalAmount = stageResults.reduce((sum, r) => sum + r.amount, 0)
      const avgRatio = stageResults.length > 0 
        ? stageResults.reduce((sum, r) => sum + r.driver_ratio, 0) / stageResults.length 
        : 0
      
      return {
        stage,
        label: allocationStageLabels[stage],
        count: stageResults.length,
        totalAmount,
        avgRatio: avgRatio * 100,
        efficiency: totalAmount > 0 ? Math.min(100, (stageResults.length / totalAmount * 1000000)) : 0
      }
    })
    
    return stageAnalysis.filter(s => s.count > 0)
  }

  // 원가대상별 ABC 분석
  const getCostObjectAnalysis = () => {
    const summary = allocationEngine.getCostObjectSummary()
    return Object.entries(summary).map(([objectId, data]) => ({
      id: objectId,
      name: objectId.replace('co_', '').replace('_', ' '),
      totalCost: data.totalCost,
      totalRevenue: data.totalRevenue,
      profitMargin: data.totalRevenue > 0 ? ((data.totalRevenue - data.totalCost) / data.totalRevenue) * 100 : 0,
      resultCount: data.results.length,
      stageDistribution: data.results.reduce((acc, r) => {
        acc[r.stage] = (acc[r.stage] || 0) + r.amount
        return acc
      }, {} as Record<AllocationStage, number>)
    }))
  }

  // Get current analysis data
  const currentData = mockAnalysisData.find(d => 
    d.period === selectedPeriod && d.month.toString() === selectedMonth
  )
  
  const previousData = mockAnalysisData.find(d => 
    d.period === comparisonPeriod && d.month.toString() === comparisonMonth
  )

  // Calculate variances
  const costVariance = currentData && previousData 
    ? ((currentData.total_cost - previousData.total_cost) / previousData.total_cost) * 100 
    : 0

  const revenueVariance = currentData && previousData 
    ? ((currentData.total_revenue - previousData.total_revenue) / previousData.total_revenue) * 100 
    : 0

  const profitMarginVariance = currentData && previousData 
    ? currentData.profit_margin - previousData.profit_margin 
    : 0

  const getVarianceIcon = (variance: number) => {
    if (variance > 1) return <ArrowUp className="h-4 w-4 text-green-600" />
    if (variance < -1) return <ArrowDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getVarianceColor = (variance: number, isRevenue = false) => {
    if (isRevenue) {
      return variance > 0 ? 'text-green-600' : 'text-red-600'
    } else {
      return variance < 0 ? 'text-green-600' : 'text-red-600'
    }
  }

  const getVarianceBadge = (variance: number, isRevenue = false) => {
    if (isRevenue) {
      return variance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    } else {
      return variance < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }
  }

  const getBenchmarkStatus = (value: number, benchmark: number) => {
    const diff = ((value - benchmark) / benchmark) * 100
    if (Math.abs(diff) <= 2) return { status: 'good', color: 'text-green-600', icon: CheckCircle }
    if (Math.abs(diff) <= 5) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle }
    return { status: 'alert', color: 'text-red-600', icon: AlertTriangle }
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
        <h1 className="text-2xl font-bold text-foreground">원가배분 분석</h1>
        <p className="text-muted-foreground">
          원가배분 결과를 다각도로 분석하여 경영 의사결정을 지원합니다.
        </p>
      </div>

      {/* Analysis Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            분석 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="space-y-2">
              <Label htmlFor="analysis-type">분석 유형</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">추세 분석</SelectItem>
                  <SelectItem value="comparison">비교 분석</SelectItem>
                  <SelectItem value="efficiency">효율성 분석</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">기준 기간</Label>
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
              <Label htmlFor="month">기준 월</Label>
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
              <Label htmlFor="comp-period">비교 기간</Label>
              <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
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
              <Label htmlFor="comp-month">비교 월</Label>
              <Select value={comparisonMonth} onValueChange={setComparisonMonth}>
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
              <Label>ABC 분석</Label>
              <Button variant="outline" className="w-full" onClick={loadAbcResults}>
                <Calculator className="h-4 w-4 mr-2" />
                ABC 결과 로드
              </Button>
            </div>
            <div className="space-y-2">
              <Label>내보내기</Label>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                분석 보고서
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      {currentData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">총 원가</p>
                  <p className="text-2xl font-bold text-primary">
                    ₩{currentData.total_cost.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getVarianceIcon(costVariance)}
                    <span className={`text-sm font-medium ${getVarianceColor(costVariance)}`}>
                      {Math.abs(costVariance).toFixed(1)}%
                    </span>
                  </div>
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
                    ₩{currentData.total_revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getVarianceIcon(revenueVariance)}
                    <span className={`text-sm font-medium ${getVarianceColor(revenueVariance, true)}`}>
                      {Math.abs(revenueVariance).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">수익률</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentData.profit_margin.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getVarianceIcon(profitMarginVariance)}
                    <span className={`text-sm font-medium ${getVarianceColor(profitMarginVariance, true)}`}>
                      {Math.abs(profitMarginVariance).toFixed(1)}%p
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">활동 수</p>
                  <p className="text-2xl font-bold">
                    {currentData.activity_count}개
                  </p>
                  <div className="text-sm text-muted-foreground mt-1">
                    {currentData.department_count}개 부서
                  </div>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">분석 개요</TabsTrigger>
          <TabsTrigger value="abc-stages">8단계 ABC</TabsTrigger>
          <TabsTrigger value="trend">추세 분석</TabsTrigger>
          <TabsTrigger value="comparison">비교 분석</TabsTrigger>
          <TabsTrigger value="performance">성과 분석</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                핵심 인사이트
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">비용 효율성 개선</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    외과 부서의 원가가 전월 대비 2.3% 감소하여 비용 효율성이 개선되었습니다.
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">수익 성장</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    내과와 영상의학과의 수익이 각각 7.1% 증가하여 전체 수익 성장을 견인했습니다.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">주의 필요</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    일부 활동의 단위원가가 업계 평균을 상회하므로 원가 구조 검토가 필요합니다.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">배분 정확성</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ABC 배분법을 통해 원가배분 정확성이 향상되어 의사결정 신뢰도가 증가했습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Benchmarks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                성과 벤치마크
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">수익률</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">25.0%</span>
                      <Badge className="bg-green-100 text-green-800">
                        목표 달성
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '83%' }} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    목표: 30% | 업계 평균: 22%
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">원가 효율성</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">92점</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        우수
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '92%' }} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    목표: 95점 | 업계 평균: 85점
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">배분 정확도</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">96%</span>
                      <Badge className="bg-green-100 text-green-800">
                        탁월
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '96%' }} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    목표: 95% | 업계 평균: 88%
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">활동 가시성</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">89%</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        개선 필요
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 rounded-full h-2" style={{ width: '89%' }} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    목표: 95% | 업계 평균: 82%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABC Stages Analysis Tab */}
        <TabsContent value="abc-stages" className="flex-1 space-y-6">
          {showAbcAnalysis ? (
            <>
              {/* Stage Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    8단계 ABC 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getStageAnalysis().map((stage) => (
                      <div key={stage.stage} className="border rounded-lg p-4 space-y-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground">
                            {stage.stage.toUpperCase()}
                          </div>
                          <div className="font-semibold">{stage.label}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">배분 건수</span>
                            <span className="font-medium">{stage.count}건</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">총 금액</span>
                            <span className="font-medium text-primary">
                              ₩{stage.totalAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">평균 비율</span>
                            <span className="font-medium">
                              {stage.avgRatio.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${Math.min(100, stage.efficiency)}%` }}
                          />
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          효율성: {stage.efficiency.toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Object Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    원가대상별 ABC 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCostObjectAnalysis().map((obj) => (
                      <div key={obj.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="font-medium text-lg">{obj.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {obj.resultCount}건의 배분 결과
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge className={
                              obj.profitMargin >= 15 ? 'bg-green-100 text-green-800' :
                              obj.profitMargin >= 10 ? 'bg-blue-100 text-blue-800' :
                              obj.profitMargin >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              수익률 {obj.profitMargin.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-muted-foreground">총 원가</span>
                            <div className="font-semibold text-primary">
                              ₩{obj.totalCost.toLocaleString()}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">총 수익</span>
                            <div className="font-semibold text-green-600">
                              ₩{obj.totalRevenue.toLocaleString()}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">순이익</span>
                            <div className={`font-semibold ${obj.totalRevenue - obj.totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ₩{(obj.totalRevenue - obj.totalCost).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Stage Distribution */}
                        <div className="space-y-2">
                          <div className="text-sm font-medium">단계별 배분 분포</div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            {Object.entries(obj.stageDistribution).map(([stage, amount]) => (
                              <div key={stage} className="text-center p-2 bg-muted/30 rounded">
                                <div className="font-medium">{stage.toUpperCase()}</div>
                                <div className="text-muted-foreground">
                                  ₩{amount.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ABC Flow Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    ABC 흐름 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Resource Stage */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-center">자원 단계 (RTR/RTC)</h4>
                        <div className="space-y-2">
                          {getStageAnalysis().filter(s => ['rtr', 'rtc'].includes(s.stage)).map((stage) => (
                            <div key={stage.stage} className="p-3 bg-blue-50 rounded border">
                              <div className="font-medium text-sm">{stage.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {stage.count}건 • ₩{stage.totalAmount.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activity Stage */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-center">활동 단계 (RTA/ATA)</h4>
                        <div className="space-y-2">
                          {getStageAnalysis().filter(s => ['rta', 'ata1', 'ata2'].includes(s.stage)).map((stage) => (
                            <div key={stage.stage} className="p-3 bg-green-50 rounded border">
                              <div className="font-medium text-sm">{stage.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {stage.count}건 • ₩{stage.totalAmount.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cost Object Stage */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-center">원가대상 단계 (ATC/ETC/XTC)</h4>
                        <div className="space-y-2">
                          {getStageAnalysis().filter(s => ['atc', 'etc', 'xtc'].includes(s.stage)).map((stage) => (
                            <div key={stage.stage} className="p-3 bg-purple-50 rounded border">
                              <div className="font-medium text-sm">{stage.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {stage.count}건 • ₩{stage.totalAmount.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-blue-600">
                            {getStageAnalysis().filter(s => ['rtr', 'rtc'].includes(s.stage)).reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">자원 단계 총액</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-green-600">
                            {getStageAnalysis().filter(s => ['rta', 'ata1', 'ata2'].includes(s.stage)).reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">활동 단계 총액</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-purple-600">
                            {getStageAnalysis().filter(s => ['atc', 'etc', 'xtc'].includes(s.stage)).reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">원가대상 단계 총액</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12">
                <div className="text-center space-y-4">
                  <Calculator className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">8단계 ABC 분석을 시작하세요</h3>
                    <p className="text-muted-foreground mb-4">
                      ABC 배분 엔진의 결과를 로드하여 상세한 단계별 분석을 확인할 수 있습니다.
                    </p>
                    <Button onClick={loadAbcResults} className="mt-4">
                      <Calculator className="h-4 w-4 mr-2" />
                      ABC 결과 로드
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trend" className="flex-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                5개월 추세 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrendData.map((data, index) => (
                  <div key={data.month} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {data.month.replace('-', '년 ')}월
                      </div>
                      <Badge className={data.profitMargin >= 25 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        수익률 {data.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">원가</span>
                        <div className="font-semibold text-primary">
                          ₩{data.cost.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">수익</span>
                        <div className="font-semibold text-green-600">
                          ₩{data.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">순이익</span>
                        <div className="font-semibold text-green-600">
                          ₩{data.profit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${(data.profitMargin / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Analysis Tab */}
        <TabsContent value="comparison" className="flex-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                부서별 전월 대비 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComparisonData.map((data) => (
                  <div key={data.department} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-lg">{data.department}</div>
                      <div className="flex gap-2">
                        <Badge className={getVarianceBadge(data.cost_variance)}>
                          원가 {data.cost_variance > 0 ? '+' : ''}{data.cost_variance.toFixed(1)}%
                        </Badge>
                        <Badge className={getVarianceBadge(data.revenue_variance, true)}>
                          수익 {data.revenue_variance > 0 ? '+' : ''}{data.revenue_variance.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">원가 비교</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">현재</span>
                            <span className="font-semibold">₩{data.current_cost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">이전</span>
                            <span>₩{data.previous_cost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">차이</span>
                            <span className={getVarianceColor(data.cost_variance)}>
                              ₩{Math.abs(data.current_cost - data.previous_cost).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">수익 비교</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">현재</span>
                            <span className="font-semibold">₩{data.current_revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">이전</span>
                            <span>₩{data.previous_revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">차이</span>
                            <span className={getVarianceColor(data.revenue_variance, true)}>
                              ₩{Math.abs(data.current_revenue - data.previous_revenue).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                활동별 성과 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {activities.slice(0, 6).map((activity, index) => {
                  const performance = [95, 88, 92, 78, 85, 90][index]
                  const trend = [5.2, -2.1, 3.8, -1.5, 2.3, 4.1][index]
                  
                  return (
                    <div key={activity.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{activity.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{performance}점</span>
                          <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 ${performance >= 90 ? 'bg-green-500' : performance >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${performance}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.code} • 목표: 90점
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                효율성 지표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">원가 투명성</span>
                    <Badge className="bg-green-100 text-green-800">우수</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
                  <div className="text-sm text-muted-foreground">
                    원가 배분의 투명성과 추적 가능성 수준
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">의사결정 지원</span>
                    <Badge className="bg-blue-100 text-blue-800">양호</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
                  <div className="text-sm text-muted-foreground">
                    분석 결과의 의사결정 활용도
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">프로세스 효율</span>
                    <Badge className="bg-green-100 text-green-800">탁월</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">96%</div>
                  <div className="text-sm text-muted-foreground">
                    원가배분 프로세스의 자동화 수준
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">데이터 품질</span>
                    <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">82%</div>
                  <div className="text-sm text-muted-foreground">
                    입력 데이터의 정확성과 완성도
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
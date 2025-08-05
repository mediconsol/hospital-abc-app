"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Pause, 
  Square,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  FileText,
  TrendingUp,
  Calculator,
  DollarSign,
  Users,
  Building2
} from "lucide-react"
import { getDepartmentsByHospitalAndPeriod } from "@/lib/mock-data"
import { allocationEngine, AllocationResult, ExecutionState } from "@/lib/allocation-engine"
import { AllocationStage } from "@/lib/allocation-data"

interface ExecutionStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  startTime?: string
  endTime?: string
  duration?: number
  details?: string[]
}

const initialSteps: ExecutionStep[] = [
  {
    id: 'validation',
    name: '데이터 검증',
    description: '급여, 비용, 수익 데이터의 무결성 검사',
    status: 'pending',
    progress: 0
  },
  {
    id: 'preparation',
    name: '배분 준비',
    description: '배분 기준 및 드라이버 설정 확인',
    status: 'pending',
    progress: 0
  },
  {
    id: 'salary_allocation',
    name: '인건비 배분',
    description: '직원별 업무비율에 따른 인건비 배분',
    status: 'pending',
    progress: 0
  },
  {
    id: 'cost_allocation',
    name: '간접비 배분',
    description: '부서별 비용의 활동별 배분',
    status: 'pending',
    progress: 0
  },
  {
    id: 'revenue_mapping',
    name: '수익 매핑',
    description: '수익 데이터와 활동 매핑',
    status: 'pending',
    progress: 0
  },
  {
    id: 'calculation',
    name: '원가 계산',
    description: '활동별 단위원가 계산',
    status: 'pending',
    progress: 0
  },
  {
    id: 'report_generation',
    name: '보고서 생성',
    description: '원가배분 결과 보고서 생성',
    status: 'pending',
    progress: 0
  }
]

export default function CostAllocationExecutionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1")
  const [selectedMonth, setSelectedMonth] = useState("1")
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>(initialSteps)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [selectedMethod, setSelectedMethod] = useState("abc") // abc, traditional
  const [engineState, setEngineState] = useState<ExecutionState | null>(null)
  const [allocationResults, setAllocationResults] = useState<AllocationResult[]>([])
  const [enabledStages, setEnabledStages] = useState<AllocationStage[]>(['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'])

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  
  const overallProgress = executionSteps.reduce((sum, step) => sum + step.progress, 0) / executionSteps.length

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setExecutionLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const updateStepStatus = (stepId: string, status: ExecutionStep['status'], progress: number = 0, details?: string[]) => {
    setExecutionSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status, 
            progress,
            details,
            startTime: status === 'running' ? new Date().toISOString() : step.startTime,
            endTime: status === 'completed' || status === 'error' ? new Date().toISOString() : undefined
          }
        : step
    ))
  }

  const executeStep = async (stepIndex: number) => {
    const step = executionSteps[stepIndex]
    updateStepStatus(step.id, 'running')
    addLog(`${step.name} 시작`)

    // 단계별 실행 시뮬레이션
    for (let progress = 0; progress <= 100; progress += 10) {
      if (isPaused) {
        addLog(`${step.name} 일시정지`)
        return
      }
      
      updateStepStatus(step.id, 'running', progress)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // 단계별 세부 결과 시뮬레이션
    const stepDetails = getStepDetails(step.id)
    updateStepStatus(step.id, 'completed', 100, stepDetails)
    addLog(`${step.name} 완료`)
  }

  const getStepDetails = (stepId: string): string[] => {
    switch (stepId) {
      case 'validation':
        return [
          '급여 데이터: 15명 검증 완료',
          '비용 데이터: 45건 검증 완료',
          '수익 데이터: 128건 검증 완료',
          '업무비율 데이터: 15명 검증 완료'
        ]
      case 'preparation':
        return [
          '배분 기준: ABC 원가배분법',
          '드라이버 설정: 8개 활동',
          '부서 매핑: 6개 부서',
          '기간 설정: 2025년 1월'
        ]
      case 'salary_allocation':
        return [
          '내과: ₩4,350,000 배분',
          '외과: ₩3,750,000 배분',
          '영상의학과: ₩2,850,000 배분',
          '기타 부서: ₩2,250,000 배분'
        ]
      case 'cost_allocation':
        return [
          '재료비 배분: ₩3,450,000',
          '임차료 배분: ₩2,100,000',
          '전력비 배분: ₩890,000',
          '기타 경비: ₩1,250,000'
        ]
      case 'revenue_mapping':
        return [
          '진료 수익: ₩12,000,000',
          '검사 수익: ₩8,400,000',
          '처치 수익: ₩7,500,000',
          '수술 수익: ₩9,600,000'
        ]
      case 'calculation':
        return [
          '외래진료 단위원가: ₩15,800',
          '입원진료 단위원가: ₩8,200',
          'CT검사 단위원가: ₩25,400',
          '수술 단위원가: ₩118,500'
        ]
      case 'report_generation':
        return [
          '활동별 원가 보고서 생성',
          '부서별 수익성 분석',
          '월별 추세 분석',
          'Excel 파일 내보내기 완료'
        ]
      default:
        return []
    }
  }

  const startExecution = async () => {
    setIsExecuting(true)
    setIsPaused(false)
    setCurrentStepIndex(0)
    setExecutionLog([])
    setAllocationResults([])
    
    // 모든 단계 초기화
    setExecutionSteps(initialSteps.map(step => ({ ...step, status: 'pending', progress: 0 })))
    
    addLog('원가배분 실행 시작')

    if (selectedMethod === 'abc') {
      // ABC 엔진 사용
      try {
        addLog('ABC 배분 엔진 초기화')
        
        const stageConfigurations = {
          'rtr': { enabled: true, method: 'proportional' },
          'rta': { enabled: true, method: 'time_based' },
          'ata1': { enabled: true, method: 'activity_based' },
          'ata2': { enabled: true, method: 'cross_department' },
          'atc': { enabled: true, method: 'cost_object_allocation' },
          'rtc': { enabled: true, method: 'direct_allocation' },
          'etc': { enabled: true, method: 'direct_assignment' },
          'xtc': { enabled: true, method: 'revenue_matching' }
        }

        const result = await allocationEngine.executeAllocationWorkflow(
          enabledStages,
          stageConfigurations,
          (stage: AllocationStage, progress: number) => {
            const stageNames = {
              'rtr': 'RTR: 공통원가 정산',
              'rta': 'RTA: 활동원가 전환',
              'ata1': 'ATA1: 자기부서 지원활동',
              'ata2': 'ATA2: 타부서 지원활동',
              'atc': 'ATC: 활동원가 배부',
              'rtc': 'RTC: 자원 직접배부',
              'etc': 'ETC: 비용 직접귀속',
              'xtc': 'XTC: 수익 직접귀속'
            }
            
            if (progress === 0) {
              addLog(`${stageNames[stage]} 시작`)
            } else if (progress === 100) {
              addLog(`${stageNames[stage]} 완료`)
            }
          }
        )

        setEngineState(result)
        setAllocationResults(result.results)
        
        if (result.errors.length > 0) {
          result.errors.forEach(error => addLog(`오류: ${error}`))
        } else {
          addLog(`ABC 배분 완료 - 총 ${result.results.length}건의 배분 처리`)
          addLog(`총 배분 금액: ₩${result.total_allocated.toLocaleString()}`)
        }

      } catch (error) {
        addLog(`ABC 엔진 실행 중 오류: ${error}`)
      }
    } else {
      // 기존 전통적 방법 시뮬레이션
      for (let i = 0; i < executionSteps.length; i++) {
        if (isPaused) break
        
        setCurrentStepIndex(i)
        await executeStep(i)
        
        if (executionSteps[i].status === 'error') {
          addLog('오류로 인해 실행 중단')
          break
        }
      }
    }

    if (!isPaused) {
      addLog('원가배분 실행 완료')
      setCurrentStepIndex(-1)
    }
    
    setIsExecuting(false)
  }

  const pauseExecution = () => {
    setIsPaused(true)
    addLog('실행 일시정지')
  }

  const resumeExecution = () => {
    setIsPaused(false)
    addLog('실행 재개')
  }

  const stopExecution = () => {
    setIsExecuting(false)
    setIsPaused(false)
    setCurrentStepIndex(-1)
    addLog('실행 중단')
  }

  const resetExecution = () => {
    setExecutionSteps(initialSteps.map(step => ({ ...step, status: 'pending', progress: 0 })))
    setIsExecuting(false)
    setIsPaused(false)
    setCurrentStepIndex(-1)
    setExecutionLog([])
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
        <h1 className="text-2xl font-bold text-foreground">원가배분 실행</h1>
        <p className="text-muted-foreground">
          수집된 데이터를 바탕으로 원가배분을 실행하고 진행 상황을 모니터링합니다.
        </p>
      </div>

      {/* Execution Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            실행 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">기간</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">2025년도</SelectItem>
                  <SelectItem value="2">2024년도</SelectItem>
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
              <Label htmlFor="method">배분방법</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abc">활동기준원가배분(ABC)</SelectItem>
                  <SelectItem value="traditional">전통적 원가배분</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>실행 제어</Label>
              <div className="flex gap-2">
                {!isExecuting ? (
                  <Button onClick={startExecution} className="flex-1">
                    <Play className="h-4 w-4 mr-1" />
                    실행
                  </Button>
                ) : (
                  <>
                    {!isPaused ? (
                      <Button onClick={pauseExecution} variant="outline" className="flex-1">
                        <Pause className="h-4 w-4 mr-1" />
                        일시정지
                      </Button>
                    ) : (
                      <Button onClick={resumeExecution} variant="outline" className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        재개
                      </Button>
                    )}
                    <Button onClick={stopExecution} variant="destructive" className="flex-1">
                      <Square className="h-4 w-4 mr-1" />
                      중단
                    </Button>
                  </>
                )}
                <Button onClick={resetExecution} variant="outline" disabled={isExecuting}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  초기화
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Execution Progress */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overall Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  전체 진행률
                </div>
                <Badge variant={isExecuting ? "default" : "secondary"}>
                  {isExecuting ? "실행중" : "대기중"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>진행률</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              {currentStepIndex >= 0 && (
                <div className="text-sm text-muted-foreground">
                  현재 단계: {executionSteps[currentStepIndex]?.name}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                단계별 진행 상황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executionSteps.map((step, index) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {step.status === 'running' && (
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                        {step.status === 'error' && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        {step.status === 'pending' && (
                          <div className="h-4 w-4 rounded-full border-2 border-muted" />
                        )}
                        <div>
                          <div className="font-medium">{step.name}</div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{step.progress}%</div>
                        {step.status === 'running' && currentStepIndex === index && (
                          <div className="text-xs text-muted-foreground">실행중...</div>
                        )}
                      </div>
                    </div>
                    <Progress value={step.progress} className="h-2" />
                    {step.details && step.details.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="text-xs text-muted-foreground">
                            • {detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Execution Log and Summary */}
        <div className="space-y-4">
          {/* Summary Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                실행 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">총 부서</span>
                  <div className="font-semibold">{departments.length}개</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">배분 활동</span>
                  <div className="font-semibold">8개</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">총 직원</span>
                  <div className="font-semibold">15명</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">배분 방법</span>
                  <div className="font-semibold">
                    {selectedMethod === 'abc' ? 'ABC' : '전통적'}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">예상 총 원가</span>
                    <span className="font-semibold text-primary">₩25,450,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">예상 총 수익</span>
                    <span className="font-semibold text-green-600">₩37,500,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">예상 수익률</span>
                    <span className="font-semibold text-green-600">47.3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                실행 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-auto text-xs font-mono">
                {executionLog.length > 0 ? (
                  executionLog.map((log, index) => (
                    <div key={index} className="text-muted-foreground">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <div>실행 로그가 없습니다</div>
                    <div className="text-xs mt-1">실행을 시작하면 로그가 표시됩니다</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Allocation Results */}
          {allocationResults.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  배분 결과 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">총 배분 건수</span>
                      <div className="font-semibold">{allocationResults.length}건</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">총 배분 금액</span>
                      <div className="font-semibold text-primary">
                        ₩{allocationResults.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">단계별 결과</div>
                    <div className="space-y-1 max-h-32 overflow-auto">
                      {['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'].map((stage) => {
                        const stageResults = allocationResults.filter(r => r.stage === stage)
                        if (stageResults.length === 0) return null
                        
                        return (
                          <div key={stage} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{stage.toUpperCase()}</span>
                            <span>{stageResults.length}건</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {engineState && (
                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium mb-2">원가대상별 집계</div>
                      <div className="space-y-1 max-h-32 overflow-auto text-xs">
                        {Object.entries(allocationEngine.getCostObjectSummary()).map(([costObjectId, summary]) => (
                          <div key={costObjectId} className="flex justify-between">
                            <span className="text-muted-foreground">{costObjectId}</span>
                            <span>
                              ₩{summary.totalCost.toLocaleString()} 
                              {summary.totalRevenue > 0 && (
                                <span className="text-green-600 ml-1">
                                  (+₩{summary.totalRevenue.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
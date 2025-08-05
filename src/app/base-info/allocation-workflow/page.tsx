"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Activity,
  Building2,
  Calculator,
  Settings,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  FileText,
  GitBranch,
  Workflow,
  Eye,
  Edit2,
  Save,
  AlertCircle,
  Info
} from "lucide-react"
import { mockAllocationRules, AllocationStage, allocationStageLabels } from "@/lib/allocation-data"
import { mockDrivers } from "@/lib/driver-data"
import { mockDepartments } from "@/lib/mock-data"

// 워크플로우 단계 인터페이스
interface WorkflowStep {
  id: AllocationStage
  name: string
  description: string
  status: 'pending' | 'configuring' | 'completed' | 'error' | 'blocked'
  progress: number
  dependencies: AllocationStage[]
  rules: string[]
  validationErrors: string[]
  estimatedDuration: number // minutes
  actualDuration?: number
}

// 단계별 설정 인터페이스
interface StageConfiguration {
  stage: AllocationStage
  enabled: boolean
  method: string
  drivers: string[]
  sources: string[]
  targets: string[]
  validation_rules: string[]
  custom_parameters: Record<string, any>
  notes: string
}

// 8단계 ABC 워크플로우 정의
const abcWorkflowSteps: WorkflowStep[] = [
  {
    id: 'rtr',
    name: 'RTR: 공통원가 정산',
    description: '자원(부서)에서 자원으로 공통비용 정산',
    status: 'pending',
    progress: 0,
    dependencies: [],
    rules: ['공통비용 식별', '정산 기준 설정', '부서간 배분'],
    validationErrors: [],
    estimatedDuration: 15
  },
  {
    id: 'rta',
    name: 'RTA: 활동원가 전환',
    description: '자원에서 활동으로 원가 전환',
    status: 'pending',
    progress: 0,
    dependencies: ['rtr'],
    rules: ['활동 정의', '자원-활동 매핑', '원가 전환'],
    validationErrors: [],
    estimatedDuration: 20
  },
  {
    id: 'ata1',
    name: 'ATA1: 자기부서 지원활동',
    description: '활동에서 활동으로 자기부서 지원활동 배분',
    status: 'pending',
    progress: 0,
    dependencies: ['rta'],
    rules: ['지원활동 식별', '자기부서 배분', '활동간 매핑'],
    validationErrors: [],
    estimatedDuration: 18
  },
  {
    id: 'ata2',
    name: 'ATA2: 타부서 지원활동',
    description: '활동에서 활동으로 타부서 지원활동 배분',
    status: 'pending',
    progress: 0,
    dependencies: ['ata1'],
    rules: ['타부서 지원 식별', '부서간 배분', '활동 통합'],
    validationErrors: [],
    estimatedDuration: 25
  },
  {
    id: 'atc',
    name: 'ATC: 활동원가 배부',
    description: '활동에서 원가대상으로 배부',
    status: 'pending',
    progress: 0,
    dependencies: ['ata2'],
    rules: ['원가대상 정의', '활동-원가대상 매핑', '원가 배부'],
    validationErrors: [],
    estimatedDuration: 22
  },
  {
    id: 'rtc',
    name: 'RTC: 자원 직접배부',
    description: '자원에서 원가대상으로 직접 배부',
    status: 'pending',
    progress: 0,
    dependencies: ['rtr'],
    rules: ['직접 배부 자원 식별', '원가대상 매핑', '직접 배부'],
    validationErrors: [],
    estimatedDuration: 12
  },
  {
    id: 'etc',
    name: 'ETC: 비용 직접귀속',
    description: '비용을 원가대상에 직접 귀속',
    status: 'pending',
    progress: 0,
    dependencies: [],
    rules: ['직접비 식별', '원가대상 매핑', '직접 귀속'],
    validationErrors: [],
    estimatedDuration: 10
  },
  {
    id: 'xtc',
    name: 'XTC: 수익 직접귀속',
    description: '수익을 원가대상에 직접 귀속',
    status: 'pending',
    progress: 0,
    dependencies: [],
    rules: ['수익 식별', '원가대상 매핑', '수익 귀속'],
    validationErrors: [],
    estimatedDuration: 8
  }
]

// 기본 단계별 설정
const defaultStageConfigurations: Record<AllocationStage, StageConfiguration> = {
  rtr: {
    stage: 'rtr',
    enabled: true,
    method: 'proportional',
    drivers: ['driver_area_001', 'driver_headcount_001'],
    sources: ['공통비'],
    targets: ['부서'],
    validation_rules: ['total_100_percent', 'positive_values'],
    custom_parameters: {},
    notes: '면적과 인원수 기준으로 공통비용을 각 부서에 정산'
  },
  rta: {
    stage: 'rta',
    enabled: true,
    method: 'time_based',
    drivers: ['driver_time_001', 'driver_workload_001'],
    sources: ['부서비용'],
    targets: ['활동'],
    validation_rules: ['total_100_percent', 'activity_mapping'],
    custom_parameters: {},
    notes: '업무시간과 업무량 기준으로 부서 원가를 활동으로 전환'
  },
  ata1: {
    stage: 'ata1',
    enabled: true,
    method: 'activity_based',
    drivers: ['driver_volume_001'],
    sources: ['지원활동'],
    targets: ['주활동'],
    validation_rules: ['activity_hierarchy', 'no_circular_reference'],
    custom_parameters: {},
    notes: '동일 부서 내 지원활동을 주활동으로 배분'
  },
  ata2: {
    stage: 'ata2',
    enabled: true,
    method: 'cross_department',
    drivers: ['driver_volume_001', 'driver_service_001'],
    sources: ['부서별지원활동'],
    targets: ['타부서활동'],
    validation_rules: ['cross_dept_mapping', 'service_validation'],
    custom_parameters: {},
    notes: '타부서 지원활동을 수혜 부서 활동으로 배분'
  },
  atc: {
    stage: 'atc',
    enabled: true,
    method: 'cost_object_allocation',
    drivers: ['driver_patient_001', 'driver_procedure_001'],
    sources: ['활동원가'],
    targets: ['원가대상'],
    validation_rules: ['cost_object_coverage', 'patient_mapping'],
    custom_parameters: {},
    notes: '환자수와 진료건수 기준으로 활동원가를 원가대상에 배분'
  },
  rtc: {
    stage: 'rtc',
    enabled: true,
    method: 'direct_allocation',
    drivers: ['driver_direct_001'],
    sources: ['자원'],
    targets: ['원가대상'],
    validation_rules: ['direct_mapping', 'resource_availability'],
    custom_parameters: {},
    notes: '식별 가능한 자원을 원가대상에 직접 배분'
  },
  etc: {
    stage: 'etc',
    enabled: true,
    method: 'direct_assignment',
    drivers: [],
    sources: ['직접비'],
    targets: ['원가대상'],
    validation_rules: ['direct_cost_identification'],
    custom_parameters: {},
    notes: '직접 식별되는 비용을 해당 원가대상에 직접 귀속'
  },
  xtc: {
    stage: 'xtc',
    enabled: true,
    method: 'revenue_matching',
    drivers: [],
    sources: ['수익'],
    targets: ['원가대상'],
    validation_rules: ['revenue_matching', 'period_consistency'],
    custom_parameters: {},
    notes: '수익을 발생시킨 원가대상에 직접 귀속'
  }
}

// 단계별 설정 폼 컴포넌트
interface StageConfigFormProps {
  stage: AllocationStage
  configuration: StageConfiguration
  onSave: (config: StageConfiguration) => void
  onCancel: () => void
}

function StageConfigForm({ stage, configuration, onSave, onCancel }: StageConfigFormProps) {
  const [formData, setFormData] = useState<StageConfiguration>(configuration)

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{allocationStageLabels[stage]}</h3>
          <p className="text-sm text-muted-foreground">
            {abcWorkflowSteps.find(s => s.id === stage)?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
            <Label htmlFor="enabled">단계 활성화</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">배분 방법</Label>
            <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proportional">비례 배분</SelectItem>
                <SelectItem value="time_based">시간 기준</SelectItem>
                <SelectItem value="activity_based">활동 기준</SelectItem>
                <SelectItem value="cross_department">부서간 배분</SelectItem>
                <SelectItem value="cost_object_allocation">원가대상 배분</SelectItem>
                <SelectItem value="direct_allocation">직접 배분</SelectItem>
                <SelectItem value="direct_assignment">직접 귀속</SelectItem>
                <SelectItem value="revenue_matching">수익 매칭</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sources">배분 출발점</Label>
            <Input
              id="sources"
              value={formData.sources.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sources: e.target.value.split(',').map(s => s.trim()) 
              }))}
              placeholder="예: 부서비용, 활동원가"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targets">배분 목적지</Label>
            <Input
              id="targets"
              value={formData.targets.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                targets: e.target.value.split(',').map(t => t.trim()) 
              }))}
              placeholder="예: 활동, 원가대상"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drivers">사용 드라이버</Label>
            <div className="space-y-2 max-h-32 overflow-auto">
              {mockDrivers.filter(d => 
                (stage === 'rtr' && ['area', 'headcount'].includes(d.category)) ||
                (stage === 'rta' && ['time', 'volume'].includes(d.category)) ||
                (stage === 'atc' && ['patient', 'volume'].includes(d.category)) ||
                (['ata1', 'ata2', 'rtc'].includes(stage))
              ).map((driver) => (
                <div key={driver.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={driver.id}
                    checked={formData.drivers.includes(driver.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          drivers: [...prev.drivers, driver.id] 
                        }))
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          drivers: prev.drivers.filter(d => d !== driver.id) 
                        }))
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={driver.id} className="text-sm">
                    {driver.name} ({driver.category})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validation">검증 규칙</Label>
            <div className="space-y-2">
              {[
                'total_100_percent',
                'positive_values', 
                'activity_mapping',
                'no_circular_reference',
                'cost_object_coverage'
              ].map((rule) => (
                <div key={rule} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={rule}
                    checked={formData.validation_rules.includes(rule)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          validation_rules: [...prev.validation_rules, rule] 
                        }))
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          validation_rules: prev.validation_rules.filter(r => r !== rule) 
                        }))
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={rule} className="text-sm">
                    {rule.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">설정 메모</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="이 단계의 특별한 설정이나 주의사항을 기록하세요..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  )
}

export default function AllocationWorkflowPage() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(abcWorkflowSteps)
  const [stageConfigurations, setStageConfigurations] = useState<Record<AllocationStage, StageConfiguration>>(defaultStageConfigurations)
  const [currentStep, setCurrentStep] = useState<AllocationStage | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selectedTab, setSelectedTab] = useState("workflow")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])

  // 워크플로우 검증
  useEffect(() => {
    validateWorkflow()
  }, [stageConfigurations])

  const validateWorkflow = () => {
    const updatedSteps = workflowSteps.map(step => {
      const config = stageConfigurations[step.id]
      const errors: string[] = []

      // 기본 검증
      if (config.enabled) {
        if (config.drivers.length === 0 && !['etc', 'xtc'].includes(step.id)) {
          errors.push('드라이버가 선택되지 않았습니다.')
        }
        if (config.sources.length === 0) {
          errors.push('배분 출발점이 설정되지 않았습니다.')
        }
        if (config.targets.length === 0) {
          errors.push('배분 목적지가 설정되지 않았습니다.')
        }
      }

      // 의존성 검증
      const blockedByDependencies = step.dependencies.some(dep => {
        const depConfig = stageConfigurations[dep]
        return !depConfig.enabled || workflowSteps.find(s => s.id === dep)?.status === 'error'
      })

      let status: WorkflowStep['status'] = 'pending'
      if (errors.length > 0) {
        status = 'error'
      } else if (blockedByDependencies) {
        status = 'blocked'
      } else if (config.enabled && errors.length === 0) {
        status = 'completed'
      }

      return {
        ...step,
        status,
        validationErrors: errors,
        progress: status === 'completed' ? 100 : status === 'error' ? 0 : 50
      }
    })

    setWorkflowSteps(updatedSteps)
  }

  const handleStageConfig = (stage: AllocationStage) => {
    setCurrentStep(stage)
    setIsConfiguring(true)
  }

  const handleSaveConfiguration = (config: StageConfiguration) => {
    setStageConfigurations(prev => ({
      ...prev,
      [config.stage]: config
    }))
    setIsConfiguring(false)
    setCurrentStep(null)
  }

  const handleCancelConfiguration = () => {
    setIsConfiguring(false)
    setCurrentStep(null)
  }

  const startWorkflowExecution = async () => {
    setIsExecuting(true)
    setExecutionLog([])
    
    const enabledSteps = workflowSteps.filter(step => 
      stageConfigurations[step.id].enabled && step.status === 'completed'
    )

    for (const step of enabledSteps) {
      setExecutionLog(prev => [...prev, `${step.name} 실행 시작...`])
      
      // 실행 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setExecutionLog(prev => [...prev, `${step.name} 실행 완료`])
    }
    
    setExecutionLog(prev => [...prev, '워크플로우 실행 완료'])
    setIsExecuting(false)
  }

  const getStepStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'blocked':
        return <Clock className="h-5 w-5 text-amber-600" />
      case 'configuring':
        return <Settings className="h-5 w-5 text-blue-600" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />
    }
  }

  const getStepStatusText = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return '설정 완료'
      case 'error': return '오류'
      case 'blocked': return '차단됨'
      case 'configuring': return '설정중'
      default: return '대기중'
    }
  }

  const completedSteps = workflowSteps.filter(s => s.status === 'completed').length
  const totalSteps = workflowSteps.filter(s => stageConfigurations[s.id].enabled).length
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">단계별 배분룰 설정</h1>
        <p className="text-muted-foreground">
          8단계 ABC 방법론에 따른 체계적인 원가배분 워크플로우를 설정하고 관리합니다.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              워크플로우 진행률
            </div>
            <Badge variant={overallProgress === 100 ? "default" : "secondary"}>
              {completedSteps}/{totalSteps} 완료
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>전체 진행률</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={startWorkflowExecution}
              disabled={overallProgress < 100 || isExecuting}
              className="flex-1"
            >
              {isExecuting ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  실행중...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  워크플로우 실행
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setExecutionLog([])}>
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow">워크플로우 설정</TabsTrigger>
          <TabsTrigger value="dependencies">의존성 관리</TabsTrigger>
          <TabsTrigger value="execution">실행 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="flex-1 space-y-4">
          {!isConfiguring ? (
            <div className="grid gap-4">
              {workflowSteps.map((step, index) => (
                <Card key={step.id} className={`${
                  step.status === 'error' ? 'border-red-200' : 
                  step.status === 'blocked' ? 'border-amber-200' :
                  step.status === 'completed' ? 'border-green-200' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            {getStepStatusIcon(step.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{step.name}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {getStepStatusText(step.status)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                예상 {step.estimatedDuration}분
                              </Badge>
                              {!stageConfigurations[step.id].enabled && (
                                <Badge variant="secondary" className="text-xs">
                                  비활성
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStageConfig(step.id)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            설정
                          </Button>
                        </div>
                      </div>

                      {/* Configuration Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">배분 방법</div>
                          <div className="text-sm font-medium">
                            {stageConfigurations[step.id].method.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">드라이버</div>
                          <div className="text-sm">
                            {stageConfigurations[step.id].drivers.length > 0 
                              ? `${stageConfigurations[step.id].drivers.length}개 선택됨`
                              : '없음'
                            }
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">배분 경로</div>
                          <div className="text-sm flex items-center gap-1">
                            <span>{stageConfigurations[step.id].sources.join(', ')}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{stageConfigurations[step.id].targets.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Validation Errors */}
                      {step.validationErrors.length > 0 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              {step.validationErrors.map((error, index) => (
                                <div key={index} className="text-sm">• {error}</div>
                              ))}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Dependencies */}
                      {step.dependencies.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">의존성</div>
                          <div className="flex flex-wrap gap-1">
                            {step.dependencies.map((dep) => {
                              const depStep = workflowSteps.find(s => s.id === dep)
                              return (
                                <Badge 
                                  key={dep} 
                                  variant={depStep?.status === 'completed' ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {allocationStageLabels[dep]}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>단계 설정</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep && (
                  <StageConfigForm
                    stage={currentStep}
                    configuration={stageConfigurations[currentStep]}
                    onSave={handleSaveConfiguration}
                    onCancel={handleCancelConfiguration}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dependencies" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                단계별 의존성 그래프
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getStepStatusIcon(step.status)}
                      <div className="min-w-0">
                        <div className="font-medium">{step.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.dependencies.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">의존:</span>
                          {step.dependencies.map((dep) => {
                            const depStep = workflowSteps.find(s => s.id === dep)
                            return (
                              <Badge 
                                key={dep}
                                variant={depStep?.status === 'completed' ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {allocationStageLabels[dep]}
                              </Badge>
                            )
                          })}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">독립</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                실행 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-auto text-sm font-mono">
                {executionLog.length > 0 ? (
                  executionLog.map((log, index) => (
                    <div key={index} className="text-muted-foreground">
                      [{new Date().toLocaleTimeString()}] {log}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <div>실행 로그가 없습니다</div>
                    <div className="text-xs mt-1">워크플로우를 실행하면 로그가 표시됩니다</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
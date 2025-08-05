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
import { 
  Activity, 
  BarChart3,
  Calendar,
  Clock,
  Filter,
  GitBranch,
  History,
  LineChart,
  Monitor,
  PieChart,
  Play,
  Pause,
  RefreshCw,
  Search,
  TrendingUp,
  Eye,
  Download,
  Settings,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Building2,
  Target,
  Calculator
} from "lucide-react"
import { allocationEngine, AllocationResult, ExecutionState } from "@/lib/allocation-engine"
import { AllocationStage, allocationStageLabels } from "@/lib/allocation-data"

// 실시간 모니터링 데이터
interface MonitoringData {
  timestamp: string
  stage: AllocationStage
  progress: number
  throughput: number // 초당 처리 건수
  memory_usage: number
  active_connections: number
  errors_count: number
}

// Sankey 다이어그램 노드/링크 인터페이스
interface SankeyNode {
  id: string
  name: string
  type: "department" | "activity" | "cost_object" | "account"
  level: number
  value: number
}

interface SankeyLink {
  source: string
  target: string
  value: number
  stage: AllocationStage
  color: string
}

// 배분 이력 인터페이스
interface AllocationHistory {
  id: string
  execution_date: string
  execution_time: number // 실행 시간 (초)
  total_amount: number
  stages_executed: AllocationStage[]
  results_count: number
  status: "completed" | "failed" | "partial"
  notes?: string
}

// 더미 모니터링 데이터
const generateMonitoringData = (): MonitoringData[] => {
  const stages: AllocationStage[] = ['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc']
  const data: MonitoringData[] = []
  
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(Date.now() - (19 - i) * 5000).toISOString()
    data.push({
      timestamp,
      stage: stages[Math.floor(Math.random() * stages.length)],
      progress: Math.random() * 100,
      throughput: Math.random() * 50 + 10,
      memory_usage: Math.random() * 30 + 40,
      active_connections: Math.floor(Math.random() * 10) + 1,
      errors_count: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0
    })
  }
  
  return data
}

// 더미 Sankey 데이터 생성
const generateSankeyData = (): { nodes: SankeyNode[], links: SankeyLink[] } => {
  const nodes: SankeyNode[] = [
    // Level 0: 자원 (부서)
    { id: "dept_internal", name: "내과", type: "department", level: 0, value: 4350000 },
    { id: "dept_surgery", name: "외과", type: "department", level: 0, value: 3750000 },
    { id: "dept_radiology", name: "영상의학과", type: "department", level: 0, value: 2850000 },
    { id: "dept_admin", name: "행정부서", type: "department", level: 0, value: 2250000 },
    
    // Level 1: 활동
    { id: "act_outpatient", name: "외래진료", type: "activity", level: 1, value: 3250000 },
    { id: "act_inpatient", name: "입원진료", type: "activity", level: 1, value: 2180000 },
    { id: "act_surgery", name: "수술", type: "activity", level: 1, value: 4150000 },
    { id: "act_imaging", name: "영상검사", type: "activity", level: 1, value: 1850000 },
    { id: "act_lab", name: "임상검사", type: "activity", level: 1, value: 1250000 },
    
    // Level 2: 원가대상
    { id: "co_internal_medicine", name: "내과 진료", type: "cost_object", level: 2, value: 5430000 },
    { id: "co_surgery", name: "외과 진료", type: "cost_object", level: 2, value: 6330000 },
    { id: "co_radiology", name: "영상의학과 진료", type: "cost_object", level: 2, value: 3100000 }
  ]

  const links: SankeyLink[] = [
    // RTA: 부서 → 활동
    { source: "dept_internal", target: "act_outpatient", value: 2610000, stage: "rta", color: "#3b82f6" },
    { source: "dept_internal", target: "act_inpatient", value: 1740000, stage: "rta", color: "#3b82f6" },
    { source: "dept_surgery", target: "act_surgery", value: 2625000, stage: "rta", color: "#3b82f6" },
    { source: "dept_surgery", target: "act_outpatient", value: 1125000, stage: "rta", color: "#3b82f6" },
    { source: "dept_radiology", target: "act_imaging", value: 1850000, stage: "rta", color: "#3b82f6" },
    { source: "dept_radiology", target: "act_lab", value: 1000000, stage: "rta", color: "#3b82f6" },
    { source: "dept_admin", target: "act_lab", value: 250000, stage: "rta", color: "#3b82f6" },
    
    // ATC: 활동 → 원가대상
    { source: "act_outpatient", target: "co_internal_medicine", value: 2000000, stage: "atc", color: "#10b981" },
    { source: "act_outpatient", target: "co_surgery", value: 1250000, stage: "atc", color: "#10b981" },
    { source: "act_inpatient", target: "co_internal_medicine", value: 1740000, stage: "atc", color: "#10b981" },
    { source: "act_surgery", target: "co_surgery", value: 4150000, stage: "atc", color: "#10b981" },
    { source: "act_imaging", target: "co_radiology", value: 1850000, stage: "atc", color: "#10b981" },
    { source: "act_lab", target: "co_internal_medicine", value: 750000, stage: "atc", color: "#10b981" },
    { source: "act_lab", target: "co_surgery", value: 500000, stage: "atc", color: "#10b981" },
    
    // RTC: 직접 배부
    { source: "dept_internal", target: "co_internal_medicine", value: 940000, stage: "rtc", color: "#f59e0b" },
    { source: "dept_surgery", target: "co_surgery", value: 430000, stage: "rtc", color: "#f59e0b" },
    { source: "dept_radiology", target: "co_radiology", value: 1250000, stage: "rtc", color: "#f59e0b" }
  ]

  return { nodes, links }
}

// 더미 이력 데이터
const mockAllocationHistory: AllocationHistory[] = [
  {
    id: "hist_001",
    execution_date: "2025-01-15T10:30:00Z",
    execution_time: 185,
    total_amount: 25450000,
    stages_executed: ['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'],
    results_count: 248,
    status: "completed",
    notes: "정상적으로 모든 단계 완료"
  },
  {
    id: "hist_002", 
    execution_date: "2025-01-14T15:45:00Z",
    execution_time: 142,
    total_amount: 23890000,
    stages_executed: ['rtr', 'rta', 'atc', 'rtc', 'etc', 'xtc'],
    results_count: 186,
    status: "completed",
    notes: "ATA 단계 생략하여 실행"
  },
  {
    id: "hist_003",
    execution_date: "2025-01-13T09:20:00Z", 
    execution_time: 0,
    total_amount: 0,
    stages_executed: ['rtr'],
    results_count: 0,
    status: "failed",
    notes: "RTR 단계에서 드라이버 데이터 오류로 실패"
  },
  {
    id: "hist_004",
    execution_date: "2025-01-12T14:15:00Z",
    execution_time: 98,
    total_amount: 18750000,
    stages_executed: ['rtr', 'rta', 'atc', 'etc', 'xtc'],
    results_count: 142,
    status: "partial",
    notes: "일부 단계만 실행 완료"
  }
]

// Sankey 다이어그램 컴포넌트 (간단한 시각화)
function SankeyDiagram({ data }: { data: { nodes: SankeyNode[], links: SankeyLink[] } }) {
  const maxValue = Math.max(...data.nodes.map(n => n.value))
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-8 min-h-[400px]">
        {/* Level 0: 자원 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-center">자원 (부서)</h4>
          <div className="space-y-2">
            {data.nodes.filter(n => n.level === 0).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{node.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ₩{node.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-blue-200 rounded">
                  <div 
                    className="h-full bg-blue-600 rounded" 
                    style={{ width: `${(node.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 1: 활동 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-center">활동</h4>
          <div className="space-y-2">
            {data.nodes.filter(n => n.level === 1).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                  <Activity className="h-4 w-4 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{node.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ₩{node.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-green-200 rounded">
                  <div 
                    className="h-full bg-green-600 rounded" 
                    style={{ width: `${(node.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2: 원가대상 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-center">원가대상</h4>
          <div className="space-y-2">
            {data.nodes.filter(n => n.level === 2).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border">
                  <Target className="h-4 w-4 text-purple-600" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{node.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ₩{node.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-purple-200 rounded">
                  <div 
                    className="h-full bg-purple-600 rounded" 
                    style={{ width: `${(node.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 연결선 정보 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">주요 배분 흐름</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {data.links.slice(0, 8).map((link, index) => {
            const sourceNode = data.nodes.find(n => n.id === link.source)
            const targetNode = data.nodes.find(n => n.id === link.target)
            return (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <Badge variant="outline" className="text-xs">
                  {link.stage.toUpperCase()}
                </Badge>
                <span className="flex-1 min-w-0">
                  {sourceNode?.name} → {targetNode?.name}
                </span>
                <span className="font-medium">
                  ₩{link.value.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AllocationTrackingPage() {
  const [selectedTab, setSelectedTab] = useState("monitoring")
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>(generateMonitoringData())
  const [sankeyData] = useState(generateSankeyData())
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [searchTerm, setSearchTerm] = useState("")

  // 실시간 모니터링 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLiveMonitoring) {
      interval = setInterval(() => {
        setMonitoringData(prev => {
          const newEntry: MonitoringData = {
            timestamp: new Date().toISOString(),
            stage: ['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'][Math.floor(Math.random() * 8)] as AllocationStage,
            progress: Math.random() * 100,
            throughput: Math.random() * 50 + 10,
            memory_usage: Math.random() * 30 + 40,
            active_connections: Math.floor(Math.random() * 10) + 1,
            errors_count: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0
          };
          const newData = [...prev.slice(1), newEntry];
          return newData;
        })
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLiveMonitoring])

  // 현재 상태 계산
  const currentMetrics = monitoringData.length > 0 ? {
    avgThroughput: monitoringData.slice(-5).reduce((sum, d) => sum + d.throughput, 0) / 5,
    currentMemory: monitoringData[monitoringData.length - 1]?.memory_usage || 0,
    totalErrors: monitoringData.slice(-10).reduce((sum, d) => sum + d.errors_count, 0),
    activeStages: new Set(monitoringData.slice(-5).map(d => d.stage)).size
  } : { avgThroughput: 0, currentMemory: 0, totalErrors: 0, activeStages: 0 }

  // 필터링된 이력
  const filteredHistory = mockAllocationHistory.filter(hist => {
    if (searchTerm) {
      return hist.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             hist.id.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">배분과정 추적 및 시각화</h1>
        <p className="text-muted-foreground">
          실시간 배분 모니터링, Sankey 다이어그램, 배분 이력을 통해 원가배분 과정을 시각화합니다.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              실시간 처리량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentMetrics.avgThroughput.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              건/초 (최근 5회 평균)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              메모리 사용률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentMetrics.currentMemory.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              시스템 메모리
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              오류 발생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {currentMetrics.totalErrors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              최근 10회 집계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              활성 단계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentMetrics.activeStages}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              동시 실행중인 단계
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">실시간 모니터링</TabsTrigger>
          <TabsTrigger value="visualization">Sankey 다이어그램</TabsTrigger>
          <TabsTrigger value="history">배분 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant={isLiveMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
              >
                {isLiveMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    정지
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    실시간 모니터링
                  </>
                )}
              </Button>
              <Badge variant={isLiveMonitoring ? "default" : "secondary"}>
                {isLiveMonitoring ? "실행중" : "정지됨"}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMonitoringData(generateMonitoringData())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  성능 지표
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>처리량 (건/초)</span>
                      <span>{currentMetrics.avgThroughput.toFixed(1)}</span>
                    </div>
                    <Progress value={Math.min(currentMetrics.avgThroughput * 2, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>메모리 사용률</span>
                      <span>{currentMetrics.currentMemory.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMetrics.currentMemory} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU 사용률</span>
                      <span>{(currentMetrics.avgThroughput * 1.5).toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMetrics.avgThroughput * 1.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  단계별 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc'].map((stage) => {
                    const stageData = monitoringData.slice(-10).filter(d => d.stage === stage)
                    const isActive = stageData.length > 0
                    const avgProgress = stageData.length > 0 
                      ? stageData.reduce((sum, d) => sum + d.progress, 0) / stageData.length 
                      : 0

                    return (
                      <div key={stage} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm font-medium">{allocationStageLabels[stage as AllocationStage]}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {avgProgress.toFixed(0)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                실시간 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-auto text-xs font-mono">
                {monitoringData.slice(-15).reverse().map((data, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">{new Date(data.timestamp).toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {data.stage.toUpperCase()}
                    </Badge>
                    <span>처리량: {data.throughput.toFixed(1)} 건/초</span>
                    {data.errors_count > 0 && (
                      <span className="text-red-600">오류: {data.errors_count}건</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">배분 흐름 시각화</h3>
              <p className="text-sm text-muted-foreground">
                8단계 ABC 배분과정의 자원 흐름을 Sankey 다이어그램으로 표시합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">현재 기간</SelectItem>
                  <SelectItem value="previous">이전 기간</SelectItem>
                  <SelectItem value="ytd">연 누계</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                원가 배분 흐름도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SankeyDiagram data={sankeyData} />
            </CardContent>
          </Card>

          {/* Stage Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">단계별 범례</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                  <span className="text-sm">RTA: 자원→활동</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded" />
                  <span className="text-sm">ATC: 활동→원가대상</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-600 rounded" />
                  <span className="text-sm">RTC: 자원 직접배부</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded" />
                  <span className="text-sm">기타 단계</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">배분 실행 이력</h3>
              <p className="text-sm text-muted-foreground">
                과거 배분 실행 기록과 결과를 조회합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="이력 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredHistory.map((history) => (
              <Card key={history.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {history.status === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {history.status === 'failed' && (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          {history.status === 'partial' && (
                            <Clock className="h-5 w-5 text-amber-600" />
                          )}
                          <Badge variant={
                            history.status === 'completed' ? 'default' :
                            history.status === 'failed' ? 'destructive' : 'secondary'
                          }>
                            {history.status === 'completed' ? '완료' :
                             history.status === 'failed' ? '실패' : '부분 완료'}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-semibold">{history.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(history.execution_date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          ₩{history.total_amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {history.results_count}건 처리
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">실행 시간</div>
                        <div className="font-medium">
                          {history.execution_time > 0 ? `${history.execution_time}초` : 'N/A'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">실행된 단계</div>
                        <div className="flex flex-wrap gap-1">
                          {history.stages_executed.map((stage) => (
                            <Badge key={stage} variant="outline" className="text-xs">
                              {stage.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">메모</div>
                        <div className="text-sm">{history.notes || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
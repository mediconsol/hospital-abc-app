"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { ProcessTable } from "@/components/tables/process-table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, User, Target, Play, Calendar, Edit2, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProcessStep {
  id: string
  name: string
  description: string
  estimatedTime: number
  dependencies: string[]
}

interface Process {
  id: string
  name: string
  code: string
  description: string
  category: string
  department: string
  steps: ProcessStep[]
  totalEstimatedTime: number
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

// Mock data
const mockProcesses: Process[] = [
  {
    id: "1",
    name: "환자 입원 프로세스",
    code: "PROC001",
    description: "환자의 입원 절차와 관련된 전체 업무 프로세스",
    category: "입원관리",
    department: "입원팀",
    steps: [
      { id: "1-1", name: "입원 신청 접수", description: "환자의 입원 신청서 접수 및 확인", estimatedTime: 15, dependencies: [] },
      { id: "1-2", name: "병실 배정", description: "환자 상태에 맞는 병실 배정", estimatedTime: 10, dependencies: ["1-1"] },
      { id: "1-3", name: "입원 수속", description: "입원비 예치금 및 서류 작성", estimatedTime: 20, dependencies: ["1-2"] },
      { id: "1-4", name: "병동 인계", description: "담당 간호사에게 환자 인계", estimatedTime: 10, dependencies: ["1-3"] }
    ],
    totalEstimatedTime: 55,
    status: "active",
    createdAt: "2025-07-15",
    updatedAt: "2025-07-20"
  },
  {
    id: "2",
    name: "수술 전 준비 프로세스",
    code: "PROC002", 
    description: "수술 전 환자 준비 및 수술실 셋업 프로세스",
    category: "수술관리",
    department: "수술팀",
    steps: [
      { id: "2-1", name: "수술 동의서 확인", description: "환자 및 보호자 수술 동의서 확인", estimatedTime: 10, dependencies: [] },
      { id: "2-2", name: "수술 전 검사", description: "필요한 검사 실시 및 결과 확인", estimatedTime: 30, dependencies: ["2-1"] },
      { id: "2-3", name: "수술실 준비", description: "수술실 멸균 및 장비 준비", estimatedTime: 25, dependencies: [] },
      { id: "2-4", name: "환자 이송", description: "환자를 수술실로 이송", estimatedTime: 10, dependencies: ["2-2", "2-3"] }
    ],
    totalEstimatedTime: 75,
    status: "active",
    createdAt: "2025-07-10",
    updatedAt: "2025-07-25"
  },
  {
    id: "3",
    name: "응급실 초기 대응 프로세스",
    code: "PROC003",
    description: "응급환자 내원 시 초기 대응 및 트리아지 프로세스",
    category: "응급의료",
    department: "응급의학과",
    steps: [
      { id: "3-1", name: "응급환자 접수", description: "응급환자 정보 등록 및 초기 접수", estimatedTime: 5, dependencies: [] },
      { id: "3-2", name: "트리아지 평가", description: "응급도 분류 및 우선순위 결정", estimatedTime: 10, dependencies: ["3-1"] },
      { id: "3-3", name: "초기 처치", description: "응급도에 따른 초기 의료 처치", estimatedTime: 20, dependencies: ["3-2"] }
    ],
    totalEstimatedTime: 35,
    status: "active",
    createdAt: "2025-07-05",
    updatedAt: "2025-07-18"
  },
  {
    id: "4",
    name: "퇴원 절차 프로세스",
    code: "PROC004",
    description: "환자 퇴원 시 필요한 모든 절차 프로세스",
    category: "퇴원관리",
    department: "병동관리팀",
    steps: [
      { id: "4-1", name: "퇴원 승인", description: "담당의사의 퇴원 승인 확인", estimatedTime: 5, dependencies: [] },
      { id: "4-2", name: "진료비 정산", description: "입원비 및 치료비 정산", estimatedTime: 15, dependencies: ["4-1"] },
      { id: "4-3", name: "퇴원 약 처방", description: "퇴원 후 복용할 약물 처방", estimatedTime: 10, dependencies: ["4-1"] },
      { id: "4-4", name: "퇴원 서류 발급", description: "진단서, 소견서 등 필요 서류 발급", estimatedTime: 15, dependencies: ["4-2"] }
    ],
    totalEstimatedTime: 45,
    status: "draft",
    createdAt: "2025-07-20",
    updatedAt: "2025-07-28"
  }
]

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>(mockProcesses)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [showTable, setShowTable] = useState(true)
  const [showListView, setShowListView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Process | null>(null)

  const handleAdd = () => {
    console.log("프로세스 추가")
    setSelectedProcess(null)
    setShowTable(false)
    setShowListView(false)
  }

  const handleEdit = (process: Process) => {
    setSelectedProcess(process)
    setShowTable(false)
    setShowListView(false)
  }

  const handleDelete = (process: Process) => {
    if (confirm(`정말로 '${process.name}' 프로세스를 삭제하시겠습니까?`)) {
      setProcesses(processes.filter(proc => proc.id !== process.id))
      if (selectedProcess?.id === process.id) {
        setSelectedProcess(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: any) => {
    setSelectedProcess(item.data)
    setShowTable(false)
    setShowListView(false)
  }

  const handleShowList = () => {
    setShowListView(true)
    setSelectedProcess(null)
    setShowTable(true)
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditStart = () => {
    if (selectedProcess) {
      setEditFormData({...selectedProcess})
      setIsEditing(true)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditSave = () => {
    if (editFormData && selectedProcess) {
      setProcesses(processes.map(process => 
        process.id === selectedProcess.id ? editFormData : process
      ))
      setSelectedProcess(editFormData)
      setIsEditing(false)
      setEditFormData(null)
    }
  }

  const handleFieldChange = (field: keyof Process, value: any) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value
      })
    }
  }

  const handleStepChange = (stepIndex: number, field: keyof ProcessStep, value: any) => {
    if (editFormData) {
      const updatedSteps = [...editFormData.steps]
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        [field]: value
      }
      setEditFormData({
        ...editFormData,
        steps: updatedSteps,
        totalEstimatedTime: updatedSteps.reduce((total, step) => total + step.estimatedTime, 0)
      })
    }
  }

  // Group by category for tree structure
  const categories = [...new Set(processes.map(process => process.category))]
  const treeData = categories.map(category => ({
    id: category,
    name: category,
    children: processes
      .filter(process => process.category === category)
      .map(process => ({
        id: process.id,
        name: `${process.code} - ${process.name}`,
        type: process.category,
        data: process
      }))
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'draft': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성'
      case 'inactive': return '비활성'
      case 'draft': return '초안'
      default: return '알 수 없음'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
  }

  return (
    <BaseInfoLayout
      title="프로세스 관리"
      description="병원 내 업무 프로세스를 정의하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedProcess ? { id: selectedProcess.id, name: selectedProcess.name, data: selectedProcess } : null}
      onItemSelect={handleItemSelect}
      onShowList={handleShowList}
      showListView={showListView}
      listViewComponent={
        <ProcessTable
          processes={processes}
          onRowClick={(process) => {
            setSelectedProcess(process)
            setShowListView(false)
            setShowTable(false)
          }}
          onAdd={(data) => {
            const processSteps = data.steps.map((step, index) => ({
              id: `step-${index + 1}`,
              name: step.name,
              description: step.description,
              estimatedTime: step.estimatedTime,
              dependencies: []
            }))
            const totalTime = processSteps.reduce((total, step) => total + step.estimatedTime, 0)

            const newProcess: Process = {
              id: `${processes.length + 1}`,
              name: data.name,
              code: data.code,
              description: data.description,
              category: data.category,
              department: data.department,
              steps: processSteps,
              totalEstimatedTime: totalTime,
              status: data.status,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            setProcesses([...processes, newProcess])
          }}
          onEdit={(id, data) => {
            const processSteps = data.steps.map((step, index) => ({
              id: `step-${index + 1}`,
              name: step.name,
              description: step.description,
              estimatedTime: step.estimatedTime,
              dependencies: []
            }))
            const totalTime = processSteps.reduce((total, step) => total + step.estimatedTime, 0)

            setProcesses(processes.map(process => 
              process.id === id 
                ? { 
                    ...process, 
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    category: data.category,
                    department: data.department,
                    status: data.status,
                    steps: processSteps,
                    totalEstimatedTime: totalTime,
                    updatedAt: new Date().toISOString() 
                  }
                : process
            ))
          }}
          onDelete={(id) => {
            if (confirm('정말로 이 프로세스를 삭제하시겠습니까?')) {
              setProcesses(processes.filter(process => process.id !== id))
            }
          }}
        />
      }
      searchPlaceholder="프로세스 검색..."
    >
      {selectedProcess && !showListView ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">프로세스 정보</h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Select value={editFormData?.status} onValueChange={(value) => handleFieldChange('status', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                          <SelectItem value="draft">초안</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={editFormData?.category || ''}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-24 text-xs"
                        placeholder="분류"
                      />
                    </>
                  ) : (
                    <>
                      <Badge className={getStatusColor(selectedProcess.status)}>
                        {getStatusText(selectedProcess.status)}
                      </Badge>
                      <Badge variant="outline">
                        {selectedProcess.category}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">프로세스 코드</Label>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="code" 
                      value={isEditing ? (editFormData?.code || '') : selectedProcess.code} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('code', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">프로세스명</Label>
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={isEditing ? (editFormData?.name || '') : selectedProcess.name} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('name', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={isEditing ? (editFormData?.description || '') : selectedProcess.description} 
                  readOnly={!isEditing} 
                  rows={2}
                  onChange={(e) => isEditing && handleFieldChange('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">분류</Label>
                  <Input 
                    id="category" 
                    value={isEditing ? (editFormData?.category || '') : selectedProcess.category} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('category', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">담당 부서</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="department" 
                      value={isEditing ? (editFormData?.department || '') : selectedProcess.department} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('department', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">예상 소요시간</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="estimatedTime" 
                      value={formatTime(isEditing ? (editFormData?.totalEstimatedTime || 0) : selectedProcess.totalEstimatedTime)} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="created">생성일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="created" 
                      value={new Date(selectedProcess.createdAt).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updated">수정일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="updated" 
                      value={new Date(selectedProcess.updatedAt).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 프로세스 단계 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">프로세스 단계</h3>
                <Badge variant="outline">{selectedProcess.steps.length}단계</Badge>
              </div>
              
              <div className="space-y-4">
                {(isEditing ? editFormData?.steps : selectedProcess.steps)?.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="flex items-start gap-4 p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        {isEditing ? (
                          <Input
                            value={step.name}
                            onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                            className="font-medium"
                          />
                        ) : (
                          <h4 className="font-medium">{step.name}</h4>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {isEditing ? (
                            <Input
                              type="number"
                              value={step.estimatedTime}
                              onChange={(e) => handleStepChange(index, 'estimatedTime', parseInt(e.target.value) || 0)}
                              className="w-16 h-6 text-xs"
                              min="0"
                            />
                          ) : (
                            formatTime(step.estimatedTime)
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <Textarea
                          value={step.description}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      )}
                      {step.dependencies.length > 0 && (
                        <div className="text-xs text-blue-600">
                          의존성: {step.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                    {index < (isEditing ? editFormData?.steps.length : selectedProcess.steps.length) - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 수정 버튼 */}
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleEditCancel}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleEditSave}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </>
            ) : (
              <Button onClick={handleEditStart}>
                <Edit2 className="h-4 w-4 mr-2" />
                프로세스 수정
              </Button>
            )}
          </div>
        </div>
      ) : !showListView ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">프로세스를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 프로세스를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      ) : null}
    </BaseInfoLayout>
  )
}
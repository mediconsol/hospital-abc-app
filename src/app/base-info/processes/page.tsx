"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, User } from "lucide-react"

interface Process {
  id: string
  name: string
  description: string
  category: string
  steps: ProcessStep[]
  estimatedTime: number
  assignedTo: string
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

interface ProcessStep {
  id: string
  name: string
  description: string
  order: number
  estimatedMinutes: number
}

// Mock data
const mockProcesses: Process[] = [
  {
    id: "1",
    name: "환자 입원 프로세스",
    description: "환자의 입원 절차와 관련된 전체 업무 프로세스",
    category: "입원관리",
    steps: [
      { id: "1-1", name: "입원 신청 접수", description: "환자의 입원 신청서 접수 및 확인", order: 1, estimatedMinutes: 15 },
      { id: "1-2", name: "병실 배정", description: "환자 상태에 맞는 병실 배정", order: 2, estimatedMinutes: 10 },
      { id: "1-3", name: "입원 수속", description: "입원비 예치금 및 서류 작성", order: 3, estimatedMinutes: 20 },
      { id: "1-4", name: "병동 인계", description: "담당 간호사에게 환자 인계", order: 4, estimatedMinutes: 10 }
    ],
    estimatedTime: 55,
    assignedTo: "입원팀",
    status: "active",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-01"
  },
  {
    id: "2",
    name: "수술 준비 프로세스",
    description: "수술 전 환자 준비 및 수술실 세팅 프로세스",
    category: "수술관리",
    steps: [
      { id: "2-1", name: "수술 전 검사", description: "혈액검사, 심전도 등 필수 검사", order: 1, estimatedMinutes: 30 },
      { id: "2-2", name: "마취과 상담", description: "마취 방법 및 위험도 상담", order: 2, estimatedMinutes: 20 },
      { id: "2-3", name: "수술실 준비", description: "수술 기구 및 환경 준비", order: 3, estimatedMinutes: 25 },
      { id: "2-4", name: "환자 이송", description: "수술실로 환자 이송", order: 4, estimatedMinutes: 10 }
    ],
    estimatedTime: 85,
    assignedTo: "수술팀",
    status: "active",
    createdAt: "2025-07-20",
    updatedAt: "2025-07-25"
  },
  {
    id: "3",
    name: "외래 진료 프로세스",
    description: "외래 환자의 진료 접수부터 완료까지의 프로세스",
    category: "외래관리",
    steps: [
      { id: "3-1", name: "접수 및 대기", description: "진료 접수 및 대기실 안내", order: 1, estimatedMinutes: 5 },
      { id: "3-2", name: "진료", description: "의사 진료 및 처방", order: 2, estimatedMinutes: 15 },
      { id: "3-3", name: "수납", description: "진료비 수납 처리", order: 3, estimatedMinutes: 5 },
      { id: "3-4", name: "약국 처방", description: "처방전에 따른 약 조제", order: 4, estimatedMinutes: 10 }
    ],
    estimatedTime: 35,
    assignedTo: "외래팀",
    status: "active",
    createdAt: "2025-06-10",
    updatedAt: "2025-07-30"
  }
]

export default function ProcessesPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [processes] = useState<Process[]>(mockProcesses)

  const handleAdd = () => {
    console.log("프로세스 추가")
  }

  const handleEdit = (process: Process) => {
    console.log("프로세스 수정:", process)
  }

  const handleDelete = (process: Process) => {
    console.log("프로세스 삭제:", process)
  }

  const treeData = processes.map(process => ({
    id: process.id,
    name: process.name,
    type: process.category,
    data: process
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

  return (
    <BaseInfoLayout
      title="프로세스 관리"
      description="병원 내 업무 프로세스를 정의하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedProcess ? { id: selectedProcess.id, name: selectedProcess.name, data: selectedProcess } : null}
      onItemSelect={(item) => setSelectedProcess(item.data)}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data)}
      onDelete={(item) => handleDelete(item.data)}
      searchPlaceholder="프로세스 검색..."
    >
      {selectedProcess ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <Badge className={getStatusColor(selectedProcess.status)}>
                  {getStatusText(selectedProcess.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">프로세스명</Label>
                  <Input id="name" value={selectedProcess.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Input id="category" value={selectedProcess.category} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" value={selectedProcess.description} readOnly rows={3} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">담당팀</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input id="assignedTo" value={selectedProcess.assignedTo} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">예상 소요시간</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input id="estimatedTime" value={`${selectedProcess.estimatedTime}분`} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedAt">최종 수정일</Label>
                  <Input id="updatedAt" value={selectedProcess.updatedAt} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 프로세스 단계 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">프로세스 단계</h3>
              
              <div className="space-y-3">
                {selectedProcess.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      {step.order}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.estimatedMinutes}분
                    </div>
                    
                    {index < selectedProcess.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  총 예상 시간: {selectedProcess.estimatedTime}분
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 수정 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              단계 편집
            </Button>
            <Button>
              프로세스 수정
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">프로세스를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 프로세스를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
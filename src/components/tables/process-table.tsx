"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Clock, Target } from "lucide-react"
import { ProcessForm } from "@/components/forms/process-form"

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
  status: "active" | "inactive" | "draft"
  steps: ProcessStep[]
  totalEstimatedTime: number
  createdAt: string
  updatedAt: string
}

interface CreateProcessForm {
  name: string
  code: string
  description: string
  category: string
  department: string
  status: "active" | "inactive" | "draft"
  steps: {
    name: string
    description: string
    estimatedTime: number
  }[]
}

interface ProcessTableProps {
  processes: Process[]
  onAdd: (data: CreateProcessForm) => void
  onEdit: (id: string, data: CreateProcessForm) => void
  onDelete: (id: string) => void
  onRowClick?: (process: Process) => void
}

export function ProcessTable({ 
  processes, 
  onAdd, 
  onEdit, 
  onDelete,
  onRowClick
}: ProcessTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingProcess(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (process: Process) => {
    setEditingProcess(process)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateProcessForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingProcess) {
      onEdit(editingProcess.id, data)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>프로세스 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            프로세스 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>프로세스코드</TableHead>
                <TableHead>프로세스명</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>담당부서</TableHead>
                <TableHead>단계수</TableHead>
                <TableHead>예상시간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    등록된 프로세스가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                processes.map((process) => (
                  <TableRow 
                    key={process.id}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onRowClick?.(process)}
                  >
                    <TableCell className="font-mono">{process.code}</TableCell>
                    <TableCell className="font-medium">{process.name}</TableCell>
                    <TableCell>{process.category}</TableCell>
                    <TableCell>{process.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        {process.steps.length}단계
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(process.totalEstimatedTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(process.status)}>
                        {getStatusText(process.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(process)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(process.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProcessForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        process={editingProcess}
        mode={formMode}
      />
    </>
  )
}
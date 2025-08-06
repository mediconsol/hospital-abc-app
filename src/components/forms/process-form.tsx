"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock } from "lucide-react"

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

interface ProcessFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProcessForm) => void
  process?: Process | null
  mode: 'create' | 'edit'
}

export function ProcessForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  process, 
  mode 
}: ProcessFormProps) {
  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<CreateProcessForm>({
    defaultValues: process ? {
      code: process.code,
      name: process.name,
      description: process.description,
      category: process.category,
      department: process.department,
      status: process.status,
      steps: process.steps.map(step => ({
        name: step.name,
        description: step.description,
        estimatedTime: step.estimatedTime
      }))
    } : {
      code: '',
      name: '',
      description: '',
      category: '진료',
      department: '',
      status: 'active',
      steps: [
        {
          name: '',
          description: '',
          estimatedTime: 30
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps"
  })

  const watchedSteps = watch("steps")
  const totalEstimatedTime = watchedSteps?.reduce((total, step) => total + (step.estimatedTime || 0), 0) || 0

  const handleFormSubmit = (data: CreateProcessForm) => {
    onSubmit(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const addStep = () => {
    append({
      name: '',
      description: '',
      estimatedTime: 30
    })
  }

  const removeStep = (index: number) => {
    if (fields.length > 1) {
      remove(index)
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '프로세스 등록' : '프로세스 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 프로세스 정보를 입력하세요' : '프로세스 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">프로세스코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "프로세스코드는 필수입니다" })}
                placeholder="PROC001"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">프로세스명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "프로세스명은 필수입니다" })}
                placeholder="외래진료 프로세스"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">분류 *</Label>
              <select
                id="category"
                {...register("category", { required: "분류는 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="진료">진료</option>
                <option value="검사">검사</option>
                <option value="수술">수술</option>
                <option value="간호">간호</option>
                <option value="관리">관리</option>
                <option value="지원">지원</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">담당부서 *</Label>
              <Input
                id="department"
                {...register("department", { required: "담당부서는 필수입니다" })}
                placeholder="외래"
              />
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">상태 *</Label>
            <select
              id="status"
              {...register("status", { required: "상태는 필수입니다" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="draft">초안</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="프로세스 설명을 입력하세요"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* 프로세스 단계 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">프로세스 단계</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    총 예상시간: {formatTime(totalEstimatedTime)}
                  </span>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-2">
                <Plus className="h-4 w-4" />
                단계 추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">단계 {index + 1}</Badge>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`steps.${index}.name`}>단계명 *</Label>
                      <Input
                        {...register(`steps.${index}.name` as const, { 
                          required: "단계명은 필수입니다" 
                        })}
                        placeholder="접수"
                      />
                      {errors.steps?.[index]?.name && (
                        <p className="text-sm text-red-500">{errors.steps[index]?.name?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`steps.${index}.estimatedTime`}>예상시간(분) *</Label>
                      <Input
                        type="number"
                        {...register(`steps.${index}.estimatedTime` as const, { 
                          required: "예상시간은 필수입니다",
                          valueAsNumber: true,
                          min: { value: 1, message: "1분 이상이어야 합니다" }
                        })}
                        placeholder="30"
                      />
                      {errors.steps?.[index]?.estimatedTime && (
                        <p className="text-sm text-red-500">{errors.steps[index]?.estimatedTime?.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`steps.${index}.description`}>단계 설명</Label>
                    <textarea
                      {...register(`steps.${index}.description` as const)}
                      placeholder="단계에 대한 상세 설명"
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit">
              {mode === 'create' ? '등록' : '수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
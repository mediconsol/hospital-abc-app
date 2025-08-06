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
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, Calculator, Target } from "lucide-react"

interface Driver {
  id: string
  name: string
  code: string
  description: string
  type: "quantitative" | "qualitative" | "time-based" | "resource-based"
  unit: string
  measurementMethod: string
  frequency: "real-time" | "daily" | "weekly" | "monthly"
  status: "active" | "inactive" | "testing"
  departments: string[]
  activities: string[]
  costAllocation: {
    method: "equal" | "weighted" | "activity-based"
    weights?: { [key: string]: number }
  }
  currentValue?: number
  targetValue?: number
  variance?: number
  createdAt: string
  updatedAt: string
}

interface CreateDriverForm {
  name: string
  code: string
  description: string
  type: "quantitative" | "qualitative" | "time-based" | "resource-based"
  unit: string
  measurementMethod: string
  frequency: "real-time" | "daily" | "weekly" | "monthly"
  status: "active" | "inactive" | "testing"
  departments: string
  activities: string
  costAllocationMethod: "equal" | "weighted" | "activity-based"
  currentValue: number
  targetValue: number
}

interface DriverFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDriverForm) => void
  driver?: Driver | null
  mode: 'create' | 'edit'
}

export function DriverForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  driver, 
  mode 
}: DriverFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateDriverForm>({
    defaultValues: driver ? {
      code: driver.code,
      name: driver.name,
      description: driver.description,
      type: driver.type,
      unit: driver.unit,
      measurementMethod: driver.measurementMethod,
      frequency: driver.frequency,
      status: driver.status,
      departments: driver.departments.join(', '),
      activities: driver.activities.join(', '),
      costAllocationMethod: driver.costAllocation.method,
      currentValue: driver.currentValue || 0,
      targetValue: driver.targetValue || 0
    } : {
      code: '',
      name: '',
      description: '',
      type: 'quantitative',
      unit: '',
      measurementMethod: '',
      frequency: 'daily',
      status: 'active',
      departments: '',
      activities: '',
      costAllocationMethod: 'equal',
      currentValue: 0,
      targetValue: 0
    }
  })

  const watchedCurrentValue = watch("currentValue")
  const watchedTargetValue = watch("targetValue")

  const handleFormSubmit = (data: CreateDriverForm) => {
    onSubmit(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const getProgressValue = (current: number, target: number) => {
    if (!target) return 0
    return Math.min((current / target) * 100, 100)
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'quantitative': return '정량적'
      case 'qualitative': return '정성적'
      case 'time-based': return '시간기준'
      case 'resource-based': return '자원기준'
      default: return '알 수 없음'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'real-time': return '실시간'
      case 'daily': return '일별'
      case 'weekly': return '주별'
      case 'monthly': return '월별'
      default: return '알 수 없음'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '드라이버 등록' : '드라이버 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 드라이버 정보를 입력하세요' : '드라이버 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">드라이버코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "드라이버코드는 필수입니다" })}
                placeholder="DRV001"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">드라이버명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "드라이버명은 필수입니다" })}
                placeholder="병상 수"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">유형 *</Label>
              <select
                id="type"
                {...register("type", { required: "유형은 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="quantitative">정량적</option>
                <option value="qualitative">정성적</option>
                <option value="time-based">시간기준</option>
                <option value="resource-based">자원기준</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">측정단위 *</Label>
              <Input
                id="unit"
                {...register("unit", { required: "측정단위는 필수입니다" })}
                placeholder="개, 건, 시간, 회"
              />
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">측정빈도 *</Label>
              <select
                id="frequency"
                {...register("frequency", { required: "측정빈도는 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="real-time">실시간</option>
                <option value="daily">일별</option>
                <option value="weekly">주별</option>
                <option value="monthly">월별</option>
              </select>
              {errors.frequency && (
                <p className="text-sm text-red-500">{errors.frequency.message}</p>
              )}
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
                <option value="testing">테스트</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurementMethod">측정방법 *</Label>
            <Input
              id="measurementMethod"
              {...register("measurementMethod", { required: "측정방법은 필수입니다" })}
              placeholder="수동 집계, 자동 집계, 시스템 연동"
            />
            {errors.measurementMethod && (
              <p className="text-sm text-red-500">{errors.measurementMethod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="costAllocationMethod">원가배분방식 *</Label>
            <select
              id="costAllocationMethod"
              {...register("costAllocationMethod", { required: "원가배분방식은 필수입니다" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="equal">균등배분</option>
              <option value="weighted">가중배분</option>
              <option value="activity-based">활동기준배분</option>
            </select>
            {errors.costAllocationMethod && (
              <p className="text-sm text-red-500">{errors.costAllocationMethod.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departments">관련부서</Label>
              <Input
                id="departments"
                {...register("departments")}
                placeholder="부서명을 쉼표로 구분하여 입력"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activities">관련활동</Label>
              <Input
                id="activities"
                {...register("activities")}
                placeholder="활동명을 쉼표로 구분하여 입력"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="드라이버에 대한 상세 설명을 입력하세요"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* 성과 지표 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">성과 지표</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentValue">현재값</Label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentValue"
                      type="number"
                      {...register("currentValue", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "현재값은 0 이상이어야 합니다" }
                      })}
                      placeholder="100"
                      className="pl-10"
                    />
                  </div>
                  {errors.currentValue && (
                    <p className="text-sm text-red-500">{errors.currentValue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetValue">목표값</Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="targetValue"
                      type="number"
                      {...register("targetValue", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "목표값은 0 이상이어야 합니다" }
                      })}
                      placeholder="120"
                      className="pl-10"
                    />
                  </div>
                  {errors.targetValue && (
                    <p className="text-sm text-red-500">{errors.targetValue.message}</p>
                  )}
                </div>
              </div>

              {watchedCurrentValue > 0 && watchedTargetValue > 0 && (
                <div className="space-y-2">
                  <Label>달성률</Label>
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={getProgressValue(watchedCurrentValue, watchedTargetValue)} 
                      className="flex-1 h-3"
                    />
                    <Badge variant="outline" className="text-primary">
                      {Math.round(getProgressValue(watchedCurrentValue, watchedTargetValue))}%
                    </Badge>
                  </div>
                </div>
              )}
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
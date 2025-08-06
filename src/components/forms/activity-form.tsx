"use client"

import { useForm } from "react-hook-form"
import { useEffect } from "react"
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
import { CreateActivityForm, Activity } from "@/types"

interface ActivityFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateActivityForm) => void
  activity?: Activity | null
  mode: 'create' | 'edit'
}

export function ActivityForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  activity, 
  mode 
}: ActivityFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateActivityForm>({
    defaultValues: {
      code: '',
      name: '',
      category: '의료',
      department_id: '',
      description: '',
    }
  })

  // 활동 데이터가 변경되면 폼 필드를 업데이트
  useEffect(() => {
    if (activity && mode === 'edit') {
      setValue('code', activity.code)
      setValue('name', activity.name)
      setValue('category', activity.category)
      setValue('department_id', activity.department_id || '')
      setValue('description', activity.description || '')
    } else if (mode === 'create') {
      reset({
        code: '',
        name: '',
        category: '의료',
        department_id: '',
        description: '',
      })
    }
  }, [activity, mode, setValue, reset])

  const handleFormSubmit = (data: CreateActivityForm) => {
    onSubmit(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '활동 등록' : '활동 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 활동 정보를 입력하세요' : '활동 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">활동코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "활동코드는 필수입니다" })}
                placeholder="ACT001"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">활동명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "활동명은 필수입니다" })}
                placeholder="진료활동"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">활동분류 *</Label>
            <select
              id="category"
              {...register("category", { required: "활동분류는 필수입니다" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="의료">의료</option>
              <option value="관리">관리</option>
              <option value="지원">지원</option>
              <option value="교육">교육</option>
              <option value="연구">연구</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department_id">주관부서</Label>
            <select
              id="department_id"
              {...register("department_id")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">부서 선택</option>
              <option value="1">외래</option>
              <option value="2">병동</option>
              <option value="3">영상의학과</option>
              <option value="4">진단검사의학과</option>
              <option value="5">원무과</option>
              <option value="6">총무과</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="활동 설명을 입력하세요"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
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
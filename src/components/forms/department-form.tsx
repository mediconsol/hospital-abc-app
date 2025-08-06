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
import { CreateDepartmentForm, Department } from "@/types"

interface DepartmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDepartmentForm) => void
  department?: Department | null
  mode: 'create' | 'edit'
}

export function DepartmentForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  department, 
  mode 
}: DepartmentFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateDepartmentForm>({
    defaultValues: {
      code: '',
      name: '',
      type: 'direct',
      manager: '',
      description: '',
    }
  })

  // 부서 데이터가 변경되면 폼 필드를 업데이트
  useEffect(() => {
    if (department && mode === 'edit') {
      setValue('code', department.code)
      setValue('name', department.name)
      setValue('type', department.type)
      setValue('manager', department.manager || '')
      setValue('description', department.description || '')
    } else if (mode === 'create') {
      reset({
        code: '',
        name: '',
        type: 'direct',
        manager: '',
        description: '',
      })
    }
  }, [department, mode, setValue, reset])

  const handleFormSubmit = (data: CreateDepartmentForm) => {
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
            {mode === 'create' ? '부서 등록' : '부서 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 부서 정보를 입력하세요' : '부서 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">부서코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "부서코드는 필수입니다" })}
                placeholder="D001"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">부서명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "부서명은 필수입니다" })}
                placeholder="외래"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">부서유형 *</Label>
            <select
              id="type"
              {...register("type", { required: "부서유형은 필수입니다" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="direct">직접부서</option>
              <option value="indirect">간접부서</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager">부서장</Label>
            <Input
              id="manager"
              {...register("manager")}
              placeholder="김부서장"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="부서 설명을 입력하세요"
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
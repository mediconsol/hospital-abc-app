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
import { CreateAccountForm, Account } from "@/types"

interface AccountFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAccountForm) => void
  account?: Account | null
  mode: 'create' | 'edit'
}

export function AccountForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  account, 
  mode 
}: AccountFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateAccountForm>({
    defaultValues: {
      code: '',
      name: '',
      category: 'salary',
      is_direct: true,
      description: '',
    }
  })

  // 계정 데이터가 변경되면 폼 필드를 업데이트
  useEffect(() => {
    if (account && mode === 'edit') {
      setValue('code', account.code)
      setValue('name', account.name)
      setValue('category', account.category)
      setValue('is_direct', account.is_direct)
      setValue('description', account.description || '')
    } else if (mode === 'create') {
      reset({
        code: '',
        name: '',
        category: 'salary',
        is_direct: true,
        description: '',
      })
    }
  }, [account, mode, setValue, reset])

  const handleFormSubmit = (data: CreateAccountForm) => {
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
            {mode === 'create' ? '계정 등록' : '계정 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 계정 정보를 입력하세요' : '계정 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">계정코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "계정코드는 필수입니다" })}
                placeholder="6110"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">계정명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "계정명은 필수입니다" })}
                placeholder="급여"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">계정분류 *</Label>
            <select
              id="category"
              {...register("category", { required: "계정분류는 필수입니다" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="salary">인건비</option>
              <option value="material">재료비</option>
              <option value="expense">경비</option>
              <option value="equipment">장비비</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("is_direct")}
                className="rounded border-gray-300"
              />
              직접비 여부
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="계정 설명을 입력하세요"
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
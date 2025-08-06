"use client"

import { useForm } from "react-hook-form"
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
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

interface RevenueCode {
  id: string
  code: string
  name: string
  description: string
  category: string
  unitPrice: number
  currency: string
  billingType: "per-service" | "per-hour" | "per-day" | "fixed"
  status: "active" | "inactive" | "pending"
  effectiveDate: string
  expiryDate: string | null
  department: string
  createdAt: string
  updatedAt: string
  monthlyRevenue?: number
  usageCount?: number
}

interface CreateRevenueCodeForm {
  code: string
  name: string
  description: string
  category: string
  unitPrice: number
  currency: string
  billingType: "per-service" | "per-hour" | "per-day" | "fixed"
  status: "active" | "inactive" | "pending"
  effectiveDate: string
  expiryDate: string
  department: string
}

interface RevenueCodeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateRevenueCodeForm) => void
  revenueCode?: RevenueCode | null
  mode: 'create' | 'edit'
}

export function RevenueCodeForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  revenueCode, 
  mode 
}: RevenueCodeFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateRevenueCodeForm>({
    defaultValues: revenueCode ? {
      code: revenueCode.code,
      name: revenueCode.name,
      description: revenueCode.description,
      category: revenueCode.category,
      unitPrice: revenueCode.unitPrice,
      currency: revenueCode.currency,
      billingType: revenueCode.billingType,
      status: revenueCode.status,
      effectiveDate: revenueCode.effectiveDate ? revenueCode.effectiveDate.split('T')[0] : '',
      expiryDate: revenueCode.expiryDate ? revenueCode.expiryDate.split('T')[0] : '',
      department: revenueCode.department
    } : {
      code: '',
      name: '',
      description: '',
      category: '진료료',
      unitPrice: 0,
      currency: 'KRW',
      billingType: 'per-service',
      status: 'active',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      department: ''
    }
  })

  const watchedUnitPrice = watch("unitPrice")

  const handleFormSubmit = (data: CreateRevenueCodeForm) => {
    onSubmit(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount || 0)
  }

  const getBillingTypeText = (type: string) => {
    switch (type) {
      case 'per-service': return '서비스당'
      case 'per-hour': return '시간당'
      case 'per-day': return '일당'
      case 'fixed': return '고정'
      default: return '알 수 없음'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '수익코드 등록' : '수익코드 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 수익코드 정보를 입력하세요' : '수익코드 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">수익코드 *</Label>
              <Input
                id="code"
                {...register("code", { required: "수익코드는 필수입니다" })}
                placeholder="REV001"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">코드명 *</Label>
              <Input
                id="name"
                {...register("name", { required: "코드명은 필수입니다" })}
                placeholder="외래진료료"
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
                <option value="진료료">진료료</option>
                <option value="검사료">검사료</option>
                <option value="수술료">수술료</option>
                <option value="처치료">처치료</option>
                <option value="상담료">상담료</option>
                <option value="기타">기타</option>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">단가 *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="unitPrice"
                  type="number"
                  {...register("unitPrice", { 
                    required: "단가는 필수입니다",
                    valueAsNumber: true,
                    min: { value: 0, message: "단가는 0 이상이어야 합니다" }
                  })}
                  placeholder="30000"
                  className="pl-10"
                />
              </div>
              {errors.unitPrice && (
                <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
              )}
              {watchedUnitPrice > 0 && (
                <Badge variant="outline" className="text-primary">
                  {formatCurrency(watchedUnitPrice)}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingType">과금방식 *</Label>
              <select
                id="billingType"
                {...register("billingType", { required: "과금방식은 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="per-service">서비스당</option>
                <option value="per-hour">시간당</option>
                <option value="per-day">일당</option>
                <option value="fixed">고정</option>
              </select>
              {errors.billingType && (
                <p className="text-sm text-red-500">{errors.billingType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">시작일 *</Label>
              <Input
                id="effectiveDate"
                type="date"
                {...register("effectiveDate", { required: "시작일은 필수입니다" })}
              />
              {errors.effectiveDate && (
                <p className="text-sm text-red-500">{errors.effectiveDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">종료일</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register("expiryDate")}
              />
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
              <option value="pending">대기</option>
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
              placeholder="수익코드에 대한 설명을 입력하세요"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Hidden currency field */}
          <input type="hidden" {...register("currency")} value="KRW" />
          
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
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
import { CreateEmployeeForm, Employee } from "@/types"

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateEmployeeForm) => void
  employee?: Employee | null
  mode: 'create' | 'edit'
}

export function EmployeeForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee, 
  mode 
}: EmployeeFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateEmployeeForm>({
    defaultValues: {
      employee_number: '',
      name: '',
      position: '',
      department_id: '',
      department_name: '',
      email: '',
      phone: '',
      hire_date: '',
      employment_type: 'full_time',
      salary: 0,
      description: '',
    }
  })

  // 직원 데이터가 변경되면 폼 필드를 업데이트
  useEffect(() => {
    if (employee && mode === 'edit') {
      setValue('employee_number', employee.employee_number)
      setValue('name', employee.name)
      setValue('position', employee.position)
      setValue('department_id', employee.department_id)
      setValue('department_name', employee.department_name || '')
      setValue('email', employee.email || '')
      setValue('phone', employee.phone || '')
      setValue('hire_date', employee.hire_date || '')
      setValue('employment_type', employee.employment_type)
      setValue('salary', employee.salary)
      setValue('description', employee.description || '')
    } else if (mode === 'create') {
      reset({
        employee_number: '',
        name: '',
        position: '',
        department_id: '',
        department_name: '',
        email: '',
        phone: '',
        hire_date: '',
        employment_type: 'full_time',
        salary: 0,
        description: '',
      })
    }
  }, [employee, mode, setValue, reset])

  const handleFormSubmit = (data: CreateEmployeeForm) => {
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '직원 등록' : '직원 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 직원 정보를 입력하세요' : '직원 정보를 수정하세요'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_number">사번 *</Label>
              <Input
                id="employee_number"
                {...register("employee_number", { required: "사번은 필수입니다" })}
                placeholder="EMP001"
              />
              {errors.employee_number && (
                <p className="text-sm text-red-500">{errors.employee_number.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                {...register("name", { required: "이름은 필수입니다" })}
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">직급 *</Label>
              <Input
                id="position"
                {...register("position", { required: "직급은 필수입니다" })}
                placeholder="과장"
              />
              {errors.position && (
                <p className="text-sm text-red-500">{errors.position.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department_name">부서</Label>
              <Input
                id="department_name"
                {...register("department_name")}
                placeholder="내과"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="example@hospital.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="02-1234-5678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hire_date">입사일</Label>
              <Input
                id="hire_date"
                type="date"
                {...register("hire_date")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employment_type">고용형태 *</Label>
              <select
                id="employment_type"
                {...register("employment_type", { required: "고용형태는 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="full_time">정규직</option>
                <option value="part_time">파트타임</option>
                <option value="contract">계약직</option>
              </select>
              {errors.employment_type && (
                <p className="text-sm text-red-500">{errors.employment_type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">연봉 *</Label>
            <Input
              id="salary"
              type="number"
              {...register("salary", { 
                required: "연봉은 필수입니다",
                valueAsNumber: true,
                min: { value: 0, message: "연봉은 0보다 큰 값이어야 합니다" }
              })}
              placeholder="50000000"
            />
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="직원 설명을 입력하세요"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Hidden field for department_id - 실제로는 부서 선택 드롭다운으로 구현해야 함 */}
          <input 
            type="hidden" 
            {...register("department_id")}
            value="1"
          />
          
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
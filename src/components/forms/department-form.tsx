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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { CreateDepartmentForm, Department } from "@/types"

interface DepartmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDepartmentForm) => void
  department?: Department | null
  mode: 'create' | 'edit'
  departments: Department[] // 상위부서 선택을 위한 부서 목록
}

export function DepartmentForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  department, 
  mode,
  departments 
}: DepartmentFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateDepartmentForm>({
    defaultValues: {
      code: '',
      name: '',
      type: 'direct',
      parent_id: '',
      manager: '',
      description: '',
      is_active: true,
    }
  })

  const watchedParentId = watch('parent_id')

  // 계층형 부서 표시를 위한 헬퍼 함수
  const getDepartmentHierarchy = (dept: Department, allDepts: Department[]): string => {
    if (!dept.parent_id) return dept.name
    const parent = allDepts.find(d => d.id === dept.parent_id)
    if (!parent) return dept.name
    return `${getDepartmentHierarchy(parent, allDepts)} > ${dept.name}`
  }

  // 자기 자신과 하위 부서들은 상위부서로 선택할 수 없도록 필터링
  const getValidParentDepartments = () => {
    if (mode === 'create') return departments

    const getChildDepartmentIds = (deptId: string): string[] => {
      const children = departments.filter(d => d.parent_id === deptId)
      const childIds = children.map(c => c.id)
      const grandChildIds = children.flatMap(c => getChildDepartmentIds(c.id))
      return [...childIds, ...grandChildIds]
    }

    if (!department) return departments
    
    const excludeIds = [department.id, ...getChildDepartmentIds(department.id)]
    return departments.filter(d => !excludeIds.includes(d.id))
  }

  // 부서 데이터가 변경되면 폼 필드를 업데이트
  useEffect(() => {
    if (department && mode === 'edit') {
      setValue('code', department.code)
      setValue('name', department.name)
      setValue('type', department.type)
      setValue('parent_id', department.parent_id || '')
      setValue('manager', department.manager || '')
      setValue('description', department.description || '')
      setValue('is_active', department.is_active ?? true)
    } else if (mode === 'create') {
      reset({
        code: '',
        name: '',
        type: 'direct',
        parent_id: '',
        manager: '',
        description: '',
        is_active: true,
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
            <Label htmlFor="parent_id">상위부서</Label>
            <Select 
              value={watchedParentId || ""} 
              onValueChange={(value) => setValue('parent_id', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="상위부서를 선택하세요 (선택사항)" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none">상위부서 없음 (최상위 부서)</SelectItem>
                {getValidParentDepartments()
                  .sort((a, b) => {
                    // 같은 레벨이면 부서코드 순으로, 다른 레벨이면 계층 구조 순으로
                    const aLevel = a.parent_id ? (departments.find(d => d.id === a.parent_id) ? 1 : 0) : 0
                    const bLevel = b.parent_id ? (departments.find(d => d.id === b.parent_id) ? 1 : 0) : 0
                    
                    if (aLevel !== bLevel) {
                      return aLevel - bLevel
                    }
                    return a.code.localeCompare(b.code)
                  })
                  .map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {dept.parent_id ? '└' : '■'}
                        </span>
                        <span>{getDepartmentHierarchy(dept, departments)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({dept.type === 'direct' ? '직접' : '간접'})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {mode === 'edit' ? '수정 시 자기 자신과 하위 부서는 선택할 수 없습니다.' : '최상위 부서로 만들려면 "상위부서 없음"을 선택하세요.'}
            </p>
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

          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              type="checkbox"
              {...register("is_active")}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              활성화 상태
            </Label>
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
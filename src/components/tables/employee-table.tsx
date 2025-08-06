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
import { Edit, Trash2, Plus } from "lucide-react"
import { EmployeeForm } from "@/components/forms/employee-form"
import { Employee, CreateEmployeeForm } from "@/types"
import { mockDepartments } from "@/lib/mock-data"

interface EmployeeTableProps {
  employees: Employee[]
  onAdd: (data: CreateEmployeeForm) => void
  onEdit: (id: string, data: CreateEmployeeForm) => void
  onDelete: (id: string) => void
  onRowClick?: (employee: Employee) => void
}

export function EmployeeTable({ 
  employees, 
  onAdd, 
  onEdit, 
  onDelete,
  onRowClick
}: EmployeeTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingEmployee(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateEmployeeForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingEmployee) {
      onEdit(editingEmployee.id, data)
    }
  }

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return '정규직'
      case 'part_time': return '파트타임'
      case 'contract': return '계약직'
      default: return type
    }
  }

  const getEmploymentTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'part_time': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'contract': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department ? department.name : '알 수 없음'
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>직원 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            직원 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>고용형태</TableHead>
                <TableHead>급여</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    등록된 직원이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onRowClick?.(employee)}
                  >
                    <TableCell className="font-mono">{employee.employee_number}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{getDepartmentName(employee.department_id) || '미분류'}</TableCell>
                    <TableCell>
                      <Badge className={getEmploymentTypeBadgeColor(employee.employment_type)}>
                        {getEmploymentTypeLabel(employee.employment_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatSalary(employee.salary)}</TableCell>
                    <TableCell>
                      <Badge variant={(employee.is_active ?? true) ? "default" : "secondary"}>
                        {(employee.is_active ?? true) ? '재직' : '퇴직'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(employee.id)}
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

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        mode={formMode}
      />
    </>
  )
}
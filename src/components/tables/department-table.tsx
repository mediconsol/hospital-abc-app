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
import { Edit, Trash2, Plus } from "lucide-react"
import { Department, CreateDepartmentForm } from "@/types"
import { DepartmentForm } from "@/components/forms/department-form"

interface DepartmentTableProps {
  departments: Department[]
  onAdd: (data: CreateDepartmentForm) => void
  onEdit: (id: string, data: CreateDepartmentForm) => void
  onDelete: (id: string) => void
}

export function DepartmentTable({ 
  departments, 
  onAdd, 
  onEdit, 
  onDelete 
}: DepartmentTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingDepartment(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateDepartmentForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingDepartment) {
      onEdit(editingDepartment.id, data)
    }
  }

  const getTypeLabel = (type: string) => {
    return type === 'direct' ? '직접부서' : '간접부서'
  }

  const getTypeBadgeColor = (type: string) => {
    return type === 'direct' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>부서 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            부서 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>부서코드</TableHead>
                <TableHead>부서명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>부서장</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    등록된 부서가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-mono">{department.code}</TableCell>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(department.type)}`}>
                        {getTypeLabel(department.type)}
                      </span>
                    </TableCell>
                    <TableCell>{department.manager || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {department.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(department.id)}
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

      <DepartmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        department={editingDepartment}
        mode={formMode}
      />
    </>
  )
}
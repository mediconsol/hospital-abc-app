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

  // 부서 계층 구조를 표시하기 위한 헬퍼 함수
  const getDepartmentHierarchy = (dept: Department): { name: string; level: number } => {
    const getParentChain = (deptId: string, level: number = 0): { name: string; level: number } => {
      const current = departments.find(d => d.id === deptId)
      if (!current) return { name: '', level: 0 }
      
      if (!current.parent_id) {
        return { name: current.name, level }
      }
      
      const parent = getParentChain(current.parent_id, level + 1)
      return { name: current.name, level }
    }
    
    return getParentChain(dept.id)
  }

  const getParentName = (parentId: string | undefined): string => {
    if (!parentId) return '-'
    const parent = departments.find(d => d.id === parentId)
    return parent ? parent.name : '-'
  }

  // 부서를 계층 구조에 따라 정렬
  const sortedDepartments = [...departments].sort((a, b) => {
    const aHierarchy = getDepartmentHierarchy(a)
    const bHierarchy = getDepartmentHierarchy(b)
    
    // 레벨이 다르면 레벨 순으로 (상위부서 먼저)
    if (aHierarchy.level !== bHierarchy.level) {
      return bHierarchy.level - aHierarchy.level
    }
    
    // 같은 레벨이면 이름 순으로
    return a.name.localeCompare(b.name)
  })

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
                <TableHead>상위부서</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>부서장</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    등록된 부서가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                sortedDepartments.map((department) => {
                  const hierarchy = getDepartmentHierarchy(department)
                  const indent = '　'.repeat(Math.max(0, 2 - hierarchy.level)) // 계층에 따른 들여쓰기
                  
                  return (
                    <TableRow key={department.id}>
                      <TableCell className="font-mono">{department.code}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <span className="text-muted-foreground text-xs mr-1">
                            {hierarchy.level === 2 ? '■' : hierarchy.level === 1 ? '▶' : '└'}
                          </span>
                          {indent}{department.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getParentName(department.parent_id)}
                      </TableCell>
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
                  )
                })
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
        departments={departments}
      />
    </>
  )
}
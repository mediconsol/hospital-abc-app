"use client"

import { useState } from "react"
import { DepartmentTable } from "@/components/tables/department-table"
import { mockDepartments } from "@/lib/mock-data"
import { Department, CreateDepartmentForm } from "@/types"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)

  const handleAdd = (data: CreateDepartmentForm) => {
    const newDepartment: Department = {
      id: `${departments.length + 1}`,
      hospital_id: '1',
      period_id: '1',
      code: data.code,
      name: data.name,
      type: data.type,
      manager: data.manager,
      description: data.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setDepartments([...departments, newDepartment])
  }

  const handleEdit = (id: string, data: CreateDepartmentForm) => {
    setDepartments(departments.map(dept => 
      dept.id === id 
        ? { 
            ...dept, 
            ...data, 
            updated_at: new Date().toISOString() 
          }
        : dept
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 부서를 삭제하시겠습니까?')) {
      setDepartments(departments.filter(dept => dept.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">부서 관리</h1>
        <p className="text-muted-foreground mt-1">
          병원의 부서 정보를 등록하고 관리합니다
        </p>
      </div>

      <DepartmentTable
        departments={departments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { EmployeeTable } from "@/components/tables/employee-table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Hash, Mail, Phone, Building2, Briefcase } from "lucide-react"

interface Employee {
  id: string
  hospital_id: string
  period_id: string
  employee_number: string
  name: string
  position: string
  department_id: string
  department_name: string
  email?: string
  phone?: string
  hire_date: string
  employment_type: 'full_time' | 'part_time' | 'contract'
  salary: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 목업 데이터
const mockEmployees: Employee[] = [
  {
    id: '1',
    hospital_id: '1',
    period_id: '1',
    employee_number: 'EMP001',
    name: '김의사',
    position: '과장',
    department_id: '1',
    department_name: '내과',
    email: 'doctor.kim@hospital.com',
    phone: '02-1234-5678',
    hire_date: '2020-03-15',
    employment_type: 'full_time',
    salary: 80000000,
    description: '내과 전문의',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    hospital_id: '1',
    period_id: '1',
    employee_number: 'EMP002',
    name: '박간호사',
    position: '수간호사',
    department_id: '1',
    department_name: '내과',
    email: 'nurse.park@hospital.com',
    phone: '02-1234-5679',
    hire_date: '2018-01-20',
    employment_type: 'full_time',
    salary: 45000000,
    description: '내과병동 수간호사',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    hospital_id: '1',
    period_id: '1',
    employee_number: 'EMP003',
    name: '최기사',
    position: '주임',
    department_id: '2',
    department_name: '방사선과',
    email: 'tech.choi@hospital.com',
    phone: '02-1234-5680',
    hire_date: '2019-06-10',
    employment_type: 'full_time',
    salary: 38000000,
    description: '방사선 촬영 기사',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showTable, setShowTable] = useState(true)

  const handleAdd = () => {
    console.log("직원 추가")
    setSelectedEmployee(null)
    setShowTable(false)
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowTable(false)
  }

  const handleDelete = (employee: Employee) => {
    if (confirm(`정말로 '${employee.name}' 직원을 삭제하시겠습니까?`)) {
      setEmployees(employees.filter(emp => emp.id !== employee.id))
      if (selectedEmployee?.id === employee.id) {
        setSelectedEmployee(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: any) => {
    setSelectedEmployee(item.data)
    setShowTable(false)
  }

  // 트리 데이터 생성 (부서별로 그룹화)
  const buildTreeData = () => {
    const departments = [...new Set(employees.map(emp => emp.department_name))]
    
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department_name === dept)
      return {
        id: dept,
        name: `${dept} (${deptEmployees.length}명)`,
        type: 'department',
        children: deptEmployees.map(emp => ({
          id: emp.id,
          name: `${emp.name} (${emp.position})`,
          type: 'employee',
          data: emp
        }))
      }
    })
  }

  const treeData = buildTreeData()

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

  return (
    <BaseInfoLayout
      title="직원 관리"
      description="병원의 직원 정보를 등록하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedEmployee ? { id: selectedEmployee.id, name: selectedEmployee.name, data: selectedEmployee } : null}
      onItemSelect={handleItemSelect}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data as Employee)}
      onDelete={(item) => handleDelete(item.data as Employee)}
      searchPlaceholder="직원 검색..."
    >
      {showTable ? (
        <EmployeeTable
          employees={employees}
          onAdd={(data) => {
            const newEmployee: Employee = {
              id: `${employees.length + 1}`,
              hospital_id: '1',
              period_id: '1',
              employee_number: data.employee_number,
              name: data.name,
              position: data.position,
              department_id: data.department_id,
              department_name: data.department_name,
              email: data.email,
              phone: data.phone,
              hire_date: data.hire_date,
              employment_type: data.employment_type,
              salary: data.salary,
              description: data.description,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setEmployees([...employees, newEmployee])
          }}
          onEdit={(id, data) => {
            setEmployees(employees.map(emp => 
              emp.id === id 
                ? { 
                    ...emp, 
                    ...data, 
                    updated_at: new Date().toISOString() 
                  }
                : emp
            ))
          }}
          onDelete={(id) => {
            const employee = employees.find(e => e.id === id)
            if (employee) {
              handleDelete(employee)
            }
          }}
        />
      ) : selectedEmployee ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">직원 정보</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getEmploymentTypeBadgeColor(selectedEmployee.employment_type)}>
                    {getEmploymentTypeLabel(selectedEmployee.employment_type)}
                  </Badge>
                  <Badge variant={selectedEmployee.is_active ? "default" : "secondary"}>
                    {selectedEmployee.is_active ? '재직' : '퇴직'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_number">사번</Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input id="employee_number" value={selectedEmployee.employee_number} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={selectedEmployee.name} readOnly />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">직급</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input id="position" value={selectedEmployee.position} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Input id="department" value={selectedEmployee.department_name} readOnly />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={selectedEmployee.email || '없음'} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input id="phone" value={selectedEmployee.phone || '없음'} readOnly />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hire_date">입사일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="hire_date" 
                      value={new Date(selectedEmployee.hire_date).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">급여</Label>
                  <Input id="salary" value={formatSalary(selectedEmployee.salary)} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={selectedEmployee.description || '설명이 없습니다.'} 
                  readOnly 
                  rows={3} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="created">생성일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="created" 
                      value={new Date(selectedEmployee.created_at).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updated">수정일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="updated" 
                      value={new Date(selectedEmployee.updated_at).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">직원을 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 직원을 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
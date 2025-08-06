"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { EmployeeTable } from "@/components/tables/employee-table"
import { mockDepartments, mockEmployees as initialEmployees } from "@/lib/mock-data"
import { Employee } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Hash, Mail, Phone, Building2, Briefcase, Edit2, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// mock-data.ts에서 가져온 데이터 사용

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showTable, setShowTable] = useState(true)
  const [showListView, setShowListView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Employee | null>(null)

  const handleAdd = () => {
    console.log("직원 추가")
    setSelectedEmployee(null)
    setShowTable(false)
    setShowListView(false)
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowTable(false)
    setShowListView(false)
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
    setShowListView(false)
  }

  const handleShowList = () => {
    setShowListView(true)
    setSelectedEmployee(null)
    setShowTable(true)
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditStart = () => {
    if (selectedEmployee) {
      setEditFormData({...selectedEmployee})
      setIsEditing(true)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditSave = () => {
    if (editFormData && selectedEmployee) {
      setEmployees(employees.map(employee => 
        employee.id === selectedEmployee.id ? editFormData : employee
      ))
      setSelectedEmployee(editFormData)
      setIsEditing(false)
      setEditFormData(null)
    }
  }

  const handleFieldChange = (field: keyof Employee, value: any) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value
      })
    }
  }

  // 부서 ID로 부서명 찾기
  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department ? department.name : '알 수 없음'
  }

  // 부서명으로 부서 ID 찾기
  const getDepartmentId = (departmentName: string) => {
    const department = mockDepartments.find(d => d.name === departmentName)
    return department ? department.id : ''
  }

  // 트리 데이터 생성 (부서별로 그룹화)
  const buildTreeData = () => {
    const departmentIds = [...new Set(employees.map(emp => emp.department_id))]
    
    return departmentIds.map(deptId => {
      const departmentName = getDepartmentName(deptId)
      const deptEmployees = employees.filter(emp => emp.department_id === deptId)
      return {
        id: deptId,
        name: `${departmentName} (${deptEmployees.length}명)`,
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
      onShowList={handleShowList}
      showListView={showListView}
      listViewComponent={
        <EmployeeTable
          employees={employees}
          onRowClick={(employee) => {
            setSelectedEmployee(employee)
            setShowListView(false)
            setShowTable(false)
          }}
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
      }
      searchPlaceholder="직원 검색..."
    >
      {selectedEmployee && !showListView ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">직원 정보</h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Select value={editFormData?.employment_type} onValueChange={(value) => handleFieldChange('employment_type', value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">정규직</SelectItem>
                          <SelectItem value="part_time">파트타임</SelectItem>
                          <SelectItem value="contract">계약직</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={editFormData?.is_active ? "true" : "false"} onValueChange={(value) => handleFieldChange('is_active', value === "true")}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">재직</SelectItem>
                          <SelectItem value="false">퇴직</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Badge className={getEmploymentTypeBadgeColor(selectedEmployee.employment_type)}>
                        {getEmploymentTypeLabel(selectedEmployee.employment_type)}
                      </Badge>
                      <Badge variant={(selectedEmployee.is_active ?? true) ? "default" : "secondary"}>
                        {(selectedEmployee.is_active ?? true) ? '재직' : '퇴직'}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_number">사번</Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="employee_number" 
                      value={isEditing ? (editFormData?.employee_number || '') : selectedEmployee.employee_number} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('employee_number', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={isEditing ? (editFormData?.name || '') : selectedEmployee.name} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('name', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">직급</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="position" 
                      value={isEditing ? (editFormData?.position || '') : selectedEmployee.position} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('position', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Select 
                        value={editFormData?.department_id} 
                        onValueChange={(value) => {
                          const departmentName = getDepartmentName(value)
                          handleFieldChange('department_id', value)
                          handleFieldChange('department_name', departmentName)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDepartments
                            .filter(dept => dept.is_active !== false)
                            .map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        id="department" 
                        value={getDepartmentName(selectedEmployee.department_id) || '미분류'} 
                        readOnly
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      value={isEditing ? (editFormData?.email || '') : (selectedEmployee.email || '없음')} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      value={isEditing ? (editFormData?.phone || '') : (selectedEmployee.phone || '없음')} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('phone', e.target.value)}
                    />
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
                      type={isEditing ? "date" : "text"}
                      value={isEditing ? (editFormData?.hire_date || '') : (selectedEmployee.hire_date ? new Date(selectedEmployee.hire_date).toLocaleDateString('ko-KR') : '미등록')} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('hire_date', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">급여</Label>
                  {isEditing ? (
                    <Input 
                      id="salary" 
                      type="number"
                      value={editFormData?.salary || 0} 
                      onChange={(e) => handleFieldChange('salary', parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <Input id="salary" value={formatSalary(selectedEmployee.salary)} readOnly />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={isEditing ? (editFormData?.description || '') : (selectedEmployee.description || '설명이 없습니다.')} 
                  readOnly={!isEditing}
                  rows={3}
                  onChange={(e) => isEditing && handleFieldChange('description', e.target.value)}
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

          {/* 수정 버튼 */}
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleEditCancel}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleEditSave}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </>
            ) : (
              <Button onClick={handleEditStart}>
                <Edit2 className="h-4 w-4 mr-2" />
                직원 수정
              </Button>
            )}
          </div>
        </div>
      ) : !showListView ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">직원을 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 직원을 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      ) : null}
    </BaseInfoLayout>
  )
}
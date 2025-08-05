"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { DepartmentTable } from "@/components/tables/department-table"
import { HierarchicalTree } from "@/components/tree/hierarchical-tree"
import { mockDepartments } from "@/lib/mock-data"
import { Department, CreateDepartmentForm } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Calendar, Hash } from "lucide-react"

interface TreeNode {
  id: string
  name: string
  code: string
  type: string
  level: number
  children: TreeNode[]
  data: Department
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [showTable, setShowTable] = useState(true)

  const handleAdd = () => {
    console.log("부서 추가")
    setSelectedDepartment(null)
    setShowTable(false)
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setShowTable(false)
  }

  const handleDelete = (department: Department) => {
    if (confirm(`정말로 '${department.name}' 부서를 삭제하시겠습니까?`)) {
      // 하위 부서가 있는지 확인
      const hasChildren = departments.some(dept => dept.parent_id === department.id)
      if (hasChildren) {
        alert("하위 부서가 있는 부서는 삭제할 수 없습니다. 먼저 하위 부서를 삭제하거나 이동해주세요.")
        return
      }

      setDepartments(departments.filter(dept => dept.id !== department.id))
      if (selectedDepartment?.id === department.id) {
        setSelectedDepartment(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: any) => {
    setSelectedDepartment(item.data)
    setShowTable(false)
  }

  // 계층형 트리 구조 생성
  const buildHierarchicalTree = (departments: Department[]): TreeNode[] => {
    const departmentMap = new Map<string, TreeNode>()
    
    // 모든 부서를 TreeNode로 변환
    departments.forEach(dept => {
      departmentMap.set(dept.id, {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        type: dept.type,
        level: 0,
        children: [],
        data: dept
      })
    })

    const rootNodes: TreeNode[] = []

    // 계층 구조 구성
    departments.forEach(dept => {
      const node = departmentMap.get(dept.id)!
      
      if (!dept.parent_id) {
        // 최상위 노드 (1단계: 본부/센터)
        node.level = 0
        rootNodes.push(node)
      } else {
        // 하위 노드
        const parentNode = departmentMap.get(dept.parent_id)
        if (parentNode) {
          node.level = parentNode.level + 1
          parentNode.children.push(node)
        }
      }
    })

    // 이름순으로 정렬
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name))
      nodes.forEach(node => sortNodes(node.children))
    }
    sortNodes(rootNodes)

    return rootNodes
  }

  // BaseInfoLayout용 트리 데이터 변환
  const convertToBaseInfoTreeData = () => {
    const hierarchicalTree = buildHierarchicalTree(departments)
    
    const convertNode = (node: TreeNode): any => ({
      id: node.id,
      name: `${node.name} (${node.code})`,
      type: node.type,
      data: node.data,
      children: node.children.map(convertNode)
    })

    return hierarchicalTree.map(convertNode)
  }

  const treeData = convertToBaseInfoTreeData()

  const getTypeLabel = (type: string) => {
    return type === 'direct' ? '직접부서' : '간접부서'
  }

  const getTypeBadgeColor = (type: string) => {
    return type === 'direct' 
      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  }

  const getLevelLabel = (department: Department) => {
    if (!department.parent_id) return '본부/센터'
    
    const parent = departments.find(d => d.id === department.parent_id)
    if (!parent) return '부서'
    
    if (!parent.parent_id) return '부서'
    return '팀/과'
  }

  const getParentName = (parentId?: string) => {
    if (!parentId) return '없음 (최상위)'
    const parent = departments.find(d => d.id === parentId)
    return parent ? `${parent.code} - ${parent.name}` : '알 수 없음'
  }

  const getChildrenCount = (departmentId: string) => {
    return departments.filter(d => d.parent_id === departmentId).length
  }

  return (
    <BaseInfoLayout
      title="부서 관리"
      description="병원의 부서 정보를 등록하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedDepartment ? { id: selectedDepartment.id, name: selectedDepartment.name, data: selectedDepartment } : null}
      onItemSelect={handleItemSelect}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data as Department)}
      onDelete={(item) => handleDelete(item.data as Department)}
      searchPlaceholder="부서 검색..."
      customTreeRenderer={(treeProps) => (
        <HierarchicalTree
          data={buildHierarchicalTree(departments)}
          selectedId={selectedDepartment?.id}
          onSelect={(node) => handleItemSelect({ data: node.data })}
          searchTerm={treeProps.searchTerm}
        />
      )}
    >
      {showTable ? (
        <DepartmentTable
          departments={departments}
          onAdd={(data) => {
            const newDepartment: Department = {
              id: `${departments.length + 1}`,
              hospital_id: '1',
              period_id: '1',
              code: data.code,
              name: data.name,
              type: data.type,
              parent_id: data.parent_id,
              manager: data.manager,
              description: data.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setDepartments([...departments, newDepartment])
          }}
          onEdit={(id, data) => {
            setDepartments(departments.map(dept => 
              dept.id === id 
                ? { 
                    ...dept, 
                    ...data, 
                    updated_at: new Date().toISOString() 
                  }
                : dept
            ))
          }}
          onDelete={(id) => {
            const department = departments.find(d => d.id === id)
            if (department) {
              handleDelete(department)
            }
          }}
        />
      ) : selectedDepartment ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">부서 정보</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeBadgeColor(selectedDepartment.type)}>
                    {getTypeLabel(selectedDepartment.type)}
                  </Badge>
                  <Badge variant="outline">
                    {getLevelLabel(selectedDepartment)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">부서코드</Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input id="code" value={selectedDepartment.code} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">부서명</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={selectedDepartment.name} readOnly />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">부서장</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input id="manager" value={selectedDepartment.manager || '없음'} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">부서 유형</Label>
                  <Input id="type" value={getTypeLabel(selectedDepartment.type)} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">상위 부서</Label>
                <Input id="parent" value={getParentName(selectedDepartment.parent_id)} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={selectedDepartment.description || '설명이 없습니다.'} 
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
                      value={new Date(selectedDepartment.created_at).toLocaleDateString('ko-KR')} 
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
                      value={new Date(selectedDepartment.updated_at).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 하위 부서 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">하위 부서</h3>
                <Badge variant="outline">{getChildrenCount(selectedDepartment.id)}개</Badge>
              </div>
              
              <div className="space-y-2">
                {departments
                  .filter(d => d.parent_id === selectedDepartment.id)
                  .map(child => (
                    <div 
                      key={child.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedDepartment(child)}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{child.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{child.code}</div>
                        </div>
                      </div>
                      <Badge className={getTypeBadgeColor(child.type)}>
                        {getTypeLabel(child.type)}
                      </Badge>
                    </div>
                  ))}
                
                {getChildrenCount(selectedDepartment.id) === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-sm">하위 부서가 없습니다</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">부서를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 부서를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
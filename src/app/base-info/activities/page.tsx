"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { ActivityTable } from "@/components/tables/activity-table"
import { mockActivities, mockDepartments } from "@/lib/mock-data"
import { Activity } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Activity as ActivityIcon, Building2, Calendar, Tag } from "lucide-react"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showTable, setShowTable] = useState(true)

  const handleAdd = () => {
    console.log("활동 추가")
    setSelectedActivity(null)
    setShowTable(false)
  }

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowTable(false)
  }

  const handleDelete = (activity: Activity) => {
    if (confirm(`정말로 '${activity.name}' 활동을 삭제하시겠습니까?`)) {
      setActivities(activities.filter(act => act.id !== activity.id))
      if (selectedActivity?.id === activity.id) {
        setSelectedActivity(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: { id: string; name: string; data: Activity }) => {
    setSelectedActivity(item.data)
    setShowTable(false)
  }

  // Group activities by category for tree structure
  const categories = [...new Set(activities.map(activity => activity.category))]
  const treeData = categories.map(category => ({
    id: category,
    name: category,
    children: activities
      .filter(activity => activity.category === category)
      .map(activity => ({
        id: activity.id,
        name: `${activity.code} - ${activity.name}`,
        type: activity.category,
        data: activity
      }))
  }))

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case '진료활동': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case '간접활동': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case '지원활동': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(dept => dept.id === departmentId)
    return department ? department.name : '알 수 없음'
  }

  return (
    <BaseInfoLayout
      title="활동 관리"
      description="병원 내 활동 정보를 등록하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedActivity ? { id: selectedActivity.id, name: selectedActivity.name, data: selectedActivity } : null}
      onItemSelect={handleItemSelect}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data as Activity)}
      onDelete={(item) => handleDelete(item.data as Activity)}
      searchPlaceholder="활동 검색..."
    >
      {showTable ? (
        <ActivityTable
          activities={activities}
          departments={mockDepartments}
          onAdd={(data) => {
            const newActivity: Activity = {
              id: `${activities.length + 1}`,
              hospital_id: '1',
              period_id: '1',
              code: data.code,
              name: data.name,
              category: data.category,
              department_id: data.department_id,
              description: data.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setActivities([...activities, newActivity])
          }}
          onEdit={(id, data) => {
            setActivities(activities.map(activity => 
              activity.id === id 
                ? { 
                    ...activity, 
                    ...data, 
                    updated_at: new Date().toISOString() 
                  }
                : activity
            ))
          }}
          onDelete={(id) => {
            if (confirm('정말로 이 활동을 삭제하시겠습니까?')) {
              setActivities(activities.filter(activity => activity.id !== id))
            }
          }}
        />
      ) : selectedActivity ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">활동 정보</h3>
                <Badge className={getCategoryBadgeColor(selectedActivity.category)}>
                  {selectedActivity.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">활동코드</Label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input id="code" value={selectedActivity.code} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">활동명</Label>
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={selectedActivity.name} readOnly />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">활동 분류</Label>
                  <Input id="category" value={selectedActivity.category} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">담당 부서</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Input id="department" value={getDepartmentName(selectedActivity.department_id || '') || '-'} readOnly />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={selectedActivity.description || '설명이 없습니다.'} 
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
                      value={new Date(selectedActivity.created_at).toLocaleDateString('ko-KR')} 
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
                      value={new Date(selectedActivity.updated_at).toLocaleDateString('ko-KR')} 
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
            <div className="text-lg font-medium mb-2">활동을 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 활동을 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
"use client"

import { useState } from "react"
import { ActivityTable } from "@/components/tables/activity-table"
import { mockActivities, mockDepartments } from "@/lib/mock-data"
import { Activity, CreateActivityForm } from "@/types"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)

  const handleAdd = (data: CreateActivityForm) => {
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
  }

  const handleEdit = (id: string, data: CreateActivityForm) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { 
            ...activity, 
            ...data, 
            updated_at: new Date().toISOString() 
          }
        : activity
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 활동을 삭제하시겠습니까?')) {
      setActivities(activities.filter(activity => activity.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">활동 관리</h1>
        <p className="text-muted-foreground mt-1">
          병원 내 활동 정보를 등록하고 관리합니다
        </p>
      </div>

      <ActivityTable
        activities={activities}
        departments={mockDepartments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
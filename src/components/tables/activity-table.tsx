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
import { Activity, CreateActivityForm, Department } from "@/types"
import { ActivityForm } from "@/components/forms/activity-form"

interface ActivityTableProps {
  activities: Activity[]
  departments: Department[]
  onAdd: (data: CreateActivityForm) => void
  onEdit: (id: string, data: CreateActivityForm) => void
  onDelete: (id: string) => void
}

export function ActivityTable({ 
  activities, 
  departments,
  onAdd, 
  onEdit, 
  onDelete 
}: ActivityTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingActivity(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateActivityForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingActivity) {
      onEdit(editingActivity.id, data)
    }
  }

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return '-'
    const department = departments.find(d => d.id === departmentId)
    return department?.name || '-'
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      '의료': 'bg-blue-100 text-blue-800',
      '관리': 'bg-green-100 text-green-800',
      '지원': 'bg-yellow-100 text-yellow-800',
      '교육': 'bg-purple-100 text-purple-800',
      '연구': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>활동 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            활동 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>활동코드</TableHead>
                <TableHead>활동명</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>주관부서</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    등록된 활동이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-mono">{activity.code}</TableCell>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(activity.category)}`}>
                        {activity.category}
                      </span>
                    </TableCell>
                    <TableCell>{getDepartmentName(activity.department_id)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {activity.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(activity)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(activity.id)}
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

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        activity={editingActivity}
        mode={formMode}
      />
    </>
  )
}
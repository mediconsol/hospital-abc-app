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
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, Plus, Calculator, Target, TrendingUp } from "lucide-react"

interface Driver {
  id: string
  name: string
  code: string
  description: string
  type: "quantitative" | "qualitative" | "time-based" | "resource-based"
  category: "direct" | "indirect" | "overhead"
  unit: string
  measurementMethod: string
  frequency: "real-time" | "daily" | "weekly" | "monthly"
  status: "active" | "inactive" | "testing"
  departments: string[]
  activities: string[]
  costAllocation: {
    method: "equal" | "weighted" | "activity-based"
    weights?: { [key: string]: number }
  }
  currentValue?: number
  targetValue?: number
  variance?: number
  createdAt: string
  updatedAt: string
}

interface DriverTableProps {
  drivers: Driver[]
  onAdd: (data: any) => void
  onEdit: (id: string, data: any) => void
  onDelete: (id: string) => void
}

export function DriverTable({ 
  drivers, 
  onAdd, 
  onEdit, 
  onDelete 
}: DriverTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAdd = () => {
    console.log("드라이버 추가")
    setIsFormOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'testing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성'
      case 'inactive': return '비활성'
      case 'testing': return '테스트'
      default: return '알 수 없음'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'direct': return '직접 동인'
      case 'indirect': return '간접 동인'
      case 'overhead': return '일반관리비 동인'
      default: return '알 수 없음'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'quantitative': return '정량적'
      case 'qualitative': return '정성적'
      case 'time-based': return '시간기준'
      case 'resource-based': return '자원기준'
      default: return '알 수 없음'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'real-time': return '실시간'
      case 'daily': return '일별'
      case 'weekly': return '주별'
      case 'monthly': return '월별'
      default: return '알 수 없음'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-green-600'
    return 'text-muted-foreground'
  }

  const getProgressValue = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>드라이버 설정</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            드라이버 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>코드</TableHead>
                <TableHead>드라이버명</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>측정단위</TableHead>
                <TableHead>현재값</TableHead>
                <TableHead>목표값</TableHead>
                <TableHead>달성률</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    등록된 드라이버가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-mono">{driver.code}</TableCell>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{getCategoryText(driver.category)}</TableCell>
                    <TableCell>{getTypeText(driver.type)}</TableCell>
                    <TableCell>{driver.unit}</TableCell>
                    <TableCell>
                      {driver.currentValue !== undefined ? (
                        <div className="flex items-center gap-1">
                          <Calculator className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {driver.currentValue.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {driver.targetValue !== undefined ? (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary">
                            {driver.targetValue.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {driver.currentValue !== undefined && driver.targetValue !== undefined ? (
                        <div className="w-20">
                          <Progress 
                            value={getProgressValue(driver.currentValue, driver.targetValue)} 
                            className="h-2"
                          />
                          <div className="text-xs text-center mt-1">
                            {Math.round(getProgressValue(driver.currentValue, driver.targetValue))}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        {getStatusText(driver.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(driver.id, driver)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(driver.id)}
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
    </>
  )
}
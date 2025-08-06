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
import { Edit, Trash2, Plus, TrendingUp } from "lucide-react"
import { RevenueCodeForm } from "@/components/forms/revenue-code-form"

// 임시로 RevenueCode 타입을 정의 (is_active 필드 포함)
interface RevenueCode {
  id: string
  code: string
  name: string
  description: string
  category: string
  unitPrice: number
  currency: string
  billingType: "per-service" | "per-hour" | "per-day" | "fixed"
  is_active?: boolean
  effectiveDate: string
  expiryDate: string | null
  department: string
  createdAt: string
  updatedAt: string
  monthlyRevenue?: number
  usageCount?: number
}

interface CreateRevenueCodeForm {
  code: string
  name: string
  description: string
  category: string
  unitPrice: number
  currency: string
  billingType: "per-service" | "per-hour" | "per-day" | "fixed"
  is_active?: boolean
  effectiveDate: string
  expiryDate: string
  department: string
}

interface RevenueCodeTableProps {
  revenueCodes: RevenueCode[]
  onAdd: (data: CreateRevenueCodeForm) => void
  onEdit: (id: string, data: CreateRevenueCodeForm) => void
  onDelete: (id: string) => void
  onRowClick?: (revenueCode: RevenueCode) => void
}

export function RevenueCodeTable({ 
  revenueCodes, 
  onAdd, 
  onEdit, 
  onDelete,
  onRowClick
}: RevenueCodeTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRevenueCode, setEditingRevenueCode] = useState<RevenueCode | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingRevenueCode(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (revenueCode: RevenueCode) => {
    setEditingRevenueCode(revenueCode)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateRevenueCodeForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingRevenueCode) {
      onEdit(editingRevenueCode.id, data)
    }
  }

  const getActiveStatusColor = (isActive?: boolean) => {
    return (isActive ?? true) 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getActiveStatusText = (isActive?: boolean) => {
    return (isActive ?? true) ? '활성' : '비활성'
  }

  const getBillingTypeText = (type: string) => {
    switch (type) {
      case 'per-service': return '서비스당'
      case 'per-hour': return '시간당'
      case 'per-day': return '일당'
      case 'fixed': return '고정'
      default: return '알 수 없음'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>수가코드 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            수가코드 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>코드</TableHead>
                <TableHead>코드명</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>단가</TableHead>
                <TableHead>과금방식</TableHead>
                <TableHead>담당부서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    등록된 수가코드가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                revenueCodes.map((code) => (
                  <TableRow 
                    key={code.id} 
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onRowClick?.(code)}
                  >
                    <TableCell className="font-mono">{code.code}</TableCell>
                    <TableCell className="font-medium">{code.name}</TableCell>
                    <TableCell>{code.category}</TableCell>
                    <TableCell>
                      <span className="font-medium text-primary">
                        {formatCurrency(code.unitPrice)}
                      </span>
                    </TableCell>
                    <TableCell>{getBillingTypeText(code.billingType)}</TableCell>
                    <TableCell>{code.department}</TableCell>
                    <TableCell>
                      <Badge className={getActiveStatusColor(code.is_active)}>
                        {getActiveStatusText(code.is_active)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(code)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(code.id)}
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

      <RevenueCodeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        revenueCode={editingRevenueCode}
        mode={formMode}
      />
    </>
  )
}
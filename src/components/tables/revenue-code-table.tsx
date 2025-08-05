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
import { Edit, Trash2, Plus, DollarSign, TrendingUp } from "lucide-react"

interface RevenueCode {
  id: string
  code: string
  name: string
  description: string
  category: string
  unitPrice: number
  currency: string
  billingType: "per-service" | "per-hour" | "per-day" | "fixed"
  status: "active" | "inactive" | "pending"
  effectiveDate: string
  expiryDate: string | null
  department: string
  createdAt: string
  updatedAt: string
  monthlyRevenue?: number
  usageCount?: number
}

interface RevenueCodeTableProps {
  revenueCodes: RevenueCode[]
  onAdd: (data: any) => void
  onEdit: (id: string, data: any) => void
  onDelete: (id: string) => void
}

export function RevenueCodeTable({ 
  revenueCodes, 
  onAdd, 
  onEdit, 
  onDelete 
}: RevenueCodeTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAdd = () => {
    console.log("수익코드 추가")
    setIsFormOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성'
      case 'inactive': return '비활성'
      case 'pending': return '대기'
      default: return '알 수 없음'
    }
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
          <CardTitle>수익코드 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            수익코드 추가
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
                <TableHead>월간수익</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    등록된 수익코드가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                revenueCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono">{code.code}</TableCell>
                    <TableCell className="font-medium">{code.name}</TableCell>
                    <TableCell>{code.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-primary">
                          {formatCurrency(code.unitPrice)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getBillingTypeText(code.billingType)}</TableCell>
                    <TableCell>{code.department}</TableCell>
                    <TableCell>
                      {code.monthlyRevenue ? (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            {formatCurrency(code.monthlyRevenue)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(code.status)}>
                        {getStatusText(code.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(code.id, code)}
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
    </>
  )
}
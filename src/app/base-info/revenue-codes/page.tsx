"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, Tag } from "lucide-react"

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

// Mock data
const mockRevenueCodes: RevenueCode[] = [
  {
    id: "1",
    code: "SUR001",
    name: "복강경 담낭절제술",
    description: "최소침습 복강경을 이용한 담낭 제거 수술",
    category: "수술료",
    unitPrice: 1500000,
    currency: "KRW",
    billingType: "per-service",
    status: "active",
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "외과",
    createdAt: "2025-01-15",
    updatedAt: "2025-07-20",
    monthlyRevenue: 4500000,
    usageCount: 3
  },
  {
    id: "2",
    code: "LAB001",
    name: "혈액검사 기본",
    description: "CBC, 생화학 검사 기본 패널",
    category: "검사료",
    unitPrice: 35000,
    currency: "KRW",
    billingType: "per-service",
    status: "active",
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "진단검사의학과",
    createdAt: "2025-01-10",
    updatedAt: "2025-06-15",
    monthlyRevenue: 875000,
    usageCount: 25
  },
  {
    id: "3",
    code: "IMG001",
    name: "CT 복부골반",
    description: "조영제 사용 복부골반 CT 촬영",
    category: "영상검사료",
    unitPrice: 280000,
    currency: "KRW",
    billingType: "per-service",
    status: "active",
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "영상의학과",
    createdAt: "2025-01-12",
    updatedAt: "2025-07-10",
    monthlyRevenue: 2240000,
    usageCount: 8
  },
  {
    id: "4",
    code: "ROOM001",
    name: "일반병실 1인실",
    description: "1인실 병실료 (1일 기준)",
    category: "병실료",
    unitPrice: 85000,
    currency: "KRW",
    billingType: "per-day",
    status: "active",
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "병동관리팀",
    createdAt: "2025-01-08",
    updatedAt: "2025-05-20",
    monthlyRevenue: 2550000,
    usageCount: 30
  },
  {
    id: "5",
    code: "PHARM001",
    name: "항생제 처방료",
    description: "3세대 세팔로스포린 항생제 처방",
    category: "약제료",
    unitPrice: 12000,
    currency: "KRW",
    billingType: "per-service",
    status: "pending",
    effectiveDate: "2025-09-01",
    expiryDate: "2026-08-31",
    department: "약제팀",
    createdAt: "2025-07-25",
    updatedAt: "2025-07-30",
    monthlyRevenue: 0,
    usageCount: 0
  }
]

export default function RevenueCodesPage() {
  const [selectedRevenueCode, setSelectedRevenueCode] = useState<RevenueCode | null>(null)
  const [revenueCodes] = useState<RevenueCode[]>(mockRevenueCodes)

  const handleAdd = () => {
    console.log("수익코드 추가")
  }

  const handleEdit = (revenueCode: RevenueCode) => {
    console.log("수익코드 수정:", revenueCode)
  }

  const handleDelete = (revenueCode: RevenueCode) => {
    console.log("수익코드 삭제:", revenueCode)
  }

  // Group by category for tree structure
  const categories = [...new Set(revenueCodes.map(code => code.category))]
  const treeData = categories.map(category => ({
    id: category,
    name: category,
    children: revenueCodes
      .filter(code => code.category === category)
      .map(code => ({
        id: code.id,
        name: `${code.code} - ${code.name}`,
        type: code.category,
        data: code
      }))
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
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
    <BaseInfoLayout
      title="수익코드 관리"
      description="병원 수익 분류 체계를 관리하고 코드별 단가를 설정합니다."
      treeData={treeData}
      selectedItem={selectedRevenueCode ? { id: selectedRevenueCode.id, name: selectedRevenueCode.name, data: selectedRevenueCode } : null}
      onItemSelect={(item) => setSelectedRevenueCode(item.data)}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data)}
      onDelete={(item) => handleDelete(item.data)}
      searchPlaceholder="수익코드 검색..."
    >
      {selectedRevenueCode ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedRevenueCode.status)}>
                    {getStatusText(selectedRevenueCode.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedRevenueCode.category}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">수익코드</Label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input id="code" value={selectedRevenueCode.code} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">코드명</Label>
                  <Input id="name" value={selectedRevenueCode.name} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" value={selectedRevenueCode.description} readOnly rows={2} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">담당부서</Label>
                  <Input id="department" value={selectedRevenueCode.department} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">시행일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input id="effectiveDate" value={selectedRevenueCode.effectiveDate} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">만료일</Label>
                  <Input id="expiryDate" value={selectedRevenueCode.expiryDate || '없음'} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">가격 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">단가</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="unitPrice" 
                      value={formatCurrency(selectedRevenueCode.unitPrice)} 
                      readOnly 
                      className="font-semibold text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingType">과금 방식</Label>
                  <Input id="billingType" value={getBillingTypeText(selectedRevenueCode.billingType)} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 실적 정보 */}
          {selectedRevenueCode.status === 'active' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">월간 실적</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      월간 수익
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedRevenueCode.monthlyRevenue || 0)}
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Tag className="h-4 w-4" />
                      사용 횟수
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedRevenueCode.usageCount || 0}회
                    </div>
                  </div>
                </div>
                
                {selectedRevenueCode.usageCount && selectedRevenueCode.usageCount > 0 && (
                  <div className="p-4 border border-border rounded-lg bg-primary/5">
                    <div className="text-sm text-muted-foreground mb-1">건당 평균 수익</div>
                    <div className="text-lg font-semibold text-primary">
                      {formatCurrency((selectedRevenueCode.monthlyRevenue || 0) / selectedRevenueCode.usageCount)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 수정 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              가격 이력
            </Button>
            <Button>
              코드 수정
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">수익코드를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 수익코드를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
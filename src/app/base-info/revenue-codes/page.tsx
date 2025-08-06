"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { RevenueCodeTable } from "@/components/tables/revenue-code-table"
import { RevenueCode } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { TrendingUp, Calendar, Tag, Edit2, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    is_active: true,
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "외과",
    createdAt: "2025-01-15",
    updatedAt: "2025-07-20",
    monthlyRevenue: 4500000,
    usageCount: 3,
    majorCategory: "수술료",
    minorCategory: "소화기계수술",
    feeType: "주수가",
    paymentType: "건강보험",
    ediCode: "Q2831",
    relativeValue: 3250.5
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
    is_active: true,
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "진단검사의학과",
    createdAt: "2025-01-10",
    updatedAt: "2025-06-15",
    monthlyRevenue: 875000,
    usageCount: 25,
    majorCategory: "검사료",
    minorCategory: "임상병리검사",
    feeType: "주수가",
    paymentType: "건강보험",
    ediCode: "C3901",
    relativeValue: 125.8
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
    is_active: true,
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "영상의학과",
    createdAt: "2025-01-12",
    updatedAt: "2025-07-10",
    monthlyRevenue: 2240000,
    usageCount: 8,
    majorCategory: "영상진단료",
    minorCategory: "CT검사",
    feeType: "주수가",
    paymentType: "건강보험",
    ediCode: "G2101",
    relativeValue: 892.3
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
    is_active: true,
    effectiveDate: "2025-01-01",
    expiryDate: null,
    department: "병동관리팀",
    createdAt: "2025-01-08",
    updatedAt: "2025-05-20",
    monthlyRevenue: 2550000,
    usageCount: 30,
    majorCategory: "입원료",
    minorCategory: "일반병상입원료",
    feeType: "주수가",
    paymentType: "건강보험",
    ediCode: "R0011",
    relativeValue: 285.7
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
    is_active: false,
    effectiveDate: "2025-09-01",
    expiryDate: "2026-08-31",
    department: "약제팀",
    createdAt: "2025-07-25",
    updatedAt: "2025-07-30",
    monthlyRevenue: 0,
    usageCount: 0,
    majorCategory: "약제료",
    minorCategory: "전문의약품비",
    feeType: "주수가",
    paymentType: "건강보험",
    ediCode: "A0142",
    relativeValue: 45.2
  }
]

export default function RevenueCodesPage() {
  const [revenueCodes, setRevenueCodes] = useState<RevenueCode[]>(mockRevenueCodes)
  const [selectedRevenueCode, setSelectedRevenueCode] = useState<RevenueCode | null>(null)
  const [showTable, setShowTable] = useState(true)
  const [showListView, setShowListView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<RevenueCode | null>(null)

  const handleAdd = () => {
    console.log("수가코드 추가")
    setSelectedRevenueCode(null)
    setShowTable(false)
    setShowListView(false)
  }

  const handleEdit = (revenueCode: RevenueCode) => {
    setSelectedRevenueCode(revenueCode)
    setShowTable(false)
    setShowListView(false)
  }

  const handleDelete = (revenueCode: RevenueCode) => {
    if (confirm(`정말로 '${revenueCode.name}' 수가코드를 삭제하시겠습니까?`)) {
      setRevenueCodes(revenueCodes.filter(code => code.id !== revenueCode.id))
      if (selectedRevenueCode?.id === revenueCode.id) {
        setSelectedRevenueCode(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: any) => {
    setSelectedRevenueCode(item.data)
    setShowTable(false)
    setShowListView(false)
  }

  const handleShowList = () => {
    setShowListView(true)
    setSelectedRevenueCode(null)
    setShowTable(true)
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditStart = () => {
    if (selectedRevenueCode) {
      setEditFormData({...selectedRevenueCode})
      setIsEditing(true)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEditSave = () => {
    if (editFormData && selectedRevenueCode) {
      setRevenueCodes(revenueCodes.map(code => 
        code.id === selectedRevenueCode.id ? editFormData : code
      ))
      setSelectedRevenueCode(editFormData)
      setIsEditing(false)
      setEditFormData(null)
    }
  }

  const handleFieldChange = (field: keyof RevenueCode, value: any) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value
      })
    }
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

  const getActiveStatusColor = (isActive?: boolean) => {
    return isActive ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }

  const getActiveStatusText = (isActive?: boolean) => {
    return isActive ? '활성' : '비활성'
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
      title="수가코드 관리"
      description="병원 수가 분류 체계를 관리하고 코드별 단가를 설정합니다."
      treeData={treeData}
      selectedItem={selectedRevenueCode ? { id: selectedRevenueCode.id, name: selectedRevenueCode.name, data: selectedRevenueCode } : null}
      onItemSelect={handleItemSelect}
      onShowList={handleShowList}
      showListView={showListView}
      listViewComponent={
        <RevenueCodeTable
          revenueCodes={revenueCodes}
          onRowClick={(revenueCode) => {
            setSelectedRevenueCode(revenueCode)
            setShowListView(false)
            setShowTable(false)
          }}
          onAdd={(data) => {
            const newRevenueCode: RevenueCode = {
              id: `${revenueCodes.length + 1}`,
              hospital_id: '1',
              period_id: '1',
              code: data.code,
              name: data.name,
              description: data.description,
              category: data.category,
              unit_price: data.unitPrice || 0,
              unitPrice: data.unitPrice,
              currency: data.currency || 'KRW',
              billingType: data.billingType,
              is_active: data.is_active !== false,
              effectiveDate: data.effectiveDate,
              expiryDate: data.expiryDate,
              department: data.department,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              monthlyRevenue: 0,
              usageCount: 0,
              majorCategory: data.majorCategory,
              minorCategory: data.minorCategory,
              feeType: data.feeType,
              paymentType: data.paymentType,
              ediCode: data.ediCode,
              relativeValue: data.relativeValue
            }
            setRevenueCodes([...revenueCodes, newRevenueCode])
          }}
          onEdit={(id, data) => {
            setRevenueCodes(revenueCodes.map(code => 
              code.id === id 
                ? { 
                    ...code, 
                    ...data, 
                    updated_at: new Date().toISOString() 
                  }
                : code
            ))
          }}
          onDelete={(id) => {
            if (confirm('정말로 이 수가코드를 삭제하시겠습니까?')) {
              setRevenueCodes(revenueCodes.filter(code => code.id !== id))
            }
          }}
        />
      }
      searchPlaceholder="수가코드 검색..."
    >
      {selectedRevenueCode && !showListView ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editFormData?.is_active || false}
                          onCheckedChange={(checked) => handleFieldChange('is_active', checked)}
                        />
                        <Label className="text-sm">
                          {editFormData?.is_active ? '활성' : '비활성'}
                        </Label>
                      </div>
                      <Input
                        value={editFormData?.category || ''}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-24 text-xs"
                        placeholder="카테고리"
                      />
                    </>
                  ) : (
                    <>
                      <Badge className={getActiveStatusColor(selectedRevenueCode.is_active)}>
                        {getActiveStatusText(selectedRevenueCode.is_active)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedRevenueCode.category}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">수가코드</Label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="code" 
                      value={isEditing ? (editFormData?.code || '') : selectedRevenueCode.code} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('code', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">코드명</Label>
                  <Input 
                    id="name" 
                    value={isEditing ? (editFormData?.name || '') : selectedRevenueCode.name} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('name', e.target.value)}
                  />
                </div>
              </div>
              
              {/* 수가분류 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="majorCategory">대분류명</Label>
                  <Input 
                    id="majorCategory" 
                    value={isEditing ? (editFormData?.majorCategory || '') : (selectedRevenueCode.majorCategory || '-')} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('majorCategory', e.target.value)}
                    placeholder="예: 입원료"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minorCategory">중분류명</Label>
                  <Input 
                    id="minorCategory" 
                    value={isEditing ? (editFormData?.minorCategory || '') : (selectedRevenueCode.minorCategory || '-')} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('minorCategory', e.target.value)}
                    placeholder="예: 일반병상입원료"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feeType">수가구분명</Label>
                  {isEditing ? (
                    <Select value={editFormData?.feeType} onValueChange={(value) => handleFieldChange('feeType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="수가구분 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="주수가">주수가</SelectItem>
                        <SelectItem value="비수가">비수가</SelectItem>
                        <SelectItem value="예비급여">예비급여</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="feeType" value={selectedRevenueCode.feeType || '-'} readOnly />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentType">지불유형명</Label>
                  {isEditing ? (
                    <Select value={editFormData?.paymentType} onValueChange={(value) => handleFieldChange('paymentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="지불유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="건강보험">건강보험</SelectItem>
                        <SelectItem value="비급여">비급여</SelectItem>
                        <SelectItem value="전액본인부담">전액본인부담</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="paymentType" value={selectedRevenueCode.paymentType || '-'} readOnly />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ediCode">EDI코드</Label>
                  <Input 
                    id="ediCode" 
                    value={isEditing ? (editFormData?.ediCode || '') : (selectedRevenueCode.ediCode || '-')} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('ediCode', e.target.value)}
                    placeholder="예: Q2831"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relativeValue">상대가치점수</Label>
                  {isEditing ? (
                    <Input 
                      id="relativeValue" 
                      type="number"
                      step="0.1"
                      value={editFormData?.relativeValue || 0} 
                      onChange={(e) => handleFieldChange('relativeValue', parseFloat(e.target.value) || 0)}
                      placeholder="예: 3250.5"
                    />
                  ) : (
                    <Input 
                      id="relativeValue" 
                      value={selectedRevenueCode.relativeValue ? `${selectedRevenueCode.relativeValue}점` : '-'} 
                      readOnly 
                      className="font-medium"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={isEditing ? (editFormData?.description || '') : selectedRevenueCode.description} 
                  readOnly={!isEditing} 
                  rows={2}
                  onChange={(e) => isEditing && handleFieldChange('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">담당부서</Label>
                  <Input 
                    id="department" 
                    value={isEditing ? (editFormData?.department || '') : selectedRevenueCode.department} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('department', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">시행일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="effectiveDate" 
                      type={isEditing ? "date" : "text"}
                      value={isEditing ? (editFormData?.effectiveDate || '') : selectedRevenueCode.effectiveDate} 
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && handleFieldChange('effectiveDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">만료일</Label>
                  <Input 
                    id="expiryDate" 
                    type={isEditing ? "date" : "text"}
                    value={isEditing ? (editFormData?.expiryDate || '') : (selectedRevenueCode.expiryDate || '없음')} 
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange('expiryDate', e.target.value)}
                  />
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
                  {isEditing ? (
                    <Input 
                      id="unitPrice" 
                      type="number"
                      value={editFormData?.unitPrice || 0} 
                      onChange={(e) => handleFieldChange('unitPrice', parseInt(e.target.value) || 0)}
                      className="font-semibold"
                    />
                  ) : (
                    <Input 
                      id="unitPrice" 
                      value={formatCurrency(selectedRevenueCode.unitPrice)} 
                      readOnly 
                      className="font-semibold text-primary"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingType">과금 방식</Label>
                  {isEditing ? (
                    <Select value={editFormData?.billingType} onValueChange={(value) => handleFieldChange('billingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="과금 방식 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per-service">서비스당</SelectItem>
                        <SelectItem value="per-hour">시간당</SelectItem>
                        <SelectItem value="per-day">일당</SelectItem>
                        <SelectItem value="fixed">고정</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="billingType" value={getBillingTypeText(selectedRevenueCode.billingType)} readOnly />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 실적 정보 */}
          {selectedRevenueCode.is_active && (
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
                수가코드 수정
              </Button>
            )}
          </div>
        </div>
      ) : !showListView ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">수가코드를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 수가코드를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      ) : null}
    </BaseInfoLayout>
  )
}
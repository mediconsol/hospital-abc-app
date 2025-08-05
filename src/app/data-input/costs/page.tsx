"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Calculator, 
  TrendingUp, 
  Upload,
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  PieChart,
  BarChart3
} from "lucide-react"
import { getDepartmentsByHospitalAndPeriod, getAccountsByHospitalAndPeriod } from "@/lib/mock-data"
import type { CostInput, Account, Department } from "@/types"

// Mock cost input data
const mockCostInputs: CostInput[] = [
  {
    id: '1',
    hospital_id: '1',
    period_id: '1',
    department_id: '11',
    account_id: '1',
    amount: 4350000,
    month: 1,
    description: '내과 의사 급여',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    hospital_id: '1',
    period_id: '1',
    department_id: '11',
    account_id: '3',
    amount: 1275000,
    month: 1,
    description: '의료재료비 - 일회용품',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    hospital_id: '1',
    period_id: '1',
    department_id: '12',
    account_id: '4',
    amount: 1250000,
    month: 1,
    description: '외과 임차료 배분',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    hospital_id: '1',
    period_id: '1',
    department_id: '13',
    account_id: '5',
    amount: 450000,
    month: 1,
    description: '영상의학과 전력비',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

export default function CostDataPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedAccount, setSelectedAccount] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("1")
  const [costInputs, setCostInputs] = useState<CostInput[]>(mockCostInputs)
  const [newCostInput, setNewCostInput] = useState<Partial<CostInput>>({
    amount: 0,
    description: ''
  })
  const [activeTab, setActiveTab] = useState("input")

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const accounts = getAccountsByHospitalAndPeriod("1", "1")
  
  // Filter cost inputs
  const filteredCosts = costInputs.filter(cost => {
    return (selectedDepartment === "all" || cost.department_id === selectedDepartment) &&
           (selectedAccount === "all" || cost.account_id === selectedAccount) &&
           cost.month.toString() === selectedMonth
  })

  // Calculate statistics
  const totalCosts = filteredCosts.reduce((sum, cost) => sum + cost.amount, 0)
  const avgCostPerDept = departments.length > 0 ? totalCosts / departments.length : 0
  
  // Department-wise costs
  const deptCosts = departments.map(dept => {
    const deptTotal = costInputs
      .filter(cost => cost.department_id === dept.id && cost.month.toString() === selectedMonth)
      .reduce((sum, cost) => sum + cost.amount, 0)
    return { department: dept, total: deptTotal }
  }).sort((a, b) => b.total - a.total)

  // Account-wise costs
  const accountCosts = accounts.map(account => {
    const accountTotal = costInputs
      .filter(cost => cost.account_id === account.id && cost.month.toString() === selectedMonth)
      .reduce((sum, cost) => sum + cost.amount, 0)
    return { account, total: accountTotal }
  }).sort((a, b) => b.total - a.total)

  const getDepartmentName = (deptId: string) => {
    return departments.find(dept => dept.id === deptId)?.name || '알 수 없음'
  }

  const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || '알 수 없음'
  }

  const getAccountCategory = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.category || 'unknown'
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'salary': return 'bg-blue-100 text-blue-800'
      case 'material': return 'bg-green-100 text-green-800'
      case 'expense': return 'bg-orange-100 text-orange-800'
      case 'equipment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'salary': return '인건비'
      case 'material': return '재료비'
      case 'expense': return '경비'
      case 'equipment': return '장비비'
      default: return '기타'
    }
  }

  const handleAddCostInput = () => {
    if (selectedDepartment === "all" || selectedAccount === "all" || !newCostInput.amount) return

    const newCost: CostInput = {
      id: `new_${Date.now()}`,
      hospital_id: '1',
      period_id: '1',
      department_id: selectedDepartment,
      account_id: selectedAccount,
      amount: newCostInput.amount,
      month: parseInt(selectedMonth),
      description: newCostInput.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setCostInputs(prev => [...prev, newCost])
    setNewCostInput({ amount: 0, description: '' })
  }

  const handleDeleteCostInput = (costId: string) => {
    setCostInputs(prev => prev.filter(cost => cost.id !== costId))
  }

  const months = [
    { value: "1", label: "1월" },
    { value: "2", label: "2월" },
    { value: "3", label: "3월" },
    { value: "4", label: "4월" },
    { value: "5", label: "5월" },
    { value: "6", label: "6월" },
    { value: "7", label: "7월" },
    { value: "8", label: "8월" },
    { value: "9", label: "9월" },
    { value: "10", label: "10월" },
    { value: "11", label: "11월" },
    { value: "12", label: "12월" },
  ]

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">비용자료 관리</h1>
        <p className="text-muted-foreground">
          부서별, 계정별 비용 데이터를 입력하고 관리합니다. 회계시스템 연동으로 자동 수집도 가능합니다.
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            필터 및 제어
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">계정</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 계정" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 계정</SelectItem>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">기준월</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>데이터 연동</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Upload className="h-4 w-4 mr-1" />
                  ERP 연동
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-1" />
                  OCR 처리
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>파일 처리</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  템플릿
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Upload className="h-4 w-4 mr-1" />
                  업로드
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">비용 입력</TabsTrigger>
          <TabsTrigger value="analysis">비용 분석</TabsTrigger>
          <TabsTrigger value="summary">요약 보고서</TabsTrigger>
        </TabsList>

        {/* Cost Input Tab */}
        <TabsContent value="input" className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                비용 데이터 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>부서</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>계정</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="계정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex items-center gap-2">
                            <span>{acc.name}</span>
                            <Badge className={getCategoryBadgeColor(acc.category)}>
                              {getCategoryLabel(acc.category)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>금액</Label>
                  <Input
                    type="number"
                    placeholder="금액 입력"
                    value={newCostInput.amount || ''}
                    onChange={(e) => setNewCostInput(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>설명</Label>
                  <Input
                    placeholder="비용 설명"
                    value={newCostInput.description || ''}
                    onChange={(e) => setNewCostInput(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                  />
                </div>

                <Button 
                  onClick={handleAddCostInput} 
                  disabled={selectedDepartment === "all" || selectedAccount === "all" || !newCostInput.amount}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  비용 데이터 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cost List */}
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                비용 데이터 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-auto">
                {filteredCosts.length > 0 ? (
                  filteredCosts.map((cost) => (
                    <div key={cost.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {getDepartmentName(cost.department_id)} - {getAccountName(cost.account_id)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {cost.description}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-semibold text-primary text-lg">
                            {cost.amount.toLocaleString()}원
                          </div>
                          <Badge className={getCategoryBadgeColor(getAccountCategory(cost.account_id))}>
                            {getCategoryLabel(getAccountCategory(cost.account_id))}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {selectedMonth}월 데이터
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCostInput(cost.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <div>선택된 조건에 해당하는 비용 데이터가 없습니다</div>
                    <div className="text-sm mt-1">필터를 조정하거나 새 데이터를 입력해주세요</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                부서별 비용 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {deptCosts.slice(0, 8).map((item, index) => (
                  <div key={item.department.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.department.name}</span>
                      <span className="font-semibold text-primary">
                        {item.total.toLocaleString()}원
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${totalCosts > 0 ? (item.total / totalCosts) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      전체의 {totalCosts > 0 ? ((item.total / totalCosts) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                계정별 비용 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {accountCosts.slice(0, 8).map((item, index) => (
                  <div key={item.account.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="font-medium">{item.account.name}</span>
                        <div>
                          <Badge className={getCategoryBadgeColor(item.account.category)}>
                            {getCategoryLabel(item.account.category)}
                          </Badge>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        {item.total.toLocaleString()}원
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${totalCosts > 0 ? (item.total / totalCosts) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      전체의 {totalCosts > 0 ? ((item.total / totalCosts) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">총 비용</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalCosts.toLocaleString()}원
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">등록 건수</p>
                    <p className="text-2xl font-bold">
                      {filteredCosts.length}건
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">평균 비용</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(avgCostPerDept).toLocaleString()}원
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">데이터 품질</p>
                    <p className="text-2xl font-bold text-green-600">95%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Excel 내보내기
        </Button>
        <Button variant="outline">
          데이터 검증
        </Button>
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          배부 실행
        </Button>
      </div>
    </div>
  )
}
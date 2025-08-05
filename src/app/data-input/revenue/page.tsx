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
  TrendingUp, 
  Users, 
  Upload,
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Calendar,
  RefreshCw
} from "lucide-react"
import { getDepartmentsByHospitalAndPeriod, getRevenueCodesByHospitalAndPeriod } from "@/lib/mock-data"
import type { RevenueInput, RevenueCode, Department } from "@/types"

// Mock revenue input data
const mockRevenueInputs: RevenueInput[] = [
  {
    id: '1',
    hospital_id: '1',
    period_id: '1',
    revenue_code_id: '1',
    department_id: '11',
    quantity: 800,
    amount: 12000000,
    month: 1,
    patient_count: 600,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    hospital_id: '1',
    period_id: '1',
    revenue_code_id: '2',
    department_id: '11',
    quantity: 800,
    amount: 6400000,
    month: 1,
    patient_count: 800,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    hospital_id: '1',
    period_id: '1',
    revenue_code_id: '3',
    department_id: '13',
    quantity: 300,
    amount: 7500000,
    month: 1,
    patient_count: 280,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    hospital_id: '1',
    period_id: '1',
    revenue_code_id: '4',
    department_id: '13',
    quantity: 80,
    amount: 9600000,
    month: 1,
    patient_count: 80,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '5',
    hospital_id: '1',
    period_id: '1',
    revenue_code_id: '5',
    department_id: '12',
    quantity: 300,
    amount: 10500000,
    month: 1,
    patient_count: 300,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

export default function RevenueDataPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedRevenueCode, setSelectedRevenueCode] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("1")
  const [revenueInputs, setRevenueInputs] = useState<RevenueInput[]>(mockRevenueInputs)
  const [newRevenueInput, setNewRevenueInput] = useState<Partial<RevenueInput>>({
    quantity: 0,
    amount: 0,
    patient_count: 0
  })
  const [activeTab, setActiveTab] = useState("input")
  const [isConnecting, setIsConnecting] = useState(false)

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const revenueCodes = getRevenueCodesByHospitalAndPeriod("1", "1")
  
  // Filter revenue inputs
  const filteredRevenues = revenueInputs.filter(revenue => {
    return (selectedDepartment === "all" || (revenue.department_id || "") === selectedDepartment) &&
           (selectedRevenueCode === "all" || revenue.revenue_code_id === selectedRevenueCode) &&
           revenue.month.toString() === selectedMonth
  })

  // Calculate statistics
  const totalRevenue = filteredRevenues.reduce((sum, rev) => sum + rev.amount, 0)
  const totalQuantity = filteredRevenues.reduce((sum, rev) => sum + rev.quantity, 0)
  const totalPatients = filteredRevenues.reduce((sum, rev) => sum + (rev.patient_count || 0), 0)
  const avgRevenuePerPatient = totalPatients > 0 ? totalRevenue / totalPatients : 0
  
  // Department-wise revenue
  const deptRevenues = departments.map(dept => {
    const deptTotal = revenueInputs
      .filter(rev => (rev.department_id || "") === dept.id && rev.month.toString() === selectedMonth)
      .reduce((sum, rev) => sum + rev.amount, 0)
    const deptQuantity = revenueInputs
      .filter(rev => (rev.department_id || "") === dept.id && rev.month.toString() === selectedMonth)
      .reduce((sum, rev) => sum + rev.quantity, 0)
    return { department: dept, total: deptTotal, quantity: deptQuantity }
  }).sort((a, b) => b.total - a.total)

  // Revenue code-wise analysis
  const revenueCodeAnalysis = revenueCodes.map(code => {
    const codeRevenues = revenueInputs.filter(rev => 
      rev.revenue_code_id === code.id && rev.month.toString() === selectedMonth
    )
    const total = codeRevenues.reduce((sum, rev) => sum + rev.amount, 0)
    const quantity = codeRevenues.reduce((sum, rev) => sum + rev.quantity, 0)
    const avgPrice = quantity > 0 ? total / quantity : 0
    return { code, total, quantity, avgPrice }
  }).sort((a, b) => b.total - a.total)

  const getDepartmentName = (deptId: string) => {
    return departments.find(dept => dept.id === deptId)?.name || '알 수 없음'
  }

  const getRevenueCodeName = (codeId: string) => {
    return revenueCodes.find(code => code.id === codeId)?.name || '알 수 없음'
  }

  const getRevenueCodeCategory = (codeId: string) => {
    return revenueCodes.find(code => code.id === codeId)?.category || '기타'
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case '진료비': return 'bg-blue-100 text-blue-800'
      case '검사비': return 'bg-green-100 text-green-800'
      case '처치비': return 'bg-orange-100 text-orange-800'
      case '수술비': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddRevenueInput = () => {
    if (selectedDepartment === "all" || selectedRevenueCode === "all" || !newRevenueInput.quantity || !newRevenueInput.amount) return

    const newRevenue: RevenueInput = {
      id: `new_${Date.now()}`,
      hospital_id: '1',
      period_id: '1',
      revenue_code_id: selectedRevenueCode,
      department_id: selectedDepartment,
      quantity: newRevenueInput.quantity,
      amount: newRevenueInput.amount,
      month: parseInt(selectedMonth),
      patient_count: newRevenueInput.patient_count,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setRevenueInputs(prev => [...prev, newRevenue])
    setNewRevenueInput({ quantity: 0, amount: 0, patient_count: 0 })
  }

  const handleDeleteRevenueInput = (revenueId: string) => {
    setRevenueInputs(prev => prev.filter(rev => rev.id !== revenueId))
  }

  const handleEMRSync = async () => {
    setIsConnecting(true)
    // EMR 연동 시뮬레이션
    setTimeout(() => {
      setIsConnecting(false)
      // Add some sample data
      const newData: RevenueInput = {
        id: `emr_${Date.now()}`,
        hospital_id: '1',
        period_id: '1',
        revenue_code_id: '1',
        department_id: '11',
        quantity: 50,
        amount: 750000,
        month: parseInt(selectedMonth),
        patient_count: 45,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setRevenueInputs(prev => [...prev, newData])
    }, 2000)
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
        <h1 className="text-2xl font-bold text-foreground">수익자료 관리</h1>
        <p className="text-muted-foreground">
          의료 수익 데이터를 관리하고 분석합니다. EMR 시스템과 연동하여 실시간 수집도 가능합니다.
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
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
              <Label htmlFor="revenue-code">수익코드</Label>
              <Select value={selectedRevenueCode} onValueChange={setSelectedRevenueCode}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 코드" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 코드</SelectItem>
                  {revenueCodes.map((code) => (
                    <SelectItem key={code.id} value={code.id}>
                      {code.name} ({code.code})
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
              <Label>EMR 연동</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleEMRSync}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  {isConnecting ? '연동중...' : 'EMR 연동'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  실시간
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
          <TabsTrigger value="input">수익 입력</TabsTrigger>
          <TabsTrigger value="analysis">수익 분석</TabsTrigger>
          <TabsTrigger value="summary">요약 보고서</TabsTrigger>
        </TabsList>

        {/* Revenue Input Tab */}
        <TabsContent value="input" className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                수익 데이터 입력
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
                  <Label>수익코드</Label>
                  <Select value={selectedRevenueCode} onValueChange={setSelectedRevenueCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="수익코드 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueCodes.map((code) => (
                        <SelectItem key={code.id} value={code.id}>
                          <div className="flex items-center gap-2">
                            <span>{code.name}</span>
                            <Badge className={getCategoryBadgeColor(code.category)}>
                              {code.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>건수</Label>
                  <Input
                    type="number"
                    placeholder="실시 건수"
                    value={newRevenueInput.quantity || ''}
                    onChange={(e) => setNewRevenueInput(prev => ({ 
                      ...prev, 
                      quantity: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>수익금액</Label>
                  <Input
                    type="number"
                    placeholder="총 수익금액"
                    value={newRevenueInput.amount || ''}
                    onChange={(e) => setNewRevenueInput(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>환자수 (선택)</Label>
                  <Input
                    type="number"
                    placeholder="해당 환자수"
                    value={newRevenueInput.patient_count || ''}
                    onChange={(e) => setNewRevenueInput(prev => ({ 
                      ...prev, 
                      patient_count: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>단가 (자동계산)</Label>
                  <Input
                    value={newRevenueInput.quantity && newRevenueInput.amount 
                      ? Math.round(newRevenueInput.amount / newRevenueInput.quantity).toLocaleString() + '원'
                      : '0원'
                    }
                    disabled
                  />
                </div>

                <Button 
                  onClick={handleAddRevenueInput} 
                  disabled={selectedDepartment === "all" || selectedRevenueCode === "all" || !newRevenueInput.quantity || !newRevenueInput.amount}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  수익 데이터 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Revenue List */}
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                수익 데이터 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-auto">
                {filteredRevenues.length > 0 ? (
                  filteredRevenues.map((revenue) => (
                    <div key={revenue.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {getDepartmentName(revenue.department_id || "")} - {getRevenueCodeName(revenue.revenue_code_id || "")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getRevenueCodeCategory(revenue.revenue_code_id || "")}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-semibold text-primary text-lg">
                            {revenue.amount.toLocaleString()}원
                          </div>
                          <Badge className={getCategoryBadgeColor(getRevenueCodeCategory(revenue.revenue_code_id))}>
                            {getRevenueCodeCategory(revenue.revenue_code_id)}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">건수</span>
                          <div className="font-semibold">{revenue.quantity.toLocaleString()}건</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">단가</span>
                          <div className="font-semibold text-green-600">
                            {Math.round(revenue.amount / revenue.quantity).toLocaleString()}원
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">환자수</span>
                          <div className="font-semibold">{revenue.patient_count || 0}명</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {selectedMonth}월 데이터
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRevenueInput(revenue.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <div>선택된 조건에 해당하는 수익 데이터가 없습니다</div>
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
                부서별 수익 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {deptRevenues.slice(0, 8).map((item, index) => (
                  <div key={item.department.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.department.name}</span>
                      <span className="font-semibold text-primary">
                        {item.total.toLocaleString()}원
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>건수: {item.quantity.toLocaleString()}건</span>
                      <span>건당: {item.quantity > 0 ? Math.round(item.total / item.quantity).toLocaleString() : 0}원</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${totalRevenue > 0 ? (item.total / totalRevenue) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Code Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                수익코드별 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {revenueCodeAnalysis.slice(0, 8).map((item, index) => (
                  <div key={item.code.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="font-medium">{item.code.name}</span>
                        <div>
                          <Badge className={getCategoryBadgeColor(item.code.category)}>
                            {item.code.category}
                          </Badge>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        {item.total.toLocaleString()}원
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>건수: {item.quantity.toLocaleString()}건</span>
                      <span>평균단가: {Math.round(item.avgPrice).toLocaleString()}원</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${totalRevenue > 0 ? (item.total / totalRevenue) * 100 : 0}%` }}
                      />
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
                    <p className="text-sm font-medium text-muted-foreground">총 수익</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalRevenue.toLocaleString()}원
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
                    <p className="text-sm font-medium text-muted-foreground">총 건수</p>
                    <p className="text-2xl font-bold">
                      {totalQuantity.toLocaleString()}건
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">환자수</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalPatients.toLocaleString()}명
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">환자당 수익</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(avgRevenuePerPatient).toLocaleString()}원
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
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
          <Activity className="h-4 w-4 mr-2" />
          원가배분 실행
        </Button>
      </div>
    </div>
  )
}
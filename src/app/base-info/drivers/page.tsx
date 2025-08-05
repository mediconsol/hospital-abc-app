"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { DriverTable } from "@/components/tables/driver-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calculator, Target, TrendingUp, BarChart3, Clock, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, Settings, Ruler, Hash, Users, Activity } from "lucide-react"
import {
  Driver as NewDriver,
  DriverValue,
  DriverCategory,
  DriverBasis,
  mockDrivers as newMockDrivers,
  mockDriverValues,
  driverCategoryLabels,
  driverBasisLabels,
  getDriverValuesByDriver,
  calculateAllocationRatios,
  validateDriverValues
} from "@/lib/driver-data"
import { getDepartmentsByHospitalAndPeriod, getActivitiesByHospitalAndPeriod } from "@/lib/mock-data"
import { getFinalCostObjects } from "@/lib/cost-object-data"

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

// Mock data
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "병상 이용률",
    code: "BED_UTIL",
    description: "병상의 실제 사용률을 측정하여 병실 관련 간접비 배분",
    type: "quantitative",
    category: "direct",
    unit: "%",
    measurementMethod: "재원일수 / (총 병상수 × 일수) × 100",
    frequency: "daily",
    status: "active",
    departments: ["내과병동", "외과병동", "소아과병동"],
    activities: ["병실관리", "간병서비스", "병동운영"],
    costAllocation: {
      method: "weighted",
      weights: {
        "내과병동": 0.4,
        "외과병동": 0.35,
        "소아과병동": 0.25
      }
    },
    currentValue: 78.5,
    targetValue: 85.0,
    variance: -6.5,
    createdAt: "2025-01-10",
    updatedAt: "2025-08-01"
  },
  {
    id: "2",
    name: "수술 건수",
    code: "SURGERY_COUNT",
    description: "월간 수술 건수를 기준으로 수술실 운영비 배분",
    type: "quantitative",
    category: "direct",
    unit: "건",
    measurementMethod: "월간 실시된 총 수술 건수",
    frequency: "monthly",
    status: "active",
    departments: ["외과", "정형외과", "신경외과", "산부인과"],
    activities: ["수술실운영", "마취관리", "수술준비"],
    costAllocation: {
      method: "activity-based",
      weights: {
        "외과": 0.35,
        "정형외과": 0.25,
        "신경외과": 0.25,
        "산부인과": 0.15
      }
    },
    currentValue: 145,
    targetValue: 160,
    variance: -15,
    createdAt: "2025-01-15",
    updatedAt: "2025-07-28"
  },
  {
    id: "3",
    name: "FTE 근무시간",
    code: "FTE_HOURS",
    description: "전일제 환산 근무시간을 기준으로 인건비 배분",
    type: "time-based",
    category: "indirect",
    unit: "시간",
    measurementMethod: "월간 총 근무시간 × FTE 비율",
    frequency: "monthly",
    status: "active",
    departments: ["간호팀", "의료진", "행정팀"],
    activities: ["환자간호", "진료활동", "행정업무"],
    costAllocation: {
      method: "equal"
    },
    currentValue: 1840,
    targetValue: 1800,
    variance: 40,
    createdAt: "2025-01-20",
    updatedAt: "2025-07-30"
  },
  {
    id: "4",
    name: "검사 건수",
    code: "LAB_COUNT",
    description: "임상검사 건수를 기준으로 검사실 운영비 배분",
    type: "quantitative",
    category: "direct",
    unit: "건",
    measurementMethod: "월간 실시된 총 임상검사 건수",
    frequency: "daily",
    status: "active",
    departments: ["진단검사의학과", "병리과", "영상의학과"],
    activities: ["혈액검사", "조직검사", "영상촬영"],
    costAllocation: {
      method: "weighted",
      weights: {
        "진단검사의학과": 0.5,
        "병리과": 0.2,
        "영상의학과": 0.3
      }
    },
    currentValue: 2340,
    targetValue: 2200,
    variance: 140,
    createdAt: "2025-02-01",
    updatedAt: "2025-07-25"
  },
  {
    id: "5",
    name: "전력사용량",
    code: "POWER_USAGE",
    description: "부서별 전력사용량을 기준으로 유틸리티 비용 배분",
    type: "resource-based",
    category: "overhead",
    unit: "kWh",
    measurementMethod: "부서별 월간 전력 사용량",
    frequency: "monthly",
    status: "testing",
    departments: ["전체부서"],
    activities: ["시설운영", "장비가동", "조명냉난방"],
    costAllocation: {
      method: "equal"
    },
    currentValue: 15680,
    targetValue: 14000,
    variance: 1680,
    createdAt: "2025-07-01",
    updatedAt: "2025-07-31"
  }
]

// Driver 값 입력 폼 컴포넌트
interface DriverValueFormProps {
  driver: NewDriver
  value?: DriverValue
  onSave: (value: Partial<DriverValue>) => void
  onCancel: () => void
}

function DriverValueForm({ driver, value, onSave, onCancel }: DriverValueFormProps) {
  const [formData, setFormData] = useState({
    source_id: value?.source_id || "",
    source_type: value?.source_type || "department" as const,
    value: value?.value || 0,
    period_month: value?.period_month || 1,
    description: value?.description || ""
  })

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const activities = getActivitiesByHospitalAndPeriod("1", "1")

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: value?.id || `dv_${Date.now()}`,
      driver_id: driver.id,
      created_at: value?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  const getSourceOptions = () => {
    switch (formData.source_type) {
      case "department":
        return departments.map(dept => ({ id: dept.id, name: dept.name }))
      case "activity":
        return activities.map(act => ({ id: act.id, name: act.name }))
      case "account":
        return [
          { id: "electricity_common", name: "전기료(공통)" },
          { id: "meal_materials", name: "급식재료비" },
          { id: "prescription_drugs", name: "처방의약품비" }
        ]
      case "revenue":
        return [
          { id: "health_checkup_revenue", name: "건강검진수익" }
        ]
      default:
        return []
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source_type">소스 타입 *</Label>
          <Select 
            value={formData.source_type} 
            onValueChange={(value: "department" | "activity" | "account" | "revenue") => 
              setFormData(prev => ({ ...prev, source_type: value, source_id: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="department">부서</SelectItem>
              <SelectItem value="activity">활동</SelectItem>
              <SelectItem value="account">계정</SelectItem>
              <SelectItem value="revenue">수익</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source_id">소스 선택 *</Label>
          <Select value={formData.source_id} onValueChange={(value) => setFormData(prev => ({ ...prev, source_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="소스를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {getSourceOptions().map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">드라이버 값 *</Label>
          <div className="relative">
            <Input
              id="value"
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              placeholder="값을 입력하세요"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {driver.unit}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period_month">기준월</Label>
          <Select 
            value={formData.period_month.toString()} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, period_month: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">연간</SelectItem>
              <SelectItem value="1">1월</SelectItem>
              <SelectItem value="2">2월</SelectItem>
              <SelectItem value="3">3월</SelectItem>
              <SelectItem value="4">4월</SelectItem>
              <SelectItem value="5">5월</SelectItem>
              <SelectItem value="6">6월</SelectItem>
              <SelectItem value="7">7월</SelectItem>
              <SelectItem value="8">8월</SelectItem>
              <SelectItem value="9">9월</SelectItem>
              <SelectItem value="10">10월</SelectItem>
              <SelectItem value="11">11월</SelectItem>
              <SelectItem value="12">12월</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="드라이버 값에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!formData.source_id || formData.value <= 0}
        >
          {value ? "수정" : "추가"}
        </Button>
      </div>
    </div>
  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showTable, setShowTable] = useState(true)
  const [activeTab, setActiveTab] = useState("drivers")

  // 새로운 배분기준 상세 설정 상태
  const [selectedNewDriver, setSelectedNewDriver] = useState<string>("driver_area_001")
  const [selectedCategory, setSelectedCategory] = useState<DriverCategory | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [valueTab, setValueTab] = useState("values")
  const [isValueFormOpen, setIsValueFormOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<DriverValue | undefined>()

  const handleAdd = () => {
    console.log("드라이버 추가")
    setSelectedDriver(null)
    setShowTable(false)
  }

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver)
    setShowTable(false)
  }

  const handleDelete = (driver: Driver) => {
    if (confirm(`정말로 '${driver.name}' 드라이버를 삭제하시겠습니까?`)) {
      setDrivers(drivers.filter(drv => drv.id !== driver.id))
      if (selectedDriver?.id === driver.id) {
        setSelectedDriver(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: any) => {
    setSelectedDriver(item.data)
    setShowTable(false)
  }

  // Group by category for tree structure
  const categories = [...new Set(drivers.map(driver => driver.category))]
  const categoryNames = {
    direct: "직접 동인",
    indirect: "간접 동인", 
    overhead: "일반관리비 동인"
  }

  const treeData = categories.map(category => ({
    id: category,
    name: categoryNames[category as keyof typeof categoryNames],
    children: drivers
      .filter(driver => driver.category === category)
      .map(driver => ({
        id: driver.id,
        name: `${driver.code} - ${driver.name}`,
        type: driver.category,
        data: driver
      }))
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'testing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
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

  // 새로운 드라이버 관련 데이터 및 함수들
  const newDrivers = newMockDrivers
  const allDriverValues = mockDriverValues
  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const activities = getActivitiesByHospitalAndPeriod("1", "1")
  const costObjects = getFinalCostObjects()

  // 필터링된 새 드라이버들
  const filteredNewDrivers = newDrivers.filter(driver => {
    if (selectedCategory !== "all" && driver.category !== selectedCategory) return false
    if (showActiveOnly && !driver.is_active) return false
    if (searchTerm && !driver.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // 선택된 새 드라이버 정보
  const currentNewDriver = newDrivers.find(d => d.id === selectedNewDriver)
  const currentDriverValues = getDriverValuesByDriver(selectedNewDriver)
  const allocationPreview = calculateAllocationRatios(selectedNewDriver)
  const validation = validateDriverValues(currentDriverValues)

  // 이름 변환 함수들
  const getSourceName = (sourceId: string, sourceType: string) => {
    switch (sourceType) {
      case "department":
        return departments.find(d => d.id === sourceId)?.name || `부서-${sourceId}`
      case "activity":
        return activities.find(a => a.id === sourceId)?.name || `활동-${sourceId}`
      case "account":
        const accountMap: Record<string, string> = {
          "electricity_common": "전기료(공통)",
          "meal_materials": "급식재료비",
          "prescription_drugs": "처방의약품비"
        }
        return accountMap[sourceId] || `계정-${sourceId}`
      case "revenue":
        return sourceId === "health_checkup_revenue" ? "건강검진수익" : `수익-${sourceId}`
      default:
        return sourceId
    }
  }

  const getSourceTypeLabel = (sourceType: string) => {
    const labels: Record<string, string> = {
      "department": "부서",
      "activity": "활동",
      "account": "계정", 
      "revenue": "수익"
    }
    return labels[sourceType] || sourceType
  }

  const getCategoryIcon = (category: DriverCategory) => {
    switch (category) {
      case "area": return <Ruler className="h-4 w-4" />
      case "time": return <Clock className="h-4 w-4" />
      case "patient": return <Users className="h-4 w-4" />
      case "volume": return <Hash className="h-4 w-4" />
      case "revenue": return <TrendingUp className="h-4 w-4" />
      case "headcount": return <Users className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getBasisBadgeColor = (basis: DriverBasis) => {
    switch (basis) {
      case "causal": return "bg-blue-100 text-blue-800"
      case "benefit": return "bg-green-100 text-green-800"
      case "ability": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddValue = () => {
    setEditingValue(undefined)
    setIsValueFormOpen(true)
  }

  const handleEditValue = (value: DriverValue) => {
    setEditingValue(value)
    setIsValueFormOpen(true)
  }

  const handleSaveValue = (valueData: Partial<DriverValue>) => {
    console.log("Save driver value:", valueData)
    setIsValueFormOpen(false)
    setEditingValue(undefined)
  }

  const handleDeleteValue = (value: DriverValue) => {
    console.log("Delete driver value:", value)
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">드라이버 설정</h1>
          <p className="text-muted-foreground">
            원가동인을 설정하고 배분 기준을 관리합니다.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drivers">드라이버 관리</TabsTrigger>
          <TabsTrigger value="values">배분기준 상세 설정</TabsTrigger>
        </TabsList>

        {/* 기존 드라이버 관리 탭 */}
        <TabsContent value="drivers" className="flex-1">
          <BaseInfoLayout
            title=""
            description=""
            treeData={treeData}
            selectedItem={selectedDriver ? { id: selectedDriver.id, name: selectedDriver.name, data: selectedDriver } : null}
            onItemSelect={handleItemSelect}
            onAdd={handleAdd}
            onEdit={(item) => handleEdit(item.data as Driver)}
            onDelete={(item) => handleDelete(item.data as Driver)}
            searchPlaceholder="드라이버 검색..."
          >
            {showTable ? (
        <DriverTable
          drivers={drivers}
          onAdd={(data) => {
            const newDriver: Driver = {
              id: `${drivers.length + 1}`,
              name: data.name,
              code: data.code,
              description: data.description,
              type: data.type,
              category: data.category,
              unit: data.unit,
              measurementMethod: data.measurementMethod,
              frequency: data.frequency,
              status: data.status || 'testing',
              departments: data.departments || [],
              activities: data.activities || [],
              costAllocation: data.costAllocation || { method: 'equal' },
              currentValue: data.currentValue,
              targetValue: data.targetValue,
              variance: data.variance,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            setDrivers([...drivers, newDriver])
          }}
          onEdit={(id, data) => {
            setDrivers(drivers.map(driver => 
              driver.id === id 
                ? { 
                    ...driver, 
                    ...data, 
                    updatedAt: new Date().toISOString() 
                  }
                : driver
            ))
          }}
          onDelete={(id) => {
            if (confirm('정말로 이 드라이버를 삭제하시겠습니까?')) {
              setDrivers(drivers.filter(driver => driver.id !== id))
            }
          }}
        />
      ) : selectedDriver ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">드라이버 정보</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedDriver.status)}>
                    {getStatusText(selectedDriver.status)}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeText(selectedDriver.type)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">드라이버 코드</Label>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <Input id="code" value={selectedDriver.code} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">드라이버명</Label>
                  <Input id="name" value={selectedDriver.name} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" value={selectedDriver.description} readOnly rows={2} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">측정 단위</Label>
                  <Input id="unit" value={selectedDriver.unit} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">측정 주기</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input id="frequency" value={getFrequencyText(selectedDriver.frequency)} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">측정 방법</Label>
                  <Input id="method" value={selectedDriver.measurementMethod} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 성과 지표 */}
          {selectedDriver.currentValue !== undefined && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">성과 지표</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <BarChart3 className="h-4 w-4" />
                      현재 값
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedDriver.currentValue.toLocaleString()} {selectedDriver.unit}
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Target className="h-4 w-4" />
                      목표 값
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedDriver.targetValue?.toLocaleString()} {selectedDriver.unit}
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      차이
                    </div>
                    <div className={`text-2xl font-bold ${getVarianceColor(selectedDriver.variance || 0)}`}>
                      {selectedDriver.variance && selectedDriver.variance > 0 ? '+' : ''}
                      {selectedDriver.variance?.toLocaleString()} {selectedDriver.unit}
                    </div>
                  </div>
                </div>
                
                {selectedDriver.targetValue && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>목표 달성률</span>
                      <span className="font-medium">
                        {Math.round(getProgressValue(selectedDriver.currentValue, selectedDriver.targetValue))}%
                      </span>
                    </div>
                    <Progress 
                      value={getProgressValue(selectedDriver.currentValue, selectedDriver.targetValue)} 
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 배분 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">배분 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>적용 부서</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedDriver.departments.map((dept) => (
                      <Badge key={dept} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>관련 활동</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedDriver.activities.map((activity) => (
                      <Badge key={activity} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>배분 방법</Label>
                <Input 
                  value={
                    selectedDriver.costAllocation.method === 'equal' ? '균등 배분' :
                    selectedDriver.costAllocation.method === 'weighted' ? '가중 배분' :
                    selectedDriver.costAllocation.method === 'activity-based' ? '활동기준 배분' : '알 수 없음'
                  } 
                  readOnly 
                />
              </div>
              
              {selectedDriver.costAllocation.weights && (
                <div className="space-y-2">
                  <Label>배분 가중치</Label>
                  <div className="space-y-2">
                    {Object.entries(selectedDriver.costAllocation.weights).map(([key, weight]) => (
                      <div key={key} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm font-medium">{key}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={weight * 100} className="w-20 h-2" />
                          <span className="text-xs font-medium w-12 text-right">
                            {(weight * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 수정 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              측정 이력
            </Button>
            <Button>
              드라이버 수정
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">드라이버를 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 드라이버를 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
          </BaseInfoLayout>
        </TabsContent>

        {/* 새로운 배분기준 상세 설정 탭 */}
        <TabsContent value="values" className="flex-1 space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">총 드라이버</p>
                    <p className="text-2xl font-bold text-primary">
                      {newDrivers.length}개
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">활성 드라이버</p>
                    <p className="text-2xl font-bold text-green-600">
                      {newDrivers.filter(d => d.is_active).length}개
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">총 드라이버 값</p>
                    <p className="text-2xl font-bold">
                      {allDriverValues.length}개
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">현재 드라이버</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentDriverValues.length}개
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 제어 패널 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                드라이버 선택 및 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver">배분기준 선택</Label>
                  <Select value={selectedNewDriver} onValueChange={setSelectedNewDriver}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredNewDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(driver.category)}
                            {driver.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value: DriverCategory | "all") => setSelectedCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="area">면적 기준</SelectItem>
                      <SelectItem value="time">시간 기준</SelectItem>
                      <SelectItem value="patient">환자수 기준</SelectItem>
                      <SelectItem value="volume">건수 기준</SelectItem>
                      <SelectItem value="revenue">매출 기준</SelectItem>
                      <SelectItem value="headcount">인원수 기준</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>표시 옵션</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active-only"
                      checked={showActiveOnly}
                      onCheckedChange={setShowActiveOnly}
                    />
                    <Label htmlFor="active-only" className="text-sm">활성만</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>액션</Label>
                  <Dialog open={isValueFormOpen} onOpenChange={setIsValueFormOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleAddValue} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        드라이버 값 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingValue ? "드라이버 값 수정" : "드라이버 값 추가"}
                        </DialogTitle>
                      </DialogHeader>
                      {currentNewDriver && (
                        <DriverValueForm
                          driver={currentNewDriver}
                          value={editingValue}
                          onSave={handleSaveValue}
                          onCancel={() => setIsValueFormOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 드라이버 정보 및 값 관리 */}
          {currentNewDriver && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 드라이버 정보 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getCategoryIcon(currentNewDriver.category)}
                    드라이버 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">이름</div>
                      <div className="font-semibold">{currentNewDriver.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">코드</div>
                      <div className="font-mono text-sm">{currentNewDriver.code}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">카테고리</div>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getCategoryIcon(currentNewDriver.category)}
                        {driverCategoryLabels[currentNewDriver.category]}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">선정 기준</div>
                      <Badge className={getBasisBadgeColor(currentNewDriver.basis)}>
                        {driverBasisLabels[currentNewDriver.basis]}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">단위</div>
                      <div className="font-semibold">{currentNewDriver.unit}</div>
                    </div>
                    {currentNewDriver.description && (
                      <div>
                        <div className="text-sm text-muted-foreground">설명</div>
                        <div className="text-sm">{currentNewDriver.description}</div>
                      </div>
                    )}
                  </div>

                  {/* 검증 상태 */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">검증 상태</div>
                    <div className="space-y-2">
                      {validation.isValid ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">유효한 드라이버 값</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">검증 오류</span>
                        </div>
                      )}
                      {validation.errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-600 ml-6">
                          • {error}
                        </div>
                      ))}
                      {validation.warnings.map((warning, index) => (
                        <div key={index} className="text-xs text-orange-600 ml-6">
                          • {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 드라이버 값 관리 */}
              <Card className="col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    드라이버 값 관리
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={valueTab} onValueChange={setValueTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="values">값 입력</TabsTrigger>
                      <TabsTrigger value="preview">배분 프리뷰</TabsTrigger>
                    </TabsList>

                    <TabsContent value="values" className="space-y-4">
                      <div className="space-y-3 max-h-96 overflow-auto">
                        {currentDriverValues.map((value) => (
                          <Card key={value.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {getSourceTypeLabel(value.source_type)}
                                  </Badge>
                                  <span className="font-medium">
                                    {getSourceName(value.source_id, value.source_type)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">값: </span>
                                    <span className="font-semibold">
                                      {value.value.toLocaleString()} {currentNewDriver.unit}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">기간: </span>
                                    <span>{value.period_month === 0 ? "연간" : `${value.period_month}월`}</span>
                                  </div>
                                </div>
                                {value.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {value.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditValue(value)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteValue(value)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                      <div className="space-y-3">
                        {allocationPreview.map((preview, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {getSourceName(preview.source_id, preview.source_type)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {getSourceTypeLabel(preview.source_type)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-lg">
                                    {(preview.ratio * 100).toFixed(1)}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {preview.value.toLocaleString()} {currentNewDriver.unit}
                                  </div>
                                </div>
                              </div>
                              <Progress value={preview.ratio * 100} className="h-2" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
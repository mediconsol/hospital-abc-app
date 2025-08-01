"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, Target, TrendingUp, BarChart3, Clock } from "lucide-react"

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

export default function DriversPage() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [drivers] = useState<Driver[]>(mockDrivers)

  const handleAdd = () => {
    console.log("드라이버 추가")
  }

  const handleEdit = (driver: Driver) => {
    console.log("드라이버 수정:", driver)
  }

  const handleDelete = (driver: Driver) => {
    console.log("드라이버 삭제:", driver)
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

  return (
    <BaseInfoLayout
      title="드라이버 설정"
      description="원가동인을 설정하고 배분 기준을 관리합니다."
      treeData={treeData}
      selectedItem={selectedDriver ? { id: selectedDriver.id, name: selectedDriver.name, data: selectedDriver } : null}
      onItemSelect={(item) => setSelectedDriver(item.data)}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data)}
      onDelete={(item) => handleDelete(item.data)}
      searchPlaceholder="드라이버 검색..."
    >
      {selectedDriver ? (
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
  )
}
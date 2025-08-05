"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Calendar, 
  Check, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Period } from "@/types"

// Mock period data
const mockPeriods: Period[] = [
  {
    id: "1",
    hospital_id: "1",
    name: "2025년 1분기",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    is_active: true,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z"
  },
  {
    id: "2",
    hospital_id: "1", 
    name: "2024년 4분기",
    start_date: "2024-10-01",
    end_date: "2024-12-31",
    is_active: false,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z"
  },
  {
    id: "3",
    hospital_id: "1",
    name: "2024년 3분기", 
    start_date: "2024-07-01",
    end_date: "2024-09-30",
    is_active: false,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z"
  }
]

export default function PeriodSettingPage() {
  const [periods, setPeriods] = useState<Period[]>(mockPeriods)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: false
  })

  const activePeriod = periods.find(p => p.is_active)

  const handleAddPeriod = () => {
    setShowAddForm(true)
    setEditingPeriod(null)
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      is_active: false
    })
  }

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period)
    setShowAddForm(true)
    setFormData({
      name: period.name,
      start_date: period.start_date,
      end_date: period.end_date,
      is_active: period.is_active
    })
  }

  const handleSavePeriod = () => {
    if (editingPeriod) {
      // 수정
      setPeriods(prev => prev.map(p => 
        p.id === editingPeriod.id 
          ? { ...p, ...formData, updated_at: new Date().toISOString() }
          : formData.is_active ? { ...p, is_active: false } : p
      ))
    } else {
      // 추가
      const newPeriod: Period = {
        id: String(periods.length + 1),
        hospital_id: "1",
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setPeriods(prev => formData.is_active 
        ? prev.map(p => ({ ...p, is_active: false })).concat(newPeriod)
        : prev.concat(newPeriod)
      )
    }
    
    setShowAddForm(false)
    setEditingPeriod(null)
  }

  const handleActivatePeriod = (periodId: string) => {
    setPeriods(prev => prev.map(p => ({
      ...p,
      is_active: p.id === periodId
    })))
  }

  const handleDeletePeriod = (periodId: string) => {
    if (confirm("정말로 이 기간을 삭제하시겠습니까?")) {
      setPeriods(prev => prev.filter(p => p.id !== periodId))
    }
  }

  const getDaysInPeriod = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">대상기간 설정</h1>
          <p className="text-muted-foreground">
            ABC 원가계산을 수행할 회계기간을 관리하세요
          </p>
        </div>
        <Button onClick={handleAddPeriod} className="gap-2">
          <Plus className="h-4 w-4" />
          기간 추가
        </Button>
      </div>

      {/* 현재 활성 기간 */}
      {activePeriod && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              현재 활성 기간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">기간명</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{activePeriod.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">기간</Label>
                <div className="text-sm">
                  {formatDate(activePeriod.start_date)} ~ {formatDate(activePeriod.end_date)}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">기간 일수</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getDaysInPeriod(activePeriod.start_date, activePeriod.end_date)}일</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 기간 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>기간 목록</CardTitle>
          <CardDescription>
            등록된 회계기간 목록입니다. 한 번에 하나의 기간만 활성화할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {periods.map((period) => (
              <Card 
                key={period.id}
                className={`transition-all duration-200 ${
                  period.is_active 
                    ? "border-primary bg-primary/5" 
                    : "hover:shadow-sm"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{period.name}</span>
                          {period.is_active && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              활성
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(period.start_date)} ~ {formatDate(period.end_date)}
                          <span className="ml-2">
                            ({getDaysInPeriod(period.start_date, period.end_date)}일)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!period.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivatePeriod(period.id)}
                          className="gap-1"
                        >
                          <Check className="h-3 w-3" />
                          활성화
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPeriod(period)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePeriod(period.id)}
                        className="gap-1 text-destructive hover:text-destructive"
                        disabled={period.is_active}
                      >
                        <Trash2 className="h-3 w-3" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {periods.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>등록된 기간이 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 기간 추가/수정 폼 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPeriod ? "기간 수정" : "새 기간 추가"}
            </CardTitle>
            <CardDescription>
              {editingPeriod ? "기간 정보를 수정하세요" : "새로운 회계기간 정보를 입력하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">기간명</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 2025년 1분기"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">시작일</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">종료일</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active" className="flex items-center gap-2">
                  활성 기간으로 설정
                  {formData.is_active && (
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <AlertCircle className="h-3 w-3" />
                      다른 활성 기간은 자동으로 비활성화됩니다
                    </div>
                  )}
                </Label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSavePeriod}>
                {editingPeriod ? "수정" : "저장"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false)
                  setEditingPeriod(null)
                }}
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
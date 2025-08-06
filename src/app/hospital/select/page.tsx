"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Building2, Check, Plus, Search, MapPin, Phone, Users, Edit, Trash2 } from "lucide-react"
import { Hospital } from "@/types"
import { useForm } from "react-hook-form"

// 병원 정보 수정 폼 인터페이스
interface HospitalForm {
  name: string
  address: string
  phone: string
  type: string
}

// Mock hospital data
const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "가족사랑요양병원",
    address: "전북특별자치도 김제시 하동1길 13",
    phone: "063-540-1500",
    type: "요양병원",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    name: "서울아산병원",
    address: "서울특별시 송파구 올림픽로43길 88",
    phone: "02-3010-3114",
    type: "종합병원",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "서울대학교 어린이병원",
    address: "서울특별시 종로구 대학로 101",
    phone: "02-2072-3304",
    type: "전문병원",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export default function HospitalSelectPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    hospitals.find(h => h.id === "1") || null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null)

  // React Hook Form 설정
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<HospitalForm>()

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    // TODO: API 호출로 선택된 병원 정보 저장
    console.log("병원 선택됨:", hospital.name)
  }

  // 편집 모달 열기
  const handleEditHospital = (hospital: Hospital, e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    setEditingHospital(hospital)
    setShowEditForm(true)
    
    // 폼에 현재 데이터 설정
    setValue('name', hospital.name)
    setValue('address', hospital.address || '')
    setValue('phone', hospital.phone || '')
    setValue('type', hospital.type || '')
  }

  // 병원 정보 수정
  const handleUpdateHospital = (data: HospitalForm) => {
    if (!editingHospital) return

    const updatedHospital: Hospital = {
      ...editingHospital,
      name: data.name,
      address: data.address,
      phone: data.phone,
      type: data.type,
      updated_at: new Date().toISOString()
    }

    // 병원 목록 업데이트
    setHospitals(prev => prev.map(h => 
      h.id === editingHospital.id ? updatedHospital : h
    ))

    // 선택된 병원이 수정된 병원과 같다면 업데이트
    if (selectedHospital?.id === editingHospital.id) {
      setSelectedHospital(updatedHospital)
    }

    // 모달 닫기 및 상태 초기화
    setShowEditForm(false)
    setEditingHospital(null)
    reset()
    
    console.log("병원 정보 수정됨:", updatedHospital.name)
  }

  // 병원 삭제
  const handleDeleteHospital = (hospital: Hospital, e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    
    if (confirm(`정말로 "${hospital.name}"을(를) 삭제하시겠습니까?`)) {
      setHospitals(prev => prev.filter(h => h.id !== hospital.id))
      
      // 삭제된 병원이 선택된 병원이라면 선택 해제
      if (selectedHospital?.id === hospital.id) {
        setSelectedHospital(null)
      }
      
      console.log("병원 삭제됨:", hospital.name)
    }
  }

  // 편집 모달 닫기
  const handleCloseEditForm = () => {
    setShowEditForm(false)
    setEditingHospital(null)
    reset()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "종합병원": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "전문병원": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "요양병원": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "의원": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "클리닉": return "bg-pink-500/10 text-pink-600 border-pink-500/20"
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">병원 선택</h1>
          <p className="text-muted-foreground">
            ABC 원가계산을 수행할 병원을 선택하세요
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          병원 추가
        </Button>
      </div>

      {/* 현재 선택된 병원 */}
      {selectedHospital && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Check className="h-5 w-5" />
                현재 선택된 병원
              </CardTitle>
              <Badge className={getTypeColor(selectedHospital.type || "")}>
                {selectedHospital.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedHospital.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{selectedHospital.address}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedHospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">활성 상태</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>병원 목록</CardTitle>
          <CardDescription>
            관리하고 있는 병원 목록에서 선택하거나 새로운 병원을 추가하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="병원명 또는 주소로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* 병원 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHospitals.map((hospital) => (
              <Card 
                key={hospital.id}
                className={`relative group cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedHospital?.id === hospital.id 
                    ? "border-primary shadow-md bg-primary/5" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectHospital(hospital)}
              >
                {/* 편집/삭제 버튼 (호버시 표시) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => handleEditHospital(hospital, e)}
                    title="병원 정보 수정"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background text-destructive hover:text-destructive"
                    onClick={(e) => handleDeleteHospital(hospital, e)}
                    title="병원 삭제"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{hospital.name}</span>
                      </div>
                      {selectedHospital?.id === hospital.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    
                    <Badge className={getTypeColor(hospital.type || "")}>
                      {hospital.type}
                    </Badge>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{hospital.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{hospital.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHospitals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 병원 추가 폼 (간단한 예시) */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 병원 추가</CardTitle>
            <CardDescription>
              새로운 병원 정보를 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">병원명</Label>
                <Input id="name" placeholder="병원명을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">병원 유형</Label>
                <Input id="type" placeholder="종합병원, 전문병원, 의원" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" placeholder="주소를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input id="phone" placeholder="전화번호를 입력하세요" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button>저장</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 병원 정보 수정 모달 */}
      <Dialog open={showEditForm} onOpenChange={handleCloseEditForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>병원 정보 수정</DialogTitle>
            <DialogDescription>
              병원 정보를 수정하세요. 모든 필드는 필수입니다.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleUpdateHospital)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">병원명 *</Label>
                <Input
                  id="edit-name"
                  {...register("name", { required: "병원명은 필수입니다" })}
                  placeholder="병원명을 입력하세요"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">병원 유형 *</Label>
                <Select 
                  value={editingHospital?.type || ""}
                  onValueChange={(value) => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="병원 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="종합병원">종합병원</SelectItem>
                    <SelectItem value="전문병원">전문병원</SelectItem>
                    <SelectItem value="요양병원">요양병원</SelectItem>
                    <SelectItem value="의원">의원</SelectItem>
                    <SelectItem value="클리닉">클리닉</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-address">주소 *</Label>
                <Input
                  id="edit-address"
                  {...register("address", { required: "주소는 필수입니다" })}
                  placeholder="주소를 입력하세요"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">전화번호 *</Label>
                <Input
                  id="edit-phone"
                  {...register("phone", { required: "전화번호는 필수입니다" })}
                  placeholder="전화번호를 입력하세요"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEditForm}>
                취소
              </Button>
              <Button type="submit">
                수정 완료
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
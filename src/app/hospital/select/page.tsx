"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Check, Plus, Search, MapPin, Phone, Users } from "lucide-react"
import { Hospital } from "@/types"

// Mock hospital data
const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "가족사랑요양병원",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
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
  const [hospitals] = useState<Hospital[]>(mockHospitals)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    hospitals.find(h => h.id === "1") || null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    // TODO: API 호출로 선택된 병원 정보 저장
    console.log("병원 선택됨:", hospital.name)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "종합병원": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "전문병원": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "요양병원": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "의원": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
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
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedHospital?.id === hospital.id 
                    ? "border-primary shadow-md bg-primary/5" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectHospital(hospital)}
              >
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
    </div>
  )
}
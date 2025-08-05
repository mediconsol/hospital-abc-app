"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Activity,
  Building2,
  Calculator,
  Link,
  Unlink,
  Settings,
  Eye,
  Zap,
  AlertCircle
} from "lucide-react"
import {
  DriverMapping,
  MappingTemplate,
  MappingValidation,
  mockDriverMappings,
  mockMappingTemplates,
  getMappingsByDriver,
  getMappingsByRule,
  getMappingsByStage,
  validateMapping,
  syncDriverMapping,
  suggestDriverMapping
} from "@/lib/driver-mapping-data"
import { mockDrivers } from "@/lib/driver-data"
import { mockAllocationRules, AllocationStage, allocationStageLabels } from "@/lib/allocation-data"

// 매핑 생성/수정 폼 컴포넌트
interface MappingFormProps {
  mapping?: DriverMapping
  onSave: (mapping: Partial<DriverMapping>) => void
  onCancel: () => void
}

function MappingForm({ mapping, onSave, onCancel }: MappingFormProps) {
  const [formData, setFormData] = useState({
    driver_id: mapping?.driver_id || "",
    allocation_rule_id: mapping?.allocation_rule_id || "",
    mapping_type: mapping?.mapping_type || "direct" as const,
    is_active: mapping?.is_active ?? true,
    priority: mapping?.priority || 1,
    auto_sync: mapping?.mapping_config.auto_sync ?? true,
    override_ratios: mapping?.mapping_config.override_ratios ?? false
  })

  const handleSubmit = () => {
    onSave({
      ...mapping,
      ...formData,
      mapping_config: {
        auto_sync: formData.auto_sync,
        override_ratios: formData.override_ratios,
        validation_rules: ["total_ratio_100", "positive_values"]
      },
      sync_status: "out_of_sync",
      updated_at: new Date().toISOString()
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driver">배분기준 (드라이버) *</Label>
          <Select value={formData.driver_id} onValueChange={(value) => setFormData(prev => ({ ...prev, driver_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="드라이버를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {mockDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span>{driver.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {driver.code}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rule">배분규칙 *</Label>
          <Select value={formData.allocation_rule_id} onValueChange={(value) => setFormData(prev => ({ ...prev, allocation_rule_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="배분규칙을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {mockAllocationRules.map((rule) => (
                <SelectItem key={rule.id} value={rule.id}>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>{rule.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {allocationStageLabels[rule.stage]}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mapping_type">매핑 타입</Label>
          <Select value={formData.mapping_type} onValueChange={(value: "direct" | "calculated" | "manual") => setFormData(prev => ({ ...prev, mapping_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">직접 매핑</SelectItem>
              <SelectItem value="calculated">계산 매핑</SelectItem>
              <SelectItem value="manual">수동 매핑</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">우선순위</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div className="space-y-2 pt-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">활성화</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <Label className="text-sm font-medium">매핑 설정</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto_sync"
              checked={formData.auto_sync}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_sync: checked }))}
            />
            <Label htmlFor="auto_sync" className="text-sm">자동 동기화</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="override_ratios"
              checked={formData.override_ratios}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, override_ratios: checked }))}
            />
            <Label htmlFor="override_ratios" className="text-sm">비율 수동 조정 허용</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.driver_id || !formData.allocation_rule_id}>
          {mapping ? "수정" : "생성"}
        </Button>
      </div>
    </div>
  )
}

// 매핑 상세 카드 컴포넌트
interface MappingCardProps {
  mapping: DriverMapping
  validation: MappingValidation
  onEdit: (mapping: DriverMapping) => void
  onDelete: (mapping: DriverMapping) => void
  onSync: (mapping: DriverMapping) => void
}

function MappingCard({ mapping, validation, onEdit, onDelete, onSync }: MappingCardProps) {
  const driver = mockDrivers.find(d => d.id === mapping.driver_id)
  const rule = mockAllocationRules.find(r => r.id === mapping.allocation_rule_id)

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "out_of_sync":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case "synced": return "동기화됨"
      case "out_of_sync": return "동기화 필요"
      case "error": return "동기화 오류"
      default: return "알 수 없음"
    }
  }

  const getMappingTypeColor = (type: string) => {
    switch (type) {
      case "direct": return "bg-blue-100 text-blue-800"
      case "calculated": return "bg-green-100 text-green-800"
      case "manual": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={`${!mapping.is_active ? 'opacity-60' : ''} ${!validation.is_valid ? 'border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Link className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {driver?.name} → {rule?.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getMappingTypeColor(mapping.mapping_type)}>
                    {mapping.mapping_type === "direct" ? "직접" : 
                     mapping.mapping_type === "calculated" ? "계산" : "수동"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    우선순위 {mapping.priority}
                  </Badge>
                  {!mapping.is_active && (
                    <Badge variant="secondary" className="text-xs">
                      비활성
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSync(mapping)}
                disabled={mapping.sync_status === "synced"}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                동기화
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(mapping)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(mapping)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mapping Flow */}
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">드라이버</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {driver?.code} - {driver?.category}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">배분규칙</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {rule?.stage.toUpperCase()} - {rule?.method}
              </div>
            </div>
          </div>

          {/* Status and Validation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getSyncStatusIcon(mapping.sync_status)}
                <span className="text-sm font-medium">
                  {getSyncStatusText(mapping.sync_status)}
                </span>
              </div>
              {mapping.last_sync_date && (
                <div className="text-xs text-muted-foreground">
                  마지막 동기화: {new Date(mapping.last_sync_date).toLocaleString()}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">커버리지</span>
                <span className="text-sm">{validation.coverage_score}%</span>
              </div>
              <Progress value={validation.coverage_score} className="h-2" />
            </div>
          </div>

          {/* Errors and Warnings */}
          {validation.errors.length > 0 && (
            <div className="space-y-1">
              {validation.errors.map((error, index) => (
                <div key={index} className={`text-xs px-2 py-1 rounded ${
                  error.severity === "error" ? "bg-red-50 text-red-700" :
                  error.severity === "warning" ? "bg-amber-50 text-amber-700" :
                  "bg-blue-50 text-blue-700"
                }`}>
                  {error.message}
                </div>
              ))}
            </div>
          )}

          {/* Sync Errors */}
          {mapping.sync_errors && mapping.sync_errors.length > 0 && (
            <div className="space-y-1">
              {mapping.sync_errors.map((error, index) => (
                <div key={index} className="text-xs px-2 py-1 rounded bg-red-50 text-red-700">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DriverMappingPage() {
  const [selectedStage, setSelectedStage] = useState<AllocationStage | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showInactiveOnly, setShowInactiveOnly] = useState(false)
  const [selectedTab, setSelectedTab] = useState("mappings")
  
  // Dialog states
  const [isMappingFormOpen, setIsMappingFormOpen] = useState(false)
  const [editingMapping, setEditingMapping] = useState<DriverMapping | undefined>()

  // 데이터 가져오기
  const allMappings = mockDriverMappings
  const mappingTemplates = mockMappingTemplates

  // 필터링된 매핑
  const filteredMappings = allMappings.filter(mapping => {
    if (selectedStage !== "all") {
      const rule = mockAllocationRules.find(r => r.id === mapping.allocation_rule_id)
      if (rule?.stage !== selectedStage) return false
    }
    if (showInactiveOnly && mapping.is_active) return false
    if (!showInactiveOnly && !mapping.is_active) return false
    if (searchTerm) {
      const driver = mockDrivers.find(d => d.id === mapping.driver_id)
      const rule = mockAllocationRules.find(r => r.id === mapping.allocation_rule_id)
      const searchableText = `${driver?.name} ${rule?.name}`.toLowerCase()
      if (!searchableText.includes(searchTerm.toLowerCase())) return false
    }
    return true
  })

  // 통계
  const totalMappings = allMappings.length
  const activeMappings = allMappings.filter(m => m.is_active).length
  const syncedMappings = allMappings.filter(m => m.sync_status === "synced").length
  const errorMappings = allMappings.filter(m => m.sync_status === "error").length

  const handleEditMapping = (mapping: DriverMapping) => {
    setEditingMapping(mapping)
    setIsMappingFormOpen(true)
  }

  const handleAddMapping = () => {
    setEditingMapping(undefined)
    setIsMappingFormOpen(true)
  }

  const handleSaveMapping = (mappingData: Partial<DriverMapping>) => {
    console.log("Save mapping:", mappingData)
    setIsMappingFormOpen(false)
    setEditingMapping(undefined)
  }

  const handleDeleteMapping = (mapping: DriverMapping) => {
    console.log("Delete mapping:", mapping)
  }

  const handleSyncMapping = async (mapping: DriverMapping) => {
    console.log("Sync mapping:", mapping)
    try {
      const result = await syncDriverMapping(mapping.id)
      console.log("Sync result:", result)
    } catch (error) {
      console.error("Sync error:", error)
    }
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">배분기준 매핑 설정</h1>
          <p className="text-muted-foreground">
            드라이버와 배분규칙을 연결하여 자동화된 배분 시스템을 구성합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isMappingFormOpen} onOpenChange={setIsMappingFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddMapping}>
                <Plus className="h-4 w-4 mr-2" />
                매핑 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMapping ? "매핑 수정" : "매핑 추가"}
                </DialogTitle>
              </DialogHeader>
              <MappingForm
                mapping={editingMapping}
                onSave={handleSaveMapping}
                onCancel={() => setIsMappingFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="h-4 w-4" />
              총 매핑
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalMappings}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전체 등록된 매핑
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              활성 매핑
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeMappings}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              활성화된 매핑
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              동기화됨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {syncedMappings}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              동기화 완료
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              오류
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {errorMappings}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              동기화 오류
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">배분 단계</Label>
              <Select value={selectedStage} onValueChange={(value: AllocationStage | "all") => setSelectedStage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="rtr">RTR: 공통원가 정산</SelectItem>
                  <SelectItem value="rta">RTA: 활동원가 전환</SelectItem>
                  <SelectItem value="ata1">ATA1: 자기부서 지원활동</SelectItem>
                  <SelectItem value="ata2">ATA2: 타부서 지원활동</SelectItem>
                  <SelectItem value="atc">ATC: 활동원가 배부</SelectItem>
                  <SelectItem value="rtc">RTC: 자원 직접배부</SelectItem>
                  <SelectItem value="etc">ETC: 비용 직접귀속</SelectItem>
                  <SelectItem value="xtc">XTC: 수익 직접귀속</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="드라이버, 배분규칙 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>표시 옵션</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inactive-only"
                  checked={showInactiveOnly}
                  onChange={(e) => setShowInactiveOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="inactive-only" className="text-sm">비활성만</Label>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>액션</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  전체 동기화
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  템플릿 적용
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mappings">매핑 목록</TabsTrigger>
          <TabsTrigger value="templates">매핑 템플릿</TabsTrigger>
        </TabsList>

        <TabsContent value="mappings" className="flex-1 space-y-4">
          <div className="grid gap-4">
            {filteredMappings.map((mapping) => (
              <MappingCard
                key={mapping.id}
                mapping={mapping}
                validation={validateMapping(mapping)}
                onEdit={handleEditMapping}
                onDelete={handleDeleteMapping}
                onSync={handleSyncMapping}
              />
            ))}
          </div>
          {filteredMappings.length === 0 && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <div className="text-center">
                <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium mb-2">매핑이 없습니다</div>
                <div className="text-sm">필터 조건에 맞는 매핑이 없거나 등록된 매핑이 없습니다.</div>
                <Button 
                  onClick={handleAddMapping} 
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  첫 번째 매핑 추가
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="flex-1 space-y-4">
          <div className="grid gap-4">
            {mappingTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {allocationStageLabels[template.stage]}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        적용
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">권장 드라이버 카테고리:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.recommended_driver_categories.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
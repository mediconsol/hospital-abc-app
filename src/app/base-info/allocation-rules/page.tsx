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
import {
  GitBranch,
  Plus,
  Edit2,
  Trash2,
  Play,
  Settings,
  Search,
  Filter,
  ArrowRight,
  ArrowDown,
  Target,
  Activity,
  Building2,
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye
} from "lucide-react"
import {
  AllocationRule,
  AllocationScenario,
  AllocationStage,
  AllocationMethod,
  mockAllocationRules,
  mockAllocationScenarios,
  mockAllocationResults,
  allocationStageLabels,
  allocationMethodLabels
} from "@/lib/allocation-data"
import { getDepartmentsByHospitalAndPeriod, getActivitiesByHospitalAndPeriod } from "@/lib/mock-data"
import { getFinalCostObjects } from "@/lib/cost-object-data"

// 배분 룰 폼 컴포넌트
interface AllocationRuleFormProps {
  rule?: AllocationRule
  onSave: (rule: Partial<AllocationRule>) => void
  onCancel: () => void
}

function AllocationRuleForm({ rule, onSave, onCancel }: AllocationRuleFormProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    stage: rule?.stage || "rta" as AllocationStage,
    method: rule?.method || "proportional" as AllocationMethod,
    is_active: rule?.is_active ?? true,
    priority: rule?.priority || 1,
    driver_name: rule?.driver_name || ""
  })

  const handleSubmit = () => {
    // Determine source and target types based on allocation stage
    let source_type: "department" | "activity" | "account" | "revenue" = "department"
    let target_type: "department" | "activity" | "cost_object" | "account" = "activity"
    
    switch (formData.stage) {
      case "rtr":
        source_type = "account"
        target_type = "department"
        break
      case "rta":
        source_type = "department"
        target_type = "activity"
        break
      case "ata1":
      case "ata2":
        source_type = "activity"
        target_type = "activity"
        break
      case "atc":
        source_type = "activity"
        target_type = "cost_object"
        break
      case "rtc":
        source_type = "account"
        target_type = "cost_object"
        break
      case "etc":
        source_type = "account"
        target_type = "cost_object"
        break
      case "xtc":
        source_type = "revenue"
        target_type = "cost_object"
        break
    }

    onSave({
      ...formData,
      id: rule?.id || `rule_${Date.now()}`,
      source_type,
      target_type,
      source_ids: [],
      target_ids: [],
      driver_id: `driver_${Date.now()}`,
      driver_basis: "causal",
      driver_category: "other",
      allocation_ratios: [],
      created_at: rule?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">배분 규칙명 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="배분 규칙명을 입력하세요"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driver_name">배분 기준 *</Label>
          <Input
            id="driver_name"
            value={formData.driver_name}
            onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
            placeholder="예: 업무시간, 환자수, 면적 등"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="배분 규칙에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stage">배분 단계 *</Label>
          <Select value={formData.stage} onValueChange={(value: AllocationStage) => setFormData(prev => ({ ...prev, stage: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
          <Label htmlFor="method">배분 방법 *</Label>
          <Select value={formData.method} onValueChange={(value: AllocationMethod) => setFormData(prev => ({ ...prev, method: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">직접 배분</SelectItem>
              <SelectItem value="proportional">비례 배분</SelectItem>
              <SelectItem value="step_down">단계적 배분</SelectItem>
              <SelectItem value="reciprocal">상호 배분</SelectItem>
              <SelectItem value="equal">균등 배분</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">활성화</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit}>
          {rule ? "수정" : "생성"}
        </Button>
      </div>
    </div>
  )
}

export default function AllocationRulesPage() {
  const [selectedScenario, setSelectedScenario] = useState("scenario_001")
  const [selectedStage, setSelectedStage] = useState<AllocationStage | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  
  // Dialog states
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AllocationRule | undefined>()
  const [isScenarioFormOpen, setIsScenarioFormOpen] = useState(false)

  // 데이터 가져오기
  const scenarios = mockAllocationScenarios
  const allRules = mockAllocationRules
  const executionResults = mockAllocationResults
  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const activities = getActivitiesByHospitalAndPeriod("1", "1")
  const costObjects = getFinalCostObjects()

  // ID를 이름으로 변환하는 함수들
  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId)
    return dept ? dept.name : `부서-${deptId}`
  }

  const getActivityName = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId)
    return activity ? activity.name : `활동-${activityId}`
  }

  const getCostObjectName = (costObjectId: string) => {
    const costObject = costObjects.find(c => c.id === costObjectId)
    return costObject ? costObject.name : `원가대상-${costObjectId}`
  }

  const getAccountName = (accountId: string) => {
    const accountMap: Record<string, string> = {
      "electricity_common": "전기료(공통)",
      "meal_materials": "급식재료비",
      "prescription_drugs": "처방의약품비"
    }
    return accountMap[accountId] || `계정-${accountId}`
  }

  const getRevenueName = (revenueId: string) => {
    const revenueMap: Record<string, string> = {
      "health_checkup_revenue": "건강검진수익"
    }
    return revenueMap[revenueId] || `수익-${revenueId}`
  }

  const getSourceName = (rule: AllocationRule, sourceId: string) => {
    switch (rule.source_type) {
      case "department":
        return getDepartmentName(sourceId)
      case "activity":
        return getActivityName(sourceId)
      case "account":
        return getAccountName(sourceId)
      case "revenue":
        return getRevenueName(sourceId)
      default:
        return sourceId
    }
  }

  const getTargetName = (rule: AllocationRule, targetId: string) => {
    switch (rule.target_type) {
      case "department":
        return getDepartmentName(targetId)
      case "activity":
        return getActivityName(targetId)
      case "cost_object":
        return getCostObjectName(targetId)
      case "account":
        return getAccountName(targetId)
      default:
        return targetId
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

  const getTargetTypeLabel = (targetType: string) => {
    const labels: Record<string, string> = {
      "department": "부서",
      "activity": "활동", 
      "cost_object": "원가대상",
      "account": "계정"
    }
    return labels[targetType] || targetType
  }

  // 현재 시나리오의 규칙들
  const currentScenario = scenarios.find(s => s.id === selectedScenario)
  const scenarioRules = currentScenario?.allocation_rules || []

  // 필터링된 규칙들
  const filteredRules = scenarioRules.filter(rule => {
    if (selectedStage !== "all" && rule.stage !== selectedStage) return false
    if (showActiveOnly && !rule.is_active) return false
    if (searchTerm && !rule.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // 통계 계산
  const totalRules = scenarioRules.length
  const activeRules = scenarioRules.filter(rule => rule.is_active).length
  const resourceRules = scenarioRules.filter(rule => rule.stage === "rtr" || rule.stage === "rta").length
  const activityRules = scenarioRules.filter(rule => rule.stage === "ata1" || rule.stage === "ata2").length
  const allocationRules = scenarioRules.filter(rule => rule.stage === "atc").length
  const directRules = scenarioRules.filter(rule => rule.stage === "rtc" || rule.stage === "etc" || rule.stage === "xtc").length

  // 최근 실행 결과
  const latestResult = executionResults.find(r => r.scenario_id === selectedScenario)

  const handleEditRule = (rule: AllocationRule) => {
    setEditingRule(rule)
    setIsRuleFormOpen(true)
  }

  const handleAddRule = () => {
    setEditingRule(undefined)
    setIsRuleFormOpen(true)
  }

  const handleSaveRule = (ruleData: Partial<AllocationRule>) => {
    console.log("Save rule:", ruleData)
    setIsRuleFormOpen(false)
    setEditingRule(undefined)
  }

  const handleDeleteRule = (rule: AllocationRule) => {
    console.log("Delete rule:", rule)
  }

  const handleExecuteScenario = () => {
    console.log("Execute scenario:", selectedScenario)
  }

  const getStageIcon = (stage: AllocationStage) => {
    switch (stage) {
      case "rtr":
      case "rta":
        return <Building2 className="h-4 w-4" />
      case "ata1":
      case "ata2":
        return <Activity className="h-4 w-4" />
      case "atc":
        return <Target className="h-4 w-4" />
      case "rtc":
      case "etc":
      case "xtc":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <GitBranch className="h-4 w-4" />
    }
  }

  const getMethodBadgeColor = (method: AllocationMethod) => {
    switch (method) {
      case "direct": return "bg-blue-100 text-blue-800"
      case "proportional": return "bg-green-100 text-green-800"
      case "step_down": return "bg-orange-100 text-orange-800"
      case "reciprocal": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">배분단계 관리</h1>
          <p className="text-muted-foreground">
            ABC 원가 배분의 단계별 규칙과 기준을 설정하고 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExecuteScenario}>
            <Play className="h-4 w-4 mr-2" />
            배분 실행
          </Button>
          <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddRule}>
                <Plus className="h-4 w-4 mr-2" />
                배분 규칙 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? "배분 규칙 수정" : "배분 규칙 추가"}
                </DialogTitle>
              </DialogHeader>
              <AllocationRuleForm
                rule={editingRule}
                onSave={handleSaveRule}
                onCancel={() => setIsRuleFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              총 배분 규칙
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 시나리오 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              활성 규칙
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              실행 가능한 규칙
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              자원 배분
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {resourceRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              RTR + RTA 규칙
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              활동 배분
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activityRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ATA1 + ATA2 규칙
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              원가대상 배분
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allocationRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ATC 규칙
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              직접 귀속
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {directRules}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              RTC/ETC/XTC 규칙
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 옵션
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">배분 시나리오</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center gap-2">
                        {scenario.is_default && <CheckCircle className="h-3 w-3" />}
                        {scenario.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  placeholder="배분 규칙명 검색"
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
                  id="active-only"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="active-only" className="text-sm">활성만</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>액션</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  시나리오 설정
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Rules List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            배분 규칙 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRules.map((rule) => (
            <Card key={rule.id} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Rule Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          우선순위 {rule.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getStageIcon(rule.stage)}
                          <span className="ml-1">{allocationStageLabels[rule.stage]}</span>
                        </Badge>
                        <Badge className={`text-xs ${getMethodBadgeColor(rule.method)}`}>
                          {allocationMethodLabels[rule.method]}
                        </Badge>
                        {!rule.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            비활성
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        배분기준: {rule.driver_name} • {rule.allocation_ratios.length}개 배분 항목
                      </div>
                      {rule.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {rule.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log("View details:", rule)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>

                  {/* Allocation Flow */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3 text-muted-foreground">배분 흐름</div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                              {getSourceTypeLabel(rule.source_type)} ({rule.source_ids.length}개)
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rule.source_ids.slice(0, 3).map(id => getSourceName(rule, id)).join(", ")}
                            {rule.source_ids.length > 3 && ` 외 ${rule.source_ids.length - 3}개`}
                          </div>
                        </div>
                        <div className="flex items-center justify-center pt-6">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {rule.target_type === "activity" ? (
                              <Activity className="h-4 w-4 text-green-600" />
                            ) : rule.target_type === "cost_object" ? (
                              <Target className="h-4 w-4 text-green-600" />
                            ) : (
                              <Building2 className="h-4 w-4 text-green-600" />
                            )}
                            <span className="text-sm font-medium">
                              {getTargetTypeLabel(rule.target_type)} ({rule.target_ids.length}개)
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rule.target_ids.slice(0, 3).map(id => getTargetName(rule, id)).join(", ")}
                            {rule.target_ids.length > 3 && ` 외 ${rule.target_ids.length - 3}개`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Ratios Preview */}
                  {rule.allocation_ratios.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <div className="text-sm font-medium mb-3 text-muted-foreground">
                        배분 비율 상세 ({rule.driver_name} 기준)
                      </div>
                      <div className="space-y-3">
                        {rule.allocation_ratios.slice(0, 4).map((ratio, index) => (
                          <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    <span className="text-blue-600">{getSourceTypeLabel(rule.source_type)}</span>
                                    <span className="mx-1 text-gray-400">•</span>
                                    <span className="font-semibold">{getSourceName(rule, ratio.source_id)}</span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <ArrowRight className="h-3 w-3 mx-1" />
                                    <span className="text-green-600">{getTargetTypeLabel(rule.target_type)}</span>
                                    <span className="mx-1">•</span>
                                    <span className="font-medium">{getTargetName(rule, ratio.target_id)}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-sm font-bold">
                                    {(ratio.ratio * 100).toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">
                                  배분기준: {ratio.driver_value.toLocaleString()} {rule.driver_category === "area" ? "㎡" : rule.driver_category === "time" ? "시간" : rule.driver_category === "patient" ? "명" : rule.driver_category === "volume" ? "건" : "단위"}
                                </span>
                              </div>
                              <Progress value={ratio.ratio * 100} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                      {rule.allocation_ratios.length > 4 && (
                        <div className="text-center mt-3">
                          <Button variant="outline" size="sm">
                            <ArrowDown className="h-4 w-4 mr-1" />
                            {rule.allocation_ratios.length - 4}개 더 보기
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
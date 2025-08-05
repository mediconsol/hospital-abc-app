"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  Users,
  Building2,
  Stethoscope,
  UserCog,
  FolderOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import {
  CostObject,
  CostObjectType,
  getCostObjectsByType,
  buildCostObjectTree,
  costObjectTypeLabels,
  costObjectTypeColors,
  getFinalCostObjects
} from "@/lib/cost-object-data"

// 트리 아이템 컴포넌트
interface TreeItemProps {
  item: CostObject
  level: number
  expanded: Set<string>
  onToggle: (id: string) => void
  onEdit: (item: CostObject) => void
  onDelete: (item: CostObject) => void
  onAddChild: (parent: CostObject) => void
}

function TreeItem({ item, level, expanded, onToggle, onEdit, onDelete, onAddChild }: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expanded.has(item.id)
  const indent = level * 20

  const getTypeIcon = (type: CostObjectType) => {
    switch (type) {
      case "patient_care":
        return <Users className="h-4 w-4" />
      case "execution_dept":
        return <Building2 className="h-4 w-4" />
      case "prescribing_doctor":
        return <Stethoscope className="h-4 w-4" />
      case "executing_doctor":
        return <UserCog className="h-4 w-4" />
      default:
        return <FolderOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="select-none">
      <div 
        className="flex items-center py-2 px-3 hover:bg-accent/50 rounded-lg group cursor-pointer"
        style={{ paddingLeft: `${12 + indent}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="w-5 h-5 flex items-center justify-center mr-2">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-5 h-5 p-0 hover:bg-accent"
              onClick={() => onToggle(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-3 h-3" />
          )}
        </div>

        {/* Type Icon */}
        <div className="mr-3 text-muted-foreground">
          {getTypeIcon(item.type)}
        </div>

        {/* Item Info */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{item.name}</span>
              <Badge variant="outline" className="text-xs shrink-0">
                {item.code}
              </Badge>
              {item.is_final_target && (
                <Badge variant="default" className="text-xs shrink-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  최종대상
                </Badge>
              )}
              {!item.is_active && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  비활성
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {item.description}
              </p>
            )}
          </div>

          <Badge variant="secondary" className={`text-xs shrink-0 ${costObjectTypeColors[item.type]}`}>
            {costObjectTypeLabels[item.type]}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onAddChild(item)
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {item.children?.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 원가대상 폼 컴포넌트
interface CostObjectFormProps {
  costObject?: CostObject
  parentObject?: CostObject
  type: CostObjectType
  onSave: (costObject: Partial<CostObject>) => void
  onCancel: () => void
}

function CostObjectForm({ costObject, parentObject, type, onSave, onCancel }: CostObjectFormProps) {
  const [formData, setFormData] = useState({
    name: costObject?.name || "",
    code: costObject?.code || "",
    description: costObject?.description || "",
    is_active: costObject?.is_active ?? true,
    is_final_target: costObject?.is_final_target ?? false
  })

  const handleSubmit = () => {
    const newCostObject: Partial<CostObject> = {
      ...formData,
      type,
      parent_id: parentObject?.id,
      level: parentObject ? parentObject.level + 1 : 1,
      path: parentObject ? `${parentObject.path}/${Date.now()}` : `${Date.now()}`
    }

    if (costObject) {
      newCostObject.id = costObject.id
    }

    onSave(newCostObject)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">원가대상명 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="원가대상명을 입력하세요"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">원가대상코드 *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="원가대상코드를 입력하세요"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="원가대상에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>

      {parentObject && (
        <div className="p-3 bg-muted/30 rounded-lg">
          <Label className="text-sm font-medium">상위 원가대상</Label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{parentObject.code}</Badge>
            <span className="text-sm">{parentObject.name}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">활성화</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_final_target"
            checked={formData.is_final_target}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_final_target: checked }))}
          />
          <Label htmlFor="is_final_target">최종 원가대상</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit}>
          {costObject ? "수정" : "생성"}
        </Button>
      </div>
    </div>
  )
}

export default function CostObjectsPage() {
  const [selectedType, setSelectedType] = useState<CostObjectType>("patient_care")
  const [searchTerm, setSearchTerm] = useState("")
  const [showInactiveOnly, setShowInactiveOnly] = useState(false)
  const [showFinalTargetsOnly, setShowFinalTargetsOnly] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["pc1", "ed1", "pd1", "pd6", "exd1", "exd5"]))
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCostObject, setEditingCostObject] = useState<CostObject | undefined>()
  const [parentCostObject, setParentCostObject] = useState<CostObject | undefined>()

  // 데이터 가져오기
  const costObjects = getCostObjectsByType(selectedType)
  const treeData = buildCostObjectTree(costObjects)
  const finalTargets = getFinalCostObjects(costObjects)

  // 디버깅: 데이터 로드 확인 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('Selected Type:', selectedType)
    console.log('Cost Objects:', costObjects.length)
    console.log('Tree Data:', treeData.length)
  }

  // 필터링된 데이터
  const filteredData = treeData // 실제로는 검색어 및 필터 적용

  // 통계
  const totalObjects = costObjects.length
  const activeObjects = costObjects.filter(obj => obj.is_active).length
  const finalTargetCount = finalTargets.length

  const handleToggleExpand = (id: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleEdit = (costObject: CostObject) => {
    setEditingCostObject(costObject)
    setParentCostObject(undefined)
    setIsFormOpen(true)
  }

  const handleAddChild = (parent: CostObject) => {
    setEditingCostObject(undefined)
    setParentCostObject(parent)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingCostObject(undefined)
    setParentCostObject(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = (costObject: CostObject) => {
    // 삭제 확인 로직
    console.log("Delete:", costObject)
  }

  const handleSave = (costObjectData: Partial<CostObject>) => {
    console.log("Save:", costObjectData)
    setIsFormOpen(false)
    setEditingCostObject(undefined)
    setParentCostObject(undefined)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingCostObject(undefined)
    setParentCostObject(undefined)
  }

  const getTypeIcon = (type: CostObjectType) => {
    switch (type) {
      case "patient_care":
        return <Users className="h-4 w-4" />
      case "execution_dept":
        return <Building2 className="h-4 w-4" />
      case "prescribing_doctor":
        return <Stethoscope className="h-4 w-4" />
      case "executing_doctor":
        return <UserCog className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">원가대상 관리</h1>
          <p className="text-muted-foreground">
            원가정보 산출 대상을 4가지 관점으로 계층적으로 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                원가대상 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCostObject ? "원가대상 수정" : "원가대상 추가"}
                </DialogTitle>
              </DialogHeader>
              <CostObjectForm
                costObject={editingCostObject}
                parentObject={parentCostObject}
                type={selectedType}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 현재 관점 카드를 맨 앞으로 */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {getTypeIcon(selectedType)}
              현재 관점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary">
              {costObjectTypeLabels[selectedType]}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              선택된 원가대상 관점
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              총 원가대상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalObjects}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 관점의 전체 원가대상
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              활성 원가대상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeObjects}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              활성화된 원가대상
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              최종 원가대상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {finalTargetCount}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              최종 분석 대상
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 메뉴로 원가대상 관점 선택 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            원가대상 관점 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={selectedType} onValueChange={(value: string) => setSelectedType(value as CostObjectType)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="patient_care" className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                환자진료과
              </TabsTrigger>
              <TabsTrigger value="execution_dept" className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4" />
                시행과
              </TabsTrigger>
              <TabsTrigger value="prescribing_doctor" className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4" />
                처방의사
              </TabsTrigger>
              <TabsTrigger value="executing_doctor" className="flex items-center gap-2 text-sm">
                <UserCog className="h-4 w-4" />
                시행의사
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

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
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="원가대상명, 코드 검색"
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
                  id="inactive"
                  checked={showInactiveOnly}
                  onChange={(e) => setShowInactiveOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="inactive" className="text-sm">비활성만</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="final-targets"
                  checked={showFinalTargetsOnly}
                  onChange={(e) => setShowFinalTargetsOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="final-targets" className="text-sm">최종대상만</Label>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>액션</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    const allIds = new Set<string>()
                    const collectIds = (objects: CostObject[]) => {
                      objects.forEach(obj => {
                        allIds.add(obj.id)
                        if (obj.children && obj.children.length > 0) {
                          collectIds(obj.children)
                        }
                      })
                    }
                    collectIds(costObjects)
                    setExpanded(allIds)
                  }}
                >
                  전체 펼치기
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setExpanded(new Set())}
                >
                  전체 접기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree View */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {getTypeIcon(selectedType)}
            {costObjectTypeLabels[selectedType]} 계층 구조
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TreeItem
                  key={item.id}
                  item={item}
                  level={0}
                  expanded={expanded}
                  onToggle={handleToggleExpand}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                />
              ))
            ) : costObjects.length > 0 ? (
              // 트리 데이터가 비어있지만 원본 데이터가 있는 경우 - 플랫 리스트로 표시
              <div className="space-y-2">
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  ⚠️ 계층구조 빌드 오류: 플랫 리스트로 표시합니다. ({costObjects.length}개 항목)
                </div>
                {costObjects.map((item) => (
                  <TreeItem
                    key={item.id}
                    item={item}
                    level={0}
                    expanded={expanded}
                    onToggle={handleToggleExpand}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddChild={handleAddChild}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium mb-2">원가대상이 없습니다</div>
                  <div className="text-sm">선택한 관점에 등록된 원가대상이 없거나 필터 조건에 맞는 항목이 없습니다.</div>
                  <Button 
                    onClick={handleAdd} 
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    첫 번째 원가대상 추가
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
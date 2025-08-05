"use client"

import { useState, ReactNode } from "react"
import { Search, Plus, Edit2, Trash2, MoreVertical, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TreeItem {
  id: string
  name: string
  children?: TreeItem[]
  type?: string
  data?: unknown
}

interface BaseInfoLayoutProps {
  title: string
  description: string
  treeData: TreeItem[]
  selectedItem?: TreeItem | null
  onItemSelect: (item: TreeItem) => void
  onAdd: () => void
  onEdit: (item: TreeItem) => void
  onDelete: (item: TreeItem) => void
  children: ReactNode
  searchPlaceholder?: string
  customTreeRenderer?: (props: { searchTerm: string }) => ReactNode
}

interface TreeNodeProps {
  item: TreeItem
  level: number
  selectedId?: string
  onSelect: (item: TreeItem) => void
  onEdit: (item: TreeItem) => void
  onDelete: (item: TreeItem) => void
}

function TreeNode({ item, level, selectedId, onSelect, onEdit, onDelete }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
  const hasChildren = item.children && item.children.length > 0
  const isSelected = selectedId === item.id

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors group",
          isSelected && "bg-primary/10 text-primary border border-primary/20",
          "ml-" + (level * 4)
        )}
        onClick={() => onSelect(item)}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm font-medium truncate">{item.name}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit2 className="h-3 w-3 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children?.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BaseInfoLayout({
  title,
  description,
  treeData,
  selectedItem,
  onItemSelect,
  onAdd,
  onEdit,
  onDelete,
  children,
  searchPlaceholder = "검색...",
  customTreeRenderer
}: BaseInfoLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTreeData = treeData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
        {/* Tree List (1/4 width) */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">목록</CardTitle>
              <Button 
                onClick={onAdd}
                size="sm" 
                className="h-8 px-3"
              >
                <Plus className="h-3 w-3 mr-1" />
                추가
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-3">
            {customTreeRenderer ? (
              customTreeRenderer({ searchTerm })
            ) : (
              <div className="space-y-1">
                {filteredTreeData.map((item) => (
                  <TreeNode
                    key={item.id}
                    item={item}
                    level={0}
                    selectedId={selectedItem?.id}
                    onSelect={onItemSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Panel (3/4 width) */}
        <div className="col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedItem ? `${selectedItem.name} 상세정보` : "항목을 선택하세요"}
                  </CardTitle>
                  {selectedItem && (
                    <p className="text-sm text-muted-foreground mt-1">
                      선택된 항목의 정보를 확인하고 편집할 수 있습니다.
                    </p>
                  )}
                </div>
                {selectedItem && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(selectedItem)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(selectedItem)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
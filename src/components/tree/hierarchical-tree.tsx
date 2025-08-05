"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Building2, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TreeNode {
  id: string
  name: string
  code: string
  type: string
  level: number
  children: TreeNode[]
  data: any
}

interface HierarchicalTreeProps {
  data: TreeNode[]
  selectedId?: string
  onSelect: (node: TreeNode) => void
  searchTerm?: string
}

interface TreeNodeItemProps {
  node: TreeNode
  selectedId?: string
  onSelect: (node: TreeNode) => void
  searchTerm?: string
  level: number
}

function TreeNodeItem({ node, selectedId, onSelect, searchTerm, level }: TreeNodeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // 기본적으로 2단계까지 확장

  const hasChildren = node.children.length > 0
  const isSelected = selectedId === node.id
  const matchesSearch = !searchTerm || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.code.toLowerCase().includes(searchTerm.toLowerCase())

  // 검색어가 있고 매치되지 않는 경우, 자식 노드 중에 매치되는 것이 있는지 확인
  const hasMatchingChildren = searchTerm && !matchesSearch ? 
    node.children.some(child => hasMatchingChildrenRecursive(child, searchTerm)) : false

  // 검색어가 있을 때는 매치되거나 매치되는 자식이 있는 경우만 표시
  if (searchTerm && !matchesSearch && !hasMatchingChildren) {
    return null
  }

  const getIcon = (level: number) => {
    switch (level) {
      case 0: return <Building2 className="h-4 w-4" />
      case 1: return <Users className="h-4 w-4" />
      case 2: return <User className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'text-blue-700 font-semibold'
      case 1: return 'text-green-700 font-medium'
      case 2: return 'text-purple-700'
      default: return 'text-gray-700'
    }
  }

  const getBadgeColor = (type: string) => {
    return type === 'direct' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-orange-100 text-orange-800 border-orange-200'
  }

  return (
    <div>
      <div 
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors",
          "hover:bg-muted/60",
          isSelected && "bg-primary/10 border border-primary/20",
          matchesSearch && searchTerm && "bg-yellow-50"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => onSelect(node)}
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
        {!hasChildren && <div className="w-4" />}
        
        <div className="text-muted-foreground">
          {getIcon(level)}
        </div>
        
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm truncate font-medium">
              {node.name}
            </div>
            <div className="text-xs text-muted-foreground font-mono flex-shrink-0">
              {node.code}
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={cn("text-xs ml-2 flex-shrink-0", getBadgeColor(node.type))}
          >
            {node.type === 'direct' ? '직접' : '간접'}
          </Badge>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              searchTerm={searchTerm}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function hasMatchingChildrenRecursive(node: TreeNode, searchTerm: string): boolean {
  const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.code.toLowerCase().includes(searchTerm.toLowerCase())
  
  if (matchesSearch) return true
  
  return node.children.some(child => hasMatchingChildrenRecursive(child, searchTerm))
}

export function HierarchicalTree({ data, selectedId, onSelect, searchTerm }: HierarchicalTreeProps) {
  return (
    <div className="space-y-1">
      {data.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          searchTerm={searchTerm}
          level={0}
        />
      ))}
    </div>
  )
}
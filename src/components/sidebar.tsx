"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, 
  Calendar, 
  Database, 
  Upload, 
  Calculator, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  isExpanded?: boolean
}

const navigation: NavItem[] = [
  {
    title: "대시보드",
    href: "/",
    icon: Home,
  },
  {
    title: "병원 설정",
    icon: Building2,
    children: [
      { title: "병원 선택", href: "/hospital/select", icon: Building2 },
      { title: "대상기간 설정", href: "/hospital/period", icon: Calendar },
    ],
  },
  {
    title: "기초정보 관리",
    icon: Database,
    children: [
      { title: "부서 관리", href: "/base-info/departments", icon: Database },
      { title: "활동 관리", href: "/base-info/activities", icon: Database },
      { title: "계정 관리", href: "/base-info/accounts", icon: Database },
      { title: "프로세스 관리", href: "/base-info/processes", icon: Database },
      { title: "수익코드 관리", href: "/base-info/revenue-codes", icon: Database },
      { title: "드라이버 설정", href: "/base-info/drivers", icon: Database },
    ],
  },
  {
    title: "자료 입력",
    icon: Upload,
    children: [
      { title: "급여자료", href: "/data-input/salary", icon: Upload },
      { title: "업무비율", href: "/data-input/work-ratio", icon: Upload },
      { title: "비용자료", href: "/data-input/costs", icon: Upload },
      { title: "수익자료", href: "/data-input/revenue", icon: Upload },
    ],
  },
  {
    title: "원가계산",
    icon: Calculator,
    children: [
      { title: "계정-활동 매핑", href: "/calculation/mapping", icon: Calculator },
      { title: "FTE 계산", href: "/calculation/fte", icon: Calculator },
      { title: "배부 실행", href: "/calculation/allocation", icon: Calculator },
      { title: "시뮬레이션", href: "/calculation/simulation", icon: Calculator },
    ],
  },
  {
    title: "결과 리포트",
    icon: BarChart3,
    children: [
      { title: "부서별 원가", href: "/reports/departments", icon: BarChart3 },
      { title: "활동별 원가", href: "/reports/activities", icon: BarChart3 },
      { title: "수익코드별 단가", href: "/reports/revenue-units", icon: BarChart3 },
      { title: "KPI 대시보드", href: "/reports/kpi", icon: BarChart3 },
    ],
  },
  {
    title: "관리자",
    icon: Settings,
    children: [
      { title: "사용자 관리", href: "/admin/users", icon: Settings },
      { title: "권한 설정", href: "/admin/permissions", icon: Settings },
      { title: "시스템 로그", href: "/admin/logs", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "기초정보 관리",
    "자료 입력",
    "원가계산",
    "결과 리포트"
  ])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title)
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.href === pathname

    return (
      <div key={item.title}>
        {item.href ? (
          <Link href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 px-2 py-1.5 h-8 text-sm font-normal",
                level > 0 && "ml-4 w-[calc(100%-1rem)]",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={() => hasChildren && toggleExpanded(item.title)}
            className={cn(
              "w-full justify-between gap-2 px-2 py-1.5 h-8 text-sm font-normal",
              level > 0 && "ml-4 w-[calc(100%-1rem)]"
            )}
          >
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.title}
            </div>
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            )}
          </Button>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-muted/40 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          병원 ABC 시스템
        </h2>
        <p className="text-sm text-muted-foreground">
          활동기준원가 관리
        </p>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-auto">
        {navigation.map((item) => renderNavItem(item))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          서울대학교병원
        </div>
        <div className="text-xs text-muted-foreground">
          2025년 7월 기준
        </div>
      </div>
    </div>
  )
}
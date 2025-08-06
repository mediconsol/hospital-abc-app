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
  ChevronRight,
  Home,
  Target,
  GitBranch,
  Link as LinkIcon,
  Workflow,
  Monitor,
  Users
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
      { title: "직원 관리", href: "/base-info/employees", icon: Users },
      { title: "활동 관리", href: "/base-info/activities", icon: Database },
      { title: "계정 관리", href: "/base-info/accounts", icon: Database },
      { title: "프로세스 관리", href: "/base-info/processes", icon: Database },
      { title: "수가코드 관리", href: "/base-info/revenue-codes", icon: Database },
      { title: "드라이버 설정", href: "/base-info/drivers", icon: Database },
      { title: "원가대상 관리", href: "/base-info/cost-objects", icon: Target },
      { title: "배분단계 관리", href: "/base-info/allocation-rules", icon: GitBranch },
      { title: "배분기준 매핑", href: "/base-info/driver-mapping", icon: LinkIcon },
      { title: "단계별 배분룰", href: "/base-info/allocation-workflow", icon: Workflow },
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
    title: "원가배분",
    icon: Calculator,
    children: [
      { title: "배분 실행", href: "/cost-allocation/execution", icon: Calculator },
      { title: "결과 조회", href: "/cost-allocation/results", icon: BarChart3 },
      { title: "분석 리포트", href: "/cost-allocation/analysis", icon: BarChart3 },
      { title: "과정 추적", href: "/cost-allocation/tracking", icon: Monitor },
    ],
  },
  {
    title: "결과 리포트",
    icon: BarChart3,
    children: [
      { title: "부서별 원가", href: "/reports/departments", icon: BarChart3 },
      { title: "활동별 원가", href: "/reports/activities", icon: BarChart3 },
      { title: "수가코드별 단가", href: "/reports/revenue-units", icon: BarChart3 },
      { title: "원가대상별 원가", href: "/reports/cost-objects", icon: Target },
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
    "병원 설정",
    "기초정보 관리",
    "자료 입력",
    "원가배분",
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
                "w-full justify-start gap-3 px-3 py-2 h-9 text-sm font-medium rounded-lg transition-all duration-200",
                level > 0 && "ml-6 w-[calc(100%-1.5rem)] text-xs",
                isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm",
                !isActive && "hover:bg-accent/50 hover:translate-x-1"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4",
                level > 0 && "h-3 w-3",
                isActive && "text-primary"
              )} />
              {item.title}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={() => hasChildren && toggleExpanded(item.title)}
            className={cn(
              "w-full justify-between gap-3 px-3 py-2 h-9 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-accent/50",
              level > 0 && "ml-6 w-[calc(100%-1.5rem)] text-xs"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "h-4 w-4",
                level > 0 && "h-3 w-3"
              )} />
              {item.title}
            </div>
            {hasChildren && (
              <div className={cn(
                "transition-transform duration-200",
                isExpanded && "rotate-90"
              )}>
                <ChevronRight className="h-4 w-4" />
              </div>
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
    <div 
      className="w-64 border-r border-border h-full flex flex-col"
      style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              ABC 시스템
            </h2>
            <p className="text-xs text-muted-foreground">
              활동기준원가 관리
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {navigation.map((item) => renderNavItem(item))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div>
            <div className="font-medium">가족사랑요양병원</div>
            <div>2025년 8월 기준</div>
          </div>
        </div>
      </div>
    </div>
  )
}
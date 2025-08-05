"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { UtilitySidebar } from "@/components/utility-sidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // 서버 사이드에서 렌더링될 때는 기본 스타일로 렌더링
    return (
      <div className="flex h-screen bg-background relative">
        <div 
          className="w-64 border-r border-border h-full flex flex-col"
          style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
        >
          {/* 서버사이드 렌더링용 기본 사이드바 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <div className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">ABC 시스템</h2>
                <p className="text-xs text-muted-foreground">활동기준원가 관리</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">로딩 중...</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-6">
              <div className="text-sm text-muted-foreground">로딩 중...</div>
            </div>
          </div>
          <main className="flex-1 overflow-auto bg-main-content">
            {children}
          </main>
        </div>
        
        <div 
          className="w-16 border-l border-border h-full flex flex-col"
          style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
        >
          {/* 서버사이드 렌더링용 기본 유틸리티 사이드바 */}
        </div>
      </div>
    )
  }

  // 클라이언트 사이드에서 hydration 후 실제 컴포넌트 렌더링
  return (
    <div className="flex h-screen bg-background relative">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto bg-main-content">
          {children}
        </main>
      </div>
      <UtilitySidebar />
    </div>
  )
}
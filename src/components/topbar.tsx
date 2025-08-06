"use client"

import { Bell, Search, LogOut, Settings, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-secondary/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          현재 병원: <span className="font-semibold text-foreground">가족사랑요양병원</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          기간: <span className="font-semibold text-foreground">2025년 8월</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-accent/50 transition-colors">
          <Search className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-accent/50 transition-colors relative">
          <Bell className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
        </Button>
        
        <ThemeToggle />
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-semibold">
              김
            </div>
            <div className="text-sm">
              <div className="font-semibold">김원가</div>
              <div className="text-xs text-muted-foreground">시스템 관리자</div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-accent/50 transition-colors">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-9 w-9 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-colors">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
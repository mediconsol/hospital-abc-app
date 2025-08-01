"use client"

import { Bell, Search, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          현재 병원: <span className="font-medium text-foreground">서울대학교병원</span>
        </div>
        <div className="text-sm text-muted-foreground">
          기간: <span className="font-medium text-foreground">2025년 7월</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="h-4 w-4" />
          </Button>
          
          <div className="text-sm">
            <div className="font-medium">김원가</div>
            <div className="text-xs text-muted-foreground">관리자</div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
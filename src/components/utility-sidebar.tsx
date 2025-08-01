"use client"

import { useState } from "react"
import { 
  Bot, 
  MessageCircle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Sparkles,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function UtilitySidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="sm"
        className={cn(
          "fixed right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 shadow-lg transition-all duration-300",
          isOpen && "right-80"
        )}
      >
        {isOpen ? (
          <ChevronRight className="h-5 w-5 text-primary" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-primary" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-card/95 backdrop-blur-sm border-l border-border/50 shadow-2xl transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">유틸리티</h3>
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ai-assistant" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI 도우미
              </TabsTrigger>
              <TabsTrigger value="team-chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                소통방
              </TabsTrigger>
            </TabsList>

            {/* AI Assistant Tab */}
            <TabsContent value="ai-assistant" className="flex-1 px-4 pb-4 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    AI 에이전트
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-3 overflow-auto max-h-96">
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="font-medium text-xs">AI 도우미</span>
                      </div>
                      안녕하세요! ABC 원가관리 시스템 도우미입니다. 무엇을 도와드릴까요?
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-3 text-sm ml-4">
                      <div className="font-medium text-xs mb-1">나</div>
                      부서별 원가 분석을 도와주세요
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="font-medium text-xs">AI 도우미</span>
                      </div>
                      부서별 원가 분석을 위해 다음 정보가 필요합니다:
                      <ul className="mt-2 space-y-1 text-xs">
                        <li>• 분석 기간</li>
                        <li>• 대상 부서</li>
                        <li>• 비교 기준</li>
                      </ul>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Input
                      placeholder="질문을 입력하세요..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" className="h-9 w-9 p-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">빠른 질문</div>
                    <div className="flex flex-wrap gap-1">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        월별 비교
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        KPI 분석
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        비용 절감
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Chat Tab */}
            <TabsContent value="team-chat" className="flex-1 px-4 pb-4 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-green-500" />
                    직원 소통방
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {/* Online Users */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      온라인 (3명)
                    </div>
                    <div className="space-y-1">
                      {['김원가', '이재무', '박관리'].map((name) => (
                        <div key={name} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            {name[0]}
                          </div>
                          <span>{name}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 space-y-3 overflow-auto max-h-80 border-t border-border/50 pt-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          이
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">이재무</span>
                            <span className="text-xs text-muted-foreground">14:23</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-sm">
                            7월 원가계산 완료했습니다. 검토 부탁드려요.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs">
                          박
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">박관리</span>
                            <span className="text-xs text-muted-foreground">14:25</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-sm">
                            확인했습니다. 수고하셨어요! 👍
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Input
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" className="h-9 w-9 p-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
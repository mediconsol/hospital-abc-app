import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calculator, Database, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              병원 ABC 대시보드
            </h1>
            <p className="text-muted-foreground text-lg">
              활동기준원가 계산 및 분석 현황을 한눈에 확인하세요
            </p>
          </span>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              총 원가
            </CardTitle>
            <div className="h-8 w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">₩132,000,000</div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              전월 대비 +8.5%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              평균 단가
            </CardTitle>
            <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">₩14,200</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              활동 단위당 평균
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              총 FTE
            </CardTitle>
            <div className="h-8 w-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">9.8명</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              전환인력 기준
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              수익성 비율
            </CardTitle>
            <div className="h-8 w-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">73.5%</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              수익 &gt; 원가 비율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 주요 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">기초정보 관리</CardTitle>
                <CardDescription className="text-sm">
                  부서, 활동, 계정 등 기본 설정 관리
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">부서</span>
                <span className="text-sm font-bold text-blue-600">12개</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">활동</span>
                <span className="text-sm font-bold text-green-600">45개</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">계정</span>
                <span className="text-sm font-bold text-purple-600">128개</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle>원가계산</CardTitle>
            </div>
            <CardDescription>
              FTE 계산 및 원가 배부 현황
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">FTE 계산</span>
                <span className="text-sm font-medium text-green-600">완료</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">활동 배부</span>
                <span className="text-sm font-medium text-green-600">완료</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">최종 계산</span>
                <span className="text-sm font-medium text-yellow-600">진행중</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>결과 분석</CardTitle>
            </div>
            <CardDescription>
              원가 분석 및 리포트 현황
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">부서별 분석</span>
                <span className="text-sm font-medium">12개 부서</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">수익코드별</span>
                <span className="text-sm font-medium">89개 코드</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">KPI 리포트</span>
                <span className="text-sm font-medium text-green-600">최신</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>시스템에서 수행된 최근 작업들</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">2025년 7월 FTE 계산 완료</p>
                <p className="text-xs text-muted-foreground">30분 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">급여자료 업로드 완료</p>
                <p className="text-xs text-muted-foreground">2시간 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">부서 정보 수정</p>
                <p className="text-xs text-muted-foreground">4시간 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

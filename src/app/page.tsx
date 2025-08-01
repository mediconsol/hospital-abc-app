import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calculator, Database, TrendingUp, Users, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">병원 ABC 대시보드</h1>
        <p className="text-muted-foreground mt-1">
          활동기준원가 계산 및 분석 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 원가
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩132,000,000</div>
            <p className="text-xs text-muted-foreground">
              전월 대비 +8.5%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              평균 단가
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩14,200</div>
            <p className="text-xs text-muted-foreground">
              활동 단위당 평균
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 FTE
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.8명</div>
            <p className="text-xs text-muted-foreground">
              전환인력 기준
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              수익성 비율
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.5%</div>
            <p className="text-xs text-muted-foreground">
              수익 &gt; 원가 비율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 주요 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>기초정보 관리</CardTitle>
            </div>
            <CardDescription>
              부서, 활동, 계정 등 기본 설정 관리
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">부서</span>
                <span className="text-sm font-medium">12개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">활동</span>
                <span className="text-sm font-medium">45개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">계정</span>
                <span className="text-sm font-medium">128개</span>
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

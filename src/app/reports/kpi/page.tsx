"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DepartmentCostChart } from "@/components/charts/department-cost-chart"
import { mockDepartmentKPIs, mockActivityKPIs, mockRevenueKPIs } from "@/lib/mock-data"
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle } from "lucide-react"

export default function KPIReportsPage() {
  const totalCost = mockDepartmentKPIs.reduce((sum, dept) => sum + dept.total_cost, 0)
  const totalFTE = mockDepartmentKPIs.reduce((sum, dept) => sum + dept.fte, 0)
  const avgUnitCost = totalCost / totalFTE
  
  const profitableRevenues = mockRevenueKPIs.filter(rev => rev.profit > 0)
  const profitabilityRatio = profitableRevenues.length / mockRevenueKPIs.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">KPI 대시보드</h1>
          <p className="text-muted-foreground mt-1">
            주요 성과 지표 및 분석 결과를 확인하세요
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          리포트 다운로드
        </Button>
      </div>

      {/* KPI 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 원가</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              전월 대비 +8.5%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 단가</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgUnitCost)}</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              FTE당 평균 원가
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 FTE</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFTE.toFixed(1)}명</div>
            <div className="text-xs text-muted-foreground">
              전환인력 기준
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">수익성 비율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(profitabilityRatio)}</div>
            <div className="text-xs text-muted-foreground">
              수익 &gt; 원가 항목
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <DepartmentCostChart data={mockDepartmentKPIs} />

      {/* 상세 테이블들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 부서별 성과 */}
        <Card>
          <CardHeader>
            <CardTitle>부서별 성과 요약</CardTitle>
            <CardDescription>원가 효율성 기준 순위</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDepartmentKPIs
                .sort((a, b) => a.unit_cost - b.unit_cost)
                .slice(0, 5)
                .map((dept, index) => (
                  <div key={dept.department_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{dept.department_name}</p>
                        <p className="text-sm text-muted-foreground">
                          FTE: {dept.fte}명
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(dept.unit_cost)}</p>
                      <p className="text-sm text-muted-foreground">단가</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* 수익성 분석 */}
        <Card>
          <CardHeader>
            <CardTitle>수익성 분석</CardTitle>
            <CardDescription>손익 기준 수익코드 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRevenueKPIs
                .sort((a, b) => b.profit - a.profit)
                .map((revenue) => (
                  <div key={revenue.revenue_code_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {revenue.profit >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{revenue.revenue_code_name}</p>
                        <p className="text-sm text-muted-foreground">
                          건수: {revenue.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        revenue.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(revenue.profit)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPercent(revenue.profit_ratio)}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 알림 및 권장사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            주요 분석 결과 및 권장사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">수익성 개선 필요</h4>
              <p className="text-sm text-yellow-700">
                재진료 수익코드에서 {formatCurrency(Math.abs(mockRevenueKPIs.find(r => r.revenue_code_name === '재진료')?.profit || 0))}의 손실이 발생하고 있습니다. 
                원가 구조 분석을 통한 개선이 필요합니다.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">우수 부서 벤치마킹</h4>
              <p className="text-sm text-blue-700">
                원무과가 가장 낮은 단가({formatCurrency(mockDepartmentKPIs.find(d => d.department_name === '원무과')?.unit_cost || 0)})를 보이고 있습니다. 
                다른 부서에서 해당 운영 방식을 벤치마킹할 것을 권장합니다.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">전체적인 성장세</h4>
              <p className="text-sm text-green-700">
                전체 수익코드의 {formatPercent(profitabilityRatio)}가 흑자를 기록하고 있어 양호한 수준입니다. 
                지속적인 모니터링을 통해 현재 수준을 유지하시기 바랍니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
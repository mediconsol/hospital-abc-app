"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  DollarSign, 
  Clock, 
  Calculator,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { mockEmployees, getDepartmentsByHospitalAndPeriod } from "@/lib/mock-data"
import type { Employee } from "@/types"

export default function SalaryDataPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [employees] = useState<Employee[]>(mockEmployees)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  
  // 급여 통계 계산
  const totalEmployees = employees.length
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const avgSalary = totalSalary / totalEmployees
  // 월 160시간 기준으로 계산 (주 40시간 * 4주)
  const standardWorkHours = 160
  const totalWorkHours = employees.length * standardWorkHours
  const avgHourlyRate = totalSalary / totalWorkHours

  // 직종별 통계
  const positionStats = employees.reduce((acc, emp) => {
    const position = emp.position
    if (!acc[position]) {
      acc[position] = { count: 0, totalSalary: 0, totalHours: 0 }
    }
    acc[position].count++
    acc[position].totalSalary += emp.salary
    acc[position].totalHours += standardWorkHours // 표준 근무시간 사용
    return acc
  }, {} as Record<string, { count: number; totalSalary: number; totalHours: number }>)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // 파일 업로드 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => setUploadProgress(i), i * 20)
    }

    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
    }, 2500)
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">급여자료 관리</h1>
        <p className="text-muted-foreground">
          직원 급여 정보를 관리하고 활동별 인건비 배분을 위한 기초 데이터를 입력합니다.
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            데이터 수집 및 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">기준월</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>급여 데이터 가져오기</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  HRP 연동
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  템플릿
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">파일 업로드</Label>
              <div className="relative">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-primary file:text-primary-foreground"
                />
                {isUploading && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>업로드 중...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Statistics Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                인력 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">총 직원수</span>
                  <span className="font-semibold">{totalEmployees}명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">총 급여액</span>
                  <span className="font-semibold text-primary">
                    {totalSalary.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">평균 급여</span>
                  <span className="font-semibold">
                    {Math.round(avgSalary).toLocaleString()}원
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                근무시간 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">총 근무시간</span>
                  <span className="font-semibold">{totalWorkHours}시간</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">시간당 평균 단가</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(avgHourlyRate).toLocaleString()}원
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                데이터 품질
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">완성도</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    98%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">정확도</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    92%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">최종 업데이트</span>
                  <span className="text-xs text-muted-foreground">2시간 전</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Position Statistics */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              직종별 급여 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(positionStats).map(([position, stats]) => (
                <div key={position} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{position}</span>
                    <Badge variant="outline">{stats.count}명</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">총 급여</span>
                      <div className="font-semibold text-primary">
                        {stats.totalSalary.toLocaleString()}원
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">시간당 단가</span>
                      <div className="font-semibold text-green-600">
                        {Math.round(stats.totalSalary / stats.totalHours).toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${(stats.totalSalary / totalSalary) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee List/Detail */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              직원별 급여 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 max-h-96 overflow-auto">
              {employees.map((employee) => (
                <div key={employee.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.position} • {employee.employee_number}
                      </div>
                    </div>
                    <Badge 
                      variant={employee.employment_type === 'full_time' ? 'default' : 'secondary'}
                    >
                      {employee.employment_type === 'full_time' ? '정규직' : '계약직'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">월급여</span>
                      <div className="font-semibold text-primary">
                        {employee.salary.toLocaleString()}원
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">근무시간</span>
                      <div className="font-semibold">
                        160시간
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      수정
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      배분설정
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Excel 내보내기
        </Button>
        <Button variant="outline">
          데이터 검증
        </Button>
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          활동별 배분 실행
        </Button>
      </div>
    </div>
  )
}
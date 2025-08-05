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
  User, 
  Activity as ActivityIcon, 
  Clock, 
  PieChart,
  Upload,
  Download,
  Save,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Percent
} from "lucide-react"
import { mockEmployees, mockActivities, getDepartmentsByHospitalAndPeriod } from "@/lib/mock-data"
import { enhancedWorkRatios, workRatioAnalytics, workRatioValidationRules } from "@/lib/enhanced-work-ratios"
import type { Employee, Activity, WorkRatio } from "@/types"

export default function WorkRatioPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("none")
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [workRatios, setWorkRatios] = useState<WorkRatio[]>(enhancedWorkRatios)
  const [isEditing, setIsEditing] = useState(false)

  const departments = getDepartmentsByHospitalAndPeriod("1", "1")
  const employees = mockEmployees
  const activities = mockActivities

  // Filter employees by department
  const filteredEmployees = selectedDepartment === "all" 
    ? employees
    : employees.filter(emp => emp.department_id === selectedDepartment)

  // Get selected employee data
  const selectedEmp = selectedEmployee === "none" ? null : employees.find(emp => emp.id === selectedEmployee)
  
  // Get work ratios for selected employee
  const employeeWorkRatios = selectedEmployee === "none" ? [] : workRatios.filter(wr => wr.employee_id === selectedEmployee)
  
  // Calculate totals
  const totalRatio = employeeWorkRatios.reduce((sum, wr) => sum + wr.ratio, 0)
  const totalHours = employeeWorkRatios.reduce((sum, wr) => sum + (wr.hours || 0), 0)
  const isRatioValid = Math.abs(totalRatio - 1.0) < 0.01

  const handleRatioChange = (workRatioId: string, newRatio: number) => {
    setWorkRatios(prev => prev.map(wr => 
      wr.id === workRatioId 
        ? { 
            ...wr, 
            ratio: newRatio / 100, 
            hours: selectedEmp ? Math.round((newRatio / 100) * selectedEmp.work_hours) : 0 
          }
        : wr
    ))
  }

  const addActivityRatio = () => {
    if (!selectedEmployee || selectedEmployee === "none") return
    
    const newWorkRatio: WorkRatio = {
      id: `new_${Date.now()}`,
      hospital_id: '1',
      period_id: '1',
      employee_id: selectedEmployee,
      activity_id: activities[0].id,
      ratio: 0,
      hours: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setWorkRatios(prev => [...prev, newWorkRatio])
  }

  const removeActivityRatio = (workRatioId: string) => {
    setWorkRatios(prev => prev.filter(wr => wr.id !== workRatioId))
  }

  const getActivityName = (activityId: string) => {
    return activities.find(act => act.id === activityId)?.name || '알 수 없음'
  }

  const getDepartmentName = (deptId: string) => {
    return departments.find(dept => dept.id === deptId)?.name || '알 수 없음'
  }

  // 직종별 업무비율 분석
  const getPositionAnalysis = (position: string) => {
    return workRatioAnalytics.positionAverages[position as keyof typeof workRatioAnalytics.positionAverages] || null
  }

  // 업무비율 검증
  const validateWorkRatio = (employeeId: string, activityId: string, ratio: number) => {
    const employee = employees.find(emp => emp.id === employeeId)
    if (!employee) return { valid: true, message: '' }

    const limits = workRatioValidationRules.activityRatioLimits[activityId]
    if (limits && (ratio < limits.min || ratio > limits.max)) {
      return {
        valid: false,
        message: `${getActivityName(activityId)} 비율은 ${limits.min * 100}%~${limits.max * 100}% 범위여야 합니다.`
      }
    }

    const maxHours = workRatioValidationRules.maxHoursByPosition[employee.position]
    if (maxHours && employee.work_hours > maxHours) {
      return {
        valid: false,
        message: `${employee.position} 직종의 최대 근무시간(${maxHours}시간)을 초과합니다.`
      }
    }

    return { valid: true, message: '' }
  }

  // 부서별 통계
  const getDepartmentStats = () => {
    const deptStats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department_id === dept.id)
      const deptWorkRatios = workRatios.filter(wr => 
        deptEmployees.some(emp => emp.id === wr.employee_id)
      )
      
      const totalHours = deptWorkRatios.reduce((sum, wr) => sum + (wr.hours || 0), 0)
      const avgRatio = deptWorkRatios.length > 0 
        ? deptWorkRatios.reduce((sum, wr) => sum + wr.ratio, 0) / deptWorkRatios.length 
        : 0

      return {
        department: dept,
        employeeCount: deptEmployees.length,
        totalHours,
        avgRatio,
        workRatioCount: deptWorkRatios.length
      }
    }).filter(stat => stat.employeeCount > 0)

    return deptStats
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">업무비율 관리</h1>
        <p className="text-muted-foreground">
          직원별 활동 투입 비율을 설정하여 인건비를 활동별로 배분합니다.
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            직원 선택 및 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
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
              <Label htmlFor="employee">직원</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="직원 선택" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position})
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
              <Label>작업 모드</Label>
              <div className="flex gap-2">
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1"
                >
                  {isEditing ? "편집중" : "편집"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Upload className="h-4 w-4 mr-1" />
                  가져오기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Employee Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                직원 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEmp ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="font-medium text-lg">{selectedEmp.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEmp.position} • {selectedEmp.emp_no}
                    </div>
                    <Badge variant="outline">
                      {getDepartmentName(selectedEmp.department_id)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">월급여</span>
                      <div className="font-semibold text-primary">
                        {selectedEmp.salary.toLocaleString()}원
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">월 근무시간</span>
                      <div className="font-semibold">
                        {selectedEmp.work_hours}시간
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">시간당 단가</span>
                      <div className="font-semibold text-green-600">
                        {Math.round(selectedEmp.salary / selectedEmp.work_hours).toLocaleString()}원
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">고용형태</span>
                      <div className="font-semibold">
                        {selectedEmp.employment_type === 'full_time' ? '정규직' : '계약직'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  직원을 선택해주세요
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ratio Summary */}
          {selectedEmp && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  배분 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">총 비율</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isRatioValid ? 'text-green-600' : 'text-red-600'}`}>
                        {(totalRatio * 100).toFixed(1)}%
                      </span>
                      {isRatioValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">배분 시간</span>
                    <span className="font-semibold">
                      {totalHours} / {selectedEmp.work_hours}시간
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${isRatioValid ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(totalRatio * 100, 100)}%` }}
                    />
                  </div>
                  
                  {!isRatioValid && (
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      총 비율이 100%가 되어야 합니다
                    </div>
                  )}

                  {/* 직종별 평균 비교 */}
                  {selectedEmp && getPositionAnalysis(selectedEmp.position) && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">{selectedEmp.position} 평균 대비</div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(getPositionAnalysis(selectedEmp.position) || {}).map(([activity, avgRatio]) => (
                          <div key={activity} className="flex justify-between">
                            <span className="text-muted-foreground">{activity}</span>
                            <span>{((avgRatio as number) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Department Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                부서별 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getDepartmentStats().slice(0, 6).map((stat) => (
                <div key={stat.department.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{stat.department.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.employeeCount}명
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">총 배분시간</span>
                      <div className="font-semibold">{stat.totalHours}시간</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">평균 비율</span>
                      <div className="font-semibold text-primary">
                        {(stat.avgRatio * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary rounded-full h-1.5" 
                      style={{ width: `${stat.avgRatio * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Work Ratio Editor */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                활동별 업무비율 설정
              </CardTitle>
              {selectedEmp && isEditing && (
                <Button size="sm" onClick={addActivityRatio}>
                  활동 추가
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedEmp ? (
              <div className="space-y-4">
                {employeeWorkRatios.length > 0 ? (
                  employeeWorkRatios.map((workRatio) => (
                    <div key={workRatio.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{getActivityName(workRatio.activity_id)}</div>
                          <div className="text-sm text-muted-foreground">
                            활동 코드: {activities.find(act => act.id === workRatio.activity_id)?.code}
                          </div>
                        </div>
                        {isEditing && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeActivityRatio(workRatio.id)}
                          >
                            제거
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>비율 (%)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={(workRatio.ratio * 100).toFixed(1)}
                              onChange={(e) => handleRatioChange(workRatio.id, parseFloat(e.target.value) || 0)}
                              disabled={!isEditing}
                              className="flex-1"
                            />
                            <Percent className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {/* 검증 메시지 */}
                          {selectedEmp && (() => {
                            const validation = validateWorkRatio(selectedEmp.id, workRatio.activity_id, workRatio.ratio)
                            return !validation.valid && (
                              <div className="text-xs text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {validation.message}
                              </div>
                            )
                          })()}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>투입시간</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={workRatio.hours || 0}
                              disabled
                              className="flex-1"
                            />
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>배분 인건비</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={selectedEmp ? Math.round(selectedEmp.salary * workRatio.ratio).toLocaleString() + '원' : '0원'}
                              disabled
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2" 
                          style={{ width: `${workRatio.ratio * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <ActivityIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <div>활동별 업무비율이 설정되지 않았습니다</div>
                    <div className="text-sm mt-1">활동을 추가하여 업무비율을 설정해주세요</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <div>직원을 선택해주세요</div>
                <div className="text-sm mt-1">업무비율을 설정할 직원을 선택해주세요</div>
              </div>
            )}
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
          템플릿 다운로드
        </Button>
        <Button disabled={!isRatioValid || !selectedEmp}>
          <Save className="h-4 w-4 mr-2" />
          저장
        </Button>
        <Button disabled={!selectedEmp}>
          <Calculator className="h-4 w-4 mr-2" />
          비율 자동계산
        </Button>
      </div>
    </div>
  )
}
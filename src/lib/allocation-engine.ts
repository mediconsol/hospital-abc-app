// 배분실행 엔진 - 8단계 ABC 순차 실행 알고리즘

import { AllocationStage } from "./allocation-data"
import { mockDrivers, DriverValue } from "./driver-data"
import { mockDepartments } from "./mock-data"

// 배분 실행 결과 인터페이스
export interface AllocationResult {
  id: string
  stage: AllocationStage
  source_id: string
  source_type: "department" | "activity" | "cost_object" | "account"
  target_id: string
  target_type: "department" | "activity" | "cost_object" | "account"
  amount: number
  driver_id: string
  driver_ratio: number
  calculation_method: string
  execution_time: string
  notes?: string
}

// 배분 실행 상태
export interface ExecutionState {
  current_stage: AllocationStage | null
  stages_completed: AllocationStage[]
  total_allocated: number
  errors: string[]
  warnings: string[]
  start_time: string
  end_time?: string
  results: AllocationResult[]
}

// 배분 계산 엔진 클래스
export class AllocationEngine {
  private state: ExecutionState
  private stageOrder: AllocationStage[] = ['rtr', 'rta', 'ata1', 'ata2', 'atc', 'rtc', 'etc', 'xtc']

  constructor() {
    this.state = {
      current_stage: null,
      stages_completed: [],
      total_allocated: 0,
      errors: [],
      warnings: [],
      start_time: new Date().toISOString(),
      results: []
    }
  }

  // 전체 ABC 워크플로우 실행
  async executeAllocationWorkflow(
    enabledStages: AllocationStage[],
    configurations: Record<AllocationStage, any>,
    onProgress?: (stage: AllocationStage, progress: number) => void
  ): Promise<ExecutionState> {
    try {
      this.state.start_time = new Date().toISOString()
      this.state.errors = []
      this.state.warnings = []
      this.state.results = []

      // 1. 의존성 검증
      const validationResult = this.validateDependencies(enabledStages)
      if (!validationResult.isValid) {
        this.state.errors.push(...validationResult.errors)
        return this.state
      }

      // 2. 단계별 순차 실행
      for (const stage of this.stageOrder) {
        if (!enabledStages.includes(stage)) continue

        this.state.current_stage = stage
        onProgress?.(stage, 0)

        try {
          const stageResults = await this.executeStage(stage, configurations[stage])
          this.state.results.push(...stageResults)
          this.state.stages_completed.push(stage)
          
          onProgress?.(stage, 100)
        } catch (error) {
          const errorMessage = `${stage} 단계 실행 중 오류: ${error}`
          this.state.errors.push(errorMessage)
          break
        }
      }

      this.state.current_stage = null
      this.state.end_time = new Date().toISOString()
      this.state.total_allocated = this.calculateTotalAllocated()

      return this.state
    } catch (error) {
      this.state.errors.push(`전체 워크플로우 실행 중 오류: ${error}`)
      return this.state
    }
  }

  // 개별 단계 실행
  private async executeStage(stage: AllocationStage, config: any): Promise<AllocationResult[]> {
    switch (stage) {
      case 'rtr':
        return this.executeRTR(config)
      case 'rta':
        return this.executeRTA(config)
      case 'ata1':
        return this.executeATA1(config)
      case 'ata2':
        return this.executeATA2(config)
      case 'atc':
        return this.executeATC(config)
      case 'rtc':
        return this.executeRTC(config)
      case 'etc':
        return this.executeETC(config)
      case 'xtc':
        return this.executeXTC(config)
      default:
        throw new Error(`지원되지 않는 단계: ${stage}`)
    }
  }

  // RTR: 공통원가 정산 (자원 → 자원)
  private async executeRTR(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 공통비용 식별 (예: 전기료, 임차료 등)
    const commonCosts = [
      { id: 'electricity', amount: 2450000, name: '전기료' },
      { id: 'rent', amount: 1800000, name: '임차료' },
      { id: 'maintenance', amount: 890000, name: '유지보수비' }
    ]

    // 면적 기준 드라이버 가져오기
    const areaDriver = mockDrivers.find(d => d.category === 'area')
    if (!areaDriver?.values) {
      throw new Error('면적 드라이버를 찾을 수 없습니다.')
    }

    const totalArea = areaDriver.values.reduce((sum, v) => sum + v.value, 0)

    for (const cost of commonCosts) {
      for (const driverValue of areaDriver.values) {
        const ratio = driverValue.value / totalArea
        const allocatedAmount = cost.amount * ratio

        results.push({
          id: `rtr_${cost.id}_${driverValue.target_id}`,
          stage: 'rtr',
          source_id: cost.id,
          source_type: 'account',
          target_id: driverValue.target_id,
          target_type: 'department',
          amount: allocatedAmount,
          driver_id: areaDriver.id,
          driver_ratio: ratio,
          calculation_method: 'proportional_area',
          execution_time: new Date().toISOString(),
          notes: `${cost.name}을 면적 기준으로 ${(ratio * 100).toFixed(1)}% 배분`
        })
      }
    }

    await this.simulateDelay(1500)
    return results
  }

  // RTA: 활동원가 전환 (자원 → 활동)
  private async executeRTA(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 부서별 인건비 (RTR 결과 + 원본 인건비)
    const departmentCosts = [
      { id: 'dept_internal', amount: 4350000, name: '내과' },
      { id: 'dept_surgery', amount: 3750000, name: '외과' },
      { id: 'dept_radiology', amount: 2850000, name: '영상의학과' },
      { id: 'dept_admin', amount: 2250000, name: '행정부서' }
    ]

    // 활동 정의
    const activities = [
      { id: 'act_outpatient', name: '외래진료' },
      { id: 'act_inpatient', name: '입원진료' },
      { id: 'act_surgery', name: '수술' },
      { id: 'act_imaging', name: '영상검사' },
      { id: 'act_lab', name: '임상검사' },
      { id: 'act_admin', name: '행정업무' }
    ]

    // 시간 기준 드라이버 가져오기
    const timeDriver = mockDrivers.find(d => d.category === 'time')
    if (!timeDriver?.values) {
      throw new Error('시간 드라이버를 찾을 수 없습니다.')
    }

    for (const deptCost of departmentCosts) {
      const deptTimeValues = timeDriver.values.filter(v => v.target_id.includes(deptCost.id.split('_')[1]))
      const totalTime = deptTimeValues.reduce((sum, v) => sum + v.value, 0)

      for (const timeValue of deptTimeValues) {
        const ratio = timeValue.value / totalTime
        const allocatedAmount = deptCost.amount * ratio

        results.push({
          id: `rta_${deptCost.id}_${timeValue.target_id}`,
          stage: 'rta',
          source_id: deptCost.id,
          source_type: 'department',
          target_id: timeValue.target_id,
          target_type: 'activity',
          amount: allocatedAmount,
          driver_id: timeDriver.id,
          driver_ratio: ratio,
          calculation_method: 'time_based',
          execution_time: new Date().toISOString(),
          notes: `${deptCost.name} 인건비를 업무시간 기준으로 ${(ratio * 100).toFixed(1)}% 배분`
        })
      }
    }

    await this.simulateDelay(2000)
    return results
  }

  // ATA1: 자기부서 지원활동 (활동 → 활동)
  private async executeATA1(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 부서 내 지원활동 배분 (예: 행정업무 → 진료활동)
    const supportActivities = [
      { id: 'act_admin_internal', amount: 580000, name: '내과 행정업무', target_dept: 'internal' },
      { id: 'act_admin_surgery', amount: 420000, name: '외과 행정업무', target_dept: 'surgery' },
      { id: 'act_admin_radiology', amount: 350000, name: '영상의학과 행정업무', target_dept: 'radiology' }
    ]

    // 각 부서의 주활동으로 배분
    const activityMappings = {
      'internal': [
        { id: 'act_outpatient_internal', ratio: 0.6, name: '내과 외래진료' },
        { id: 'act_inpatient_internal', ratio: 0.4, name: '내과 입원진료' }
      ],
      'surgery': [
        { id: 'act_surgery_main', ratio: 0.7, name: '수술' },
        { id: 'act_outpatient_surgery', ratio: 0.3, name: '외과 외래진료' }
      ],
      'radiology': [
        { id: 'act_imaging_ct', ratio: 0.5, name: 'CT 검사' },
        { id: 'act_imaging_mri', ratio: 0.3, name: 'MRI 검사' },
        { id: 'act_imaging_xray', ratio: 0.2, name: 'X-ray 검사' }
      ]
    }

    for (const supportActivity of supportActivities) {
      const mappings = activityMappings[supportActivity.target_dept as keyof typeof activityMappings]
      
      for (const mapping of mappings) {
        const allocatedAmount = supportActivity.amount * mapping.ratio

        results.push({
          id: `ata1_${supportActivity.id}_${mapping.id}`,
          stage: 'ata1',
          source_id: supportActivity.id,
          source_type: 'activity',
          target_id: mapping.id,
          target_type: 'activity',
          amount: allocatedAmount,
          driver_id: 'manual_ratio',
          driver_ratio: mapping.ratio,
          calculation_method: 'internal_support',
          execution_time: new Date().toISOString(),
          notes: `${supportActivity.name}을 ${mapping.name}으로 ${(mapping.ratio * 100)}% 배분`
        })
      }
    }

    await this.simulateDelay(1800)
    return results
  }

  // ATA2: 타부서 지원활동 (활동 → 활동)
  private async executeATA2(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 타부서 지원 서비스 (예: 검사실 → 진료부서)
    const crossDeptServices = [
      { 
        id: 'lab_service', 
        amount: 1250000, 
        name: '임상검사 서비스',
        distributions: [
          { target: 'act_outpatient_internal', ratio: 0.4 },
          { target: 'act_inpatient_internal', ratio: 0.3 },
          { target: 'act_surgery_main', ratio: 0.2 },
          { target: 'act_outpatient_surgery', ratio: 0.1 }
        ]
      },
      {
        id: 'pharmacy_service',
        amount: 890000,
        name: '약제 서비스',
        distributions: [
          { target: 'act_outpatient_internal', ratio: 0.3 },
          { target: 'act_inpatient_internal', ratio: 0.4 },
          { target: 'act_surgery_main', ratio: 0.3 }
        ]
      }
    ]

    for (const service of crossDeptServices) {
      for (const distribution of service.distributions) {
        const allocatedAmount = service.amount * distribution.ratio

        results.push({
          id: `ata2_${service.id}_${distribution.target}`,
          stage: 'ata2',
          source_id: service.id,
          source_type: 'activity',
          target_id: distribution.target,
          target_type: 'activity',
          amount: allocatedAmount,
          driver_id: 'service_volume',
          driver_ratio: distribution.ratio,
          calculation_method: 'cross_department',
          execution_time: new Date().toISOString(),
          notes: `${service.name}을 ${(distribution.ratio * 100)}% 배분`
        })
      }
    }

    await this.simulateDelay(2500)
    return results
  }

  // ATC: 활동원가 배부 (활동 → 원가대상)
  private async executeATC(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 활동별 누적 원가 (이전 단계들의 결과)
    const activityCosts = [
      { id: 'act_outpatient_internal', amount: 3250000, name: '내과 외래진료' },
      { id: 'act_inpatient_internal', amount: 2180000, name: '내과 입원진료' },
      { id: 'act_surgery_main', amount: 4150000, name: '수술' },
      { id: 'act_imaging_ct', amount: 1850000, name: 'CT 검사' },
      { id: 'act_imaging_mri', amount: 1250000, name: 'MRI 검사' }
    ]

    // 원가대상 (진료과별)
    const costObjects = [
      { id: 'co_internal_medicine', name: '내과 진료' },
      { id: 'co_surgery', name: '외과 진료' },
      { id: 'co_radiology', name: '영상의학과 진료' }
    ]

    // 환자수 기준 드라이버
    const patientDriver = mockDrivers.find(d => d.category === 'patient')
    if (!patientDriver?.values) {
      throw new Error('환자수 드라이버를 찾을 수 없습니다.')
    }

    for (const activityCost of activityCosts) {
      // 해당 활동과 관련된 원가대상 찾기
      const relatedPatients = patientDriver.values.filter(v => {
        if (activityCost.id.includes('internal')) return v.target_id.includes('internal')
        if (activityCost.id.includes('surgery')) return v.target_id.includes('surgery')
        if (activityCost.id.includes('imaging')) return v.target_id.includes('radiology')
        return false
      })

      const totalPatients = relatedPatients.reduce((sum, v) => sum + v.value, 0)

      for (const patientValue of relatedPatients) {
        const ratio = patientValue.value / totalPatients
        const allocatedAmount = activityCost.amount * ratio

        results.push({
          id: `atc_${activityCost.id}_${patientValue.target_id}`,
          stage: 'atc',
          source_id: activityCost.id,
          source_type: 'activity',
          target_id: patientValue.target_id,
          target_type: 'cost_object',
          amount: allocatedAmount,
          driver_id: patientDriver.id,
          driver_ratio: ratio,
          calculation_method: 'patient_based',
          execution_time: new Date().toISOString(),
          notes: `${activityCost.name}을 환자수 기준으로 ${(ratio * 100).toFixed(1)}% 배분`
        })
      }
    }

    await this.simulateDelay(2200)
    return results
  }

  // RTC: 자원 직접배부 (자원 → 원가대상)
  private async executeRTC(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 직접 배부 가능한 자원들
    const directResources = [
      { id: 'medication_internal', amount: 1450000, target: 'co_internal_medicine', name: '내과 전용 약품' },
      { id: 'surgical_supplies', amount: 2180000, target: 'co_surgery', name: '수술용 소모품' },
      { id: 'contrast_agent', amount: 680000, target: 'co_radiology', name: '조영제' }
    ]

    for (const resource of directResources) {
      results.push({
        id: `rtc_${resource.id}_${resource.target}`,
        stage: 'rtc',
        source_id: resource.id,
        source_type: 'account',
        target_id: resource.target,
        target_type: 'cost_object',
        amount: resource.amount,
        driver_id: 'direct_assignment',
        driver_ratio: 1.0,
        calculation_method: 'direct_allocation',
        execution_time: new Date().toISOString(),
        notes: `${resource.name}을 ${resource.target}에 직접 배부`
      })
    }

    await this.simulateDelay(1200)
    return results
  }

  // ETC: 비용 직접귀속 (비용 → 원가대상)
  private async executeETC(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 직접 귀속 가능한 비용들
    const directCosts = [
      { id: 'malpractice_insurance', amount: 850000, target: 'co_surgery', name: '의료사고 보험료' },
      { id: 'equipment_depreciation', amount: 1250000, target: 'co_radiology', name: '장비 감가상각비' }
    ]

    for (const cost of directCosts) {
      results.push({
        id: `etc_${cost.id}_${cost.target}`,
        stage: 'etc',
        source_id: cost.id,
        source_type: 'account',
        target_id: cost.target,
        target_type: 'cost_object',
        amount: cost.amount,
        driver_id: 'direct_assignment',
        driver_ratio: 1.0,
        calculation_method: 'direct_assignment',
        execution_time: new Date().toISOString(),
        notes: `${cost.name}을 ${cost.target}에 직접 귀속`
      })
    }

    await this.simulateDelay(1000)
    return results
  }

  // XTC: 수익 직접귀속 (수익 → 원가대상)
  private async executeXTC(config: any): Promise<AllocationResult[]> {
    const results: AllocationResult[] = []
    
    // 직접 귀속 가능한 수익들
    const directRevenues = [
      { id: 'outpatient_revenue', amount: 12500000, target: 'co_internal_medicine', name: '외래 진료수익' },
      { id: 'surgery_revenue', amount: 18400000, target: 'co_surgery', name: '수술 수익' },
      { id: 'imaging_revenue', amount: 8900000, target: 'co_radiology', name: '영상검사 수익' }
    ]

    for (const revenue of directRevenues) {
      results.push({
        id: `xtc_${revenue.id}_${revenue.target}`,
        stage: 'xtc',
        source_id: revenue.id,
        source_type: 'account',
        target_id: revenue.target,
        target_type: 'cost_object',
        amount: revenue.amount,
        driver_id: 'direct_assignment',
        driver_ratio: 1.0,
        calculation_method: 'revenue_matching',
        execution_time: new Date().toISOString(),
        notes: `${revenue.name}을 ${revenue.target}에 직접 귀속`
      })
    }

    await this.simulateDelay(800)
    return results
  }

  // 의존성 검증
  private validateDependencies(enabledStages: AllocationStage[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    const dependencies = {
      'rta': ['rtr'],
      'ata1': ['rta'],
      'ata2': ['ata1'],
      'atc': ['ata2'],
      'rtc': ['rtr']
    }

    for (const stage of enabledStages) {
      const requiredStages = dependencies[stage as keyof typeof dependencies]
      if (requiredStages) {
        for (const required of requiredStages) {
          if (!enabledStages.includes(required as AllocationStage)) {
            errors.push(`${stage} 단계를 실행하려면 ${required} 단계가 먼저 활성화되어야 합니다.`)
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // 총 배분 금액 계산
  private calculateTotalAllocated(): number {
    return this.state.results.reduce((sum, result) => sum + result.amount, 0)
  }

  // 실행 지연 시뮬레이션
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 현재 상태 반환
  getState(): ExecutionState {
    return { ...this.state }
  }

  // 특정 단계 결과 조회
  getStageResults(stage: AllocationStage): AllocationResult[] {
    return this.state.results.filter(r => r.stage === stage)
  }

  // 원가대상별 최종 결과 집계
  getCostObjectSummary(): Record<string, { totalCost: number; totalRevenue: number; results: AllocationResult[] }> {
    const summary: Record<string, { totalCost: number; totalRevenue: number; results: AllocationResult[] }> = {}

    for (const result of this.state.results) {
      if (result.target_type === 'cost_object') {
        if (!summary[result.target_id]) {
          summary[result.target_id] = { totalCost: 0, totalRevenue: 0, results: [] }
        }

        if (result.stage === 'xtc') {
          summary[result.target_id].totalRevenue += result.amount
        } else {
          summary[result.target_id].totalCost += result.amount
        }
        
        summary[result.target_id].results.push(result)
      }
    }

    return summary
  }
}

// 엔진 싱글톤 인스턴스
export const allocationEngine = new AllocationEngine()
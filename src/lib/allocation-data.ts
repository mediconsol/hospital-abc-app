// ABC 배분 시스템 데이터 모델

// 배분 단계 타입 (포괄적 ABC 방법론)
export type AllocationStage = 
  | "rtr"  // Resource to Resource (공통원가 정산)
  | "rta"  // Resource to Activity (활동원가 전환)
  | "ata1" // Activity to Activity - Same Dept (자기부서 지원활동)
  | "ata2" // Activity to Activity - Cross Dept (타부서 지원활동)
  | "atc"  // Activity to Cost Object (활동의 원가대상 배부)
  | "rtc"  // Resource to Cost Object (자원 직접 배부)
  | "etc"  // Direct Cost Attribution (비용 직접 귀속)
  | "xtc"  // Revenue Direct Attribution (수익 직접 귀속)

// 배분 방법 타입  
export type AllocationMethod = 
  | "direct"        // 직접배분
  | "proportional"  // 비례배분  
  | "step_down"     // 단계적배분
  | "reciprocal"    // 상호배분
  | "equal"         // 균등배분

// 원가동인 기준 타입
export type CostDriverBasis = 
  | "causal"        // 인과관계 기준
  | "benefit"       // 수혜 기준  
  | "ability"       // 부담능력 기준

// 배분 규칙 인터페이스
export interface AllocationRule {
  id: string
  name: string
  description: string
  stage: AllocationStage
  method: AllocationMethod
  is_active: boolean
  priority: number
  
  // 배분 소스와 타겟 (확장된 타입)
  source_type: "department" | "activity" | "account" | "revenue"
  source_ids: string[]
  target_type: "department" | "activity" | "cost_object" | "account"
  target_ids: string[]
  
  // 배분 기준 (드라이버) - 확장
  driver_id: string
  driver_name: string
  driver_basis: CostDriverBasis  // 원가동인 선정 기준
  driver_category: "time" | "area" | "patient" | "volume" | "revenue" | "headcount" | "other"
  
  // 배분 비율 설정
  allocation_ratios: {
    source_id: string
    target_id: string
    ratio: number
    driver_value: number
  }[]
  
  created_at: string
  updated_at: string
}

// 배분 시나리오 인터페이스
export interface AllocationScenario {
  id: string
  name: string
  description: string
  version: string
  is_default: boolean
  is_active: boolean
  
  // 시나리오에 포함된 배분 룰들
  allocation_rules: AllocationRule[]
  
  // 실행 설정
  execution_settings: {
    auto_calculation: boolean
    rounding_method: "round" | "floor" | "ceil"
    rounding_precision: number
    validation_checks: boolean
  }
  
  created_at: string
  updated_at: string
}

// 배분 실행 결과 인터페이스
export interface AllocationResult {
  id: string
  scenario_id: string
  execution_date: string
  status: "pending" | "running" | "completed" | "failed"
  
  // 실행 통계
  total_cost_allocated: number
  total_rules_executed: number
  execution_time_ms: number
  
  // 상세 배분 결과
  stage_results: {
    stage: AllocationStage
    rules_executed: number
    total_amount: number
    allocations: {
      rule_id: string
      source_id: string
      target_id: string
      amount: number
      driver_value: number
      ratio: number
    }[]
  }[]
  
  // 오류 및 경고
  errors: string[]
  warnings: string[]
}

// 더미 배분 규칙 데이터 - 8단계 ABC 방법론 반영
export const mockAllocationRules: AllocationRule[] = [
  // RTR: 공통원가 정산
  {
    id: "rule_rtr_001",
    name: "전기료 공통원가 정산",
    description: "병원 전체 전기료를 각 부서별 면적 비율에 따라 배분",
    stage: "rtr",
    method: "proportional",
    is_active: true,
    priority: 1,
    source_type: "account",
    source_ids: ["electricity_common"],
    target_type: "department",
    target_ids: ["11", "12", "13", "21", "311", "321", "411"],
    driver_id: "driver_area_001",
    driver_name: "부서별 면적",
    driver_basis: "causal",
    driver_category: "area",
    allocation_ratios: [
      { source_id: "electricity_common", target_id: "11", ratio: 0.25, driver_value: 250 },
      { source_id: "electricity_common", target_id: "12", ratio: 0.20, driver_value: 200 },
      { source_id: "electricity_common", target_id: "13", ratio: 0.15, driver_value: 150 },
      { source_id: "electricity_common", target_id: "21", ratio: 0.30, driver_value: 300 },
      { source_id: "electricity_common", target_id: "311", ratio: 0.05, driver_value: 50 },
      { source_id: "electricity_common", target_id: "321", ratio: 0.03, driver_value: 30 },
      { source_id: "electricity_common", target_id: "411", ratio: 0.02, driver_value: 20 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // RTA: 활동원가 전환
  {
    id: "rule_rta_001",
    name: "부서별 인건비 → 활동 배분",
    description: "각 부서의 인건비를 업무시간 비율에 따라 활동별로 배분",
    stage: "rta",
    method: "proportional",
    is_active: true,
    priority: 1,
    source_type: "department",
    source_ids: ["11", "12", "13", "21"],
    target_type: "activity", 
    target_ids: ["1", "2", "3", "4", "5"],
    driver_id: "driver_time_001",
    driver_name: "업무시간 비율",
    driver_basis: "causal",
    driver_category: "time",
    allocation_ratios: [
      { source_id: "11", target_id: "1", ratio: 0.6, driver_value: 480 },
      { source_id: "11", target_id: "4", ratio: 0.3, driver_value: 240 },
      { source_id: "11", target_id: "5", ratio: 0.1, driver_value: 80 },
      { source_id: "12", target_id: "1", ratio: 0.4, driver_value: 320 },
      { source_id: "12", target_id: "6", ratio: 0.5, driver_value: 400 },
      { source_id: "12", target_id: "2", ratio: 0.1, driver_value: 80 },
      { source_id: "13", target_id: "3", ratio: 0.8, driver_value: 640 },
      { source_id: "13", target_id: "1", ratio: 0.2, driver_value: 160 },
      { source_id: "21", target_id: "2", ratio: 0.9, driver_value: 720 },
      { source_id: "21", target_id: "8", ratio: 0.1, driver_value: 80 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // ATA1: 자기부서 지원활동
  {
    id: "rule_ata1_001",
    name: "원무팀 내부 지원활동 배분",
    description: "원무팀 내 행정지원 활동을 실제 업무지원 활동으로 배분",
    stage: "ata1",
    method: "proportional",
    is_active: true,
    priority: 1,
    source_type: "activity",
    source_ids: ["admin_support"],
    target_type: "activity",
    target_ids: ["registration", "billing", "discharge"],
    driver_id: "driver_workload_001",
    driver_name: "업무량 비율",
    driver_basis: "benefit",
    driver_category: "volume",
    allocation_ratios: [
      { source_id: "admin_support", target_id: "registration", ratio: 0.4, driver_value: 400 },
      { source_id: "admin_support", target_id: "billing", ratio: 0.35, driver_value: 350 },
      { source_id: "admin_support", target_id: "discharge", ratio: 0.25, driver_value: 250 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // ATA2: 타부서 지원활동 (상호배분법)
  {
    id: "rule_ata2_001",
    name: "약제부 → 타부서 지원",
    description: "약제부 약품관리 활동을 타부서 진료활동으로 상호배분",
    stage: "ata2", 
    method: "reciprocal",
    is_active: true,
    priority: 1,
    source_type: "activity",
    source_ids: ["pharmacy_management"],
    target_type: "activity",
    target_ids: ["medical_treatment", "surgery", "nursing_care"],
    driver_id: "driver_prescription_001",
    driver_name: "처방건수",
    driver_basis: "causal",
    driver_category: "volume",
    allocation_ratios: [
      { source_id: "pharmacy_management", target_id: "medical_treatment", ratio: 0.5, driver_value: 2500 },
      { source_id: "pharmacy_management", target_id: "surgery", ratio: 0.3, driver_value: 1500 },
      { source_id: "pharmacy_management", target_id: "nursing_care", ratio: 0.2, driver_value: 1000 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // ATC: 활동원가 배부  
  {
    id: "rule_atc_001",
    name: "진료활동 → 환자진료과 배분",
    description: "진료활동 비용을 환자수에 따라 환자진료과별로 배분",
    stage: "atc",
    method: "proportional", 
    is_active: true,
    priority: 1,
    source_type: "activity",
    source_ids: ["1"],
    target_type: "cost_object",
    target_ids: ["pc4", "pc5", "pc7"],
    driver_id: "driver_patient_001",
    driver_name: "환자수",
    driver_basis: "causal",
    driver_category: "patient",
    allocation_ratios: [
      { source_id: "1", target_id: "pc4", ratio: 0.45, driver_value: 450 },
      { source_id: "1", target_id: "pc5", ratio: 0.35, driver_value: 350 },
      { source_id: "1", target_id: "pc7", ratio: 0.20, driver_value: 200 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // RTC: 자원 직접배부
  {
    id: "rule_rtc_001",
    name: "급식재료비 직접배부",
    description: "환자 급식재료비를 환자수에 따라 직접 원가대상에 배부",
    stage: "rtc",
    method: "direct",
    is_active: true,
    priority: 1,
    source_type: "account",
    source_ids: ["meal_materials"],
    target_type: "cost_object",
    target_ids: ["pc4", "pc5", "ed5", "ed8"],
    driver_id: "driver_meal_001",
    driver_name: "환자 급식수",
    driver_basis: "causal",
    driver_category: "patient",
    allocation_ratios: [
      { source_id: "meal_materials", target_id: "pc4", ratio: 0.3, driver_value: 300 },
      { source_id: "meal_materials", target_id: "pc5", ratio: 0.25, driver_value: 250 },
      { source_id: "meal_materials", target_id: "ed5", ratio: 0.25, driver_value: 250 },
      { source_id: "meal_materials", target_id: "ed8", ratio: 0.2, driver_value: 200 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // ETC: 비용 직접귀속
  {
    id: "rule_etc_001",
    name: "약품비 직접귀속",
    description: "처방성 약품비를 해당 환자에게 직접 귀속",
    stage: "etc",
    method: "direct",
    is_active: true,
    priority: 1,
    source_type: "account",
    source_ids: ["prescription_drugs"],
    target_type: "cost_object",
    target_ids: ["pc4", "pc5", "pc7"],
    driver_id: "driver_prescription_direct_001",
    driver_name: "처방약품비",
    driver_basis: "causal",
    driver_category: "other",
    allocation_ratios: [
      { source_id: "prescription_drugs", target_id: "pc4", ratio: 0.4, driver_value: 15000000 },
      { source_id: "prescription_drugs", target_id: "pc5", ratio: 0.35, driver_value: 13125000 },
      { source_id: "prescription_drugs", target_id: "pc7", ratio: 0.25, driver_value: 9375000 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // XTC: 수익 직접귀속
  {
    id: "rule_xtc_001",
    name: "검진수익 직접귀속",
    description: "건강검진 수익을 해당 검진센터에 직접 귀속",
    stage: "xtc",
    method: "direct",
    is_active: true,
    priority: 1,
    source_type: "revenue",
    source_ids: ["health_checkup_revenue"],
    target_type: "cost_object", 
    target_ids: ["checkup_center"],
    driver_id: "driver_checkup_revenue_001",
    driver_name: "검진수익",
    driver_basis: "causal",
    driver_category: "revenue",
    allocation_ratios: [
      { source_id: "health_checkup_revenue", target_id: "checkup_center", ratio: 1.0, driver_value: 50000000 }
    ],
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  }
]

// 더미 배분 시나리오 데이터  
export const mockAllocationScenarios: AllocationScenario[] = [
  {
    id: "scenario_001",
    name: "표준 ABC 배분",
    description: "기본적인 2단계 ABC 배분 시나리오",
    version: "1.0",
    is_default: true,
    is_active: true,
    allocation_rules: mockAllocationRules,
    execution_settings: {
      auto_calculation: true,
      rounding_method: "round",
      rounding_precision: 0,
      validation_checks: true
    },
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "scenario_002", 
    name: "정밀 ABC 배분",
    description: "더 세분화된 배분기준을 적용한 정밀 배분 시나리오",
    version: "2.0",
    is_default: false,
    is_active: true,
    allocation_rules: mockAllocationRules.slice(0, 3), // 일부 룰만 포함
    execution_settings: {
      auto_calculation: false,
      rounding_method: "round", 
      rounding_precision: 2,
      validation_checks: true
    },
    created_at: "2025-01-10",
    updated_at: "2025-01-20"
  }
]

// 더미 배분 실행 결과
export const mockAllocationResults: AllocationResult[] = [
  {
    id: "result_001",
    scenario_id: "scenario_001", 
    execution_date: "2025-01-15T10:30:00Z",
    status: "completed",
    total_cost_allocated: 455000000,
    total_rules_executed: 5,
    execution_time_ms: 2340,
    stage_results: [
      {
        stage: "rta",
        rules_executed: 2,
        total_amount: 300000000,
        allocations: [
          { rule_id: "rule_001", source_id: "11", target_id: "1", amount: 37800000, driver_value: 480, ratio: 0.6 },
          { rule_id: "rule_001", source_id: "11", target_id: "4", amount: 18900000, driver_value: 240, ratio: 0.3 },
          { rule_id: "rule_001", source_id: "11", target_id: "5", amount: 6300000, driver_value: 80, ratio: 0.1 },
          { rule_id: "rule_001", source_id: "12", target_id: "1", amount: 29200000, driver_value: 320, ratio: 0.4 },
          { rule_id: "rule_001", source_id: "12", target_id: "6", amount: 36500000, driver_value: 400, ratio: 0.5 },
          { rule_id: "rule_001", source_id: "12", target_id: "2", amount: 7300000, driver_value: 80, ratio: 0.1 }
        ]
      },
      {
        stage: "atc",
        rules_executed: 3,
        total_amount: 155000000,
        allocations: [
          { rule_id: "rule_003", source_id: "1", target_id: "pc4", amount: 30150000, driver_value: 450, ratio: 0.45 },
          { rule_id: "rule_003", source_id: "1", target_id: "pc5", amount: 23450000, driver_value: 350, ratio: 0.35 },
          { rule_id: "rule_003", source_id: "1", target_id: "pc7", amount: 13400000, driver_value: 200, ratio: 0.20 },
          { rule_id: "rule_004", source_id: "2", target_id: "ed5", amount: 43800000, driver_value: 7200, ratio: 0.6 },
          { rule_id: "rule_004", source_id: "2", target_id: "ed8", amount: 29200000, driver_value: 4800, ratio: 0.4 }
        ]
      }
    ],
    errors: [],
    warnings: ["일부 배분 비율의 합계가 100%를 초과합니다."]
  }
]

// 배분 단계별 라벨 (포괄적 ABC)
export const allocationStageLabels: Record<AllocationStage, string> = {
  rtr: "RTR: 공통원가 정산 (Resource → Resource)",
  rta: "RTA: 활동원가 전환 (Resource → Activity)", 
  ata1: "ATA1: 자기부서 지원활동 (Activity → Activity)",
  ata2: "ATA2: 타부서 지원활동 (Activity → Activity)",
  atc: "ATC: 활동원가 배부 (Activity → Cost Object)",
  rtc: "RTC: 자원 직접배부 (Resource → Cost Object)",
  etc: "ETC: 비용 직접귀속 (Direct Cost Attribution)",
  xtc: "XTC: 수익 직접귀속 (Revenue Direct Attribution)"
}

// 배분 방법별 라벨
export const allocationMethodLabels: Record<AllocationMethod, string> = {
  direct: "직접 배분",
  proportional: "비례 배분", 
  step_down: "단계적 배분",
  reciprocal: "상호 배분",
  equal: "균등 배분"
}

// 원가동인 기준별 라벨
export const costDriverBasisLabels: Record<CostDriverBasis, string> = {
  causal: "인과관계 기준 (Causal Relationship)",
  benefit: "수혜 기준 (Benefit Received)", 
  ability: "부담능력 기준 (Ability to Bear)"
}

// 원가동인 카테고리별 라벨
export const driverCategoryLabels = {
  time: "시간 기준 (수술시간, 검사시간 등)",
  area: "면적 기준 (부서별 면적)",
  patient: "환자수 기준 (외래/입원환자수)",
  volume: "건수 기준 (검사건수, 수술건수 등)",
  revenue: "매출 기준 (매출액, 수익기여도)",
  headcount: "인원수 기준 (부서별 인원수)",
  other: "기타 (상대가치점수, 조제건수 등)"
}

// 유틸리티 함수들
export function getActiveAllocationRules(stage?: AllocationStage): AllocationRule[] {
  const rules = mockAllocationRules.filter(rule => rule.is_active)
  return stage ? rules.filter(rule => rule.stage === stage) : rules
}

export function getAllocationRulesByScenario(scenarioId: string): AllocationRule[] {
  const scenario = mockAllocationScenarios.find(s => s.id === scenarioId)
  return scenario ? scenario.allocation_rules : []
}

export function calculateTotalAllocation(results: AllocationResult[]): number {
  return results.reduce((sum, result) => sum + result.total_cost_allocated, 0)
}

export function validateAllocationRatio(ratios: { ratio: number }[]): boolean {
  const totalRatio = ratios.reduce((sum, r) => sum + r.ratio, 0)
  return Math.abs(totalRatio - 1.0) <= 0.001 // 허용 오차 0.1%
}
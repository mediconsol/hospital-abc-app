// 배분기준(Driver) 관리 데이터 모델

export type DriverCategory = "area" | "time" | "patient" | "volume" | "revenue" | "headcount" | "other"

export type DriverBasis = "causal" | "benefit" | "ability"

export interface Driver {
  id: string
  name: string
  code: string
  category: DriverCategory
  basis: DriverBasis
  unit: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DriverValue {
  id: string
  driver_id: string
  source_id: string  // 부서, 활동, 계정, 수익 ID
  source_type: "department" | "activity" | "account" | "revenue"
  value: number
  period_month: number  // 1-12 or 0 for yearly
  description?: string
  created_at: string
  updated_at: string
}

export interface DriverAllocationPreview {
  source_id: string
  source_name: string
  source_type: string
  value: number
  ratio: number
  target_allocations: {
    target_id: string
    target_name: string
    target_type: string
    allocated_ratio: number
  }[]
}

// 더미 Driver 데이터
export const mockDrivers: Driver[] = [
  {
    id: "driver_area_001",
    name: "부서별 면적",
    code: "AREA001",
    category: "area",
    basis: "causal",
    unit: "㎡",
    description: "각 부서가 사용하는 물리적 공간 면적",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_time_001", 
    name: "업무시간 비율",
    code: "TIME001",
    category: "time",
    basis: "causal",
    unit: "시간",
    description: "각 활동에 투입되는 실제 업무시간",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_patient_001",
    name: "환자수",
    code: "PATIENT001", 
    category: "patient",
    basis: "causal",
    unit: "명",
    description: "진료과별 외래/입원 환자수",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_workload_001",
    name: "업무량 비율",
    code: "WORK001",
    category: "volume",
    basis: "benefit",
    unit: "건",
    description: "각 업무의 처리량 및 복잡도",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_prescription_001",
    name: "처방건수",
    code: "PRESC001",
    category: "volume", 
    basis: "causal",
    unit: "건",
    description: "각 진료과별 처방 발생 건수",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_meal_001",
    name: "환자 급식수",
    code: "MEAL001",
    category: "patient",
    basis: "causal", 
    unit: "식",
    description: "환자별 급식 제공 횟수",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_prescription_direct_001",
    name: "처방약품비",
    code: "DRUG001",
    category: "other",
    basis: "causal",
    unit: "원",
    description: "실제 처방된 약품의 비용",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "driver_checkup_revenue_001",
    name: "검진수익",
    code: "CHECKUP001",
    category: "revenue",
    basis: "causal",
    unit: "원", 
    description: "건강검진으로 발생하는 수익",
    is_active: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  }
]

// 더미 Driver Values 데이터
export const mockDriverValues: DriverValue[] = [
  // 부서별 면적 (전기료 배분용)
  {
    id: "dv_001",
    driver_id: "driver_area_001",
    source_id: "11", // 원무과
    source_type: "department",
    value: 250,
    period_month: 0, // 연간
    description: "원무과 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_002",
    driver_id: "driver_area_001", 
    source_id: "12", // 진료과
    source_type: "department",
    value: 200,
    period_month: 0,
    description: "진료과 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_003",
    driver_id: "driver_area_001",
    source_id: "13", // 간호과
    source_type: "department", 
    value: 150,
    period_month: 0,
    description: "간호과 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_004",
    driver_id: "driver_area_001",
    source_id: "21", // 약제부
    source_type: "department",
    value: 300,
    period_month: 0,
    description: "약제부 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_005",
    driver_id: "driver_area_001",
    source_id: "311", // 영양과
    source_type: "department",
    value: 50,
    period_month: 0,
    description: "영양과 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_006",
    driver_id: "driver_area_001",
    source_id: "321", // 의료정보팀
    source_type: "department",
    value: 30,
    period_month: 0,
    description: "의료정보팀 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_007",
    driver_id: "driver_area_001",
    source_id: "411", // 시설관리팀
    source_type: "department",
    value: 20,
    period_month: 0,
    description: "시설관리팀 사용 면적",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // 업무시간 비율 (RTA 배분용)
  {
    id: "dv_008",
    driver_id: "driver_time_001",
    source_id: "11", // 원무과
    source_type: "department",
    value: 480, // 진료활동에 투입되는 시간
    period_month: 1,
    description: "원무과 → 진료활동 투입시간",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_009",
    driver_id: "driver_time_001",
    source_id: "11",
    source_type: "department", 
    value: 240, // 원무활동에 투입되는 시간
    period_month: 1,
    description: "원무과 → 원무활동 투입시간",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_010",
    driver_id: "driver_time_001",
    source_id: "11",
    source_type: "department",
    value: 80, // 행정활동에 투입되는 시간
    period_month: 1,
    description: "원무과 → 행정활동 투입시간",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // 환자수 (ATC 배분용)
  {
    id: "dv_011",
    driver_id: "driver_patient_001",
    source_id: "pc4", // 신장내과(외래)
    source_type: "account",
    value: 450,
    period_month: 1,
    description: "신장내과 외래 환자수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_012",
    driver_id: "driver_patient_001",
    source_id: "pc5", // 신장내과(입원)
    source_type: "account",
    value: 350,
    period_month: 1,
    description: "신장내과 입원 환자수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_013",
    driver_id: "driver_patient_001",
    source_id: "pc7", // 순환기내과(외래)
    source_type: "account",
    value: 200,
    period_month: 1,
    description: "순환기내과 외래 환자수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },

  // 급식수 (RTC 배분용)
  {
    id: "dv_014",
    driver_id: "driver_meal_001",
    source_id: "pc4", // 신장내과(외래)
    source_type: "account",
    value: 300,
    period_month: 1,
    description: "신장내과 외래 급식 제공수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_015",
    driver_id: "driver_meal_001",
    source_id: "pc5", // 신장내과(입원)
    source_type: "account",
    value: 250,
    period_month: 1,
    description: "신장내과 입원 급식 제공수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_016",
    driver_id: "driver_meal_001",
    source_id: "ed5", // 11병동(입원)
    source_type: "account",
    value: 250,
    period_month: 1,
    description: "11병동 입원 급식 제공수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  },
  {
    id: "dv_017",
    driver_id: "driver_meal_001",
    source_id: "ed8", // 8병동(입원)
    source_type: "account",
    value: 200,
    period_month: 1,
    description: "8병동 입원 급식 제공수",
    created_at: "2025-01-01",
    updated_at: "2025-01-15"
  }
]

// 카테고리별 라벨
export const driverCategoryLabels: Record<DriverCategory, string> = {
  area: "면적 기준",
  time: "시간 기준", 
  patient: "환자수 기준",
  volume: "건수 기준",
  revenue: "매출 기준",
  headcount: "인원수 기준",
  other: "기타"
}

// 기준별 라벨
export const driverBasisLabels: Record<DriverBasis, string> = {
  causal: "인과관계",
  benefit: "수혜 기준",
  ability: "부담능력"
}

// 유틸리티 함수들
export function getDriversByCategory(category: DriverCategory): Driver[] {
  return mockDrivers.filter(driver => driver.category === category)
}

export function getDriverValuesByDriver(driverId: string): DriverValue[] {
  return mockDriverValues.filter(value => value.driver_id === driverId)
}

export function getDriverValuesBySource(sourceId: string, sourceType: string): DriverValue[] {
  return mockDriverValues.filter(value => 
    value.source_id === sourceId && value.source_type === sourceType
  )
}

export function calculateAllocationRatios(driverId: string): DriverAllocationPreview[] {
  const driverValues = getDriverValuesByDriver(driverId)
  const totalValue = driverValues.reduce((sum, value) => sum + value.value, 0)
  
  return driverValues.map(value => ({
    source_id: value.source_id,
    source_name: value.source_id, // 실제로는 lookup 필요
    source_type: value.source_type,
    value: value.value,
    ratio: totalValue > 0 ? value.value / totalValue : 0,
    target_allocations: [] // 실제 배분 대상은 배분 규칙에서 가져와야 함
  }))
}

export function validateDriverValues(values: DriverValue[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // 값이 0 이하인 경우
  const invalidValues = values.filter(v => v.value <= 0)
  if (invalidValues.length > 0) {
    errors.push(`${invalidValues.length}개의 드라이버 값이 0 이하입니다.`)
  }
  
  // 누락된 필수 소스가 있는 경우 체크 (실제로는 비즈니스 로직에 따라)
  const totalValue = values.reduce((sum, v) => sum + v.value, 0)
  if (totalValue === 0) {
    errors.push("전체 드라이버 값의 합이 0입니다.")
  }
  
  // 경고: 편차가 큰 경우
  if (values.length > 1) {
    const average = totalValue / values.length
    const hasLargeDeviation = values.some(v => 
      Math.abs(v.value - average) / average > 2.0 // 평균의 200% 이상 차이
    )
    if (hasLargeDeviation) {
      warnings.push("일부 드라이버 값이 평균과 큰 차이를 보입니다.")
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
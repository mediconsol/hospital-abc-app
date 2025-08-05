// 배분기준 매핑 데이터 모델

import { Driver, DriverValue } from "./driver-data"
import { AllocationRule, AllocationStage } from "./allocation-data"

// 드라이버와 배분규칙 간의 매핑
export interface DriverMapping {
  id: string
  driver_id: string
  allocation_rule_id: string
  mapping_type: "direct" | "calculated" | "manual"
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
  
  // 매핑 설정
  mapping_config: {
    auto_sync: boolean // 드라이버 값 변경 시 자동 동기화
    override_ratios: boolean // 수동으로 비율 조정 허용
    validation_rules: string[] // 검증 규칙 목록
  }
  
  // 매핑 상태
  sync_status: "synced" | "out_of_sync" | "error"
  last_sync_date?: string
  sync_errors?: string[]
}

// 매핑 템플릿 (단계별 권장 매핑)
export interface MappingTemplate {
  id: string
  name: string
  description: string
  stage: AllocationStage
  recommended_driver_categories: string[]
  mapping_rules: {
    driver_category: string
    target_type: "department" | "activity" | "cost_object" | "account"
    mapping_logic: string
  }[]
}

// 매핑 검증 결과
export interface MappingValidation {
  mapping_id: string
  is_valid: boolean
  errors: {
    code: string
    message: string
    severity: "error" | "warning" | "info"
  }[]
  recommendations: string[]
  coverage_score: number // 0-100, 매핑 커버리지
}

// 더미 매핑 템플릿 데이터
export const mockMappingTemplates: MappingTemplate[] = [
  {
    id: "template_rtr_001",
    name: "RTR 단계 표준 매핑",
    description: "공통원가 정산을 위한 면적/사용량 기준 매핑",
    stage: "rtr",
    recommended_driver_categories: ["area", "volume", "headcount"],
    mapping_rules: [
      {
        driver_category: "area",
        target_type: "department",
        mapping_logic: "부서별 면적 비율에 따른 공통비용 배분"
      },
      {
        driver_category: "volume",
        target_type: "department", 
        mapping_logic: "사용량 기준 유틸리티 비용 배분"
      }
    ]
  },
  {
    id: "template_rta_001",
    name: "RTA 단계 표준 매핑",
    description: "활동원가 전환을 위한 시간/업무량 기준 매핑",
    stage: "rta",
    recommended_driver_categories: ["time", "volume", "headcount"],
    mapping_rules: [
      {
        driver_category: "time",
        target_type: "activity",
        mapping_logic: "업무시간 비율에 따른 인건비 활동 배분"
      },
      {
        driver_category: "volume",
        target_type: "activity",
        mapping_logic: "업무량 기준 활동별 자원 배분"
      }
    ]
  },
  {
    id: "template_atc_001", 
    name: "ATC 단계 표준 매핑",
    description: "활동원가를 원가대상으로 배분하기 위한 환자/건수 기준 매핑",
    stage: "atc",
    recommended_driver_categories: ["patient", "volume", "revenue"],
    mapping_rules: [
      {
        driver_category: "patient",
        target_type: "cost_object",
        mapping_logic: "환자수 기준 진료활동 원가 배분"
      },
      {
        driver_category: "volume",
        target_type: "cost_object",
        mapping_logic: "진료건수 기준 활동원가 배분"
      }
    ]
  }
]

// 더미 드라이버 매핑 데이터
export const mockDriverMappings: DriverMapping[] = [
  {
    id: "mapping_001",
    driver_id: "driver_area_001", // 부서별 면적
    allocation_rule_id: "rule_rtr_001", // 전기료 공통원가 정산
    mapping_type: "direct",
    is_active: true,
    priority: 1,
    created_at: "2025-01-01",
    updated_at: "2025-01-15",
    mapping_config: {
      auto_sync: true,
      override_ratios: false,
      validation_rules: ["total_ratio_100", "positive_values", "no_zero_divisions"]
    },
    sync_status: "synced",
    last_sync_date: "2025-01-15T10:30:00Z"
  },
  {
    id: "mapping_002", 
    driver_id: "driver_time_001", // 업무시간 비율
    allocation_rule_id: "rule_rta_001", // 부서별 인건비 → 활동 배분
    mapping_type: "direct",
    is_active: true,
    priority: 1,
    created_at: "2025-01-01",
    updated_at: "2025-01-15",
    mapping_config: {
      auto_sync: true,
      override_ratios: true,
      validation_rules: ["total_ratio_100", "positive_values"]
    },
    sync_status: "synced",
    last_sync_date: "2025-01-15T11:15:00Z"
  },
  {
    id: "mapping_003",
    driver_id: "driver_patient_001", // 환자수
    allocation_rule_id: "rule_atc_001", // 진료활동 → 환자진료과 배분
    mapping_type: "calculated",
    is_active: true,
    priority: 1,
    created_at: "2025-01-01",
    updated_at: "2025-01-15",
    mapping_config: {
      auto_sync: true,
      override_ratios: false,
      validation_rules: ["total_ratio_100", "positive_values", "patient_count_valid"]
    },
    sync_status: "out_of_sync",
    last_sync_date: "2025-01-14T16:20:00Z",
    sync_errors: ["환자수 데이터가 일부 누락되었습니다."]
  },
  {
    id: "mapping_004",
    driver_id: "driver_meal_001", // 환자 급식수
    allocation_rule_id: "rule_rtc_001", // 급식재료비 직접배부
    mapping_type: "direct",
    is_active: true,
    priority: 1,
    created_at: "2025-01-01",
    updated_at: "2025-01-15",
    mapping_config: {
      auto_sync: true,
      override_ratios: false,
      validation_rules: ["total_ratio_100", "positive_values"]
    },
    sync_status: "synced",
    last_sync_date: "2025-01-15T09:45:00Z"
  }
]

// 유틸리티 함수들
export function getMappingsByDriver(driverId: string): DriverMapping[] {
  return mockDriverMappings.filter(mapping => mapping.driver_id === driverId)
}

export function getMappingsByRule(ruleId: string): DriverMapping[] {
  return mockDriverMappings.filter(mapping => mapping.allocation_rule_id === ruleId)
}

export function getMappingsByStage(stage: AllocationStage): DriverMapping[] {
  // 실제로는 배분규칙과 조인해서 가져와야 함
  const stageRuleIds = {
    "rtr": ["rule_rtr_001"],
    "rta": ["rule_rta_001"], 
    "ata1": ["rule_ata1_001"],
    "ata2": ["rule_ata2_001"],
    "atc": ["rule_atc_001"],
    "rtc": ["rule_rtc_001"],
    "etc": ["rule_etc_001"],
    "xtc": ["rule_xtc_001"]
  }
  
  const ruleIds = stageRuleIds[stage] || []
  return mockDriverMappings.filter(mapping => 
    ruleIds.includes(mapping.allocation_rule_id)
  )
}

export function validateMapping(mapping: DriverMapping): MappingValidation {
  const errors: MappingValidation['errors'] = []
  const recommendations: string[] = []
  
  // 기본 검증
  if (!mapping.driver_id) {
    errors.push({
      code: "MISSING_DRIVER",
      message: "드라이버가 선택되지 않았습니다.",
      severity: "error"
    })
  }
  
  if (!mapping.allocation_rule_id) {
    errors.push({
      code: "MISSING_RULE",
      message: "배분규칙이 선택되지 않았습니다.",
      severity: "error"
    })
  }
  
  // 동기화 상태 검증
  if (mapping.sync_status === "out_of_sync") {
    errors.push({
      code: "OUT_OF_SYNC",
      message: "드라이버 값과 배분규칙이 동기화되지 않았습니다.",
      severity: "warning"
    })
    recommendations.push("동기화를 실행하여 최신 상태로 업데이트하세요.")
  }
  
  // 커버리지 계산 (간단한 예시)
  let coverage = 80
  if (mapping.sync_status === "synced" && mapping.is_active) {
    coverage = 95
  } else if (mapping.sync_status === "out_of_sync") {
    coverage = 60
  }
  
  return {
    mapping_id: mapping.id,
    is_valid: errors.filter(e => e.severity === "error").length === 0,
    errors,
    recommendations,
    coverage_score: coverage
  }
}

export function getMappingTemplate(stage: AllocationStage): MappingTemplate | undefined {
  return mockMappingTemplates.find(template => template.stage === stage)
}

// 매핑 동기화 함수
export async function syncDriverMapping(mappingId: string): Promise<{
  success: boolean
  message: string
  updated_ratios?: number
}> {
  // 실제로는 API 호출
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: "매핑이 성공적으로 동기화되었습니다.",
    updated_ratios: 12
  }
}

// 자동 매핑 제안 함수
export function suggestDriverMapping(
  driverId: string, 
  stage: AllocationStage
): {
  suggested_rules: string[]
  confidence_score: number
  reason: string
}[] {
  // 간단한 예시 로직
  const suggestions = [
    {
      suggested_rules: ["rule_rtr_001"],
      confidence_score: 0.9,
      reason: "드라이버 카테고리와 배분단계가 일치합니다."
    }
  ]
  
  return suggestions
}
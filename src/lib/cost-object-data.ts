// 원가대상 관리 데이터 모델 및 더미 데이터

// 원가대상 관점 타입
export type CostObjectType = "patient_care" | "execution_dept" | "prescribing_doctor" | "executing_doctor"

// 원가대상 데이터 타입
export interface CostObject {
  id: string
  name: string
  code: string
  type: CostObjectType
  level: number
  parent_id?: string
  path: string // 계층 경로 (예: "1/2/3")
  description?: string
  is_active: boolean
  is_final_target: boolean // 최종 원가대상 여부
  created_at: string
  updated_at: string
  children?: CostObject[]
}

// 더미 원가대상 데이터 - 환자진료과
export const mockPatientCareCostObjects: CostObject[] = [
  {
    id: "pc1",
    name: "진료부",
    code: "PC001",
    type: "patient_care",
    level: 1,
    path: "pc1",
    description: "환자진료부 전체",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc2",
    name: "내과",
    code: "PC002",
    type: "patient_care",
    level: 2,
    parent_id: "pc1",
    path: "pc1/pc2",
    description: "내과 전체",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc3",
    name: "신장내과",
    code: "PC003",
    type: "patient_care",
    level: 3,
    parent_id: "pc2",
    path: "pc1/pc2/pc3",
    description: "신장내과",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc4",
    name: "신장내과(외래)",
    code: "PC004",
    type: "patient_care",
    level: 4,
    parent_id: "pc3",
    path: "pc1/pc2/pc3/pc4",
    description: "신장내과 외래 진료",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc5",
    name: "신장내과(입원)",
    code: "PC005",
    type: "patient_care",
    level: 4,
    parent_id: "pc3",
    path: "pc1/pc2/pc3/pc5",
    description: "신장내과 입원 진료",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc6",
    name: "순환기내과",
    code: "PC006",
    type: "patient_care",
    level: 3,
    parent_id: "pc2",
    path: "pc1/pc2/pc6",
    description: "순환기내과",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc7",
    name: "순환기내과(외래)",
    code: "PC007",
    type: "patient_care",
    level: 4,
    parent_id: "pc6",
    path: "pc1/pc2/pc6/pc7",
    description: "순환기내과 외래 진료",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc8",
    name: "외과",
    code: "PC008",
    type: "patient_care",
    level: 2,
    parent_id: "pc1",
    path: "pc1/pc8",
    description: "외과 전체",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc9",
    name: "신경외과",
    code: "PC009",
    type: "patient_care",
    level: 3,
    parent_id: "pc8",
    path: "pc1/pc8/pc9",
    description: "신경외과",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pc10",
    name: "신경외과(수술)",
    code: "PC010",
    type: "patient_care",
    level: 4,
    parent_id: "pc9",
    path: "pc1/pc8/pc9/pc10",
    description: "신경외과 수술",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  }
]

// 더미 원가대상 데이터 - 시행과
export const mockExecutionDeptCostObjects: CostObject[] = [
  {
    id: "ed1",
    name: "병실료",
    code: "ED001",
    type: "execution_dept",
    level: 1,
    path: "ed1",
    description: "병실료 관련 부서",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed2",
    name: "신경외과",
    code: "ED002",
    type: "execution_dept",
    level: 2,
    parent_id: "ed1",
    path: "ed1/ed2",
    description: "신경외과 병실료",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed3",
    name: "입원",
    code: "ED003",
    type: "execution_dept",
    level: 3,
    parent_id: "ed2",
    path: "ed1/ed2/ed3",
    description: "신경외과 입원",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed4",
    name: "11병동",
    code: "ED004",
    type: "execution_dept",
    level: 4,
    parent_id: "ed3",
    path: "ed1/ed2/ed3/ed4",
    description: "11병동",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed5",
    name: "11병동(입원)",
    code: "ED005",
    type: "execution_dept",
    level: 5,
    parent_id: "ed4",
    path: "ed1/ed2/ed3/ed4/ed5",
    description: "11병동 입원 서비스",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed6",
    name: "내과",
    code: "ED006",
    type: "execution_dept",
    level: 2,
    parent_id: "ed1",
    path: "ed1/ed6",
    description: "내과 병실료",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed7",
    name: "8병동",
    code: "ED007",
    type: "execution_dept",
    level: 3,
    parent_id: "ed6",
    path: "ed1/ed6/ed7",
    description: "8병동",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "ed8",
    name: "8병동(입원)",
    code: "ED008",
    type: "execution_dept",
    level: 4,
    parent_id: "ed7",
    path: "ed1/ed6/ed7/ed8",
    description: "8병동 입원 서비스",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  // 추가: 검진센터
  {
    id: "checkup_center",
    name: "건강검진센터",
    code: "CC001",
    type: "execution_dept",
    level: 1,
    path: "checkup_center",
    description: "건강검진센터",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  }
]

// 더미 원가대상 데이터 - 처방의사
export const mockPrescribingDoctorCostObjects: CostObject[] = [
  {
    id: "pd1",
    name: "식이요법료",
    code: "PD001",
    type: "prescribing_doctor",
    level: 1,
    path: "pd1",
    description: "식이요법료 관련",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd2",
    name: "자동발생",
    code: "PD002",
    type: "prescribing_doctor",
    level: 2,
    parent_id: "pd1",
    path: "pd1/pd2",
    description: "자동발생 식이요법료",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd3",
    name: "재활의학과",
    code: "PD003",
    type: "prescribing_doctor",
    level: 3,
    parent_id: "pd2",
    path: "pd1/pd2/pd3",
    description: "재활의학과",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd4",
    name: "영양팀",
    code: "PD004",
    type: "prescribing_doctor",
    level: 4,
    parent_id: "pd3",
    path: "pd1/pd2/pd3/pd4",
    description: "영양팀",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd5",
    name: "김원장",
    code: "PD005",
    type: "prescribing_doctor",
    level: 5,
    parent_id: "pd4",
    path: "pd1/pd2/pd3/pd4/pd5",
    description: "김원장 - 재활의학과 영양팀",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd6",
    name: "진료수가",
    code: "PD006",
    type: "prescribing_doctor",
    level: 1,
    path: "pd6",
    description: "진료수가 관련",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd7",
    name: "내과",
    code: "PD007",
    type: "prescribing_doctor",
    level: 2,
    parent_id: "pd6",
    path: "pd6/pd7",
    description: "내과 진료수가",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd8",
    name: "신장내과",
    code: "PD008",
    type: "prescribing_doctor",
    level: 3,
    parent_id: "pd7",
    path: "pd6/pd7/pd8",
    description: "신장내과",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd9",
    name: "이원장",
    code: "PD009",
    type: "prescribing_doctor",
    level: 4,
    parent_id: "pd8",
    path: "pd6/pd7/pd8/pd9",
    description: "이원장 - 신장내과",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "pd10",
    name: "박원장",
    code: "PD010",
    type: "prescribing_doctor",
    level: 4,
    parent_id: "pd8",
    path: "pd6/pd7/pd8/pd10",
    description: "박원장 - 신장내과",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  }
]

// 더미 원가대상 데이터 - 시행의사
export const mockExecutingDoctorCostObjects: CostObject[] = [
  {
    id: "exd1",
    name: "병실료",
    code: "EXD001",
    type: "executing_doctor",
    level: 1,
    path: "exd1",
    description: "병실료 관련",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd2",
    name: "내과",
    code: "EXD002",
    type: "executing_doctor",
    level: 2,
    parent_id: "exd1",
    path: "exd1/exd2",
    description: "내과 병실료",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd3",
    name: "8병동",
    code: "EXD003",
    type: "executing_doctor",
    level: 3,
    parent_id: "exd2",
    path: "exd1/exd2/exd3",
    description: "8병동",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd4",
    name: "박원장",
    code: "EXD004",
    type: "executing_doctor",
    level: 4,
    parent_id: "exd3",
    path: "exd1/exd2/exd3/exd4",
    description: "박원장 - 8병동 담당",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd5",
    name: "수술료",
    code: "EXD005",
    type: "executing_doctor",
    level: 1,
    path: "exd5",
    description: "수술료 관련",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd6",
    name: "신경외과",
    code: "EXD006",
    type: "executing_doctor",
    level: 2,
    parent_id: "exd5",
    path: "exd5/exd6",
    description: "신경외과 수술료",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd7",
    name: "뇌수술",
    code: "EXD007",
    type: "executing_doctor",
    level: 3,
    parent_id: "exd6",
    path: "exd5/exd6/exd7",
    description: "뇌수술",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd8",
    name: "김원장",
    code: "EXD008",
    type: "executing_doctor",
    level: 4,
    parent_id: "exd7",
    path: "exd5/exd6/exd7/exd8",
    description: "김원장 - 뇌수술 전문",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd9",
    name: "척추수술",
    code: "EXD009",
    type: "executing_doctor",
    level: 3,
    parent_id: "exd6",
    path: "exd5/exd6/exd9",
    description: "척추수술",
    is_active: true,
    is_final_target: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: "exd10",
    name: "정원장",
    code: "EXD010",
    type: "executing_doctor",
    level: 4,
    parent_id: "exd9",
    path: "exd5/exd6/exd9/exd10",
    description: "정원장 - 척추수술 전문",
    is_active: true,
    is_final_target: true,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  }
]

// 원가대상 타입별 레이블
export const costObjectTypeLabels: Record<CostObjectType, string> = {
  patient_care: "환자진료과",
  execution_dept: "시행과",
  prescribing_doctor: "처방의사",
  executing_doctor: "시행의사"
}

// 원가대상 타입별 색상
export const costObjectTypeColors: Record<CostObjectType, string> = {
  patient_care: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  execution_dept: "bg-green-500/10 text-green-600 border-green-500/20",
  prescribing_doctor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  executing_doctor: "bg-orange-500/10 text-orange-600 border-orange-500/20"
}

// 모든 원가대상 데이터
export const allCostObjects: CostObject[] = [
  ...mockPatientCareCostObjects,
  ...mockExecutionDeptCostObjects,
  ...mockPrescribingDoctorCostObjects,
  ...mockExecutingDoctorCostObjects
]

// 원가대상 타입별 데이터 조회 함수
export function getCostObjectsByType(type: CostObjectType): CostObject[] {
  switch (type) {
    case "patient_care":
      return mockPatientCareCostObjects
    case "execution_dept":
      return mockExecutionDeptCostObjects
    case "prescribing_doctor":
      return mockPrescribingDoctorCostObjects
    case "executing_doctor":
      return mockExecutingDoctorCostObjects
    default:
      return []
  }
}

// 계층형 트리 구조 생성 함수
export function buildCostObjectTree(objects: CostObject[]): CostObject[] {
  if (!objects || objects.length === 0) {
    return []
  }

  const objectMap = new Map<string, CostObject>()
  const rootObjects: CostObject[] = []

  // 모든 객체를 맵에 저장
  objects.forEach(obj => {
    objectMap.set(obj.id, { ...obj, children: [] })
  })

  // 계층 구조 생성
  objects.forEach(obj => {
    const currentObj = objectMap.get(obj.id)
    if (!currentObj) return
    
    if (obj.parent_id) {
      const parent = objectMap.get(obj.parent_id)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(currentObj)
      } else {
        // 부모를 찾을 수 없는 경우 루트로 처리
        console.warn(`Parent not found for ${obj.id}, treating as root`)
        rootObjects.push(currentObj)
      }
    } else {
      rootObjects.push(currentObj)
    }
  })

  // 디버깅 로그
  console.log('buildCostObjectTree - Input objects:', objects.length)
  console.log('buildCostObjectTree - Root objects:', rootObjects.length)
  console.log('buildCostObjectTree - Root items:', rootObjects.map(r => ({ id: r.id, name: r.name, children: r.children?.length || 0 })))

  return rootObjects
}

// 모든 원가대상 데이터 가져오기
export function getAllCostObjects(): CostObject[] {
  return [
    ...mockPatientCareCostObjects,
    ...mockExecutionDeptCostObjects,
    ...mockPrescribingDoctorCostObjects,
    ...mockExecutingDoctorCostObjects
  ]
}

// 최종 원가대상만 필터링
export function getFinalCostObjects(objects?: CostObject[]): CostObject[] {
  const allObjects = objects || getAllCostObjects()
  return allObjects.filter(obj => obj.is_final_target)
}
import { WorkRatio } from '@/types';

// 현실적이고 풍부한 업무비율 더미 데이터
export const enhancedWorkRatios: WorkRatio[] = [
  // === 김진료 (내과 과장) - E001 ===
  {
    id: 'wr001',
    hospital_id: '1',
    period_id: '1',
    employee_id: '1',
    activity_id: '1', // 진료활동
    ratio: 0.50,
    hours: 80,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr002',
    hospital_id: '1',
    period_id: '1',
    employee_id: '1',
    activity_id: '2', // 간호활동 (의사도 일부 간호 감독)
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr003',
    hospital_id: '1',
    period_id: '1',
    employee_id: '1',
    activity_id: '5', // 원무활동 (행정업무)
    ratio: 0.25,
    hours: 40,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr004',
    hospital_id: '1',
    period_id: '1',
    employee_id: '1',
    activity_id: '4', // 검체검사 (판독 및 검토)
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 이내과 (내과 전문의) - E002 ===
  {
    id: 'wr005',
    hospital_id: '1',
    period_id: '1',
    employee_id: '2',
    activity_id: '1', // 진료활동
    ratio: 0.75,
    hours: 120,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr006',
    hospital_id: '1',
    period_id: '1',
    employee_id: '2',
    activity_id: '4', // 검체검사
    ratio: 0.20,
    hours: 32,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr007',
    hospital_id: '1',
    period_id: '1',
    employee_id: '2',
    activity_id: '5', // 원무활동
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 박전공의 (내과 전공의) - E003 ===
  {
    id: 'wr008',
    hospital_id: '1',
    period_id: '1',
    employee_id: '3',
    activity_id: '1', // 진료활동
    ratio: 0.65,
    hours: 117,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr009',
    hospital_id: '1',
    period_id: '1',
    employee_id: '3',
    activity_id: '2', // 간호활동 (보조)
    ratio: 0.25,
    hours: 45,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr010',
    hospital_id: '1',
    period_id: '1',
    employee_id: '3',
    activity_id: '4', // 검체검사
    ratio: 0.10,
    hours: 18,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 최인턴 (내과 인턴) - E004 ===
  {
    id: 'wr011',
    hospital_id: '1',
    period_id: '1',
    employee_id: '4',
    activity_id: '1', // 진료활동
    ratio: 0.45,
    hours: 90,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr012',
    hospital_id: '1',
    period_id: '1',
    employee_id: '4',
    activity_id: '2', // 간호활동
    ratio: 0.30,
    hours: 60,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr013',
    hospital_id: '1',
    period_id: '1',
    employee_id: '4',
    activity_id: '4', // 검체검사
    ratio: 0.15,
    hours: 30,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr014',
    hospital_id: '1',
    period_id: '1',
    employee_id: '4',
    activity_id: '5', // 원무활동
    ratio: 0.10,
    hours: 20,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 정외과 (외과 과장) - E005 ===
  {
    id: 'wr015',
    hospital_id: '1',
    period_id: '1',
    employee_id: '5',
    activity_id: '1', // 진료활동 (수술 포함)
    ratio: 0.60,
    hours: 96,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr016',
    hospital_id: '1',
    period_id: '1',
    employee_id: '5',
    activity_id: '6', // 수술활동
    ratio: 0.25,
    hours: 40,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr017',
    hospital_id: '1',
    period_id: '1',
    employee_id: '5',
    activity_id: '5', // 원무활동
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 강수술 (외과 전문의) - E006 ===
  {
    id: 'wr018',
    hospital_id: '1',
    period_id: '1',
    employee_id: '6',
    activity_id: '1', // 진료활동
    ratio: 0.55,
    hours: 88,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr019',
    hospital_id: '1',
    period_id: '1',
    employee_id: '6',
    activity_id: '6', // 수술활동
    ratio: 0.35,
    hours: 56,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr020',
    hospital_id: '1',
    period_id: '1',
    employee_id: '6',
    activity_id: '2', // 간호활동 (수술 보조)
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 송외과 (외과 전공의) - E007 ===
  {
    id: 'wr021',
    hospital_id: '1',
    period_id: '1',
    employee_id: '7',
    activity_id: '1', // 진료활동
    ratio: 0.50,
    hours: 95,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr022',
    hospital_id: '1',
    period_id: '1',
    employee_id: '7',
    activity_id: '6', // 수술활동
    ratio: 0.30,
    hours: 57,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr023',
    hospital_id: '1',
    period_id: '1',
    employee_id: '7',
    activity_id: '2', // 간호활동
    ratio: 0.20,
    hours: 38,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 김영상 (영상의학과 과장) - E008 ===
  {
    id: 'wr024',
    hospital_id: '1',
    period_id: '1',
    employee_id: '8',
    activity_id: '3', // 영상촬영
    ratio: 0.60,
    hours: 96,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr025',
    hospital_id: '1',
    period_id: '1',
    employee_id: '8',
    activity_id: '1', // 진료활동 (판독)
    ratio: 0.25,
    hours: 40,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr026',
    hospital_id: '1',
    period_id: '1',
    employee_id: '8',
    activity_id: '5', // 원무활동
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 이CT (방사선사) - E009 ===
  {
    id: 'wr027',
    hospital_id: '1',
    period_id: '1',
    employee_id: '9',
    activity_id: '3', // 영상촬영
    ratio: 0.85,
    hours: 136,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr028',
    hospital_id: '1',
    period_id: '1',
    employee_id: '9',
    activity_id: '7', // 장비관리
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr029',
    hospital_id: '1',
    period_id: '1',
    employee_id: '9',
    activity_id: '5', // 원무활동
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 박MRI (방사선사) - E010 ===
  {
    id: 'wr030',
    hospital_id: '1',
    period_id: '1',
    employee_id: '10',
    activity_id: '3', // 영상촬영
    ratio: 0.80,
    hours: 128,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr031',
    hospital_id: '1',
    period_id: '1',
    employee_id: '10',
    activity_id: '7', // 장비관리
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr032',
    hospital_id: '1',
    period_id: '1',
    employee_id: '10',
    activity_id: '5', // 원무활동
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 이간호 (간호부장) - E011 ===
  {
    id: 'wr033',
    hospital_id: '1',
    period_id: '1',
    employee_id: '11',
    activity_id: '2', // 간호활동
    ratio: 0.50,
    hours: 80,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr034',
    hospital_id: '1',
    period_id: '1',
    employee_id: '11',
    activity_id: '5', // 원무활동 (관리업무)
    ratio: 0.35,
    hours: 56,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr035',
    hospital_id: '1',
    period_id: '1',
    employee_id: '11',
    activity_id: '8', // 교육활동
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 최수간호사 (수간호사) - E012 ===
  {
    id: 'wr036',
    hospital_id: '1',
    period_id: '1',
    employee_id: '12',
    activity_id: '2', // 간호활동
    ratio: 0.70,
    hours: 112,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr037',
    hospital_id: '1',
    period_id: '1',
    employee_id: '12',
    activity_id: '5', // 원무활동
    ratio: 0.20,
    hours: 32,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr038',
    hospital_id: '1',
    period_id: '1',
    employee_id: '12',
    activity_id: '8', // 교육활동
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 정간호사 (간호사) - E013 ===
  {
    id: 'wr039',
    hospital_id: '1',
    period_id: '1',
    employee_id: '13',
    activity_id: '2', // 간호활동
    ratio: 0.90,
    hours: 144,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr040',
    hospital_id: '1',
    period_id: '1',
    employee_id: '13',
    activity_id: '5', // 원무활동
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 김신규간호사 (간호사) - E014 ===
  {
    id: 'wr041',
    hospital_id: '1',
    period_id: '1',
    employee_id: '14',
    activity_id: '2', // 간호활동
    ratio: 0.85,
    hours: 136,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr042',
    hospital_id: '1',
    period_id: '1',
    employee_id: '14',
    activity_id: '8', // 교육활동 (신규자 교육)
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr043',
    hospital_id: '1',
    period_id: '1',
    employee_id: '14',
    activity_id: '5', // 원무활동
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 윤원무 (원무팀장) - E015 ===
  {
    id: 'wr044',
    hospital_id: '1',
    period_id: '1',
    employee_id: '15',
    activity_id: '5', // 원무활동
    ratio: 0.80,
    hours: 128,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr045',
    hospital_id: '1',
    period_id: '1',
    employee_id: '15',
    activity_id: '9', // 보험청구
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr046',
    hospital_id: '1',
    period_id: '1',
    employee_id: '15',
    activity_id: '10', // 통계관리
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 조접수 (원무 주임) - E016 ===
  {
    id: 'wr047',
    hospital_id: '1',
    period_id: '1',
    employee_id: '16',
    activity_id: '5', // 원무활동
    ratio: 0.95,
    hours: 152,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr048',
    hospital_id: '1',
    period_id: '1',
    employee_id: '16',
    activity_id: '9', // 보험청구
    ratio: 0.05,
    hours: 8,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 한수납 (원무 사원) - E017 ===
  {
    id: 'wr049',
    hospital_id: '1',
    period_id: '1',
    employee_id: '17',
    activity_id: '5', // 원무활동
    ratio: 1.0,
    hours: 160,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 이회계 (회계팀장) - E018 ===
  {
    id: 'wr050',
    hospital_id: '1',
    period_id: '1',
    employee_id: '18',
    activity_id: '11', // 회계업무
    ratio: 0.70,
    hours: 112,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr051',
    hospital_id: '1',
    period_id: '1',
    employee_id: '18',
    activity_id: '10', // 통계관리
    ratio: 0.20,
    hours: 32,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr052',
    hospital_id: '1',
    period_id: '1',
    employee_id: '18',
    activity_id: '5', // 원무활동 (지원)
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 신예산 (회계 주임) - E019 ===
  {
    id: 'wr053',
    hospital_id: '1',
    period_id: '1',
    employee_id: '19',
    activity_id: '11', // 회계업무
    ratio: 0.85,
    hours: 136,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr054',
    hospital_id: '1',
    period_id: '1',
    employee_id: '19',
    activity_id: '10', // 통계관리
    ratio: 0.15,
    hours: 24,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },

  // === 20번째 직원 (E020) - 회계 사원 ===
  {
    id: 'wr055',
    hospital_id: '1',
    period_id: '1',
    employee_id: '20',
    activity_id: '11', // 회계업무
    ratio: 0.90,
    hours: 144,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'wr056',
    hospital_id: '1',
    period_id: '1',
    employee_id: '20',
    activity_id: '5', // 원무활동
    ratio: 0.10,
    hours: 16,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
];

// 업무비율 통계 및 분석 데이터
export const workRatioAnalytics = {
  // 직종별 평균 업무비율
  positionAverages: {
    '과장': {
      진료활동: 0.55,
      관리업무: 0.30,
      교육활동: 0.10,
      기타: 0.05
    },
    '전문의': {
      진료활동: 0.70,
      간호활동: 0.15,
      관리업무: 0.10,
      기타: 0.05
    },
    '전공의': {
      진료활동: 0.60,
      간호활동: 0.25,
      학습활동: 0.10,
      기타: 0.05
    },
    '인턴': {
      진료활동: 0.45,
      간호활동: 0.30,
      학습활동: 0.20,
      기타: 0.05
    },
    '간호사': {
      간호활동: 0.85,
      원무활동: 0.10,
      교육활동: 0.05
    },
    '방사선사': {
      영상촬영: 0.80,
      장비관리: 0.15,
      기타: 0.05
    },
    '행정직': {
      원무활동: 0.85,
      보험청구: 0.10,
      통계관리: 0.05
    }
  },

  // 부서별 주요 활동
  departmentActivities: {
    '11': ['진료활동', '검체검사', '원무활동'], // 내과
    '12': ['진료활동', '수술활동', '간호활동'], // 외과  
    '13': ['영상촬영', '진료활동', '장비관리'], // 영상의학과
    '21': ['간호활동', '교육활동', '원무활동'], // 간호부
    '311': ['원무활동', '보험청구', '통계관리'], // 원무팀
    '321': ['회계업무', '통계관리', '원무활동'] // 회계팀
  },

  // 활동별 특성
  activityCharacteristics: {
    '1': { // 진료활동
      name: '진료활동',
      type: 'direct',
      complexity: 'high',
      skillLevel: 'expert',
      avgTimePerCase: 30 // 분
    },
    '2': { // 간호활동
      name: '간호활동', 
      type: 'direct',
      complexity: 'medium',
      skillLevel: 'professional',
      avgTimePerCase: 45
    },
    '3': { // 영상촬영
      name: '영상촬영',
      type: 'direct', 
      complexity: 'medium',
      skillLevel: 'technical',
      avgTimePerCase: 20
    },
    '4': { // 검체검사
      name: '검체검사',
      type: 'direct',
      complexity: 'medium', 
      skillLevel: 'technical',
      avgTimePerCase: 15
    },
    '5': { // 원무활동
      name: '원무활동',
      type: 'indirect',
      complexity: 'low',
      skillLevel: 'basic',
      avgTimePerCase: 10
    },
    '6': { // 수술활동
      name: '수술활동',
      type: 'direct',
      complexity: 'high',
      skillLevel: 'expert', 
      avgTimePerCase: 120
    }
  }
};

// 업무비율 검증 규칙
export const workRatioValidationRules = {
  // 직종별 최대 업무시간
  maxHoursByPosition: {
    '과장': 170,
    '전문의': 180,
    '전공의': 200,
    '인턴': 220,
    '간호사': 170,
    '방사선사': 170,
    '행정직': 160
  },

  // 활동별 최소/최대 비율 제한
  activityRatioLimits: {
    '1': { min: 0.0, max: 0.8 }, // 진료활동
    '2': { min: 0.0, max: 0.9 }, // 간호활동  
    '3': { min: 0.0, max: 0.9 }, // 영상촬영
    '5': { min: 0.0, max: 0.4 }, // 원무활동
    '8': { min: 0.0, max: 0.3 }  // 교육활동
  },

  // 직종별 필수 활동
  requiredActivitiesByPosition: {
    '전문의': ['1'], // 진료활동 필수
    '간호사': ['2'], // 간호활동 필수
    '방사선사': ['3'] // 영상촬영 필수
  }
};
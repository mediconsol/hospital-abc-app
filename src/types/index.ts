// 공통 타입
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// 병원 관련
export interface Hospital extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  type?: string; // '종합병원', '전문병원', '의원' 등
}

export interface Period extends BaseEntity {
  hospital_id: string;
  name: string; // '2025년 7월'
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// 사용자 관련
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  hospital_id: string;
}

// 기초정보 관련
export interface Department extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // 'D001'
  name: string; // '외래'
  type: 'direct' | 'indirect'; // 직접부서, 간접부서
  parent_id?: string; // 상위 부서
  manager?: string;
  description?: string;
}

export interface Account extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // '6110'
  name: string; // '급여'
  category: 'salary' | 'material' | 'expense' | 'equipment';
  is_direct: boolean; // 직접비 여부
  description?: string;
}

export interface Activity extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // 'ACT001'
  name: string; // '진료활동'
  category: string; // '의료', '관리', '지원'
  department_id?: string;
  description?: string;
}

export interface Process extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // 'PROC001'
  name: string; // '외래진료'
  activity_id: string;
  description?: string;
}

export interface RevenueCode extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // '10001'
  name: string; // '초진료' 
  category: string; // '진료비', '검사비', '처치비'
  unit_price: number;
  description?: string;
}

export interface Driver extends BaseEntity {
  hospital_id: string;
  period_id: string;
  code: string; // 'DRV001'
  name: string; // '면적'
  type: 'area' | 'time' | 'count' | 'weight' | 'volume';
  unit: string; // 'm²', 'hour', 'ea', 'kg', 'L'
  description?: string;
}

// 자료 입력 관련
export interface Employee extends BaseEntity {
  hospital_id: string;
  period_id: string;
  employee_number: string; // 직원번호 (emp_no -> employee_number로 변경)
  name: string;
  position: string; // 직책/직급
  department_id: string;
  department_name?: string; // 부서명 추가 (옵셔널)
  email?: string; // 이메일 추가
  phone?: string; // 연락처 추가
  hire_date?: string; // 입사일 추가 (옵셔널)
  employment_type: 'full_time' | 'part_time' | 'contract';
  salary: number; // 연봉
  description?: string; // 설명 추가
  is_active?: boolean; // 재직 여부 추가 (옵셔널, 기본값 true)
}

export interface WorkRatio extends BaseEntity {
  hospital_id: string;
  period_id: string;
  employee_id: string;
  activity_id: string;
  ratio: number; // 0~1 사이값
  hours?: number; // 해당 활동 투입시간
}

export interface CostInput extends BaseEntity {
  hospital_id: string;
  period_id: string;
  department_id: string;
  account_id: string;
  amount: number;
  month: number; // 1~12
  description?: string;
}

export interface RevenueInput extends BaseEntity {
  hospital_id: string;
  period_id: string;
  revenue_code_id: string;
  department_id?: string;
  quantity: number; // 건수
  amount: number; // 수익금액
  month: number; // 1~12
  patient_count?: number;
}

// 매핑 관련
export interface AccountActivityMapping extends BaseEntity {
  hospital_id: string;
  period_id: string;
  account_id: string;
  activity_id: string;
  ratio: number; // 배분비율 0~1
}

export interface ActivityProcessMapping extends BaseEntity {
  hospital_id: string;
  period_id: string;
  activity_id: string;
  process_id: string;
  ratio: number; // 배분비율 0~1
}

export interface DriverAllocation extends BaseEntity {
  hospital_id: string;
  period_id: string;
  driver_id: string;
  department_id: string;
  value: number; // 드라이버 값 (면적, 시간 등)
}

// 계산 결과 관련
export interface FTEResult extends BaseEntity {
  hospital_id: string;
  period_id: string;
  employee_id: string;
  activity_id: string;
  fte: number; // Full Time Equivalent
  hours: number; // 투입시간
  cost: number; // 활동별 인건비
  hourly_rate: number; // 시간당 단가
}

export interface CostAllocation extends BaseEntity {
  hospital_id: string;
  period_id: string;
  department_id?: string;
  activity_id?: string;
  process_id?: string;
  revenue_code_id?: string;
  cost_type: 'direct' | 'indirect' | 'activity' | 'process';
  total_cost: number;
  unit_cost?: number;
  quantity?: number;
  driver_id?: string;
}

// KPI 및 리포트 관련
export interface DepartmentKPI {
  department_id: string;
  department_name: string;
  total_cost: number;
  direct_cost: number;
  indirect_cost: number;
  fte: number;
  unit_cost: number;
  cost_ratio: number; // 전체 대비 비율
}

export interface ActivityKPI {
  activity_id: string;
  activity_name: string;
  total_cost: number;
  fte: number;
  unit_cost: number;
  department_count: number; // 연관 부서 수
}

export interface RevenueKPI {
  revenue_code_id: string;
  revenue_code_name: string;
  revenue_amount: number;
  cost_amount: number;
  profit: number;
  profit_ratio: number;
  quantity: number;
  unit_profit: number;
}

// 시뮬레이션 관련
export interface SimulationScenario extends BaseEntity {
  hospital_id: string;
  period_id: string;
  name: string;
  description?: string;
  parameters: Record<string, string | number | boolean>; // 시뮬레이션 변수들
  results?: Record<string, string | number | boolean>; // 계산 결과
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// 폼 관련 타입
export interface CreateDepartmentForm {
  code: string;
  name: string;
  type: 'direct' | 'indirect';
  parent_id?: string;
  manager?: string;
  description?: string;
}

export interface CreateAccountForm {
  code: string;
  name: string;
  category: 'salary' | 'material' | 'expense' | 'equipment';
  is_direct: boolean;
  description?: string;
}

export interface CreateActivityForm {
  code: string;
  name: string;
  category: string;
  department_id?: string;
  description?: string;
}

export interface CreateEmployeeForm {
  employee_number: string;
  name: string;
  position: string;
  department_id: string;
  department_name?: string;
  email?: string;
  phone?: string;
  hire_date?: string;
  employment_type: 'full_time' | 'part_time' | 'contract';
  salary: number;
  description?: string;
}

// 검색 및 필터 타입
export interface SearchFilter {
  query?: string;
  type?: string;
  category?: string;
  department_id?: string;
  is_active?: boolean;
  date_from?: string;
  date_to?: string;
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface KPICardData {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  change_type?: 'increase' | 'decrease';
  icon?: string;
}
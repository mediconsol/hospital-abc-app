"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  RotateCcw,
  Users,
  Database,
  Upload,
  Calculator,
  BarChart3,
  Settings,
  Building2,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  actions: {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
}

interface RolePermission {
  roleId: string
  roleName: string
  permissions: Record<string, {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
  }>
}

// 시스템 권한 정의
const systemPermissions: Permission[] = [
  // 병원 설정
  {
    id: 'hospital_management',
    name: '병원 관리',
    description: '병원 정보 및 설정 관리',
    category: 'hospital',
    actions: { read: true, create: true, update: true, delete: false }
  },
  {
    id: 'period_management',
    name: '대상기간 관리',
    description: '원가 계산 대상기간 설정',
    category: 'hospital',
    actions: { read: true, create: true, update: true, delete: true }
  },

  // 기초정보 관리
  {
    id: 'department_management',
    name: '부서 관리',
    description: '병원 부서 정보 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'employee_management',
    name: '직원 관리',
    description: '직원 정보 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'activity_management',
    name: '활동 관리',
    description: '병원 활동 정보 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'account_management',
    name: '계정 관리',
    description: '계정과목 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'process_management',
    name: '프로세스 관리',
    description: '업무 프로세스 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'revenue_code_management',
    name: '수익코드 관리',
    description: '수익코드 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'driver_management',
    name: '드라이버 관리',
    description: '배분 드라이버 관리',
    category: 'base_info',
    actions: { read: true, create: true, update: true, delete: true }
  },

  // 자료 입력
  {
    id: 'salary_data',
    name: '급여 자료',
    description: '직원 급여 데이터 입력',
    category: 'data_input',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'work_ratio_data',
    name: '업무비율 자료',
    description: '직원 업무비율 데이터 입력',
    category: 'data_input',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'cost_data',
    name: '비용 자료',
    description: '부서별 비용 데이터 입력',
    category: 'data_input',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'revenue_data',
    name: '수익 자료',
    description: '수익 데이터 입력',
    category: 'data_input',
    actions: { read: true, create: true, update: true, delete: true }
  },

  // 원가배분
  {
    id: 'cost_allocation',
    name: '원가배분 실행',
    description: 'ABC 원가배분 계산 실행',
    category: 'cost_allocation',
    actions: { read: true, create: true, update: false, delete: false }
  },
  {
    id: 'allocation_results',
    name: '배분 결과',
    description: '원가배분 결과 조회',
    category: 'cost_allocation',
    actions: { read: true, create: false, update: false, delete: false }
  },

  // 결과 리포트
  {
    id: 'department_reports',
    name: '부서별 리포트',
    description: '부서별 원가 리포트',
    category: 'reports',
    actions: { read: true, create: false, update: false, delete: false }
  },
  {
    id: 'activity_reports',
    name: '활동별 리포트',
    description: '활동별 원가 리포트',
    category: 'reports',
    actions: { read: true, create: false, update: false, delete: false }
  },
  {
    id: 'kpi_reports',
    name: 'KPI 대시보드',
    description: '핵심성과지표 대시보드',
    category: 'reports',
    actions: { read: true, create: false, update: false, delete: false }
  },

  // 시스템 관리
  {
    id: 'user_management',
    name: '사용자 관리',
    description: '시스템 사용자 관리',
    category: 'admin',
    actions: { read: true, create: true, update: true, delete: true }
  },
  {
    id: 'permission_management',
    name: '권한 관리',
    description: '사용자 권한 설정',
    category: 'admin',
    actions: { read: true, create: false, update: true, delete: false }
  },
  {
    id: 'system_logs',
    name: '시스템 로그',
    description: '시스템 활동 로그 조회',
    category: 'admin',
    actions: { read: true, create: false, update: false, delete: false }
  }
]

// 초기 역할별 권한 설정
const initialRolePermissions: RolePermission[] = [
  {
    roleId: 'admin',
    roleName: '시스템관리자',
    permissions: systemPermissions.reduce((acc, perm) => {
      acc[perm.id] = { ...perm.actions }
      return acc
    }, {} as Record<string, any>)
  },
  {
    roleId: 'manager',
    roleName: '관리자',
    permissions: systemPermissions.reduce((acc, perm) => {
      if (perm.category === 'admin') {
        // 관리자는 시스템 관리 권한 제한
        acc[perm.id] = { read: false, create: false, update: false, delete: false }
      } else if (perm.category === 'cost_allocation') {
        // 원가배분 권한 있음
        acc[perm.id] = { ...perm.actions }
      } else {
        // 기타 권한은 모두 부여
        acc[perm.id] = { ...perm.actions }
      }
      return acc
    }, {} as Record<string, any>)
  },
  {
    roleId: 'viewer',
    roleName: '조회자',
    permissions: systemPermissions.reduce((acc, perm) => {
      // 조회자는 읽기 권한만
      acc[perm.id] = { 
        read: perm.actions.read, 
        create: false, 
        update: false, 
        delete: false 
      }
      return acc
    }, {} as Record<string, any>)
  }
]

export default function PermissionsPage() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(initialRolePermissions)
  const [selectedRole, setSelectedRole] = useState<string>('admin')
  const [hasChanges, setHasChanges] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital': return Building2
      case 'base_info': return Database
      case 'data_input': return Upload
      case 'cost_allocation': return Calculator
      case 'reports': return BarChart3
      case 'admin': return Settings
      default: return Shield
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hospital': return '병원 설정'
      case 'base_info': return '기초정보 관리'
      case 'data_input': return '자료 입력'
      case 'cost_allocation': return '원가배분'
      case 'reports': return '결과 리포트'
      case 'admin': return '시스템 관리'
      default: return category
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'read': return '조회'
      case 'create': return '생성'
      case 'update': return '수정'
      case 'delete': return '삭제'
      default: return action
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'read': return Eye
      case 'create': return Plus
      case 'update': return Edit
      case 'delete': return Trash2
      default: return Shield
    }
  }

  const handlePermissionChange = (permissionId: string, action: string, value: boolean) => {
    setRolePermissions(prev => 
      prev.map(role => 
        role.roleId === selectedRole
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [permissionId]: {
                  ...role.permissions[permissionId],
                  [action]: value
                }
              }
            }
          : role
      )
    )
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    // 여기서 실제로는 API를 호출하여 서버에 저장
    toast.success('권한 설정이 저장되었습니다.')
    setHasChanges(false)
  }

  const handleResetToDefaults = () => {
    setRolePermissions(initialRolePermissions)
    setHasChanges(false)
    setIsResetDialogOpen(false)
    toast.success('기본 권한 설정으로 초기화되었습니다.')
  }

  const getCurrentRolePermissions = () => {
    return rolePermissions.find(role => role.roleId === selectedRole)
  }

  // 카테고리별로 권한 그룹화
  const groupedPermissions = systemPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const currentRole = getCurrentRolePermissions()

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">권한 설정</h1>
          <p className="text-muted-foreground">역할별 시스템 접근 권한을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsResetDialogOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            초기화
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      {/* 역할 선택 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>역할별 권한 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={setSelectedRole}>
            <TabsList className="grid w-full grid-cols-3">
              {rolePermissions.map(role => (
                <TabsTrigger key={role.roleId} value={role.roleId} className="gap-2">
                  <Shield className="h-4 w-4" />
                  {role.roleName}
                </TabsTrigger>
              ))}
            </TabsList>

            {rolePermissions.map(role => (
              <TabsContent key={role.roleId} value={role.roleId} className="mt-6">
                <div className="space-y-6">
                  {/* 역할 정보 */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{role.roleName}</h3>
                      <p className="text-muted-foreground text-sm">
                        {role.roleId === 'admin' && '모든 시스템 기능에 대한 완전한 권한을 가집니다'}
                        {role.roleId === 'manager' && '데이터 관리 및 원가배분 권한을 가집니다'}
                        {role.roleId === 'viewer' && '시스템 내용을 조회할 수 있는 권한만 가집니다'}
                      </p>
                    </div>
                  </div>

                  {/* 권한 매트릭스 */}
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => {
                      const CategoryIcon = getCategoryIcon(category)
                      
                      return (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CategoryIcon className="h-5 w-5" />
                              {getCategoryLabel(category)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[250px]">기능</TableHead>
                                  <TableHead className="text-center w-[100px]">
                                    <Eye className="h-4 w-4 mx-auto" />
                                    <div className="text-xs mt-1">조회</div>
                                  </TableHead>
                                  <TableHead className="text-center w-[100px]">
                                    <Plus className="h-4 w-4 mx-auto" />
                                    <div className="text-xs mt-1">생성</div>
                                  </TableHead>
                                  <TableHead className="text-center w-[100px]">
                                    <Edit className="h-4 w-4 mx-auto" />
                                    <div className="text-xs mt-1">수정</div>
                                  </TableHead>
                                  <TableHead className="text-center w-[100px]">
                                    <Trash2 className="h-4 w-4 mx-auto" />
                                    <div className="text-xs mt-1">삭제</div>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {permissions.map(permission => (
                                  <TableRow key={permission.id}>
                                    <TableCell>
                                      <div>
                                        <div className="font-medium">{permission.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {permission.description}
                                        </div>
                                      </div>
                                    </TableCell>
                                    {['read', 'create', 'update', 'delete'].map(action => (
                                      <TableCell key={action} className="text-center">
                                        <Switch
                                          checked={currentRole?.permissions[permission.id]?.[action] || false}
                                          onCheckedChange={(checked) => 
                                            handlePermissionChange(permission.id, action, checked)
                                          }
                                          disabled={
                                            !permission.actions[action as keyof typeof permission.actions] ||
                                            (role.roleId !== 'admin' && permission.category === 'admin')
                                          }
                                        />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* 변경사항 알림 */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                변경사항이 있습니다. 저장 버튼을 눌러 변경사항을 적용하세요.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 초기화 확인 다이얼로그 */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 설정 초기화</DialogTitle>
            <DialogDescription>
              모든 역할의 권한 설정을 기본값으로 초기화합니다. 
              이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleResetToDefaults}>
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
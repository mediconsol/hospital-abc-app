"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Building2,
  Shield,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react"
import { useForm } from "react-hook-form"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'manager' | 'viewer'
  hospital_id: string
  hospital_name: string
  department_id?: string
  department_name?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

interface CreateUserForm {
  email: string
  name: string
  phone?: string
  role: 'admin' | 'manager' | 'viewer'
  hospital_id: string
  department_id?: string
  password: string
}

// Mock 사용자 데이터
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    name: '시스템 관리자',
    phone: '02-1234-0000',
    role: 'admin',
    hospital_id: '1',
    hospital_name: '가족사랑요양병원',
    is_active: true,
    last_login: '2025-01-06T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2025-01-06T10:30:00Z'
  },
  {
    id: '2',
    email: 'manager@hospital.com',
    name: '김관리자',
    phone: '02-1234-0001',
    role: 'manager',
    hospital_id: '1',
    hospital_name: '가족사랑요양병원',
    department_id: '11',
    department_name: '내과',
    is_active: true,
    last_login: '2025-01-06T09:15:00Z',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2025-01-06T09:15:00Z'
  },
  {
    id: '3',
    email: 'viewer@hospital.com',
    name: '박조회자',
    phone: '02-1234-0002',
    role: 'viewer',
    hospital_id: '1',
    hospital_name: '가족사랑요양병원',
    department_id: '21',
    department_name: '간호부',
    is_active: true,
    last_login: '2025-01-05T16:20:00Z',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2025-01-05T16:20:00Z'
  },
  {
    id: '4',
    email: 'inactive@hospital.com',
    name: '이비활성',
    role: 'viewer',
    hospital_id: '1',
    hospital_name: '가족사랑요양병원',
    is_active: false,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUserForm>()

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAdd = () => {
    setSelectedUser(null)
    setFormMode('create')
    reset()
    setIsFormOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormMode('edit')
    setValue('email', user.email)
    setValue('name', user.name)
    setValue('phone', user.phone || '')
    setValue('role', user.role)
    setValue('hospital_id', user.hospital_id)
    setValue('department_id', user.department_id || '')
    setIsFormOpen(true)
  }

  const handleDelete = (user: User) => {
    if (confirm(`정말로 '${user.name}' 사용자를 삭제하시겠습니까?`)) {
      setUsers(users.filter(u => u.id !== user.id))
    }
  }

  const handleToggleStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, is_active: !u.is_active, updated_at: new Date().toISOString() }
        : u
    ))
  }

  const onSubmit = (data: CreateUserForm) => {
    if (formMode === 'create') {
      const newUser: User = {
        id: `${users.length + 1}`,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        hospital_id: data.hospital_id,
        hospital_name: '가족사랑요양병원', // 실제로는 hospital_id로 조회
        department_id: data.department_id,
        department_name: data.department_id ? '해당부서' : undefined, // 실제로는 department_id로 조회
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUsers([...users, newUser])
    } else if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              email: data.email,
              name: data.name,
              phone: data.phone,
              role: data.role,
              hospital_id: data.hospital_id,
              department_id: data.department_id,
              updated_at: new Date().toISOString() 
            }
          : u
      ))
    }
    
    setIsFormOpen(false)
    reset()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '시스템관리자'
      case 'manager': return '관리자'
      case 'viewer': return '조회자'
      default: return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'manager': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'viewer': return 'bg-green-500/10 text-green-600 border-green-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '없음'
    return new Date(dateString).toLocaleString('ko-KR')
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">사용자 관리</h1>
          <p className="text-muted-foreground">시스템 사용자 계정을 관리합니다</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          사용자 추가
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="이름 또는 이메일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role-filter">역할</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="admin">시스템관리자</SelectItem>
                  <SelectItem value="manager">관리자</SelectItem>
                  <SelectItem value="viewer">조회자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">상태</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('all')
                  setStatusFilter('all')
                }}>
                  초기화
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록 ({filteredUsers.length}명)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    검색 조건에 맞는 사용자가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.hospital_name}</div>
                        {user.department_name && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {user.department_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.last_login)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          className="h-8 w-8 p-0"
                        >
                          {user.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 사용자 추가/수정 모달 */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? '사용자 추가' : '사용자 수정'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create' ? '새로운 사용자 계정을 생성합니다' : '사용자 정보를 수정합니다'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "이메일은 필수입니다" })}
                  placeholder="user@hospital.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "이름은 필수입니다" })}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="02-1234-5678"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">역할 *</Label>
                <select
                  id="role"
                  {...register("role", { required: "역할은 필수입니다" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">역할 선택</option>
                  <option value="admin">시스템관리자</option>
                  <option value="manager">관리자</option>
                  <option value="viewer">조회자</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital_id">병원 *</Label>
              <select
                id="hospital_id"
                {...register("hospital_id", { required: "병원은 필수입니다" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">병원 선택</option>
                <option value="1">가족사랑요양병원</option>
              </select>
              {errors.hospital_id && (
                <p className="text-sm text-red-500">{errors.hospital_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">부서</Label>
              <select
                id="department_id"
                {...register("department_id")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">부서 선택 (선택사항)</option>
                <option value="11">내과</option>
                <option value="12">외과</option>
                <option value="21">간호부</option>
              </select>
            </div>

            {formMode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="password">임시 비밀번호 *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "비밀번호는 필수입니다" })}
                  placeholder="임시 비밀번호 입력"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                {formMode === 'create' ? '생성' : '수정'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
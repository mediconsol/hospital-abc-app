"use client"

import { useState, useEffect } from "react"
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  Calendar,
  User,
  Globe,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Activity,
  Clock,
  MapPin
} from "lucide-react"
import { toast } from "sonner"

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success' | 'debug'
  category: 'auth' | 'user' | 'data' | 'system' | 'security' | 'api'
  action: string
  message: string
  user_id?: string
  user_name?: string
  ip_address?: string
  user_agent?: string
  request_path?: string
  response_status?: number
  duration_ms?: number
  details?: Record<string, any>
}

// Mock 시스템 로그 데이터
const generateMockLogs = (): SystemLog[] => {
  const logs: SystemLog[] = []
  const users = ['admin@hospital.com', '김관리자', '박조회자', 'system']
  const actions = [
    { category: 'auth', action: 'LOGIN', message: '사용자 로그인' },
    { category: 'auth', action: 'LOGOUT', message: '사용자 로그아웃' },
    { category: 'auth', action: 'LOGIN_FAILED', message: '로그인 실패' },
    { category: 'user', action: 'CREATE_USER', message: '사용자 생성' },
    { category: 'user', action: 'UPDATE_USER', message: '사용자 정보 수정' },
    { category: 'user', action: 'DELETE_USER', message: '사용자 삭제' },
    { category: 'data', action: 'CREATE_DEPARTMENT', message: '부서 생성' },
    { category: 'data', action: 'UPDATE_DEPARTMENT', message: '부서 정보 수정' },
    { category: 'data', action: 'DELETE_DEPARTMENT', message: '부서 삭제' },
    { category: 'data', action: 'IMPORT_SALARY', message: '급여 데이터 가져오기' },
    { category: 'data', action: 'EXPORT_REPORT', message: '리포트 내보내기' },
    { category: 'system', action: 'BACKUP', message: '시스템 백업' },
    { category: 'system', action: 'MAINTENANCE', message: '시스템 점검' },
    { category: 'system', action: 'UPDATE', message: '시스템 업데이트' },
    { category: 'security', action: 'PERMISSION_CHANGE', message: '권한 변경' },
    { category: 'security', action: 'SUSPICIOUS_ACTIVITY', message: '의심스러운 활동 감지' },
    { category: 'api', action: 'API_CALL', message: 'API 호출' },
    { category: 'api', action: 'API_ERROR', message: 'API 오류' }
  ]
  const levels: SystemLog['level'][] = ['info', 'warning', 'error', 'success', 'debug']
  const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '127.0.0.1']

  // 최근 7일간의 로그 생성
  for (let i = 0; i < 150; i++) {
    const actionData = actions[Math.floor(Math.random() * actions.length)]
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 7))
    timestamp.setHours(Math.floor(Math.random() * 24))
    timestamp.setMinutes(Math.floor(Math.random() * 60))

    let level: SystemLog['level'] = 'info'
    if (actionData.action.includes('ERROR') || actionData.action.includes('FAILED')) {
      level = 'error'
    } else if (actionData.action.includes('SUSPICIOUS')) {
      level = 'warning'
    } else if (actionData.action.includes('CREATE') || actionData.action.includes('SUCCESS')) {
      level = 'success'
    } else if (actionData.action.includes('DEBUG')) {
      level = 'debug'
    }

    logs.push({
      id: `log-${i + 1}`,
      timestamp: timestamp.toISOString(),
      level,
      category: actionData.category as SystemLog['category'],
      action: actionData.action,
      message: actionData.message,
      user_id: Math.random() > 0.2 ? `user-${Math.floor(Math.random() * 4) + 1}` : undefined,
      user_name: Math.random() > 0.2 ? users[Math.floor(Math.random() * users.length)] : undefined,
      ip_address: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      request_path: actionData.category === 'api' ? `/api/v1/${actionData.action.toLowerCase()}` : undefined,
      response_status: Math.random() > 0.1 ? 200 : (Math.random() > 0.5 ? 404 : 500),
      duration_ms: Math.floor(Math.random() * 1000) + 10,
      details: {
        session_id: `sess-${Math.random().toString(36).substr(2, 9)}`,
        browser: 'Chrome/120.0.0.0',
        platform: 'Windows'
      }
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([])
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 필터 상태
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('today')
  const [userFilter, setUserFilter] = useState<string>('all')

  // 데이터 로드
  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true)
      // 실제 환경에서는 API 호출
      setTimeout(() => {
        const mockLogs = generateMockLogs()
        setLogs(mockLogs)
        setFilteredLogs(mockLogs)
        setIsLoading(false)
      }, 1000)
    }

    loadLogs()
  }, [])

  // 필터링 로직
  useEffect(() => {
    let filtered = [...logs]

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 레벨 필터
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    // 카테고리 필터
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter)
    }

    // 날짜 필터
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (dateFilter !== 'all') {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp)
        switch (dateFilter) {
          case 'today':
            return logDate >= today
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return logDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            return logDate >= monthAgo
          default:
            return true
        }
      })
    }

    // 사용자 필터
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.user_name === userFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, levelFilter, categoryFilter, dateFilter, userFilter])

  const handleRefresh = () => {
    const newLogs = generateMockLogs()
    setLogs(newLogs)
    toast.success('로그가 새로고침되었습니다.')
  }

  const handleExport = () => {
    // CSV 내보내기 (실제 구현에서는 서버에서 처리)
    const csvData = filteredLogs.map(log => ({
      시간: new Date(log.timestamp).toLocaleString('ko-KR'),
      레벨: log.level,
      카테고리: getCategoryLabel(log.category),
      작업: log.action,
      메시지: log.message,
      사용자: log.user_name || 'N/A',
      IP주소: log.ip_address || 'N/A'
    }))
    
    // 실제로는 CSV 파일을 다운로드
    toast.success('로그 데이터를 내보내는 중...')
  }

  const handleViewDetail = (log: SystemLog) => {
    setSelectedLog(log)
    setIsDetailDialogOpen(true)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return XCircle
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      case 'info': return Info
      case 'debug': return Activity
      default: return AlertCircle
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'warning': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'success': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'info': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'debug': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'auth': return '인증'
      case 'user': return '사용자'
      case 'data': return '데이터'
      case 'system': return '시스템'
      case 'security': return '보안'
      case 'api': return 'API'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      case 'data': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-gray-100 text-gray-800'
      case 'security': return 'bg-red-100 text-red-800'
      case 'api': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR')
  }

  const uniqueUsers = [...new Set(logs.map(log => log.user_name).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">시스템 로그</h1>
          <p className="text-muted-foreground">시스템 활동 로그를 조회하고 모니터링합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            새로고침
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 로그</p>
                <p className="text-lg font-semibold">{filteredLogs.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(['error', 'warning', 'success', 'info'] as const).map(level => {
          const count = filteredLogs.filter(log => log.level === level).length
          const Icon = getLevelIcon(level)
          
          return (
            <Card key={level}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getLevelColor(level)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{level}</p>
                    <p className="text-lg font-semibold">{count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 필터 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="메시지, 작업, 사용자..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level-filter">레벨</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="레벨 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="error">오류</SelectItem>
                  <SelectItem value="warning">경고</SelectItem>
                  <SelectItem value="success">성공</SelectItem>
                  <SelectItem value="info">정보</SelectItem>
                  <SelectItem value="debug">디버그</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">카테고리</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="auth">인증</SelectItem>
                  <SelectItem value="user">사용자</SelectItem>
                  <SelectItem value="data">데이터</SelectItem>
                  <SelectItem value="system">시스템</SelectItem>
                  <SelectItem value="security">보안</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">기간</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">오늘</SelectItem>
                  <SelectItem value="week">최근 7일</SelectItem>
                  <SelectItem value="month">최근 30일</SelectItem>
                  <SelectItem value="all">전체</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">사용자</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="사용자 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setLevelFilter('all')
                setCategoryFilter('all')
                setDateFilter('today')
                setUserFilter('all')
              }} className="w-full">
                초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 로그 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 로그 ({filteredLogs.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                로그를 불러오는 중...
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시간</TableHead>
                  <TableHead>레벨</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>작업</TableHead>
                  <TableHead>메시지</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>IP 주소</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      검색 조건에 맞는 로그가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.slice(0, 50).map((log) => {
                    const LevelIcon = getLevelIcon(log.level)
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelColor(log.level)}>
                            <LevelIcon className="h-3 w-3 mr-1" />
                            {log.level.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(log.category)}>
                            {getCategoryLabel(log.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {log.action}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.message}
                        </TableCell>
                        <TableCell>
                          {log.user_name ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.user_name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {log.ip_address || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(log)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 로그 상세 모달 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>로그 상세 정보</DialogTitle>
            <DialogDescription>
              시스템 로그의 상세 정보를 확인합니다
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시간</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <Clock className="h-4 w-4" />
                    {formatTimestamp(selectedLog.timestamp)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>레벨</Label>
                  <Badge className={getLevelColor(selectedLog.level)}>
                    {selectedLog.level.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Badge variant="outline" className={getCategoryColor(selectedLog.category)}>
                    {getCategoryLabel(selectedLog.category)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>작업</Label>
                  <code className="block text-xs bg-muted px-2 py-1 rounded">
                    {selectedLog.action}
                  </code>
                </div>
              </div>

              <div className="space-y-2">
                <Label>메시지</Label>
                <div className="p-3 bg-muted/50 rounded">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.user_name && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>사용자</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <User className="h-4 w-4" />
                      {selectedLog.user_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>IP 주소</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Globe className="h-4 w-4" />
                      {selectedLog.ip_address}
                    </div>
                  </div>
                </div>
              )}

              {selectedLog.request_path && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>요청 경로</Label>
                    <code className="block text-xs bg-muted px-2 py-1 rounded">
                      {selectedLog.request_path}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <Label>응답 상태</Label>
                    <Badge variant={selectedLog.response_status === 200 ? "default" : "destructive"}>
                      {selectedLog.response_status}
                    </Badge>
                  </div>
                </div>
              )}

              {selectedLog.duration_ms && (
                <div className="space-y-2">
                  <Label>처리 시간</Label>
                  <div className="p-2 bg-muted/50 rounded">
                    {selectedLog.duration_ms}ms
                  </div>
                </div>
              )}

              {selectedLog.user_agent && (
                <div className="space-y-2">
                  <Label>사용자 에이전트</Label>
                  <div className="p-2 bg-muted/50 rounded text-xs">
                    {selectedLog.user_agent}
                  </div>
                </div>
              )}

              {selectedLog.details && (
                <div className="space-y-2">
                  <Label>추가 정보</Label>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
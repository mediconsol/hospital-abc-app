"use client"

import { useState } from "react"
import { BaseInfoLayout } from "@/components/base-info/base-info-layout"
import { AccountTable } from "@/components/tables/account-table"
import { mockAccounts } from "@/lib/mock-data"
import { Account } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calculator, Calendar, DollarSign } from "lucide-react"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [showTable, setShowTable] = useState(true)

  const handleAdd = () => {
    console.log("계정 추가")
    setSelectedAccount(null)
    setShowTable(false)
  }

  const handleEdit = (account: Account) => {
    setSelectedAccount(account)
    setShowTable(false)
  }

  const handleDelete = (account: Account) => {
    if (confirm(`정말로 '${account.name}' 계정을 삭제하시겠습니까?`)) {
      setAccounts(accounts.filter(acc => acc.id !== account.id))
      if (selectedAccount?.id === account.id) {
        setSelectedAccount(null)
        setShowTable(true)
      }
    }
  }

  const handleItemSelect = (item: { id: string; name: string; data: Account }) => {
    setSelectedAccount(item.data)
    setShowTable(false)
  }

  // Group accounts by category for tree structure
  const categories = [...new Set(accounts.map(account => account.category))]
  const categoryNames = {
    salary: '인건비',
    material: '재료비',
    expense: '경비'
  }

  const treeData = categories.map(category => ({
    id: category,
    name: categoryNames[category as keyof typeof categoryNames] || category,
    children: accounts
      .filter(account => account.category === category)
      .map(account => ({
        id: account.id,
        name: `${account.code} - ${account.name}`,
        type: account.category,
        data: account
      }))
  }))

  const getCategoryLabel = (category: string) => {
    return categoryNames[category as keyof typeof categoryNames] || category
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'salary': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'material': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'expense': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getDirectBadgeColor = (isDirect: boolean) => {
    return isDirect 
      ? 'bg-green-500/10 text-green-600 border-green-500/20'
      : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  }

  return (
    <BaseInfoLayout
      title="계정 관리"
      description="병원의 회계 계정 정보를 등록하고 관리합니다."
      treeData={treeData}
      selectedItem={selectedAccount ? { id: selectedAccount.id, name: selectedAccount.name, data: selectedAccount } : null}
      onItemSelect={handleItemSelect}
      onAdd={handleAdd}
      onEdit={(item) => handleEdit(item.data as Account)}
      onDelete={(item) => handleDelete(item.data as Account)}
      searchPlaceholder="계정 검색..."
    >
      {showTable ? (
        <AccountTable
          accounts={accounts}
          onAdd={(data) => {
            const newAccount: Account = {
              id: `${accounts.length + 1}`,
              hospital_id: '1',
              period_id: '1',
              code: data.code,
              name: data.name,
              category: data.category,
              is_direct: data.is_direct,
              description: data.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setAccounts([...accounts, newAccount])
          }}
          onEdit={(id, data) => {
            setAccounts(accounts.map(account => 
              account.id === id 
                ? { 
                    ...account, 
                    ...data, 
                    updated_at: new Date().toISOString() 
                  }
                : account
            ))
          }}
          onDelete={(id) => {
            if (confirm('정말로 이 계정을 삭제하시겠습니까?')) {
              setAccounts(accounts.filter(account => account.id !== id))
            }
          }}
        />
      ) : selectedAccount ? (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">계정 정보</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(selectedAccount.category)}>
                    {getCategoryLabel(selectedAccount.category)}
                  </Badge>
                  <Badge className={getDirectBadgeColor(selectedAccount.is_direct)}>
                    {selectedAccount.is_direct ? '직접비' : '간접비'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">계정코드</Label>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <Input id="code" value={selectedAccount.code} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">계정명</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={selectedAccount.name} readOnly />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">계정 분류</Label>
                  <Input id="category" value={getCategoryLabel(selectedAccount.category)} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">비용 유형</Label>
                  <Input id="type" value={selectedAccount.is_direct ? '직접비' : '간접비'} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description" 
                  value={selectedAccount.description || '설명이 없습니다.'} 
                  readOnly 
                  rows={3} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="created">생성일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="created" 
                      value={new Date(selectedAccount.created_at).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updated">수정일</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="updated" 
                      value={new Date(selectedAccount.updated_at).toLocaleDateString('ko-KR')} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">계정을 선택하세요</div>
            <div className="text-sm">왼쪽 목록에서 계정을 선택하면 상세 정보를 확인할 수 있습니다.</div>
          </div>
        </div>
      )}
    </BaseInfoLayout>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus } from "lucide-react"
import { Account, CreateAccountForm } from "@/types"
import { AccountForm } from "@/components/forms/account-form"

interface AccountTableProps {
  accounts: Account[]
  onAdd: (data: CreateAccountForm) => void
  onEdit: (id: string, data: CreateAccountForm) => void
  onDelete: (id: string) => void
  onRowClick?: (account: Account) => void
}

export function AccountTable({ 
  accounts, 
  onAdd, 
  onEdit, 
  onDelete,
  onRowClick
}: AccountTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setEditingAccount(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: CreateAccountForm) => {
    if (formMode === 'create') {
      onAdd(data)
    } else if (editingAccount) {
      onEdit(editingAccount.id, data)
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories = {
      salary: '인건비',
      material: '재료비',
      expense: '경비',
      equipment: '장비비'
    }
    return categories[category as keyof typeof categories] || category
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      salary: 'bg-green-100 text-green-800',
      material: 'bg-blue-100 text-blue-800',
      expense: 'bg-yellow-100 text-yellow-800',
      equipment: 'bg-purple-100 text-purple-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getActiveStatusColor = (isActive?: boolean) => {
    return (isActive ?? true) 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getActiveStatusText = (isActive?: boolean) => {
    return (isActive ?? true) ? '활성' : '비활성'
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>계정 관리</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            계정 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>계정코드</TableHead>
                <TableHead>계정명</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>직접비</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    등록된 계정이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow 
                    key={account.id}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onRowClick?.(account)}
                  >
                    <TableCell className="font-mono">{account.code}</TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(account.category)}`}>
                        {getCategoryLabel(account.category)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.is_direct 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {account.is_direct ? '직접비' : '간접비'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActiveStatusColor(account.is_active)}`}>
                        {getActiveStatusText(account.is_active)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(account)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(account.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
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

      <AccountForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        account={editingAccount}
        mode={formMode}
      />
    </>
  )
}
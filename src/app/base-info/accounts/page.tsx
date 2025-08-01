"use client"

import { useState } from "react"
import { AccountTable } from "@/components/tables/account-table"
import { mockAccounts } from "@/lib/mock-data"
import { Account, CreateAccountForm } from "@/types"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)

  const handleAdd = (data: CreateAccountForm) => {
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
  }

  const handleEdit = (id: string, data: CreateAccountForm) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            ...data, 
            updated_at: new Date().toISOString() 
          }
        : account
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 계정을 삭제하시겠습니까?')) {
      setAccounts(accounts.filter(account => account.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">계정 관리</h1>
        <p className="text-muted-foreground mt-1">
          병원의 회계 계정 정보를 등록하고 관리합니다
        </p>
      </div>

      <AccountTable
        accounts={accounts}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
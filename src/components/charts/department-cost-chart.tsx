"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DepartmentKPI } from '@/types'

interface DepartmentCostChartProps {
  data: DepartmentKPI[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function DepartmentCostChart({ data }: DepartmentCostChartProps) {
  const formatCurrency = (value: number) => {
    return `₩${(value / 1000000).toFixed(1)}M`
  }

  const chartData = data.map(item => ({
    name: item.department_name,
    총원가: item.total_cost,
    직접비: item.direct_cost,
    간접비: item.indirect_cost,
    FTE: item.fte
  }))

  const pieData = data.map(item => ({
    name: item.department_name,
    value: item.total_cost,
    ratio: item.cost_ratio
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 부서별 원가 막대그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>부서별 원가 분석</CardTitle>
          <CardDescription>직접비와 간접비 구분</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name
                ]}
              />
              <Bar dataKey="직접비" stackId="a" fill="#0088FE" />
              <Bar dataKey="간접비" stackId="a" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 부서별 원가 구성비 파이차트 */}
      <Card>
        <CardHeader>
          <CardTitle>부서별 원가 구성비</CardTitle>
          <CardDescription>전체 원가 대비 비율</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, ratio }) => `${name} (${(ratio * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
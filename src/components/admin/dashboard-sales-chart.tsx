'use client'

import dayjs from '@/lib/dayjs'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { DashboardTrendPoint } from '@/services/orders'

interface DashboardSalesChartProps {
  data: DashboardTrendPoint[]
}

export default function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  return (
    <div className='h-80 pt-4'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0 }}>
          <defs>
            <linearGradient id='colorSales' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#22c55e' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorOrders' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#6366f1' stopOpacity={0.25} />
              <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' className='stroke-muted/60' />
          <XAxis dataKey='date' tickFormatter={(value) => dayjs(value).format('DD/MM')} />
          <YAxis
            yAxisId='left'
            orientation='left'
            tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`}
          />
          <YAxis yAxisId='right' orientation='right' tickFormatter={(value) => `${value}`} />
          <Tooltip
            formatter={(value: number, name) =>
              name === 'ยอดขาย'
                ? new Intl.NumberFormat('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                    maximumFractionDigits: 0,
                  }).format(value)
                : value.toLocaleString()
            }
            labelFormatter={(label) => dayjs(label).format('DD MMM YYYY')}
            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          <Area
            type='monotone'
            yAxisId='left'
            dataKey='totalSales'
            stroke='#16a34a'
            fill='url(#colorSales)'
            name='ยอดขาย'
          />
          <Area
            type='monotone'
            yAxisId='right'
            dataKey='orderCount'
            stroke='#4f46e5'
            fill='url(#colorOrders)'
            name='จำนวนออเดอร์'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

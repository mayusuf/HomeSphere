'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

interface RechartsWrapperProps {
  categoryData: { name: string; value: number }[]
  cityData: { city: string; count: number }[]
  statusData: { name: string; value: number }[]
  roleData: { name: string; value: number }[]
  totalProperties: number
  totalUsers: number
  totalInquiries: number
}

const COLORS = ['#1E6B5E', '#F4A535', '#EF4444', '#22C55E', '#6B7280']

export default function RechartsWrapper({
  categoryData,
  cityData,
  statusData,
  roleData,
  totalProperties,
  totalUsers,
  totalInquiries,
}: RechartsWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Properties', value: totalProperties },
          { label: 'Total Users', value: totalUsers },
          { label: 'Total Inquiries', value: totalInquiries },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5 text-center">
            <p className="text-3xl font-bold font-mono text-primary">{s.value}</p>
            <p className="text-sm text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-hs-text mb-4">Listings by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1E6B5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-hs-text mb-4">Listings by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-hs-text mb-4">Top Cities by Listings</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#F4A535" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-hs-text mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {roleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

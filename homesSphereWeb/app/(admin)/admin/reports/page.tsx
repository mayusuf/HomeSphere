import { getAllProperties } from '@/lib/api/properties'
import { getUsers } from '@/lib/api/users'
import { getAllInquiries } from '@/lib/api/inquiries'
import RechartsWrapper from './RechartsWrapper'

export default async function AdminReportsPage() {
  const [properties, users, inquiries] = await Promise.all([
    getAllProperties(true).catch(() => []),
    getUsers(true).catch(() => []),
    getAllInquiries(),
  ])

  const categoryData = [
    { name: 'Apartments', value: properties.filter((p) => p.houseType === 'apartment').length },
    { name: 'Houses', value: properties.filter((p) => p.houseType === 'house').length },
    { name: 'Single Rooms', value: properties.filter((p) => p.houseType === 'single-room').length },
  ]

  const cityMap: Record<string, number> = {}
  properties.forEach((p) => {
    cityMap[p.address.city] = (cityMap[p.address.city] ?? 0) + 1
  })
  const cityData = Object.entries(cityMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }))

  const statusData = [
    { name: 'Approved', value: properties.filter((p) => p.status === 'approved').length },
    { name: 'Pending', value: properties.filter((p) => p.status === 'pending').length },
    { name: 'Rejected', value: properties.filter((p) => p.status === 'rejected').length },
  ]

  const roleData = [
    { name: 'Users', value: users.filter((u) => u.role === 'USER').length },
    { name: 'Admins', value: users.filter((u) => u.role === 'ADMIN').length },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-6">Reports & Statistics</h1>
      <RechartsWrapper
        categoryData={categoryData}
        cityData={cityData}
        statusData={statusData}
        roleData={roleData}
        totalProperties={properties.length}
        totalUsers={users.length}
        totalInquiries={inquiries.length}
      />
    </div>
  )
}

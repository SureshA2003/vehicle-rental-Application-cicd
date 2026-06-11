import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Car, Users, CalendarDays, IndianRupee, TrendingUp, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
    </div>
  )

  const cards = [
    {
      label: 'Total Vehicles',
      value: stats?.totalVehicles ?? 0,
      sub: `${stats?.availableVehicles ?? 0} available`,
      icon: Car,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Registered Users',
      value: stats?.totalUsers ?? 0,
      sub: 'All time',
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      sub: `${stats?.activeBookings ?? 0} active`,
      icon: CalendarDays,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${Number(stats?.totalRevenue ?? 0).toLocaleString()}`,
      sub: 'From paid bookings',
      icon: IndianRupee,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your rental business</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick tips */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add a new vehicle', path: '/admin/vehicles', desc: 'Expand your fleet' },
            { label: 'View all bookings', path: '/admin/bookings', desc: 'Manage reservations' },
            { label: 'Manage users', path: '/admin/users', desc: 'User accounts' },
          ].map(({ label, path, desc }) => (
            <a key={label} href={path}
              className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-2 font-medium text-gray-800 group-hover:text-blue-700">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                {label}
              </div>
              <p className="text-gray-400 text-sm mt-1">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

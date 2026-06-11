import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Car, LayoutDashboard, CalendarDays, Users, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/vehicles', icon: Car, label: 'Vehicles' },
  { path: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
  { path: '/admin/users', icon: Users, label: 'Users' },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Car className="h-7 w-7 text-blue-400" />
          <span>DriveEasy</span>
        </Link>
        <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm mb-1">
          ← Back to Site
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

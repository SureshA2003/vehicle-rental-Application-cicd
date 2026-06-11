import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Car, Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Car className="h-7 w-7" />
            <span>DriveEasy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/vehicles" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Browse Vehicles</Link>
            {user && <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">My Bookings</Link>}
            {isAdmin && <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Admin Panel</Link>}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span>{user.name}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-2">
            <Link to="/vehicles" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-gray-600 hover:text-blue-600">Browse Vehicles</Link>
            {user && <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-gray-600 hover:text-blue-600">My Bookings</Link>}
            {user && <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-gray-600 hover:text-blue-600">Profile</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-gray-600 hover:text-blue-600">Admin</Link>}
            {user ? (
              <button onClick={handleLogout} className="block px-2 py-2 text-red-600 w-full text-left">Logout</button>
            ) : (
              <div className="flex gap-2 px-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center text-sm">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

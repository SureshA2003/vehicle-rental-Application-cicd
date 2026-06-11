import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import AdminSidebar from '../admin/AdminSidebar'
import { useAuth } from '../../context/AuthContext'

export default function Layout({ admin }) {
  const { isAdmin } = useAuth()

  if (admin && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
        <p>© 2024 DriveEasy — Vehicle Rental System. All rights reserved.</p>
      </footer>
    </div>
  )
}

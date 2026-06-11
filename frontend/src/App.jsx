import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Vehicles from './pages/Vehicles'
import VehicleDetail from './pages/VehicleDetail'
import BookingForm from './pages/BookingForm'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import Layout from './components/layout/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
            <Route path="booking/:vehicleId" element={
              <PrivateRoute><BookingForm /></PrivateRoute>
            } />
            <Route path="my-bookings" element={
              <PrivateRoute><MyBookings /></PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
          </Route>
          <Route path="/admin" element={<AdminRoute><Layout admin /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

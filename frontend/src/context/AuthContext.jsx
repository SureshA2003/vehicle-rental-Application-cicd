import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    console.log('Stored Token:', token)
    console.log('Stored User:', userData)

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (err) {
        console.error(err)
        localStorage.clear()
      }
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password })

      console.log('LOGIN RESPONSE:', res.data)

      const { token, ...userData } = res.data

      console.log('TOKEN:', token)
      console.log('USER DATA:', userData)

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      console.log('Saved Token:', localStorage.getItem('token'))

      setUser(userData)

      return userData
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  }

  const register = async (data) => {
    try {
      const res = await authAPI.register(data)

      console.log('REGISTER RESPONSE:', res.data)

      const { token, ...userData } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)

      return userData
    } catch (error) {
      console.error('Register Error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
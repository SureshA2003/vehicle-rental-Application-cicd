import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { UserCheck, UserX } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id)
      setUsers(users.map(u => u.id === id ? res.data : u))
      toast.success('User status updated')
    } catch {
      toast.error('Failed to update user')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading users...</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['User', 'Contact', 'Role', 'License', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm font-semibold">{u.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.phone || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.drivingLicense || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUser(u.id)}
                      title={u.active ? 'Disable user' : 'Enable user'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.active
                          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {u.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

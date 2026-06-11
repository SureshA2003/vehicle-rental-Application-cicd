import { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { User, Mail, Phone, MapPin, CreditCard } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setProfile(res.data)
      setForm({ name: res.data.name, phone: res.data.phone || '', address: res.data.address || '', drivingLicense: res.data.drivingLicense || '' })
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await userAPI.updateProfile(form)
      setProfile(res.data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" /></div>

  const fields = [
    [User, 'Name', 'name'],
    [Phone, 'Phone', 'phone'],
    [MapPin, 'Address', 'address'],
    [CreditCard, 'Driving License', 'drivingLicense'],
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{profile.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 flex items-center gap-1.5"><Mail className="h-4 w-4" />{profile.email}</p>
            <span className="badge bg-blue-100 text-blue-700 mt-1">{profile.role}</span>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map(([Icon, label, key]) => (
            <div key={key} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                {editing ? (
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="input-field text-sm" />
                ) : (
                  <p className="text-gray-800">{profile[key] || <span className="text-gray-400 italic">Not set</span>}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  )
}

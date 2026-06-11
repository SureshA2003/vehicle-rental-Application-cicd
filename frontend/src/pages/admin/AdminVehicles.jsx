import { useState, useEffect } from 'react'
import { vehicleAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY_FORM = {
  brand: '', model: '', year: new Date().getFullYear(),
  registrationNumber: '', type: 'CAR', fuelType: 'PETROL',
  transmission: 'MANUAL', seats: 5, pricePerDay: '',
  description: '', imageUrl: '', status: 'AVAILABLE',
}

const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-700',
  RENTED: 'bg-yellow-100 text-yellow-700',
  MAINTENANCE: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = () => {
    vehicleAPI.getAll()
      .then(res => setVehicles(res.data))
      .finally(() => setLoading(false))
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (v) => {
    setEditing(v.id)
    setForm({
      brand: v.brand, model: v.model, year: v.year,
      registrationNumber: v.registrationNumber, type: v.type,
      fuelType: v.fuelType, transmission: v.transmission,
      seats: v.seats || 5, pricePerDay: v.pricePerDay,
      description: v.description || '', imageUrl: v.imageUrl || '',
      status: v.status,
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, year: parseInt(form.year), seats: parseInt(form.seats), pricePerDay: parseFloat(form.pricePerDay) }
      if (editing) {
        const res = await vehicleAPI.update(editing, payload)
        setVehicles(vehicles.map(v => v.id === editing ? res.data : v))
        toast.success('Vehicle updated')
      } else {
        const res = await vehicleAPI.create(payload)
        setVehicles([...vehicles, res.data])
        toast.success('Vehicle added')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return
    try {
      await vehicleAPI.delete(id)
      setVehicles(vehicles.filter(v => v.id !== id))
      toast.success('Vehicle deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-500 text-sm mt-0.5">{vehicles.length} total vehicles</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Vehicle', 'Reg. No.', 'Type', 'Fuel', 'Price/Day', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.brand} {v.model} <span className="text-gray-400 font-normal">({v.year})</span></td>
                  <td className="px-4 py-3 text-gray-600">{v.registrationNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{v.type}</td>
                  <td className="px-4 py-3 text-gray-600">{v.fuelType}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{Number(v.pricePerDay).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColors[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <input required value={form.brand} onChange={set('brand')} className="input-field" placeholder="Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input required value={form.model} onChange={set('model')} className="input-field" placeholder="Innova" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input required type="number" min="2000" max="2030" value={form.year} onChange={set('year')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration No. *</label>
                <input required value={form.registrationNumber} onChange={set('registrationNumber')} className="input-field" placeholder="TN01AB1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select required value={form.type} onChange={set('type')} className="input-field">
                  {['CAR','BIKE','SUV','VAN','TRUCK','SCOOTER'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                <select required value={form.fuelType} onChange={set('fuelType')} className="input-field">
                  {['PETROL','DIESEL','ELECTRIC','HYBRID','CNG'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                <select required value={form.transmission} onChange={set('transmission')} className="input-field">
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <input type="number" min="1" max="50" value={form.seats} onChange={set('seats')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (₹) *</label>
                <input required type="number" min="1" step="0.01" value={form.pricePerDay} onChange={set('pricePerDay')} className="input-field" placeholder="1500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={set('status')} className="input-field">
                  {['AVAILABLE','RENTED','MAINTENANCE','INACTIVE'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={set('imageUrl')} className="input-field" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={3} className="input-field" />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

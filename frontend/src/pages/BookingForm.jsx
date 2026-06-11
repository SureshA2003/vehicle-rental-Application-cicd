import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleAPI, bookingAPI } from '../services/api'
import toast from 'react-hot-toast'
import { IndianRupee, CalendarDays, MapPin } from 'lucide-react'

export default function BookingForm() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropLocation: '',
    notes: ''
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    vehicleAPI.getById(vehicleId).then(res => setVehicle(res.data))
  }, [vehicleId])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const totalDays = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000))
    : 0

  const totalAmount = vehicle ? totalDays * vehicle.pricePerDay : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (totalDays <= 0) { toast.error('End date must be after start date'); return }
    setLoading(true)
    try {
      await bookingAPI.create({ ...form, vehicleId: parseInt(vehicleId) })
      toast.success('Booking created successfully!')
      navigate('/my-bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (!vehicle) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays className="inline h-4 w-4 mr-1" />Pickup Date *
                </label>
                <input type="date" required min={today} value={form.startDate}
                  onChange={set('startDate')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays className="inline h-4 w-4 mr-1" />Return Date *
                </label>
                <input type="date" required min={form.startDate || today} value={form.endDate}
                  onChange={set('endDate')} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />Pickup Location
              </label>
              <input type="text" value={form.pickupLocation} onChange={set('pickupLocation')}
                className="input-field" placeholder="Where to pick up the vehicle" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />Drop Location
              </label>
              <input type="text" value={form.dropLocation} onChange={set('dropLocation')}
                className="input-field" placeholder="Where to return the vehicle" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea value={form.notes} onChange={set('notes')} rows={3}
                className="input-field" placeholder="Any special requests..." />
            </div>

            <button type="submit" disabled={loading || totalDays === 0} className="btn-primary w-full py-3">
              {loading ? 'Creating Booking...' : `Confirm Booking — ₹${totalAmount.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
              <p className="text-2xl">🚗</p>
              <p className="font-bold text-gray-800">{vehicle.brand} {vehicle.model}</p>
              <p className="text-gray-500 text-sm">{vehicle.year} · {vehicle.type}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Rate per day</span>
                <span className="font-medium">₹{vehicle.pricePerDay?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Number of days</span>
                <span className="font-medium">{totalDays}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

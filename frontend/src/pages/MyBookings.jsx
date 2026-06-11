import { useState, useEffect } from 'react'
import { bookingAPI } from '../services/api'
import toast from 'react-hot-toast'
import { CalendarDays, IndianRupee, MapPin } from 'lucide-react'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}

const paymentColors = {
  UNPAID: 'bg-red-100 text-red-600',
  PAID: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingAPI.getMyBookings()
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [])

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      const res = await bookingAPI.cancel(id)
      setBookings(bookings.map(b => b.id === id ? res.data : b))
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📋</p>
          <p className="text-lg font-medium">No bookings yet</p>
          <p className="text-sm">Start by browsing available vehicles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{b.vehicleBrand} {b.vehicleModel}</h3>
                  <p className="text-gray-500 text-sm">{b.vehicleRegistration} · Booking #{b.id}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                  <span className={`badge ${paymentColors[b.paymentStatus]}`}>{b.paymentStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>{b.startDate} → {b.endDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>{b.totalDays} days</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                  <IndianRupee className="h-4 w-4" />
                  <span>{b.totalAmount?.toLocaleString()}</span>
                </div>
                {b.pickupLocation && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{b.pickupLocation}</span>
                  </div>
                )}
              </div>

              {['PENDING', 'CONFIRMED'].includes(b.status) && (
                <div className="mt-4 flex justify-end">
                  <button onClick={() => cancelBooking(b.id)}
                    className="btn-danger text-sm py-1.5 px-4">
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

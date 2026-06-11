import { useState, useEffect } from 'react'
import { bookingAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { ChevronDown } from 'lucide-react'

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

const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']
const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED']

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    bookingAPI.getAll()
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await bookingAPI.updateStatus(id, status)
      setBookings(bookings.map(b => b.id === id ? res.data : b))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const updatePayment = async (id, status) => {
    try {
      const res = await bookingAPI.updatePayment(id, status)
      setBookings(bookings.map(b => b.id === id ? res.data : b))
      toast.success('Payment status updated')
    } catch {
      toast.error('Failed to update payment')
    }
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} bookings</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-auto">
          <option value="ALL">All Statuses</option>
          {BOOKING_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No bookings found</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['#', 'Customer', 'Vehicle', 'Dates', 'Days', 'Amount', 'Status', 'Payment'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{b.userName}</p>
                      <p className="text-gray-400 text-xs">{b.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{b.vehicleBrand} {b.vehicleModel}</p>
                      <p className="text-gray-400 text-xs">{b.vehicleRegistration}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <p>{b.startDate}</p>
                      <p className="text-gray-400 text-xs">→ {b.endDate}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.totalDays}d</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{Number(b.totalAmount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={b.status}
                          onChange={e => updateStatus(b.id, e.target.value)}
                          className={`badge pr-6 cursor-pointer appearance-none border-0 outline-none ${statusColors[b.status]}`}
                        >
                          {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.paymentStatus}
                        onChange={e => updatePayment(b.id, e.target.value)}
                        className={`badge cursor-pointer appearance-none border-0 outline-none ${paymentColors[b.paymentStatus]}`}
                      >
                        {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

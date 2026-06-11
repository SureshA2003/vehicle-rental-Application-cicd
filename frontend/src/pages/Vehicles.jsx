import { useState, useEffect } from 'react'
import { vehicleAPI } from '../services/api'
import VehicleCard from '../components/vehicle/VehicleCard'
import { Search, SlidersHorizontal } from 'lucide-react'

const TYPES = ['ALL', 'CAR', 'BIKE', 'SUV', 'VAN', 'TRUCK', 'SCOOTER']

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('AVAILABLE')
  useEffect(() => {
    vehicleAPI.getAll()
      .then(res => {
        setVehicles(res.data)
        // Default filtered list to only AVAILABLE vehicles
        setFiltered(res.data.filter(v => v.status === 'AVAILABLE'))
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = vehicles
    if (typeFilter !== 'ALL') result = result.filter(v => v.type === typeFilter)
    if (statusFilter !== 'ALL') result = result.filter(v => v.status === statusFilter)
    if (search) result = result.filter(v =>
      `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [search, typeFilter, statusFilter, vehicles])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Vehicles</h1>
        <p className="text-gray-500 mt-1">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} {statusFilter === 'ALL' ? 'found' : statusFilter.toLowerCase()}</p>      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search brand or model..." />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="input-field w-auto">
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="input-field w-auto">
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">🚗</p>
          <p className="text-lg font-medium">No vehicles found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      )}
    </div>
  )
}

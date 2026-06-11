import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { vehicleAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Fuel, Cog, Users, Calendar, IndianRupee } from 'lucide-react'

const typeIcons = { CAR: '🚗', BIKE: '🏍️', TRUCK: '🚚', SUV: '🚙', VAN: '🚐', SCOOTER: '🛵' }

export default function VehicleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    vehicleAPI.getById(id)
      .then(res => setVehicle(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" /></div>
  if (!vehicle) return <div className="text-center py-20 text-gray-400">Vehicle not found</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/vehicles" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to vehicles
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="h-72 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            {vehicle.imageUrl ? (
              <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">{typeIcons[vehicle.type] || '🚗'}</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-gray-500">{vehicle.year} · {vehicle.type}</p>
            </div>
            <span className={`badge mt-1 ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {vehicle.status}
            </span>
          </div>

          <div className="flex items-center gap-1 text-3xl font-bold text-blue-600 my-4">
            <IndianRupee className="h-7 w-7" />
            <span>{vehicle.pricePerDay?.toLocaleString()}</span>
            <span className="text-gray-400 text-lg font-normal">/day</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              [Fuel, 'Fuel', vehicle.fuelType],
              [Cog, 'Transmission', vehicle.transmission],
              [Users, 'Seats', vehicle.seats ? `${vehicle.seats} seats` : 'N/A'],
              [Calendar, 'Registration', vehicle.registrationNumber],
            ].map(([Icon, label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <div className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-800 text-sm">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {vehicle.description && (
            <p className="text-gray-600 text-sm mb-6">{vehicle.description}</p>
          )}

          {vehicle.status === 'AVAILABLE' ? (
            user ? (
              <Link to={`/booking/${vehicle.id}`}
                className="btn-primary w-full text-center py-3 block text-base">
                Book This Vehicle
              </Link>
            ) : (
              <Link to="/login"
                className="btn-primary w-full text-center py-3 block text-base">
                Login to Book
              </Link>
            )
          ) : (
            <button disabled className="btn-primary w-full py-3 opacity-50 cursor-not-allowed">
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

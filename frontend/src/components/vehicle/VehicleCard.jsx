import { Link } from 'react-router-dom'
import { Fuel, Users, Cog, IndianRupee } from 'lucide-react'

const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-700',
  RENTED: 'bg-yellow-100 text-yellow-700',
  MAINTENANCE: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
}

const typeIcons = {
  CAR: '🚗', BIKE: '🏍️', TRUCK: '🚚', SUV: '🚙', VAN: '🚐', SCOOTER: '🛵'
}

export default function VehicleCard({ vehicle }) {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        {vehicle.imageUrl ? (
          <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">{typeIcons[vehicle.type] || '🚗'}</span>
        )}
        <span className={`absolute top-3 right-3 badge ${statusColors[vehicle.status]}`}>
          {vehicle.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg">{vehicle.brand} {vehicle.model}</h3>
        <p className="text-gray-500 text-sm">{vehicle.year} · {vehicle.type}</p>

        <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5" />
            <span>{vehicle.transmission}</span>
          </div>
          {vehicle.seats && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{vehicle.seats} seats</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-0.5 text-blue-600 font-bold text-xl">
              <IndianRupee className="h-5 w-5" />
              <span>{vehicle.pricePerDay.toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-xs">per day</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/vehicles/${vehicle.id}`}
              className="btn-secondary text-sm py-1.5 px-3">
              Details
            </Link>
            {vehicle.status === 'AVAILABLE' && (
              <Link to={`/booking/${vehicle.id}`}
                className="btn-primary text-sm py-1.5 px-3">
                Book
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

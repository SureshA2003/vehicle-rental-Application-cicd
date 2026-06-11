import { Link } from 'react-router-dom'
import { Car, Shield, Clock, Star, ArrowRight } from 'lucide-react'

const features = [
  { icon: Car, title: 'Wide Selection', desc: 'Choose from cars, bikes, SUVs, vans and more' },
  { icon: Shield, title: 'Fully Insured', desc: 'All vehicles come with comprehensive insurance' },
  { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer support for your needs' },
  { icon: Star, title: 'Best Prices', desc: 'Competitive rates with no hidden charges' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Rent a Vehicle,<br />Drive Your Journey
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore our wide range of well-maintained vehicles at affordable prices.
            Book online, pick up anywhere, return with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/vehicles"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Browse Vehicles <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/register"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['500+', 'Happy Customers'], ['100+', 'Vehicles Available'], ['50+', 'Cities Covered'], ['4.8★', 'Average Rating']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-blue-600">{val}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose DriveEasy?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Hit the Road?</h2>
          <p className="text-gray-400 mb-6">Sign up for free and browse hundreds of available vehicles.</p>
          <Link to="/vehicles"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Browse Vehicles <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

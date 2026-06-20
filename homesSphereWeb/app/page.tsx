import Link from 'next/link'
import { Home, Shield, Star } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyGrid from '@/components/property/PropertyGrid'
import { getFeaturedProperties } from '@/lib/api/properties'
import SearchBar from './SearchBar'
import ToastContainer from '@/components/ui/Toast'

export default async function LandingPage() {
  const featured = await getFeaturedProperties()

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Browse thousands of verified apartments, houses, and single rooms. Book viewings and send inquiries in seconds.
            </p>
            <SearchBar />
          </div>
        </section>

        {/* Category Quick Select */}
        <section className="py-12 px-4 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-hs-text mb-6 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Apartments', slug: 'apartment', emoji: '🏢', desc: 'Studio to multi-room units' },
                { label: 'Houses', slug: 'house', emoji: '🏡', desc: 'Single-family homes with space' },
                { label: 'Single Rooms', slug: 'single-room', emoji: '🛏️', desc: 'Affordable private rooms' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/search?houseType=${cat.slug}`}
                  className="group bg-white rounded-xl border border-border p-6 text-center hover:border-primary hover:shadow-md motion-safe:transition-all"
                >
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-semibold text-hs-text group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-muted mt-1">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-hs-text">Featured Listings</h2>
              <Link href="/search" className="text-sm text-primary font-medium hover:underline">
                View all →
              </Link>
            </div>
            <PropertyGrid properties={featured} />
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 px-4 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-hs-text text-center mb-10">
              Why HomeSphere?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Home size={28} className="text-primary" />,
                  title: 'Verified Listings',
                  desc: 'Every property is reviewed by our admin team before going live.',
                },
                {
                  icon: <Shield size={28} className="text-primary" />,
                  title: 'Safe & Secure',
                  desc: 'Direct communication with property managers — no third-party middlemen.',
                },
                {
                  icon: <Star size={28} className="text-primary" />,
                  title: 'Instant Inquiries',
                  desc: 'Send inquiries and schedule viewings with one click.',
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-hs-text mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-4 bg-accent">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Have a Property? List It Free.
            </h2>
            <p className="text-white/90 mb-6">
              Reach thousands of renters. Create your listing in minutes.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-accent font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

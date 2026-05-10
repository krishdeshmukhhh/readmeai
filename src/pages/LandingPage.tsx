import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Philosophy from '../components/Philosophy'
import HowItWorks from '../components/HowItWorks'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="border-t border-border" />
      <Features />
      <div className="border-t border-border" />
      <Philosophy />
      <div className="border-t border-border" />
      <HowItWorks />
      <div className="border-t border-border" />
      <Pricing />
      <Footer />
    </div>
  )
}

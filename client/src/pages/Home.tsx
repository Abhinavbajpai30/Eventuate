import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import TrendingEvents from '../components/TrendingEvents'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
        <Navbar/>
        <Hero/>
        <HowItWorks/>
        <Testimonials/>
        <TrendingEvents/>
        <Footer/>
    </>
  )
}

export default Home
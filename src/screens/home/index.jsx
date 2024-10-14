import React from 'react'
import Hero from './hero/Hero'
import Benefits from './benefits/Benefits'
import Testimonial from './testimonials/Testimonial'
import FAQ from './FAQ/FAQ'
import CallToAction from './CTA/CallToAction'
import ScreensLayout from '../../layouts/ScreensLayout'

const Home = () => {
  return (
    <ScreensLayout>
      <div>
        <Hero />
        <Benefits/>
        <Testimonial/>
        <FAQ />
        <CallToAction/>
      </div>
    </ScreensLayout>
  )
}

export default Home
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import PickedForYou from '../components/PickedForYou'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <div className='px-3 sm:px-5 py-3 sm:py-5'>
      <Hero />
      <PickedForYou />
      <CardList title="Now Playing" category="now_playing" />
      <CardList title="Top Rated" category="top_rated" />
      <CardList title="Popular" category="popular" />
      <CardList title="Upcoming" category="upcoming" />
      <Footer />
    </div>
  )
}

export default Homepage
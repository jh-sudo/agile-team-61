import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ItineraryHome from "../components/ItineraryHome"
import Footer from "../components/Footer"

function ItineraryManager() {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg="https://plus.unsplash.com/premium_photo-1675805015392-28fd80c551ec?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Itinerary home page!"
        btnClass="hide"
      />
      <ItineraryHome/>
      <Footer />
    </>
  );
}

export default ItineraryManager;
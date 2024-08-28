import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import EditItinerary from "../components/EditItinerary"
import Footer from "../components/Footer"

function EditItineraryPage() {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Itinerary page!"
        btnClass="hide"
      />
      <EditItinerary/>
      <Footer />
    </>
  );
}

export default EditItineraryPage;
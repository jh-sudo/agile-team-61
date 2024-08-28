import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ChecklistItems from "../components/checklistItems"
import Footer from "../components/Footer"

function Checklist() {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Checklist"
        btnClass="hide"
      />
      <ChecklistItems/>
      <Footer />
    </>
  );
}

export default Checklist;

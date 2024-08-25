import "./styles.css";
import "./components/Navbar";
import Home from "./routes/Home";
import { Route, Routes } from "react-router-dom";
import About from "./routes/Checklist";
import Contact from "./routes/Contact";
import Service from "./routes/Service";
import TravelAdvisories from "./routes/TravelAdvisories";
import AllAdvisories from "./routes/AllAdvisories";
import { AuthProvider } from './AuthContext';
import Itinerary from "./routes/Itinerary";
import PastItinerary from "./routes/PastItinerary"

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Checklist" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/TravelAdvisories" element={<TravelAdvisories />} />
        <Route path="/AllAdvisories" element={<AllAdvisories />} />
        <Route path="/Itinerary" element={<Itinerary />} />
        <Route path="/PastItinerary" element={<PastItinerary />}/>
      </Routes>
      </AuthProvider>
      
    </div>
  );
}

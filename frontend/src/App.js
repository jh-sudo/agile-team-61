import "./styles.css";
import "./components/Navbar";
import Home from "./routes/Home";
import { Route, Routes } from "react-router-dom";
import About from "./routes/Checklist";
import Contact from "./routes/Contact";
import Service from "./routes/Service";
import { AuthProvider } from './AuthContext';

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Checklist" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
      </Routes>
      </AuthProvider>
      
    </div>
  );
}

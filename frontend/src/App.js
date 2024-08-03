import "./styles.css";
import "./components/Navbar";
import Home from "./routes/Home";
import { Route, Routes } from "react-router-dom";
import About from "./routes/About";
import Contact from "./routes/Contact";
import Service from "./routes/Service";
import Signup from "./routes/Signup";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

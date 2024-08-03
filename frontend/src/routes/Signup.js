import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Signupform from "../components/Signupform";

function Signup() {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg="https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Service"
        btnClass="hide"
      />
      <Signupform/>
    </>
  );
}

export default Signup;

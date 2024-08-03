import "./DestinationsStyles.css";
import DestinationData from "./DestinationData";
import pic1 from "../assets/beach water stuff.jpg";
import pic2 from "../assets/forest stuff.jpg";

const Destinations = () => {
  return (
    <div className="destinations">
      <h1>Popular Destinations</h1>
      <p>Tours give you the opportunity to see alot, within a time frame.</p>

      <DestinationData
        className="first-des"
        heading="des title"
        text="des text he he ha ha"
        img1={pic1}
        img2={pic2}
      />

      <DestinationData
        className="first-des-reverse"
        heading="des title of the next des"
        text="des text he he ha ha boom boom"
        img1={pic2}
        img2={pic1}
      />
    </div>
  );
};

export default Destinations;

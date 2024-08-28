import "./DestinationsStyles.css";
import DestinationData from "./DestinationData";
import pic1 from "../assets/japan-1.jpg";
import pic2 from "../assets/japan-2.jpg";
import pic3 from "../assets/london-1.jpg";
import pic4 from "../assets/london-2.jpg";


const Destinations = () => {
  return (
    <div className="destinations">
      <h1>Popular Destinations</h1>
      <p>Tours give you the opportunity to see alot, within a time frame.</p>

      <DestinationData
        className="first-des"
        heading="Japan"
        text="Japan is a popular tourist destination due to its rich cultural heritage, stunning natural beauty, and unique blend of ancient traditions with modern innovations. Visitors are drawn to its historic temples, vibrant cities, and seasonal attractions like cherry blossoms and autumn foliage. The country's delicious cuisine, advanced technology, safety, cleanliness, and the warm hospitality of its people all contribute to its widespread appeal. Whether exploring bustling Tokyo or serene Kyoto, Japan offers an unforgettable travel experience that captivates people from around the world."
        img1={pic1}
        img2={pic2}
      />

      <DestinationData
        className="first-des-reverse"
        heading="London"
        text="London is a popular tourist destination because of its rich history, iconic landmarks, and vibrant cultural scene. Visitors are drawn to famous sites like the Tower of London, Buckingham Palace, and the British Museum, as well as the city's diverse neighborhoods, world-class museums, theaters, and shopping districts. London also offers a blend of modern attractions, historic architecture, and green spaces, making it a dynamic and appealing city for travelers from around the world."
        img1={pic3}
        img2={pic4}
      />
    </div>
  );
};

export default Destinations;

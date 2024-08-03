import "./TripStyles.css";
import TripData from "./TripData";
import Trip1pic from "../assets/beach water stuff.jpg";
import Trip2pic from "../assets/forest stuff.jpg";

function Trip() {
  return (
    <div className="trip">
      <h1>Recent Trips</h1>
      <p>You can discover unique destintions using Google maps</p>
      <div className="tripcard">
        <TripData
          image={Trip1pic}
          heading="Trip to nimama"
          text="yo mama was fun"
        />
        <TripData
          image={Trip2pic}
          heading="Trip to nimeimei"
          text="yo meimei was fun"
        />
        <TripData
          image={Trip1pic}
          heading="Trip to nipapa"
          text="yo papa was fun"
        />
      </div>
    </div>
  );
}

export default Trip;

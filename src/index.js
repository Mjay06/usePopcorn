import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";
import {useState} from "react"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

{  /*<StarRating
    maxRating={5}
    color="red"
    size="20"
    messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
  />
  <Stars /> */}
  </React.StrictMode>
);

function Stars() {
const [rating, setRating] = useState(0)

  return <div>
  <StarRating maxRating={2} color="red" size="40" onSetRating={setRating} />
  <p>We have {rating} stars</p>
  </div>
}

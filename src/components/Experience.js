import React, { useEffect, useState } from "react";
import "./Experience.css";
import expr from "./MyExperience.json";
import { getDatabase, ref, child, get } from "firebase/database";

export default function Experience() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Create a reference to the Firebase Realtime Database
    const dbRef = ref(getDatabase());
    get(child(dbRef, `experience`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const display = (ele, index) => {
    return (
      <div className="vtimeline-point" key={"exp" + index}>
        <div className="vtimeline-icon">
          <img className="img-circle" src={ele?.image} width="50" height="50" />
        </div>
        <div className="vtimeline-block">
          <span className="vtimeline-date">{ele?.time}</span>
          <div className="vtimeline-content">
            <h3>{ele?.role}</h3>
            <h4>{ele?.Company}</h4>
            <p>{ele?.Discription}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <section id="experience">
      <h2 className="heading">EXPERIENCE</h2>
      <div id="experience-timeline">
        {data
          ? data.map((ele, index) => display(ele, index))
          : expr.map((ele, index) => display(ele, index))}
      </div>
    </section>
  );
}

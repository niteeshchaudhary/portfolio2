import React, { useEffect, useState } from "react";
import "./skills.css";
import skls from "./skills.json";

import { getDatabase, ref, child, get } from "firebase/database";

export default function Skills() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Create a reference to the Firebase Realtime Database
    const dbRef = ref(getDatabase());
    get(child(dbRef, `skills`))
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
      <div className="progressBar" key={"skls" + index}>
        <h4>{ele.name}</h4>
        <div className="progressBarContainer">
          <div className={"progressBarValue value-" + ele.percentage}></div>
        </div>
      </div>
    );
  };
  return (
    <>
      <section id="skills">
        <div className="container">
          <h1 style={{ color: "blue", marginBottom: "3rem" }}>Skills</h1>
          <div className="block"></div>
          <div className="row" key={1}></div>
          <div className="row" key={2}>
            <div className="eight columns">
              {data
                ? data.map((ele, index) => display(ele, index))
                : skls.map((ele, index) => display(ele, index))}
            </div>
            <div className="four columns">
              <p></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

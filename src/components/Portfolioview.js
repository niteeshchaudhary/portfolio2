import { useState, useEffect } from "react";
import "./port.css";
import firstbox from "../ss/Screenshot1.png";
import pro from "./projects.json";
import { getDatabase, ref, child, get } from "firebase/database";

export default function Portfolioview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Create a reference to the Firebase Realtime Database
    const dbRef = ref(getDatabase());
    get(child(dbRef, `projects`))
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

    var items = [],
      point = document.querySelector("svg").createSVGPoint();

    function getCoordinates(e, svg) {
      point.x = e.clientX;
      point.y = e.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function changeColor(e) {
      document.body.className = e.currentTarget.className;
    }

    function Item(config) {
      Object.keys(config).forEach(function (item) {
        this[item] = config[item];
      }, this);
      this.el.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
      this.el.addEventListener("touchmove", this.touchMoveHandler.bind(this));
    }

    Item.prototype = {
      update: function update(c) {
        this.clip.setAttribute("cx", c.x);
        this.clip.setAttribute("cy", c.y);
      },
      mouseMoveHandler: function mouseMoveHandler(e) {
        this.update(getCoordinates(e, this.svg));
      },
      touchMoveHandler: function touchMoveHandler(e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        if (touch) return this.update(getCoordinates(touch, this.svg));
      },
    };

    [].slice
      .call(document.querySelectorAll(".item"), 0)
      .forEach(function (item, index) {
        items.push(
          new Item({
            el: item,
            svg: item.querySelector("svg"),
            clip: document.querySelector("#clip-" + index + " circle"),
          })
        );
      });

    [].slice
      .call(document.querySelectorAll("button"), 0)
      .forEach(function (button) {
        button.addEventListener("click", changeColor);
      });
  }, []);

  const display = (ele, index) => {
    return (
      <div className="item" key={"ele" + (index + 1)}>
        <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 300 200">
          <defs>
            <clipPath id={"clip-" + (index + 1)}>
              <circle cx="0" cy="0" fill="#000" r="150px"></circle>
            </clipPath>
          </defs>
          <image
            height="100%"
            preserveAspectRatio="xMinYMin slice"
            width="100%"
            className="dull-image"
            xlinkHref={ele?.thumb}
          ></image>
          <text className="svg-masked-text" dy=".3em" x="50%" y="50%">
            {ele?.name}
          </text>
          {/* <text className="svg-text" dy=".3em" x="50%" y="50%">
        Worms
      </text> */}
          <g clipPath={`url(#clip-${index + 1})`}>
            <a href={ele?.link} target="blank">
              <image
                height="100%"
                preserveAspectRatio="xMinYMin slice"
                width="100%"
                xlinkHref={ele?.thumb}
              ></image>
              <text className="svg-masked-text" dy=".3em" x="50%" y="50%">
                {ele?.name}
              </text>
            </a>
          </g>
        </svg>
      </div>
    );
  };
  return (
    <section className="container-port" id="work">
      <header>
        <h1>My Work</h1>
        <p>Hover and Click to view.</p>
      </header>
      <main>
        <div className="items">
          <div className="item" style={{ display: "none" }}>
            <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 0 0">
              <defs>
                <clipPath id="clip-0">
                  <circle cx="0" cy="0" fill="#000" r="0px"></circle>
                </clipPath>
              </defs>
              <text className="svg-text" dy=".3em" x="50%" y="50%">
                X-rays
              </text>
              <g clipPath="url(#clip-0)">
                <image
                  height="0%"
                  preserveAspectRatio="xMinYMin slice"
                  width="0%"
                  xmlnshref={firstbox}
                ></image>
                <text className="svg-masked-text" dy=".3em" x="50%" y="50%">
                  X-rays
                </text>
              </g>
            </svg>
          </div>
          {data
            ? data.map((ele, index) => display(ele, index))
            : pro.map((ele, index) => display(ele, index))}
        </div>
      </main>
    </section>
  );
}

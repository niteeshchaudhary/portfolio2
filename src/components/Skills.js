import "./skills.css";
import skls from "./skills.json";
export default function Skills() {
  return (
    <>
      <section id="skills">
        <div className="container">
          <h1 style={{ color: "blue", marginBottom: "3rem" }}>Skills</h1>
          <div className="block"></div>
          <div className="row" key={1}>
            {/* <div className="one-third column">
              <h3>Design</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum, recusandae, at, labore velit eligendi amet nobis
                repellat natus.
              </p>
            </div>
            <div className="one-third column">
              <h3>Development</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum, recusandae, at, labore velit eligendi amet nobis
                repellat natus.
              </p>
            </div>
            <div className="one-third column">
              <h3>Marketing</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum, recusandae, at, labore velit eligendi amet nobis
                repellat natus.
              </p>
            </div> */}
          </div>
          <div className="row" key={2}>
            <div className="eight columns">
              {skls.map((ele, index) => {
                return (
                  <div className="progressBar" key={"skls" + index}>
                    <h4>{ele.name}</h4>
                    <div className="progressBarContainer">
                      <div
                        className={"progressBarValue value-" + ele.percentage}
                      ></div>
                    </div>
                  </div>
                );
              })}
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

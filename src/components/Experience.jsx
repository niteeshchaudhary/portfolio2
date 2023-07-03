import "./Experience.css";
import expr from "./MyExperience.json";
export default function Experience() {
  return (
    <section id="experience">
      <h2 class="heading">EXPERIENCE</h2>
      <div id="experience-timeline">
        {expr.map((ele, index) => {
          return (
            <div class="vtimeline-point">
              <div class="vtimeline-icon">
                <img
                  class="img-circle"
                  src={ele?.image}
                  width="50"
                  height="50"
                />
              </div>
              <div class="vtimeline-block">
                <span class="vtimeline-date">{ele?.time}</span>
                <div class="vtimeline-content">
                  <h3>{ele?.role}</h3>
                  <h4>{ele?.Company}</h4>
                  <p>{ele?.Discription}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

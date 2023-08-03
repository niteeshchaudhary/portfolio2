import jQuery from "jquery";
import Typewriter from "typewriter-effect";
import { useEffect } from "react";
import "./Menu.css";
import "./CursorEffect.css";
export default function CursorEffect() {
  var toggleClass = function toggleClass(element, stringClass) {
    if (element.classList.contains(stringClass))
      element.classList.remove(stringClass);
    else element.classList.add(stringClass);
  };

  function switchClicked() {
    console.log(jQuery("body").hasClass("light"));
    if (jQuery("body").hasClass("light")) {
      jQuery("body").addClass("dark").removeClass("light");
      localStorage.setItem("theme", "dark");
      jQuery("#switch").addClass("switched");
    } else if (jQuery("body").hasClass("dark")) {
      jQuery("body").addClass("light").removeClass("dark");
      localStorage.setItem("theme", "light");
      jQuery("#switch").removeClass("switched");
    }
  }
  useEffect(() => {
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mousemove", function (n) {
        t.style.left = n.clientX + "px";
        t.style.top = n.clientY + "px";
        e.style.left = n.clientX + "px";
        e.style.top = n.clientY + "px";
        i.style.left = n.clientX + "px";
        i.style.top = n.clientY + "px";
      });
    var t = document.getElementById("cursor"),
      e = document.getElementById("cursor2"),
      i = document.getElementById("cursor3");
    function n(t) {
      e.classList.add("hover");
      i.classList.add("hover");
    }
    function s(t) {
      e.classList.remove("hover");
      i.classList.remove("hover");
    }
    s();
    for (
      var r = document.querySelectorAll(".hover-target"), a = r.length - 1;
      a >= 0;
      a--
    ) {
      o(r[a]);
    }
    function o(t) {
      t.addEventListener("mouseover", n);
      t.addEventListener("mouseout", s);
    }
  }, []);
  return (
    <>
      <header className="cd-header">
        <div className="header-wrapper">
          <div className="logo-wrap">
            <a href="#" className="hover-target">
              <span>Niteesh Kamal Chaudhary &nbsp;</span>
            </a>
          </div>
          <div className="nav-but-wrap">
            <div
              className="menu-icon hover-target"
              onClick={() => {
                return toggleClass(
                  document.querySelector("body"),
                  "nav-active"
                );
              }}
            >
              <span className="menu-icon__line menu-icon__line-left"></span>
              <span className="menu-icon__line"></span>
              <span className="menu-icon__line menu-icon__line-right"></span>
            </div>
          </div>
        </div>
      </header>
      <section className="section full-height over-hide" id="intro">
        <div className="switch-wrap">
          <div className="writer-effect">
            Hi!!,
            <br />
            I am
            <Typewriter
              // onInit={(typewriter) => {
              //   typewriter
              //     .typeString("Hello Every one")
              //     .pauseFor(1000)
              //     .deleteAll()
              //     .typeString("NKC")
              //     .pauseFor(1000)
              //     .deleteAll()
              //     .typeString("Welcomes You")
              //     .start();
              // }}
              options={{
                strings: [
                  "Niteesh Kamal Chaudhary",
                  "a Software Developer",
                  "a Backend Developer",
                  "a Game Developer",
                  "an Android Developer",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>

          <div id="switch" onClick={switchClicked} className="hover-target">
            <div id="circle"></div>
          </div>
          <p>
            <span>dark</span> - <span>light</span>
          </p>
        </div>
      </section>

      <div className="cursor" id="cursor"></div>
      <div className="cursor2" id="cursor2"></div>
      <div className="cursor3" id="cursor3"></div>
    </>
  );
}

import "./CursorEffect.css";
import React, { useEffect, useState } from "react";
export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  var toggleClass = function toggleClass(element, stringClass) {
    if (element.classList.contains(stringClass))
      element.classList.remove(stringClass);
    else element.classList.add(stringClass);
  };
  function toggleClass2(element, stringClass) {
    var elems = document.getElementsByClassName("nav__list-item");
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].classList.contains(stringClass)) {
        elems[i].classList.remove(stringClass);
      }
    }
    element.classList.add(stringClass);
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = document.documentElement.scrollTop;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (
          scrollPosition >= sectionTop - 300 &&
          scrollPosition < sectionTop + sectionHeight - 300
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="nav">
      <div className="nav__content">
        <ul className="nav__list">
          <li
            className={
              "nav__list-item " +
              (activeSection === "intro" ? "active-nav" : "")
            }
            onClick={(e) => {
              toggleClass(document.querySelector("body"), "nav-active");
              return toggleClass2(e.currentTarget, "active-nav");
            }}
          >
            <a href="#intro" className="hover-target">
              Intro
            </a>
          </li>
          <li
            className={
              "nav__list-item " +
              (activeSection === "skills" ? "active-nav" : "")
            }
            onClick={(e) => {
              toggleClass(document.querySelector("body"), "nav-active");
              return toggleClass2(e.currentTarget, "active-nav");
            }}
          >
            <a href="#skills" className="hover-target">
              Skills
            </a>
          </li>
          <li
            className={
              "nav__list-item " + (activeSection === "work" ? "active-nav" : "")
            }
            onClick={(e) => {
              toggleClass(document.querySelector("body"), "nav-active");
              return toggleClass2(e.currentTarget, "active-nav");
            }}
          >
            <a href="#work" className="hover-target">
              My Work
            </a>
          </li>
          <li
            className={
              "nav__list-item " +
              (activeSection === "contact" ? "active-nav" : "")
            }
            onClick={(e) => {
              toggleClass(document.querySelector("body"), "nav-active");
              return toggleClass2(e.currentTarget, "active-nav");
            }}
          >
            <a href="#contact" className="hover-target">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

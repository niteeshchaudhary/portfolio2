import { useEffect } from "react";
import "./Menu.css";
import $ from "jquery";
export default function Menu() {
  useEffect(() => {
    $(function () {
      $("body").addClass("light");

      $("ul.menu li").on("mouseover", function () {
        $("body").addClass("dark").removeClass("light");
      });

      $("ul.menu li").on("mouseout", function () {
        $("body").addClass("light").removeClass("dark");
      });
    });
  }, []);
  return (
    <>
      <ul className="menu">
        <li>
          <span>Welcome</span>
        </li>
        <li>
          <span>About Us</span>
        </li>
        <li>
          <span>What we do</span>
        </li>
        <li>
          <span>Our portfolio</span>
        </li>
        <li>
          <span>Contact us</span>
        </li>
      </ul>
    </>
  );
}

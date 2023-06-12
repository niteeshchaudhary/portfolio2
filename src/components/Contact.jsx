import "./Contact.css";
import "./subbut.css";
import $ from "jquery";
import { useEffect, useState } from "react";
import emailjs from "emailjs-com";

export default function Contact() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    $(".js-input").keyup(function () {
      if ($(this).val()) {
        $(this).addClass("not-empty");
      } else {
        $(this).removeClass("not-empty");
      }
    });

    // $(".submit").on("click", function () {

    // });
  }, []);

  function sendEmail(e) {
    e.preventDefault();
    var wrapper = $("#button-wrapper");
    if (wrapper.not(".checked")) {
      wrapper.addClass("checked");
      setTimeout(function () {
        wrapper.removeClass("checked");
      }, 8000);
    }
    emailjs
      .sendForm(
        "service_j9ovyx9",
        "template_jlm3o95",
        e.target,
        "qzrCzPgtdSbiIJl6v"
      )
      .then(
        (result) => {
          console.log(result.text);
          emailjs.sendForm(
            "service_j9ovyx9",
            "template_rn5puj8",
            e.target,
            "qzrCzPgtdSbiIJl6v"
          );
        },
        (error) => {
          console.log(error.text);
        }
      );

    var ele = document.getElementsByClassName("input-text");
    for (var i = 0; i < ele.length; i++) {
      ele[i].value = "";
    }
  }

  return (
    <div>
      <section class="get-in-touchw" id="contact">
        <h1 class="title">Get in touch</h1>
        <form
          class="contact-formw roww"
          onSubmit={sendEmail}
          // {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}
        >
          <div class="form-field col x-50">
            <input
              id="name"
              class="input-text js-input"
              name="user_name"
              type="text"
              required
            />
            <label class="label" for="name">
              Name
            </label>
          </div>
          <div class="form-field col x-50">
            <input
              id="email"
              class="input-text js-input"
              type="email"
              name="user_email"
              required
            />
            <label class="label" for="email">
              E-mail
            </label>
          </div>
          <div class="form-field col x-100">
            <textarea
              id="message"
              class="input-area js-input"
              type="text"
              name="message"
              required
            />
            <label class="label2" for="message">
              Message
            </label>
          </div>

          <div class="form-field col x-100 align-centerw">
            {/*  */}
            <input
              style={{ display: "none" }}
              id="submitcontact"
              type="submit"
              value="Submit"
            />
            <div id="button-wrapper">
              <a
                class="submit"
                onClick={() => document.getElementById("submitcontact").click()}
              >
                Send
              </a>
              <div class="loader-wrapper">
                <span class="loader yellow"></span>
                <span class="loader pink"></span>
              </div>
              <span class="loader orange"></span>

              <div class="check-wrapper">
                <svg
                  version="1.1"
                  width="65px"
                  height="38px"
                  viewBox="0 0 64.5 37.4"
                >
                  <polyline class="check" points="5,13 21.8,32.4 59.5,5 " />
                </svg>
              </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              {" "}
              <defs>
                {" "}
                <filter id="goo">
                  {" "}
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                  />{" "}
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />{" "}
                  <feBlend in="SourceGraphic" in2="goo" />{" "}
                </filter>{" "}
              </defs>
            </svg>
          </div>
        </form>
      </section>

      {/* <p class="note">
        Based on{" "}
        <a
          class="link"
          href="http://redcollar.digital/contacts/"
          target="blank"
        >
          Red Collar Contact Form
        </a>
        .
      </p> */}
    </div>
  );
}

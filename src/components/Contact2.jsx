import "./Contact.css";
import $ from "jquery";
import { useEffect, useState } from "react";
import nodemailer from "nodemailer";

export default function Contact() {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: "nkcgreat@gmail.com",
      pass: "****************",
    },
  });
  useEffect(() => {
    $(".js-input").keyup(function () {
      if ($(this).val()) {
        $(this).addClass("not-empty");
      } else {
        $(this).removeClass("not-empty");
      }
    });
  }, []);

  function sendEmail(e) {
    e.preventDefault();
    send(e);
  }
  async function send(e) {
    console.log(e.target);
    await transporter
      .sendMail({
        from: e.target["user_email"],
        to: "nkchaudhary00@gmail.com",
        subject: "Test Email Subject",
        html: "<h1>Example HTML Message Body</h1>",
      })
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
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
              class="input-text js-input"
              type="text"
              name="message"
              required
            />
            <label class="label" for="message">
              Message
            </label>
          </div>
          <div class="form-field col x-100 align-centerw">
            <input class="submit-btn" type="submit" value="Submit" />
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

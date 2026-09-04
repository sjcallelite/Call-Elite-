/**
 * RC Call Elite — Firebase Firestore integration.
 * Direct website → Firestore lead submission.
 *
 * No Cloud Functions.
 * No /api endpoint.
 * No Firebase Blaze plan required.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBBISkOHBg-awXag6LX-csIKQftDpo-nKo",
  authDomain: "rc-call-elite.firebaseapp.com",
  projectId: "rc-call-elite",
  storageBucket: "rc-call-elite.firebasestorage.app",
  messagingSenderId: "589360697021",
  appId: "1:589360697021:web:18bde0d39511a56751b1d4",
  measurementId: "G-MRXGGTQ9T3"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================================================
// RC CALL ELITE
// ============================================================

(function () {

  "use strict";


  // ----------------------------------------------------------
  // GOOGLE ANALYTICS
  // ----------------------------------------------------------

  var GA_ID = window.GA_MEASUREMENT_ID;

  var gaReady =
    !!GA_ID &&
    GA_ID.indexOf("YOUR_") !== 0;


  if (gaReady) {

    var s = document.createElement("script");

    s.async = true;

    s.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_ID);

    document.head.appendChild(s);


    window.dataLayer =
      window.dataLayer || [];


    window.gtag = function () {

      window.dataLayer.push(arguments);

    };


    window.gtag(
      "js",
      new Date()
    );


    window.gtag(
      "config",
      GA_ID
    );

  }


  // ----------------------------------------------------------
  // GOOGLE ANALYTICS EVENT
  // ----------------------------------------------------------

  function trackEvent(name, params) {

    if (
      gaReady &&
      typeof window.gtag === "function"
    ) {

      window.gtag(
        "event",
        name,
        params || {}
      );

    }

  }


  // ----------------------------------------------------------
  // STATUS MESSAGE
  // ----------------------------------------------------------

  function setStatus(
    el,
    message,
    isError
  ) {

    if (!el) return;

    el.textContent = message;

    el.style.color =
      isError
        ? "#ff6b6b"
        : "#4caf50";

  }


  // ----------------------------------------------------------
  // QUOTE FORM
  // ----------------------------------------------------------

  function initQuoteForm() {

    var form =
      document.getElementById(
        "quote-form"
      );


    if (!form) {

      console.warn(
        "RC Call Elite: quote form not found."
      );

      return;

    }


    var statusEl =
      document.getElementById(
        "quote-form-status"
      );


    var submitBtn =
      document.getElementById(
        "quote-submit-btn"
      );


    var originalBtnHtml =
      submitBtn
        ? submitBtn.innerHTML
        : "";


    form.addEventListener(
      "submit",
      async function (e) {

        e.preventDefault();


        setStatus(
          statusEl,
          "",
          false
        );


        // ----------------------------------------------------
        // GET FORM DATA
        // ----------------------------------------------------

        var formData =
          new FormData(form);


        var payload = {

          service:
            (
              formData.get("service") ||
              ""
            ).trim(),

          city:
            (
              formData.get("city") ||
              ""
            ).trim(),

          name:
            (
              formData.get("name") ||
              ""
            ).trim(),

          phone:
            (
              formData.get("phone") ||
              ""
            ).trim(),

          message:
            (
              formData.get("message") ||
              ""
            ).trim(),

          website:
            (
              formData.get("website") ||
              ""
            ).trim()

        };


        // ----------------------------------------------------
        // HONEYPOT SPAM PROTECTION
        // ----------------------------------------------------

        if (payload.website) {

          setStatus(
            statusEl,
            "Please try again.",
            true
          );

          return;

        }


        // ----------------------------------------------------
        // REQUIRED FIELD VALIDATION
        // ----------------------------------------------------

        if (
          !payload.service ||
          !payload.city ||
          !payload.name ||
          !payload.phone
        ) {

          setStatus(
            statusEl,
            "Please fill in all required fields.",
            true
          );

          return;

        }


        // ----------------------------------------------------
        // DISABLE SUBMIT BUTTON
        // ----------------------------------------------------

        if (submitBtn) {

          submitBtn.disabled = true;

          submitBtn.innerHTML =
            "Sending...";

        }


        setStatus(
          statusEl,
          "Sending your request...",
          false
        );


        // ----------------------------------------------------
        // SAVE DIRECTLY TO FIRESTORE
        // ----------------------------------------------------

        try {

          await addDoc(
            collection(db, "leads"),
            {

              service:
                payload.service,

              city:
                payload.city,

              name:
                payload.name,

              phone:
                payload.phone,

              message:
                payload.message,

              source:
                "website",

              createdAt:
                serverTimestamp()

            }
          );


          // --------------------------------------------------
          // SUCCESS
          // --------------------------------------------------

          setStatus(
            statusEl,
            "Thanks! Your request has been submitted successfully.",
            false
          );


          form.reset();


          // --------------------------------------------------
          // GOOGLE ANALYTICS
          // --------------------------------------------------

          trackEvent(
            "generate_lead",
            {

              form_name:
                "quote_form",

              service:
                payload.service,

              city:
                payload.city

            }
          );


        } catch (error) {

          console.error(
            "RC Call Elite: Firestore error:",
            error
          );


          setStatus(
            statusEl,
            "Something went wrong. Please try again or contact us directly.",
            true
          );

        }


        // ----------------------------------------------------
        // ENABLE BUTTON AGAIN
        // ----------------------------------------------------

        if (submitBtn) {

          submitBtn.disabled = false;

          submitBtn.innerHTML =
            originalBtnHtml;

        }

      }
    );

  }


  // ----------------------------------------------------------
  // CONTACT LINK TRACKING
  // ----------------------------------------------------------

  function initLinkTracking() {

    document.addEventListener(
      "click",
      function (e) {

        var link =
          e.target.closest &&
          e.target.closest(
            "a[href]"
          );


        if (!link) return;


        var href =
          link.getAttribute("href") ||
          "";


        // WhatsApp
        if (
          href.indexOf("wa.me") !== -1
        ) {

          trackEvent(
            "whatsapp_click",
            {
              link_url: href
            }
          );

        }


        // Phone
        else if (
          href.indexOf("tel:") === 0
        ) {

          trackEvent(
            "phone_click",
            {
              link_url: href
            }
          );

        }


        // Email
        else if (
          href.indexOf("mailto:") === 0
        ) {

          trackEvent(
            "email_click",
            {
              link_url: href
            }
          );

        }


        // Google Maps
        else if (
          href.indexOf("google.com/maps") !== -1 ||
          href.indexOf("maps.google.com") !== -1
        ) {

          trackEvent(
            "directions_click",
            {
              link_url: href
            }
          );

        }

      }
    );

  }


  // ----------------------------------------------------------
  // START
  // ----------------------------------------------------------

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initQuoteForm();

      initLinkTracking();

    }
  );


})();

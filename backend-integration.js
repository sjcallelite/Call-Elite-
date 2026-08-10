/**
 * RC Call Elite — backend integration.
 * Progressive enhancement only: adds no visible UI beyond the
 * existing (empty-by-default) #quote-form-status region, and does
 * not alter any existing design, copy, or layout.
 */
(function () {
  "use strict";

  var API_BASE = "/api"; // same-origin via Firebase Hosting rewrite

  // ---------------------------------------------------------------
  // Google Analytics (GA4) — only loads if a real Measurement ID
  // has been set (window.GA_MEASUREMENT_ID, from index.html).
  // Stays a silent no-op with the placeholder value.
  // ---------------------------------------------------------------
  var GA_ID = window.GA_MEASUREMENT_ID;
  var gaReady = !!GA_ID && GA_ID.indexOf("YOUR_") !== 0;

  if (gaReady) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  function trackEvent(name, params) {
    if (gaReady && typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  // ---------------------------------------------------------------
  // Quote / contact form submission
  // ---------------------------------------------------------------
  function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? "#ff6b6b" : "#4caf50";
  }

  function initQuoteForm() {
    var form = document.getElementById("quote-form");
    if (!form) return;

    var statusEl = document.getElementById("quote-form-status");
    var submitBtn = document.getElementById("quote-submit-btn");
    var originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus(statusEl, "", false);

      var formData = new FormData(form);
      var payload = {
        service: (formData.get("service") || "").trim(),
        city: (formData.get("city") || "").trim(),
        name: (formData.get("name") || "").trim(),
        phone: (formData.get("phone") || "").trim(),
        message: (formData.get("message") || "").trim(),
        website: (formData.get("website") || "").trim(), // honeypot
      };

      // Minimal client-side check so users get instant feedback;
      // the server re-validates everything regardless.
      if (!payload.service || !payload.city || !payload.name || !payload.phone) {
        setStatus(statusEl, "Please fill in all required fields.", true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";
      }

      fetch(API_BASE + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            setStatus(statusEl, result.data.message || "Thanks! We'll be in touch shortly.", false);
            form.reset();
            trackEvent("generate_lead", {
              form_name: "quote_form",
              service: payload.service,
              city: payload.city,
            });
          } else {
            var errMsg =
              (result.data.errors && result.data.errors.join(" ")) ||
              "Something went wrong. Please try again.";
            setStatus(statusEl, errMsg, true);
          }
        })
        .catch(function () {
          setStatus(
            statusEl,
            "Network error — please check your connection and try again, or contact us directly.",
            true
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
        });
    });
  }

  // ---------------------------------------------------------------
  // GA4 event tracking for key contact touchpoints. Uses delegated
  // listeners keyed off href patterns, so no HTML markup changes
  // were needed anywhere else on the page.
  // ---------------------------------------------------------------
  function initLinkTracking() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a[href]");
      if (!link) return;
      var href = link.getAttribute("href") || "";

      if (href.indexOf("wa.me") !== -1) {
        trackEvent("whatsapp_click", { link_url: href });
      } else if (href.indexOf("tel:") === 0) {
        trackEvent("phone_click", { link_url: href });
      } else if (href.indexOf("mailto:") === 0) {
        trackEvent("email_click", { link_url: href });
      } else if (href.indexOf("google.com/maps") !== -1 || href.indexOf("maps.google.com") !== -1) {
        trackEvent("directions_click", { link_url: href });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initQuoteForm();
    initLinkTracking();
  });
})();

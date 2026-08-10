"use strict";

const express = require("express");
const { securityHeaders, cors } = require("./middleware/security");

const healthRoute = require("./routes/health");
const contactRoute = require("./routes/contact");
const newsletterRoute = require("./routes/newsletter");

const app = express();

app.use(securityHeaders);
app.use(cors);
app.use(express.json({ limit: "20kb" })); // small limit — these are short form payloads

app.use("/health", healthRoute);
app.use("/contact", contactRoute);
app.use("/newsletter", newsletterRoute);

// Generic 404 for anything else under /api
app.use((req, res) => {
  res.status(404).json({ success: false, errors: ["Not found."] });
});

// Final error handler: never leak stack traces or internals to clients.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, errors: ["Origin not allowed."] });
  }
  console.error("[app] unhandled error:", err);
  return res.status(500).json({ success: false, errors: ["Internal server error."] });
});

module.exports = app;

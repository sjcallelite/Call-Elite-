"use strict";

require("dotenv").config();

const { onRequest } = require("firebase-functions/v2/https");
const app = require("./src/app");

/**
 * Single HTTPS function exposing the whole API under /api/*.
 * Firebase Hosting rewrites (see firebase.json) route:
 *   /api/**  ->  this function
 * so the frontend calls same-origin paths like POST /api/contact.
 */
exports.api = onRequest(
  {
    region: "asia-south1", // change to your preferred region
    cors: false, // CORS is handled inside the Express app (allow-list based)
    maxInstances: 10,
  },
  app
);

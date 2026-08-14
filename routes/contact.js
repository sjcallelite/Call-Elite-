"use strict";

const express = require("express");
const admin = require("firebase-admin");
const validator = require("validator");

const router = express.Router();

const db = admin.firestore();

router.post("/", async (req, res) => {
  try {
    const {
      service,
      city,
      name,
      phone,
      message,
      website
    } = req.body || {};

    // Honeypot protection
    if (website) {
      return res.status(400).json({
        success: false,
        errors: ["Invalid submission."]
      });
    }

    const errors = [];

    if (!service || !String(service).trim()) {
      errors.push("Please select a service.");
    }

    if (!city || !String(city).trim()) {
      errors.push("Please enter your city.");
    }

    if (!name || !String(name).trim()) {
      errors.push("Please enter your name.");
    }

    if (!phone || !String(phone).trim()) {
      errors.push("Please enter your phone number.");
    }

    if (
      phone &&
      !validator.isMobilePhone(String(phone).trim(), "any")
    ) {
      errors.push("Please enter a valid phone number.");
    }

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    await db.collection("leads").add({
      service: String(service).trim(),
      city: String(city).trim(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      message: message ? String(message).trim() : "",
      source: "website",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      message: "Thanks! We'll be in touch shortly."
    });

  } catch (error) {
    console.error("[contact] error:", error);

    return res.status(500).json({
      success: false,
      errors: ["Unable to submit your request right now."]
    });
  }
});

module.exports = router;

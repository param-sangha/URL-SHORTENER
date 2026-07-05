const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const {
  handleGenerateURL,
  handleGenerateAnalytics,
} = require("../controllers/url");

router.post("/", handleGenerateURL);

router.get("/analytics/:shortId", handleGenerateAnalytics);

module.exports = router;

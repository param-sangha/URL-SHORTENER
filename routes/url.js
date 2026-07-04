const express = require("express");
const {
  handleGenerateURL,
  handleGenerateAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateURL);

router.get("/analytics/:shortId", handleGenerateAnalytics);

module.exports = router;

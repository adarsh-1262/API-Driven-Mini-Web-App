const express = require("express");
const router = express.Router();
const { searchAndStore, getStoredResults } = require("../controllers/searchController");

// POST to fetch from GitHub and save to DB
router.post("/search", searchAndStore);

// GET to read from DB (with optional keyword filter + pagination)
router.get("/results", getStoredResults);

module.exports = router;

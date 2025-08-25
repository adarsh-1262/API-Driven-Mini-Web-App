const axios = require("axios");
const Repo = require("../models/Repo");

/**
 * POST /api/search
 * Body: { keyword: string, page?: number, per_page?: number }
 * 1) Calls GitHub search API
 * 2) Upserts results into MongoDB
 * 3) Returns a summary and saved docs count
 */
const searchAndStore = async (req, res) => {
  try {
    const { keyword, page = 1, per_page = 10 } = req.body || {};
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return res.status(400).json({ message: "keyword is required" });
    }

    const url = "https://api.github.com/search/repositories";
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const { data } = await axios.get(url, {
      headers,
      params: { q: keyword, sort: "stars", order: "desc", page, per_page },
      timeout: 15000,
    });

    const items = Array.isArray(data.items) ? data.items : [];

    // Prepare docs for bulk upsert
    const ops = items.map((r) => ({
      updateOne: {
        filter: { githubId: r.id },
        update: {
          $set: {
            githubId: r.id,
            name: r.name,
            fullName: r.full_name,
            htmlUrl: r.html_url,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            owner: r.owner?.login,
            keyword,
            fetchedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    let bulkResult = { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
    if (ops.length) {
      const r = await Repo.bulkWrite(ops, { ordered: false });
      bulkResult = {
        matchedCount: r.matchedCount ?? 0,
        modifiedCount: r.modifiedCount ?? 0,
        upsertedCount: r.upsertedCount ?? (r.upsertedIds ? Object.keys(r.upsertedIds).length : 0),
      };
    }

    return res.status(200).json({
      keyword,
      totalFoundOnGitHub: data.total_count ?? 0,
      savedOrUpdated: bulkResult,
      returnedSample: items.map((r) => ({
        id: r.id,
        name: r.full_name,
        url: r.html_url,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
      })),
    });
  } catch (err) {
    // Handle GitHub rate limits or network errors
    const status = err.response?.status || 500;
    const msg =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong while searching";
    return res.status(status).json({ message: msg });
  }
};

/**
 * GET /api/results
 * Query: keyword?: string, page?: number, limit?: number
 * Returns stored repos, optionally filtered by keyword, with pagination
 */
const getStoredResults = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (keyword) filter.keyword = { $regex: keyword, $options: "i" };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [items, total] = await Promise.all([
      Repo.find(filter)
        .sort({ fetchedAt: -1, stars: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Repo.countDocuments(filter),
    ]);

    return res.json({
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch results" });
  }
};

module.exports = { searchAndStore, getStoredResults };

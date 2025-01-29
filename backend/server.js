const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cve_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const cveSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  sourceIdentifier: String,
  published: Date,
  lastModified: Date,
  vulnStatus: String,
  descriptions: [{ lang: String, value: String }],
  metrics: {
    cvssMetricV2: {
      cvssData: {
        baseScore: Number,
        severity: String,
        vectorString: String,
        accessVector: String,
        accessComplexity: String,
        authentication: String,
        confidentialityImpact: String,
        integrityImpact: String,
        availabilityImpact: String,
        exploitabilityScore: Number,
        impactScore: Number,
      },
    },
  },
  cpe: [{ criteria: String, matchCriteriaId: String, vulnerable: Boolean }],
});

const CVE = mongoose.model("CVE", cveSchema);

// Fetch CVEs from NVD API
async function fetchCVEs(startIndex = 0, resultsPerPage = 100) {
  try {
    const response = await axios.get(
      "https://services.nvd.nist.gov/rest/json/cves/2.0",
      {
        params: { startIndex, resultsPerPage },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching CVEs:", error);
    return null;
  }
}

// Synchronize CVEs
async function syncCVEs() {
  console.log("Starting CVE sync...");
  let startIndex = 0;
  const resultsPerPage = 100;

  while (true) {
    const data = await fetchCVEs(startIndex, resultsPerPage);
    if (!data || !data.vulnerabilities || data.vulnerabilities.length === 0)
      break;

    for (const vuln of data.vulnerabilities) {
      if (!vuln.cve || !vuln.cve.id) continue; // Skip invalid entries
      await CVE.findOneAndUpdate(
        { id: vuln.cve.id },
        { ...vuln.cve, lastModified: new Date(vuln.cve.lastModified) },
        { upsert: true, new: true }
      );
    }

    startIndex += resultsPerPage; // Move to the next batch of 100
    if (startIndex >= data.totalResults) break;

    await new Promise((resolve) => setTimeout(resolve, 6000)); // Wait 6 sec to prevent rate limit
  }
  console.log("CVE sync completed");
}


// Schedule Sync
cron.schedule("0 0 * * *", syncCVEs); // Daily at midnight

// API Routes

// GET /api/cves - Fetch CVEs with filtering
app.get("/api/cves", async (req, res) => {
  try {
    const { page = 1, limit = 10, id, year, score, modifiedDays } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};

    // Filter by CVE ID (Exact Match)
    if (id) {
      filter.id = id;
    }

    // Filter by Year (Published Date)
    if (year) {
      filter.published = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    // Filter by CVSS Score (Greater than or equal to given score)
    if (score) {
      filter["metrics.cvssMetricV2.cvssData.baseScore"] = {
        $gte: parseFloat(score),
      };
    }

    // Filter by last modified days
    if (modifiedDays) {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - modifiedDays);
      filter.lastModified = { $gte: sinceDate };
    }

    // Fetching total filtered results count
    const total = await CVE.countDocuments(filter);

    // Fetching paginated results
    const cves = await CVE.find(filter)
      .sort({ lastModified: -1 }) // Sort by latest modified first
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      cves,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      hasNextPage: skip + parseInt(limit) < total,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching CVEs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cves/:id - Fetch specific CVE details
app.get("/api/cves/:id", async (req, res) => {
  try {
    const cve = await CVE.findOne({ id: req.params.id });
    if (!cve) {
      return res.status(404).json({ error: "CVE not found" });
    }
    res.json(cve);
  } catch (error) {
    console.error("Error fetching CVE detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  syncCVEs();
});

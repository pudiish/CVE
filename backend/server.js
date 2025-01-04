const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cve_database')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const cveSchema = new mongoose.Schema({
  id: String,
  sourceIdentifier: String,
  published: Date,
  lastModified: Date,
  vulnStatus: String,
  descriptions: [{
    lang: String,
    value: String
  }],
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
        impactScore: Number
      }
    }
  },
  cpe: [{
    criteria: String,
    matchCriteriaId: String,
    vulnerable: Boolean
  }]
});

const CVE = mongoose.model('CVE', cveSchema);

async function fetchCVEs(startIndex = 0, resultsPerPage = 10) {
  try {
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0', {
      params: {
        startIndex,
        resultsPerPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CVEs:', error);
    return null;
  }
}

async function syncCVEs() {
  console.log('Starting CVE sync...');
  let startIndex = 0;
  const resultsPerPage = 100;
  
  while (true) {
    const data = await fetchCVEs(startIndex, resultsPerPage);
    if (!data || !data.vulnerabilities || data.vulnerabilities.length === 0) break;
    
    for (const vuln of data.vulnerabilities) {
      await CVE.findOneAndUpdate(
        { id: vuln.cve.id },
        vuln.cve,
        { upsert: true, new: true }
      );
    }
    
    startIndex += resultsPerPage;
    if (startIndex >= data.totalResults) break;
    await new Promise(resolve => setTimeout(resolve, 6000));
  }
  console.log('CVE sync completed');
}

cron.schedule('0 0 * * *', syncCVEs);

app.get('/api/cves', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const cves = await CVE.find()
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await CVE.countDocuments();
    
    res.json({
      cves,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cves/:id', async (req, res) => {
  try {
    const cve = await CVE.findOne({ id: req.params.id });
    if (!cve) {
      return res.status(404).json({ error: 'CVE not found' });
    }
    res.json(cve);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  syncCVEs();
});
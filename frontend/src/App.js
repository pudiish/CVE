import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const CVEList = () => {
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCVEs();
  }, [page, resultsPerPage]);

  const fetchCVEs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/cves', {
        params: {
          page,
          limit: resultsPerPage,
        },
      });
      setCves(response.data.cves);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching CVEs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (cveId) => {
    navigate(`/cves/${cveId}`);
  };

  return (
    <div className="container">
      <h1>CVE LIST</h1>

      <div className="text-gray-600 text-sm">
        <span>Total Records: {total}</span>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>IDENTIFIER</th>
              <th>PUBLISHED DATE</th>
              <th>LAST MODIFIED DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">Loading...</td>
              </tr>
            ) : (
              cves.map((cve) => (
                <tr key={cve.id} onClick={() => handleRowClick(cve.id)}>
                  <td>{cve.id}</td>
                  <td>cve@mitre.org</td>
                  <td>{new Date(cve.published).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(cve.lastModified).toLocaleDateString('en-GB')}</td>
                  <td>{cve.vulnStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-buttons">
        <div className="select-results">
          <span>Results per page:</span>
          <select
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div>
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            ⟪
          </button>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            ⟨
          </button>
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? 'selected' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => prev + 1)}
          >
            ⟩
          </button>
          <button
            onClick={() => setPage(Math.ceil(total / resultsPerPage))}
          >
            ⟫
          </button>
        </div>
      </div>
    </div>
  );
};

const CVEDetail = () => {
  const [cve, setCve] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    fetchCVEDetail();
  }, [params.id]);

  const fetchCVEDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/cves/${params.id}`);
      setCve(response.data);
    } catch (error) {
      console.error('Error fetching CVE detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!cve) return <div className="text-center">CVE not found</div>;

  return (
    <div className="container">
      <h1>{cve.id}</h1>

      <div>
        <section>
          <h2>Description</h2>
          <p>{cve.descriptions?.find((d) => d.lang === 'en')?.value || 'No description available'}</p>
        </section>

        <section>
          <h2>CVSS V2 Metrics</h2>
          <p><strong>Severity:</strong> {cve.metrics?.cvssMetricV2?.cvssData?.severity || 'LOW'}</p>
          <p><strong>Score:</strong> {cve.metrics?.cvssMetricV2?.cvssData?.baseScore || '2.1'}</p>
          <p><strong>Vector String:</strong> {cve.metrics?.cvssMetricV2?.cvssData?.vectorString || 'N/A'}</p>

          <table>
            <thead>
              <tr>
                <th>Access Vector</th>
                <th>Access Complexity</th>
                <th>Authentication</th>
                <th>Confidentiality Impact</th>
                <th>Integrity Impact</th>
                <th>Availability Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LOCAL</td>
                <td>LOW</td>
                <td>NONE</td>
                <td>COMPLETE</td>
                <td>COMPLETE</td>
                <td>COMPLETE</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Scores</h2>
          <p><strong>Exploitability Score:</strong> 3.9</p>
          <p><strong>Impact Score:</strong> 10</p>
        </section>

        <section>
          <h2>CPE</h2>
          <table>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Match Criteria ID</th>
                <th>Vulnerable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>cpe:2.3:o:sun:solaris:*:*:*:*:*:*:*:*</td>
                <td>FEEC0C5A-A46E-453C-B604-D1EC8B0FE2A8</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cves/list" />} />
        <Route path="/cves/list" element={<CVEList />} />
        <Route path="/cves/:id" element={<CVEDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

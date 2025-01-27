import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CVEList.css';

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

  const totalPages = Math.ceil(total / resultsPerPage);

  return (
    <div className="container">
      <h1>CVE List</h1>

      <div className="text-gray-600 text-sm">
        <span>Total Records: {total}</span>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Identifier</th>
              <th>Published Date</th>
              <th>Last Modified Date</th>
              <th>Status</th>
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
                  <td>{cve.sourceIdentifier}</td>
                  <td>{new Date(cve.published).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(cve.lastModified).toLocaleDateString('en-GB')}</td>
                  <td>{cve.vulnStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Next</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
      </div>

      <div className="results-per-page">
        <label>Results per page:</label>
        <select
          value={resultsPerPage}
          onChange={(e) => setResultsPerPage(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};

export default CVEList;

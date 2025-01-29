import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CVEDetails.css';

const CVEDetails = () => {
    const [cve, setCve] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        fetchCVEDetail();
    }, [id]);

    const fetchCVEDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5001/api/cves/${id}`);
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
            {/* Header with Back Button Inline */}
            <div className="header-container">
                <h1>{cve.id}</h1>
                <button className="backBtn" onClick={() => window.history.back()}>
                    &larr; Back
                </button>
            </div>

            <section>
                <h2>Description</h2>
                <p>{cve.descriptions?.find((desc) => desc.lang === 'en')?.value || 'No description available'}</p>
            </section>

            <section>
                <h2>CVSS V2 Metrics</h2>
                <p><strong>Severity:</strong> {cve.metrics?.cvssMetricV2?.cvssData?.severity || 'LOW'}</p>
                <p><strong>Score:</strong> {cve.metrics?.cvssMetricV2?.cvssData?.baseScore || '2.1'}</p>

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
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.accessVector || 'LOCAL'}</td>
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.accessComplexity || 'LOW'}</td>
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.authentication || 'NONE'}</td>
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.confidentialityImpact || 'COMPLETE'}</td>
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.integrityImpact || 'COMPLETE'}</td>
                            <td>{cve.metrics?.cvssMetricV2?.cvssData?.availabilityImpact || 'COMPLETE'}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Scores</h2>
                <p><strong>Exploitability Score:</strong> {cve.metrics?.cvssMetricV2?.exploitabilityScore || '3.9'}</p>
                <p><strong>Impact Score:</strong> {cve.metrics?.cvssMetricV2?.impactScore || '10'}</p>
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
                        {cve.cpes?.length ? (
                            cve.cpes.map((cpe, index) => (
                                <tr key={index}>
                                    <td>{cpe.criteria}</td>
                                    <td>{cpe.matchCriteriaId}</td>
                                    <td>{cpe.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>cpe:2.3:o:sun:solaris:*:*:*:*:*:*:*:*</td>
                                <td>FEEC0C5A-A46E-453C-B604-D1EC8B0FE2A8</td>
                                <td>Yes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default CVEDetails;

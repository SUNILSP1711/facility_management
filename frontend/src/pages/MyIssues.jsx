import React, { useState, useEffect } from 'react';
import { issueService, facilityService } from '../services/api';
import '../styles/MyIssues.css';

export const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [facilitiesMap, setFacilitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const [issuesRes, facilitiesRes] = await Promise.all([
        issueService.getMyIssues(),
        facilityService.getAllFacilities(),
      ]);
      setIssues(issuesRes.data);

      const map = {};
      facilitiesRes.data.forEach((f) => {
        map[f.id] = f.name;
      });
      setFacilitiesMap(map);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
      setError('Failed to fetch your reported issues details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading your reported issues...</div>;

  return (
    <div className="my-issues-container">
      <div className="page-header">
        <h1>My Reported Issues</h1>
        <p className="subtitle">Track statuses of issues you have reported</p>
      </div>

      {error && <div className="error-message card error-alert">{error}</div>}

      <div className="table-responsive card glass">
        {issues.length === 0 ? (
          <div className="no-data text-center">
            <p>You have not reported any issues yet.</p>
          </div>
        ) : (
          <table className="issues-table">
            <thead>
              <tr>
                <th>Space</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <strong>{facilitiesMap[issue.facilityId] || issue.facilityId}</strong>
                    <span className="subtext-id">{issue.facilityId}</span>
                  </td>
                  <td>{issue.description}</td>
                  <td>
                    <span className={`badge severity-${issue.severity.toLowerCase()}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge status-${issue.status.toLowerCase()}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { issueService, facilityService } from '../services/api';
import '../styles/Issues.css';

export const IssuesManagement = () => {
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
        issueService.getAllIssues(),
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
      setError('Failed to fetch issues and facilities.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setError('');
    try {
      await issueService.updateIssueStatus(id, status);
      fetchIssues();
    } catch (err) {
      console.error('Failed to update issue status:', err);
      setError('Failed to update issue status.');
    }
  };

  if (loading) return <div className="loading-state">Loading reported issues...</div>;

  return (
    <div className="issues-container">
      <div className="page-header">
        <h1>Issues Management</h1>
      </div>

      {error && <div className="error-message card error-alert">{error}</div>}

      <div className="table-responsive card glass">
        <table className="issues-table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Reported By</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <strong>{facilitiesMap[issue.facilityId] || issue.facilityId}</strong>
                  <span className="subtext-id">{issue.facilityId}</span>
                </td>
                <td>{issue.reportedBy}</td>
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
                <td>
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    className="status-select"
                    style={{ margin: 0, padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No reported issues found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

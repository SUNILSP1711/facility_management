import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueService, facilityService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/ReportIssue.css';

export const ReportIssue = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    facilityId: '',
    description: '',
    severity: 'MEDIUM',
  });

  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await facilityService.getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await issueService.reportIssue(formData);
      navigate('/staff/my-issues');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to report issue');
    }
  };

  return (
    <div className="report-issue-container">
      <div className="page-header">
        <h1>Report an Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="issue-form card glass">
        <div className="form-group">
          <label>Facility Space</label>
          <select
            value={formData.facilityId}
            onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
            required
          >
            <option value="">Select a facility</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Please detail the issue (e.g. Broken AC unit, projector lamp burned out)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Severity Level</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-primary">
          Submit Report
        </button>
      </form>
    </div>
  );
};

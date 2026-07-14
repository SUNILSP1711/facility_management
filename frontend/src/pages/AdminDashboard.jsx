import React, { useState, useEffect } from 'react';
import { facilityService, bookingService, issueService } from '../services/api';
import '../styles/Dashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFacilities: 0,
    totalBookings: 0,
    openIssues: 0,
  });
  const [utilization, setUtilization] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [facilitiesRes, bookingsRes, issuesRes] = await Promise.all([
        facilityService.getAllFacilities(),
        bookingService.getAllBookings(),
        issueService.getOpenIssues(),
      ]);

      const totalFacilities = facilitiesRes.data.length;
      const totalBookings = bookingsRes.data.length;
      const openIssues = issuesRes.data.length;

      setStats({
        totalFacilities,
        totalBookings,
        openIssues,
      });

      // Compute bookings per facility
      const computedUtilization = facilitiesRes.data.map((facility) => {
        const count = bookingsRes.data.filter((b) => b.facilityId === facility.id).length;
        return {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          count,
        };
      }).sort((a, b) => b.count - a.count);

      setUtilization(computedUtilization);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading dashboard analytics...</div>;

  const maxBookings = utilization.length > 0 ? Math.max(...utilization.map((u) => u.count), 1) : 1;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Admin Analytics Dashboard</h1>
        <p className="subtitle">Real-time facility utilization and service desk metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card glass">
          <div className="stat-icon-wrapper blue">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h20v-2H2v2zm14-12v7h3v-7h-3zm-4.5-6.5L2 9v1h20V9l-9.5-5.5z" fill="currentColor"/></svg>
          </div>
          <div className="stat-data">
            <h3>Total Facilities</h3>
            <p className="stat-value">{stats.totalFacilities}</p>
          </div>
        </div>

        <div className="stat-card card glass">
          <div className="stat-icon-wrapper green">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/></svg>
          </div>
          <div className="stat-data">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="stat-card card glass">
          <div className="stat-icon-wrapper orange">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
          </div>
          <div className="stat-data">
            <h3>Open Issues</h3>
            <p className="stat-value">{stats.openIssues}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-details-grid">
        <div className="utilization-section card glass">
          <h2>Facility Utilization (Bookings count)</h2>
          <div className="utilization-list">
            {utilization.map((item) => {
              const percentage = (item.count / maxBookings) * 100;
              return (
                <div key={item.id} className="utilization-item">
                  <div className="utilization-item-info">
                    <span className="facility-name">{item.name}</span>
                    <span className="facility-count">{item.count} bookings</span>
                  </div>
                  <div className="utilization-bar-bg">
                    <div
                      className={`utilization-bar-fill type-${item.type.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {utilization.length === 0 && (
              <p className="text-center no-data">No facility utilization data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

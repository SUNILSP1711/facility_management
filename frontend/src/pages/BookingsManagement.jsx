import React, { useState, useEffect } from 'react';
import { bookingService, facilityService } from '../services/api';
import { formatDateForDisplay, formatTimeForDisplay } from '../services/dateUtils';
import '../styles/Bookings.css';

export const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [facilitiesMap, setFacilitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const [bookingsRes, facilitiesRes] = await Promise.all([
        bookingService.getAllBookings(),
        facilityService.getAllFacilities(),
      ]);
      setBookings(bookingsRes.data);
      
      const map = {};
      facilitiesRes.data.forEach((f) => {
        map[f.id] = f.name;
      });
      setFacilitiesMap(map);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to fetch bookings and facilities details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setError('');
    try {
      await bookingService.approveBooking(id);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking. The slot might be already booked.');
    }
  };

  const handleReject = async (id) => {
    setError('');
    try {
      await bookingService.rejectBooking(id);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking.');
    }
  };

  if (loading) return <div className="loading-state">Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <div className="page-header">
        <h1>Bookings Management</h1>
      </div>

      {error && (
        <div className="error-message card error-alert">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="table-responsive card">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Booked By</th>
              <th>Purpose</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <strong>{facilitiesMap[booking.facilityId] || booking.facilityId}</strong>
                  <span className="subtext-id">{booking.facilityId}</span>
                </td>
                <td>{booking.bookedBy}</td>
                <td>{booking.purpose}</td>
                <td>{formatDateForDisplay(booking.date)}</td>
                <td>{formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}</td>
                <td>
                  <span className={`badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="btn-danger"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

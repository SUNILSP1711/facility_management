import React, { useState, useEffect } from 'react';
import { bookingService, facilityService } from '../services/api';
import { formatDateForDisplay, formatTimeForDisplay } from '../services/dateUtils';
import '../styles/MyBookings.css';

export const MyBookings = () => {
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
        bookingService.getMyBookings(),
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
      setError('Failed to fetch your bookings history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setError('');
      try {
        await bookingService.cancelBooking(id);
        fetchBookings();
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        setError(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  if (loading) return <div className="loading-state">Loading your bookings...</div>;

  return (
    <div className="my-bookings-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p className="subtitle">View and manage your space reservation history</p>
      </div>

      {error && <div className="error-message card error-alert">{error}</div>}

      <div className="table-responsive card">
        {bookings.length === 0 ? (
          <div className="no-data text-center">
            <p>You have not made any booking requests yet.</p>
          </div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Space</th>
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
                  <td>{booking.purpose}</td>
                  <td>{formatDateForDisplay(booking.date)}</td>
                  <td>{formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}</td>
                  <td>
                    <span className={`badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="btn-danger"
                      >
                        Cancel
                      </button>
                    )}
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

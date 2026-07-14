import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingService, facilityService } from '../services/api';
import { isoToApiDate } from '../services/dateUtils';
import { AuthContext } from '../context/AuthContext';
import '../styles/BookingForm.css';

export const BookingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const facilityId = searchParams.get('facilityId');

  const [formData, setFormData] = useState({
    facilityId: facilityId || '',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [facilities, setFacilities] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Clear checked availability state if booking details change
  useEffect(() => {
    setAvailability(null);
    setError('');
  }, [formData.facilityId, formData.date, formData.startTime, formData.endTime]);

  const fetchFacilities = async () => {
    try {
      const response = await facilityService.getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  const checkAvailability = async () => {
    if (!formData.facilityId || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill all fields');
      return;
    }

    setChecking(true);
    try {
      // checkAvailability uses @RequestParam which expects ISO date format
      const response = await facilityService.checkAvailability(
        formData.facilityId,
        formData.date,
        formData.startTime.substring(0, 5),
        formData.endTime.substring(0, 5)
      );
      setAvailability(response.data);
      setError('');
    } catch (error) {
      setError('Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!availability?.available) {
      setError('Please check availability first');
      return;
    }

    try {
      // Convert date from ISO (yyyy-MM-dd) to dd/MM/yyyy for the JSON body
      const bookingData = {
        ...formData,
        date: isoToApiDate(formData.date),
        startTime: formData.startTime.substring(0, 5),
        endTime: formData.endTime.substring(0, 5),
      };
      await bookingService.createBooking(bookingData);
      navigate('/staff/my-bookings');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    }
  };

  return (
    <div className="booking-form-container">
      <div className="page-header">
        <h1>Request Booking</h1>
      </div>

      <form onSubmit={handleSubmit} className="booking-form card">
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
                {f.name} - {f.type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Purpose / Event Description</label>
          <input
            type="text"
            placeholder="e.g. Midterm Exams, Guest Lecture"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>

        <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={checkAvailability}
            disabled={checking}
            className="btn-secondary btn-block"
          >
            {checking ? 'Checking availability...' : 'Check Slot Availability'}
          </button>

          {availability && (
            <div className={`availability-message ${availability.available ? 'success-message' : 'error-message'}`} style={{ marginBottom: 0 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                {availability.available ? (
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                ) : (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                )}
              </svg>
              <span>{availability.message}</span>
            </div>
          )}

          {error && <div className="error-message" style={{ marginBottom: 0 }}>{error}</div>}

          <button type="submit" className="btn-primary btn-block" disabled={!availability?.available}>
            Request Booking
          </button>
        </div>
      </form>
    </div>
  );
};

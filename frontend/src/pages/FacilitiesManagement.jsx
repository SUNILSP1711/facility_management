import React, { useState, useEffect } from 'react';
import { facilityService } from '../services/api';
import '../styles/Facilities.css';
import '../styles/StaffFacilities.css';

export const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SEMINAR_HALL',
    location: '',
    capacity: '',
    status: 'AVAILABLE',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
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
      setError('Failed to load facilities.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      type: facility.type,
      location: facility.location,
      capacity: facility.capacity.toString(),
      status: facility.status,
      imageUrl: facility.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingFacility(null);
    setFormData({ name: '', type: 'SEMINAR_HALL', location: '', capacity: '', status: 'AVAILABLE', imageUrl: '' });
    setShowForm(false);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
      };
      
      if (editingFacility) {
        await facilityService.updateFacility(editingFacility.id, payload);
      } else {
        await facilityService.createFacility({
          ...payload,
          status: 'AVAILABLE', // default status
        });
      }
      handleCancel();
      fetchFacilities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save facility');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility? This may affect associated bookings.')) {
      try {
        await facilityService.deleteFacility(id);
        fetchFacilities();
      } catch (err) {
        console.error('Failed to delete facility:', err);
        alert('Failed to delete facility. It may have active dependencies.');
      }
    }
  };

  if (loading) return <div className="loading-state">Loading facilities...</div>;

  return (
    <div className="facilities-container">
      <div className="page-header">
        <h1>Facilities Management</h1>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Facility'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="facility-form card glass">
          <h2>{editingFacility ? 'Edit Facility' : 'Create Facility'}</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Facility Name</label>
              <input
                type="text"
                placeholder="e.g. Science Lab A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Facility Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="SEMINAR_HALL">Seminar Hall</option>
                <option value="LAB">Lab</option>
                <option value="AUDITORIUM">Auditorium</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. Block C, 3rd Floor"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Facility Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {formData.imageUrl && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            {editingFacility && (
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                </select>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-success">
              {editingFacility ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="facilities-grid">
        {facilities.map((facility) => (
          <div key={facility.id} className="facility-card card glass">
            <div className="facility-card-header">
              <h3>{facility.name}</h3>
              <span className={`badge type-${facility.type.toLowerCase()}`}>
                {facility.type.replace('_', ' ')}
              </span>
            </div>
            {facility.imageUrl && (
              <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            )}
            <div className="facility-card-body">
              <p>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>{facility.location}</span>
              </p>
              <p>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                <span>Capacity: {facility.capacity}</span>
              </p>
              <p>
                <span className={`badge status-${facility.status.toLowerCase()}`}>
                  {facility.status.replace('_', ' ')}
                </span>
              </p>
            </div>
            <div className="facility-card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => handleEditClick(facility)}
                className="btn-edit btn-block"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Edit"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(facility.id)}
                className="btn-danger-icon btn-block"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Delete"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                Delete
              </button>
            </div>
          </div>
        ))}
        {facilities.length === 0 && (
          <div className="no-data-card card glass col-span-full" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No facilities found. Click "Add Facility" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

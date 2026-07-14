import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilityService } from '../services/api';
import '../styles/StaffFacilities.css';

export const StaffFacilities = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [facilities, filters]);

  const fetchFacilities = async () => {
    try {
      const response = await facilityService.getAvailableFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = facilities;

    if (filters.type) {
      filtered = filtered.filter((f) => f.type === filters.type);
    }

    if (filters.minCapacity) {
      filtered = filtered.filter((f) => f.capacity >= parseInt(filters.minCapacity));
    }

    setFilteredFacilities(filtered);
  };

  const handleBookClick = (facilityId) => {
    navigate(`/staff/booking?facilityId=${facilityId}`);
  };

  if (loading) return <div className="loading-state">Loading facilities...</div>;

  return (
    <div className="staff-facilities">
      <div className="page-header">
        <h1>Browse Facilities</h1>
        <p className="subtitle">Find and request bookings for campus spaces</p>
      </div>

      <div className="filters card glass">
        <div className="filter-group">
          <label>Space Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="SEMINAR_HALL">Seminar Hall</option>
            <option value="LAB">Lab</option>
            <option value="AUDITORIUM">Auditorium</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Capacity</label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={filters.minCapacity}
            onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
          />
        </div>
      </div>

      <div className="facilities-grid">
        {filteredFacilities.map((facility) => (
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
            </div>
            <div className="facility-card-actions">
              <button
                onClick={() => handleBookClick(facility.id)}
                className="btn-primary btn-block"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
        {filteredFacilities.length === 0 && (
          <div className="no-data-card card glass col-span-full">
            <p>No available spaces match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

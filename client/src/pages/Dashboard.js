import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    console.log('Registrations state updated:', registrations);
    console.log('Registrations length:', registrations.length);
  }, [registrations]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://course-register-cx0t.onrender.com/api/registrations');
      console.log('API Response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Is array:', Array.isArray(response.data));
      setRegistrations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching registrations');
      setLoading(false);
      console.error('Error:', err);
      console.error('Error response:', err.response);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await axios.delete(`https://course-register-cx0t.onrender.com/api/registrations/${id}`);
        setRegistrations(registrations.filter(reg => reg._id !== id));
      } catch (err) {
        console.error('Error deleting registration:', err);
        alert('Error deleting registration');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Registered Users Dashboard</h2>
          <button className="refresh-btn" onClick={fetchRegistrations}>
            Refresh
          </button>
        </div>

        {registrations.length === 0 ? (
          <div className="no-data">
            <p>No registrations found yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Qualification</th>
                  <th>Year of Passing</th>
                  <th>Message</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td>{registration.firstName} {registration.lastName}</td>
                    <td>{registration.email}</td>
                    <td>{registration.phoneNumber}</td>
                    <td>{registration.highestQualification}</td>
                    <td>{registration.yearOfPassing}</td>
                    <td>{registration.message || '-'}</td>
                    <td>{new Date(registration.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(registration._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

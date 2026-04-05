import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-success mb-4">Welcome, {user?.name}!</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-success h-100">
            <div className="card-body">
              <h5 className="card-title">Report an Issue</h5>
              <p className="card-text">Found water leakage, energy misuse, or waste overflow? Report it to help our campus become more sustainable.</p>
              <Link to="/report" className="btn btn-success">Report Issue</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-success h-100">
            <div className="card-body">
              <h5 className="card-title">Track Your Reports</h5>
              <p className="card-text">View the status of issues you've reported. Stay updated on pending, in progress, and resolved items.</p>
              <Link to="/my-issues" className="btn btn-success">My Issues</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-light rounded">
        <h5>🌿 Sustainability Tips</h5>
        <ul className="mb-0">
          <li>Report issues promptly to prevent resource waste</li>
          <li>Turn off lights and AC when leaving rooms</li>
          <li>Use recycling bins and reduce single-use plastic</li>
        </ul>
      </div>
    </div>
  );
}

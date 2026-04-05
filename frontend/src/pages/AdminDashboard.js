import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Solved'];
const STATUS_BADGE = {
  Pending: 'bg-warning text-dark',
  'In Progress': 'bg-info',
  Solved: 'bg-success'
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState({ status: '', issueType: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadIssues = async () => {
    try {
      const res = await adminAPI.issues(filter);
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch {
      setIssues([]);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await adminAPI.analytics();
      const data = await res.json();
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadIssues().then(() => setLoading(false));
  }, [filter.status, filter.issueType]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await adminAPI.updateIssue(id, { status });
      loadIssues();
      loadAnalytics();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h2 className="text-success mb-4">Admin Dashboard</h2>

      {/* Analytics Summary */}
      {analytics && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h6>Total Issues</h6>
                <h3>{analytics.total}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <h6>Pending</h6>
                <h3>{analytics.byStatus?.Pending || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h6>In Progress</h6>
                <h3>{analytics.byStatus?.['In Progress'] || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h6>Solved Rate</h6>
                <h3>{analytics.solvedRate}%</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {analytics?.topLocations?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">Top Problem Areas</div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {analytics.topLocations.map((l, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{l.location}</span>
                  <span className="badge bg-secondary">{l.count} issues</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={filter.issueType}
          onChange={e => setFilter(f => ({ ...f, issueType: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Energy Misuse">Energy Misuse</option>
          <option value="Waste Overflow">Waste Overflow</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-success">
            <tr>
              <th>Location</th>
              <th>Type</th>
              <th>Reporter</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(i => (
              <tr key={i._id}>
                <td>{i.location}</td>
                <td>{i.issueType}</td>
                <td>{i.reporterId?.name || i.reporterEmail || '-'}</td>
                <td><span className={`badge ${STATUS_BADGE[i.status] || 'bg-secondary'}`}>{i.status}</span></td>
                <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        className={`btn ${i.status === s ? 'btn-success' : 'btn-outline-secondary'}`}
                        disabled={updating === i._id}
                        onClick={() => handleStatusChange(i._id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {issues.length === 0 && <p className="text-muted">No issues found.</p>}
    </div>
  );
}

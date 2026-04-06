import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesAPI, parseJsonFromResponse } from '../api';

const STATUS_BADGE = {
  Pending: 'bg-warning text-dark',
  'In Progress': 'bg-info',
  Solved: 'bg-success'
};

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    issuesAPI.my()
      .then(async (res) => parseJsonFromResponse(res))
      .then(data => {
        if (Array.isArray(data)) setIssues(data);
        else setError(data.message || 'Failed to load');
      })
      .catch((err) => setError(err.message || 'Failed to load issues'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-5">Loading your issues...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="text-success mb-4">My Reported Issues</h2>
      {issues.length === 0 ? (
        <div className="alert alert-info">You haven't reported any issues yet. <Link to="/report">Report one now</Link>.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-success">
              <tr>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {issues.map(i => (
                <tr key={i._id}>
                  <td>{i.location}</td>
                  <td>{i.issueType}</td>
                  <td><span className={`badge ${STATUS_BADGE[i.status] || 'bg-secondary'}`}>{i.status}</span></td>
                  <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`/issue/${i._id}`} className="btn btn-sm btn-outline-success">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

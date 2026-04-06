import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issuesAPI, parseJsonFromResponse } from '../api';

const STATUS_BADGE = {
  Pending: 'bg-warning text-dark',
  'In Progress': 'bg-info',
  Solved: 'bg-success'
};

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    issuesAPI.get(id)
      .then(async (res) => parseJsonFromResponse(res))
      .then(data => {
        if (data._id) setIssue(data);
        else setError(data.message || 'Issue not found');
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error || !issue) return <div className="alert alert-danger">{error || 'Issue not found'}</div>;

  return (
    <div>
      <Link to="/my-issues" className="btn btn-outline-secondary mb-3">← Back to My Issues</Link>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Issue #{issue._id.slice(-6).toUpperCase()}</span>
          <span className={`badge ${STATUS_BADGE[issue.status] || 'bg-secondary'}`}>{issue.status}</span>
        </div>
        <div className="card-body">
          <p><strong>Location:</strong> {issue.location}</p>
          <p><strong>Type:</strong> {issue.issueType}</p>
          <p><strong>Description:</strong> {issue.description}</p>
          <p><strong>Reported:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          {issue.recommendation && (
            <div className="alert alert-success">
              <strong>Eco-friendly recommendation:</strong> {issue.recommendation}
            </div>
          )}
          {issue.adminNotes && (
            <div className="alert alert-info">
              <strong>Admin notes:</strong> {issue.adminNotes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

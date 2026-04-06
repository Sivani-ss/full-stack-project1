import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issuesAPI, parseJsonFromResponse } from '../api';

const ISSUE_TYPES = ['Water Leakage', 'Energy Misuse', 'Waste Overflow', 'Other'];

export default function ReportIssue() {
  const [location, setLocation] = useState('');
  const [issueType, setIssueType] = useState('Water Leakage');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);
    try {
      const res = await issuesAPI.create({ location, issueType, description });
      const data = await parseJsonFromResponse(res);
      if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Failed to report');
      setSuccess(data.message);
      if (data.recommendation) {
        setSuccess(prev => prev + '\n\nEco-friendly recommendation: ' + data.recommendation);
      }
      setLocation('');
      setIssueType('Water Leakage');
      setDescription('');
      setTimeout(() => navigate('/my-issues'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="text-success mb-4">Report Sustainability Issue</h2>
        <div className="card shadow">
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && (
              <div className="alert alert-success">
                {success.split('\n').map((line, i) => <p key={i} className="mb-0">{line}</p>)}
                <small>Redirecting to My Issues...</small>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Campus Location *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Main Block - Floor 2, Cafeteria, Hostel B"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Issue Type *</label>
                <select className="form-select" value={issueType} onChange={e => setIssueType(e.target.value)} required>
                  {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

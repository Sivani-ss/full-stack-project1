const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export const authAPI = {
  login: (email, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    }),
  register: (email, password, name) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name })
    })
};

export const issuesAPI = {
  create: (data) =>
    fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  my: () => fetch(`${API_BASE}/issues/my`, { headers: getHeaders() }),
  get: (id) => fetch(`${API_BASE}/issues/${id}`, { headers: getHeaders() })
};

export const adminAPI = {
  issues: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/issues${qs ? '?' + qs : ''}`, { headers: getHeaders() });
  },
  updateIssue: (id, data) =>
    fetch(`${API_BASE}/admin/issues/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  analytics: () => fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() })
};

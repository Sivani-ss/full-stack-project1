// Local dev: use package.json "proxy" with '/api'. Production: set REACT_APP_API_URL on Vercel (e.g. https://your-api.onrender.com, no trailing slash).
export const API_BASE = process.env.REACT_APP_API_URL
  ? `${String(process.env.REACT_APP_API_URL).replace(/\/$/, '')}/api`
  : '/api';

/** Use after fetch() — avoids "Unexpected end of JSON input" when the server returns HTML or an empty body. */
export async function parseJsonFromResponse(res) {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      `Empty response (HTTP ${res.status}). On Vercel: add Environment Variable REACT_APP_API_URL = your Render URL, then redeploy. Test Render: /api/health`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server did not return JSON (HTTP ${res.status}). Often the app calls the wrong host — set REACT_APP_API_URL and redeploy, or wake your Render service.`
    );
  }
}

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

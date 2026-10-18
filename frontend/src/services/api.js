const API_BASE = '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('atsense-token');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async register(data) {
    let res;
    try {
      res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw new Error('Cannot connect to backend server. Please ensure the server is online.');
    }

    let payload;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }

    if (!res.ok) {
      throw new Error(payload?.detail || payload?.error || 'Registration failed. Please check your details.');
    }
    return payload;
  },

  async login(data) {
    let res;
    try {
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw new Error('Cannot connect to backend server. Please ensure the server is online.');
    }

    let payload;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }

    if (!res.ok) {
      throw new Error(payload?.detail || payload?.error || 'Invalid email or password.');
    }
    return payload;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Resume Upload & Analysis
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  async analyzeResume(data) {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Analysis failed');
    }
    return res.json();
  },

  async improveResume(data) {
    const res = await fetch(`${API_BASE}/resume/improve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Improvement generation failed');
    }
    return res.json();
  },

  async generateResume(data) {
    const res = await fetch(`${API_BASE}/resume/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Resume generation failed');
    }
    return res.json();
  },

  async getSampleResumes() {
    const res = await fetch(`${API_BASE}/resume/samples`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Job Matching & Career Guidance
  async matchJob(data) {
    const res = await fetch(`${API_BASE}/job/match`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Job matching failed');
    }
    return res.json();
  },

  async getSampleJobs() {
    const res = await fetch(`${API_BASE}/job/samples`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Dashboard & History
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getUserResumes() {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getResumeById(id) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Resume not found');
    return res.json();
  },

  async deleteResume(id) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  async updateResume(id, data) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update resume');
    return res.json();
  },

  async saveResume(data) {
    if (data.id || data.resume_id) {
      const id = data.id || data.resume_id;
      return this.updateResume(id, data);
    }
    return this.generateResume(data);
  },

  async getAnalysisHistory() {
    const res = await fetch(`${API_BASE}/analysis/history`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getResumeVersionComparison(id) {
    const res = await fetch(`${API_BASE}/resumes/${id}/versions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Export PDF & DOCX
  async downloadPdf(content, template = 'classic', filename = 'Resume.pdf') {
    const res = await fetch(`${API_BASE}/resume/export/pdf`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, template, filename }),
    });
    if (!res.ok) throw new Error('Failed to generate PDF');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadDocx(content, template = 'classic', filename = 'Resume.docx') {
    const res = await fetch(`${API_BASE}/resume/export/docx`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, template, filename }),
    });
    if (!res.ok) throw new Error('Failed to generate DOCX');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};

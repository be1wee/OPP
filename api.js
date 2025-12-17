const API_BASE = 'http://localhost:8000/api';

const api = {
    async get(url) {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_BASE}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    async post(url, data) {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(`${API_BASE}${url}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    async put(url, data) {
        const token = localStorage.getItem('auth_token');
        const response = await axios.put(`${API_BASE}${url}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    async delete(url) {
        const token = localStorage.getItem('auth_token');
        const response = await axios.delete(`${API_BASE}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
};

window.api = api;
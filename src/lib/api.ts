"use client";

const BASE_URL = "http://localhost:3001";

export const api = {
    async request(endpoint: string, options: RequestInit = {}) {
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const isCallingAdminEndpoint = endpoint.startsWith('/admin');
        const tokenKey = (isAdminPath || isCallingAdminEndpoint) ? "admin_token" : "user_token";
        const token = localStorage.getItem(tokenKey);

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const text = await res.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            if (!res.ok) throw new Error(`Status ${res.status}: ${text.slice(0, 100)}`);
            data = { message: text };
        }

        if (!res.ok) {
            if (res.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/signup') && !endpoint.includes('/otp')) {
                localStorage.removeItem(tokenKey);
                const redirectPath = window.location.pathname.startsWith('/admin') ? "/admin/login" : "/signin";
                window.location.href = redirectPath;
            }
            if (res.status === 503) {
                const isAdminRequest = 
                    endpoint.includes('admin') || 
                    window.location.pathname.includes('/admin') ||
                    localStorage.getItem('admin_token');
                
                if (!isAdminRequest) {
                    window.location.href = "/maintenance";
                    return; // Stop execution
                }
            }
            throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
        }

        return data;
    },

    get(endpoint: string) {
        return this.request(endpoint, { method: "GET" });
    },

    post(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    patch(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    },

    delete(endpoint: string) {
        return this.request(endpoint, { method: "DELETE" });
    },
};

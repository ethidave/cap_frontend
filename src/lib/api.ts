"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = {
    async request(endpoint: string, options: RequestInit = {}) {
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem("admin_token") : null;
        const userToken = typeof window !== 'undefined' ? localStorage.getItem("user_token") : null;
        const token = adminToken || userToken;
        const tokenKey = adminToken ? "admin_token" : "user_token";

        const headers: HeadersInit = {
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
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
            if (res.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/signup') && !endpoint.includes('/otp') && !endpoint.includes('/mobile')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(tokenKey);
                    const redirectPath = window.location.pathname.startsWith('/admin') ? "/admin/login" : "/signin";
                    window.location.href = redirectPath;
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

    postMultipart(endpoint: string, formData: FormData) {
        return this.request(endpoint, {
            method: "POST",
            body: formData,
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

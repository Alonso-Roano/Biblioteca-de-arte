import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/authStore";
import endpoints from "./endpoints";

interface EndpointConfig {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
}

type Endpoints = Record<string, Record<string, EndpointConfig>>;

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_URL || "https://api.example.com",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});


let isRefreshing = false;
let pendingRequests: any[] = [];

apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const authStore = useAuthStore();

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    await authStore.refreshTokenAsync();

                    pendingRequests.forEach((callback) => callback());
                    pendingRequests = [];

                    originalRequest.headers["Authorization"] = `Bearer ${authStore.token}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    authStore.logout();
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            } else {
                return new Promise((resolve) => {
                    pendingRequests.push(() => {
                        originalRequest.headers["Authorization"] = `Bearer ${authStore.token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);



export const apiRequest = async <T>(
    key: string,
    params: Record<string, string | number> = {},
    data: any = null
): Promise<T> => {
    try {
        const endpointConfig: EndpointConfig | undefined = key
            .split(".")
            .reduce((acc: any, curr: string) => acc?.[curr], endpoints as Endpoints);

        if (!endpointConfig) {
            throw new Error(`Endpoint "${key}" no encontrado`);
        }

        let { method, url } = endpointConfig;

        Object.keys(params).forEach((param) => {
            if (url.includes(`{${param}}`)) {
                url = url.replace(`{${param}}`, String(params[param]));
                delete params[param];
            }
        });

        const config: AxiosRequestConfig = { method, url, data, params };

        const response: AxiosResponse<T> = await apiClient(config);
        return response.data;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};




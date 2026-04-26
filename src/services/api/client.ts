import ENV from "@/src/config";
import { useAppStore } from "@/src/store/appStore";
import { loadOrCreateDeviceId } from "../device/device.service";

/**
 * Generic request helper for all API calls.
 * Adds deviceId, locale, and token automatically from the store.
 * Handles network errors and API errors gracefully.
 */
async function request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options?: {
        headers?: Record<string, string>;
        body?: any;
    }
): Promise<T> {
    const state = useAppStore.getState();

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // add deviceId if available 
    if (state.deviceId) defaultHeaders["deviceId"] = state.deviceId;
    // If deviceId not in store → load or create it
    let deviceId = useAppStore.getState().deviceId;
    if (!deviceId) {
        console.log("📱 deviceId not found, generating...");
        deviceId = await loadOrCreateDeviceId();
        useAppStore.getState().setDeviceId(deviceId);
    }

    // Hug API uses Authorization: Bearer <token>
    if (state.token) defaultHeaders["Authorization"] = `Bearer ${state.token}`;

    // culture header
    if (state.locale) defaultHeaders["x-culture"] = 'state.locale.language';

    // Build request URL
    const url = `${ENV.api.baseUrl}${path}`;

    try {
        // Execute fetch
        const response = await fetch(url, {
            method,
            headers: {
                ...defaultHeaders,
                ...(options?.headers || {}),
            },
            // GET requests must never include a body
            body:
                method === "GET" || method === "DELETE"
                    ? undefined
                    : options?.body
                        ? JSON.stringify(options.body)
                        : undefined,
        });

        // Network failure (no internet, server unreachable, etc.)
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API_ERROR_${response.status}: ${text}`);
        }

        // Parse JSON safely
        try {
            return (await response.json()) as T;
        } catch {
            throw new Error("INVALID_JSON_RESPONSE");
        }
    } catch (err: any) {
        // Normalize network error
        if (err?.message === "Failed to fetch") {
            throw new Error("NETWORK_ERROR");
        }
        throw err;
    }
}

/**
 * Simple REST client that exposes GET and POST helpers.
 */
export const apiClient = {
    get: <T>(path: string, headers?: Record<string, string>) =>
        request<T>("GET", path, { headers }),

    post: <T>(path: string, body?: any, headers?: Record<string, string>) =>
        request<T>("POST", path, { body, headers }),
};

import ENV from "@/src/config";
import { useAppStore } from "@/src/store/appStore";

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

    // ✅ always send deviceId as header
    if (state.deviceId) {
        defaultHeaders["deviceid"] = state.deviceId;
    }

    // ✅ only send Bearer token if user manually logged in
    if (state.userToken) {
        defaultHeaders["Authorization"] = `Bearer ${state.userToken}`;
    }

    // ✅ always send fa-IR culture (server uses this to determine country)
    defaultHeaders["x-culture"] = state.locale?.language ?? "fa-IR";

    const url = `${ENV.api.baseUrl}${path}`;

    // console.log("🌐 URL:", url);
    // console.log("📋 Headers:", JSON.stringify(defaultHeaders));

    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...defaultHeaders,
                ...(options?.headers ?? {}),
            },
            body:
                method === "GET" || method === "DELETE"
                    ? undefined
                    : options?.body
                        ? JSON.stringify(options.body)
                        : undefined,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API_ERROR_${response.status}: ${text}`);
        }

        try {
            return (await response.json()) as T;
        } catch {
            throw new Error("INVALID_JSON_RESPONSE");
        }
    } catch (err: any) {
        if (err?.message === "Failed to fetch") {
            throw new Error("NETWORK_ERROR");
        }
        throw err;
    }
}

export const apiClient = {
    get: <T>(path: string, headers?: Record<string, string>) =>
        request<T>("GET", path, { headers }),

    post: <T>(path: string, body?: any, headers?: Record<string, string>) =>
        request<T>("POST", path, { body, headers }),
};
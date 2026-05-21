import { apiClient } from "./client"
import { endpoints } from "./endpoints"
import { FastRegisterResponse } from "./types"

export const authService = {
    fastRegister: (deviceId: string) =>
        apiClient.post<FastRegisterResponse>(
            endpoints.auth.fastRegister,
            undefined,
            {
                deviceid: deviceId,
                "x-culture": "fa-IR",
            }
        )
}
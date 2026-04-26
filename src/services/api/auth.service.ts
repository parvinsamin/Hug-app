import { apiPost } from "./client"
import { endpoints } from "./endpoints"
import { FastRegisterResponse } from "./types"

export async function fastRegister(deviceId: string) {
    return apiPost<FastRegisterResponse>(
        endpoints.auth.fastRegister,
        {
            headers: {
                deviceid: deviceId,
                "x-culture": "fa-IR",
            },
        }
    )
}

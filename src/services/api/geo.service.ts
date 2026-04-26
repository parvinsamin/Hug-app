import { apiClient } from "./client"
import { WhereAmIResponse } from "./types"



async function whereAmI(): Promise<WhereAmIResponse> {
    return apiClient.get<WhereAmIResponse>("/authentication/whereAmI")
}


export const geoService = {
    whereAmI,
}

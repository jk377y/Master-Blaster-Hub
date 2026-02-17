import { getToken } from "./auth";

// production API base URL (comment out for local development)
// const BASE_URL = "https://api.masterblasterhub.com/api";

// local development API base URL
const BASE_URL = "http://localhost:8080/api";

export async function fetchCurrentUser() {
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current user");
    }

    return response.json();
}

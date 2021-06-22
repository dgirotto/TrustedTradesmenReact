import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function getReviews(contractorId) {
    const headers = getHeaders();
    return axios.get(
        `${commonEndpoint}/review/read.php?contractorId=${contractorId}`,
        { headers }
    );
}

function getHeaders() {
    const token = CacheService.getCachedToken();
    return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
    };
}

export const ReviewService = {
    getReviews
};

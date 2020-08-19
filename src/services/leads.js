import axios, { AxiosPromise } from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.dev.apiUrl;

function getLeads() {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/lead/read.php`, { headers });
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

export const LeadsService = {
  getLeads
};

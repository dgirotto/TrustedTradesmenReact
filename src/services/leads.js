import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.dev.apiUrl;

function getLeads(pageNumber, itemsPerPage) {
  const headers = getHeaders();
  return axios.get(
    `${commonEndpoint}/lead/read.php?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`,
    { headers }
  );
}

function updateLead(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/lead/update.php`,
    body,
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

export const LeadsService = {
  getLeads,
  updateLead
};

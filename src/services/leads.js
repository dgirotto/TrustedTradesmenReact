import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function getLeads(pageNumber, itemsPerPage, sortDateDesc) {
  const headers = getHeaders();
  let endpoint = `${commonEndpoint}/lead/read.php?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`;

  if (sortDateDesc !== null) {
    if (sortDateDesc) {
      endpoint += `&sortDateDesc=1`;
    }
    else {
      endpoint += `&sortDateDesc=0`;
    }
  }

  return axios.get(
    endpoint,
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

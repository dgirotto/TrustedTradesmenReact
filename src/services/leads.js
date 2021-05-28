import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.prod.apiUrl;

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

function dismiss(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/lead/dismiss.php`,
    body,
    { headers }
  );
}

function claim(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/lead/claim.php`,
    body,
    { headers }
  );
}

function dismissClaimed(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/lead/dismiss_claimed.php`,
    body,
    { headers }
  );
}

function submitQuote(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/lead/submit_quote.php`,
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
  dismiss,
  claim,
  dismissClaimed,
  submitQuote
};

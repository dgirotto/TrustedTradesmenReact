import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.dev.apiUrl;

function getJobs() {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/job/read.php`, { headers });
}

function addJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/add.php`, body, { headers });
}

function updateJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/update.php`, body, { headers });
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

export const JobService = {
  getJobs,
  addJob,
  updateJob
};

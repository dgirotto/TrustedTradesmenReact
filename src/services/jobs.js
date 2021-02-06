import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function getJobs(pageNumber, itemsPerPage, sortDateDesc, addressFilterVal) {
  const headers = getHeaders();
  let endpoint = `${commonEndpoint}/job/read.php?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`;

  if (sortDateDesc !== null) {
    if (sortDateDesc) {
      endpoint += `&sortDateDesc=1`;
    }
    else {
      endpoint += `&sortDateDesc=0`;
    }
  }

  if (addressFilterVal !== "") {
    endpoint += `&address=${addressFilterVal}`;
  }

  return axios.get(
    endpoint,
    { headers }
  );
}

function addJob(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/job/add.php`,
    body,
    { headers }
  );
}

function updateJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/update.php`,
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

export const JobService = {
  getJobs,
  addJob,
  updateJob
};

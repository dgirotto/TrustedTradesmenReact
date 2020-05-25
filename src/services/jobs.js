import axios, { AxiosPromise } from "axios";
import { CacheService } from "./caching";

const commonEndpoint =
  "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function getJobs() {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/job/read.php`, { headers });
}

function addJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/add.php`, body, { headers });
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

export const JobsService = {
  getJobs,
  addJob
};

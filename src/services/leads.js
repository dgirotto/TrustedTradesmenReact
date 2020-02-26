import axios, { AxiosPromise } from "axios";
import { CacheService } from "./caching";

const commonEndpoint =
  "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

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

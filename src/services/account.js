import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.dev.apiUrl;

function getAccountDetails() {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/user/read_one.php`, { headers });
}

function setAccountDetails(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/user/update.php`, body, { headers });
}

function changePassword(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/user/change_pwd.php`, body, { headers });
}

function getContractorDetails(contractorId) {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/user/read_contractor.php?contractorId=${contractorId}`, { headers });
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

export const AccountService = {
  getAccountDetails,
  setAccountDetails,
  changePassword,
  getContractorDetails
};

import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function getServiceDetails(serviceId) {
  return axios.get(
    `${commonEndpoint}/service/read_one.php?serviceId=${serviceId}`
  );
}

function getServices() {
  var url = `${commonEndpoint}/service/read.php`;
  return axios.get(url);
}

function addService(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/service/add.php`,
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

export const ServicesService = {
  getServiceDetails,
  getServices,
  addService
};

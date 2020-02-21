import axios, { AxiosPromise } from "axios";
import { CacheService } from "./caching";

function getService() {
  const headers = getHeaders(serviceId);
  return axios.get(
    "http://dgirotto.a2hosted.com/api/service/read_one.php?serviceId=" +
      serviceId,
    { headers }
  );
}

function getServices() {
  const headers = getHeaders();

  return axios.get("http://dgirotto.a2hosted.com/api/service/read.php", {
    headers
  });
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: token
  };
}

export const ServicesService = {
  getService,
  getServices
};

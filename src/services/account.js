import axios, { AxiosPromise } from "axios";
import { CacheService } from "./caching";

const commonEndpoint =
  "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function getAccountDetails() {
  const headers = getHeaders();
  return axios.get(`${commonEndpoint}/user/read_one.php`, { headers });
}

function setAccountDetails(body) {
  const headers = getHeaders();
  // TODO: What happens if you pass "headers" instead of "{ headers }"?
  return axios.post(`${commonEndpoint}/user/update.php`, body, { headers });
}

function changePassword(body) {
  const headers = getHeaders();
  // TODO: What happens if you pass "headers" instead of "{ headers }"?
  return axios.post(`${commonEndpoint}/user/change_pwd.php`, body, { headers });
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
  changePassword
};

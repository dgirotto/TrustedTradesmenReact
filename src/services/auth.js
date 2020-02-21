import axios, { AxiosResponse } from "axios";
import { CacheService } from "./caching";

const commonEndpoint = "http://dgirotto.a2hosted.com/api";

function login(body) {
  return axios.post(`${commonEndpoint}/user/login`, body);
}

function createUser(body) {
  const token = "";
  const headers = setHeaders(token);
  return axios.post(`${commonEndpoint}/user/login`, body, {
    headers,
    withCredentials: true
  });
}

function isAuthenticated() {
  return CacheService.isExpired();
}

function changePassword(body) {
  const token = CacheService.getCachedToken();
  const headers = setHeaders(token);

  return axios.post(`${commonEndpoint}/user/login`, body, {
    headers,
    withCredentials: true
  });
}

function setHeaders(token) {
  return {
    "Content-Type": "application",
    Authorization: token
  };
}

function getAuthenticatedUser() {
  return CacheService.getCachedUser();
}

function logout() {
  CacheService.deleteCachedToken();
}

export const AuthService = {
  login,
  createUser,
  changePassword,
  isAuthenticated,
  getAuthenticatedUser,
  logout
};

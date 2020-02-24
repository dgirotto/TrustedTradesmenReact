import axios, { AxiosResponse } from "axios";
import { CacheService } from "./caching";

const commonEndpoint = "http://dgirotto.a2hosted.com/api";
// const commonEndpoint =
//   "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function login(body) {
  return axios.post(`${commonEndpoint}/user/login.php`, body);
}

function logout() {
  CacheService.deleteCachedToken();
}

function register(body) {
  return axios.post(`${commonEndpoint}/user/register.php`, body);
}

// function changePassword(body: ChangePasswordDTO): Promise<AxiosResponse> {
//   const token = CacheService.getCachedToken();
//   const headers = setHeaders(token);

//   return axios.post(`${commonEndpoint}/user/login.php`, body, {
//     headers,
//     withCredentials: true
//   });
// }

function isAuthenticated() {
  return CacheService.isExpired();
}

function getAuthenticatedUser() {
  return CacheService.getCachedUser();
}

function setHeaders(token) {
  return {
    "Content-Type": "application",
    Authorization: token
  };
}

export const AuthService = {
  login,
  logout,
  register,
  // changePassword,
  isAuthenticated,
  getAuthenticatedUser
};

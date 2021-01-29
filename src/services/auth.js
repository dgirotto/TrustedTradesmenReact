import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function login(body) {
  return axios.post(
    `${commonEndpoint}/user/login.php`,
    body
  );
}

function logout() {
  CacheService.deleteCachedToken();
}

function register(body, setHeader = false) {
  if (setHeader) {
    const headers = getHeaders();
    return axios.post(
      `${commonEndpoint}/user/register.php`,
      body,
      { headers }
    );
  }

  return axios.post(
    `${commonEndpoint}/user/register.php`,
    body
  );
}

function generateToken(body) {
  return axios.post(
    `${commonEndpoint}/user/generate_token.php`,
    body
  );
}

function resetPassword(body) {
  return axios.post(
    `${commonEndpoint}/user/reset_pwd.php`,
    body
  );
}

function getRole() {
  const user = getAuthenticatedUser();
  return user.data.accountType;
}

function isAuthenticated() {
  return !CacheService.isExpired();
}

function getAuthenticatedUser() {
  return CacheService.getCachedUser();
}

function getHeaders() {
  const token = CacheService.getCachedToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
}

export const AuthService = {
  login,
  logout,
  register,
  generateToken,
  resetPassword,
  getRole,
  isAuthenticated,
  getAuthenticatedUser
};

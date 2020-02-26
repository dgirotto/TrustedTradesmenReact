import { JwtHelper } from "./jwt-helper";

const TOKEN_STORE_ID = "jwt-token";

function cacheToken(token) {
  localStorage.setItem(TOKEN_STORE_ID, token);
}

function getCachedToken() {
  return localStorage.getItem("jwt-token");
}

function isExpired() {
  const token = getCachedToken();
  let expired = true;

  if (token) {
    const expTimeInMillis = JwtHelper.decodeToken(token)["exp"] * 1000;
    const currTimeinMillis = Date.now();

    if (expTimeInMillis >= currTimeinMillis) {
      expired = false;
    }
  }
  return expired;
}

function deleteCachedToken() {
  localStorage.removeItem(TOKEN_STORE_ID);
}

function getCachedUser() {
  const token = getCachedToken();
  const user = JwtHelper.decodeToken(token);
  return user;
}

export const CacheService = {
  cacheToken,
  getCachedToken,
  deleteCachedToken,
  isExpired,
  getCachedUser
};

import { JwtHelper } from "./jwt-helper";
import Cookies from "universal-cookie";

const TOKEN_COOKIE_ID = "api_token";
const cookie = new Cookies();

function cacheToken(token) {
  cookie.set(TOKEN_COOKIE_ID, token);
}

function getCachedToken() {
  return cookie.get(TOKEN_COOKIE_ID);
}

function isExpired() {
  const token = getCachedToken();
  let expired = false;

  if (token) {
    const expTimeInMillis = JwtHelper.decodeToken(token)["exp"] * 1000;
    const currTimeinMillis = Date.now();
    if (expTimeInMillis >= currTimeinMillis) {
      expired = true;
    }
  }

  return expired;
}

function deleteCachedToken() {
  cookie.remove(TOKEN_COOKIE_ID);
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

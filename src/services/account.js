import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.local.apiUrl;

function getAccountDetails() {
  const headers = getHeaders(true);

  return axios.get(
    `${commonEndpoint}/user/read_one.php`,
    { headers }
  );
}

function uploadProfilePicture(imageFile) {
  console.log('UPLOADING:');
  console.log(imageFile);

  const headers = getHeaders(false);
  var formData = new FormData();
  formData.append("image", imageFile);

  return axios.post(
    `${commonEndpoint}/user/upload_profile_picture.php`,
    formData,
    { headers }
  );
}

function setAccountDetails(body) {
  const headers = getHeaders(true);
  return axios.post(
    `${commonEndpoint}/user/update.php`,
    body,
    { headers }
  );
}

function changePassword(body) {
  const headers = getHeaders(true);

  return axios.post(
    `${commonEndpoint}/user/change_pwd.php`,
    body,
    { headers }
  );
}

function getContractorDetails(contractorId) {
  const headers = getHeaders(true);

  return axios.get(
    `${commonEndpoint}/user/read_contractor.php?contractorId=${contractorId}`,
    { headers }
  );
}

function getHeaders(isJson) {
  const token = CacheService.getCachedToken();

  var headers;

  if (isJson) {
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    };
  } else {
    // Multipart Form Data
    headers = {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token
    };
  }

  return headers;
}

export const AccountService = {
  getAccountDetails,
  uploadProfilePicture,
  setAccountDetails,
  changePassword,
  getContractorDetails
};

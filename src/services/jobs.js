import axios from "axios";
import { CacheService } from "./caching";
import { config } from "../config.js";

const commonEndpoint = config.prod.apiUrl;

function getJobs(pageNumber, itemsPerPage, sortDateDesc, addressFilterVal) {
  const headers = getHeaders();
  let endpoint = `${commonEndpoint}/job/read.php?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`;

  if (sortDateDesc !== null) {
    if (sortDateDesc) {
      endpoint += `&sortDateDesc=1`;
    }
    else {
      endpoint += `&sortDateDesc=0`;
    }
  }

  if (addressFilterVal !== "") {
    endpoint += `&address=${addressFilterVal}`;
  }

  return axios.get(
    endpoint,
    { headers }
  );
}

function addJob(body) {
  const headers = getHeaders();
  return axios.post(
    `${commonEndpoint}/job/add.php`,
    body,
    { headers }
  );
}

function abandonJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/abandon_job.php`,
    body,
    { headers }
  );
}

function addReview(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/add_review.php`,
    body,
    { headers }
  );
}

function claimInspection(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/claim_inspection.php`,
    body,
    { headers }
  );
}

function completeInspection(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/complete_inspection.php`,
    body,
    { headers }
  );
}

function completeJob(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/complete_job.php`,
    body,
    { headers }
  );
}

function completeRework(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/complete_rework.php`,
    body,
    { headers }
  );
}

function confirmContractorPayment(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/confirm_contractor_payment.php`,
    body,
    { headers }
  );
}

function confirmInvoicePayment(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/confirm_invoice_payment.php`,
    body,
    { headers }
  );
}

function giftLead(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/gift_lead.php`,
    body,
    { headers }
  );
}

function hireContractor(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/hire_contractor.php`,
    body,
    { headers }
  );
}

function fireContractor(body) {
  const headers = getHeaders();
  return axios.post(`${commonEndpoint}/job/fire_contractor.php`,
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

export const JobService = {
  getJobs,
  addJob,
  abandonJob,
  addReview,
  claimInspection,
  completeInspection,
  completeJob,
  completeRework,
  confirmContractorPayment,
  confirmInvoicePayment,
  giftLead,
  hireContractor,
  fireContractor
};

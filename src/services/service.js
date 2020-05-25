import axios, { AxiosPromise } from "axios";

const commonEndpoint = "http://dgirotto.a2hosted.com/api";
// const commonEndpoint =
//   "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function getServiceDetails(serviceId) {
  return axios.get(
    `${commonEndpoint}/service/read_one.php?serviceId=${serviceId}`
  );
}

function getServices() {
  return axios.get(`${commonEndpoint}/service/read.php`);
}

export const ServicesService = {
  getServiceDetails,
  getServices
};

import axios, { AxiosPromise } from "axios";

const commonEndpoint = "http://dgirotto.a2hosted.com/api";
// const commonEndpoint =
//   "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function getService() {
  return axios.get(
    `http://dgirotto.a2hosted.com/api/service/read_one.php?serviceId=${serviceId}`
  );
}

function getServices() {
  return axios.get(`${commonEndpoint}/service/read.php`);
}

export const ServicesService = {
  getService,
  getServices
};

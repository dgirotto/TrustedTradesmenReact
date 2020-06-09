import axios, { AxiosPromise } from "axios";

// const commonEndpoint = "http://dgirotto.a2hosted.com/api";
const commonEndpoint =
  "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api";

function getServiceDetails(serviceId) {
  return axios.get(
    `${commonEndpoint}/service/read_one.php?serviceId=${serviceId}`
  );
}

function getServices(readAll) {
  var url = `${commonEndpoint}/service/read.php`;
  if (readAll) {
    url += "?all=1";
  }
  return axios.get(url);
}

export const ServicesService = {
  getServiceDetails,
  getServices
};

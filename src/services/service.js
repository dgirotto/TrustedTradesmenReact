import axios, { AxiosPromise } from "axios";

function getService() {
  return axios.get(
    `http://dgirotto.a2hosted.com/api/service/read_one.php?serviceId=${serviceId}`
  );
}

function getServices() {
  return axios.get("http://dgirotto.a2hosted.com/api/service/read.php");
}

export const ServicesService = {
  getService,
  getServices
};

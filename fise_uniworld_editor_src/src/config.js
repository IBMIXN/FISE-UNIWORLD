import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://uniworld.azurewebsites.net/api",
  headers: {
    "Content-type": "application/json",
  },
});

const platformURL = "https://brianmin.tech/uniworld";

export { axiosConfig, platformURL };

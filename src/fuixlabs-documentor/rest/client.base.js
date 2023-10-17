import axios from "axios";

// * Need for connection cross domain
axios.defaults.withCredentials = true;

// * `headers` are custom headers to be sent
const REQUEST_CONFIG = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

//Create the base client from the rest of our app
const axiosClient = axios.create({
  headers: REQUEST_CONFIG,
});

/**
 * Define conditions when our call is unauthorized and make our application react appropriately
 * @return {Promise}
 */
axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;

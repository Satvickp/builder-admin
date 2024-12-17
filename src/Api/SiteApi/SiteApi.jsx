import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";

const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/site-masters`;

export const createSiteMaster = (data) =>
  axios.post(`${baseUrl}/create`, data, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });

export const updateSiteMaster = (id, data) =>
  axios.put(`${baseUrl}/update/${id}`, data, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });

// export const getSiteMaster = async (Id) => {
//   const resp = await axios.get(`${baseUrl}/all/${Id}`, {
//     headers: {
//       'Accept': '*/*',
//       'Content-Type': 'application/json',
//     },
//   });
//   console.log(resp.data);
//   return resp.data;
// };

export const getAllSiteMastersByState = (stateId, builderId) =>
  axios.get(`${baseUrl}/state/${stateId}/${builderId}`, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });

export const deleteSite = async (id) => {
  await axios.delete(`${baseUrl}/site/${id}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
};

// New Function to fetch site masters by builder ID with pagination and sorting
export const getAllSiteMasters = async (
  token,
  builderId,
  page = 0,
  pageSize = 10,
  sortBy = "createdTime",
  sortDirection = "desc"
) => {
  const response = await axios.get(`${baseUrl}/getAllSite/${builderId}`, {
    params: { page, pageSize, sortBy, sortDirection },
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.storagetoken,
    },
  });
  return response.data;
};

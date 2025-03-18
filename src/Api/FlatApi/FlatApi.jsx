import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";

const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/flat-masters`;

const token = window.localStorage.getItem("USER_TOKEN");
// console.log('token', token);

const getAuthHeaders = () => {
  return {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
};

export const createFlatMaster = async (flatData) => {
  const response = await axios.post(
    `${baseUrl}/create`,
    flatData,
    getAuthHeaders()
  );
  return response.data;
};

export const getFlatMasterById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getAuthHeaders());
  return response.data;
};

export const updateFlatMaster = async (id, flatData) => {
  const response = await axios.put(
    `${baseUrl}/update/${id}`,
    flatData,
    getAuthHeaders()
  );
  return response.data;
};

export const getFlatsBySiteAndState = async (
  siteId,
  stateId,
  builderId,
  page = 0,
  size = 10,
  sortBy = "createdTime",
  sortDirection = "desc"
) => {
  const response = await axios.get(
    `${baseUrl}/getAllFlatsBySiteIdAndStateId/${siteId}/${stateId}/${builderId}`,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      params: { page, size, sortBy, sortDirection },
    }
  );
  console.log(response);
  return response.data;
};

export const getAllFlats = async (
  builderId,
  page = 0,
  size = 10,
  sortBy = "createdTime",
  sortDirection = "desc"
) => {
  const response = await axios.get(`${baseUrl}/getAllFlats/${builderId}`, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, // Add token to headers
    },
    params: { page, size, sortBy, sortDirection },
  });
  return response.data;
};

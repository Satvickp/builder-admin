import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl";


const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/site-masters`;
const token = window.localStorage.getItem('USER_TOKEN')
console.log('token',token);

const getAuthHeaders = () => {
  return {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,  
    },
  };
};

export const createSiteMaster = (data) =>
  axios.post(`${baseUrl}/create`, data, getAuthHeaders());


export const updateSiteMaster = (id, data) =>
  axios.put(`${baseUrl}/update/${id}`, data, getAuthHeaders());

  export const getAllFlatAreaBySiteId = async (siteId) => {
    const response = await axios.get(`${baseUrl}/getAllFlatAreaBySiteId/${siteId}`,getAuthHeaders());
    console.log(response)
    return response.data;
  }

  export const getAllBlocksBySiteId = async (siteId) => {
    const response = await axios.get(`${baseUrl}/getAllBlocksBySiteId/${siteId}`,getAuthHeaders());
    console.log(response)
    return response.data;
  }



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
  axios.get(`${baseUrl}/state/${stateId}/${builderId}`, getAuthHeaders());


export const deleteSite = async (id) => {
  await axios.delete(`${baseUrl}/site/${id}`,getAuthHeaders());
};

// New Function to fetch site masters by builder ID with pagination and sorting
export const getAllSiteMasters = async (builderId,page = 0,pageSize = 10,sortBy = 'createdTime',sortDirection = 'desc') => {
  const response = await axios.get(
    `${baseUrl}/getAllSite/${builderId}`,
    {
      params: { page, pageSize, sortBy, sortDirection },
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    }
  );
  return response.data;
};

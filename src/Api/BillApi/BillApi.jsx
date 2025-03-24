// src/api/billApi.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/bills';

const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/bills`;
const token = window.localStorage.getItem("USER_TOKEN");
// console.log("token", token);
const getAuthHeaders = () => {
  return {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
};

export const createBillsWithFlatId = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl}/createWithFlatId`,
      data,
      getAuthHeaders()
    );
    console.log("logo", response);
    return response;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw error;
  }
};

export const createBillsInBulkWithoutFlatId = (data) =>
  axios.post(`${baseUrl}/createAllInBulkWithoutFlatId`, data, getAuthHeaders());

export const getBillById = (id) =>
  axios.get(`${baseUrl}/${id}`, getAuthHeaders());

export const getBillByFlatNo = (flatNo) =>
  axios.get(`${baseUrl}/flat/${flatNo}`, getAuthHeaders());

export const getBillByBillNo = (billNo) =>
  axios.get(`${baseUrl}/bill/${billNo}`, getAuthHeaders());

export const deleteBill = (id) =>
  axios.delete(`${baseUrl}/delete/${id}`, getAuthHeaders());

export const markBillAsPaid = (id) =>
  axios.put(`${baseUrl}/mark-paid/${id}`, {}, getAuthHeaders());

export const markBillAsUnpaid = (id) =>
  axios.put(`${baseUrl}/mark-unpaid/${id}`, {}, getAuthHeaders());

export const getPendingBillsBySiteId = (
  siteId,
  builderId,
  page = 0,
  size = 10,
  sortBy = "createdTime",
  sortDirection = "desc"
) =>
  axios.get(`${baseUrl}/getAllPendingBills/${siteId}/${builderId}`, {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
    },
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
export const getAllPaidBillsBySiteId = (siteId, builderId) =>
  axios.get(
    `${baseUrl}/getAllPaidBills/${siteId}/${builderId}`,
    getAuthHeaders()
  );

export const getAllBillsByServiceAndDocDate = (builderId, service, docDate) =>
  axios.get(`${baseUrl}/getAllBillsByServiceAndDocDate/${builderId}`, {
    params: {
      service,
      docDate,
    },
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

export const sendBillInBulk = async (bulkBillSendReqList) => {
  try {
    const response = await axios.post(
      `${baseUrl}/sendBillInBulk`,
      { bulkBillSendReqList },
      getAuthHeaders()
    );
    console.log("Bulk bills sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending bills in bulk:", error);
    throw error;
  }
};

// export const getAllBillsByServiceAndDocDate = (builderId, service, docDate) =>
//   axios.get(`${baseUrl}/getAllBillsByServiceAndDocDate/${builderId}`, {
//     params: {
//       service,
//       docDate,
//     },
//     headers: {
//       Accept: "*/*",
//       "Content-Type": "application/json",
//     },
//   });

export const getAllPaidOrUnPaidBillAmountByDate = async (data) => {
  const url = `${baseUrl}/getAllPaidOrUnPaidBillAmountByDate`;
  const resp = await axios({
    method: "POST",
    url: url,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.storagetoken,
    },
    data: data,
  });
  return resp.data;
};

export const getAllPaidOrUnpaidBillAmountByDateWithoutSiteId = async (data) => {
  const url = `${baseUrl}/getAllPaidOrUnPaidBillAmountByDateWithoutSiteId`;
  const resp = await axios({
    method: "POST",
    url: url,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return resp.data;
};

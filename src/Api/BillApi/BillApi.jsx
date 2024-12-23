// src/api/billApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl"

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/bills';

const baseUrl =  `${BASE_URL.DEV_URL}/bill-generator-service/bills`

// export const createBill = (data) =>
//   axios.post(`${baseUrl}/create`, data, {
//     headers: {
//       'Accept': '*/*',
//       'Content-Type': 'application/json',
//     },
//   });

export const createBillsWithFlatId = (data) =>
  axios.post(`${baseUrl}/createWithFlatId`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const createBillsInBulkWithoutFlatId = (data) =>
  axios.post(`${baseUrl}/createAllInBulkWithoutFlatId`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillById = (id) =>
  axios.get(`${baseUrl}/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillByFlatNo = (flatNo) =>
  axios.get(`${baseUrl}/flat/${flatNo}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillByBillNo = (billNo) =>
  axios.get(`${baseUrl}/bill/${billNo}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const deleteBill = (id) =>
  axios.delete(`${baseUrl}/delete/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const markBillAsPaid = (id) =>
  axios.put(`${baseUrl}/mark-paid/${id}`, {}, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const markBillAsUnpaid = (id) =>
  axios.put(`${baseUrl}/mark-unpaid/${id}`, {}, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

  export const getPendingBillsBySiteId = (siteId, builderId, page = 0, size = 10, sortBy = 'createdTime', sortDirection = 'desc') =>
    axios.get(`${baseUrl}/getAllPendingBills/${siteId}/${builderId}`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    });
export const getAllPaidBillsBySiteId = (siteId,builderId) =>
  axios.get(`${baseUrl}/getAllPaidBills/${siteId}/${builderId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });


  export const getAllBillsByServiceAndDocDate = (builderId, service, docDate) =>
    axios.get(`${baseUrl}/getAllBillsByServiceAndDocDate/${builderId}`, {
      params: {
        service,
        docDate,
      },
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    });

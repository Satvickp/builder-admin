// src/api/billApi.js
import axios from 'axios';

const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/bills';

export const createBill = (data) =>
  axios.post(`${BASE_URL}/create`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillById = (id) =>
  axios.get(`${BASE_URL}/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillByFlatNo = (flatNo) =>
  axios.get(`${BASE_URL}/flat/${flatNo}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getBillByBillNo = (billNo) =>
  axios.get(`${BASE_URL}/bill/${billNo}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const deleteBill = (id) =>
  axios.delete(`${BASE_URL}/delete/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const markBillAsPaid = (id) =>
  axios.put(`${BASE_URL}/mark-paid/${id}`, {}, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const markBillAsUnpaid = (id) =>
  axios.put(`${BASE_URL}/mark-unpaid/${id}`, {}, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getPendingBillsBySiteId = (siteId) =>
  axios.get(`${BASE_URL}/getAllPendingBills/${siteId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getAllPaidBillsBySiteId = (siteId) =>
  axios.get(`${BASE_URL}/getAllPaidBills/${siteId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

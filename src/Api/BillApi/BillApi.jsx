// src/api/billApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl"

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/bills';

const baseUrl =  `${BASE_URL.DEV_URL}/bill-generator-service/bills`

export const createBill = (data) =>
  axios.post(`${baseUrl}/create`, data, {
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

export const getPendingBillsBySiteId = (siteId) =>
  axios.get(`${baseUrl}/getAllPendingBills/${siteId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getAllPaidBillsBySiteId = (siteId) =>
  axios.get(`${baseUrl}/getAllPaidBills/${siteId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

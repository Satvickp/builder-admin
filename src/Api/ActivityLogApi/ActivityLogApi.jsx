import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/activity-logs`;

export const activityLogs = async (token, id) => {
  const url = `${baseUrl}/${id}`;
  const resp = await axios({
    method: "GET",
    url: url,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
};

export const getAllLogs = async (
  token,
  page,
  size,
  sortOrder,
  sortColumn,
  builderId,
  startDate,
  endDate
) => {
  const url = `${baseUrl}/getAllLogs`;
  const data = {
    page: page,
    size: size,
    sortOrder: sortOrder,
    sortColumn: sortColumn,
    builderId: builderId,
    startDate: startDate,
    endDate: endDate,
  };
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

export const getAllLogsForBills = async (
  token,
  page,
  size,
  sortOrder,
  sortColumn,
  builderId,
  startDate,
  endDate
) => {
  const url = `${baseUrl}/getAllLogsForBills?page=${page}&size=${size}&sortOrder=${sortOrder}&sortColumn=${sortColumn}&builderId=${builderId}&startDate=${startDate}&endDate=${endDate}`;
  const resp = await axios({
    method: "GET",
    url: url,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
};

export const deleteActivityLogs = async (token, id) => {
  const url = `${baseUrl}/delete/${id}`;
  const resp = await axios({
    method: "DELETE",
    url: url,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp;
};

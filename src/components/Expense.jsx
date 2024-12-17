import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import { getAllPaidOrUnPaidBillAmountByDate } from "../Api/BillApi/BillApi";
import { useSelector, useDispatch } from "react-redux";
import {
  setPaidBill,
  setLoading,
  setError,
} from "../redux/Features/PaidBillSlice";
import { getAllSiteMasters } from "../Api/SiteApi/SiteApi";

function Expense() {
  const dispatch = useDispatch();
  const { bill, status, error } = useSelector((state) => state.paidBill);
  const cred = useSelector((state) => state.Cred);
  const [siteMaster, setSiteMaster] = useState();
  const [siteId, setSiteId] = useState("");
  const { token } = useSelector((state) => state.login);

  let date = new Date();
  let fromDate = new Date(date.getFullYear(), date.getMonth());
  let endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalPages: 1,
    sortBy: "createdTime",
    sortDirection: "desc",
  });
  const payLoadData = {
    siteId: siteId,
    builderId: cred.id,
    startDate: fromDate.toISOString(),
    endDate: endDate.toISOString(),
    paid: true,
  };
  // console.log(payLoadData);
  // console.log(siteId);

  const getPaidBill = async () => {
    try {
      dispatch(setLoading());
      const resp = await getAllPaidOrUnPaidBillAmountByDate(
        token,
        payLoadData,
        pagination.page,
        pagination.pageSize,
        pagination.sortBy,
        pagination.sortDirection
      );
      // console.log(resp);
      dispatch(setPaidBill(resp.content || []));
      setPagination((prev) => ({
        ...prev,
        totalPages: resp.totalPages || 1,
      }));
      // console.log(resp);
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  useEffect(() => {
    getPaidBill();
  }, [pagination.page, siteId]);
  // console.log(bill);

  const getAllSite = async () => {
    try {
      const response = await getAllSiteMasters(token, cred.id);
      setSiteMaster(response.content);
    } catch (error) {}
  };
  useEffect(() => {
    getAllSite();
  }, []);
  // console.log(siteMaster);
  const handleSiteChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    setSiteId(selectedId);
  };
  // console.log(siteId);
  return (
    <div className="w-full bg-slate-700 pt-10 px-8 mx-auto">
      <div className="flex  justify-between items-center mb-6">
        <div className="w-1/3 ">
          <h1 className="text-white ml-4 text-4xl">Paid Bill</h1>
        </div>
        <div className="w-1/3">
          <Form>
            <Form.Group controlId="selectSite">
              <Form.Label className="text-white">Select Site</Form.Label>
              <Form.Control
                as="select"
                value={siteId || ""}
                onChange={(e) => handleSiteChange(e)}
              >
                <option value="" disabled>
                  Select site
                </option>
                {siteMaster && siteMaster.length === 0 ? (
                  <option disabled>No sites available</option>
                ) : (
                  siteMaster &&
                  siteMaster.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))
                )}
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
      </div>
      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <Table striped bordered hover className="w-full">
        <thead>
          <tr>
            <th>Bill Date</th>
            <th>Bill No</th>
            <th>Owner Name</th>
            <th>State Name</th>
            <th>Site Name</th>
            <th>Service Name </th>
            <th>Flat No </th>
            <th>Area</th>
            <th>Owner Email </th>
            <th>Amount Before GST </th>
            <th>SGST Amount</th>
            <th>CGST Amount</th>
            <th>IGST Amount</th>
            <th>Amount After GST</th>
            <th>Total Ammount</th>
          </tr>
        </thead>
        <tbody>
          {bill.map((item) => (
            <tr key={item.id}>
              <td>{item.billDate}</td>
              <td>{item.billNo}</td>
              <td>{item.ownerName}</td>
              <td>{item.stateName}</td>
              <td>{item.siteName}</td>
              <td>{item.serviceName}</td>
              <td>{item.flatNo}</td>
              <td>{item.area}</td>
              <td>{item.ownerEmail}</td>
              <td>{item.amountBeforeGst}</td>
              <td>{item.sgstAmount}</td>
              <td>{item.cgstAmount}</td>
              <td>{item.igstAmount}</td>
              <td>{item.amountAfterGst}</td>
              <td>{item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="mt-3">
        <Pagination.First
          onClick={() => handlePageChange(0)}
          disabled={pagination.page === 0}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 0}
        />
        {Array.from({ length: pagination.totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index === pagination.page}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page + 1 === pagination.totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(pagination.totalPages - 1)}
          disabled={pagination.page + 1 === pagination.totalPages}
        />
      </Pagination>
    </div>
  );
}

export default Expense;

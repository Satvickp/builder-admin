import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  addBill,
  setError,
  setLoading,
  setBills,
} from "../redux/Features/BillSlice";
import {
  createBillsInBulkWithoutFlatId,
  createBillsWithFlatId,
  deleteBill as apiDeleteBill,
  markBillAsPaid,
  markBillAsUnpaid,
} from "../Api/BillApi/BillApi";
import { sendBillInBulk } from "../Api/BillApi/BillApi";
import { getStates } from "../Api/stateapi/stateMasterApi";
import { setStateMasters } from "../redux/Features/stateMasterSlice";
import { getAllSiteMastersByState } from "../Api/SiteApi/SiteApi";
import { setSiteMasters } from "../redux/Features/siteMasterSlice";
import { getFlatsBySiteAndState } from "../Api/FlatApi/FlatApi";
import { setFlats } from "../redux/Features/FlatSlice";
import { getAllServiceMasters } from "../Api/ServicesApi/ServiceApi";
import { setServiceMasters } from "../redux/Features/ServiceSlice";
import {
  getPendingBillsBySiteId,
  getAllPaidBillsBySiteId,
} from "../Api/BillApi/BillApi";

const BillManager = () => {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.bills);
  const loading = useSelector((state) => state.bills.loading);
  const error = useSelector((state) => state.bills.error);
  const stateMasters =
    useSelector((state) => state.stateMaster.stateMasters) || [];
  const siteMasters = useSelector((state) => state.siteMaster.data) || [];
  const flats = useSelector((state) => state.flat.flats || []);
  const services = useSelector((state) => state.serviceMasters.services) || [];
  const cred = useSelector((state) => state.Cred);
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [newBill, setNewBill] = useState({
    stateId: "",
    siteId: "",
    serviceId: "",
  });
  const [showFlatSelectionModal, setShowFlatSelectionModal] = useState(false);
  const [addedEntries, setAddedEntries] = useState([]);
  const [newBillSecond, setNewBillSecond] = useState({
    stateId: "",
    siteId: "",
    flatId: [],
    serviceId: "",
  });

  const [pendingBills, setPendingBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const [bulkBillSendStatus, setBulkBillSendStatus] = useState(null);

  const fetchStates = async () => {
    try {
      const states = await getStates(cred.id);
      dispatch(setStateMasters(states));
    } catch (err) {
      dispatch(setError("Failed to load states."));
    }
  };

  const fetchServices = async () => {
    try {
      const response = await getAllServiceMasters(cred.id);
      dispatch(setServiceMasters(response.data));
    } catch (err) {
      dispatch(setError("Failed to load services."));
    }
  };

  const fetchSites = async (stateId) => {
    dispatch(setLoading(true));
    try {
      const response = await getAllSiteMastersByState(stateId, cred.id);
      console.log("hello", response);
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError("Failed to load sites."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchFlats = async (stateId, siteId) => {
    dispatch(setLoading(true));
    try {
      const response = await getFlatsBySiteAndState(siteId, stateId, cred.id);
      dispatch(
        setFlats({
          flats: response.content,
          totalElement: response.totalElement,
          page: response.page,
        })
      );
    } catch (err) {
      dispatch(setError("Failed to load flats."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPendingBills = async (siteId, builderId) => {
    dispatch(setLoading(true));
    try {
      const response = await getPendingBillsBySiteId(siteId, builderId);
      console.log("Fetched Pending Bills:", response.data);
      setPendingBills(response.data);
      dispatch(setBills(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch pending bills."));
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchPendingBills(newBill.siteId, cred.id);
  }, []);
  console.log(cred);
  useEffect(() => {
    if (newBillSecond.siteId && cred.id) {
      fetchPaidBills(newBillSecond.siteId, cred.id);
    }
  }, [newBill.siteId, cred.id]);

  const fetchPaidBills = async (siteId, builderId) => {
    dispatch(setLoading(true));
    try {
      const response = await getAllPaidBillsBySiteId(siteId, builderId);
      console.log("Fetched Paid Bills:", response.data);
      setPaidBills(response.data);
    } catch (error) {
      dispatch(setError("Failed to fetch paid bills."));
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (!stateMasters.length) fetchStates();
    fetchServices();
  }, []);

  useEffect(() => {
    if (newBill.stateId) fetchSites(newBill.stateId);
    if (newBillSecond.stateId) fetchSites(newBillSecond.stateId);
  }, [newBill.stateId, newBillSecond.stateId]);

  useEffect(() => {
    if (newBillSecond.siteId && newBillSecond.stateId)
      fetchFlats(newBillSecond.stateId, newBillSecond.siteId);
  }, [newBillSecond.siteId, newBillSecond.stateId]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewBill({
      stateId: "",
      siteId: "",
      serviceId: "",
    });
  };

  const openSecondModal = () => setShowSecondModal(true);
  const closeSecondModal = () => {
    setShowSecondModal(false);
    setNewBillSecond({
      stateId: "",
      siteId: "",
      flatId: "",
      serviceId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBill({
      ...newBill,
      [name]: type === "checkbox" ? checked : value ? Number(value) : "",
    });
  };

  const handleFlatSelection = (flatId, isChecked) => {
    setNewBillSecond((prev) => ({
      ...prev,
      flatId: isChecked
        ? [...prev.flatId, flatId]
        : prev.flatId.filter((id) => id !== flatId),
    }));
  };

  const handleSecondModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewBillSecond({
      ...newBillSecond,
      [name]: value ? Number(value) : "",
    });
  };

  const handleAddEntry = () => {
    const newEntries = newBillSecond.flatId.map((flatId) => ({
      stateId: newBillSecond.stateId,
      siteId: newBillSecond.siteId,
      flatId,
      serviceId: newBillSecond.serviceId,
    }));

    setAddedEntries((prev) => [...prev, ...newEntries]);

    setNewBillSecond((prev) => ({
      ...prev,
      flatId: [],
    }));
  };

  const handleRemoveEntry = (index) => {
    setAddedEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await createBillsInBulkWithoutFlatId({
        ...newBill,
        builderId: cred.id,
      });
      console.log("create bill ", response);
      response.data.map((e) => dispatch(addBill(e)));
      // fetchPendingBills(newBill.siteId, cred.id);
      closeModal();
    } catch (err) {
      dispatch(setError("Failed to create bill."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmitSecond = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const billReqList = addedEntries.map((entry) => ({
        stateId: entry.stateId || 0,
        siteId: entry.siteId || 0,
        flatId: entry.flatId || 0,
        serviceId: entry.serviceId || 0,
        builderId: cred.id,
      }));
      const requestData = {
        billReqList: billReqList,
      };
      const response = await createBillsWithFlatId(requestData);
      console.log("Bill creation response:", response);
      response.data.map((e) => dispatch(addBill(e)));
      fetchPaidBills(newBillSecond.siteId, cred.id);
      closeSecondModal();
    } catch (err) {
      console.error("Error creating bills:", err);
      dispatch(setError("Failed to create bills."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await apiDeleteBill(id);
      dispatch(setBills(bills.filter((bill) => bill.id !== id)));
    } catch (err) {
      dispatch(setError("Failed to delete bill."));
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await markBillAsPaid(id);
      dispatch(
        setBills(
          bills.map((bill) => (bill.id === id ? { ...bill, paid: true } : bill))
        )
      );
    } catch (err) {
      dispatch(setError("Failed to mark bill as paid."));
    }
  };

  const handleMarkAsUnpaid = async (id) => {
    try {
      await markBillAsUnpaid(id);
      dispatch(
        setBills(
          bills.map((bill) =>
            bill.id === id ? { ...bill, paid: false } : bill
          )
        )
      );
    } catch (err) {
      dispatch(setError("Failed to mark bill as unpaid."));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSendBillsInBulk = async () => {
    try {
      if (!bills.length) {
        alert("No bills available to send in bulk.");
        return;
      }

      const generatePDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.autoTable({
          html: "#my-table",
        });
        const pdfOutput = doc.output();
        return btoa(pdfOutput);
      };

      const pdfData = generatePDF();
      console.log("llll", pdfData);

      const bulkBillSendReqList = bills.map((bill) => ({
        email: bill.ownerEmail,
        billBase64Url: `${pdfData}`,
      }));
      console.log("rrr", bulkBillSendReqList);

      const response = await sendBillInBulk(bulkBillSendReqList);
      console.log("Bulk Send Response:", response);

      setBulkBillSendStatus("Bills sent successfully!");
    } catch (error) {
      console.error("Error sending bills in bulk:", error);
      setBulkBillSendStatus("Failed to send bills in bulk.");
    }
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF({ orientation: "landscape" });
  //   doc.autoTable({
  //     html: "#my-table",
  //   });
  //   doc.save("data.pdf");
  //   var out = doc.output()

  //   var url ='data:application/pdf;base64,'+ btoa(out);
  //   console.log('base64',url)
  // };

  console.log(bills);
  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-4xl">Bill Manager</h2>
        <div className="flex gap-4">
          <Button variant="primary" onClick={openModal}>
            Add Bill in Bulk
          </Button>
          <Button variant="secondary" onClick={openSecondModal}>
            Add Bill or Flats
          </Button>
        </div>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="table-container bg-white">
        <Table
          responsive
          striped
          bordered
          hover
          variant="dark"
          className="table"
        >
          <thead>
            <tr>
              <th>Bill Date</th>
              <th>Bill No</th>
              <th>Owner Name</th>
              <th>State Name</th>
              <th>Site Name</th>
              <th>Flat No</th>
              <th>Service Name</th>
              <th>Area</th>
              <th>Owner Email</th>
              <th>Amount Before GST</th>
              <th>SGST Amount</th>
              <th>CGST Amount</th>
              <th>IGST Amount</th>
              <th>Amount After GST</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{formatDate(bill.billDate)}</td>
                <td>{bill.billNo}</td>
                <td>{bill.ownerName}</td>
                <td>{bill.stateName}</td>
                <td>{bill.siteName}</td>
                <td>{bill.flatNo}</td>
                <td>{bill.serviceName}</td>
                <td>{bill.area}</td>
                <td>{bill.ownerEmail}</td>
                <td>{bill.amountBeforeGst}</td>
                <td>{bill.sgstAmount}</td>
                <td>{bill.cgstAmount}</td>
                <td>{bill.igstAmount}</td>
                <td>{bill.amountAfterGst}</td>
                <td>{bill.paid ? "Paid" : "Unpaid"}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleMarkAsPaid(bill.id)}
                    disabled={bill.paid}
                  >
                    Paid
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleMarkAsUnpaid(bill.id)}
                    disabled={!bill.paid}
                  >
                    Unpaid
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteBill(bill.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
        <Button variant="success" onClick={handleSendBillsInBulk}>
          Send Bills in Bulk
        </Button>
      </div>

      {bulkBillSendStatus && (
        <p className="text-white mt-4">{bulkBillSendStatus}</p>
      )}

      {/* First Modal for Adding Bills */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Bulk Bills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="stateId">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                name="stateId"
                value={newBill.stateId}
                onChange={handleInputChange}
              >
                <option value="">Select a State</option>
                {stateMasters.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="siteId">
              <Form.Label>Site</Form.Label>
              <Form.Control
                as="select"
                name="siteId"
                value={newBill.siteId}
                onChange={handleInputChange}
              >
                <option value="">Select a Site</option>
                {siteMasters.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="serviceId">
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                name="serviceId"
                value={newBill.serviceId}
                onChange={handleInputChange}
              >
                <option value="">Select a Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="mt-4">
              <Button variant="primary" type="submit">
                Create Bills
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Second Modal for Adding Bill or Flats */}
      <Modal show={showSecondModal} onHide={closeSecondModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bill or Flats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitSecond}>
            <Form.Group controlId="stateId">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                name="stateId"
                value={newBillSecond.stateId}
                onChange={handleSecondModalInputChange}
              >
                <option value="">Select a State</option>
                {stateMasters.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="siteId">
              <Form.Label>Site</Form.Label>
              <Form.Control
                as="select"
                name="siteId"
                value={newBillSecond.siteId}
                onChange={handleSecondModalInputChange}
              >
                <option value="">Select a Site</option>
                {siteMasters.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="flatId">
              <Form.Label>Flat</Form.Label>
              <Button
                variant="outline-primary"
                className="mt-4"
                onClick={() => setShowFlatSelectionModal(true)}
              >
                {newBillSecond.flatId.length > 0
                  ? `${newBillSecond.flatId.length} Flats Selected`
                  : "Select Flats"}
              </Button>

              {/* Modal for Flat Selection */}
              <Modal
                show={showFlatSelectionModal}
                onHide={() => setShowFlatSelectionModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select Flats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {flats.map((flat) => (
                      <Form.Check
                        key={flat.id}
                        type="checkbox"
                        id={`flat-checkbox-${flat.id}`}
                        label={flat.flatNo}
                        checked={newBillSecond.flatId.includes(flat.id)}
                        onChange={(e) =>
                          handleFlatSelection(flat.id, e.target.checked)
                        }
                      />
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowFlatSelectionModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowFlatSelectionModal(false)}
                  >
                    Save Selection
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form.Group>

            <Form.Group controlId="serviceId">
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                name="serviceId"
                value={newBillSecond.serviceId}
                onChange={handleSecondModalInputChange}
              >
                <option value="">Select a Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Add Entry Button */}
            <div className="d-flex justify-content-end m-t-5">
              <Button variant="primary" onClick={handleAddEntry}>
                Add
              </Button>
            </div>

            {/* Table to show added entries */}
            {/* Table to show added entries */}
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Site</th>
                  <th>Flat</th>
                  <th>Service</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addedEntries.map((entry, index) => {
                  const stateName =
                    stateMasters.find((state) => state.id === entry.stateId)
                      ?.name || "N/A";
                  const siteName =
                    siteMasters.find((site) => site.id === entry.siteId)
                      ?.name || "N/A";
                  const flatNumber =
                    flats.find((flat) => flat.id === entry.flatId)?.flatNo ||
                    "N/A";
                  const serviceName =
                    services.find((service) => service.id === entry.serviceId)
                      ?.name || "N/A";

                  return (
                    <tr key={index}>
                      <td>{stateName}</td>
                      <td>{siteName}</td>
                      <td>{flatNumber}</td>
                      <td>{serviceName}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveEntry(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div>
              <Button variant="primary" type="submit">
                Create Bill
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillManager;

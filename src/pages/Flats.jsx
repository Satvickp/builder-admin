import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, FormControl, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactPaginate from "react-paginate"; // Ensure to install: npm install react-paginate
import {
  setFlats,
  setLoading,
  setError,
  addFlat,
  updateFlat,
  selectFlats,
  selectLoading,
  selectError,
} from "../redux/Features/FlatSlice";
import {
  createFlatMaster,
  getFlatsBySiteAndState,
  updateFlatMaster,
  getAllFlats,
} from "../Api/FlatApi/FlatApi";

import { getStates } from "../Api/stateapi/stateMasterApi";
import { setStateMasters } from "../redux/Features/stateMasterSlice";
import {
  getAllSiteMastersByState,
  // createSiteMaster,
  getAllFlatAreaBySiteId,
  getAllBlocksBySiteId,
} from "../Api/SiteApi/SiteApi";
import { setSiteMasters } from "../redux/Features/siteMasterSlice";

const FlatMaster = () => {
  const dispatch = useDispatch();
  const flats = useSelector(selectFlats);
  // const loading = useSelector(selectLoading);
  // const error = useSelector(selectError);
  const stateMasters =
    useSelector((state) => state.stateMaster.stateMasters) || [];
  const siteMasters = useSelector((state) => state.siteMaster.data) || [];

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flatId, setFlatId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const cred = useSelector((state) => state.Cred);
  const [areas, setAreas] = useState([]);
  const [blocks, setBlocks] = useState([]);
  console.log(blocks);
  console.log(areas);

  const [newFlat, setNewFlat] = useState({
    flatNo: "",
    ownerName: "",
    area: "",
    block: "",
    emailId: "",
    siteMasterId: null,
    creditDays: 30,
    remark: "",
    openingBalance: 0,
  });
  const [validationError, setValidationError] = useState("");

  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(0); // State for tracking current page

  // Fetch states when stateMasters is empty
  useEffect(() => {
    if (stateMasters.length === 0) {
      fetchStates();
    }
  }, []);

  // Fetch sites when a state is selected
  useEffect(() => {
    if (selectedStateId) {
      fetchSites(selectedStateId);
    }
  }, [selectedStateId]);

  // Fetch flats when both site and state are selected
  useEffect(() => {
    if (selectedSiteId && selectedStateId) {
      fetchFlats(selectedSiteId, selectedStateId, currentPage);
    }
  }, [selectedSiteId, selectedStateId, currentPage]);

  // Fetch states function
  const fetchStates = async () => {
    try {
      const states = await getStates(cred.id);
      dispatch(setStateMasters(states));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  useEffect(() => {
    fetchAllFlats();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      console.log(selectedSiteId);
      fetchAreas(selectedSiteId);
      fetchBlocks(selectedSiteId);
    }
  }, [selectedSiteId]);

  const fetchAreas = async (siteId) => {
    try {
      const response = await getAllFlatAreaBySiteId(siteId);
      console.log("Areas fetched:", response);
      setAreas(response);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  const fetchBlocks = async (siteId) => {
    try {
      const response = await getAllBlocksBySiteId(siteId);
      console.log("Blocks fetched:", response);
      setBlocks(response);
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  };

  const fetchAllFlats = async () => {
    dispatch(setLoading("loading"));
    try {
      const response = await getAllFlats(cred.id);
      dispatch(
        setFlats({
          flats: response.content,
          totalElement: response.totalElements,
          totalPages: response.totalPages, // Store totalPages in Redux
          page: response.page,
        })
      );
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading("succeeded"));
    }
  };

  // Fetch sites function
  const fetchSites = async (stateId) => {
    dispatch(setLoading("loading"));
    try {
      const response = await getAllSiteMastersByState(stateId, cred.id);
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading("succeeded"));
    }
  };

  // Fetch flats function (with pagination)
  const fetchFlats = async (siteId, stateId, page = 0) => {
    dispatch(setLoading("loading"));
    try {
      const response = await getFlatsBySiteAndState(
        siteId,
        stateId,
        cred.id,
        page
      );
      dispatch(
        setFlats({
          flats: response.content,
          totalElement: response.totalElement,
          page: response.page,
          totalPages: response.totalPages, // Update totalPages from response
        })
      );
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading("succeeded"));
    }
  };

  // Handle page change
  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    if (selectedSiteId && selectedStateId) {
      fetchFlats(selectedSiteId, selectedStateId, selectedPage);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (validationError) setValidationError("");

    setNewFlat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create flat action
  const handleCreate = async () => {
    const duplicateFlat = flats.find((flat) => flat.flatNo === newFlat.flatNo);

    if (duplicateFlat) {
      setValidationError(`Flat No ${newFlat.flatNo} already exists.`);
      return;
    }
    if (!selectedSiteId) {
      alert("Please select or add a site before adding a flat.");
      return;
    }

    dispatch(setLoading("loading"));
    try {
      const createdFlat = await createFlatMaster({
        ...newFlat,
        builderId: cred.id,
        siteMasterId: selectedSiteId,
      });
      dispatch(addFlat(createdFlat));
      setShowModal(false);
      resetNewFlat();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading("succeeded"));
    }
  };

  // Handle site creation
  // const handleAddNewSite = async (siteName) => {
  //   dispatch(setLoading("loading"));
  //   try {
  //     const newSite = { name: siteName, stateId: selectedStateId };
  //     const response = await createSiteMaster(newSite);
  //     dispatch(setSiteMasters([...siteMasters, response.data]));
  //     setSelectedSiteId(response.data.id);
  //   } catch (err) {
  //     dispatch(setError(err.message));
  //   } finally {
  //     dispatch(setLoading("succeeded"));
  //   }
  // };

  // Reset new flat form fields
  const resetNewFlat = () => {
    setNewFlat({
      flatNo: "",
      ownerName: "",
      area: "",
      block: "",
      emailId: "",
      siteMasterId: null,
      creditDays: 30,
      remark: "",
      openingBalance: 0,
    });
  };

  // Handle update flat action
  const handleUpdate = async () => {
    const duplicateFlat = flats.find(
      (flat) => flat.flatNo === newFlat.flatNo && flat.id !== flatId
    );

    if (duplicateFlat) {
      setValidationError(`Flat No ${newFlat.flatNo} already exists.`);
      return;
    }
    dispatch(setLoading("loading"));
    try {
      const updatedFlat = await updateFlatMaster(flatId, newFlat);
      dispatch(updateFlat(updatedFlat));
      setShowModal(false);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading("succeeded"));
    }
  };

  const handleEdit = (flat) => {
    const site = siteMasters.find((site) => site.id === flat.siteMasterId);

    if (site) {
      setSelectedStateId(site.stateId);
      setSelectedSiteId(flat.siteMasterId);
      fetchAreas(flat.siteMasterId);
      fetchBlocks(flat.siteMasterId);
    }
    setNewFlat({
      flatNo: flat.flatNo,
      ownerName: flat.ownerName,
      area: flat.area,
      block: flat.block,
      emailId: flat.emailId,
      siteMasterId: flat.siteMasterId,
      creditDays: flat.creditDays || 30,
      remark: flat.remark || "",
      openingBalance: flat.openingBalance || 0,
    });

    setFlatId(flat.id);
    setIsEdit(true);
    setShowModal(true);
  };

  // Filter states and sites based on search queries
  const filteredStates = stateMasters.filter((state) =>
    state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );
  const filteredSites = siteMasters.filter((site) =>
    site.name.toLowerCase().includes(siteSearchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid bg-slate-700 pt-20 px-2 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Flats</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
            }}
          >
            Add New Flat
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Owner Name</th>
            <th>Area</th>
            <th>blocks</th>
            <th>Email</th>
            <th>Site</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(flats) && flats.length > 0 ? (
            flats.map((flat) => {
              const site = siteMasters.find(
                (site) => site.id === flat.siteMasterId
              );
              return (
                <tr key={flat.id}>
                  <td>{flat.flatNo}</td>
                  <td>{flat.ownerName}</td>
                  <td>{flat.area}</td>
                  <td>{flat.block}</td>
                  <td>{flat.emailId}</td>
                  <td>{site ? site.name : "N/A"}</td>
                  <td>
                    <OverlayTrigger overlay={<Tooltip>Edit Flat</Tooltip>}>
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={() => handleEdit(flat)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No flats available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Component */}
      {flats.length > 0 && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={flats.totalPages}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          forcePage={currentPage}
        />
      )}

      {/* Modal for adding or editing flats */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Flat" : "Add New Flat"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* State Dropdown */}
            <Form.Label>Select State</Form.Label>
            <div className="mb-3">
              <Form.Select
                value={selectedStateId || ""}
                onChange={(e) => setSelectedStateId(e.target.value)}
                aria-label="Select State"
              >
                <option value="">Select State</option>
                {filteredStates.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Site Dropdown */}
            <Form.Label>Select Site</Form.Label>
            <div className="mb-3">
              <Form.Select
                value={selectedSiteId || ""}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                aria-label="Select Site"
              >
                <option value="">Select Site</option>
                {filteredSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Flat details form */}
            <div className="mb-3">
              <Form.Label>Flat No</Form.Label>
              <FormControl
                type="text"
                name="flatNo"
                value={newFlat.flatNo}
                onChange={handleChange}
                required
              />
              {validationError && (
                <p className="text-danger">{validationError}</p>
              )}
            </div>
            <div className="mb-3">
              <Form.Label>Owner Name</Form.Label>
              <FormControl
                type="text"
                name="ownerName"
                value={newFlat.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Area</Form.Label>
              <Form.Select
                name="area"
                value={newFlat.area}
                onChange={handleChange}
                aria-label="Select Area"
              >
                <option value="">Select Area</option>
                {Array.isArray(areas) && areas.length > 0 ? (
                  areas.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
                    </option>
                  ))
                ) : (
                  <option>No areas available</option>
                )}
              </Form.Select>
            </div>

            <div className="mb-3">
              <Form.Label>Blocks</Form.Label>
              <Form.Select
                name="block"
                value={newFlat.block}
                onChange={handleChange}
                aria-label="Select Blocks"
              >
                <option value="">Select Blocks</option>
                {Array.isArray(blocks) && blocks.length > 0 ? (
                  blocks.map((block, index) => (
                    <option key={index} value={block}>
                      {block}
                    </option>
                  ))
                ) : (
                  <option>No blocks available</option>
                )}
              </Form.Select>
            </div>

            <div className="mb-3">
              <Form.Label>Email</Form.Label>
              <FormControl
                type="email"
                name="emailId"
                value={newFlat.emailId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Credit Days</Form.Label>
              <FormControl
                type="number"
                name="creditDays"
                value={newFlat.creditDays}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Remark</Form.Label>
              <FormControl
                type="text"
                name="remark"
                value={newFlat.remark}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Form.Label>Opening Balance</Form.Label>
              <FormControl
                type="number"
                name="openingBalance"
                value={newFlat.openingBalance}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={isEdit ? handleUpdate : handleCreate}
          >
            {isEdit ? "Update Flat" : "Create Flat"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlatMaster;

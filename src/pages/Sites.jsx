import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  setSiteMasters,
  setLoading,
  setError,
  deleteSiteMaster,
} from "../redux/Features/siteMasterSlice";
import {
  createSiteMaster,
  updateSiteMaster,
  getAllSiteMasters,
  deleteSite,
} from "../Api/SiteApi/SiteApi";

import { getStates } from "../Api/stateapi/stateMasterApi";
import { setStateMasters } from "../redux/Features/stateMasterSlice";

const SiteMaster = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.siteMaster);
  const { stateMasters } = useSelector((state) => state.stateMaster);
  const cred = useSelector((state) => state.Cred);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [stateId, setStateId] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [newSite, setNewSite] = useState({
    name: "",
    totalUnits: "",
    flatTypes: [],
    blockList: [],
    stateMasterId: null,
  });

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalPages: 1,
    sortBy: "createdTime",
    sortDirection: "desc",
  });

  const fetchSites = async () => {
    try {
      dispatch(setLoading());
      const response = await getAllSiteMasters(
        cred.id,
        pagination.page,
        pagination.pageSize,
        pagination.sortBy,
        pagination.sortDirection
      );
      dispatch(setSiteMasters(response.content || []));
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
      }));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleStateSelect = (id) => {
    setStateId(id);
    setNewSite({
      ...newSite,
      stateMasterId: id,
    });
  };

  const fetchStateMasters = async () => {
    dispatch(setLoading("loading"));
    try {
      const states = await getStates(cred.id);
      dispatch(setStateMasters(states));
      dispatch(setLoading("succeeded"));
    } catch (error) {
      console.error("Error fetching state masters:", error.message || error);
      dispatch(setError("Failed to fetch state masters"));
      dispatch(setLoading("failed"));
    }
  };

  useEffect(() => {
    fetchStateMasters();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSite({ ...newSite, [name]: value });
  };
  const handleCreate = async () => {
    dispatch(setLoading());
    try {
      await createSiteMaster({
        ...newSite,
        builderId: cred.id,
        totalUnits: Number(newSite.totalUnits),
        stateMasterId: Number(newSite.stateMasterId),
      });
      fetchSites();
      setShowModal(false);
      resetForm();
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleUpdate = async () => {
    dispatch(setLoading());
    console.log({
      name: newSite.name,
      state: stateId,
      totalUnits: newSite.totalUnits,
      flatTypes: newSite.flatTypes,
      builderId: cred.id,
    });
    try {
      await updateSiteMaster(siteId, {
        name: newSite.name,
        state: stateId,
        totalUnits: newSite.totalUnits,
        flatTypes: newSite.flatTypes,
        builderId: cred.id,
      });
      fetchSites();
      setShowModal(false);
      resetForm();
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleEdit = (site) => {
    setNewSite({
      ...site,
      stateMasterId: site.stateMasterId,
    });
    setStateId(site.stateMasterId);
    setSiteId(site.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      dispatch(setLoading());
      try {
        await deleteSite(id);
        dispatch(deleteSiteMaster(id));
        fetchSites();
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  const resetForm = () => {
    setNewSite({
      name: "",
      totalUnits: "",
      flatTypes: [],
      blockList: [],
      stateMasterId: null,
    });
    setStateId(null);
    setIsEdit(false);
  };

  useEffect(() => {
    if (!stateId && stateMasters.length > 0) {
      const defaultStateId = stateMasters[0].id; // Default to the first state's ID
      setStateId(defaultStateId);
      setNewSite((prev) => ({
        ...prev,
        stateMasterId: defaultStateId,
      }));
    }
  }, [stateMasters, showModal]);

  useEffect(() => {
    fetchSites();
  }, [pagination.page]);

  const filteredStateMasters = stateMasters.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container-fluid bg-slate-700 pt-20 px-2.8">
      <div className="row align-items-center mb-4">
        <div className="col-md-6 col-12">
          <h1 className="text-white text-4xl">Site Master</h1>
        </div>
        <div className="col-md-6 col-12 text-md-end text-sm-start mt-2 mt-md-0">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New
          </Button>
        </div>
      </div>
      <div className="table-responsive overflow-x-auto table-container bg-white rounded-lg shadow-lg">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Site</th>
              <th>Total Units</th>
              <th>Flat Types</th>
              <th>Block List</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((site) => (
                <tr key={site.id}>
                  <td>{site.name}</td>
                  <td>{site.totalUnits}</td>
                  <td>{site.flatTypes.join(", ")}</td>
                  <td>{site.blockList.join(" ,")}</td>
                  <td>{site.state}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={() => handleEdit(site)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete</Tooltip>}
                    >
                      <Button
                        variant="link"
                        className="p-0 text-danger"
                        onClick={() => handleDelete(site.id)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {data.length > 0 && (
        <Pagination className="mt-3 justify-end">
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
      )}

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewSite({
            name: "",
            totalUnits: "",
            flatTypes: [],
            blockList: [],
            stateMasterId: null,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Site Master" : "Add New Site Master"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="stateSelect">
              <Form.Label>Select State</Form.Label>
              <Form.Control
                as="select"
                value={stateId}
                type="number"
                onChange={(e) => handleStateSelect(e.target.value)}
                disabled={isEdit}
              >
                <option value="">Select State</option>
                {filteredStateMasters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSite.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total Units</Form.Label>
              <Form.Control
                type="number"
                name="totalUnits"
                value={newSite.totalUnits}
                onChange={(e) => {
                  setNewSite({ ...newSite, totalUnits: e.target.value });
                }}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Flat Types</Form.Label>
              <Form.Control
                type="text"
                name="flatTypes"
                value={newSite.flatTypes.join(",")}
                onChange={(e) =>
                  setNewSite({
                    ...newSite,
                    flatTypes: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
                placeholder="e.g., 1000, 2000, 5000"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>blockList</Form.Label>
              <Form.Control
                type="text"
                name="blockList"
                value={newSite.blockList.join(",")}
                onChange={(e) =>
                  setNewSite({
                    ...newSite,
                    blockList: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                    blockListInput: e.target.value,
                  })
                }
                placeholder="e.g., A, B, C"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={isEdit ? handleUpdate : handleCreate}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SiteMaster;

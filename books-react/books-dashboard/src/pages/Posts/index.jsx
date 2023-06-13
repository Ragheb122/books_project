import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FullLayout from "../../layouts/FullLayout";

//MRT Imports
import MaterialReactTable from "material-react-table";

//Material-UI Imports
import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

import { Button, ButtonGroup, Col, FormGroup, Row } from "react-bootstrap";

import { getCheckModal } from "../../utils/getModal";

// icons
import { Form, Modal } from "react-bootstrap";
import { InputGroup, Label } from "reactstrap";

// forms
import { useForm } from "react-hook-form";

// cookies
import cookie from "react-cookies";

// apis
import API from "../../utils/API";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Posts = () => {
  const tableInstanceRef = useRef();
  const { register, handleSubmit, reset, setValue } = useForm();

  const [selectAccess, setSelectAccess] = useState([]);
  const [personName, setPersonName] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [show, setShow] = useState({ isShow: false, id: 0 });
  const [data, setData] = useState([]);

  const [countrys, setCountrys] = useState([]);
  const [isBtnActive, setIsBtnActive] = useState(false);
  const [rowSelectionIdx, setRowSelectionIdx] = useState({});

  const closeModal = () => {
    setShow({ isShow: false, id: 0 });

    reset({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      mobile: "",
      country_id: "",
      permissions: "",
    });
    setPersonName([]);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "Image",
        id: "Image",
        header: "Image",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <img style={{ width: 80 }} src={row.original?.image} alt="" />
          </Box>
        ),
      },
      {
        accessorKey: "name",
        id: "name",
        header: "Name",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.title}</span>
          </Box>
        ),
      },
      {
        accessorKey: "description",
        id: "description",
        header: "Description",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.description}</span>
          </Box>
        ),
      },
      {
        accessorKey: "traded",
        id: "traded",
        header: "Traded",
        Cell: ({ row }) => (
          <Box
            className={`w-fit text-center px-2 py-1 rounded-3 m-auto ${
              !row.original?.traded ? "bg-movee" : "bg-danger"
            }`}
          >
            <span className="text-white">
              {row.original?.traded ? "Trade" : "Available"}
            </span>
          </Box>
        ),
      },
    ],
    []
  );
  const getData = () => {
    const token = cookie.load("token");

    API(`/admin/Posts?token=${token}`).then(({ data }) => {
      setData(data?.Data);
    });
  };

  const getRowsIds = useCallback(() => {
    const rowSelectionIds = Object.keys(rowSelectionIdx || {}).map((idx) => {
      return data[idx]?.id;
    });

    return rowSelectionIds;
  }, [data, rowSelectionIdx]);
  const deleteRows = () => {
    const rowsIds = getRowsIds();

    if (!rowsIds?.length) {
      alert("please choose at least one element");
    }

    const deleteCallBack = async () => {
      const formData = new FormData();

      const token = cookie.load("token");
      formData.append("token", token);
      formData.append("status", 1);
      formData.append("id", rowsIds);

      await API.post(`/admin/PostStatus`, formData);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "Are you sure you want to delete selected posts?",
      type: "warning",
      confirmButtonText: "Yes, Delete",
      isConfirmedMsg: "Success! Delete selected posts",
      cb: deleteCallBack,
    });
  };
  const activeSelection = () => {
    const rowsIds = getRowsIds();

    if (!rowsIds?.length) {
      alert("please choose at least one element");
    }

    const deleteCallBack = async () => {
      const formData = new FormData();

      const token = cookie.load("token");
      formData.append("token", token);
      formData.append("status", 0);
      formData.append("id", rowsIds);

      await API.post(`/admin/PostStatus`, formData);
      getData();
      setRowSelectionIdx({});
    };
  };
  const saveHandelar = async (data) => {
    const permissions = personName
      ?.map((perm) => selectAccess?.find((access) => access?.name === perm)?.id)
      ?.join();
    const token = cookie.load("token");
    const formData = new FormData();
    data = { ...data, permissions };

    formData.append("token", token);
    show?.id && formData.append("id", show?.id);
    Object.keys(data)?.forEach((key) => {
      data[key] && formData.append(key, data[key]);
    });
  };
  const handleChange = ({ target }) => {
    const { value } = target;

    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    const rowsIds = getRowsIds();

    if (rowsIds?.length) {
      setIsBtnActive(true);
    } else {
      setIsBtnActive(false);
    }
  }, [getRowsIds, rowSelectionIdx]);

  useEffect(() => {
    getData();
  }, []);

  // get user data
  useEffect(() => {
    if (show?.id) {
      const currentUser = data?.find((user) => user.id === show.id);
      const countryId = countrys?.find(
        (country) => country.name === currentUser.country
      )?.id;
      const currentPermissions = currentUser?.permissionsIds
        ?.split(",")
        ?.map((n) => +n);

      const permissions = selectAccess?.filter((permission) =>
        currentPermissions?.includes(permission?.id)
      );

      setValue("name", currentUser?.name);
      setValue("email", currentUser?.email);
      setValue("mobile", currentUser?.mobile);
      setValue("country_id", countryId?.toString());
      setPersonName(permissions?.map((per) => per?.name));
    }
  }, [data, show?.id, setValue, countrys, selectAccess]);

  return (
    <FullLayout
      title="Posts"
      renderButtons={() => (
        <div className="flex-center">
          <ButtonGroup className="me-4">

            <Button
              onClick={deleteRows}
              disabled={!isBtnActive}
              variant="danger"
              className="flex-center text-white"
            >
              <span className="me-1">Delete</span>
              <i className="bi bi-trash3" />
            </Button>
          </ButtonGroup>
        </div>
      )}
    >
      <div style={{ maxHeight: "800px", overflow: "auto" }}>
        <MaterialReactTable
          enablePagination={false}
          onRowSelectionChange={setRowSelectionIdx}
          columns={columns}
          data={data}
          state={{ rowSelection: rowSelectionIdx }}
          initialState={{ showColumnFilters: true }}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enableColumnActions={false}
          enableBottomToolbar={false}
          enableColumnOrdering
          enableGrouping
          enablePinning
          enableRowSelection
          positionToolbarAlertBanner="bottom"
          tableInstanceRef={tableInstanceRef}
          pagination={false}
        />
      </div>

      {/* Edit Modal or Add */}
      <Modal
        className="p-0"
        fullscreen
        centered
        show={show.isShow}
        onHide={closeModal}
      >
        <Modal.Header>
          <Modal.Title>edit or add admin</Modal.Title>

          <button className="btn-close ms-auto me-0" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Row className="mb-3">
              <Col lg="6">
                <FormGroup>
                  <Label for="name">name</Label>
                  <Form.Control {...register("name")} id="name" type="text" />
                </FormGroup>
              </Col>

              <Col lg="6">
                <FormGroup>
                  <Label for="email">email</Label>
                  <Form.Control {...register("email")} id="email" type="text" />
                </FormGroup>
              </Col>
            </Row>

            {!show?.id && (
              <Row className="mb-3">
                <Col lg="6">
                  <FormGroup>
                    <Label for="password">password</Label>
                    <InputGroup>
                      <Form.Control
                        {...register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>

                <Col lg="6">
                  <FormGroup>
                    <Label for="confirm_password">confirm password  </Label>
                    <InputGroup>
                      <Form.Control
                        {...register("confirm_password")}
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            )}

            <Row>
              <Col lg="6">
                <FormGroup>
                  <Label for="country_id">city</Label>
                  <Form.Control
                    {...register("country_id")}
                    id="country_id"
                    as="select"
                  >
                    {countrys?.map((country, idx) => (
                      <option key={idx} value={country?.id}>
                        {country?.name}
                      </option>
                    ))}
                  </Form.Control>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="mobile">phone number</Label>
                  <Form.Control
                    maxLength={15}
                    {...register("mobile")}
                    id="mobile"
                    type="text"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg="12" className="mt-3">
                <FormGroup className="d-flex flex-column">
                  <Label for="access">accessibility</Label>
                  <Select
                    id="access"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {selectAccess?.map((permtion) => (
                      <MenuItem key={permtion?.id} value={permtion?.name}>
                        <Checkbox
                          checked={personName?.indexOf(permtion?.name) > -1}
                        />
                        <ListItemText primary={permtion?.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="flex-center">
          <Button onClick={handleSubmit(saveHandelar)} variant="primary">
            save
          </Button>

          <Button variant="danger" onClick={closeModal}>
            cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </FullLayout>
  );
};

export default Posts;

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
import {Box} from "@mui/material";

import { Button, ButtonGroup, Col, FormGroup, Row } from "react-bootstrap";

import { getCheckModal } from "../../utils/getModal";

// icons
import { AiOutlinePlus } from "react-icons/ai";
import { Form, Modal } from "react-bootstrap";
import { InputGroup, Label } from "reactstrap";

// forms
import { useForm } from "react-hook-form";

// cookies
import cookie from "react-cookies";

// apis
import API from "../../utils/API";
import getMessage from "../../utils/getMessage";


const Accounts = () => {
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

  const openModal = (id) => {
    setShow({ isShow: true, id });
  };
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
        accessorKey: "name",
        id: "name",
        header: "Name",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.name}</span>
          </Box>
        ),
      },
      {
        accessorKey: "email",
        id: "email",
        header: "Email",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <a
              className="text-decoration-none"
              style={{ color: "#007bff" }}
              href={`mailto:${row.original?.email}`}
            >
              {row.original?.email}
            </a>
          </Box>
        ),
      },
      {
        accessorKey: "city",
        id: "city",
        header: "City",
        size: 100,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.city}</span>
          </Box>
        ),
      },
      {
        accessorKey: "admin",
        id: "admin",
        header: "Admin",
        Cell: ({ row }) => (
          <Box
            className={`w-fit text-center px-2 py-1 rounded-3 m-auto ${
              row.original?.admin ? "bg-movee" : "bg-danger"
            }`}
          >
            <span className="text-white">
              {row.original?.admin ? "Yes" : "No"}
            </span>
          </Box>
        ),
      },
    ],
    []
  );
  const getData = () => {
    const token = cookie.load("token");

    API(`/admin/users?token=${token}`).then(({ data }) => {
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
      formData.append("id", rowsIds?.join(","));
      getData();
      setRowSelectionIdx({});
    };

  };
  const activeSelection = () => {
    const rowsIds = getRowsIds();

    if (!rowsIds?.length) {
      alert("please choose at least one element");
    }

    const deleteCallBack = async () => {
      const token = cookie.load("token");

      await API.post(`admin/MakeUserAdmin?token=${token}&id=${rowsIds}`);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "Do you want to convert the user to an admin?",
      type: "warning",
      confirmButtonText: "Yes",
      isConfirmedMsg: "The conversion has been completed successfully",
      cb: deleteCallBack,
    });
  };

  const saveHandelar = async (allData) => {
    const userToken = data?.find((user) => user?.id == show?.id)?.token;
    const adminToken = cookie.load("token");
    const formData = new FormData();

    userToken && show?.id && formData.append("token", userToken);
    !show?.id && formData.append("token", adminToken);

    Object.keys(allData)?.forEach((key) => {
      allData[key] && formData.append(key, allData[key]);
    });

    await API.post(
      show?.id ? "/userprofile/EditProfile" : "/default/register",
      formData
    )
      .then(({ data }) => {
        if (data.code != 200)
          return getMessage("error", data?.error || data?.msg);

        getData();
        closeModal();
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
      })
      .catch(() => {
        getMessage("error", "please fill in the fields");
      });
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
      title="Accounts"
      renderButtons={() => (
        <div className="flex-center">
          <ButtonGroup className="me-4">
            <Button
              onClick={activeSelection}
              disabled={!isBtnActive}
              variant="primary"
              className="flex-center text-white"
            >
              <span className="me-1">Make To Admin</span>
              <i className="bi bi-check2 fs-5 flex-center" />
            </Button>

            {}
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
          initialState={{ showColumnFilters: false }}
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
          <Modal.Title>Add Or Edit User</Modal.Title>

          <button className="btn-close ms-auto me-0" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Row className="mb-3">
              <Col lg="6">
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Form.Control {...register("name")} id="name" type="text" />
                </FormGroup>
              </Col>

              <Col lg="6">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Form.Control {...register("email")} id="email" type="text" />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg="6">
                <FormGroup>
                  <Label for="password">Password</Label>
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
                  <Label for="confirm_password">Confirm Password</Label>
                  <InputGroup>
                    <Form.Control
                      {...register("repassword")}
                      id="repassword"
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

            <Row>
              {}
              <Col lg="12">
                <FormGroup>
                  <Label for="mobile">Mobile</Label>
                  <Form.Control
                    maxLength={15}
                    {...register("mobile")}
                    id="mobile"
                    type="text"
                  />
                </FormGroup>
              </Col>
            </Row>

            {}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="flex-center">
          <Button onClick={handleSubmit(saveHandelar)} variant="primary">
            Save
          </Button>

          <Button variant="danger" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </FullLayout>
  );
};

export default Accounts;

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
  IconButton,
} from "@mui/material";

// import { data as collectedData } from "./makeData";
import { Button, ButtonGroup, Col, FormGroup, Row } from "react-bootstrap";

import { getCheckModal } from "../../utils/getModal";

// icons
import { AiOutlinePlus } from "react-icons/ai";
import { Form, Modal } from "react-bootstrap";
import { Label } from "reactstrap";

// forms
import { useForm } from "react-hook-form";

// cookies
import cookie from "react-cookies";

// apis
import API from "../../utils/API";
import getMessage from "../../utils/getMessage";

// placeholder data

const Categories = () => {
  const tableInstanceRef = useRef();
  const { register, handleSubmit, reset, setValue } = useForm();

  const [selectAccess, setSelectAccess] = useState([]);
  const [personName, setPersonName] = useState([]);


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
        accessorKey: "id",
        id: "id",
        header: "ID",
        size: 100,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.id}</span>
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
            <span>{row.original?.name}</span>
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Box className="text-start">
            <IconButton onClick={() => openModal(row.original.id)}>
              <i className="bi bi-pencil-square fs-5"></i>
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );
  const getData = () => {
    API(`default/categories`).then(({ data }) => {
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
      formData.append("id", rowsIds);
      formData.append("update", 2);

      await API.post(`/admin/Category`, formData);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "Are you sure you want to delete the selected Categories?",
      type: "warning",
      confirmButtonText: "Yes, Delete",
      isConfirmedMsg: "Suucess Deleted",
      cb: deleteCallBack,
    });
  };
  const saveHandelar = async (data) => {
    const formData = new FormData();
    const token = cookie.load("token");

    formData.append("token", token);
    formData.append("name", data?.name);
    formData.append("update", show?.id ? 1 : 0);
    formData.append("id", show?.id || 1);

    await API.post(`admin/Category`, formData)
      .then(({ data }) => {
        if (data.code != 200)
          return getMessage("error", "please choose at least one element");

        getData();
        closeModal();
        reset({
          name: "",
        });
        setPersonName([]);
      })
      .catch(() => {
        getMessage("error", "please choose at least one element");
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

  // get permtions
  useEffect(() => {
    const token = cookie.load("token");
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
      title="Categories"
      renderButtons={() => (
        <div className="flex-center">
          <ButtonGroup className="me-4">
            {}

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

          <Button
            onClick={() => openModal(0)}
            variant="primary"
            className="flex-center text-white"
          >
            <span className="me-1">Add</span>
            <AiOutlinePlus size={20} />
          </Button>
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
          <Modal.Title>Add Category</Modal.Title>

          <button className="btn-close ms-auto me-0" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Row className="mb-3">
              <Col lg="12">
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Form.Control {...register("name")} id="name" type="text" />
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

export default Categories;

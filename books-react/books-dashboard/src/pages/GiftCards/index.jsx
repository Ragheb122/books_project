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
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

// import { data as collectedData } from "./makeData";
import { Button, ButtonGroup, Col, FormGroup, Row } from "react-bootstrap";

import { getCheckModal } from "../../utils/getModal";

// icons
import { MdNotInterested } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { Form, Modal } from "react-bootstrap";
import { InputGroup, Label } from "reactstrap";

// forms
import { useForm } from "react-hook-form";

// cookies
import cookie from "react-cookies";

// apis
import API from "../../utils/API";
import moment from "moment";
import getMessage from "../../utils/getMessage";

// placeholder data
import { data as collectedData } from "./makeData";

const selectAccess = [
  "المستخدمون",
  "السائقين",
  "الطلبات",
  "انواع المركبات",
  "الباقات",
  "المدن",
  "اسعار المناطق",
  "الصفحات",
  "الاشعارات",
  "الاعدادات",
  "المدراء",
];

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

const GiftCards = () => {
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
            <span>{row.original?.username}</span>
          </Box>
        ),
      },
      {
        accessorKey: "amount",
        id: "amount",
        header: "Amount",
        size: 250,
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{row.original?.amount}</span>
          </Box>
        ),
      },
      {
        accessorKey: "status",
        id: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Box
            className={`w-fit text-center px-2 py-1 rounded-3 m-auto ${
              !row.original?.status ? "bg-danger" : "bg-movee"
            }`}
          >
            <span className="text-white">
              {row.original?.status ? "Sent" : "Not Sent"}
            </span>
          </Box>
        ),
      },
      {
        id: "createdAt",
        header: "created At",
        Cell: ({ row }) => (
          <Box className="text-start">
            <span>{moment(row.original?.sentAt).fromNow()}</span>
          </Box>
        ),
      },
    ],
    []
  );
  const getData = () => {
    const token = cookie.load("token");

    API(`/admin/RedeemRequests?token=${token}`).then(({ data }) => {
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
      alert("لم تحدد اي عنصر");
    }

    const deleteCallBack = async () => {
      const token = cookie.load("token");

      // await API(`/admin/destroyadmin?token=${token}&id=${rowsIds}`);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "هل انت متاكد من انك تريد حذف المدراء المحدده",
      type: "warning",
      confirmButtonText: "نعم حذف",
      isConfirmedMsg: "تم الحذف بنجاح",
      cb: deleteCallBack,
    });
  };
  const activeSelection = () => {
    const rowsIds = getRowsIds();

    if (!rowsIds?.length) {
      alert("لم تحدد اي عنصر");
    }

    const deleteCallBack = async () => {
      const formData = new FormData();
      const token = cookie.load("token");

      formData.append("token", token);
      formData.append("id", rowsIds);

      await API.post(`/admin/AcceptReedemRequest`, formData);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "Do you want active selected Cards",
      type: "warning",
      confirmButtonText: "Yes, Active",
      isConfirmedMsg: "Success! Active cards",
      cb: deleteCallBack,
    });
  };
  const disActiveSelection = () => {
    const rowsIds = getRowsIds();

    if (!rowsIds?.length) {
      alert("لم تحدد اي عنصر");
    }

    const deleteCallBack = async () => {
      const formData = new FormData();
      const token = cookie.load("token");

      formData.append("token", token);
      formData.append("id", rowsIds);
      formData.append("event", "not_active");

      // await API.post(`admin/admins/changeStatus`, formData);
      getData();
      setRowSelectionIdx({});
    };

    getCheckModal({
      title: "هل انت متاكد من انك تريد تعطيل المداراء المحددين",
      type: "warning",
      confirmButtonText: "نعم تعطيل",
      isConfirmedMsg: "تم التعطيل بنجاح",
      cb: deleteCallBack,
    });
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

    // await API.post(show?.id ? `/admin/updateadmin` : "/admin/admins", formData)
    //   .then(({ data }) => {
    //     if (data.code != 200)
    //       return getMessage("error", "يرجي ملي جميع الحقول");

    //     getData();
    //     closeModal();
    //     reset({
    //       name: "",
    //       email: "",
    //       password: "",
    //       confirm_password: "",
    //       mobile: "",
    //       country_id: "",
    //       permissions: "",
    //     });
    //     setPersonName([]);
    //   })
    //   .catch(() => {
    //     getMessage("error", "يرجي ملي جميع الحقول");
    //   });
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

  // get permtions
  useEffect(() => {
    const token = cookie.load("token");

    // API(`admin/admins/create`).then(({ data }) => {
    //   setSelectAccess(
    //     data?.Data?.map((permtion) => ({
    //       id: permtion?.id,
    //       name: permtion?.name,
    //     }))
    //   );
    // });

    // API(`admin/countries?token=${token}`).then(({ data }) => {
    //   setCountrys(
    //     data?.data?.map((country) => ({
    //       id: country.id,
    //       name: country.name,
    //     }))
    //   );
    // });
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
      title="Gift Cards"
      renderButtons={() => (
        <div className="flex-center">
          <ButtonGroup className="me-4">
            <Button
              onClick={activeSelection}
              disabled={!isBtnActive}
              variant="primary"
              className="flex-center text-white"
            >
              <span className="me-1">Active</span>
              <i className="bi bi-check2 fs-5 flex-center" />
            </Button>

            {/* <Button
              onClick={disActiveSelection}
              disabled={!isBtnActive}
              variant="warning"
              className="flex-center text-white"
            >
              <span className="me-1">Not Active</span>
              <MdNotInterested size={20} />
            </Button> */}

            {/* <Button
              onClick={deleteRows}
              disabled={!isBtnActive}
              variant="danger"
              className="flex-center text-white"
            >
              <span className="me-1">Delete</span>
              <i className="bi bi-trash3" />
            </Button> */}
          </ButtonGroup>

          {/* <Button
            onClick={() => openModal(0)}
            variant="primary"
            className="flex-center text-white"
          >
            <span className="me-1">Add</span>
            <AiOutlinePlus size={20} />
          </Button> */}
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
          <Modal.Title>تعديل او اضافة مدير</Modal.Title>

          <button className="btn-close ms-auto me-0" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Row className="mb-3">
              <Col lg="6">
                <FormGroup>
                  <Label for="name">الاسم</Label>
                  <Form.Control {...register("name")} id="name" type="text" />
                </FormGroup>
              </Col>

              <Col lg="6">
                <FormGroup>
                  <Label for="email">البريد الالكتروني</Label>
                  <Form.Control {...register("email")} id="email" type="text" />
                </FormGroup>
              </Col>
            </Row>

            {!show?.id && (
              <Row className="mb-3">
                <Col lg="6">
                  <FormGroup>
                    <Label for="password">كلمة المرور</Label>
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
                    <Label for="confirm_password">تاكيد كلمة المرور</Label>
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
                  <Label for="country_id">البلد</Label>
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
                  <Label for="mobile">موبايل</Label>
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
                  <Label for="access">صلاحية</Label>
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
            حفظ
          </Button>

          <Button variant="danger" onClick={closeModal}>
            الغاء
          </Button>
        </Modal.Footer>
      </Modal>
    </FullLayout>
  );
};

export default GiftCards;

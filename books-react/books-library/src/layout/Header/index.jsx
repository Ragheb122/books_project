import React, { useContext, useEffect, useState } from "react";

import { Modal, Form, Button, Row, Col, Card } from "react-bootstrap";

// context
import UserContext from "../../utils/context/UserContext";

// components
import Logo from "../../components/Logo";
import { Link, useNavigate } from "react-router-dom";

import cookie from "react-cookies";
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

import { FormGroup } from "react-bootstrap";

//Material-UI Imports
import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

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

const navs = [
  { title: "Home", href: "/" },
  // { title: "For You", href: "/for_you" },
  { title: "Static Books", href: "/static_books" },
  { title: "About", href: "/about" },

];

const Navbar = () => {
  const navigate = useNavigate();
  const userData = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [showModalBook, setShowModalBook] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  const [title, setTitle] = useState();
  const [image, setImage] = useState({});

  const [category, setCategory] = useState([]);
  const [categoryiesSelect, setCategoryiesSelect] = useState([]);

  const logout = () => {
    cookie.remove("token", { path: "/" });
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalBook = () => {
    setShowModalBook(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const token = cookie.load("token");

    const forData = new FormData();
    forData.append("token", token);
    forData.append("amount", amount);

    API.post("/userprofile/RedeemGiftCard", forData)
      .then(({ data }) => {
        if (data.code == 200) {
          // Save profile changes here
          getMsg("success create Gift Card", "success");
          return setShowModal(false);
        }

        getMsg(data?.error);
      })
      .catch((err) => {
        getMsg(err.message);
      });
  };

  const handleSubmitBook = (e) => {
    e?.preventDefault();
    const selectedIds = categoryiesSelect
      .filter((item) => category.includes(item.name))
      .map((item) => item.id);

    const token = cookie.load("token");
    const forData = new FormData();

    forData.append("token", token);
    forData.append("title", title);
    forData.append("description", description);
    forData.append("image", image);
    selectedIds?.forEach((id, idx) => {
      forData.append(`genera[${idx}]`, id);
    });

    API.post("/posts/addpost", forData)
      .then(({ data }) => {
        if (data.code == 200) {
          // Save profile changes here
          getMsg("success share new book", "success");
          return setShowModalBook(false);
        }

        getMsg(data?.error);
      })
      .catch((err) => {
        getMsg(err.message);
      });
  };

  const handleChange = ({ target }) => {
    const { value } = target;

    setCategory(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    API(`/default/categories`).then(({ data }) => {
      setCategoryiesSelect(data?.Data);
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid py-3 px-md-5">
        {/* Logo */}
        <Logo clickble size={60} />

        {/* زر الـ Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* القائمة */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navs.map((link, idx) => (
              <li className="nav-item" key={idx}>
                <Link className="nav-link" to={link.href}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* الأزرار على اليسار */}
          <ul className="navbar-nav ms-auto flex-center">
            <li className="nav-item me-2">
              <span
                onClick={() => setShowModal(true)}
                style={{ width: 50, height: 50 }}
                className="flex-center btn btn-icon btn-lg btn-primary rounded-circle"
              >
                <i className="bi bi-gift-fill" />
              </span>
            </li>
            {/* <li className="nav-item me-1">
              <Link
                to={`/chat`}
                style={{ width: 50, height: 50 }}
                className="flex-center btn btn-icon btn-lg btn-secondary rounded-circle"
              >
                <i className="bi bi-chat-dots-fill"></i>
              </Link>
            </li> */}
            <li className="nav-item ms-1">
              <span
                onClick={() => setShowModalBook(true)}
                style={{ width: 50, height: 50 }}
                className="flex-center btn btn-icon btn-lg btn-primary rounded-circle"
              >
                <i className="bi bi-plus fs-2"></i>
              </span>
            </li>
            <li className="nav-item dropdown ">
              <div
                className="nav-link m-0"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={userData.userImage}
                  alt="Profile"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </div>
              <ul
                style={{ left: "-95px" }}
                className="dropdown-menu"
                aria-labelledby="navbarDropdown"
              >
                <li className="cu-pointer text-center">
                  <Link
                    className="dropdown-item"
                    to={`/profile/${userData?.userID}`}
                  >
                    Profile
                  </Link>
                </li>
                <li onClick={logout} className="text-center">
                  <button className="mt-2 btn btn-danger">Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Gift Card */}
      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Redeem Gift Card</Modal.Title>
          <div
            onClick={handleCloseModal}
            className="text-muted fs-4 cu-pointer me-2"
          >
            X
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Gift Card 1</Card.Title>
                    <Card.Text>Amount: $10</Card.Text>
                    <Form.Check
                      type="radio"
                      name="giftCard"
                      value="10"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Gift Card 2</Card.Title>
                    <Card.Text>Amount: $25</Card.Text>
                    <Form.Check
                      type="radio"
                      name="giftCard"
                      value="25"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Gift Card 3</Card.Title>
                    <Card.Text>Amount: $50</Card.Text>
                    <Form.Check
                      type="radio"
                      name="giftCard"
                      value="50"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Redeem
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* new book */}
      <Modal centered show={showModalBook} onHide={handleCloseModalBook}>
        <Modal.Header>
          <Modal.Title>Share New Book</Modal.Title>
          <div
            onClick={handleCloseModalBook}
            className="text-muted fs-4 cu-pointer me-2"
          >
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitBook}>
            <Form.Group controlId="formBasicTitle" className="mt-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicTitle" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicImage" className="mt-2">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <FormGroup className="d-flex flex-column mt-3">
              <Form.Label>Category</Form.Label>
              <Select
                id="category"
                multiple
                value={category}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {categoryiesSelect?.map((permtion, idx) => (
                  <MenuItem key={idx} value={permtion?.name}>
                    <Checkbox
                      checked={category?.indexOf(permtion?.name) > -1}
                    />
                    <ListItemText primary={permtion?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>

            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Share
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </nav>
  );
};

export default Navbar;

import React, { useCallback, useContext, useEffect, useState } from "react";

// components
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import BookCard from "../../components/BookCard";

// Main Layout
import Layout from "../../layout";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../utils/API";
import getMsg from "../../utils/getMsg";
import userDataContext from "../../utils/context/UserContext";

// cookies
import cookie from "react-cookies";
import Rate from "../../components/Rate";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const userData = useContext(userDataContext);
  const [isOwner, setIsOwner] = useState(false);
  const [name, setName] = useState("Loading...");

  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("Loading...");
  const [phone, setPhone] = useState("Loading...");

  const [userImage, setUserImage] = useState(
    "https://assets.materialup.com/uploads/b78ca002-cd6c-4f84-befb-c09dd9261025/preview.png"
  );
  const [profileImg, setProfileImg] = useState({});
  const [defaultRate, setDefailtRate] = useState({});
  const [rateBook, setRate] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);

  const getData = useCallback(
    (data) => {
      API(`/default/UserInfoById?profile=true&id=${id}`)
        .then(({ data }) => {
          if (data?.code == 200) {
            setLocation(data?.Data?.location);
            setRate(data?.Data?.rate);
            setDefailtRate(data?.Data?.rate);
            setUserId(data?.Data?.userID);
            setName(data?.Data?.name);
            setEmail(data?.Data?.email);
            setPhone(data?.Data?.mobile);
            setUserImage(data?.Data?.userImage);
            setProducts(
              data?.Data?.posts?.map((book) => ({
                id: book.id,
                name: book?.title,
                description: book?.description,
                image: book?.image,
                rate: book?.rate,
                traded: book?.traded,
                user: {
                  id: data?.Data?.userID,
                  name: data?.Data?.name,
                  email: data?.Data?.email,
                  mobile: data?.Data?.mobile,
                },
              }))
            );
          } else {
            navigate("/home");
          }
        })
        .catch(() => {
          navigate("/home");
        });
    },
    [id, navigate]
  );

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    const token = cookie.load("token");

    e?.preventDefault();
    const forData = new FormData();

    forData.append("name", name);
    forData.append("email", email);
    forData.append("mobile", phone);
    forData.append("token", token);
    password && forData.append("password", password);
    confirmPassword && forData.append("repassword", confirmPassword);
    Object.keys(profileImg) && forData.append("image", profileImg);

    API.post("/userprofile/EditProfile", forData)
      .then(({ data }) => {
        if (data.code == 200) {
          // Save profile changes here
          getData();
          return setShowModal(false);
        }

        getMsg(data?.error);
      })
      .catch((err) => {
        getMsg(err.message);
      });
  };

  const handelClick = (rate) => {
    setRate(rate);

    const token = cookie.load("token");
    const formData = new FormData();

    formData.append("token", token);
    formData.append("rate", rate);
    formData.append("id", id);

    API.post("/userprofile/RateUser", formData).then(({ data }) => {
      if (data.code == 200) {
        getMsg("Success Added Rate", "success");
      }
    });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (userId == userData?.userID) {
      setIsOwner(true);
    }
  }, [userId, userData?.userID]);

  useEffect(() => {
    setSearchProducts(
      products?.filter((book) => book?.name?.startsWith(searchQuery))
    );
  }, [searchQuery, products]);

  return (
    <Layout>
      <Container>
        <Row className="mt-5">
          <Col xs={12} md={4} className="text-center">
            <Image
              style={{ width: 250, height: 250 }}
              src={userImage}
              roundedCircle
              fluid
            />
          </Col>
          <Col xs={12} md={8}>
            <h2>{name}</h2>
            {isOwner && (
              <Button
                className="d-block mb-2"
                variant="primary"
                onClick={handleEditClick}
              >
                Edit My Profile
              </Button>
            )}

            {isOwner && (
              <p className="mb-1 d-flex">
                <span className="me-1">rate:</span>
                <Rate numStars={defaultRate.rate || rateBook} />

                <span>
                  {defaultRate?.rate || 0} ({defaultRate?.amount || 0})
                </span>
              </p>
            )}

            <p className="mb-0">
              Phone: <span className="text-muted">{phone}</span>
            </p>
            <p className="mb-0">
              Email: <span className="text-muted">{email}</span>
            </p>
            <p className="mb-0">
              Location: <span className="text-muted">{location}</span>
            </p>
            <ul className="list-inline">
              <li className="list-inline-item">Books: {products.length}</li>
            </ul>

            {!isOwner && (
              <p className="mb-1 d-flex">
                <span className="me-1">rate:</span>
                <Rate
                  isClickable
                  numStars={defaultRate.rate || rateBook}
                  handelClick={handelClick}
                />

                <span>
                  {defaultRate?.rate || 0} ({defaultRate?.amount || 0})
                </span>
              </p>
            )}
          </Col>
        </Row>
        <hr className="mt-4" />
        <Row className="mt-3 pb-5 mb-3">
          <Col>
            <h3>Posts</h3>

            <div className="input-group mt-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Search for a book in books"
                aria-label="Search"
              />

              <button className="btn btn-primary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
              {(searchQuery ? searchProducts : products).map((product, idx) => (
                <BookCard
                  key={idx}
                  myBooks={isOwner}
                  data={product}
                  getPosts={getData}
                />
              ))}
            </div>

            <Modal centered show={showModal} onHide={handleCloseModal}>
              <Modal.Header>
                <Modal.Title>Edit Profile</Modal.Title>

                <div
                  onClick={handleCloseModal}
                  className="text-muted fs-4 cu-pointer me-2"
                >
                  X
                </div>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group
                    controlId="formBasicProfileImage"
                    className="mt-2"
                  >
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      label="Choose Profile Image"
                      onChange={(e) => setProfileImg(e.target.files[0])}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicName" className="mt-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail" className="mt-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPhone" className="mt-2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mt-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group
                    controlId="formBasicConfirmPassword"
                    className="mt-2"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-center mt-3">
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Profile;

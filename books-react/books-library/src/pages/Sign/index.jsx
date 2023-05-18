import React, { useEffect, useState } from "react";

// components
import Logo from "../../components/Logo";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

// utils
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";
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

const Sign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    repassword: "",
    image: null,
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [favBooks, setFavBooks] = useState([]);
  const [booksSelect, setBooksSelect] = useState([]);

  const submitHandler = (e) => {
    e?.preventDefault();
    const selectedIds = booksSelect
      .filter((item) => favBooks.includes(item.title))
      .map((item) => item.id);

    const data = new FormData();
    Object.keys(formData)?.forEach((key) => {
      data.append(key, formData[key]);
    });

    selectedIds?.forEach((bookId, idx) => {
      data.append(`books[${idx}]`, bookId);
    });
    data.append(`city`, selectedLocation);

    API.post("/default/register", data)
      .then(({ data }) => {
        if (data.code != 200 || data?.msg || data?.error) {
          return getMsg(data?.msg || data?.error, "error");
        }

        navigate("/login");
      })
      .catch((err) => {
        getMsg(err.message, "error");
      });
  };

  const changeHandler = (event) => {
    if (event.target.name === "image") {
      setFormData({ ...formData, image: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleChange = ({ target }) => {
    const { value } = target;

    setFavBooks(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    API.get("/default/books")
      .then(({ data }) => {
        if (data?.code == 200) {
          setBooksSelect(data?.Data);
        }
      })
      .catch((err) => {
        getMsg(err.message, "error");
      });

    API(`/default/cities`).then(({ data }) => {
      if (data?.code == 200) {
        setLocations(data?.Data);
      }
    });
  }, []);

  return (
    <div className="container-fluid pb-5 mb-4">
      <div className="py-3 px-2 logo ms-auto w-fit">
        <Logo clickble size={80} />
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-lg-4">
          <h3 className="ms-auto w-fit mb-4">Create Account</h3>
          <div className="bg-white p-4 shadow-sm border rounded-4 py-4">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Image</Form.Label>
                <Form.Control
                  type="file"
                  id="image"
                  name="image"
                  onChange={changeHandler}
                  hidden
                />

                <div className="text-center">
                  <label htmlFor="image">
                    <Image
                      className="cu-pointer border"
                      width={100}
                      height={100}
                      src={
                        formData.image
                          ? URL.createObjectURL(formData.image)
                          : "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"
                      }
                      alt="Avatar"
                      roundedCircle
                    />
                  </label>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="d-block">
                  Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="password"
                    type={passwordShown ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                  />

                  <Button
                    variant="outline-secondary"
                    onClick={() => setPasswordShown(!passwordShown)}
                  >
                    {passwordShown ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="d-block">
                  Confirm Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="repassword"
                    type={confirmPasswordShown ? "text" : "password"}
                    name="repassword"
                    value={formData.repassword}
                    onChange={changeHandler}
                  />

                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setConfirmPasswordShown(!confirmPasswordShown)
                    }
                  >
                    {confirmPasswordShown ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="d-block">
                  City
                </Form.Label>
                <select
                  className="form-select custom-select-width"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations?.map((location, idx) => (
                    <option key={idx} value={location?.id}>
                      {location?.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  id="mobile"
                  placeholder="Enter mobile number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={changeHandler}
                />
              </Form.Group>

              <Form.Group className="d-flex flex-column mt-3">
                <Form.Label>Favorite Books</Form.Label>
                <Select
                  id="favoriteBooks"
                  multiple
                  value={favBooks}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {booksSelect?.map((permtion, idx) => (
                    <MenuItem key={idx} value={permtion?.title}>
                      <Checkbox
                        checked={favBooks?.indexOf(permtion?.title) > -1}
                      />
                      <ListItemText primary={permtion?.title} />
                    </MenuItem>
                  ))}
                </Select>
              </Form.Group>

              <p className="m-0">
                Already have an account? <Link to={`/login`}>Log In</Link>
              </p>
              <Button
                className="mt-3 mx-auto d-block"
                variant="primary"
                type="submit"
              >
                Create Account
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;

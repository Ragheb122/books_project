import React, { useState } from "react";

// components
import { Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";

// utils
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

import token from "react-cookies";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);

  const submitHandler = (e) => {
    e?.preventDefault();

    const data = new FormData();
    Object.keys(formData)?.forEach((key) => {
      data.append(key, formData[key]);
    });

    API.post("/default/login", data)
      .then(({ data }) => {
        if (data.code == 200) {
          token.save("token", data?.Data?.token);
          return window.location.reload();
        }

        getMsg(
          data?.msg || data?.error || "email or password in invalid",
          "error"
        );
      })
      .catch((err) => {
        getMsg(err.message, "error");
      });
  };

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="container-fluid BG" style={{ backgroundImage: `url(${"https://images6.alphacoders.com/330/330109.jpg"})`}}>
      <div className="py-3 px-2 logo ms-auto w-fit">
        <Logo clickble size={80} />
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-lg-4">
        <h3 style={{ textAlign: "center" }}>Login</h3>


          <div className="bg-white p-4 shadow-sm border rounded-4 py-4" style={
            {backgroundImage: `url(${"https://images.unsplash.com/photo-1615800098779-1be32e60cca3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"})`}
          }>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="d-block">
                  password
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

              <div className="links d-flex justify-content-start gap-2">
                <Link to={`/sign`}>
                  <p className="text-start">Register a new account</p>
                </Link>
                <span>or</span>
                <Link to={`/forget-password`}>
                  <p className="text-start">Forgot your password?</p>
                </Link>
              </div>

              <Button
                className="mt-3 mx-auto d-block"
                variant="primary"
                type="submit"
              >
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
import { Input, Label } from "reactstrap";

import cover_img from "../../assets/images/background/cover_img.jpg";

// styles
import "./Login.scss";

// cookies
import cookie from "react-cookies";

// apis
import API from "../../utils/API";

const createDateAfter = (days) => {
  // Create a new date object
  const currentDate = new Date();

  // Calculate the number of milliseconds in 100 days
  const millisecondsInOneDay = 86400000; // 1000 ms * 60 s * 60 m * 24 h
  const millisecondsInOneHundredDays = days * millisecondsInOneDay;

  // Set the new date to be days from now
  const futureDate = new Date();
  futureDate.setTime(currentDate.getTime() + millisecondsInOneHundredDays);

  // Log the new date to the console
  return futureDate;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandelar = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    API.post(`/admin/login`, formData)
      .then(({ data }) => {
        if (data?.code == 200) {
          const expires = createDateAfter(100);
          cookie.save("token", data?.Data?.token, { expires });

          return window.location.reload();
        }
        alert("You are not Admin!");
      })
      .catch(() => {
        alert("unknown error");
      });
  };

  return (
    <Row className="m-0">
      <Col style={{ minHeight: "100vh" }} md="4" className="p-0 border">
        <div className="px-5 pt-5">
          <img
            width={100}
            src={`data:image/png;base64,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`}
            alt="logo"
          />
          <p className="mt-3">Login to the control panel</p>

          <div className="form px-3">
            <div className="mb-3">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2"
                  id="email"
                  name="email"
                  type="text"
                />
              </FormGroup>
            </div>

            <div className="mb-3">
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2"
                  id="password"
                  name="password"
                  type="password"
                />
              </FormGroup>
            </div>

            <div className="mb-3">
              <button onClick={loginHandelar} className="btn btn-primary px-5">
                Login
              </button>
            </div>
          </div>
        </div>
      </Col>
      <Col style={{ minHeight: "100vh" }} md="8" className="p-0">
        <div className="img h-100 position-relative">
          <div className="cover_backdrob" />
          <img
            style={{
              objectFit: "cover",
            }}
            src={cover_img}
            alt=""
            className="cover-img w-100 h-100"
          />
        </div>
      </Col>
    </Row>
  );
};

export default Login;

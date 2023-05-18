import React, { useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
import { Input, Label } from "reactstrap";

import cover_img from "../../assets/images/background/cover_img.jpg";
import Logo from "../../assets/images/logos/monsterlogo.png";

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
        alert("اسم حساب او كلمة مرور غير صحيحه");
      })
      .catch(() => {
        alert("خطأ غير معروف");
      });
  };

  return (
    <Row className="m-0">
      <Col style={{ minHeight: "100vh" }} md="4" className="p-0 border">
        <div className="px-5 pt-5">
          <img
            width={100}
            src={`https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000`}
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

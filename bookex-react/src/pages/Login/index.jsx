import React, { useState } from "react";

// components
import { Form, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

// utils
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData)?.forEach((key) => {
      data.append(key, formData[key]);
    });

    API.post("/default/login", formData)
      .then(({ data }) => {
        if (data.code == 200) {
          return "success";
        }

        getMsg(data?.msg, "error");
      })
      .catch((err) => {
        getMsg(err.message, "error");
      });
  };

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="py-3 px-2 logo ms-auto w-fit">
        <Logo clickble size={80} />
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-lg-4">
          <h3 className="ms-auto w-fit mb-4">تسجيل الدخول</h3>

          <div className="bg-white p-4 shadow-sm border rounded-4 py-4">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" dir="rtl">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="أدخل البريد الإلكتروني"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="text-end d-block">
                  كلمة المرور
                </Form.Label>
                <InputGroup>
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
                  <Form.Control
                    dir="rtl"
                    id="password"
                    type={passwordShown ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                  />
                </InputGroup>
              </Form.Group>

              <div className="links d-flex justify-content-end gap-2">
                <Link to={`/sign`}>
                  <p className="text-end">تسجيل حساب جديد</p>
                </Link>
                <span>او</span>
                <Link to={`/forget-password`}>
                  <p className="text-end">هل نسيت كلمة السر ؟</p>
                </Link>
              </div>

              <Button
                className="mt-3 mx-auto d-block"
                variant="primary"
                type="submit"
              >
                تسجيل الدخول
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

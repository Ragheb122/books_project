import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import Logo from "../../components/Logo";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirm_password: "",
  });
  const [currentStep, setCurrentStep] = useState(1);

  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const submitEmailHandler = (e) => {
    e.preventDefault();
    console.log("Submit Email", formData.email);
    setCurrentStep(2);
  };

  const submitCodeHandler = (e) => {
    e.preventDefault();
    console.log("Submit Code", formData.code);
    setCurrentStep(3);
  };

  const submitNewPasswordHandler = (e) => {
    e.preventDefault();
    console.log("Submit New Password", formData.password);
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
          <h3 className="ms-auto w-fit mb-4">إستعادة كلمة المرور</h3>
          <div className="bg-white p-4 shadow-sm border rounded-4 py-4">
            {currentStep === 1 && (
              <Form onSubmit={submitEmailHandler}>
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

                <p className="text-end m-0">
                  اليس لديك حساب ؟ <Link to={`/sign`}>تسجيل</Link>
                </p>
                <div className="text-center">
                  <Button
                    className="mt-3 mx-2 d-inline-block"
                    variant="primary"
                    type="submit"
                  >
                    التالي
                  </Button>
                </div>
              </Form>
            )}

            {currentStep === 2 && (
              <Form onSubmit={submitCodeHandler}>
                <Form.Group className="mb-3" dir="rtl">
                  <Form.Label>الرمز المرسل لبريدك الإلكتروني</Form.Label>
                  <Form.Control
                    type="text"
                    id="code"
                    placeholder="أدخل الرمز المرسل لبريدك الإلكتروني"
                    name="code"
                    value={formData.code}
                    onChange={changeHandler}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    className="mt-3 mx-2 d-inline-block"
                    variant="primary"
                    type="submit"
                  >
                    التالي
                  </Button>
                  <Button
                    className="mt-3 mx-2 d-inline-block"
                    variant="outline-primary"
                    onClick={() => setCurrentStep(1)}
                  >
                    تراجع
                  </Button>
                </div>
              </Form>
            )}

            {currentStep === 3 && (
              <Form onSubmit={submitNewPasswordHandler}>
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

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password" className="text-end d-block">
                    تأكيد كلمة المرور
                  </Form.Label>

                  <InputGroup>
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

                    <Form.Control
                      dir="rtl"
                      id="confirm_password"
                      type={confirmPasswordShown ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={changeHandler}
                    />
                  </InputGroup>
                </Form.Group>

                <div className="text-center">
                  <Button
                    className="mt-3 mx-2 d-inline-block"
                    variant="primary"
                    type="submit"
                  >
                    تعديل
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

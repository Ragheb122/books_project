import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import Logo from "../../components/Logo";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

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
    e?.preventDefault();

    API(`default/SendCode?email=${formData.email}`, formData)
      .then(({ data }) => {
        if (data.code == 200) {
          return setCurrentStep(2);
        }

        getMsg(data?.msg || data?.error, "error");
      })
      .catch((err) => {
        getMsg(err.message, "error");
      });
  };

  const submitCodeHandler = (e) => {
    e?.preventDefault();
    setCurrentStep(3);
  };

  const submitNewPasswordHandler = (e) => {
    e?.preventDefault();

    const formData_ = new FormData();

    formData_.append("email", formData.email);
    formData_.append("code", formData.code);
    formData_.append("password", formData.password);
    formData_.append("repassword", formData.confirm_password);

    API.post(`default/CheckCode`, formData_)
      .then(({ data }) => {
        if (data.code == 200) {
          return setCurrentStep(3);
        }

        getMsg(data?.msg || data?.error, "error");
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
      <div className="logo py-3 px-2 ms-auto w-fit">
        <Logo clickable size={80} />
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-lg-4">
          <h3 className="mb-4 ms-auto w-fit">Password Recovery</h3>
          <div className="bg-white p-4 shadow-sm border rounded-4 py-4">
            {currentStep === 1 && (
              <form onSubmit={submitEmailHandler}>
                <div className="mb-3">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                  />
                </div>
                {""}
                <p className="m-0">
                  Don't have an account? <Link to={`/sign`}>Sign Up</Link>
                </p>
                <div className="text-center">
                  <button
                    className="mt-3 mx-2 d-inline-block btn btn-primary"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={submitCodeHandler}>
                <div className="mb-3">
                  <label for="code">Code sent to your email</label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    placeholder="Enter code sent to your email"
                    name="code"
                    value={formData.code}
                    onChange={changeHandler}
                  />
                </div>

                <div className="text-center">
                  <button
                    className="mt-3 mx-2 d-inline-block btn btn-primary"
                    type="submit"
                  >
                    Next
                  </button>
                  <button
                    className="mt-3 mx-2 d-inline-block btn btn-outline-primary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={submitNewPasswordHandler}>
                <div className="mb-3">
                  <label for="password" className="d-block">
                    New Password
                  </label>

                  <div className="input-group">
                    <input
                      id="password"
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                    />

                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setPasswordShown(!passwordShown)}
                    >
                      {passwordShown ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label for="confirm_password" className="d-block">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <input
                      id="confirm_password"
                      type={confirmPasswordShown ? "text" : "password"}
                      className="form-control"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={changeHandler}
                    />

                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() =>
                        setConfirmPasswordShown(!confirmPasswordShown)
                      }
                    >
                      {confirmPasswordShown ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    className="mt-3 mx-2 d-inline-block btn btn-primary"
                    type="submit"
                  >
                    Update
                  </button>
                  <button
                    className="mt-3 mx-2 d-inline-block btn btn-outline-primary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

import React, { useState } from "react";

// components
import Logo from "../../components/Logo";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

// utils
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

const Sign = () => {
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

  const submitHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData)?.forEach((key) => {
      data.append(key, formData[key]);
    });

    API.post("/default/register", formData)
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
    if (event.target.name === "image") {
      setFormData({ ...formData, image: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  return (
    <div className="container-fluid pb-5 mb-4">
      <div className="py-3 px-2 logo ms-auto w-fit">
        <Logo clickble size={80} />
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-lg-4">
          <h3 className="ms-auto w-fit mb-4">إنشاء حساب</h3>
          <div className="bg-white p-4 shadow-sm border rounded-4 py-4">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" dir="rtl">
                <Form.Label className="d-block">الصورة</Form.Label>
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

              <Form.Group className="mb-3" dir="rtl">
                <Form.Label>الاسم</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل الاسم"
                  value={formData.name}
                  onChange={changeHandler}
                />
              </Form.Group>
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
                    id="repassword"
                    type={confirmPasswordShown ? "text" : "password"}
                    name="repassword"
                    value={formData.repassword}
                    onChange={changeHandler}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" dir="rtl">
                <Form.Label>الجوال</Form.Label>
                <Form.Control
                  type="text"
                  id="mobile"
                  placeholder="أدخل رقم الجوال"
                  name="mobile"
                  value={formData.mobile}
                  onChange={changeHandler}
                />
              </Form.Group>

              <p className="text-end m-0">
                لديك حساب بالفعل ؟ <Link to={`/login`}>تسجيل دخول</Link>
              </p>
              <Button
                className="mt-3 mx-auto d-block"
                variant="primary"
                type="submit"
              >
                إنشاء حساب
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;

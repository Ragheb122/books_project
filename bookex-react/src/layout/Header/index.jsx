import React from "react";

// components
import Logo from "../../components/Logo";
import { Link } from "react-router-dom";

const navs = [
  { title: "الرئيسيه", href: "/" },
  { title: "الكتب", href: "/books" },
];

const Navbar = () => {
  const logout = () => {};

  return (
    <nav dir="rtl" className="navbar navbar-expand-lg navbar-dark bg-dark">
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
          <ul className="navbar-nav me-auto">
            {navs.map((link, idx) => (
              <li className="nav-item" key={idx}>
                <Link className="nav-link" to={link.href}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* الأزرار على اليسار */}
          <ul className="navbar-nav me-auto flex-center">
            <li className="nav-item ms-2">
              <span
                style={{ width: 50, height: 50 }}
                className="flex-center btn btn-icon btn-lg btn-primary rounded-circle"
              >
                <i className="bi bi-gift-fill" />
              </span>
            </li>
            <li className="nav-item ms-1">
              <Link
                to={`/chat`}
                style={{ width: 50, height: 50 }}
                className="flex-center btn btn-icon btn-lg btn-secondary rounded-circle"
              >
                <i className="bi bi-chat-dots-fill"></i>
              </Link>
            </li>
            <li className="nav-item me-1">
              <span
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
                  src={`https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg`}
                  alt="Profile"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </div>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li className="cu-pointer text-center">
                  <Link className="dropdown-item" to={`/profile/${1}`}>
                    الملف الشخصي
                  </Link>
                </li>
                <li onClick={logout} className="text-center">
                  <button className="mt-2 btn btn-danger">تسجيل الخروج</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

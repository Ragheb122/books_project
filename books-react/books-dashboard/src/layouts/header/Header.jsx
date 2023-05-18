import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import IconButton from "@mui/material/IconButton";
// import "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000" from "../../assets/images/logos/monsterlogo.png";
import user1 from "../../assets/images/users/user1.jpg";

import adminDataContext from "../../utils/context/AdminData";

import cookie from "react-cookies";

const navs = [
  {
    title: "الاعدادات والخدمات",
    href: "/services",
  },
  {
    title: "التحليلات",
    href: "/statistics",
  },
];

const Header = ({ showMobmenu }) => {
  const adminData = useContext(adminDataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandelar = () => {
    cookie.remove("token");

    window.location.reload();
  };

  return (
    <Navbar color="primary" dark expand="md">
      <div className="d-flex align-iteme-center">
        <NavbarBrand href="/" className="d-lg-none">
          <img
            width={50}
            src={
              "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000"
            }
            alt="logo"
          />
        </NavbarBrand>

        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>

      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        {/* <p className="small text-white mt-md-0 mt-3 mb-0">الوصول السريع / </p>
        <Nav className="ms-2" navbar>
          {navs?.map((nav, idx) => (
            <Link key={idx} to={nav.href} className="text-decoration-none">
              <NavItem>
                <span className="nav-link">{nav.title}</span>
              </NavItem>
            </Link>
          ))}
        </Nav> */}

        <div className="btns ms-auto me-0 d-flex justify-content-center align-iteme-center">
          {/* <Dropdown
            isOpen={settingsDropdownOpen}
            toggle={() => setSettingsDropdownOpen((prevState) => !prevState)}
          >
            <DropdownToggle color="primary">
              <div style={{ lineHeight: "0px" }}>
                <i className="bi bi-gear fs-5" />
              </div>
            </DropdownToggle>
            <DropdownMenu className="text-start" dir="ltr">
              <DropdownItem header>الاعدادات</DropdownItem>
              <Link to={`/settings`} className="text-decoration-none text-dark">
                <DropdownItem>
                  <span className="me-2">الاعدادات العامة</span>
                  <i className="bi bi-gear" />
                </DropdownItem>
              </Link>
              <Link
                to={`/system_seo`}
                className="text-decoration-none text-dark"
              >
                <DropdownItem>
                  <span className="me-2">اعدادات Seo</span>
                  <i className="bi bi-globe" />
                </DropdownItem>
              </Link>
            </DropdownMenu>
          </Dropdown>

          <Link to={`/notifications`}>
            <IconButton className="btn">
              <div style={{ lineHeight: "0px" }}>
                <i className="bi bi-bell text-light" style={{ fontSize: 21 }} />
              </div>
            </IconButton>
          </Link> */}

          <Dropdown
            isOpen={dropdownOpen}
            toggle={() => setDropdownOpen((prevState) => !prevState)}
          >
            <DropdownToggle color="primary">
              <div style={{ lineHeight: "0px" }}>
                <img
                  src={user1}
                  alt="profile"
                  className="rounded-circle"
                  width="30"
                  height="30"
                />
              </div>
            </DropdownToggle>
            <DropdownMenu className="text-center" dir="ltr">
              <DropdownItem header>{adminData?.email}</DropdownItem>
              {/* <Link
                to={`/editMyProfile`}
                className="text-decoration-none text-dark"
              >
                <DropdownItem>
                  <span className="me-2">تعديل ملفي الشخصي</span>
                  <i className="bi bi-pencil-square" />
                </DropdownItem>
              </Link>
              <Link
                to={`/changeMyPassword`}
                className="text-decoration-none text-dark"
              >
                <DropdownItem>
                  <span className="me-2">تغيير كلمة المرور</span>
                  <i className="bi bi-key-fill" />
                </DropdownItem>
              </Link> */}
              <DropdownItem>
                <div
                  onClick={logoutHandelar}
                  className="btn btn-danger py-1 m-auto d-block w-fit"
                >
                  <i className="bi bi-power" />
                  <span className="ms-1">Logout</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default Header;

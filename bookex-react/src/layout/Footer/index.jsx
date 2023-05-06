import React from "react";
import Logo from "../../components/Logo";

const navs = [
  { title: "الرئيسيه", href: "/" },
  { title: "الكتب", href: "/books" },
];

const Footer = () => {
  return (
    <footer className="bg-dark text-light pb-5">
      <div className="container mb-5">
        <div dir="rtl" className="row align-items-center pb-5 pt-3">
          {/* اللوجو */}
          <div className="col-md-2 text-center ">
            <Logo clickble size={60} />
          </div>

          {/* الروابط */}
          <div className="col-md-6 text-md-end text-md-start">
            {/* العنوان */}
            <div className="text-center">
              <h6 className="text-muted mb-3">الروابط</h6>
            </div>

            <ul className="list-inline mb-0 p-0 text-center d-flex flex-column">
              {navs.map((link, idx) => (
                <li
                  className={`list-inline-item ${idx ? "mt-3" : ""}`}
                  key={idx}
                >
                  <a
                    href={link.href}
                    className="text-light text-decoration-none"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

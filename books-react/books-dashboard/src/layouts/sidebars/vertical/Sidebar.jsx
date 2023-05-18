import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Accounts",
    href: "/",
    icon: "bi bi-person-circle",
  },
  {
    title: "Posts",
    href: "/posts",
    icon: "bi bi-postage-fill",
  },
  {
    title: "Gift Cards",
    href: "/gift-cards",
    icon: "bi bi-gift-fill",
  },
  {
    title: "Categories",
    href: "/categories",
    icon: "bi bi-tags-fill",
  },
  // {
  //   title: "الحسابات",
  //   href: "/accounts",
  //   icon: "bi bi-person-circle",
  // },
  // {
  //   title: "الفواتير",
  //   href: "/bills",
  //   icon: "bi bi-wallet2",
  // },
  // {
  //   title: "الاعدادات والخدمات",
  //   href: "/services",
  //   icon: "bi bi-clipboard-data",
  // },
  // {
  //   title: "التحليلات",
  //   href: "/statistics",
  //   icon: "bi bi-pie-chart",
  // },

  // {
  //   title: "المدراء",
  //   href: "/admins",
  //   icon: "bi bi-shield-lock",
  // },
  // {
  //   title: "المستخدمون",
  //   href: "/users",
  //   icon: "bi bi-people",
  // },
  // {
  //   title: "المشايخ",
  //   href: "/shaikhs",
  //   icon: "bi bi-person",
  // },
  // {
  //   title: "المراجع",
  //   href: "/references",
  //   icon: "bi bi-book",
  // },
  // {
  //   title: "غلافات الإعلانات",
  //   href: "/banners",
  //   icon: "bi bi-image",
  // },
  // {
  //   title: "الدول",
  //   href: "/countries",
  //   icon: "bi bi-flag",
  // },
  // {
  //   title: "الأسئلة الشائعة",
  //   href: "/faqs",
  //   icon: "bi bi-question-circle",
  // },
  // {
  //   title: "طلبات المستخدمين",
  //   href: "/users_requests",
  //   icon: "bi bi-envelope",
  // },
  // {
  //   title: "الرسائل العملية",
  //   href: "/practical_messages",
  //   icon: "bi bi-chat-right-dots",
  // },
  // {
  //   title: "الأعمال المستحبة",
  //   href: "/works",
  //   icon: "bi bi-lightbulb",
  // },
  // {
  //   title: "رسائل التواصل",
  //   href: "/contact",
  //   icon: "bi bi-telephone",
  // },
  // {
  //   title: "الصفحات",
  //   href: "/pages",
  //   icon: "bi bi-file-earmark-text",
  // },
  // {
  //   title: "حسابات التواصل",
  //   href: "/social",
  //   icon: "bi bi-instagram",
  // },
];

const Sidebar = ({ showMobilemenu, isSideBarOpen }) => {
  let curl = useLocation();
  const location = curl.pathname;

  return (
    <div className="p-3">
      <div className="d-flex align-iteme-center justify-content-center">
        {isSideBarOpen && <Logo width={80} />}
        <div className="closeBtn ms-auto me-0 d-lg-none">
          <Button close size="sm" onClick={showMobilemenu} />
        </div>
      </div>
      <div className="pt-4 mt-2 pb-5">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem
              key={index}
              className={`rounded-4 ${
                location === navi.href ? "bg-primary" : "sidenav-bg"
              }`}
            >
              <Link to={navi.href} className="text-decoration-none">
                <span
                  className={`d-flex align-iteme-center
                    ${
                      location === navi.href
                        ? "text-white nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }`}
                >
                  <i className={navi.icon}></i>
                  {isSideBarOpen && (
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  )}
                </span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;

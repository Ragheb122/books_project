import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import { useState } from "react";

const FullLayout = ({ children, title, renderButtons: RenderButtons }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [open, setOpen] = useState(false);

  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        <aside
          style={{
            ...(!isSideBarOpen ? { width: "80px" } : {}),
            transition: ".6s",
            zIndex: 999,
          }}
          className={`sidebarArea shadow bg-white col-lg-4 ${
            !open ? "" : "showSidebar"
          }`}
        >
          <div className="position-relative">
            <div
              className="btn_ d-lg-block d-none"
              style={{
                position: "absolute",
                right: "-10px",
                top: "70px",
                zIndex: 999999999,
              }}
            >
              {isSideBarOpen ? (
                <i
                  onClick={() => setIsSideBarOpen(false)}
                  className="bi bi-arrow-left-circle-fill text-success fs-1 cu-pointer"
                ></i>
              ) : (
                <i
                  onClick={() => setIsSideBarOpen(true)}
                  className="bi bi-arrow-right-circle-fill text-success fs-1 cu-pointer"
                ></i>
              )}
            </div>

            <Sidebar
              isSideBarOpen={isSideBarOpen}
              showMobilemenu={() => showMobilemenu()}
            />
          </div>
        </aside>
        {/********Content Area**********/}

        <div className="contentArea col-lg-8">
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} />

          {/* under header */}
          <div className="container px-5 bg-white border py-2 Small shadow d-flex align-iteme-center justify-content-between flex-wrap">
            <p className="fs-3 m-0 text-dark">{title}</p>

            {RenderButtons && <RenderButtons />}
          </div>
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;

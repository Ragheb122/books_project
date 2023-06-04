import React from "react";

// components
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "calc(100vh - 106px)" }}>{children}</main>
    </div>
  );
};

export default Layout;

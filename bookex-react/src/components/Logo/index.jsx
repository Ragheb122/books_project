import React from "react";

import { useNavigate } from "react-router-dom";

const Logo = ({ size, clickble }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={clickble ? () => navigate("/") : null}
      className={`logo ${clickble ? "cu-pointer" : ""}`}
    >
      <img
        src={`https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000`}
        width={size || "100"}
        height={size || "100"}
        alt=""
      />
    </div>
  );
};

export default Logo;

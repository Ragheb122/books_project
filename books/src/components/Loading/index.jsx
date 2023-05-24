import React from "react";

import Logo from "../Logo";
import "../../style/loading.scss";

const Loading = () => {
  return (
    <div className="loading-page">
      <div className="loading-page__spinner flex-center flex-column">
        <Logo />

        <div className="flex-center mt-4 text-dark">
          <div className="loading-page__text ms-3 fs-2">Loading</div>
          <div className="dot1"></div>
          <div className="dot2"></div>
          <div className="dot3"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

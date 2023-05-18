import React from "react";

// import "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000" from "../../assets/images/logos/monsterlogo.png";
import "../../styles/loading.scss";

const Loading = () => {
  return (
    <div className="loading-page">
      <div className="loading-page__spinner flex-center flex-column">
        <img
          style={{ width: 150 }}
          src={
            "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000"
          }
          alt="Logo"
          className="loading-page__logo mb-4"
        />

        <div className="flex-center mt-4">
          <div className="loading-page__text me-3 fs-2">LOADING</div>
          <div className="dot1"></div>
          <div className="dot2"></div>
          <div className="dot3"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

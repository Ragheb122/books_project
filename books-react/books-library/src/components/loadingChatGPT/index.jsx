import React from "react";

import Logo from "../Logo";
import "../../style/loading.scss";

const LoadingChatGPT = () => {
    return (
        <div>
            <p><b>Generating response...</b></p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="Loading" width="50" height="50" />
        </div>
      );
};

export default LoadingChatGPT;

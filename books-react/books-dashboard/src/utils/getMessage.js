import { toast } from "react-toastify";

const getMessage = (type, msg) => {
  toast(msg, {
    position: "bottom-right",
    type,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export default getMessage;

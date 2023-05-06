import { toast } from "react-toastify";

const getMsg = (msg, type) => {
  return toast(msg, {
    position: "bottom-right",
    type,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export default getMsg;

import Swal from "sweetalert2";

const getCheckModal = ({
  title,
  type,
  confirmButtonText,
  isConfirmedMsg,
  cb,
}) => {
  Swal.fire({
    title,
    icon: type,
    showCancelButton: true,
    confirmButtonColor: "#8950fc",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      cb().then(() => {
        Swal.fire({
          title: isConfirmedMsg,
          icon: "success",
        });
      });
    }
  });
};

const getModal = ({ title, type }) => {
  Swal.fire(title, type);
};

export { getCheckModal, getModal };

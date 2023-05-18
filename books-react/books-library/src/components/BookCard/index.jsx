import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rate from "../Rate";

// cookies
import cookie from "react-cookies";
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";

import userDataContext from "../../utils/context/UserContext";

const BookCard = ({ data, myBooks, getPosts, staticBooks }) => {
  const navigate = useNavigate();
  const userData = useContext(userDataContext);

  const handelBtn = (isMark) => {
    if (staticBooks) {
      window.open(data?.url);
    } else if (isMark) {
      const token = cookie.load("token");
      const formData = new FormData();

      formData.append("id", data?.id);
      formData.append("token", token);

      API.post("/posts/MarkAsTraded", formData)
        .then(({ data }) => {
          if (data.code == 200) {
            // Save profile changes here
            getPosts();
          }

          getMsg(data?.error);
        })
        .catch((err) => {
          getMsg(err.message);
        });
    } else {
      // // start chat
      window.open(`https://wa.me/${userData?.mobile}`, "_blank");
    }
  };

  return (
    <div>
      <div className="card h-100 text-center border">
        <div className="cu-pointer text-decoration-none d-flex justify-content-between">
          <Link
            to={`/book/${data?.id}`}
            className="cu-pointer text-decoration-none"
          >
            <img
              style={{ width: 200, height: 300 }}
              className="card-img-top m-auto"
              src={data.image}
              alt={data.name}
            />
          </Link>

          <div className="card-body_ text-start py-3 ps-3 d-flex flex-column justify-content-between align-items-start w-100 me-3">
            <Link
              to={`/book/${data?.id}`}
              className="cu-pointer text-decoration-none"
            >
              <div className="top">
                <h5 className="text-dark">{data.name}</h5>
                <p className="text-muted">
                  {data.description?.length > 50
                    ? `${data.description?.slice(0, 50)}...`
                    : data.description}
                </p>
                {staticBooks && <Rate numStars={data.rate} />}
              </div>
            </Link>
            <div className="btns">
              {/* <div className="price text-success mb-3 fw-bold">
              {data.price ? `$${data.price}` : "Free !"}
            </div> */}

              {staticBooks ? (
                <div className="trade-paper text-success mb-3 fw-bold">
                  Available
                </div>
              ) : data.traded ? (
                <div className="trade-paper text-danger mb-3 fw-bold">
                  Trade
                </div>
              ) : (
                <div className="trade-paper text-success mb-3 fw-bold">
                  Available
                </div>
              )}

              {!staticBooks && (
                <p className="text-muted">
                  <Link
                    to={`/profile/${data?.user?.id}`}
                    className="text-decoration-none"
                  >
                    {data?.user?.userName}
                  </Link>
                  , {data?.location}
                </p>
              )}

              <button
                onClick={() => handelBtn(myBooks)}
                disabled={
                  data.traded ||
                  (data?.user?.id == userData?.userID && !myBooks)
                }
                className="btn btn-success mb-2 flex-center"
              >
                {!staticBooks && (
                  <i
                    className={`me-2 bi ${
                      myBooks
                        ? "bi-book bi-hand-holding-heart"
                        : "bi-chat-dots-fill"
                    }`}
                  />
                )}

                <span>
                  {staticBooks
                    ? "Open link"
                    : myBooks
                    ? "Mark as given"
                    : "Start chat"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

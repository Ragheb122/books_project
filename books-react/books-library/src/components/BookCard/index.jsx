import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

// cookies
import cookie from "react-cookies";
import API from "../../utils/API";

import userDataContext from "../../utils/context/UserContext";

const BookCard = ({ data, myBooks, getPosts, staticBooks }) => {
  const userData = useContext(userDataContext);

  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

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

        })
        .catch((err) => {
        });
    } else {
      // start chat\
      window.open(`https://wa.me/${data?.user?.mobile}`, "_blank");
    }
  };

  return (
    
    <div>
      <div className="card h-100 text-center border">
        <div className="cu-pointer text-decoration-none d-flex justify-content-between">
          {staticBooks ? (
            <div className="cu-pointer text-decoration-none">
              <img
                style={{ width: 200, height: 300 }}
                className="card-img-top m-auto"
                src={data.image}
                alt={data.name}
                onClick={togglePreview}
              />

              {showPreview && (
                <div
                  className="image-preview"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999999999,
                  }}
                  onClick={togglePreview}
                >
                  <img
                    src={data.image}
                    alt={data.name}
                    style={{ maxWidth: "80%" }}
                  />
                </div>
              )}
            </div>
          ) : (
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
          )}

          <div className="card-body_ text-start py-3 ps-3 d-flex flex-column justify-content-between align-items-start w-100 me-3">
            {staticBooks ? (
              <div className="cu-pointer text-decoration-none">
                <div className="top">
                  <h5 className="text-dark">{data.name}</h5>
                  <p className="text-muted" style={{ wordBreak: "break-all" }}>
                    {data.description?.length > 50
                      ? `${data.description?.slice(0, 50)}...`
                      : data.description}
                  </p>
                  {/* {staticBooks && <Rate numStars={data.rate} />} */}
                </div>
              </div>
            ) : (
              <Link
                to={`/book/${data?.id}`}
                className="cu-pointer text-decoration-none"
              >
                <div className="top">
                  <h5 className="text-dark">{data.name}</h5>
                  <p className="text-muted" style={{ wordBreak: "break-all" }}>
                    {data.description?.length > 50
                      ? `${data.description?.slice(0, 50)}...`
                      : data.description}
                  </p>
                </div>
              </Link>
            )}

            <div className="btns">
              {staticBooks ? (
                ""
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

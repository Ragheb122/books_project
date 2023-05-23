import React, { useContext, useEffect, useState } from "react";

// components
import { Image, Button } from "react-bootstrap";
import Rate from "../../components/Rate";

// router hook
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout";
import API from "../../utils/API";
import cookie from "react-cookies";

import userDataContext from "../../utils/context/UserContext";
import getMsg from "../../utils/getMsg";

const Book = () => {
  const userData = useContext(userDataContext);
  const navigate = useNavigate();

  const { id } = useParams();
  const [bookData, setBookData] = useState({});

  const [rateBook, setRateBook] = useState(0);

  const startChat = () => {
    // navigate("/chat", { state: bookData });\
    window.open(`https://wa.me/${userData?.mobile}`, "_blank");
  };

  const handelClick = (rate) => {
    setRateBook(rate);

    const token = cookie.load("token");
    const formData = new FormData();

    formData.append("token", token);
    formData.append("rate", rate);
    formData.append("id", id);

    API.post("/posts/RateBook", formData).then(({ data }) => {
      if (data.code == 200) {
        getMsg("Success Added Rate", "success");
      }
    });
  };

  useEffect(() => {
    API(`/posts/PostById?id=${id}`)
      .then(({ data }) => {
        if (data?.code == 200) {
          setBookData({
            id: data?.Data?.id,
            title: data?.Data?.title,
            image: data?.Data?.userImage,
            status: data?.Data?.traded ? "Trade" : "Available",
            description: data?.Data?.description,
            url: data?.Data?.url,
            rate: data?.Data?.rate,
            user: {
              id: data?.Data?.userID,
              img: data?.Data?.userImage,
              userName: data?.Data?.username,
            },
          });
        } else {
          navigate("/home");
        }
      })
      .catch(() => {
        navigate("/home");
      });
  }, [id, navigate]);

  return (
    <Layout>
      <div className="container mt-4 pt-5">
        <div className="row">
          <div className="col-md-4 text-center">
            <Image
              style={{ width: 300 }}
              src={bookData.image}
              alt="Book"
              fluid
            />
          </div>

          <div className="col-md-8">
            <h2>{bookData.title}</h2>
            {/* <p className="mb-1">{bookData.author}</p> */}
            <p className="mb-1">
              Status:{" "}
              <span
                className={`${
                  bookData.status === "Available"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {bookData.status}
              </span>
            </p>
            {bookData?.url && (
              <p className="mb-1 d-flex">
                <span className="me-1">rate:</span>{" "}
                <Rate
                  handelClick={handelClick}
                  isClickable
                  numStars={bookData?.rate?.rate || rateBook}
                />
                <span>
                  {bookData?.rate?.rate || 0} ({bookData?.rate?.amount || 0})
                </span>
              </p>
            )}
            <p>
              <span>Description:</span>

              <span className="d-block">{bookData.description}</span>
            </p>

            {bookData?.url ? (
              <button
                onClick={() => window.open(bookData.url)}
                className="btn btn-success mb-2 flex-center"
              >
                <span>Open link</span>
              </button>
            ) : (
              <button
                onClick={startChat}
                disabled={bookData?.user?.id == userData?.userID}
                className="btn btn-success mb-2 flex-center"
              >
                <i className={`me-2 bi bi-chat-dots-fill`} />
                <span> Start chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Book;

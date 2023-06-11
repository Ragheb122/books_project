import React, { useContext, useEffect, useState } from "react";

// components
import { Image, Button } from "react-bootstrap";
import Rate from "../../components/Rate";
import { Link } from "react-router-dom";

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

  const startChat = () => {
    window.open(`https://wa.me/${bookData?.user?.mobile}`, "_blank");
  };

  useEffect(() => {
    API(`/posts/PostById?id=${id}`)
      .then(({ data }) => {
        if (data?.code == 200) {
          setBookData({
            id: data?.Data?.id,
            title: data?.Data?.title,
            image: data?.Data?.image,
            status: data?.Data?.traded ? "Trade" : "Available",
            description: data?.Data?.description,
            url: data?.Data?.url,
            rate: data?.Data?.rate,
            category: data?.Data?.categories,
            userID: data?.Data?.userID,
            userName: data?.Data?.userName
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
              style={{ width: 180 }}
              src={bookData.image}
              alt="Book"
              fluid
            />
          </div>

          <div className="col-md-8">
            <h2>{bookData.title}</h2>
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
            <p>
              <span>Description:</span>

              <span className="d-block">{bookData.description}</span>
            </p>
                        <p>
              <span>Category:</span>

              <span className="d-block">{bookData.category}</span>
            </p>
              <p className="text-muted">
              <span>Owner: </span>
                    <Link
                      to={`/profile/${bookData?.userID}`}
                      className="text-decoration-none"
                    >
                      <span>{bookData?.userName}</span>
                    </Link>
                </p>

            {bookData?.url ? (
              <button
                onClick={() => window.open(bookData.url)}
                className="btn btn-success mb-2 flex-center"
              >
                <span>Open Link</span>
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

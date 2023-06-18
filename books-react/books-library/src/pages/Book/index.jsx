import React, { useContext, useEffect, useState } from "react";

// components
import { Image, Button , Form} from "react-bootstrap";
import Rate from "../../components/Rate";
import { Link } from "react-router-dom";
// router hook
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout";
import API from "../../utils/API";
import cookie from "react-cookies";
import "../../style/helper.scss"

import userDataContext from "../../utils/context/UserContext";
import getMsg from "../../utils/getMsg";

const Book = () => {
  
  const userData = useContext(userDataContext);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const [bookData, setBookData] = useState({});
  const [commentsData, setCommentsData] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const token = cookie.load("token");
    const forData = new FormData();
  
    forData.append("token", token);
    forData.append("postID", id);
    forData.append("description", newComment);

    API.post(`/posts/addcomment`, forData)
      .then(({ data }) => {
        if (data?.code === 200) {
          // Update the commentsData state with the new comment
          const newCommentData = {
            id: data?.Data?.id,
            description: newComment,
            image: data?.Data?.image,
            userName: data?.Data?.userName,
            time: data?.Data?.time,
          };
  
          setCommentsData((prevComments) => [...prevComments, newCommentData]);
          setNewComment("");
          setCommentCount((prevCount) => prevCount + 1); // Increment the comment count
        } else {
          // Handle the error response if needed
          getMsg("Error Adding Comment", "error");
        }
      })
      .catch((error) => {
        // Handle the error if the API call fails
      });
  };
  
  
  const startChat = () => {
    window.open(`https://wa.me/${bookData?.user?.mobile}`, "_blank");
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await API(`/posts/getComments?id=${id}`);
        if (response.data?.code === 200) {
          const fetchedComments = response.data?.Data?.map((comment) => ({
            id: comment?.id,
            description: comment?.description,
            image: comment?.image,
            userName: comment?.userName,
            userID: comment?.userID,
            time: comment?.time
          }));
          setCommentsData(fetchedComments);
        }
      } catch (error) {
        // Handle the error if the API call fails
      }
    };
  
    fetchComments();
  }, [commentCount]); // Add commentCount as a dependency
  
  
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
            userName: data?.Data?.userName,
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

              <span className="d-block">{bookData?.category}</span>
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
                <span>Amazon Link</span>
              </button>
            ) : (
              <button
                onClick={startChat}
                disabled={bookData?.user?.id == userData?.userID}
                className="btn btn-success mb-2 flex-center"
              >
                <i className={`me-2 bi bi-chat-dots-fill`} />
                <span>Chat via whatsapp</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
  </div>
  <section style={{ backgroundColor: 'ad655f' }}>
  <div class="container my-5 py-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-12 col-lg-10">
        <div class="card text-dark">
          <div class="card-body p-4">
            <h4 class="mb-0">Discussion</h4>
          </div>

          <hr class="my-1" style={{paddingBottom:'1%'}} />

          {commentsData.map((comment, index) => (
  <div class="card-body p-1" key={comment.id}>
    <div class="d-flex flex-start" style={{paddingLeft:'2%'}}>
      <img
        class="rounded-circle shadow-1-strong me-3"
        src={comment.image}
        alt="avatar"
        width="60"
        height="60"
      />
      <div>
        <h6 class="fw-bold mb-1">
          <Link
            to={`/profile/${comment?.userID}`}
            className="text-decoration-none"
          >
            {comment?.userName}
          </Link>
        </h6>

        <div class="d-flex align-items-center mb-2">
        <p class="mb-0 comment-date"> {comment.time}</p>

        </div>
        <p class="mb-0">{comment.description}</p>
      </div>
    </div>
    {index !== commentsData.length - 1 && <hr />} {/* Add a line if it's not the last comment */}
  </div>
))}

<div className="card-body p-4 d-flex align-items-center">
  <Form onSubmit={handleCommentSubmit} className="d-flex flex-grow-1">
    <Form.Group controlId="commentInput" className="flex-grow-1 me-2 mb-0">
      <Form.Control
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={handleCommentChange}
      />
    </Form.Group>
    <Button type="submit">
      <i class="bi bi-send"></i>
    </Button>
  </Form>
</div>

        </div>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
};

export default Book;

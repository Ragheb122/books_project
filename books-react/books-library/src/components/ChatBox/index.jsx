import {useState, useEffect, React} from "react";
import { Image, Button , Form} from "react-bootstrap";
import cookie from "react-cookies";
import API from "../../utils/API";
import getMsg from "../../utils/getMsg";
import "../../style/helper.scss"
const ChatBox = () => {
    const [newMessage, setNewMessage] = useState("");
    const [MessagesData, setMessagesData] = useState([]);
    const [messageCount, setMessageCount] = useState(0);
    const token = cookie.load("token");
    const handleImageClick = (id) => {
        // Handle the click event
        console.log('Image clicked!');
      };
    const handleMessageSubmit = (event) => {
        event.preventDefault();
        const forData = new FormData();
      
        forData.append("token", token);
        forData.append("description", newMessage);
      
        API.post(`/default/addmessage`, forData)
          .then(({ data }) => {
            if (data?.code === 200) {
              // Update the commentsData state with the new comment
              const newMessageData = {
                id: data?.Data?.id,
                description: newMessage,
                image: data?.Data?.image,
                userName: data?.Data?.userName,
                time: data?.Data?.time,
                messageToken: token
              };
      
              setMessagesData((prevMessages) => [...prevMessages, newMessageData]);
              setNewMessage("");
              setMessageCount((prevCount) => prevCount + 1); // Increment the comment count
            } else {
              // Handle the error response if needed
              getMsg("your input is empty", "error");
            }
          })
          .catch((error) => {
            // Handle the error if the API call fails
          });
      };
      const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
      };
      useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await API(`/default/getmessages`);
            if (response.data?.code === 200) {
              const fetchedMessages = response.data?.Data?.map((message) => ({
                id: message?.id,
                description: message?.message,
                image: message?.image,
                userName: message?.userName,
                userID: message?.userID,
                messageToken: message?.token,
                time: message?.time
              }));
              setMessagesData(fetchedMessages);
            }
          } catch (error) {
            // Handle the error if the API call fails
          }
        };
      
        fetchMessages();
      }, [messageCount]); // Add commentCount as a dependency
    
  return (
    <section style={{ backgroundColor: "#eee", position: "fixed", right: 0, top: 0, height: "100vh", width: "400px" }}>
              <div class="container py-5">

<div class="row d-flex justify-content-center">
  <div class="col-md-10 col-lg-8 col-xl-6">
            <div className="card " id="chat2" style={{ position: "fixed", right: 0, top: 0, height: "100vh", width: "400px" }}>
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
              </div>
              <div className="card-body" data-mdb-perfect-scrollbar="true" style={{ position: 'relative', height: '400px' 
             , height: '400px',
              overflowY: 'auto'
            }}>
              {MessagesData.map((message, index) => (
                <div>
                    {message.messageToken !== token ? (
                <div className="d-flex flex-row justify-content-start mb-4">
                <a href={`/profile/${message?.userID}`} >
                    <img src={message.image} class="rounded-circle shadow-1-strong me-3"
                    alt="avatar 1" style={{ width: '40px', height: '40px' }} title={message?.userName}/>
                </a>
                <div>
                  <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: '#f5f6f7' }}>
                    {message.description}
                  </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">00:11</p>
                </div>
              </div>) :
              (<div class="d-flex flex-row justify-content-end mb-4 pt-1">
              <div>
                <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    {message.description}
                </p>
                <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                    {message.time}
                </p>
              </div>
              <a href={`/profile/${message?.userID}`} >
              <img src={message.image} class="rounded-circle shadow-1-strong me-3"
                alt="avatar 1" style={{
                    width: "40px",
                    height: "40px",
                  }}
                  title={message?.userName}/>
                  
                  </a>
            </div>)}
              </div>
                
              
              ))}

              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <Form onSubmit={handleMessageSubmit} className="d-flex flex-grow-1">
              <Button type="submit">
      <i class="bi bi-send"></i>
    </Button>
    <Form.Group controlId="commentInput" className="flex-grow-1 me-2 mb-0">
      <Form.Control
        type="text"
        placeholder="add a message..."
        value={newMessage}
        onChange={handleMessageChange}
      />
    </Form.Group>
  </Form>
                <a className="ms-3" href="#!">
                  <i className="fas fa-paper-plane"></i>
                </a>
            </div>
        </div>
        </div>
        </div>
        </div>

    </section>
  );
};

export default ChatBox;

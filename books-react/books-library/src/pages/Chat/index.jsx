/* eslint-disable react/jsx-no-target-blank */
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";

// layout
import Header from "../../layout/Header";

// components
import { Card } from "react-bootstrap";
import AudioMessage from "../../components/AudioMessage";
import ChatForm from "../../components/ChatForm";

import API from "../../utils/API";
import cookie from "react-cookies";

import userDataContext from "../../utils/context/UserContext";
import moment from "moment";

// live chat
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Chat = () => {
  const userData = useContext(userDataContext);
  const messagesEndRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const [isChatStart, setIsChatStart] = useState(false);

  const isChatStartDone = useRef(isChatStart);
  isChatStartDone.current = isChatStart;

  const [chats, setchats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});

  const chatSelect = useRef(selectedChat);
  chatSelect.current = selectedChat;

  const [currentMsgs, setCurrentMsgs] = useState([]);
  const location = useLocation();

  const selectToBottom = () => {
    messagesEndRef.current.scrollTop =
      messagesEndRef?.current?.scrollHeight || 0;
  };

  const selectChat = useCallback((chat) => {
    setSelectedChat(chat);
    selectToBottom();
  }, []);

  const formatDateTime = (date) => {
    const specificDate = moment(date); // Replace '2022-12-31' with your specific date
    const formattedRelativeTime = specificDate.fromNow();

    return formattedRelativeTime;
  };

  const sendSignalRMsg = (msgData) => {
    connection
      .invoke("SendMessage", msgData)
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => console.error("Error sending message: ", error));
  };

  const blobToFile = (blob, filename) => {
    const file = new File([blob], filename);
    return file;
  };

  const sendMessage = (textMessage, setTextMessage) => {
    if (!chatSelect.current?.chatID) return;

    selectToBottom();
    const messageData = {
      message: textMessage,
      isMeSender: true,
      sender: {
        id: userData?.userID,
        imgs: userData?.userImage,
        username: userData?.name,
      },
      type: 0,
      // type: "text || record || img || video || file",
      receiver: chatSelect.current?.reciver,
      created_at: formatDateTime(new Date()),
    };

    // setCurrentMsgs((prev) => [...prev, messageData]);

    const token = cookie.load("token");
    const formData = new FormData();

    formData.append("token", token);
    formData.append("id", chatSelect.current?.chatID);
    formData.append("message", textMessage);
    formData.append("type", 0);

    API.post("/chat/SendMessage", formData);
    setTextMessage("");
  };

  const sendVoiceMessage = (data, blobUrl) => {
    if (!chatSelect?.current?.chatID) return;

    const voiceFile = blobToFile(
      data,
      `voice_${Math.floor(Math.random() * (99999999999 - 1 + 1)) + 1}.${
        data?.type?.split(";")[0].split("/")[1]
      }`
    );

    const messageData = {
      message: blobUrl,
      isMeSender: true,
      sender: {
        id: userData?.userID,
        imgs: userData?.userImage,
        username: userData?.name,
      },
      type: 1,
      // type: "text || record || img || video || file",
      receiver: chatSelect?.current?.reciver,
      created_at: formatDateTime(new Date()),
    };

    selectToBottom();
    // setCurrentMsgs((prev) => [...prev, messageData]);

    const token = cookie.load("token");
    const formData = new FormData();

    formData.append("token", token);
    formData.append("id", chatSelect?.current?.chatID);
    formData.append("message", "");
    formData.append("file", voiceFile);
    formData.append("type", 1);

    API.post("/chat/SendMessage", formData);
  };

  const sendFileMessage = (data) => {
    if (!chatSelect.current?.chatID) return;

    const getTypeNumber = () => {
      if (data.type?.split("/")?.[0] === "video") {
        return 3;
      } else if (data.type?.split("/")?.[0] === "image") {
        return 2;
      } else {
        return 4;
      }
    };

    selectToBottom();
    const messageData = {
      message: URL.createObjectURL(data),
      isMeSender: true,
      sender: {
        id: userData?.userID,
        imgs: userData?.userImage,
        username: userData?.name,
      },
      type: getTypeNumber(),
      // type: "text || record || img || video || file",
      receiver: chatSelect.current?.reciver,
      created_at: formatDateTime(new Date()),
    };

    // setCurrentMsgs((prev) => [...prev, messageData]);

    const token = cookie.load("token");
    const formData = new FormData();

    formData.append("token", token);
    formData.append("id", chatSelect.current?.chatID);
    formData.append("message", "");
    formData.append("file", data);
    formData.append("type", getTypeNumber());

    API.post("/chat/SendMessage", formData);
  };

  const getMessages = useCallback(() => {
    // console.clear();
    if (!chatSelect.current?.chatID) return;

    const token = cookie.load("token");
    API(
      `/chat/ChatMessages?token=${token}&id=${chatSelect.current?.chatID}`
    ).then(({ data }) => {
      const msgs = data?.Data?.map((msg) => ({
        message: msg?.message,
        isMeSender: msg?.sender?.id == userData?.userID,
        type: msg?.type,
        sender: msg?.sender,
        receiver: msg?.reciver,
        created_at: formatDateTime(msg?.created_at),
      }));
      setCurrentMsgs(msgs);

      if (msgs.length > currentMsgs?.length) {
        selectToBottom();
      }
    });
  }, [userData, currentMsgs?.length]);

  const getChats = useCallback(async () => {
    const token = cookie.load("token");
    let dataSet = [];

    await API(`/chat?token=${token}`).then(({ data }) => {
      setchats(data?.Data);
      dataSet = data?.Data;
    });

    return dataSet;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [getMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      getChats();
    }, 2000);

    return () => clearInterval(interval);
  }, [getChats]);

  useEffect(() => {
    const setConnection = async () => {
      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl("https://2b03-41-69-200-6.ngrok-free.app/signalr/hubs")
          .configureLogging(LogLevel.Information)
          .build();

        newConnection.on("ReceiveMessage", (message) => {
          console.log("New message received: ", message);
        });

        await newConnection.start();
        setConnection(newConnection);
      } catch (e) {
        console.log(e);
      }
    };

    setConnection();
  }, []);

  useEffect(() => {
    selectToBottom();
  }, []);

  useEffect(() => {
    getChats();
  }, [getChats]);

  useEffect(() => {
    if (!location?.state?.user?.id || isChatStartDone?.current) return;
    setIsChatStart(true);

    const startChat = async () => {
      setIsChatStart(true);

      const formData = new FormData();
      const token = cookie.load("token");

      formData.append("token", token);
      formData.append("id", location?.state?.user?.id);

      const chats = await getChats();
      if (chats?.find((chat) => chat.reciver?.id == location?.state?.user?.id))
        return;

      API.post("/chat/startchat", formData).then(async ({ data }) => {
        if (data?.code === 200) {
          await getChats();
          selectChat({
            chatID: data?.Data?.ChatId,
            reciver: {
              id: location?.state?.user?.id,
              username: data?.Data?.ReciverName,
              imgs: data?.Data?.ReciverImage,
            },
          });
        }
      });
    };

    startChat();
  }, [location?.state?.user?.id, getChats, selectChat]);

  useEffect(() => {
    if (!chatSelect.current?.chatID) return;

    getMessages();
  }, [chatSelect.current?.chatID, getMessages]);

  return (
    <>
      <Header />

      <div className="container-fluid vh-100 py-5">
        <div className="row">
          {/* المحادثات */}
          <div
            style={{
              height: "80vh",
              overflowY: "scroll",
            }}
            className="col-md-12 col-lg-4 chat-list-container"
          >
            <ul className="list-group">
              <div style={{ position: "sticky", top: 0, zIndex: 99999 }}>
                <li className="list-group-item active text-center">Chats</li>
              </div>

              {chats?.map((chat, idx) => (
                <li
                  key={idx}
                  onClick={() => selectChat(chat)}
                  className={`list-group-item chat-list-item cu-pointer list-group-item-action transition ${
                    chat?.chatID == chatSelect.current?.chatID ? "bg-light" : ""
                  }`}
                >
                  <div className="media chat-list-item d-flex flex-row py-2">
                    <div className="img me-3">
                      <img
                        className="chat-list-image rounded-circle"
                        src={chat?.reciver?.imgs}
                        alt="User"
                        width={65}
                      />
                    </div>
                    <div className="media-body">
                      <h5 className="chat-list-name">
                        {chat?.reciver?.username}
                      </h5>
                      <p
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "250px",
                        }}
                        className="chat-list-message small text-muted m-0"
                      >
                        {chat?.type == 0
                          ? chat?.lastMessage
                          : chat?.type == 1
                          ? "Voice Message"
                          : chat?.type == 2
                          ? "Image"
                          : chat?.type == 3
                          ? "Video"
                          : chat?.lastMessage}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* الرسائل */}
          <div
            style={{
              height: "80vh",
            }}
            className="col-md-12 col-lg-8"
          >
            <div
              className="p-5"
              ref={messagesEndRef}
              style={{
                height: "calc(100% - 50px)",
                overflowY: "scroll",
              }}
            >
              {currentMsgs?.length ? (
                currentMsgs?.map((msg, idx) => (
                  <div className="msg" key={idx}>
                    {msg?.isMeSender ? (
                      <>
                        {msg.type == 0 ? (
                          <>
                            {/* رساله نصيه مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-primary text-white border">
                                  <Card.Body>
                                    <p className="m-0 text-end">
                                      {msg.message}
                                    </p>
                                  </Card.Body>
                                  <Card.Footer className="bg-primary border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-white">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                              <div className="col-md-6"></div>
                            </div>
                          </>
                        ) : msg.type == 1 ? (
                          <>
                            {/* رسالة صوتية مني */}
                            <AudioMessage
                              isFromMe
                              timestamp={msg?.created_at}
                              src={msg?.message}
                            />
                          </>
                        ) : msg.type == 2 ? (
                          <>
                            {/* رساله صوريه مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-primary text-white border">
                                  <Card.Img
                                    className="m-auto mt-3"
                                    style={{
                                      maxWidth: 300,
                                      margin: "auto",
                                      width: "100%",
                                    }}
                                    variant="top"
                                    src={msg?.message}
                                  />
                                  <Card.Footer className="bg-primary border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-white">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                              <div className="col-md-6"></div>
                            </div>
                          </>
                        ) : msg.type == 3 ? (
                          <>
                            {/* رساله فيديو مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-primary text-white border">
                                  <Card.Body>
                                    <div className="embed-responsive flex-center embed-responsive-16by9">
                                      <video
                                        className="mt-2 rounded-3"
                                        width="400"
                                        height="300"
                                        controls
                                        style={{
                                          maxWidth: 300,
                                          margin: "auto",
                                          width: "100%",
                                        }}
                                      >
                                        <source
                                          src={msg?.message}
                                          type="video/mp4"
                                        />
                                      </video>
                                    </div>
                                  </Card.Body>
                                  <Card.Footer className="bg-primary border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-white">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                              <div className="col-md-6"></div>
                            </div>
                          </>
                        ) : msg.type == 4 ? (
                          <>
                            {/* رساله ملف مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6">
                                <div className="file-message bg-primary text-white rounded-3 d-block p-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <div
                                      style={{ width: 30, height: 30 }}
                                      className="file-icon bg-white rounded-circle text-primary d-flex align-items-center justify-content-center border"
                                    >
                                      <i className="bi bi-file-earmark-text"></i>
                                    </div>
                                    <div className="ms-3">
                                      <div className="fw-bold text-white">
                                        {msg?.message?.name}
                                      </div>
                                      <div className="text-light">
                                        {msg?.message?.size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="download-btn text-center">
                                    <a
                                      href={msg?.message?.src}
                                      className="text-white"
                                      target="_blank"
                                      download
                                    >
                                      <i className="bi bi-download me-1"></i>
                                      Download
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6"></div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <>
                        {msg.type == 0 ? (
                          <>
                            {/* رساله نصيه ليست مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6"></div>
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-light border">
                                  <Card.Body>
                                    <p className="m-0 text-end">
                                      {msg.message}
                                    </p>
                                  </Card.Body>
                                  <Card.Footer className="bg-light border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-muted">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                            </div>
                          </>
                        ) : msg.type == 1 ? (
                          <>
                            {/* رسالة صوتية ليست مني */}
                            <AudioMessage
                              timestamp={msg?.created_at}
                              src={msg?.message}
                            />
                          </>
                        ) : msg.type == 2 ? (
                          <>
                            {/* رساله صوريه ليست مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6"></div>
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-light border">
                                  <Card.Img
                                    className="m-auto mt-3"
                                    style={{
                                      maxWidth: 300,
                                      margin: "auto",
                                      width: "100%",
                                    }}
                                    variant="top"
                                    src={msg?.message}
                                  />
                                  <Card.Footer className="bg-light border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-muted">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                            </div>
                          </>
                        ) : msg.type == 3 ? (
                          <>
                            {/* رساله فيديو ليس مني */}
                            <div className="row flex-row-reverse mb-3">
                              <div className="col-md-6"></div>
                              <div className="col-md-6">
                                <Card className="border-0 rounded-3 bg-light border">
                                  <Card.Body>
                                    <div className="embed-responsive flex-center embed-responsive-16by9">
                                      <video
                                        className="mt-2 rounded-3"
                                        width="400"
                                        height="300"
                                        controls
                                        style={{
                                          maxWidth: 300,
                                          margin: "auto",
                                          width: "100%",
                                        }}
                                      >
                                        <source
                                          src={msg?.message}
                                          type="video/mp4"
                                        />
                                      </video>
                                    </div>
                                  </Card.Body>
                                  <Card.Footer className="bg-light border-0">
                                    <div className="d-flex justify-content-end">
                                      <small className="text-muted">
                                        {msg?.created_at}
                                      </small>
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </div>
                            </div>
                          </>
                        ) : msg.type == 4 ? (
                          <>
                            {/* رساله ملف ليست مني */}
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <div className="file-message bg-light text-dark rounded-3 d-block p-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <div
                                      style={{ width: 30, height: 30 }}
                                      className="file-icon bg-white rounded-circle text-dark d-flex align-items-center justify-content-center border"
                                    >
                                      <i className="bi bi-file-earmark-text"></i>
                                    </div>
                                    <div className="ms-3">
                                      <div className="fw-bold text-dark">
                                        {msg?.message?.name}
                                      </div>
                                      <div className="text-dark">
                                        {msg?.message?.size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="download-btn text-center">
                                    <a
                                      href={msg?.message?.src}
                                      className="text-dark"
                                      target="_blank"
                                      download
                                    >
                                      <i className="bi bi-download me-1"></i>
                                      Download
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6"></div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="flex-center border h-100">...لا يوجد رسائل بعد</p>
              )}

              {/* رساله نص معamوره مني */}
              {/* <div className="row flex-row-reverse mb-3">
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-primary text-white border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                      <div className="img flex-center">
                        <Card.Img
                          className="m-auto mt-3"
                          style={{ width: 300 }}
                          variant="top"
                          src="https://picsum.photos/200"
                        />
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-primary border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-white">Now</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div> */}
              {/* رساله نص معamوره ليست مني */}
              {/* <div className="row flex-row-reverse mb-3">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-light border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                      <div className="img flex-center">
                        <Card.Img
                          className="m-auto mt-3"
                          style={{ width: 300 }}
                          variant="top"
                          src="https://picsum.photos/200"
                        />
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-light border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-muted">10:30am</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div> */}
              {/* رساله نص مع فيديو مني */}
              {/* <div className="row flex-row-reverse mb-3">
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-primary text-white border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                      <div className="embed-responsive flex-center embed-responsive-16by9">
                        <video
                          className="mt-2 rounded-3"
                          width="400"
                          height="300"
                          controls
                        >
                          <source
                            src="https://www.w3schools.com/tags/movie.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-primary border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-white">Now</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div> */}
              {/* رساله نص مع فيديو ليس مني */}
              {/* <div className="row flex-row-reverse mb-3">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-light border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                      <div className="embed-responsive flex-center embed-responsive-16by9">
                        <video
                          className="mt-2 rounded-3"
                          width="400"
                          height="300"
                          controls
                        >
                          <source
                            src="https://www.w3schools.com/tags/movie.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-light border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-muted">10:30am</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div> */}
            </div>

            {/* حقل الإدخال */}
            <ChatForm
              sendFileMessage={sendFileMessage}
              sendMessage={sendMessage}
              sendVoiceMessage={sendVoiceMessage}
              selectedChat={selectedChat}
            />
            {/* <form
              onSubmit={handleSubmitRecord}
              style={{ position: "sticky", bottom: 5, zIndex: 99999 }}
              className="input-group mb-3"
            >
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                disabled={isRecording}
                type="text"
                className="form-control py-3"
                placeholder="Write your message"
                aria-label="Write your message"
              />

              {!isRecording && (
                <button
                  className="btn btn-secondary px-3"
                  type="button"
                  onClick={handleRecord}
                >
                  <i className="bi bi-mic-fill"></i>
                </button>
              )}

              {isRecording ? (
                <button
                  className="btn btn-danger px-3"
                  type="button"
                  onClick={handleRecord}
                >
                  <i className="bi bi-record-fill"></i>
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={
                    !selectedChat?.chatID || (!textMessage && !isRecording)
                  }
                >
                  Send
                </button>
              )}
            </form> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;

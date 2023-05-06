import React, { useEffect, useRef } from "react";

// layout
import Header from "../../layout/Header";

// components
import { Card } from "react-bootstrap";
import AudioMessage from "../../components/AudioMessage";

const Chat = () => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, []);

  return (
    <>
      <Header />

      <div className="container-fluid vh-100 py-5">
        <div className="row">
          {/* المحادثات */}
          <div
            style={{
              height: "80vh",
            }}
            className="col-md-12 col-lg-8"
          >
            <div
              className="p-3"
              ref={messagesEndRef}
              style={{
                height: "calc(100% - 50px)",
                overflowY: "scroll",
              }}
            >
              {/* رساله نصيه مني */}
              <div className="row flex-row-reverse mb-3">
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-primary text-white border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                    </Card.Body>
                    <Card.Footer className="bg-primary border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-white">الآن</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div>

              {/* رساله نصيه ليست مني */}
              <div className="row flex-row-reverse mb-3">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-light border">
                    <Card.Body>
                      <p className="m-0 text-end">رسالة المحادثة الأخيرة</p>
                    </Card.Body>
                    <Card.Footer className="bg-light border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-muted">10:30 ص</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>

              {/* رساله صوريه مني */}
              <div className="row flex-row-reverse mb-3">
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-primary text-white border">
                    <Card.Img
                      className="m-auto mt-3"
                      style={{ width: 300 }}
                      variant="top"
                      src="https://picsum.photos/200"
                    />
                    <Card.Footer className="bg-primary border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-white">الآن</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div>

              {/* رساله صوريه ليست مني */}
              <div className="row flex-row-reverse mb-3">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <Card className="border-0 rounded-3 bg-light border">
                    <Card.Img
                      className="m-auto mt-3"
                      style={{ width: 300 }}
                      variant="top"
                      src="https://picsum.photos/200"
                    />
                    <Card.Footer className="bg-light border-0">
                      <div className="d-flex justify-content-end">
                        <small className="text-muted">10:30 ص</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>

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
                        <small className="text-white">الآن</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div>

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
                        <small className="text-muted">10:30 ص</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>

              {/* رساله نص مع صوره مني */}
              <div className="row flex-row-reverse mb-3">
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
                        <small className="text-white">الآن</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div>

              {/* رساله نص مع صوره ليست مني */}
              <div className="row flex-row-reverse mb-3">
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
                        <small className="text-muted">10:30 ص</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>

              {/* رساله نص مع فيديو مني */}
              <div className="row flex-row-reverse mb-3">
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
                        <small className="text-white">الآن</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col-md-6"></div>
              </div>

              {/* رساله نص مع فيديو ليس مني */}
              <div className="row flex-row-reverse mb-3">
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
                        <small className="text-muted">10:30 ص</small>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>

              {/* رسالة صوتية مني */}
              <AudioMessage
                isFromMe
                timestamp="الان"
                src="https://download.samplelib.com/mp3/sample-3s.mp3"
              />

              {/* رسالة صوتية ليست مني */}
              <AudioMessage
                timestamp="الان"
                src="https://download.samplelib.com/mp3/sample-3s.mp3"
              />
            </div>

            {/* حقل الإدخال */}

            <div
              style={{ position: "sticky", bottom: 5, zIndex: 99999 }}
              className="input-group mb-3"
            >
              <button className="btn btn-primary" type="button">
                إرسال
              </button>

              <input
                type="text"
                className="form-control py-3 text-end"
                placeholder="اكتب رسالتك"
                aria-label="اكتب رسالتك"
              />
            </div>
          </div>

          <div
            style={{
              height: "80vh",
              overflowY: "scroll",
            }}
            className="col-md-12 col-lg-4 chat-list-container"
          >
            <ul className="list-group">
              <div style={{ position: "sticky", top: 0, zIndex: 99999 }}>
                <li className="list-group-item active text-center">محادثات</li>
              </div>

              {[...Array(50)]?.map((_, idx) => (
                <li
                  key={idx}
                  className="list-group-item chat-list-item cu-pointer list-group-item-action transition"
                >
                  <div className="media chat-list-item d-flex flex-row-reverse py-2">
                    <div className="img ms-3">
                      <img
                        className="chat-list-image rounded-circle"
                        src="https://picsum.photos/64"
                        alt="User"
                        width={65}
                      />
                    </div>
                    <div className="media-body">
                      <h5 className="chat-list-name">اسم المستخدم</h5>
                      <p className="chat-list-message small text-muted m-0">
                        رسالة المحادثة الأخيرة
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;

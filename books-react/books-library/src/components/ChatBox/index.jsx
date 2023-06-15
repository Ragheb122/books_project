import React from "react";
import { Image, Button , Form} from "react-bootstrap";

const ChatBox = () => {
  return (
    <section style={{ backgroundColor: "#eee", position: "fixed", right: 0, top: 0, height: "100vh", width: "400px" }}>
            <div className="card " id="chat2" style={{ position: "fixed", right: 0, top: 0, height: "100vh", width: "400px" }}>
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
              </div>
              <div className="card-body" data-mdb-perfect-scrollbar="true" style={{ position: 'relative', height: '400px' }}>
                <div className="d-flex flex-row justify-content-start mb-4">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: '#f5f6f7' }}>
                      Okay, I will meet you on Sandon Square
                    </p>
                    <p className="small ms-3 mb-3 rounded-3 text-muted">00:11</p>
                  </div>
                </div>
                <div class="d-flex flex-row justify-content-end mb-4 pt-1">
              <div>
                <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Hiii, I'm good.</p>
                <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:06</p>
              </div>
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                alt="avatar 1" style={{
                    width: "45px",
                    height: "100%",
                  }}/>
            </div>
              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <Button type="submit">
      <i class="bi bi-send"></i>
    </Button>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Type message"
                />
                <a className="ms-1 text-muted" href="#!">
                  <i className="fas fa-paperclip"></i>
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <i className="fas fa-smile"></i>
                </a>
                <a className="ms-3" href="#!">
                  <i className="fas fa-paper-plane"></i>
                </a>
            </div>
        </div>
    </section>
  );
};

export default ChatBox;

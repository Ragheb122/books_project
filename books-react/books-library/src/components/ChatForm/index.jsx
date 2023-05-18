import React, { useEffect, useState, useRef, useCallback } from "react";
import { ReactMic } from "react-mic";

const ChatForm = ({
  sendVoiceMessage,
  selectedChat,
  sendMessage,
  sendFileMessage,
}) => {
  const [textMessage, setTextMessage] = useState("");
  const [record, setRecord] = useState(false);
  const [shouldSaveRecording, setShouldSaveRecording] = useState(true);

  let intervalRef = useRef();
  const [recordingTime, setRecordingTime] = useState(0);
  const [time, setTime] = useState("00:00");

  const shouldSaveRecordingRef = useRef(shouldSaveRecording);
  shouldSaveRecordingRef.current = shouldSaveRecording;

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(textMessage, setTextMessage);
  };

  const sendFile = (e) => {
    if (e.target.files[0]) {
      sendFileMessage(e.target.files[0]);
      e.target.form.reset();
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const startRecording = () => {
    setRecord(true);
    startTimer();
    setShouldSaveRecording(true); // By default we should save the recording
  };

  const stopRecording = () => {
    setRecord(false);
    stopTimer();
    setRecordingTime(0);
  };

  const onStop = (recordedBlob) => {
    if (!shouldSaveRecordingRef.current) return;

    sendVoiceMessage(recordedBlob.blob, recordedBlob?.blobURL);
  };

  const resetRecording = () => {
    stopTimer();
    setRecordingTime(0);
    setShouldSaveRecording(false);
    setRecord(false);
  };

  const getRecordTime = (recordingTime) => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    setTime(formattedTime);
  };

  useEffect(() => {
    if (record) {
      getRecordTime(recordingTime);
    }
  }, [record, recordingTime]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ position: "sticky", bottom: 5, zIndex: 99999 }}
      className="input-group mb-3"
    >
      <div className="input form-control flex-center bg-light">
        <input
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          style={{ outline: "none" }}
          disabled={record}
          type="text"
          className="py-3 h-100 w-100 border-0 bg-light"
          placeholder="Send Your Message"
          aria-label="Send Your Message"
        />
        {record && <span>{time}</span>}
      </div>

      {record ? (
        <>
          <button
            className="btn btn-danger"
            type="button"
            id="send_current_record"
            onClick={stopRecording}
          >
            <i className="bi bi-stop-circle-fill px-2"></i>
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={resetRecording}
          >
            <i className="bi bi-trash3-fill px-2"></i>
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!selectedChat?.chatID || !textMessage}
          >
            Send
          </button>

          <input
            type="file"
            id="img-videos"
            hidden
            accept="image/*, video/*"
            onInput={sendFile}
          />
          <label
            htmlFor="img-videos"
            className="flex-center btn btn-dark flex-center px-3"
          >
            <i className="bi bi-folder-plus"></i>
          </label>

          <button
            className="btn btn-light border"
            type="button"
            disabled={!selectedChat?.chatID}
            onClick={startRecording}
          >
            <i className="bi bi-mic-fill px-2"></i>
          </button>
        </>
      )}

      <ReactMic
        record={record}
        className="d-none"
        onStop={onStop}
        strokeColor={"gray"}
        backgroundColor={"white"}
      />
    </form>
  );
};

export default ChatForm;

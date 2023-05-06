import { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

// components
import { Card, Button } from "react-bootstrap";

const AudioMessage = ({ src, isFromMe, timestamp }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playhead, setPlayhead] = useState(0);

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    wavesurfer.current.seekTo(seekTime / duration);
    setCurrentTime(seekTime);
    setPlayhead((seekTime / duration) * 100);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    wavesurfer.current.playPause();
  };

  const handleFinish = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPlayhead(0);
    setProgress(0);
  };

  useEffect(() => {
    const options = {
      container: waveformRef.current,
      waveColor: isFromMe ? "#007bff" : "#6c757d",
      progressColor: isFromMe ? "#e9ecef" : "black",
      cursorColor: isFromMe ? "white" : "black",
      height: 50,
      hideScrollbar: true,
      barWidth: 2,
      responsive: true,
      normalize: true,
      interact: false,
    };
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.on("ready", () => {
      // set the duration of the audio file
      const duration = wavesurfer.current.getDuration();
      setCurrentTime(0);
      setDuration(duration);
    });

    wavesurfer.current.on("audioprocess", () => {
      // update the current time of the audio file
      const currentTime = wavesurfer.current.getCurrentTime();
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
      setPlayhead((currentTime / duration) * 100);
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    wavesurfer.current.load(src);
    wavesurfer?.current?.on("finish", handleFinish);

    return () => wavesurfer.current.destroy();
  }, [src, isFromMe]);

  return (
    <div
      className={`row flex-row mb-3${isFromMe ? " justify-content-end" : ""}`}
    >
      <div className="col-md-6">
        <Card
          className={`border-0 rounded-3${
            isFromMe ? " bg-primary text-white" : " bg-light"
          } border`}
        >
          <Card.Body className="flex-center">
            <div className="col-2 d-flex justify-content-center align-items-center my-3">
              <Button variant="link" onClick={handlePlayPause}>
                {isPlaying ? (
                  <i
                    className={`bi bi-pause-circle-fill fs-5 ${
                      isFromMe ? "text-white" : ""
                    }`}
                  ></i>
                ) : (
                  <i
                    className={`bi bi-play-circle-fill fs-5 ${
                      isFromMe ? "text-white" : ""
                    }`}
                  ></i>
                )}
              </Button>
            </div>

            <div className="col-10 d-flex flex-column justify-content-center">
              <div ref={waveformRef}></div>
            </div>
          </Card.Body>

          <div className="d-flex justify-content-between mt-2 container px-4">
            <small className={`${isFromMe ? "text-white" : "text-muted"}`}>
              {formatTime(currentTime)}
            </small>
            <small className={`${isFromMe ? "text-white" : "text-muted"}`}>
              {formatTime(duration)}
            </small>
          </div>
          <Card.Footer
            className={`border-0${isFromMe ? " bg-primary" : " bg-light"}`}
          >
            <div
              className={`d-flex${
                isFromMe ? " justify-content-end" : " justify-content-start"
              }`}
            >
              <small className={isFromMe ? "text-white" : "text-muted"}>
                {timestamp}
              </small>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default AudioMessage;

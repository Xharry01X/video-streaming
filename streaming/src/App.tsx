import React, { useRef, useEffect } from "react";

const App = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Explicit type annotation

  useEffect(() => {
    const video = videoRef.current;

    // Only add event listener if video element exists
    if (video) {
      // Load the video stream from the server
      video.src = "http://localhost:4000/video";

      // Listen for errors on the video element
      video.addEventListener("error", handleVideoError);

      // Cleanup function to remove the error event listener
      return () => {
        if (video) { // Ensure video exists before removing event listener
          video.removeEventListener("error", handleVideoError);
        }
      };
    }
  }, []);

  const handleVideoError = () => {
    // Video loading error occurred, stop playback or take appropriate action
    console.log("Video loading error occurred");
    // Stop video playback
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div>
      <video ref={videoRef} controls width="640" height="360" />
    </div>
  );
};

export default App;

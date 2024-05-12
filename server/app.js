import express from "express";
import { createReadStream } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import isOnline from "is-online";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

let isStreaming = true; // Flag to track if streaming is paused

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/video", async (req, res) => {
  const videoPath = `${__dirname}/public/starboy.webm`;
  const videoStream = createReadStream(videoPath);

  // Set proper headers for video streaming
  res.writeHead(200, {
    "Content-Type": "video/webm",
  });

  // Function to pause video streaming
  const pauseStreaming = () => {
    isStreaming = false;
    videoStream.pause();
  };

  // Function to resume video streaming
  const resumeStreaming = () => {
    isStreaming = true;
    videoStream.resume();
  };

  // Check network status periodically
  setInterval(async () => {
    const online = await isOnline();
    if (!online && isStreaming) {
      console.log("Network offline");
      pauseStreaming();
    } else if (online && !isStreaming) {
      console.log("Network online");
      resumeStreaming();
    }
  }, 5000); // Check every 5 seconds

  // Pipe the video stream to the response object
  videoStream.on("data", (chunk) => {
    if (isStreaming) {
      console.log(`Chunk loaded: ${chunk.length} bytes`);
      res.write(chunk); // Write the chunk to the response
    }
  });

  videoStream.on("end", () => {
    console.log("Video streaming complete");
    res.end(); // End the response when the stream ends
  });
});

app.listen(4000, () => {
  console.log(`Server live at 4000`);
});

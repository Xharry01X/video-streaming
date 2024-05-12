import express from "express";
import { createReadStream } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});



app.get("/video", (req, res) => {
  const videoPath = `${__dirname}/public/starboy.webm`;
  res.sendFile(videoPath);
});

app.listen(4000, () => {
  console.log(`Server live at 4000`);
});

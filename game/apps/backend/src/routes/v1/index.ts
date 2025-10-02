import { getPromptResponse } from "../../utils/cerebras.js";
import { Router } from "express";
import { io } from "../../index.js";

export const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "hello" });
});

router.post("/input", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt from user", prompt);

  try {
    console.log("console reached before calling ai function");
    const input = await getPromptResponse(prompt);
    console.log("response from api", input);

    io.emit("gameData", input);

    res.json({ message: "Generating game..." });
  } catch (error) {
    return res.status(500).json({ msg: `Internal server error: ${error}` });
  }
});

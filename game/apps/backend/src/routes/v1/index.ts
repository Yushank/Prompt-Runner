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
    const response = await getPromptResponse(prompt);
    console.log("console reached after calling ai function");
    // let responseText = response.choices[0]?.message?.content;
    // console.log("Raw response-text:", responseText);

    // // to remove the markdown code
    // responseText = responseText
    //   .replace(/```json\s*/g, "")
    //   .replace(/```\s*/g, "")
    //   .trim();
    // console.log("Cleaned response-text:", responseText);
    // const gameData = JSON.parse(responseText); //parsing json from ai response
    // console.log("response from api", response);
    // console.log("game-data:", gameData);

    console.log("response data from ai:", response);
    io.emit("gameData", {
      type: "gameUpdate",
      data: response,
    });

    res.json({ message: "Generating game..." });
  } catch (error) {
    return res.status(500).json({ msg: `Internal server error: ${error}` });
  }
});

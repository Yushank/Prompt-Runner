import Cerebras from "@cerebras/cerebras_cloud_sdk";

interface ChatCompletion {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }>;
  id: string;
  model: string;
}

const client = new Cerebras({
  apiKey: "csk-fnm462r485hjvy5dmvpe44prjvpy25ewfnv988m4p9ttn9yt",
});

export async function getPromptResponse(
  prompt: string
): Promise<ChatCompletion> {
  console.log("reached getPrompResponse function");
  const response = (await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `You are a game asset generator. Based on the user’s prompt: ${prompt}, return ONLY a JSON object with the following structure:

        {
          "character": {
            "name": "character name",
            "width": 32,
            "height": 32,
            "pixels": [
              {"x": 0, "y": 0, "color": "#FF0000"},
              {"x": 1, "y": 0, "color": "#00FF00"}
              // ... pixel data
            ]
          },
          "obstacles": [
            {
              "type": "rock", 
              "width": 20,
              "height": 20,
              "color": "#808080"
            }
            // more obstacles if needed
          ],
          "speed": {
            "value": 200
          },
          "jump": {
            "type": "big", 
            "velocityY": -400
          }
        }

        Rules:
        - If the user defines a character, generate pixel art for that character (16–64 pixels size).
        - If the user defines obstacles, include them. Otherwise return a default obstacle: {"type": "rock", "width": 20, "height": 20, "color": "#808080"}.
        - If speed is not defined, use default: {"value": 200}.
        - If jump type is not defined, use default: {"type": "normal", "velocityY": -300}.
        - Colors should be simple (red, blue, green, yellow, black, white, gray, etc.).
        - Return ONLY valid JSON, no explanations or extra text.`,
      },
    ],
    model: "llama-4-scout-17b-16e-instruct",
  })) as ChatCompletion;

  const message = response.choices[0]?.message;
  const responseText = message?.content;
  console.log("message in ai function:", responseText);

  console.log("response from ai:", response);

  return response;
}

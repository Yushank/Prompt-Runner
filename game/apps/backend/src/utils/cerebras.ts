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
        content: `You are a pixel art generator. Based on the user’s prompt: ${prompt}, return ONLY a JSON object with the following structure and in this exact field order:

          {
            "character": {
              "name": "character name",
              "width": 32,
              "height": 32,
              "pixels": [
                {"x": 0, "y": 0, "color": "#FF0000"},
                {"x": 1, "y": 0, "color": "#00FF00"}
              ]
            },
            "obstacles": [
              {
                "type": "rock",
                "width": 20,
                "height": 20,
                "color": "#808080"
              }
            ],
            "speed": {
              "value": 200
            },
            "jump": {
              "type": "normal",
              "velocityY": -300
            }
          }

          Rules:
          - Always return JSON with keys in this order: character → obstacles → speed → jump.
          - Character width and height must each be between 16 and 64 pixels.
          - If the user defines a character, generate pixel art inside "pixels". If not defined, still return a default character.
          - If obstacles are not defined, return one default obstacle: {"type": "rock","width": 20,"height": 20,"color": "#808080"}.
          - If speed is not defined, use default: {"value": 200}.
          - If jump type is not defined, use default: {"type": "normal","velocityY": -300}.
          - Use only simple colors (red, blue, green, yellow, black, white, gray, etc.).
          - Return ONLY valid JSON. No explanations, no extra text, no comments.`,
      },
    ],
    model: "qwen-3-coder-480b",
  })) as ChatCompletion;

  const message = response.choices[0]?.message;
  const responseText = message?.content;
  console.log("message in ai function:", responseText);

  console.log("response from ai:", response);

  return response;
}

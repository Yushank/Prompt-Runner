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
        role: "system",
        content: `You are a pixel art generator. Generate pixel art as a grid of characters.
      Use this format for the grid:
      - '.' = transparent/empty
      - '#' = main color
      - 'O' = secondary color (eyes, details)
      - 'X' = accent color

      Rules:
      - Return ONLY valid JSON.
      - The grid must have exactly 16 rows, each row exactly 16 characters wide.
      - Do NOT copy any example I give. Always create a new, unique design for the character.
      - The palette must exactly match the characters used in the grid (don’t include unused colors).
    `,
      },
      {
        role: "user",
        content: `Create a "${prompt}" character for a runner game.

      Generate JSON with this structure (follow the structure, but invent your own pixel art grid):

      {
        "character": {
          "name": "${prompt}",
          "width": 16,
          "height": 16,
          "grid": [
            "................",
            "[16 characters row]",
            "[16 characters row]",
            "... total 16 rows ..."
          ],
          "palette": {
            ".": "#00000000",
            "#": "#808080",
            "O": "#FFFFFF",
            "X": "#FF0000"
          }
        },
        "obstacles": [
          {
            "type": "rock",
            "width": 20,
            "height": 20,
            "color": "#808080"
          }
        ],
        "speed": { "value": 200 },
        "jump": { "velocityY": -400 }
      }

      Make sure the grid is unique and clearly shows the character design.
      Do not just copy or repeat the placeholder example.
    `,
      },
    ],
    model: "qwen-3-coder-480b",
  })) as ChatCompletion;

  const message = (response as any).choices[0]?.message;
  const responseText = message?.content;
  console.log("message in ai function:", responseText);

  console.log("response from ai:", response);

  const parsed = JSON.parse(responseText || "{}");

  //converting grid to pixels
  if (parsed.character?.grid) {
    parsed.character.pixels = girdToPixels(
      parsed.character.grid,
      parsed.character.palette
    );
  }

  // return response;
  return parsed;
}

interface Pixel {
  x: number;
  y: number;
  color: string;
}

function girdToPixels(grid: string[], palette: any): Pixel[] {
  const pixels: Pixel[] = [];

  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      const color = palette[char];

      //skip transparent
      if (char !== "." && color !== "#00000000") {
        pixels.push({ x, y, color });
      }
    }
  });

  return pixels;
}

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
    messages: [{ role: "user", content: `give me a response for: ${prompt}` }],
    model: "llama-4-scout-17b-16e-instruct",
  })) as ChatCompletion;

  const message = response.choices[0]?.message;
  const responseText = message?.content;
  console.log("message in ai function:", responseText);

  console.log("response from ai:", response);

  return response;
}

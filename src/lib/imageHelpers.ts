
/**
 * Image fetch/generation/upload helpers: OpenAI, DALL·E, Pinata
 */

export async function fetchTokenMetadata(projectIdea: string, openaiApiKey: string) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const prompt = `Return exactly this JSON:  
{  
  "name": "...",  
  "symbol": "...",  
  "totalSupply": ...,  
  "imagePrompt": "...",  
  "launchCopy": "..."  
}  
For the user’s idea: ${projectIdea}
Bind its response JSON fields to variables: tokenName, tokenSymbol, tokenSupply, imagePrompt, launchCopy.`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 350,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI Error: ${await res.text()}`);
  }

  const data = await res.json();
  let text = "";
  try {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      text = data.choices[0].message.content;
    } else {
      throw new Error("OpenAI did not return a completion.");
    }
    text = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(text);
    return {
      tokenName: parsed.name,
      tokenSymbol: parsed.symbol,
      tokenSupply: parsed.totalSupply,
      imagePrompt: parsed.imagePrompt,
      launchCopy: parsed.launchCopy,
    };
  } catch (e) {
    throw new Error("Failed to parse OpenAI response: " + (e as Error).message);
  }
}

export async function generateImageDalle3(prompt: string, openaiApiKey: string): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    }),
  });
  if (!resp.ok) throw new Error("DALL·E API call failed");
  const data = await resp.json();
  return data.data[0].url as string;
}

export async function fetchImageAsBase64(url: string): Promise<{ base64: string, ext: string }> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Failed to download image");
  const blob = await resp.blob();
  const ext = blob.type.split("/")[1] ?? "png";
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...bytes));
  return { base64, ext };
}

export async function pinToPinata(base64: string, ext: string, pinataJwt: string): Promise<string> {
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  const filename = `image.${ext}`;
  const formDataParts = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${filename}"`,
    `Content-Type: image/${ext}`,
    "",
    atob(base64),
    `--${boundary}--`,
    "",
  ];
  const body = new Blob(formDataParts.map(part =>
    typeof part === "string" ? new TextEncoder().encode(part + "\r\n") : part
  ));
  const resp = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${pinataJwt}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
    }
  );
  if (!resp.ok) throw new Error("Pinata upload failed: " + await resp.text());
  const data = await resp.json();
  return data.IpfsHash as string;
}

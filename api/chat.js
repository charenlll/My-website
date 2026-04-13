export default async function handler(req, res) {
  const API_KEY = "sk-d2026e7f3ebe4f26bf188e19aec0b5e9";

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "服务器错误" });
  }
}

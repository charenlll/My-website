const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// DeepSeek 配置
const BASE_URL = "https://api.deepseek.com/v1"; // 使用 v1 兼容模式
const API_KEY = "sk-f9e818c03d464cbd8152489ad3249ac"; // 填入你的 Key
const MODEL = "deepseek-chat"; // 可选 deepseek-reasoner

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 添加用户消息
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = text;
  chatWindow.appendChild(userMsg);

  userInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    let reply = "AI 暂无回应";

    // DeepSeek 返回内容固定在 choices[0].message.content
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      reply = data.choices[0].message.content;
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = reply;
    chatWindow.appendChild(botMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (err) {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = "AI 调用失败，请检查网络或 API Key";
    chatWindow.appendChild(botMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    console.error(err);
  }
}
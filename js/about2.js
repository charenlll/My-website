const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// ✅ 改成你的 Vercel API 地址
const API_URL = "https://my-website-zeta-one-58.vercel.app/api/chat";

// 模型
const MODEL = "deepseek-chat";

// ✅ 从 localStorage 读取次数（刷新不丢失）
let requestCount = Number(localStorage.getItem('requestCount') || 0);
const MAX_REQUESTS = 3;

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // ✅ 超过次数限制
  if (requestCount >= MAX_REQUESTS) {
    const limitMsg = document.createElement('div');
    limitMsg.className = 'message bot';
    limitMsg.textContent = "已达到本次访问的最大提问次数（3次）";
    chatWindow.appendChild(limitMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return;
  }

  // ✅ 次数 +1 并存储
  requestCount++;
  localStorage.setItem('requestCount', requestCount);

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

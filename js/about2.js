const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// ✅ Vercel API
const API_URL = "https://my-website-zeta-one-58.vercel.app/api/chat";

// 模型
const MODEL = "deepseek-chat";

// ✅ 改这里：不用 localStorage（刷新自动重置）
let requestCount = 0;
const MAX_REQUESTS = 3;

// 事件监听
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // ❗ 次数限制
  if (requestCount >= MAX_REQUESTS) {
    addMessage("已达到本次访问的最大提问次数（3次）", "bot");
    return;
  }

  // ✅ 次数 +1（仅当前页面有效）
  requestCount++;

  // 添加用户消息
  addMessage(text, "user");
  userInput.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }

    addMessage(reply, "bot");

  } catch (err) {
    addMessage("AI 调用失败，请检查网络或接口配置", "bot");
    console.error(err);
  }
}

// UI函数
function addMessage(text, role) {
  const msg = document.createElement('div');
  msg.className = 'message ' + role;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

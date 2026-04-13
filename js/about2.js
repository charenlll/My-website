const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// ✅ Vercel API
const API_URL = "https://my-website-zeta-one-58.vercel.app/api/chat";

// 模型
const MODEL = "deepseek-chat";

// 次数限制
let requestCount = Number(localStorage.getItem('requestCount') || 0);
const MAX_REQUESTS = 10;

// 事件监听（你刚刚漏了）
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // ❗ 次数限制
  if (requestCount >= MAX_REQUESTS) {
    addMessage("已达到本次访问的最大提问次数（10次）", "bot");
    return;
  }

  // ✅ 次数 +1
  requestCount++;
  localStorage.setItem('requestCount', requestCount);

  // 添加用户消息
  addMessage(text, "user");
  userInput.value = '';

  try {
    // ✅ 正确调用 Vercel（关键！）
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

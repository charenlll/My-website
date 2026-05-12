// ===== Chat Module =====
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

const API_URL = "https://my-website-zeta-one-58.vercel.app/api/chat";
const MODEL = "deepseek-chat";
const MAX_REQUESTS = 3;
let requestCount = 0;

// ===== Event Listeners =====
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ===== Send Message =====
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (requestCount >= MAX_REQUESTS) {
    addMessage("已达到本次访问的最大提问次数（3次）", "bot");
    return;
  }

  requestCount++;
  addMessage(text, "user");
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;

  // Show loading indicator
  const loadingEl = addMessage("思考中...", "bot", true);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "AI 暂无回应";

    // Remove loading, add real reply
    loadingEl.remove();
    addMessage(reply, "bot");

  } catch (err) {
    loadingEl.remove();
    addMessage("AI 调用失败，请检查网络或接口配置", "bot");
    console.error("Chat error:", err);
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// ===== UI Helper =====
function addMessage(text, role, isLoading = false) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  if (isLoading) msg.classList.add('loading');
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

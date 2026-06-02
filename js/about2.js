// ===== Chat Module =====
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatWindow = document.getElementById("chat-window");
const promptButtons = document.querySelectorAll("[data-prompt]");

const API_URL = "https://my-website-zeta-one-58.vercel.app/api/chat";
const MODEL = "deepseek-chat";
const MAX_REQUESTS = 3;
let requestCount = 0;

const PROFILE_PROMPT = `
你是陈浩文个人作品集网站中的 AI 介绍助手。你的职责是帮助访客了解陈浩文的背景、能力与项目。

回答规则：
1. 使用自然、专业、简洁的中文回答。
2. 以“陈浩文”或“他”称呼网站主人。不要假装自己就是陈浩文。
3. 只能依据下方公开资料回答。资料未提及的内容，请明确说“网站资料中暂未提供这部分信息”，不要猜测或编造。
4. 当问题与陈浩文无关时，礼貌提醒访客本助手主要用于介绍陈浩文。
5. 回答优先给出结论，再补充必要细节。通常控制在 3 至 6 句话。
6. 可以根据访客的关注点推荐继续查看“个人简介”“数据研究”“软件开发”或“艺术表达”页面。

陈浩文的公开资料：
- 身份：武汉大学城市规划硕士研究生，研究生阶段为 2024.9 至 2027.6；本科就读于合肥工业大学城乡规划学专业，时间为 2019.9 至 2024.6。
- 方向：城市数据分析、空间研究、人工智能应用开发、系统设计与数据可视化。
- 数据能力：使用 Python、SQL 进行多源数据整合、清洗、特征构建和建模；应用过 K-means 聚类、线性与非线性回归、XGBoost、动态面板 GMM 等方法。
- 空间分析：熟悉 ArcGIS、QGIS，能够进行 GIS 数据处理、空间匹配、缓冲区分析和空间建模。
- 可视化与设计：使用 Matplotlib、Tableau、Excel，以及 Photoshop、Illustrator、SketchUp、CAD、Rhino 等工具。
- 视觉语言模型研究：基于激光点云数据与 Qwen 等视觉语言模型，完成道路边界线与路口区域的自动化提取；参与模型训练，使用 SFT 对基础模型进行冷启动预热，引入 GRPO 算法，并设计涵盖格式约束、路口几何特征和召回率等维度的复合奖励函数，以提升道路中心线与路口区域识别的平滑度和稳定性。
- 数据研究案例：处理千万级地铁刷卡数据，自动构建每日出行 OD 链路，通过空间规律性、时间稳定性与出行频率等指标识别人群行为；利用餐饮、企业、商业、文化、医疗等 POI 数据，结合 800 米缓冲区进行空间匹配和统计分析。
- 软件项目一：Mobility Agents。基于大语言模型的城市公共交通智能出行推荐系统，融合公交与地铁数据，提供站点查询、地图交互、站点周边设施数据与智能建议；采用前端、网关、智能体、数据层分层架构，并进行缓存优化。
- 软件项目二：Wriothesley。基于 Electron 与 DeepSeek API 的桌面助手，支持透明置顶窗口、自由拖拽、表情与待机动画、AI 对话、接口与人物性格配置、周计划管理和提醒。
- 软件项目三：轨道交通刷卡数据清洗工具。支持 CSV 文件读取、自定义列号、剔除重复进出站记录、筛选交易类型、删除高频用户和输出标准化 CSV。
- 艺术表达：包含通勤 OD 关系网络可视化、海报与文创设计、空间测绘、建筑与聚落尺度建模等实践。
`;

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    userInput.value = button.dataset.prompt;
    userInput.focus();
  });
});

addMessage(
  "你好，我是陈浩文个人作品集的 AI 介绍助手。我会根据本站公开资料回答有关他的研究方向、项目实践和能力结构的问题。请选择一个推荐问题，或直接输入你想了解的内容。",
  "bot",
);

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (requestCount >= MAX_REQUESTS) {
    addMessage("已达到本次访问的最大提问次数（3次）", "bot");
    return;
  }

  requestCount++;
  addMessage(text, "user");
  userInput.value = "";
  userInput.disabled = true;
  sendBtn.disabled = true;

  const loadingEl = addMessage("思考中...", "bot", true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: PROFILE_PROMPT },
          { role: "user", content: text },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "AI 暂无回应";
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

function addMessage(text, role, isLoading = false) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  if (isLoading) msg.classList.add("loading");
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

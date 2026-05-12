// ===== Navigation =====
function goHome() {
  window.location.href = "/My-website/home.html";
}

window.goPage = function (url) {
  window.location.href = url;
};

window.goBack = function () {
  window.location.href = "/My-website/home.html";
};

window.goIndex = function () {
  window.location.href = "/My-website/index.html";
};

// ===== Download =====
function downloadFile() {
  const confirmed = confirm("是否打开百度网盘下载该软件？\n提取码：1111");
  if (confirmed) {
    window.open("https://pan.baidu.com/s/1NLBkGj9NsRPA1XXkCWYHNQ?pwd=1111", "_blank", "noopener");
  }
}

// ===== External Link =====
function goAgentProject() {
  window.open("https://charenlll.github.io/mobility-agents/index.html", "_blank", "noopener");
}

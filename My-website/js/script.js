// ===== 跳转到第二主页 =====
function goHome() {
  window.location.href = "../home.html";
}

// ===== 页面跳转（子页面）=====
window.goPage = function (url) {
  console.log("跳转到：", url);
  window.location.href = url;
};

// ===== 返回首页 =====
window.goBack = function () {
  console.log("返回首页");
  window.location.href = "../home.html";
};

// ===== 返回首页 =====
window.goIndex = function () {
  console.log("返回首页");
  window.location.href = "./index.html";
};

// ===== 下载软件 =====
function downloadFile() {
  const confirmDownload = confirm("是否打开百度网盘下载该软件？\n提取码：1111");

  if (confirmDownload) {
    // 打开百度网盘链接
    const baiduLink = "https://pan.baidu.com/s/1NLBkGj9NsRPA1XXkCWYHNQ?pwd=1111";
    window.open(baiduLink, "_blank"); // 在新标签页打开
  }
}
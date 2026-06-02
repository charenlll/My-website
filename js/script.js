// ===== Navigation =====
// Resolve from this script so local files, local servers and GitHub Pages
// all use the same navigation logic.
const SITE_ROOT = new URL("../", document.currentScript.src);

function navigateFromRoot(path) {
  window.location.href = new URL(path, SITE_ROOT).href;
}

function goHome() {
  navigateFromRoot("home.html");
}

window.goPage = function (url) {
  window.location.href = new URL(url, window.location.href).href;
};

window.goBack = function () {
  navigateFromRoot("home.html");
};

window.goIndex = function () {
  navigateFromRoot("index.html");
};

// ===== Navigation State =====
const mobileNav = document.querySelector(".mobile-nav");
if (mobileNav) {
  mobileNav.querySelectorAll("a").forEach((link) => {
    if (new URL(link.href).pathname === window.location.pathname) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

const desktopNav = document.querySelector(".nav-group");
if (desktopNav) {
  const currentPage = window.location.pathname.split("/").pop();
  desktopNav.querySelectorAll("button[onclick]").forEach((button) => {
    if (button.getAttribute("onclick").includes(currentPage)) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    }
  });
}

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

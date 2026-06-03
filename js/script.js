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

window.scrollToContact = function () {
  const contact = document.getElementById("contact");
  if (!contact) return;

  contact.scrollIntoView({ behavior: "smooth", block: "end" });
};

// ===== Shared Page Shell =====
const SUB_PAGES = [
  ["about1.html", "个人简介", "简介"],
  ["about2.html", "向我提问", "问答"],
  ["about3.html", "数据研究", "研究"],
  ["about4.html", "软件开发", "开发"],
  ["about5.html", "艺术表达", "设计"],
];

function renderSharedPageShell() {
  const content = document.querySelector(".content");
  if (!content) return;

  const desktopLinks = SUB_PAGES.map(
    ([path, label]) => `<a href="./${path}" data-page="${path}">${label}</a>`,
  ).join("");
  const mobileLinks = [
    `<a href="../home.html" data-page="home.html">首页</a>`,
    ...SUB_PAGES.map(
      ([path, , shortLabel]) =>
        `<a href="./${path}" data-page="${path}">${shortLabel}</a>`,
    ),
  ].join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<nav class="top-bar" aria-label="主导航">
      <div class="nav-group">${desktopLinks}</div>
      <a class="top-btn" href="../home.html">主页</a>
    </nav>`,
  );
  content.insertAdjacentHTML(
    "beforeend",
    `<footer class="site-footer">
      <span>陈浩文 · 城市数据分析与 AI 应用开发</span>
      <a href="mailto:11641202526@qq.com">11641202526@qq.com</a>
      <span>&copy; <span data-current-year></span> All Rights Reserved</span>
    </footer>`,
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<nav class="mobile-nav" aria-label="移动端导航">${mobileLinks}</nav>
    <button class="back-to-top" type="button" aria-label="返回顶部" title="返回顶部">↑</button>
    <div class="lightbox" aria-hidden="true" role="dialog" aria-label="作品图片查看器">
      <button class="lightbox-close" type="button" aria-label="关闭图片查看器">×</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="上一张图片">‹</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="下一张图片">›</button>
      <a class="lightbox-original" href="" target="_blank" rel="noopener noreferrer">打开原图</a>
      <button class="lightbox-zoom" type="button" aria-label="切换图片缩放">放大</button>
    </div>`,
  );
}

function setNavigationState() {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("[data-page]").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;
  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 420);
  };
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
}

function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const items = [...document.querySelectorAll("[data-lightbox]")];
  if (!items.length) return;

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  const zoomButton = lightbox.querySelector(".lightbox-zoom");
  const originalLink = lightbox.querySelector(".lightbox-original");
  let currentIndex = 0;

  const show = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const preview = item.querySelector("img");
    image.src = item.href;
    image.alt = preview.alt;
    caption.textContent = preview.alt;
    originalLink.href = item.href;
    image.classList.remove("is-zoomed");
    zoomButton.textContent = "放大";
  };
  const open = (index) => {
    show(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  items.forEach((item, index) =>
    item.addEventListener("click", (event) => {
      event.preventDefault();
      open(index);
    }),
  );
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => show(currentIndex - 1));
  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", () => show(currentIndex + 1));
  zoomButton.addEventListener("click", () => {
    const isZoomed = image.classList.toggle("is-zoomed");
    zoomButton.textContent = isZoomed ? "缩小" : "放大";
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });
}

renderSharedPageShell();
setNavigationState();
setupBackToTop();
setupLightbox();
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// ===== Download =====
function downloadFile() {
  const confirmed = confirm("是否打开百度网盘下载该软件？\n提取码：1111");
  if (confirmed) {
    window.open(
      "https://pan.baidu.com/s/1NLBkGj9NsRPA1XXkCWYHNQ?pwd=1111",
      "_blank",
      "noopener",
    );
  }
}

// ===== External Link =====
function goAgentProject() {
  window.open(
    "https://charenlll.github.io/mobility-agents/index.html",
    "_blank",
    "noopener",
  );
}

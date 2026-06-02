# My Website

陈浩文的个人作品集网站。项目使用原生 HTML、CSS 和 JavaScript，可直接部署到 GitHub Pages 或 Vercel。

## 本地预览

在项目根目录运行：

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

然后访问：

```text
http://127.0.0.1:5500/
```

不建议长期使用 `file://` 直接打开页面。本地 HTTP 服务更接近线上环境。

## 目录结构

```text
api/                 Vercel Serverless API
css/                 页面样式
images/              高清原图
images/previews/     页面使用的 WebP 预览图
js/script.js         共享导航、页脚、返回顶部与 Lightbox
js/about2.js         个人介绍 AI 助手
pages/               五个子页面
index.html           封面页
home.html            作品集首页
```

## 图片规范

- 页面预览优先使用 `images/previews/*.webp`。
- 高清原图保留在 `images/`，用于 Lightbox 查看。
- 新增图片时请补充 `width` 和 `height`，减少页面加载时的布局跳动。

生成 WebP 预览图示例：

```powershell
New-Item -ItemType Directory -Force images\previews | Out-Null
npx --yes -p sharp-cli -- sharp -i ./images/example.png -o ./images/previews -f webp -q 82 resize 1200
```

## 发布流程

提交并推送到 `main`：

```powershell
git add .
git commit -m "Describe your changes"
git push origin main
```

GitHub Pages 地址：

```text
https://charenlll.github.io/My-website/
```

## 缓存刷新

修改 CSS 或 JavaScript 后，如果线上仍显示旧内容，请更新 HTML 中静态资源 URL 的版本参数：

```html
<link rel="stylesheet" href="./css/style.css?v=20260602-3" />
<script src="./js/script.js?v=20260602-3"></script>
```

版本值只需递增。它会让浏览器重新请求资源，无需访客手动清理缓存。

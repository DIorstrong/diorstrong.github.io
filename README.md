# 思晨的博客

吴思晨的个人博客，基于 Hugo + 自定义 cardmag 主题，部署在 GitHub Pages。

**在线地址**：https://diorstrong.github.io/

**管理后台**：https://diorstrong.github.io/admin/

---

## 技术栈

- [Hugo](https://gohugo.io/) v0.161.1 —— 静态站点生成器
- [Decap CMS](https://decapcms.org/) —— 在线内容管理后台
- [GitHub Pages](https://pages.github.com/) —— 免费静态托管
- [GitHub Actions](https://github.com/features/actions) —— 自动构建与部署

---

## 快速开始

### 本地预览

双击运行项目根目录的 `preview.bat`，或执行：

```bash
hugo server -D
```

浏览器访问 `http://localhost:1313`

### 本地构建

双击运行 `build.bat`，或执行：

```bash
hugo --minify
```

构建结果输出到 `public/` 目录。

---

## 目录结构

```
.
├── archetypes/           # 文章模板
├── content/              # 网站内容
│   ├── posts/            # 博客文章
│   ├── education.md      # 教育经历页面
│   └── music.md          # 音乐页面
├── static/
│   ├── images/uploads/   # 上传的图片
│   └── admin/            # Decap CMS 后台文件
│       ├── index.html    # CMS 入口
│       ├── config.yml    # CMS 配置
│       └── preview.css   # CMS 预览样式
├── themes/
│   └── cardmag/          # 自定义主题
│       ├── assets/
│       │   ├── css/main.css
│       │   └── js/main.js
│       └── layouts/      # HTML 模板
├── oauth-proxy/          # OAuth 代理（Cloudflare / Vercel）
├── hugo.toml             # 站点配置
├── preview.bat           # 本地预览脚本
├── build.bat             # 本地构建脚本
└── CMS_SETUP_GUIDE.md    # CMS 设置指南
```

---

## 使用 Decap CMS 管理内容

博客已集成 Decap CMS 在线编辑器，支持：

- 在线撰写和编辑文章（支持 Markdown 富文本编辑器）
- 上传和管理图片（自动保存到仓库）
- 设置文章封面图、标签、摘要
- 直接编辑"音乐"和"教育经历"页面
- 修改站点标题、描述、导航菜单
- 所有更改自动提交到 GitHub 并触发自动部署

**首次使用请先阅读** [`CMS_SETUP_GUIDE.md`](./CMS_SETUP_GUIDE.md)

---

## 主题定制

主题样式位于 `themes/cardmag/assets/css/main.css`。主要配色变量在 `:root` 中定义：

```css
:root {
  --bg: #f5f6f8;          /* 页面背景 */
  --card-bg: #ffffff;      /* 卡片背景 */
  --text: #2d2d2d;         /* 主文字 */
  --text-light: #666666;   /* 次要文字 */
  --accent: #ff6b6b;       /* 主题色（珊瑚红）*/
  --accent-hover: #fa5252; /* 主题色悬停 */
  --border: #e9ecef;       /* 边框 */
  --radius: 14px;          /* 圆角 */
  --shadow: ...;           /* 阴影 */
  --max-width: 860px;      /* 最大宽度 */
}
```

---

## 部署

提交到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

```bash
git add .
git commit -m "更新内容"
git push origin main
```

---

## 作者

**吴思晨** —— 浙江大学机械工程本科生

记录生活，分享思考。

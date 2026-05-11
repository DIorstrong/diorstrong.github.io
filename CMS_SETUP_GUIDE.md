# Decap CMS 在线编辑器 —— 完整设置指南

本指南将带你完成 Decap CMS 在线编辑器的全部配置，让你可以通过网页后台发文章、上传配图、管理音乐页面，所有更改自动提交到 GitHub 并自动部署。

---

## 第一步：创建 GitHub OAuth App

Decap CMS 需要通过 GitHub 账号登录并提交内容，因此需要在 GitHub 上创建一个 OAuth 应用。

1. 打开 [GitHub Developer Settings](https://github.com/settings/developers)（设置 → 开发者设置 → OAuth Apps）
2. 点击右上角 **"New OAuth App"**
3. 填写以下信息：

   | 字段 | 填写内容 |
   |------|---------|
   | **Application name** | `Decap CMS for 思晨的博客`（随便取） |
   | **Homepage URL** | `https://diorstrong.github.io` |
   | **Application description** | （可选）Decap CMS 后台登录 |
   | **Authorization callback URL** | 暂时填 `https://diorstrong.github.io/admin/` |

4. 点击 **"Register application"**
5. 注册完成后，点击 **"Generate a new client secret"**，生成密钥
6. **把 `Client ID` 和 `Client Secret` 复制保存下来**，页面刷新后密钥就不可见了

> **重要**：现在先不要关闭这个页面，等部署好 OAuth 代理后再回来修改 callback URL。

---

## 第二步：部署 OAuth 代理（二选一）

Decap CMS 需要一个中间服务器来交换 GitHub 的 OAuth 授权码（code）换取访问令牌（token）。这里提供两个**完全免费**的方案，推荐方案 A（Cloudflare Workers，国内访问更快）。

---

### 方案 A：Cloudflare Workers（推荐）

Cloudflare Workers 是免费的 Serverless 平台，每月 10 万次请求，完全够用。

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)，注册/登录账号
2. 左侧菜单找到 **"Workers & Pages"**，点击 **"创建 Worker"**
3. 给 Worker 起个名字，例如 `diorstrong-cms-proxy`，然后点击 **"部署"**
4. 部署成功后，点击 **"编辑代码"**
5. 把 `oauth-proxy/cloudflare-worker/index.js` 文件中的全部代码粘贴进去，保存
6. 点击顶部 **"设置"** → 左侧 **"变量"**
7. 添加两个**加密的环境变量**（点"添加变量"后选择🔒加密）：
   - `GITHUB_CLIENT_ID` → 粘贴第一步拿到的 Client ID
   - `GITHUB_CLIENT_SECRET` → 粘贴第一步拿到的 Client Secret
8. 点击 **"保存并部署"**
9. 记下 Worker 的访问地址，格式类似：
   ```
   https://diorstrong-cms-proxy.your-username.workers.dev
   ```

---

### 方案 B：Vercel

如果你更熟悉 Vercel，也可以选择这个方案。

1. 打开 [Vercel](https://vercel.com/)，用 GitHub 账号登录
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 `diorstrong.github.io` 仓库
4. 在项目设置中找到 **"Environment Variables"**，添加：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
5. 把 `oauth-proxy/vercel/` 文件夹的内容作为根目录部署
6. 部署完成后，访问地址类似：
   ```
   https://diorstrong-cms-proxy.vercel.app/api/auth
   ```

---

## 第三步：配置 Decap CMS

拿到 OAuth 代理地址后，需要修改 CMS 的配置文件，让它知道去哪里做认证。

1. 打开本仓库的 `static/admin/config.yml`
2. 修改 `backend` 部分的 `auth_endpoint`：

   **如果用了 Cloudflare Workers：**
   ```yaml
   backend:
     name: github
     repo: diorstrong/diorstrong.github.io
     branch: main
     base_url: https://diorstrong.github.io
     auth_endpoint: https://diorstrong-cms-proxy.xxx.workers.dev   # ← 改成你的 Worker 地址
   ```

   **如果用了 Vercel：**
   ```yaml
   backend:
     name: github
     repo: diorstrong/diorstrong.github.io
     branch: main
     base_url: https://diorstrong.github.io
     auth_endpoint: https://diorstrong-cms-proxy.vercel.app/api/auth   # ← 改成你的 Vercel 地址
   ```

3. 保存文件

---

## 第四步：修改 GitHub OAuth App 的回调地址

回到第一步创建的 [GitHub OAuth App 设置页面](https://github.com/settings/developers)：

1. 找到 **"Authorization callback URL"**
2. 把它改成你的 OAuth 代理地址：
   - Cloudflare: `https://diorstrong-cms-proxy.xxx.workers.dev`
   - Vercel: `https://diorstrong-cms-proxy.vercel.app/api/auth`
3. 点击 **"Update application"**

---

## 第五步：提交并部署

现在把 CMS 相关文件提交到 GitHub，触发自动部署：

```bash
cd "C:\Users\75607\Documents\GitHub\diorstrong.github.io"
git add .
git commit -m "集成 Decap CMS 在线编辑器"
git push origin main
```

等待约 1-2 分钟，GitHub Actions 会自动构建并部署。

---

## 第六步：开始使用 CMS

1. 打开你的博客地址：https://diorstrong.github.io/
2. 在地址栏后面加上 `/admin/`，进入：
   ```
   https://diorstrong.github.io/admin/
   ```
3. 点击 **"Login with GitHub"**，授权登录
4. 恭喜！你现在看到了 Decap CMS 的后台界面

---

## CMS 后台功能说明

登录后，左侧边栏会显示以下几个板块：

| 板块 | 功能 |
|------|------|
| **文章** | 发布新文章、编辑已有文章、设置封面图、标签、草稿状态 |
| **独立页面** | 创建新的独立页面（如"关于我"、"项目展示"等） |
| **音乐页面** | 直接在线编辑"音乐"页面的内容 |
| **教育经历页面** | 直接在线编辑"教育经历"页面的内容 |
| **站点设置** | 修改网站标题、作者名、描述、导航菜单等 |
| **媒体库** | 上传和管理图片，文章中可直接引用 |

---

### 发布一篇新文章

1. 点击左侧 **"文章"** → 右上角 **"新建文章"**
2. 填写表单：
   - **标题**：文章标题
   - **发布日期**：默认当前时间
   - **草稿状态**：✅ 勾选表示存草稿（不会发布），取消勾选表示正式发布
   - **标签**：可以添加多个，如 `随笔`、`生活`、`学习`
   - **摘要**：简短描述，会显示在首页卡片上
   - **封面图**：点击上传或从媒体库选择，会显示在卡片顶部
   - **正文**：支持 Markdown，可以用工具栏排版
3. 写完后点击右上角 **"保存"**，选择 **"发布"**（Publish now）
4. 内容会自动提交到 GitHub 仓库，并触发自动部署
5. 约 1-2 分钟后刷新博客首页，即可看到新文章

---

### 上传配图

1. 在文章编辑器的正文区域，点击工具栏的图片按钮
2. 选择 **"上传"** 或直接拖拽图片到编辑器
3. 图片会自动保存到 `static/images/uploads/` 目录
4. 发布后图片会正常显示在文章中

---

### 编辑音乐/教育经历页面

1. 点击左侧 **"音乐页面"** 或 **"教育经历页面"**
2. 直接编辑内容（支持 Markdown）
3. 保存并发布

---

### 修改站点设置

1. 点击左侧 **"站点设置"**
2. 可以修改：
   - 网站标题
   - 站点描述（首页 Hero 区域的副标题）
   - 作者名称（页脚显示）
   - 导航菜单（增删改导航栏项目）
3. 保存后自动部署

---

## 常见问题

### Q1：打开 `/admin/` 页面空白或报错？

- 检查 `static/admin/config.yml` 中的 `repo` 是否填对了（区分大小写）
- 检查 `auth_endpoint` 是否填写了正确的 OAuth 代理地址
- 检查 GitHub OAuth App 的 callback URL 是否和代理地址一致
- 打开浏览器开发者工具（F12）→ Console，看具体报错信息

### Q2：点击"Login with GitHub"后报错？

- 检查 GitHub OAuth App 的 `Client ID` 和 `Client Secret` 是否正确
- 检查 OAuth 代理的环境变量是否配置正确
- 检查 OAuth App 的 Authorization callback URL 是否填对了

### Q3：保存文章后网站没有更新？

- 保存只是提交到 GitHub 仓库，需要等待 GitHub Actions 构建完成（约 1-2 分钟）
- 可以在仓库的 **Actions** 标签页查看构建进度
- 如果构建失败，查看 Actions 日志排查问题

### Q4：图片上传后显示不了？

- 图片上传到了 `static/images/uploads/`，构建后实际路径是 `/images/uploads/`
- 确保在 CMS 配置中 `public_folder` 填的是 `/images/uploads`
- 如果图片路径有问题，检查 `hugo.toml` 中的 `baseURL` 是否正确

### Q5：如何添加新的导航菜单？

1. 进入 CMS → 站点设置 → 导航菜单
2. 点击"添加导航菜单项"
3. 填写名称和页面引用（如 `/about`）
4. 保存后，需要先在 content 目录创建对应的页面文件

---

## 本地开发（可选）

如果你想在本地预览博客效果：

```bash
cd "C:\Users\75607\Documents\GitHub\diorstrong.github.io"
hugo server -D
```

浏览器打开 `http://localhost:1313` 即可预览。

> 注意：本地预览时 CMS 后台无法登录（OAuth callback 地址不匹配），需要在部署后的线上环境使用 CMS。

---

## 技术架构

```
你（浏览器）
  │
  ├──→ https://diorstrong.github.io/admin/   （Decap CMS 界面）
  │      └── 加载 static/admin/config.yml
  │
  ├──→ GitHub OAuth 登录
  │      └── 授权后回调到 Cloudflare/Vercel 代理
  │
  ├──→ 代理交换 code → access_token
  │      └── 返回 token 给 CMS
  │
  └──→ CMS 通过 GitHub API 读写仓库文件
         └── 自动 commit 到 main 分支
                └── 触发 GitHub Actions 构建
                       └── 部署到 GitHub Pages
```

---

**有任何问题随时问我！**

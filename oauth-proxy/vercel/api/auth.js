/**
 * Vercel Serverless Function —— Decap CMS GitHub OAuth 代理
 *
 * 部署步骤：
 * 1. 登录 https://vercel.com 注册/登录账号（可用 GitHub 账号直接登录）
 * 2. 在本地 oauth-proxy/vercel 目录下运行：
 *    npm i -g vercel
 *    vercel login
 *    vercel --prod
 * 3. 或者在 Vercel 网页端导入 GitHub 仓库
 * 4. 在 Vercel 项目设置中添加环境变量：
 *    - GITHUB_CLIENT_ID
 *    - GITHUB_CLIENT_SECRET
 * 5. 部署后复制 URL（如 https://diorstrong-cms-proxy.vercel.app/api/auth）
 * 6. 回到 CMS 配置文件 static/admin/config.yml，把 backend.auth_endpoint 改成这个 URL
 */

export default async function handler(req, res) {
  // 允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const code = req.query.code || req.body?.code;

  if (!code) {
    res.status(400).json({ error: "Missing code parameter" });
    return;
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      res.status(400).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Cloudflare Worker —— Decap CMS GitHub OAuth 代理
 *
 * 部署步骤：
 * 1. 登录 https://dash.cloudflare.com 注册/登录账号
 * 2. 进入 Workers & Pages，点击"创建 Worker"
 * 3. 给 Worker 起个名字（如 diorstrong-cms-proxy），点击部署
 * 4. 进入 Worker 编辑页面，把下面整段代码粘贴进去，保存
 * 5. 点击"设置" → "变量"，添加两个环境变量：
 *    - GITHUB_CLIENT_ID     (你的 GitHub OAuth App 的 Client ID)
 *    - GITHUB_CLIENT_SECRET (你的 GitHub OAuth App 的 Client Secret)
 * 6. 重新部署 Worker
 * 7. 复制 Worker 的 URL（如 https://diorstrong-cms-proxy.xxx.workers.dev）
 * 8. 回到 CMS 配置文件 static/admin/config.yml，把 backend.auth_endpoint 改成这个 URL
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state") || "";

    if (!code) {
      return new Response(JSON.stringify({ error: "Missing code parameter" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    try {
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify(data), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // 返回 token，Decap CMS 会处理后续逻辑
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};

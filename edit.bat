@echo off
chcp 65001 >nul
title 思晨的博客 · 管理工具

echo.
echo   🔧 思晨的博客 · 管理工具
echo   ─────────────────────────
echo.
echo   [1] 打开可视化管理工具（推荐）
echo   [2] 启动本地预览服务器
echo   [3] 同时打开管理工具 + 预览
echo   [4] 构建并部署
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto editor
if "%choice%"=="2" goto preview
if "%choice%"=="3" goto both
if "%choice%"=="4" goto deploy
goto end

:editor
echo.
echo 正在打开管理工具...
start "" "%~dp0admin-tool.html"
echo ✅ 管理工具已在浏览器中打开
echo 💡 提示：在工具中点击「打开项目目录」，选择当前文件夹
goto end

:preview
echo.
echo 正在启动 Hugo 预览服务器...
echo 🌐 预览地址: http://localhost:1313/
echo.
hugo server --port 1313
goto end

:both
echo.
echo 正在启动预览服务器...
start "Hugo Server" cmd /c "cd /d %~dp0 && hugo server --port 1313"
timeout /t 2 /nobreak >nul
echo 正在打开管理工具...
start "" "%~dp0admin-tool.html"
echo.
echo ✅ 管理工具 + 预览服务器已启动
echo 🌐 预览地址: http://localhost:1313/
echo.
pause
goto end

:deploy
echo.
echo 正在构建站点...
hugo --gc
echo.
echo 📦 构建完成！产物在 public\ 目录
echo 🚀 提交到 GitHub：
echo    git add .
echo    git commit -m "更新内容"
echo    git push
echo.
pause
goto end

:end

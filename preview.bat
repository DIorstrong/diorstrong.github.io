@echo off
chcp 65001 > nul
echo =========================================
echo   思晨的博客 —— 本地预览服务器
echo =========================================
echo.

REM 检查 hugo 是否可用
where hugo > nul 2>>1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 hugo 命令。
    echo 请确保 Hugo 已安装并添加到 PATH。
    echo 当前配置的 Hugo 路径：C:\hugo\hugo.exe
    echo.
    pause
    exit /b 1
)

echo 正在启动 Hugo 预览服务器...
echo 请稍候...
echo.

hugo server -D --bind 0.0.0.0 --port 1313

echo.
pause

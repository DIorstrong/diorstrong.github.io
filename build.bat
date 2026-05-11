@echo off
chcp 65001 > nul
echo =========================================
echo   思晨的博客 —— 本地构建
echo =========================================
echo.

REM 检查 hugo 是否可用
where hugo > nul 2>>1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 hugo 命令。
    echo 请确保 Hugo 已安装并添加到 PATH。
    echo.
    pause
    exit /b 1
)

echo 正在清理旧构建文件...
hugo --gc

echo.
echo 正在构建站点...
hugo --minify

echo.
echo =========================================
echo   构建完成！输出目录：public/
echo =========================================
echo.
pause

# 上线说明

这个作品集是静态网站，不需要服务器或数据库。入口文件是 `index.html`。

## 最简单：Netlify Drop

1. 打开 https://app.netlify.com/drop
2. 登录或注册 Netlify。
3. 把整个 `portfolio-site` 文件夹拖进去，或上传生成好的 `portfolio-site-online.zip`。
4. 等待上传完成，Netlify 会给你一个 `https://...netlify.app` 链接。
5. 把这个链接发给 HR。

## 适合长期维护：GitHub Pages

由于 `assets/videos/cheng.mp4` 超过 25MiB，不建议用 GitHub 网页上传文件。用 Git 推送更稳。

1. 在 GitHub 新建一个公开仓库，例如 `media-portfolio`。
2. 不要勾选初始化 README、`.gitignore` 或 license。
3. 复制仓库地址，例如 `https://github.com/你的用户名/media-portfolio.git`。
4. 在本地项目目录执行：

```bash
git remote add origin https://github.com/你的用户名/media-portfolio.git
git branch -M main
git push -u origin main
```

5. 进入仓库 Settings > Pages。
6. Source 选择 `Deploy from a branch`。
7. Branch 选择 `main` 和 `/(root)`。
8. 保存后等待几分钟，会生成一个 `https://用户名.github.io/media-portfolio/` 链接。

## 重要提醒

- 不要把本地 `file:///E:/...` 链接发给 HR，别人电脑打不开。
- 页面里的“添加作品”只保存在当前浏览器本地，HR 打开网页看不到这些临时新增内容。
- 正式上线前，如果要新增作品，建议把视频放进 `assets/videos/`，再改 `app.js` 里的 `defaultWorks`。
- GitHub Pages 是公开网页，页面和视频都会被别人访问到；投递用作品可以公开，但不要放身份证、电话等敏感信息。

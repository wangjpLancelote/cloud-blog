# Cloud Blog

基于 Next.js App Router 的个人博客，支持 MDX、暗色模式、shadcn 组件与多语言（中/英）切换。

## 技术栈
- 应用框架：Next.js 15 App Router（TypeScript）
- 样式：Tailwind CSS v4、shadcn/ui 基础组件（Button、Card）、tailwindcss-animate
- 代码高亮：rehype-pretty-code + prism/shiki
- 通知：sonner Toaster
- 状态管理：Zustand（`src/store/locale.ts` 管理语言选择）
- Markdown/MDX：`src/posts/*.mdx`，前置字段支持 `title`/`date`/`description`
- i18n：简易字典 `src/i18n/dictionaries/{en,zh}.json`，`app/(translate)` 下的 Provider 和切换器

## 目录结构（核心）
```
src/
  app/
    (style)/       # Tailwind & 全局样式切分（tailwind/base/components/utilities/fonts）
    (translate)/   # I18nProvider、语言切换器
    blog/          # 博客列表与详情路由
    layout.tsx     # 全局布局，挂载 StoreProvider/I18nProvider/Toaster
    page.tsx       # 重定向至 /blog
  components/      # 复用组件（Header/Layout 等），ui/ 下为 shadcn 组件
  i18n/            # 语言字典
  lib/             # 数据/工具（posts 读取/解析等）
  posts/           # MDX 文章
  store/           # Zustand stores（locale）
public/
  assets/          # 静态资源
  fonts/geist/     # Geist 字体
  favicon.ico
```

## 快速开始
```bash
# 安装依赖（推荐 pnpm）
pnpm install

# 开发
pnpm dev

# 代码检查（Biome）
pnpm run lint:biome
```
打开 http://localhost:3000 自动跳转到 /blog。

## 写作 & i18n
- 新文章：在 `src/posts/` 添加 `.mdx` 文件；若无 frontmatter `title`，默认用文件名转为标题（如 `hello-world` -> “Hello World”）。
- 语言切换：右下角 Language 切换器；选择持久化到本地存储，Auto 会根据浏览器语言判定（zh/en）。

## 组件与样式
- 基础样式拆分：
  - `app/(style)/tailwind.css` 仅导入 tailwind
  - `app/(style)/base.css` 主题变量、全局背景/字体
  - `app/(style)/components.css` 代码块/rehype pretty code 样式
  - `app/(style)/utilities.css` 可放置自定义 utilities
- shadcn/ui：`src/components/ui/` 提供 Button、Card，`cn` 工具在 `src/lib/utils.ts`
- Toaster：`src/components/ui/toaster.tsx`，在 layout 全局挂载，使用 `toast.success(...)`

## 部署
- 直接使用 Next.js 构建产物，支持 Vercel/自托管：
```bash
pnpm build
pnpm start
```

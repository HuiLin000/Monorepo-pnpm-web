# Monorepo-pnpm-web

采用Monorepo管理模式，将小型移动端项目代码集成在一个架构中

## 动机

统一管理所有公共依赖，并采用最新的前端框架

## 技术栈

- 管理模式：Monorepo + pnpm pnpm-workspace
- 包管理工具：[pnpm](https://github.com/pnpm/pnpm)
- 构建工具：[Vite 4.x](https://github.com/vitejs/vite)
- 前端框架：[Vue 3.3+](https://github.com/vuejs/core)
- 路由：[Vue-router 4.x](https://github.com/vuejs/router)
- 状态管理：[Pinia 2.x](https://github.com/vuejs/pinia)
- 类型检查：[TypeScript 5.x](https://github.com/microsoft/TypeScript)
- 组件库：[Vant 4.x](https://github.com/youzan/vant)
- 请求库：[Axios](https://github.com/axios/axios)
- sass、lodash-es ...

## 注意事项

- 版本相关：

  - Vue3.x 需要 Node.js 版本 16+

  - Vite 需要 Node.js 版本 14.18+，16+

  - lint-staged 采用 v13.x，需要 Node.js 版本 14.13.1，16.0.0 或以上

  - 综合以上，建议安装 Node.js 版本 16+

  - 作者使用当前长期维护版本18.17.0

- 关于代码风格统一化：
  - esLint 、prettier 等全部使用根目录设置
- 项目中`vite.config.ts`配置：
  - 继承根目录 `vite.base.config.ts` 管理本地代理地址等（待优化）
- 项目中`tsconfig.json`配置：
  - 继承根目录 `tsconfig.json`

## 使用步骤

- 直接拷贝

1. 在根目录下执行`pnpm i` 安装全局所需依赖
2. 在w2023 中新建文件夹，复制web1中的全部文件（注意：不要复制`node_modules`、`dist`等类型文件），若修改层级则需要修改配置文件中的相对路径
3. 修改`package.json` 中`name`，格式为 -> `@vueapp/{目录名称}`，该名称作为项目的唯一标识，请规范设置并与项目目录保持一致！
4. 进入到项目执行 `pnpm i` 安装全局公共依赖 `@manage/shared`
5. 执行`pnpm run dev`运行项目

- 自行构建

1. 进入到/w2023 执行 `pnpm create vite` 自行创建vue3 + ts 的项目模板
2. 根据需要仿照`web1` 进行构建，需保留示例项目的功能下拓展

## 常用指令

- 依赖管理

```bash
# 在根目录安装开发依赖 xxx
# w的意思是，workspace-root把依赖包安装到工作目录的根路径下，则根目录下会生成node_modules文件夹。可以共用，后续每个项目需要用到vue的，都直接从根目录node_modules里取。
# D 将依赖安装在开发环境中
pnpm add xxx -w -D

# 如某项目需要单独安装某个依赖，则进入该项目执行
pnpm add xxx

```

- 将本地公共方法目录与项目建立关联

```bash
# 指定版本号
pnpm install @manage/shared@workspace --filter @vueapp/{项目名}

# 不指定版本号，取最新版本
pnpm install @manage/shared@* --filter @vueapp/{项目名}
```

## TODO:

1. 创建复制项目命令行
2. 采用node path 修改`../../../`的引入方式，防止有项目层级不对
3. 封装微信jssdk 分享方法
4. 封装移动端各种适配方案
5. 查漏补缺....

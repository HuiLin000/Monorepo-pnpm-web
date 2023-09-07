import { defineConfig } from 'vite'

import { ViteBaseConfig } from '../../../vite.base.config'

// https://vitejs.dev/config/

// 继承最外层
export default defineConfig({
  ...ViteBaseConfig({
    dirname: __dirname,
    port: 6677,
    proxy_url: 'https://fangan-demo.iforce-media.cn/api/'
  })
})

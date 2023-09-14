import { defineConfig, loadEnv } from 'vite';

import { ViteBaseConfig } from '../../../vite.base.config';

// https://vitejs.dev/config/

// 继承最外层
// export default defineConfig({

// });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 现在就可以用env这个变量点出你在.env文件里面定义的字段了
  const env = loadEnv(mode, process.cwd()); // 获取 .env里面定义是参数

  console.log('当前运行环境变量 env：', env);
  console.log('当前运行环境变量 mode：', mode);
  console.log('当前运行目录', process.cwd());

  return {
    ...ViteBaseConfig({
      dirname: __dirname,
      port: Number(env.VITE_PORT),
      proxy_url: env.VITE_PROXY_URL,
    }),
  };
});

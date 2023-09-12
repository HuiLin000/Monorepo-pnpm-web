<script lang="ts" setup>
import { ref } from "vue";

import { checkFun } from "@manage/shared";

import { testFun } from "@/assets/js/index";

import { Md5 } from "ts-md5";

import { testApi } from "@/api";

console.log(import.meta.env);

// console.log(process.cwd());

const useInfo = ref("");
const testClick = () => {
  let args = { username: "s_admin", password: Md5.hashStr("123456") };

  testApi(args).then(res => {
    console.log(res);
    useInfo.value = res;
  });
};

checkFun();
testFun();
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>

  <van-button type="success" @click="testClick">
    我是VAnt按钮，点我测试接口请求
  </van-button>

  <div class="useInfo">打印请求结果：{{ useInfo }}</div>
</template>

<style>
h1 {
  font-size: 20px;
}
</style>

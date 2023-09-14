<script lang="ts" setup>
  import { ref, nextTick } from 'vue';

  import { checkFun } from '@manage/shared';

  import { testFun } from '@/assets/js/index';

  import { Md5 } from 'ts-md5';

  import { testApi } from '@/api';

  // import { useWxShare } from "@manage/shared";

  import { reset } from '@manage/shared/utils/pageReset';

  console.log(import.meta.env);

  // 在vue中，获取元素需要放在 `nextTick` 中，否则dom元素还未加载完成
  nextTick(() => {
    reset({
      target: '.csBox',
    });
  });

  /**
   * 测试接口状态
   */

  const useInfo = ref('');
  const testClick = () => {
    let args = { username: 's_admin', password: Md5.hashStr('123456') };

    testApi(args).then((res) => {
      console.log(res);
      useInfo.value = res;
    });
  };

  /**
   * 测试方法库是否导入成功
   */

  checkFun();
  testFun();

  const testImgClick = () => {
    console.log(123123);
  };

  /**
   * 测试分享
   */
  // useWxShare({
  //   title: "title",
  //   desc: "desc",
  //   imgUrl: "icon",
  //   link: location.href
  // });
</script>

<template>
  <div class="about">
    <h1>使用模板前，请先阅读.md文档</h1>
  </div>

  <van-button type="success" @click="testClick"> 我是VAnt按钮，点我测试接口请求 </van-button>

  <div class="useInfo">打印请求结果：{{ useInfo }}</div>

  <!-- 首页 -->
  <div class="page1 page_home reset-wh100 reset-position reset-overflowH zInde2">
    <img src="../assets/img/home_bg.jpg" class="csBox" width="900" height="1624" left="0" top="0" />
    <img src="../assets/img/home_btn.png" class="csBox ftmsAn home_btn" width="326" height="79" left="285" top="1275" if-ani="pulse" if-infinite="true" if-duration="1.5s" @click="testImgClick" />
    <img src="../assets/img/home_dl.png" class="csBox ftmsAn" width="528" height="760" left="188" top="510" if-ani="wobble" />
    <img src="../assets/img/home_title.png" class="csBox ftmsAn" width="630" height="190" left="139" top="368" if-ani="flipInX" if-delay="1s" if-duration="0.5s" />

    <img src="../assets/img/home_yh1.png" class="csBox ftmsAn" width="79" height="79" left="113" top="278" />

    <img src="../assets/img/home_yh2.png" class="csBox ftmsAn" width="55" height="55" left="749" top="302" />
  </div>
</template>

<style>
  h1 {
    font-size: 20px;
  }
</style>

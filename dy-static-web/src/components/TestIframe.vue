<template>
  <div>
    <!-- 使用 iframe 显示 HTML 字符串 -->
    <iframe v-bind:srcdoc="srcData" width="100%" height="300"></iframe>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { launchSessionGame } from "@/api/platform/platform";

const srcData = ref("");
onMounted(() => {
  launchSessionGame("PG", {
    gameCode: 125,
    isMobile: false
  }).then((res) => {
    const scriptEndTag = "</" + "script>";
    srcData.value = res.data
      .replace(/<\/script>/g, scriptEndTag)
      .replaceAll(/\\\"/g, '"')
      .replaceAll(/\n/g, "");

    console.log(srcData.value);
  });
});
</script>

<template>
  <div class="live-container">
    <PlatformView 
      :pageType="'SPORT'"
      :enName="'SPORT GAME'"
      :name="'体育投注'"
      :commonName="'体育'"
      :description="'全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！'"
    />
  </div>
</template>

<script setup>
  import PlatformView from '@/components/pages/PlatformView.vue';
</script>


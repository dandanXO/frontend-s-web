<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  >
    <a-spin />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { launchSessionGame } from "@/api/platform/platform";

onMounted(() => {
  const params = localStorage.getItem("sportsSession");
  var sport = params ? JSON.parse(params) : "";
  launchSessionGame(sport.name, { isMobile: sport.isMobile })
    .then((d) => {
      if (d.code == 0) {
        location.href = d.data;
      }
    })
});
</script>

<template>
  <div class="match-info-wrapper">
    <match-info v-for="(match, index) in matchList" :key="index" :match="match" />
  </div>
</template>
<script setup>
import MatchInfo from "./MatchInfo.vue";

defineProps({
  matchList: {
    type: Array,
    default: () => []
  }
});
</script>
<style scoped lang="scss">
.match-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 17.5px;
}
</style>

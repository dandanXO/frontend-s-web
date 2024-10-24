<template>
  <div class="game-platform btn-pointer" @click="$emit('click')">
    <div class="game-tab-bg" :class="selected === code && 'active'">
      <div class="game-tab-content">
        <div :class="`${imgMapping}-icon`" />
        <div class="label">{{ text }}</div>
      </div>
    </div>

    <!-- <img v-if="selected === code" :src="require(`../../assets/images/home/games/${imgMapping}-icon-active.png`)" />
    <img v-else :src="require(`../../assets/images/home/games/${imgMapping}-icon.png`)" />
    <span :style="$t('lang.langVal') === 'en' ? '' : { top: '32px' }" :class="selected === code && 'active'">
      {{ text }}
    </span> -->
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  code: String,
  text: String
});

defineEmits(["click"]);

const selected = defineModel();

const imgMapping = computed(() => {
  switch (props.code) {
    case "sport":
      return "sport";
    case "live":
      return "live";
    case "slot":
      return "slot";
    case "poker":
      return "poker";
    case "esport":
      return "esport";
    case "lottery":
      return "lottery";
    case "casual":
      return "minigame";
    case "fishing":
      return "others";
    default:
      return "sport";
  }
});
</script>
<style lang="scss" scoped>
.game-platform {
  position: relative;
  img {
    width: 100%;
  }
  span {
    position: absolute;
    text-align: center;
    font-size: 11px;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    color: #7a80a1;
    line-height: 1;
    font-weight: bold;

    @media (max-width: 400px) {
      font-size: 9px;
    }

    &.active {
      color: #ffffff;
    }
  }
}
</style>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  dataType: {
    type: String,
    required: true
  },
  data: {
    title: {
      type: String,
      required: true
    },
    subcount: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
});
</script>

<template>
  <router-link :to="`slot?platform=${data.code}`">
    <img
      :src="
        require(`../../assets/images/index/${dataType}/${dataType}_bg_${data.icon}.png`)
      "
    />
    <div class="game_content">
      <div class="game_title">{{ data.title }}</div>
      <div class="game_subtitle">
        <span class="game_num">{{ data.subcount }}</span>
        {{ data.subtitle }}
      </div>
    </div>
  </router-link>
</template>

<style lang="scss">
.game_content {
  position: absolute;
  text-align: center;
  top: 45%;
  left: 55%;
  transform: translate(-50%, -50%);
  .game_title {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 500;
  }
  .game_subtitle {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #000;
  }
  .game_num {
    font-size: 1rem;
  }
}
</style>

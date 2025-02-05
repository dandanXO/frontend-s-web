<template>
  <div class="spin-lucky-wheel-promo-wrapper">
    <EnvelopeStage v-if="stage === 'envelope'" />
    <WheelStage v-else />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";
import { api } from "boot/axios";
import EnvelopeStage from "./EnvelopeStage.vue";
import { useUI } from "src/stores/ui";
import WheelStage from "./WheelStage.vue";

const router = useRouter();

const store = userStore();
const ui = useUI();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

const stage = ref("wheel");

onMounted(() => {
  // loaData();
  if (stage.value === "envelope") {
    ui.promoBg = "spin-lucky-wheel-envelope";
  }
});
</script>
<style lang="scss"></style>

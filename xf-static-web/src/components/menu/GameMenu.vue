<template>
  <PlatformMenu
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="slot"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";

const emits = defineEmits(["load-modal"]);
const platformType = ref("slot");
const platformGameType = ref("SLOT");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

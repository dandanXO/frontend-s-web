<template>
  <PlatformMenu
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="fish"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";

const emits = defineEmits(["load-modal"]);
const platformType = ref("fish");
const platformGameType = ref("FISH");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

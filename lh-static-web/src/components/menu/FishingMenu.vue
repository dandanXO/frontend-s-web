<template>
  <PlatformMenu
    :platforms="fishingPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="fishing"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/platformmenu/index.vue";
import { fishingPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("fishing");
const platformGameType = ref("FISH");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

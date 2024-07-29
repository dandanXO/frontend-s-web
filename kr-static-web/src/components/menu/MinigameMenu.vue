<template>
  <PlatformMenu
    :platforms="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="casual"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { cockfightPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("casual");
const platformGameType = ref("CASUAL");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

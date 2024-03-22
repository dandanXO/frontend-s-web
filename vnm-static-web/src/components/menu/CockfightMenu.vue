<template>
  <PlatformMenu
    :platforms="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="cockfight"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { cockfightPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("cockfight");
const platformGameType = ref("COCKFIGHT");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

<template>
  <PlatformMenu
    :platforms="liveCasinoPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="live-casino"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { liveCasinoPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("live");
const platformGameType = ref("LIVE");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

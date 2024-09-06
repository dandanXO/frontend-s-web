<template>
  <PlatformMenu
    :platforms="slotPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="slot"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { slotPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("slot");
const platformGameType = ref("SLOT");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

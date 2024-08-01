<template>
  <PlatformMenu
    :platforms="pokerPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="poker"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { pokerPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("poker");
const platformGameType = ref("POKER");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

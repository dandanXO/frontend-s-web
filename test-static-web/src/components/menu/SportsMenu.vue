<template>
  <PlatformMenu
    :platforms="sportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="sports"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { sportsPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("sports");
const platformGameType = ref("SPORT");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

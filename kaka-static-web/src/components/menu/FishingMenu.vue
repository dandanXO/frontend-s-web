<template>
  <PlatformMenuFishing
    :platforms="fishingPlatforms"
    :platform2="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="fishing"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenuFishing from "@/components/menu/PlatformMenuFishing.vue";
import { fishingPlatforms, cockfightPlatforms} from "@/shared/platformArray";


const emits = defineEmits(["load-modal"]);
const platformType = ref("fishing");
const platformGameType = ref("FISH");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

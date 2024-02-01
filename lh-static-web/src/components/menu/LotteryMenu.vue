<template>
  <PlatformMenu
    :platforms="lotteryPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="lottery"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { lotteryPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("lottery");
const platformGameType = ref("LOTTERY");
const openGame = (item) => {
  emits("load-modal", item.gameName, item.code);
};
</script>

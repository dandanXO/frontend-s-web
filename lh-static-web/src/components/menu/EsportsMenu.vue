<template>
  <PlatformMenu
    :platforms="eSportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="esports"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { eSportsPlatforms } from "@/shared/platformArray";

const emits = defineEmits(["load-modal"]);
const platformType = ref("esports");
const platformGameType = ref("ESPORT");
const openGame = (item) => {



  emits("load-modal", item.gameName, item.code);
};
</script>

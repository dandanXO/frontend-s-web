<template>
  <PlatformMenu
    :platforms="slotPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
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
const openGame = (item) => {
  emits("load-modal", item.gameName, item.code);
};
</script>

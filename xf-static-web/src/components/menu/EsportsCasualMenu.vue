<template>
  <PlatformMenu
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="casual"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";

const router = useRouter();
const emits = defineEmits(["load-modal"]);
const platformType = ref("casual");
const platformGameType = ref("CASUAL");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

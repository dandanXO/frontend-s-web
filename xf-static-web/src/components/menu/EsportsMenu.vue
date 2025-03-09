<template>
  <PlatformMenu
    :platformGameType="platformGameType"
    :platformType="platformType"
    platformName="esport"
    @load-game="openGame"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";

const router = useRouter();
const emits = defineEmits(["load-modal"]);
const platformType = ref("esport");
const platformGameType = ref("ESPORT");
const openGame = (gameName, code, gameCode) => {
  emits("load-modal", gameName, code, gameCode);
};
</script>

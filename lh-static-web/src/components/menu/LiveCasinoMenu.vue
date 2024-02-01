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
const openGame = (item) => {
  console.log(item);
  var gameCode= '';
  if(item.code=='BBINDY'){
    gameCode = 'bblive_lobby_pc'
  }

  emits("load-modal", item.name, item.code, gameCode);
};
</script>

<template>
  <LangToggle />

  <q-page-sticky position="bottom-right" :offset="[40, 130]" style="z-index:999999" class="telegram-sticky floating">
    <a href="https://t.me/city88888" target="_blank">
      <img src="../assets/images/index/telegram-icon.png" class="telegram-sticky-img"></a>
  </q-page-sticky>
  <RollingText />

  <JackpotPrize />

  <GamesList />

  <AnnouncementList />

  <DepositRecords />

  <LoggedInPopupBanner />
</template>

<script setup>
import LangToggle from "src/components/LangToggle.vue";
import RollingText from "src/components/home/RollingText.vue";
import JackpotPrize from "src/components/home/JackpotPrize.vue";
import GamesList from "src/components/home/GamesList.vue";
import AnnouncementList from "src/components/home/AnnouncementList.vue";
import DepositRecords from "src/components/home/DepositRecords.vue";
import LoggedInPopupBanner from "src/components/home/LoggedInPopupBanner.vue";
</script>

<style scoped lang="scss"></style>

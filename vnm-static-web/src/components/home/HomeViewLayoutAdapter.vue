<template>
  <select v-if="store.token && store.memberType === 'TEST'" v-model="ui.edition">
    <option value="NORMAL">normal</option>
    <option value="SLOT">slot</option>
  </select>
  <component :is="currentLayout" />
</template>

<script setup>
import { computed, onMounted,watch } from "vue";
import NormalHomeViewLayout from "@/components/home/normalEdition/NormalHomeViewLayout.vue";
import SlotHomeViewLayout from "@/components/home/slotEdition/SlotHomeViewLayout.vue";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";
import { userStore } from "@/store";
import { useRoute } from "vue-router";

const ui = uiStore();
const store = userStore();
const route = useRoute();

const currentLayout = computed(() => {
  switch (ui.edition) {
    case EDITION.NORMAL:
      return NormalHomeViewLayout;
    case EDITION.SLOT:
      return SlotHomeViewLayout;
    default:
      return NormalHomeViewLayout;
  }
});

const checkEdition = () => {
  if (route.name === "homeslot") {
    sessionStorage.setItem("HOME_EDITION", EDITION.SLOT);
    ui.edition = EDITION.SLOT;
  } else if (route.name === "home") {
    sessionStorage.removeItem("HOME_EDITION");
    ui.edition = EDITION.NORMAL;
  }
};

onMounted(() => {
  checkEdition();
});

watch(() => route.name, checkEdition);
</script>

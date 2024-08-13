<template>
  <select v-if="store.token && store.memberType === 'TEST'" v-model="ui.edition">
    <option value="NORMAL">normal</option>
    <option value="SLOT">slot</option>
  </select>
  <component :is="currentLayout" />
</template>

<script setup>
import { computed, ref } from "vue";
import NormalHomeViewLayout from "@/components/home/normalEdition/NormalHomeViewLayout.vue";
import SlotHomeViewLayout from "@/components/home/slotEdition/SlotHomeViewLayout.vue";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";
import { userStore } from "@/store";

const ui = uiStore();
const store = userStore();

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
</script>

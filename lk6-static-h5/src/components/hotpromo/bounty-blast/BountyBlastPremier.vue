<template>
  <q-tabs
    v-model="activeTab"
    class="custom-tabs"
    align="center"
    active-color="black"
    inactive-color="#95979A"
    indicator-color="transparent"
  >
    <q-tab name="bountysign" label="签到好礼" class="custom-tab" @click="handleTabClick('bountysign')" />
    <q-tab name="bountychest" label="箱开福来" class="custom-tab" @click="handleTabClick('bountychest')" />
  </q-tabs>

  <div v-if="activeTab === 'bountysign'">
    <BountySignIn :promo-code="promoCode" />
  </div>
  <div v-if="activeTab === 'bountychest'">
    <BountyChest :promo-code="promoCode" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BountyChest from "./BountyChest.vue";
import BountySignIn from "./BountySignIn.vue";

const props = defineProps(["promoCode"]);
const promoCode = props.promoCode;
const activeTab = ref("bountysign");

const handleTabClick = (tabName) => {
  console.log("Tab clicked:", tabName);
};
</script>

<style lang="scss" scoped>
.custom-tabs {
  justify-content: center;
  margin: 5px auto 10px;
  background-color: transparent;
}
:deep(.q-tabs__content) {
  gap: 15px;
}
:deep(.q-tab) {
  font-size: 20px;
}
.custom-tab {
  background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
  // padding: 30px 50px;
  border-radius: 30px;
  font-family: HYYakuHei800;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  &.q-tab .q-tab__label {
    font-size: 20px;
  }
  &.q-tab--active {
    background: linear-gradient(90deg, #fffd66 0%, #ff9400 100%);
    color: #000000;
  }
}
</style>

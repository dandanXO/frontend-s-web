<template>
  <div class="redeem-point-wrapper" @click="handleClick">
    <img src="../../assets/images/redeem/money.svg" />
    {{ balance }}
    <RedeemPointDialog v-model="isDialogVisible" />
  </div>
</template>
<script setup>
import { eventapi } from "src/boot/axios";
import { onMounted, ref } from "vue";
import RedeemPointDialog from "./RedeemPointDialog.vue";

const balance = ref(0);
const isDialogVisible = ref(false);

const handleClick = () => {
  isDialogVisible.value = true;
};

const getRedeem = () => {
  eventapi
    .get("/member-point", {
      params: {
        Platform: "MAIN"
      }
    })
    .then((res) => {
      if (res.code === 0) {
        balance.value = Math.floor(res.data);
      }
    })
    .catch((e) => console.log(e));
};

onMounted(() => {
  getRedeem();
});
</script>
<style scoped lang="scss">
.redeem-point-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  img {
    max-width: 16px;
    margin-bottom: 3px;
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(2%) hue-rotate(58deg) brightness(113%)
      contrast(101%);
  }
}
</style>

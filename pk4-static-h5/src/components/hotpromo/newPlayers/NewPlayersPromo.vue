<template>
  <div class="newplayers-collect">
    <q-btn rounded flat no-caps @click="collectclaim(list.promoCode)">
      <img src="../../../assets/images/promotion/hotpromo/new-players/btn-collect.png" alt="" />
    </q-btn>
  </div>

  <q-dialog v-model="showPrizePopup">
    <div class="prize-popup">
      <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" />
      <div class="prize-gold">
        <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-gold.png" width="80" />
        <div>{{ $t("hotPromo.aviatorWheel.congratulations") }}</div>
      </div>

      <div class="prize-amount">Rs {{ prizePopupBonusAmt }}</div>

      <q-btn no-caps unelevated class="btn-primary" @click="showPrizePopup = false">{{ $t("btn.confirm") }}</q-btn>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps(["list"]);
const showPrizePopup = ref(false);
const prizePopupBonusAmt = ref();

const collectclaim = (promoCode) => {
  eventapi
    .put(`/bonus/claim/${promoCode}`)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Collect successfully",
          icon: "check_circle_outline"
        });

        showPrizePopup.value = true;
        prizePopupBonusAmt.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
</script>

<style lang="scss" scoped>
.newplayers-collect {
  display: flex;
  justify-content: center;
}

.prize-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden !important;
}

.prize-gold {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #c7c7c7;
}

.prize-amount {
  font-size: 38px;
  color: #ffffff;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>

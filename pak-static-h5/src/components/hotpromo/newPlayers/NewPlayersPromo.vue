<template>
  <div class="newplayers-collect">
    <q-btn rounded flat no-caps @click="collectclaim(list.promoCode)">
      <img src="../../../assets/images/promotion/hotpromo/new-players/btn-collect.png" alt="" />
    </q-btn>
  </div>

  <!-- <pre>{{ list }}</pre> -->
</template>

<script setup>
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps(["list"]);

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
</style>

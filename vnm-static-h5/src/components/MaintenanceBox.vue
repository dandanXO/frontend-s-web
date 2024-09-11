<template>
  <div class="maintenance-box" v-if="item.underMaintenance === true">
    <p class="maintenance-title">
      <img src="../assets/images/home/maintenance-icon.svg" />
      {{ $t("lang.currently_maintaining") }}
    </p>
    <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
      {{ $t("lang.maintenance_time") }}: {{ toGMT7(item.maintenanceStartTime, "DD/MM/YYYY HH:mm") }} -
      {{ toGMT7(item.maintenanceEndTime, "DD/MM/YYYY HH:mm") }}
    </p>
  </div>
</template>
<script setup>
import { toGMT7 } from "src/boot/utils";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});
</script>
<style scoped lang="scss">
.maintenance-box {
  position: absolute;
  top: 3%;
  bottom: 3%;
  padding-top: 0px;
  padding-bottom: 0px;
  color: #ffffff;
  font-size: 1.2em;
  font-weight: bold;
  width: 90%;
  left: 5%;
  right: 5%;
  height: 94%;
  z-index: 33;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;

  p {
    font-size: 1.1em;
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
  }

  .maintenance-title {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 1.2rem;

    img {
      width: 2.8rem;
    }
  }

  .small-size {
    font-size: 0.85em;
    text-align: center;
  }
}
</style>

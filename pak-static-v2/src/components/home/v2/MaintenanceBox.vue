<template>
  <div class="maintenance-box" v-if="item.underMaintenance === true">
    <p class="maintenance-title">
      <img src="../../../assets/images/home/v2/game/maintenance-icon.svg" />
      {{ $t("maintenance.underMaintenance") }}
    </p>
    <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
      {{ $t("maintenance.from") }} {{ moment(item.maintenanceStartTime).format("YYYY-MM-DD HH:mm") }}
      {{ $t("maintenance.to") }}
      {{ moment(item.maintenanceEndTime).format("YYYY-MM-DD HH:mm") }}
    </p>
  </div>
</template>
<script setup>
import moment from "moment";

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
  padding-top: 0px;
  padding-bottom: 0px;
  color: #cae4ff;
  font-size: 1.2em;
  font-weight: bold;
  width: 100%;
  height: 100%;
  z-index: 33;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  background: #00000069;
  border-radius: 12px;

  p {
    font-size: 1.1em;
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
  }

  .maintenance-title {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;

    img {
      width: 12vw;
      max-width: 66px;
    }
  }

  .small-size {
    font-size: 0.85em;
    text-align: center;
  }
}
</style>

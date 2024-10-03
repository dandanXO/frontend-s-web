<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img src="../assets/images/maintenance/maintenance-img.png" />
    </div>
    <div class="maintenance-title">{{ $t("maintenance.underMaintenance") }}</div>
    <div class="maintenance-content">
      {{ $t("maintenance.content01") }}
      <br />
      <template v-if="ui.maintenanceStartTime">
        {{ $t("maintenance.from") }}: {{ ui.maintenanceStartTime }}
        <br />
      </template>
      <template v-if="ui.maintenanceEndTime">
        {{ $t("maintenance.to") }}: {{ ui.maintenanceEndTime }}
        <br />
      </template>
      {{ $t("maintenance.content02") }}
      <br />
      {{ $t("maintenance.content03") }}
    </div>
  </div>
</template>

<script setup>
import { useUI } from "src/stores/ui";
const ui = useUI();
</script>

<style lang="scss" scoped>
.maintenance-container {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .maintenance-img {
    padding-bottom: 12px;
    img {
      display: block;
      width: 100%;
      max-width: 200px;
    }
  }

  .maintenance-title {
    color: #fff;
    display: flex;
  }

  .maintenance-content {
    display: flex;
    justify-content: center;
    max-width: 400px;
    padding: 16px;
    color: #5f6061;
  }
}
</style>

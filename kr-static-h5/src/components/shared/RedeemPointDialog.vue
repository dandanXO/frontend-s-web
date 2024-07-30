<template>
  <q-dialog v-model="redeemDialogVisible" no-route-dismiss persistent>
    <div class="redeem-point-dialog-container" style="width: 700px; max-width: 700px">
      <div class="header">
        <div style="text-align: right">
          <img
            class="header-close-btn"
            @click="handleClose"
            src="../../assets/images/promo/hotpromo/eurocup-luckydraw/close.png"
          />
        </div>
      </div>
      <q-card class="redeem-point-dialog-content-wrapper">
        <div class="title">{{ $t("lang.redeem_point_pending_list") }}</div>
        <DataTable :loading="isLoading" :tableColumns="tableColumns" :dataState="tableData">
          <template #body-cell-recordTime="props">
            <q-td class="text-center">x{{ props?.props?.row.recordTime }}</q-td>
          </template>
          <template #body-cell-rollover="props">
            <q-td class="text-center">x{{ props?.props?.row.rollover }}</q-td>
          </template>
          <template #body-cell-operation="props">
            <q-td>
              <div style="display: flex; justify-content: flex-end">
                <q-btn
                  style="min-width: 60px; width: 60px; height: 30px"
                  class="primary-button blue-square"
                  @click="redeemPoint(props?.props?.row.privilegeId)"
                >
                  {{ $t("lang.btn_redeem") }}
                </q-btn>
              </div>
            </q-td>
          </template>
          <template #item="{ props }">
            <q-card>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>{{ col.label }}</q-item-section>
                  <q-item-section side>
                    <q-btn
                      v-if="col.name === 'operation'"
                      style="min-width: 60px; width: 60px; height: 30px"
                      class="primary-button blue-square q-my-sm"
                      @click="redeemPoint(props?.props?.row.privilegeId)"
                    >
                      {{ $t("lang.btn_redeem") }}
                    </q-btn>
                    <q-item-label v-else>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </template>
        </DataTable>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { watch, ref } from "vue";
import DataTable from "components/transaction/DataTable";
import { eventapi } from "src/boot/axios";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";

const isLoading = ref(false);
const { t } = useI18n();
const redeemDialogVisible = defineModel();
const store = userStore();
const $q = useQuasar();

const redeemPoint = (privilegeId) => {
  eventapi.post("/member-point/redeem-point/" + privilegeId + "?_method=PUT").then((res) => {
    const { code, data } = res.data;

    if (code === 0) {
      $q.notify({
        message: t("lang.redeem_point_redeemed"),
        type: "positive",
        position: "top",
        icon: "check_circle_outline"
      });

      store.getPendingRebateAmt();
      store.getBalance();
    }
  });
};

const handleClose = () => {
  redeemDialogVisible.value = false;
};

const tableColumns = [
  {
    label: t("lang.redeem_point_points"),
    field: "amount",
    name: "amount",
    align: "center"
  },
  {
    label: t("lang.redeem_point_date"),
    field: "recordTime",
    name: "recordTime",
    align: "center"
  },
  {
    label: t("lang.redeem_point_source"),
    field: "privilege",
    name: "privilege",
    align: "center"
  },
  {
    label: t("lang.redeem_point_condition"),
    field: "rollover",
    name: "rollover",
    align: "center"
  },
  {
    label: t("lang.redeem_point_actions"),
    field: "operation",
    name: "operation",
    align: "center"
  }
];
const tableData = ref([]);

const getTableData = () => {
  isLoading.value = true;
  eventapi
    .get("/member-point/pending-list")
    .then((res) => {
      isLoading.value = false;

      if (res.code === 0) {
        tableData.value = res.data;
      }
    })
    .catch(() => {
      isLoading.value = false;
    });
};

watch(redeemDialogVisible, () => {
  if (redeemDialogVisible.value) {
    getTableData();
  }
});
</script>

<style lang="scss" scoped>
.redeem-point-dialog-container {
  display: flex;
  flex-direction: column;

  .title {
    font-size: large;
    padding: 5px 0;
  }

  .header-close-btn {
    width: 32px;
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(2%) hue-rotate(339deg) brightness(109%)
      contrast(101%);

    &:hover {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(2%) hue-rotate(339deg) brightness(109%)
        contrast(101%);
    }
  }
}

.redeem-point-dialog-content-wrapper {
  padding: 20px;
  box-shadow: none;
}
</style>

<template>
  <q-table
    dense
    class="datatable"
    :grid="$q.screen.lt.md"
    :loading="loading"
    :columns="tableColumns"
    :rows="dataState"
    :no-data-label="$t('lang.no_data_label')"
    :rows-per-page-label="$t('lang.row_per_page_label')"
    :row-key="rowKey || 'serialNumber'"
    :rows-per-page-options="[rowsPerPage || 10]"
    :hide-pagination="true"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template v-slot:item="props" v-if="slots.item">
      <slot name="item" :props="props"></slot>
    </template>
    <template v-slot:body-cell-recordTime="props">
      <q-td :props="props">
        {{ getLocaleDateTime(props.value, true) }}
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        {{ getAllStatus(props.value) }}
      </q-td>
    </template>

    <template v-if="slots?.['body-cell-operation']" v-slot:body-cell-operation="props">
      <slot name="body-cell-operation" :props="props"></slot>
    </template>

    <template v-if="slots?.['body-cell-rollover']" v-slot:body-cell-rollover="props">
      <slot name="body-cell-rollover" :props="props"></slot>
    </template>

    <template v-if="slots?.['body-cell-type']" v-slot:body-cell-type="props">
      <slot name="body-cell-type" :props="props"></slot>
    </template>
  </q-table>

  <div class="datatable-pagination" v-if="props.pagination && props.pagination.pages > 0">
    <span>{{ `페이지 ${props.pagination.current} / ${props.pagination.pages}` }}</span>
    <q-pagination
      :modelValue="props.pagination.current"
      :max="props.pagination.pages"
      :max-pages="10"
      @update:model-value="
        (currentPage) => {
          emit('onChangePage', currentPage);
        }
      "
      boundary-links
    />
  </div>
</template>

<script setup>
import { useSlots } from "vue";
import { useI18n } from "vue-i18n";
import { getLocaleDateTime } from "../../boot/utils";

const { t } = useI18n();

const slots = useSlots();

const props = defineProps(["tableColumns", "dataState", "pagination", "loading", "rowsPerPage", "rowKey"]);

const emit = defineEmits(["onChangePage"]);

const getAllStatus = (allStatus) => {
  if (allStatus === "PENDING") {
    return t("status.pending"); // Pending
  } else if (allStatus === "SUCCESS") {
    return t("status.success"); // Success
  } else if (allStatus === "SUPPLEMENT_SUCCESS") {
    return t("status.supplement_success"); // Supplement Success
  } else if (allStatus === "CLOSED") {
    return t("status.close_btn"); // Closed
  } else if (allStatus === "APPLY") {
    return t("status.applying"); //Applying
  } else if (allStatus === "FAIL") {
    return t("status.fail"); // Failed
  } else if (allStatus === "STEP_1") {
    return t("status.under_review"); //Under review
  } else if (allStatus === "STEP_2") {
    return t("status.to_be_paid"); // To be paid
  } else if (allStatus === "STEP_3") {
    return t("status.payment_on_going"); // Payment on going
  } else if (allStatus === "STEP_4") {
    return t("status.automatic_payment"); // Automatic Payment
  } else if (allStatus === "STEP_5") {
    return t("status.suspend"); //Suspend
  } else {
    return allStatus;
  }
};
</script>

<style lang="scss" scoped>
.datatable {
  box-shadow: none;
  border: 1px solid grey;
}

.datatable-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
}
</style>

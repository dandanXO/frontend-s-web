<template>
  <div class="roles-main">
    <div style="width: 500px">
      <el-form
        ref="summaryForm"
        :model="form"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="hasRole(['ADMIN'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.date')" prop="date" v-if="hasRole(['ADMIN'])">
          <el-date-picker
            v-model="form.date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 300px;margin-left: 5px"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button
            v-if="hasRole(['ADMIN'])"
            type="success"
            @click="summary"
            style="margin-left: 10px"
            :disabled="form.date.length === 0"
          >
            {{ t('fields.generateSummary') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { generateAffiliateSummary } from "../../../api/summary";
import { hasRole } from "../../../utils/util";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getSiteListSimple } from "../../../api/site";

const { t } = useI18n();
const summaryForm = ref(null);
const form = reactive({
  date: [],
  siteId: null
});
const siteList = reactive({
  list: []
});
function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function summary() {
  summaryForm.value.validate(async (valid) => {
    if (valid) {
      const formCopy = { ...form };
      formCopy.date = form.date.join(",");
      formCopy.isAff = true;
      await generateAffiliateSummary(formCopy);
      ElMessage({ message: t('message.summarySuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async() => {
  await loadSites();
  form.siteId = siteList.list[0].id;
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-start;
  margin-left: 140px;
}
.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>

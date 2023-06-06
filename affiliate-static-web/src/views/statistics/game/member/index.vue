<template>
  <div class="roles-main">
    <el-table :data="page.records" ref="table"
              row-key="id"
              size="small"
              highlight-current-row
              v-loading="page.loading"
              :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120" />
      <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="140">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="depositCount" :label="t('fields.depositCount')" align="center" min-width="140">
        <template #default="scope">
          <span v-if="scope.row.depositCount === null">0</span>
          <span v-if="scope.row.depositCount !== null">{{ scope.row.depositCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="withdrawAmount" :label="t('fields.withdrawAmount')" align="center" min-width="140">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.withdrawAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="withdrawCount" :label="t('fields.withdrawCount')" align="center" min-width="140">
        <template #default="scope">
          <span v-if="scope.row.withdrawCount === null">0</span>
          <span v-if="scope.row.withdrawCount !== null">{{ scope.row.withdrawCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="adjustment" :label="t('fields.adjustment')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.adjustment,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bet" :label="t('fields.bet')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bet,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.payout,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="transferIn" :label="t('fields.transferIn')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.transferIn,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="transferOut" :label="t('fields.transferOut')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.transferOut,type: 'money'}" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, defineExpose, defineProps } from 'vue';
import { getMemberGameStats } from '../../../../api/statistics';
import { useI18n } from "vue-i18n";

defineExpose({
  loadMemberSummary
});

const { t } = useI18n();

const props = defineProps({
  affId: {
    type: String,
    required: true
  },
  date: {
    type: Array,
    required: false,
    default: null
  }
});

const request = reactive({
  recordTime: [],
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

async function loadMemberSummary() {
  page.loading = true;
  request.recordTime = props.date;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  const { data: ret } = await getMemberGameStats(props.affId, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadMemberSummary();
  }
}

onMounted(() => {
  loadMemberSummary();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>

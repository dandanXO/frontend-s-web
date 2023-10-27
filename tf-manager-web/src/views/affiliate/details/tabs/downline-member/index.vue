<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.downlineMember') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="180" />
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="180">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'NORMAL'" type="success" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === 'FROZEN'" type="danger" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === null" type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" align="center" min-width="180" />
        <el-table-column prop="balance" :label="t('fields.balance')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.balance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="regTime" :label="t('fields.registerTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{data: scope.row.regTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalDeposit" :label="t('fields.totalDeposit')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWithdraw" :label="t('fields.totalWithdraw')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalWithdraw,type: 'money'}" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        class="pagination"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadAffiliateMembers"
        @size-change="loadAffiliateMembers"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import { getAffiliateDownline } from '../../../../../api/member-affiliate';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

// eslint-disable-next-line
const { t } = useI18n();
const props = defineProps({
  affId: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true
  }
})

const request = reactive({
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const route = useRoute()
const site = reactive({
  id: route.query.site
});

async function loadAffiliateMembers() {
  // page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  query.memberTypes = "NORMAL,TEST";
  query.siteId = site.id;
  const { data: ret } = await getAffiliateDownline(props.affId, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

onMounted(() => {
  loadAffiliateMembers();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>

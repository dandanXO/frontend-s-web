<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.downlineAffiliate') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :load="getChildren"
                lazy
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="150" />
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateLevel" :label="t('fields.affiliateLevel')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateLevel === null">-</span>
            <span v-if="scope.row.affiliateLevel !== null">{{ scope.row.affiliateLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commission" :label="t('fields.commission')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.commission === null">0 %</span>
            <span v-if="scope.row.commission !== null">{{ scope.row.commission * 100 }} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="commission" :label="t('fields.revenueShare')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.revenueShare === null">0 %</span>
            <span v-if="scope.row.revenueShare !== null">{{ scope.row.revenueShare * 100 }} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="downlineMember" :label="t('fields.totalDownlineMembers')" align="center" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.downlineMember === null">-</span>
            <span v-if="scope.row.downlineMember !== null">{{ scope.row.downlineMember }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downlineAffiliate" :label="t('fields.totalDownlineAffiliates')" align="center" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.downlineAffiliate === null">-</span>
            <span v-if="scope.row.downlineAffiliate !== null">{{ scope.row.downlineAffiliate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'NORMAL'" type="success" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === 'FROZEN'" type="danger" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === null" type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" align="center" min-width="120" />
        <el-table-column prop="balance" :label="t('fields.balance')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.balance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="regTime" :label="t('fields.registerTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{data: scope.row.regTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalDeposit" :label="t('fields.totalDeposit')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWithdraw" :label="t('fields.totalWithdraw')" align="center" min-width="120">
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
        @current-change="loadDownlineAffiliates"
        @size-change="loadDownlineAffiliates"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import { getAffiliateDownline, getAffiliateChild } from '../../../../../api/member-affiliate';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

// eslint-disable-next-line
const { t } = useI18n();
const props = defineProps({
  affId: {
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

async function loadDownlineAffiliates() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  query.memberTypes = "AFFILIATE";
  query.siteId = site.id;
  const { data: ret } = await getAffiliateDownline(props.affId, query);
  page.pages = ret.pages;
  page.total = ret.total;
  page.records = ret.records;
  for (const record of page.records) {
    if (record.downlineAffiliate > 0) {
      record.hasChildren = true;
    }
  }
  page.loading = false;
}

async function getChildren(record, treeNode, resolve) {
  const { data: ret } = await getAffiliateChild(record.id, site.id);
  record.children = ret;
  for (const child of record.children) {
    if (child.downlineAffiliate > 0) {
      child.hasChildren = true;
    }
  }
  resolve(ret);
}

onMounted(() => {
  loadDownlineAffiliates();
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

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>

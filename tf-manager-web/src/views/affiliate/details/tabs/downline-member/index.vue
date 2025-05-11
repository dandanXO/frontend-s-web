<template>
  <div class="roles-main">
    <div class="inputs-wrap">
      <el-select
        v-model="request.orderBy"
        size="small"
        :placeholder="t('fields.orderBy')"
        class="filter-item"
        style="width: 120px;margin-left: 5px"
      >
        <el-option
          v-for="item in uiControl.orderBy"
          :key="item.key"
          :label="t('fields.' + item.displayName)"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="request.sortType"
        size="small"
        :placeholder="t('fields.sortType')"
        class="filter-item"
        style="width: 120px;margin-left: 5px"
      >
        <el-option
          v-for="item in uiControl.sortType"
          :key="item.key"
          :label="t('sortType.' + item.displayName)"
          :value="item.value"
        />
      </el-select>
      <el-button icon="el-icon-search" type="primary" style="margin-left: 5px" @click="loadAffiliateMembers" size="small">
        {{ t('fields.search') }}
      </el-button>
    </div>
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
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`/member/details/${scope.row.id}?site=${site.id}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
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
import { hasPermission } from '../../../../../utils/util'

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

const uiControl = reactive({
  orderBy: [
    { key: 0, displayName: 'totalDeposit', value: 'total_deposit' },
    { key: 1, displayName: 'totalWithdraw', value: 'total_withdraw' }
  ],
  sortType: [
    { key: 0, displayName: 'DESC', value: 'DESC' },
    { key: 1, displayName: 'ASC', value: 'ASC' }
  ]
})

const request = reactive({
  size: 20,
  current: 1,
  orderBy: uiControl.orderBy[0].value,
  sortType: uiControl.sortType[0].value
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
  // loadAffiliateMembers();
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

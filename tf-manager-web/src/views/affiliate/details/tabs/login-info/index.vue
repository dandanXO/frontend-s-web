<template>
  <div class="inputs-wrap">
    <el-date-picker
      v-model="loginTime"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD"
      size="small"
      type="daterange"
      range-separator=":"
      :start-placeholder="t('fields.startDate')"
      :end-placeholder="t('fields.endDate')"
      style="margin-right: 10px;width: 300px"
      :shortcuts="shortcuts"
      :disabled-date="disabledDate"
      :editable="false"
      :clearable="false"
    />
    <el-button icon="el-icon-search" type="primary" @click="loadData" size="small">
      {{ t('fields.search') }}
    </el-button>
  </div>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <el-table
      height="600"
      size="small"
      :resizable="true"
      :data="records"
      v-loading="loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column :label="t('fields.loginTime')"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-formatter="{data: scope.row.loginTime,formatter: 'YYYY/MM/DD HH:mm:ss',type: 'date'}" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.loginIp')" prop="loginIp"
                       align="center" min-width="150"
      />
      <el-table-column :label="t('fields.loginAddress')" prop="loginAddress"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.loginAddress !== '-,-,-' && scope.row.loginAddress !== 'null,null,null' && scope.row.loginAddress !== null">{{ scope.row.loginAddress }}</span>
          <span v-if="scope.row.loginAddress === '-,-,-' || scope.row.loginAddress === 'null,null,null' || scope.row.loginAddress === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.loginStatus')" prop="loginStatus"
                       align="center" min-width="120"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.loginStatus === 0" type="danger">FAIL</el-tag>
          <el-tag v-if="scope.row.loginStatus === 1" type="success">SUCCESS</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.loginFailedReason')" prop="remark"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
          <span v-if="scope.row.remark === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.loginWay')" prop="device"
                       align="center" min-width="120"
      />
      <el-table-column :label="t('fields.loginUrl')" prop="loginUrl"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.loginUrl !== null">{{ scope.row.loginUrl }}</span>
          <span v-if="scope.row.loginUrl === null">-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="size"
      v-model:page-count="pages"
      v-model:current-page="current"
      @current-change="loadData"
      @size-change="loadData"
    />
  </el-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import moment from 'moment';
import { getMemberLoginRecord } from "../../../../../api/member";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    affId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const shortcuts = [
      {
        text: t('fields.today'),
        value: () => {
          const end = new Date();
          const start = new Date();
          return [start, end];
        }
      },
      {
        text: t('fields.yesterday'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'days').format('x'));
          end.setTime(moment(end).subtract(1, 'days').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.thisWeek'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).startOf('week').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.lastWeek'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'weeks').startOf('week').format('x'));
          end.setTime(moment(end).subtract(1, 'weeks').endOf('week').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.thisMonth'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).startOf('month').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.lastMonth'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
          end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.last3Months'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(2, 'months').startOf('month').format('x'));
          return [start, end];
        }
      }
    ];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const defaultStartDate = convertDate(startDate);
    const defaultEndDate = convertDate(new Date());
    function convertDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }
    function disabledDate(time) {
      return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
    }
    const memberData = reactive({
      pages: 0,
      total: 0,
      records: [],
      loading: false
    });
    const formData = reactive({
      loginTime: [defaultStartDate, defaultEndDate],
      size: 20,
      current: 1
    });
    const loadData = async () => {
      memberData.loading = true;
      const formDataCopy = { ...formData };
      const query = {};
      Object.entries(formDataCopy).forEach(([key, value]) => {
        if (value) {
          query[key] = value;
        }
      });
      if (formData.loginTime && formData.loginTime.length === 2) {
        query.loginTime = formData.loginTime.join(",");
      }
      query.memberId = props.affId;
      await getMemberLoginRecord(query).then(res => {
        memberData.records = res?.data?.records;
        memberData.pages = res?.data?.pages;
        memberData.total = res?.data?.total;
      });
      memberData.loading = false;
    };
    onMounted(async () => {
      loadData();
    });
    return {
      loadData,
      shortcuts,
      startDate,
      defaultStartDate,
      defaultEndDate,
      disabledDate,
      convertDate,
      t,
      ...toRefs(formData),
      ...toRefs(memberData)
    };
  }
});
</script>

<style scoped>
.inputs-wrap {
  margin: 20px 0;
  display: flex;
}
</style>

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
      @change="checkDateValue"
      :editable="false"
      :clearable="false"
    />
    <el-button
      icon="el-icon-search"
      type="primary"
      @click="loadData(true)"
      size="small"
    >
      {{ t('fields.search') }}
    </el-button>
    <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
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
      <el-table-column
        :label="t('fields.loginTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span
            v-formatter="{
              data: scope.row.loginTime,
              type: 'date',
              timeZone: timeZone
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.loginIp')"
        align="center"
        min-width="150"
      >
        <template #default="scope">
          <span
            :style="[
              scope.row.loginIpColor !== null
                ? {color: scope.row.loginIpColor}
                : {},
            ]"
          >
            {{ scope.row.loginIp }}
            <template v-if="scope.row.loginIpRemark">
              ( {{ scope.row.loginIpRemark }} )
            </template>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.loginAddress')"
        prop="loginAddress"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span
            v-if="
              scope.row.loginAddress !== '-,-,-' &&
                scope.row.loginAddress !== 'null,null,null' &&
                scope.row.loginAddress !== null
            "
          >
            {{ scope.row.loginAddress }}
          </span>
          <span
            v-if="
              scope.row.loginAddress === '-,-,-' ||
                scope.row.loginAddress === 'null,null,null' ||
                scope.row.loginAddress === null
            "
          >
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.loginStatus')"
        prop="loginStatus"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.loginStatus === 0" type="danger">{{ t('fields.fail') }}</el-tag>
          <el-tag v-if="scope.row.loginStatus === 1" type="success">
            {{ t('fields.success') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.appVersion')"
        prop="appVersion"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          <span v-if="!scope.row.appVersion">-</span>
          <span v-else>{{ scope.row.appVersion }}</span>
        </template>

      </el-table-column>
      <el-table-column
        :label="t('fields.loginFailedReason')"
        prop="remark"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
          <span v-if="scope.row.remark === null">-</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.loginWay')"
        prop="device"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.device === 'ANDROID'">{{ t("loginDevice.ANDROID") }}</span>
          <span v-else-if="scope.row.device === 'WEB'">{{ t("loginDevice.WEB") }}</span>
          <span v-else-if="scope.row.device === 'IOS'">{{ t("loginDevice.IOS") }}</span>
          <span v-else-if="scope.row.device === 'H5'">{{ t("loginDevice.H5") }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.loginUrl')"
        prop="loginUrl"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.loginUrl !== null">
            {{ scope.row.loginUrl }}
          </span>
          <span v-if="scope.row.loginUrl === null">-</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.sid')"
        prop="sid"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          <span v-if="!scope.row.sid">-</span>
          <span v-else>{{ scope.row.sid }}</span>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, next"
      style="margin-top: 10px"
      v-model:page-size="size"
      v-model:page-count="pages"
      v-model:current-page="current"
      @current-change="loadData"
      @size-change="loadData(true)"
    />
  </el-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue'
import moment from 'moment'
import { getMemberLoginRecord } from '../../../../../api/member'
import { useStore } from '../../../../../store'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage } from "element-plus";
import { isKorea } from "@/utils/site"

const store = useStore()
export default defineComponent({
  props: {
    mbrId: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
    const shortcuts = getShortcuts(t);

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 2)
    const defaultStartDate = convertDate(startDate)
    const defaultEndDate = convertDate(new Date())
    function convertDate(date) {
      return moment(date).format('YYYY-MM-DD')
    }
    const checkDateValue = (date) => {
      const [startCheck, endCheck] = date;
      const distract = moment(endCheck).diff(startCheck, 'days');
      if (distract >= 93) {
        ElMessage({
          message: t('message.startenddatemore3months'),
          type: "error"
        });
        formData.loginTime = [defaultStartDate, defaultEndDate];
      }
    }

    const memberData = reactive({
      pages: 0,
      total: 0,
      records: [],
      loading: false,
      pagingState: ''
    })
    const formData = reactive({
      loginTime: [defaultStartDate, defaultEndDate],
      size: 20,
      current: 1,
    })
    const loadData = async frombutton => {
      if (frombutton === true) {
        formData.current = 1
        memberData.pagingState = null
      }

      memberData.loading = true
      const formDataCopy = { ...formData }
      const query = {}
      Object.entries(formDataCopy).forEach(([key, value]) => {
        if (value) {
          query[key] = value
        }
      })
      if (formData.loginTime && formData.loginTime.length === 2) {
        query.loginTime = JSON.parse(JSON.stringify(formData.loginTime));
        query.loginTime[0] = formatInputTimeZone(query.loginTime[0], props.timeZone, 'start');
        query.loginTime[1] = formatInputTimeZone(query.loginTime[1], props.timeZone, 'end');
        query.loginTime = query.loginTime.join(',')
      }
      query.memberId = props.mbrId
      query.pagingState = memberData.pagingState
      await getMemberLoginRecord(query).then(res => {
        memberData.records = res?.data?.records
        memberData.pages = res?.data?.pages
        memberData.total = res?.data?.total
        memberData.pagingState = res?.data?.pagingState
      })
      memberData.records.forEach(function(record) {
        const ipLabel = store.state.app.ipLabels.find(
          r => r.ip === record.loginIp
        )
        if (ipLabel) {
          record.loginIpColor = ipLabel.color
          record.loginIpRemark = ipLabel.remark
        }
      })
      memberData.loading = false
    }

    function resetQuery() {
      formData.loginTime = [defaultStartDate, defaultEndDate];
      memberData.pagingState = null
    }

    onMounted(async () => {
      loadData()
    })
    return {
      loadData,
      shortcuts,
      startDate,
      defaultStartDate,
      defaultEndDate,
      checkDateValue,
      convertDate,
      t,
      ...toRefs(formData),
      ...toRefs(memberData),
      resetQuery,
      isKorea,
      LOGIN_USER_SITEID
    }
  },
})
</script>

<style scoped>
.inputs-wrap {
  margin: 20px 0;
  display: flex;
}
</style>

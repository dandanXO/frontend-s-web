<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-select
          v-model="searchRequest.selectedDateType"
          size="small"
          :placeholder="t('fields.dateType')"
          class="filter-item"
          style="width: 180px; margin-left: 10px"
        >
          <el-option
            v-for="item in uiControl.selectedDateType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="searchRequest.date"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.serialNumber"
          style="width: 300px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.serialNo')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.statusList"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="40"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.paymentCard"
          size="small"
          :placeholder="t('fields.paymentCard')"
          class="filter-item"
          style="width: 250px; margin-left: 10px"
          default-first-option
          @focus="loadPaymentCards"
        >
          <el-option
            v-for="item in paymentCardList.list"
            :key="item.id"
            :label="item.identifyCode"
            :value="item.identifyCode"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRecord()"
          :disabled="page.loading"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          v-permission="['sys:withdraw:list:advanced']"
          @click="showDialog('SEARCH')"
        >
          {{ t('fields.advancedSearch') }}
        </el-button>
      </div>
      <div style="margin-top:20px;">
        <span style="font-size: small;margin-top: 10px;margin-right:10px">
          {{ t('fields.historyRecord') }}
        </span>
        <el-switch
          v-model="request.doris"
        />
      </div>

      <div class="btn-group">
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:withdraw:export']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="hasPermission(['sys:withdraw:unsuccess:list'])"
          @click="unsuccessFrom30min"
        >{{ t('fields.unsuccessFrom30min') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="unsuccessIn10time"
          v-if="hasPermission(['sys:withdraw:unsuccess:list'])"
        >{{ t('fields.unsuccessIn10time') }}
        </el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="650"
        size="mini"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="center"
          min-width="100"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`/member/details/${scope.row.memberId}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          :label="t('fields.serialNo')"
          align="center"
          min-width="210"
        />
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          :label="t('fields.fee')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.fee,
                type: 'money',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawDate"
          :label="t('fields.withdrawDate')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.withdrawDate === null">-</span>
            <span
              v-if="scope.row.withdrawDate !== null"
              v-formatter="{
                data: scope.row.withdrawDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="checkDate"
          :label="t('fields.checkDate')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.checkDate === null">-</span>
            <span
              v-if="scope.row.checkDate !== null"
              v-formatter="{
                data: scope.row.checkDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentDate"
          :label="t('fields.paymentDate')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.paymentDate === null">-</span>
            <span
              v-if="scope.row.paymentDate !== null"
              v-formatter="{
                data: scope.row.paymentDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentBy"
          :label="t('fields.paymentBy')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.paymentBy === null">-</span>
            <span v-if="scope.row.paymentBy !== null">
              {{ scope.row.paymentBy }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="t('fields.status')"
          align="center"
          width="160"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'FAIL'" type="danger">
              {{ t('withdrawStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag v-else-if="scope.row.status === 'SUCCESS'" type="success">
              {{ t('withdrawStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag v-else>{{ t('withdrawStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardAccount"
          :label="t('fields.accountHolder')"
          align="center"
          min-width="120"
          v-if="!hasPermission(['sys:ind:role:cs'])"
        />
        <el-table-column
          prop="bankName"
          :label="t('fields.bankName')"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="cardNumber"
          :label="t('fields.accountNumber')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="cardAddress"
          :label="t('fields.cardAddress')"
          align="center"
          min-width="120"
          v-if="!hasPermission(['sys:ind:role:cs'])"
        />
        <el-table-column
          prop="paymentCard"
          :label="t('fields.paymentCard')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.paymentCard === null">-</span>
            <span v-if="scope.row.paymentCard !== null">
              {{ scope.row.paymentCard }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="walletType"
          :label="t('fields.walletType')"
          align="center"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="280"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showDialog('LOG', scope.row)"
            >
              {{ t('fields.viewLog') }}
            </el-button>
            <el-button
              v-if="scope.row.status !== 'FAIL' && hasPermission(['sys:withdraw:simple:fail'])"
              size="mini"
              type="danger"
              @click="toFail(scope.row)"
            >
              {{ t('fields.fail') }}
            </el-button>
            <el-button
              v-if="(scope.row.status === 'WAITING_AUTO_PAY' || scope.row.status === 'WAITING_CALLBACK') && hasPermission(['sys:withdraw:simple:fail'])"
              size="mini"
              type="success"
              @click="toSuccess(scope.row)"
            >
              {{ t('fields.success') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'FAIL' && hasPermission(['sys:withdraw:simple:fail'])"
              size="mini"
              type="success"
              @click="updateToSuccess(scope.row)"
            >
              {{ t('fields.success') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[10, 20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRecordByRequestType"
        @size-change="loadRecordByRequestType"
      />
      <div class="table-footer" v-permission="['sys:withdraw:record:sum']">
        <span>{{ t('fields.noOfWithdrawTimes') }}</span>
        <span style="margin-left: 10px">{{ page.total }}</span>
        <span style="margin-left: 30px">{{ t('fields.totalWithdrawAmount') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: page.totalAmount, type: 'money'}" />
      </div>
    </el-card>

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>

    <el-dialog
      v-if="uiControl.dialogType === 'LOG' || uiControl.dialogType === 'SEARCH'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="900px"
    >
      <el-table
        v-if="uiControl.dialogType === 'LOG'"
        height="400px"
        size="small"
        :resizable="true"
        :data="logPage.records"
        v-loading="logPage.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="operate"
          :label="t('fields.operate')"
          align="center"
          min-width="215"
        >
          <template #default="scope">
            <span v-if="scope.row.operate === 'UPGRADE_TO_CHECK'">
              UPGRADE_TO_UNDER_REVIEW
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_APPLY'">
              DOWNGRADE_TO_APPLYING
            </span>
            <span v-else-if="scope.row.operate === 'CHECK'">REVIEW</span>
            <span v-else-if="scope.row.operate === 'CHECK_FAIL'">
              REVIEW_FAIL
            </span>
            <span v-else-if="scope.row.operate === 'UPGRADE_TO_PAY'">
              UPGRADE_TO_PAYMENT_ON_GOING
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_WAIT_PAY'">
              WAIT_FPR_PAYMENT
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_PAY'">
              DOWNGRADE_TO_PAYMENT_ON_GOING
            </span>
            <span v-else-if="scope.row.operate === 'AUTOPAY'">
              AUTOMATIC_PAYMENT
            </span>
            <span v-else-if="scope.row.operate === 'PENDING'">SUSPEND</span>
            <span v-else>{{ scope.row.operate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          :label="t('fields.operator')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="operateTime"
          :label="t('fields.operateTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.operateTime === null">-</span>
            <span
              v-if="scope.row.operateTime !== null"
              v-formatter="{
                data: scope.row.operateTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="cancelType"
          :label="t('fields.cancelType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.cancelType === null">-</span>
            <span v-if="scope.row.cancelType !== null">
              {{ scope.row.cancelType }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="t('fields.remark')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <div class="log-dialog-footer">
          <el-button type="primary" @click="uiControl.dialogVisible = false">
            {{ t('fields.close') }}
          </el-button>
        </div>
      </el-table>
      <el-form
        v-if="uiControl.dialogType === 'SEARCH'"
        ref="searchForm"
        :model="request"
        :rules="searchFormRule"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.withdrawDate')" prop="withdrawDate">
          <el-date-picker
            v-model="request.withdrawDate"
            format="DD/MM/YYYY HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            type="datetimerange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 250px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item :label="t('fields.serialNo')" prop="serialNumber">
          <el-input
            v-model="request.serialNumber"
            style="width: 250px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            v-model="request.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.statusList"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="request.loginName"
            style="width: 250px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="t('fields.financialLevel')" prop="financialId">
          <el-select
            v-model="request.financialId"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadFinancialLevels"
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.vipLevel')" prop="vipId">
          <el-select
            v-model="request.vipId"
            size="small"
            :placeholder="t('fields.vipLevel')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadVips"
          >
            <el-option
              v-for="item in vipList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawAmount')" prop="withdrawAmount">
          <el-input
            v-model="request.minWithdrawAmount"
            style="width: 110px; margin-right: 10px;"
            maxlength="10"
          />
          -
          <el-input
            v-model="request.maxWithdrawAmount"
            style="width: 110px; margin-left: 10px;"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item :label="t('fields.checkBy')" prop="checkBy">
          <el-input
            v-model="request.checkBy"
            style="width: 250px"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="t('fields.accountHolder')" prop="cardAccount">
          <el-input
            v-model="request.cardAccount"
            style="width: 250px"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="t('fields.paymentCard')" prop="paymentCard">
          <el-select
            v-model="request.paymentCard"
            size="small"
            :placeholder="t('fields.paymentCard')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadPaymentCards"
          >
            <el-option
              v-for="item in paymentCardList.list"
              :key="item.identifyCode"
              :label="item.identifyCode"
              :value="item.identifyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.bankName')" prop="bankName">
          <el-select
            v-model="request.bankName"
            size="small"
            :placeholder="t('fields.bankName')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadBanks"
          >
            <el-option
              v-for="item in bankList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.paymentBy')" prop="paymentBy">
          <el-input
            v-model="request.paymentBy"
            style="width: 250px"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="t('fields.checkTime')" prop="checkTime">
          <el-select
            v-model="request.checkTime"
            size="small"
            :placeholder="t('fields.checkTime')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.timeList"
              :key="item.key"
              :label="item.displayName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.payTime')" prop="payTime">
          <el-select
            v-model="request.payTime"
            size="small"
            :placeholder="t('fields.payTime')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.timeList"
              :key="item.key"
              :label="item.displayName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.totalTime')" prop="totalTime">
          <el-select
            v-model="request.totalTime"
            size="small"
            :placeholder="t('fields.totalTime')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.timeList"
              :key="item.key"
              :label="item.displayName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="resetQuery()">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="advancedSearch()">{{ t('fields.search') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="uiControl.dialogType === 'FAIL'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'FAIL'"
        ref="toFailForm"
        :model="failForm"
        :rules="failFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.reasonType')" prop="reasonType">
          <el-select
            v-model="failForm.reasonType"
            size="small"
            :placeholder="t('fields.reasonType')"
            class="filter-item"
            style="width: 300px;"
            default-first-option
            @focus="loadReasonTypes"
          >
            <el-option
              v-for="item in reasonTypeList.list"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.reasonTemplate')" prop="reasonTemplate">
          <el-select
            v-model="failForm.reasonTemplate"
            size="small"
            :placeholder="t('fields.reasonTemplate')"
            class="filter-item"
            style="width: 300px;"
            default-first-option
            @focus="loadReasonTemplates"
            @change="populateFailReason($event)"
          >
            <el-option
              v-for="item in reasonTemplateList.list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.failReason')" prop="failReason">
          <el-input
            type="textarea"
            v-model="failForm.failReason"
            :rows="6"
            style="width: 300px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button :disabled="clickedFail" type="primary" @click="fail">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import moment from 'moment'
import { getVipList } from '../../../../api/vip'
import { getFinancialLevels } from '../../../../api/financial-level'
import { getWithdrawBanks } from '../../../../api/bank-info'
import {
  getMemberWithdrawRecord,
  autoWithdrawToFail,
  getExportWithdrawRecord,
  autoWithdrawToSuccess,
  getUnsuccessfulIn10time,
  getqueryUnsuccessIn30min,
  fromToSuccess
} from '../../../../api/member-withdraw-record'
import { getMemberWithdrawLog } from '../../../../api/member-withdraw-log'
import { getAllWithdrawBankCard } from '../../../../api/bank-card'
import { getConfigList } from '../../../../api/config'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store'
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { getSiteListSimple } from "@/api/site";
import { TENANT } from "@/store/modules/user/action-types";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage, ElMessageBox } from 'element-plus'
import { isPak } from '@/utils/site'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteId = ref(null)
const searchForm = ref(null)
const toFailForm = ref(null)
const requestType = ref(null)
const clickedFail = ref(null)
const vipList = reactive({
  list: [],
})
const financialList = reactive({
  list: [],
})
const bankList = reactive({
  list: [],
})
const paymentCardList = reactive({
  list: [],
})
const cancelTypeList = reactive({
  list: [],
})
const siteList = reactive({
  list: [],
})
let timeZone = null;

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const uiControl = reactive({
  dialogVisible: false,
  messageVisible: false,
  dialogTitle: '',
  dialogType: 'LOG',
  timeList: [
    { key: 0, displayName: 'ALL' },
    { key: 1, displayName: 'Within 5 minutes', value: '<=300' },
    { key: 2, displayName: 'More than 5 minutes', value: '>300' },
    { key: 3, displayName: 'Within 10 minutes', value: '<=600' },
    { key: 4, displayName: 'More than 10 minutes', value: '>600' },
    { key: 5, displayName: 'More than 15 minutes', value: '>900' },
    { key: 6, displayName: 'More than 20 minutes', value: '>1200' },
    { key: 7, displayName: 'More than 30 minutes', value: '>1800' },
  ],
  statusList: [
    { key: 0, displayName: t('withdrawStatus.ALL') },
    { key: 1, displayName: t('withdrawStatus.APPLY'), value: 'APPLY' },
    { key: 2, displayName: t('withdrawStatus.REJECT'), value: 'REJECT' },
    { key: 3, displayName: t('withdrawStatus.STEP_1'), value: 'STEP_1' },
    { key: 4, displayName: t('withdrawStatus.STEP_2'), value: 'STEP_2' },
    { key: 5, displayName: t('withdrawStatus.STEP_3'), value: 'STEP_3' },
    { key: 6, displayName: t('withdrawStatus.PAYING'), value: 'PAYING' },
    { key: 7, displayName: t('withdrawStatus.AUTOPAY'), value: 'AUTOPAY' },
    { key: 8, displayName: t('withdrawStatus.SENDING'), value: 'SENDING' },
    { key: 9, displayName: t('withdrawStatus.WAITING_CALLBACK'), value: 'WAITING_CALLBACK' },
    { key: 10, displayName: t('withdrawStatus.SUCCESS'), value: 'SUCCESS' },
    { key: 11, displayName: t('withdrawStatus.FAIL'), value: 'FAIL' },
    { key: 12, displayName: t('withdrawStatus.PENDING'), value: 'PENDING' },
    { key: 13, displayName: t('withdrawStatus.WAITING_AUTO_PAY'), value: 'WAITING_AUTO_PAY' },
    { key: 14, displayName: t('withdrawStatus.FAIL_REVIEW'), value: 'FAIL_REVIEW' },
    { key: 15, displayName: t('withdrawStatus.WAITING_RETRY'), value: 'WAITING_RETRY' },
  ],
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  selectedDateType: [
    { key: 0, displayName: t('dateType.withdrawDate'), value: 0 },
    { key: 1, displayName: t('dateType.paymentDate'), value: 1 },
  ],
})
const failForm = reactive({
  id: null,
  reasonType: [],
  reasonTemplate: [],
  failReason: null,
  withdrawDate: ''
})
const reasonTypeList = reactive({
  list: [],
})
const reasonTemplateList = reactive({
  list: [],
})

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());

const searchRequest = reactive({
  selectedDateType: uiControl.selectedDateType[0].value,
  date: [defaultStartDate, defaultEndDate],
})

const request = reactive({
  size: 10,
  current: 1,
  withdrawDate: [],
  paymentDate: [],
  serialNumber: null,
  status: uiControl.statusList[0].value,
  loginName: null,
  financialId: null,
  cardAccount: null,
  bankName: null,
  minWithdrawAmount: null,
  maxWithdrawAmount: null,
  vipId: null,
  checkBy: null,
  paymentCard: null,
  paymentBy: null,
  cancelType: null,
  checkTime: uiControl.timeList[0],
  payTime: uiControl.timeList[0],
  totalTime: uiControl.timeList[0],
  checkTimeMoreThan: null,
  checkTimeWithin: null,
  payTimeMoreThan: null,
  payTimeWithin: null,
  totalTimeMoreThan: null,
  totalTimeWithin: null,
  name: null,
  code: null,
  siteId: null,
  sort: 1,
  doris: false,
})

const validateWithdrawAmount = (rule, value, callback) => {
  if (
    request.maxWithdrawAmount !== null &&
    request.maxWithdrawAmount - request.minWithdrawAmount < 0
  ) {
    callback(new Error(t('message.maxGreaterThanMin')))
  }
  callback()
}

const searchFormRule = reactive({
  withdrawAmount: [{ validator: validateWithdrawAmount, trigger: 'blur' }],
})

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  searchForm.value.resetFields()
  searchRequest.selectedDateType = uiControl.selectedDateType[0].value
  searchRequest.date = [defaultStartDate, defaultEndDate]
  request.withdrawDate = []
  request.paymentDate = []
  request.serialNumber = null
  request.status = uiControl.statusList[0].value
  request.loginName = null
  request.financialId = financialList.list[0].id
  request.cardAccount = null
  request.bankName = bankList.list[0].id
  request.minWithdrawAmount = null
  request.maxWithdrawAmount = null
  request.vipId = vipList.list[0].id
  request.checkBy = null
  request.paymentCard = paymentCardList.list[0].identifyCode
  request.paymentBy = null
  request.cancelType = cancelTypeList.list[0].id
  request.checkTime = uiControl.timeList[0]
  request.payTime = uiControl.timeList[0]
  request.totalTime = uiControl.timeList[0]
  request.checkTimeMoreThan = null
  request.checkTimeWithin = null
  request.payTimeMoreThan = null
  request.payTimeWithin = null
  request.totalTimeMoreThan = null
  request.totalTimeWithin = null
  request.name = null
  request.code = null
  uiControl.dialogVisible = false
  request.siteId = store.state.user.siteId
  request.sort = 1
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalAmount: 0,
})

const logPage = reactive({
  records: [],
  loading: false,
})

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
  vipList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.vipId) {
    request.vipId = vipList.list[0].id
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: siteId.value })
  financialList.list = financial
  financialList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.financialId) {
    request.financialId = financialList.list[0].id
  }
}

async function loadBanks() {
  const { data: bank } = await getWithdrawBanks()
  bankList.list = bank
  bankList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.bankName) {
    request.bankName = bankList.list[0].id
  }
}

async function loadPaymentCards() {
  const { data: paymentCard } = await getAllWithdrawBankCard(request.siteId)
  paymentCardList.list = paymentCard
  paymentCardList.list.unshift({
    id: 0,
    identifyCode: 'ALL',
  })

  if (!request.paymentCard) {
    request.paymentCard = paymentCardList.list[0].identifyCode
  }
}

async function loadCancelTypes() {
  const { data: cancelType } = await getConfigList('cancel_type')
  cancelTypeList.list = cancelType
  cancelTypeList.list.unshift({
    id: 0,
    value: 'ALL',
  })

  if (!request.cancelType) {
    request.cancelType = cancelTypeList.list[0].id
  }
}

async function loadReasonTypes() {
  const { data: reasonType } = await getConfigList(
    'cancel_type',
    request.siteId ? request.siteId : null
  )
  reasonTypeList.list = reasonType
}

async function loadReasonTemplates() {
  const { data: reasonTemplate } = await getConfigList(
    'cancel_cause',
    request.siteId ? request.siteId : null
  )
  reasonTemplateList.list = reasonTemplate
}

async function advancedSearch() {
  searchForm.value.validate(async valid => {
    if (valid) {
      await loadRecord()
      // resetQuery()
    }
  })
}

async function toFail(memberWithdrawRecord) {
  if (isPak(request.siteId)) {
    showDialog('FAIL', memberWithdrawRecord)
  } else {
    try {
      await ElMessageBox.confirm(
        t('message.confirmToAction') || 'Are you sure you want to mark this withdrawal as failed?',
        t('fields.confirm') || 'Confirm',
        {
          confirmButtonText: t('fields.confirm') || 'Confirm',
          cancelButtonText: t('fields.cancel') || 'Cancel',
          type: 'warning',
        }
      )
      page.loading = true
      await autoWithdrawToFail(memberWithdrawRecord.id, 'Auto Withdraw Fail', 'Auto Withdraw Fail', memberWithdrawRecord.withdrawDate, memberWithdrawRecord.siteId)
      await loadRecordByRequestType()
      ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
      page.loading = false
    } catch (error) {
      // User cancelled the action
      console.log('User cancelled the auto withdraw fail action')
    }
  }
}

async function toSuccess(val) {
  page.loading = true
  await autoWithdrawToSuccess(val.id, val.withdrawDate, val.siteId)
  await loadRecordByRequestType()
  ElMessage({ message: t('message.success'), type: 'success' })
  page.loading = false
}

async function updateToSuccess(val) {
  const chooseRecord = []
  chooseRecord.push(val)
  await fromToSuccess(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  await loadRecord()
}

function checkQuery() {
  if (searchRequest.selectedDateType === 0) {
    request.withdrawDate = searchRequest.date
    request.paymentDate = []
  } else {
    request.withdrawDate = []
    request.paymentDate = searchRequest.date
  }
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  if (request.withdrawDate !== null) {
    if (request.withdrawDate.length === 2) {
      query.withdrawDate = JSON.parse(JSON.stringify(request.withdrawDate));
      query.withdrawDate[0] = formatInputTimeZone(query.withdrawDate[0], timeZone);
      query.withdrawDate[1] = formatInputTimeZone(query.withdrawDate[1], timeZone);
      query.withdrawDate = query.withdrawDate.join(',')
    }
  }

  if (request.paymentDate !== null) {
    if (request.paymentDate.length === 2) {
      query.paymentDate = JSON.parse(JSON.stringify(request.paymentDate));
      query.paymentDate[0] = formatInputTimeZone(query.paymentDate[0], timeZone);
      query.paymentDate[1] = formatInputTimeZone(query.paymentDate[1], timeZone);
      query.paymentDate = query.paymentDate.join(',')
    }
  }

  if (request.checkTime.key !== 0) {
    if (request.checkTime.key === 1 || request.checkTime.key === 3) {
      query.checkTimeMoreThan = null
      query.checkTimeWithin = parseInt(request.checkTime.value.substr(2))
    } else {
      query.checkTimeMoreThan = parseInt(request.checkTime.value.substr(1))
      query.checkTimeWithin = null
    }
  } else {
    query.checkTimeMoreThan = null
    query.checkTimeWithin = null
  }

  if (request.payTime.key !== 0) {
    if (request.payTime.key === 1 || request.payTime.key === 3) {
      query.payTimeMoreThan = null
      query.payTimeWithin = parseInt(request.payTime.value.substr(2))
    } else {
      query.payTimeMoreThan = parseInt(request.payTime.value.substr(1))
      query.payTimeWithin = null
    }
  } else {
    query.payTimeMoreThan = null
    query.payTimeWithin = null
  }

  if (request.totalTime.key !== 0) {
    if (request.totalTime.key === 1 || request.totalTime.key === 3) {
      query.totalTimeMoreThan = null
      query.totalTimeWithin = parseInt(request.totalTime.value.substr(2))
    } else {
      query.totalTimeMoreThan = parseInt(request.totalTime.value.substr(1))
      query.totalTimeWithin = null
    }
  } else {
    query.totalTimeMoreThan = null
    query.totalTimeWithin = null
  }
  if (query.paymentCard === 'ALL') {
    query.paymentCard = null
  }
  query.checkTime = null
  query.payTime = null
  query.totalTime = null
  query.memberType = "NORMAL,TEST,OUTSIDE,PROMO_TEST";
  return query
}

async function loadRecordByRequestType() {
  if (requestType.value === "unsuccessFrom30min") {
    unsuccessFrom30min()
  } else if (requestType.value === "unsuccessIn10time") {
    unsuccessIn10time()
  } else {
    loadRecord()
  }
}

async function loadRecord() {
  requestType.value = "loadRecord"
  uiControl.dialogVisible = false
  page.loading = true

  const query = checkQuery()
  const { data: ret } = await getMemberWithdrawRecord(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    page.totalAmount = ret.sums.withdrawAmount
  } else {
    page.totalAmount = 0
  }
  request.doris = ret.sums.useDoris;
  page.loading = false
}

const convertDateTolastWeek = date => {
  var m = moment(date).subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss')
  return m
}

const convertDateTo30min = date => {
  var m = moment(date).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss')
  return m
}

const convertDate = date => {
  var m = moment(date).format('YYYY-MM-DD HH:mm:ss')
  return m
}

async function unsuccessFrom30min() {
  requestType.value = "unsuccessFrom30min"
  uiControl.dialogVisible = false
  page.loading = true
  searchRequest.date = [convertDateTolastWeek(new Date()), convertDateTo30min(new Date())]
  const query = checkQuery()
  const { data: ret } = await getqueryUnsuccessIn30min(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    page.totalAmount = ret.sums.withdrawAmount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function unsuccessIn10time() {
  requestType.value = "unsuccessIn10time"
  uiControl.dialogVisible = false
  page.loading = true
  searchRequest.date = [convertDateTolastWeek(new Date()), convertDate(new Date())]
  const query = checkQuery()
  const { data: ret } = await getUnsuccessfulIn10time(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    page.totalAmount = ret.sums.withdrawAmount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function showDialog(type, memberWithdrawRecord) {
  if (type === 'FAIL') {
    if (toFailForm.value) {
      toFailForm.value.resetFields()
    }
    failForm.id = memberWithdrawRecord.id
    failForm.withdrawDate = memberWithdrawRecord.withdrawDate
    await loadReasonTypes()
    failForm.reasonType = reasonTypeList.list[0].value
    uiControl.dialogTitle = t('fields.failReason')
  } else if (type === 'LOG') {
    uiControl.dialogTitle = t('fields.memberWithdrawLog')
    logPage.loading = true
    const { data: ret } = await getMemberWithdrawLog(memberWithdrawRecord.id, memberWithdrawRecord.withdrawDate)
    logPage.records = ret
    logPage.loading = false
  } else if (type === 'SEARCH') {
    uiControl.dialogTitle = t('fields.advancedSearch')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExportWithdrawRecord(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

async function fail() {
  toFailForm.value.validate(async valid => {
    if (valid) {
      clickedFail.value = true
      await autoWithdrawToFail(
        failForm.id,
        failForm.reasonType,
        failForm.failReason,
        failForm.withdrawDate,
        request.siteId
      )
      uiControl.dialogVisible = false
      clickedFail.value = false
      await loadRecord()
      ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
    }
  })
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  if (LOGIN_USER_SITEID.value != null) {
    siteId.value = LOGIN_USER_SITEID.value
  }
  loadVips()
  loadFinancialLevels()
  loadBanks()
  loadPaymentCards()
  loadCancelTypes()
  loadRecord()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.log-dialog-footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}
</style>

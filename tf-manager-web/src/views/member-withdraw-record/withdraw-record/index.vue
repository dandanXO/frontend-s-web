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
          v-model="request.sort"
          size="small"
          :placeholder="t('fields.sorting')"
          class="filter-item"
          style="width: 280px; margin-left: 10px"
        >
          <el-option
            v-for="item in uiControl.sortList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="calc(100vh - 285px)"
        size="mini"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
      >
        <el-table-column
          v-if="hasRole(['ADMIN'])"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="syncRecord(scope.row)"
            >
              {{ t('fields.sync') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawType"
          :label="t('fields.withdrawType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span>{{ t('withdrawType.' + scope.row.withdrawType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawReviewType"
          :label="t('fields.withdrawReviewType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span>{{ t('withdrawReviewType.' + scope.row.withdrawReviewType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          :label="t('fields.serialNo')"
          align="center"
          min-width="210"
        />
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
          prop="realName"
          :label="t('fields.realName')"
          align="center"
          min-width="110"
        />
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
          prop="financial"
          :label="t('fields.financialLevel')"
          align="center"
          min-width="110"
        >
          <template #default="scope">
            <span :style="{color: scope.row.financialColor}">{{ scope.row.financial }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardAccount"
          :label="t('fields.accountHolder')"
          align="center"
          min-width="120"
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
          prop="currencyCode"
          :label="t('fields.currency')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="currencyRate"
          :label="t('fields.currencyRate')"
          align="center"
          min-width="100"
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
          prop="localCurrencyAmount"
          :label="t('fields.localCurrencyAmount')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.localCurrencyAmount,
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
          prop="checkBy"
          :label="t('fields.checkBy')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.checkBy === null">-</span>
            <span v-if="scope.row.checkBy !== null">
              {{ scope.row.checkBy }}
            </span>
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
          prop="paymentCard"
          :label="t('fields.paymentCard')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.paymentCard === null">-</span>
            <span v-if="scope.row.paymentCard !== null">
              {{ scope.row.paymentCard }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirm status"
          :label="t('fields.confirmStatus')"
          align="center"
          width="160"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.confirmStatus === '0' && scope.row.status === 'SUCCESS'" type="danger">
              {{ t('withdrawConfirmStatus.' + scope.row.confirmStatus) }}
            </el-tag>
            <el-tag v-else-if="scope.row.confirmStatus === '1' && scope.row.status === 'SUCCESS'" type="success">
              {{ t('withdrawConfirmStatus.' + scope.row.confirmStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirmBy"
          :label="t('fields.confirmBy')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.confirmBy !== null && scope.row.status === 'SUCCESS'">
              {{ scope.row.confirmBy }}
            </span>
            <span v-else>-</span>
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
          prop="vip"
          :label="t('fields.vipLevel')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="walletType"
          :label="t('fields.walletType')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="memberType"
          :label="t('fields.memberType')"
          align="center"
          min-width="110"
        />
        <el-table-column
          prop="riskLevel"
          :label="t('fields.riskLevel')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span :style="{color: scope.row.riskLevelColor}">{{ scope.row.riskLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="clientIp"
          :label="t('fields.clientIp')"
          align="center"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="280"
          fixed="right"
          v-if="hasPermission(['sys:withdraw:log:list'])"
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
              v-if="scope.row.status === 'STEP_1' && hasPermission(['sys:withdraw:checking'])"
              size="mini"
              type="success"
              @click="toApply(scope.row)"
            >
              {{ t('fields.toApplying') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'STEP_3' && hasPermission(['sys:withdraw:pay'])"
              size="mini"
              type="warning"
              @click="toBeforePaid(scope.row)"
            >
              {{ t('fields.toBeforePaid') }}
            </el-button>
            <el-button
              v-if="!isBr2(scope.row.siteId) && scope.row.status === 'SUCCESS' && hasPermission(['sys:withdraw:fail'])"
              size="mini"
              type="danger"
              @click="toFail(scope.row)"
            >
              {{ t('fields.fail') }}
            </el-button>
            <el-button
              v-if="!isBr2(scope.row.siteId) && scope.row.status === 'SUCCESS' && (scope.row.withdrawCode === 'BANK' || scope.row.withdrawCode === 'ALIPAY') && scope.row.confirmStatus === '0' && hasPermission(['sys:withdraw:confirm'])"
              size="mini"
              type="primary"
              @click="toConfirm(scope.row)"
            >
              {{ t('fields.confirm') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRecord"
        @size-change="loadRecord"
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
        <!--        <el-form-item :label="t('fields.cancelType')" prop="cancelType">-->
        <!--          <el-select-->
        <!--            v-model="request.cancelType"-->
        <!--            size="small"-->
        <!--            :placeholder="t('fields.cancelType')"-->
        <!--            class="filter-item"-->
        <!--            style="width: 250px;"-->
        <!--            default-first-option-->
        <!--            @focus="loadCancelTypes"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="item in cancelTypeList.list"-->
        <!--              :key="item.id"-->
        <!--              :label="item.value"-->
        <!--              :value="item.id"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
        <el-form-item :label="t('fields.clientType')" prop="clientType">
          <el-select
            v-model="request.clientType"
            size="small"
            :placeholder="t('fields.clientType')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.clientType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
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
        <el-form-item :label="t('fields.withdrawType')" prop="withdrawType">
          <el-select
            v-model="request.withdrawType"
            size="small"
            :placeholder="t('fields.withdrawType')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.withdrawType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawReviewType')" prop="withdrawReviewType">
          <el-select
            v-model="request.withdrawReviewType"
            size="small"
            :placeholder="t('fields.withdrawReviewType')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.withdrawReviewType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.currency')" prop="currencyId">
          <el-select
            v-model="request.currencyId"
            size="small"
            :placeholder="t('fields.currency')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadCurrencys"
          >
            <el-option
              v-for="item in currencyList.list"
              :key="item.id"
              :label="item.currencyCode"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.riskLevel')" prop="riskId">
          <el-select
            v-model="request.riskId"
            size="small"
            :placeholder="t('fields.riskLevel')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadRisks"
          >
            <el-option
              v-for="item in riskList.list"
              :key="item.id"
              :label="item.levelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.accountNumber')" prop="cardNumber">
          <el-input
            v-model="request.cardNumber"
            style="width: 250px"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="resetQuery()">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="advancedSearch()">{{ t('fields.search') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import moment from 'moment'
import { getVipList } from '../../../api/vip'
import { getFinancialLevels } from '../../../api/financial-level'
import { getWithdrawBanks } from '../../../api/bank-info'
import {
  getMemberWithdrawRecord,
  fromCheckingToApply,
  fromPayToBeforePaid,
  fromToFail,
  fromToConfirm,
  getExportWithdrawRecord,
  sync
} from '../../../api/member-withdraw-record'
import { getMemberWithdrawLog } from '../../../api/member-withdraw-log'
import { getAllWithdrawBankCard } from '../../../api/bank-card'
import { getConfigList } from '../../../api/config'
import { hasPermission, hasRole } from '../../../utils/util'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { getSiteListSimple, getSupportedCurrencyBySiteId } from "@/api/site";
import { selectList } from "../../../api/risk-level";
import { TENANT } from "@/store/modules/user/action-types";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage } from "element-plus";
import { isBr2 } from '../../../utils/site'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteId = ref(null)
const searchForm = ref(null)
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
const currencyList = reactive({
  list: [],
})
const riskList = reactive({
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
  clientType: [
    { key: 1, displayName: 'WEB', value: 'WEB' },
    { key: 2, displayName: 'H5', value: 'H5' },
    { key: 3, displayName: 'IOS', value: 'IOS' },
    { key: 4, displayName: 'ANDROID', value: 'ANDROID' },
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
  sortList: [
    { label: t('fields.byWithdrawDateDesc'), value: 1 },
    { label: t('fields.byWithdrawDateAsc'), value: 2 },
    { label: t('fields.byPaymentDateDesc'), value: 3 },
    { label: t('fields.byPaymentDateAsc'), value: 4 },
  ],
  withdrawType: [
    { key: 1, displayName: t('withdrawType.Manual'), value: 'Manual' },
    { key: 2, displayName: t('withdrawType.AUTO_WITHDRAW'), value: 'AUTO_WITHDRAW' },
  ],
  withdrawReviewType: [
    { key: 1, displayName: t('withdrawReviewType.MANUAL'), value: 'MANUAL' },
    { key: 2, displayName: t('withdrawReviewType.AUTO'), value: 'AUTO' },
  ],
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
  size: 20,
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
  clientType: null,
  sort: 1,
  withdrawType: null,
  doris: false,
  withdrawReviewType: null,
  currencyId: null,
  riskId: null,
  cardNumber: null
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

// function disabledDate(time) {
//   return (
//     time.getTime() <
//     moment(new Date())
//       .subtract(2, 'months')
//       .startOf('month')
//       .format('x') || time.getTime() > new Date().getTime()
//   )
// }

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
  request.currencyId = currencyList.list[0].id
  if (riskList.list.length > 0) {
    request.riskId = riskList.list[0].id
  }
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

async function loadCurrencys() {
  const { data: currency } = await getSupportedCurrencyBySiteId(siteId.value)
  currencyList.list = currency
  currencyList.list.unshift({
    id: 0,
    currencyCode: 'ALL',
  })

  if (!request.currencyId) {
    request.currencyId = currencyList.list[0].id
  }
}

async function loadRisks() {
  const { data: risk } = await selectList({ siteId: siteId.value })
  riskList.list = risk
  riskList.list.unshift({
    id: 0,
    levelName: 'ALL',
  })

  if (!request.riskId) {
    request.riskId = riskList.list[0].id
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

async function advancedSearch() {
  searchForm.value.validate(async valid => {
    if (valid) {
      await loadRecord()
      // resetQuery()
    }
  })
}

async function toApply(val) {
  const chooseRecord = []
  chooseRecord.push(val)
  await fromCheckingToApply(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  await loadRecord()
}

async function toBeforePaid(val) {
  const chooseRecord = []
  chooseRecord.push(val)
  await fromPayToBeforePaid(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  await loadRecord()
}

async function toFail(val) {
  const chooseRecord = []
  chooseRecord.push(val)
  await fromToFail(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  await loadRecord()
}

async function toConfirm(val) {
  const chooseRecord = []
  chooseRecord.push(val)
  await fromToConfirm(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
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

async function loadRecord() {
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

async function showDialog(type, memberWithdrawRecord) {
  if (type === 'LOG') {
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

async function syncRecord(record) {
  await sync({ withdrawDate: record.withdrawDate, serialNumber: record.serialNumber, siteId: request.siteId })
  ElMessage({ message: t('message.success'), type: 'success' })
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
  loadCurrencys()
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

<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @change="loadCauseBySiteId"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-input
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.cause"
          size="small"
          :placeholder="t('fields.cause')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadCauseBySiteId"
        >
          <el-option
            v-for="item in adjustTypeList.requestList"
            :key="item.reason"
            :label="item.reason"
            :value="item.reason"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.operationType"
          size="small"
          :placeholder="t('fields.operationType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.operationType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.createBy"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.createBy')"
        />
        <el-input
          v-model.number="request.reimburseAmount"
          style="width: 100px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.amountGreaterThan')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberAmountAdjust"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:member:amount-adjust:add']"
          @click="showDialog('CREATE_ADD')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-minus"
          size="mini"
          type="danger"
          v-permission="['sys:member:amount-adjust:deduct']"
          @click="showDialog('CREATE_DEDUCT')"
        >
          {{ t('fields.deduct') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:member:amount-adjust:import']"
          @click="showImportDialog()"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member:amount-adjust:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-dialog
      :title="t('fields.massImport')"
      v-model="uiControl.importDialogVisible"
      append-to-body
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button
        icon="el-icon-download"
        size="mini"
        type="primary"
        v-permission="['sys:member:amount-adjust:export']"
        @click="downloadTemplate"
      >
        {{ t('fields.downloadTemplate') }}
      </el-button>
      <el-button
        icon="el-icon-upload"
        size="mini"
        type="success"
        @click="chooseFile"
      >
        {{ t('fields.import') }}
      </el-button>
      <div style="margin-bottom: 20px;" />
      <!-- eslint-disable -->
      <input
        id="importFile"
        type="file"
        accept=".xlsx, .xls"
        @change="importToTable"
        hidden
      />
      <el-form
        ref="importRefForm"
        :model="importForm"
        :rules="importRules"
        :inline="true"
        size="small"
        label-width="150px"
        style="float: right;"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="importForm.siteId"
            :placeholder="t('fields.site')"
            style="width: 350px;"
            filterable
            default-first-option
            @change="loadFormImportSelect"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('fields.currencyWallet')"
          v-if="
            siteCurrencyConfig.supportMultiWallet !== null &&
              siteCurrencyConfig.supportMultiWallet === 'OPEN'
          "
          prop="currency"
        >
          <el-select
            v-model="importForm.currency"
            :placeholder="t('fields.currency')"
            style="width: 350px;"
            filterable
            default-first-option
          >
            <el-option
              v-for="item in currencyList.currencyGroupList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.cause')" prop="cause">
          <el-select
            v-model="importForm.cause"
            :placeholder="t('fields.cause')"
            style="width: 350px;"
            filterable
            default-first-option
            required
            @focus="loadCauseBySiteId"
            @change="handleImportCauseChange"
          >
            <el-option
              v-for="item in adjustTypeList.importFormList"
              :key="item.reason"
              :label="item.reason"
              :value="item.reason"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="t('fields.rollover')" prop="rollover">
          <el-input-number
            v-model="adjustRollover.importedSelectedItem"
            style="width: 350px;"
            :min="0"
            :max="100"
            :controls="false"
            @keypress="restrictInput($event)"
            disabled="disabled"
          />
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.rolloverType')" prop="rolloverType">
              <el-select
                v-model="selectedRolloverType"
                :placeholder="t('fields.select')"
                style="width: 100%;"
                filterable
                default-first-option
                @change="checkRolloverType"
              >
                <el-option
                  v-for="f in uiControl.rolloverType"
                  :key="f.key"
                  :label="f.displayName"
                  :value="f.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="uiControl.selectedGameTypeRolloverType !== 'GAME_TYPE'" :span="12">
            <el-form-item prop="rollover">
              <el-input-number
                v-model="form.rollover"
                style="width: 145px"
                :max="selectedRolloverType === 'MULTIPLE' ? 100 : 999999999999999"
                :controls="false"
                @keypress="restrictInput($event)"
                @input="validateField('rollover')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            :label="t('fields.gameTypeRollover')"
            prop="gameTypeRollover"
          >
            <el-select
              v-model="uiControl.selectedGameTypeRolloverType"
              style="width: 250px"
              :placeholder="t('fields.select')"
              filterable
            >
              <el-option
                v-for="f in uiControl.gameTypeRolloverTypes"
                :key="f.key"
                :label="f.displayName"
                :value="f.value"
              />
            </el-select>
            <div v-if="uiControl.selectedGameTypeRolloverType !== null && uiControl.selectedGameTypeRolloverType !== 'ALL_TYPES'">
              <div v-for="(item, index) in gameTypes" :key="index">
                <el-select
                  v-model="item.key"
                  size="small"
                  :placeholder="t('fields.gameType')"
                  class="filter-item"
                  style="width: 100px; margin-top: 5px"
                >
                  <el-option
                    v-for="gameType in uiControl.gameTypeRollover"
                    :key="gameType.key"
                    :label="t(`gameType.${gameType.displayName}`)"
                    :value="gameType.value"
                    :disabled="gameTypes.some(({key}) => key === gameType.value)"
                  />
                </el-select>
                <span v-if="uiControl.selectedGameTypeRolloverType === 'GAME_TYPE'">
                  :
                  <el-input-number v-if="item.key" :controls="false" style="width: 100px " v-model="item.value" :min="1" :max="selectedRolloverType === 'MULTIPLE'? 100 : 999999999999999" />
                  <el-input-number v-else :controls="false" style="width: 100px " v-model="item.value" />
                </span>
                <el-button
                  v-if="index === gameTypes.length - 1"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  style="margin-left: 20px"
                  @click="addRollover()"
                  plain
                >
                  {{ t('fields.add') }}
                </el-button>
                <el-button
                  v-else
                  icon="el-icon-remove"
                  size="mini"
                  type="danger"
                  style="margin-left: 20px"
                  @click="delRollover(index)"
                  plain
                >
                  {{ t('fields.delete') }}
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            :rows="6"
            v-model="importForm.remark"
            style="width: 350px"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <el-table
        :data="
          importedPage.records.slice(
            importedPage.size * (importedPage.current - 1),
            importedPage.size * importedPage.current
          )
        "
        v-loading="importedPage.loading"
        ref="table"
        row-key="id"
        size="small"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="memberId"
          :label="t('fields.memberId')"
          width="300"
        >
          <template #default="scope">
            <span v-if="scope.row.memberId !== '-1'">{{ scope.row.memberId }}</span>
            <span v-else style="color: red">{{ t('fields.noData') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="330"
        />
        <el-table-column
          prop="amount"
          :label="t('fields.amount')"
          width="330"
        />
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeImportedPage"
        layout="prev, pager, next"
        :page-size="importedPage.size"
        :page-count="importedPage.pages"
        :current-page="importedPage.current"
      />
      <div class="dialog-footer">
        <el-button
          type="primary"
          :disabled="importedPage.records.length === 0"
          @click="confirmImport"
          :loading="importedPage.buttonLoading"
        >
          {{ t('fields.confirmAndImport') }}
        </el-button>
        <el-button @click="clearImport">{{ t('fields.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="memberAmountAdjustForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item v-if="uiControl.dialogType === 'CREATE_ADD'" :label="t('fields.amountAdjustType')">
          <el-radio-group
            v-model="addAmountAdjustmentType"
            style="width: 350px;"
            @change="handleRadioChange"
          >
            <el-radio
              v-for="item in uiControl.addType"
              :key="item.key"
              :label="item.value"
            >
              {{ item.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.site')"
            style="width: 350px;"
            filterable
            default-first-option
            @change="loadFormSelect"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">

<!--          <div-->
<!--              class="el-input-tag input-tag-wrapper"-->
<!--              :class="[uiControl.size ? 'el-input-tag&#45;&#45;' + uiControl.size : '']"-->
<!--              @click="foucusTagInput"-->
<!--              style="width: 300px;"-->
<!--          >-->
<!--            <el-tag-->
<!--                v-for="tag in dynamicTags"-->
<!--                :key="tag"-->
<!--                class="mx-1"-->
<!--                closable-->
<!--                :disable-transitions="false"-->
<!--                @close="handleClose(tag)"-->
<!--            >-->
<!--              {{ tag }}-->
<!--            </el-tag>-->
<!--            <el-autocomplete-->
<!--                v-if="dynamicTags.length === 0"-->
<!--                v-model="inputValue"-->
<!--                :fetch-suggestions="debouncedFetchSuggestions"-->
<!--                :trigger-on-focus="false"-->
<!--                class="inline-input"-->
<!--                style="outline: none; border: none"-->
<!--                @select="handleSelect"-->
<!--            />-->
<!--          </div>-->


          <el-input @focus="handleSelect" v-model="form.loginName" style="width: 350px" />
          <span
            v-if="uiControl.dialogType === 'CREATE_DEDUCT'"
            style="display: block"
          >
            {{ t('fields.balance') }}: $
            <span v-formatter="{ data: uiControl.balance, type: 'money' }" />
          </span>
        </el-form-item>
        <el-form-item
          :label="t('fields.currencyWallet')"
          v-if="
            siteCurrencyConfig.supportMultiWallet !== null &&
              siteCurrencyConfig.supportMultiWallet === 'OPEN'
          "
          prop="currency"
        >
          <el-select
            v-model="form.currency"
            :placeholder="t('fields.currency')"
            style="width: 350px;"
            filterable
            default-first-option
            @change="handleBalanceType"
          >
            <el-option
              v-for="item in currencyList.currencyGroupList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="addAmountAdjustmentType === 'CALCULATE'" :label="t('fields.deposit')" prop="deposit">
          <el-input
            v-model="form.deposit"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictDecimalInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input
            v-model="form.amount"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictDecimalInput($event)"
          />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE_ADD'" :label="t('fields.cause')" prop="cause">
          <el-select
            v-model="form.cause"
            :placeholder="t('fields.cause')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadCauseBySiteId"
            :disabled="!form.siteId"
            @change="handleCauseChange"
          >
            <el-option
              v-for="item in adjustTypeList.formList"
              :key="item.reason"
              :label="item.reason"
              :value="item.reason"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE_DEDUCT'" :label="t('fields.cause')" prop="cause">
          <el-select
            v-model="form.cause"
            :placeholder="t('fields.cause')"
            style="width: 220px;"
            filterable
            default-first-option
            @focus="loadCauseBySiteId"
            :disabled="!form.siteId"
            @change="handleCauseChange"
          >
            <el-option
              v-for="item in adjustTypeList.formList"
              :key="item.reason"
              :label="item.reason"
              :value="item.reason"
            />
          </el-select>
          &nbsp; {{ t('fields.summary') }} &nbsp;
          <el-switch
            v-model="form.sendSummary"
            active-color="#409EFF"
            inactive-color="#F56C6C"
          />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.rollover')" prop="rollover">
          <el-input-number
            v-model="adjustRollover.selectedItem"
            style="width: 145px"
            :min="0"
            :max="100"
            :controls="false"
            @keypress="restrictInput($event)"
            disabled="disabled"
          />
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.rolloverType')" prop="rolloverType">
              <el-select v-if="!isAffiliateUser"
                v-model="selectedRolloverType"
                style="width: 100%;"
                filterable
                default-first-option
                @change="checkRolloverType"
                :disabled="addAmountAdjustmentType === 'CALCULATE'"
              >
                <el-option
                  v-for="f in uiControl.rolloverType"
                  :key="f.key"
                  :label="f.displayName"
                  :value="f.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="uiControl.selectedGameTypeRolloverType !== 'GAME_TYPE'">
            <el-col v-if="!isAffiliateUser" :span="7">
              <el-form-item prop="rollover">
                <el-input-number
                  v-model="form.rollover"
                  style="width: 145px"
                  :min="0"
                  :max="selectedRolloverType === 'MULTIPLE' ? 100 : 999999999999999"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" v-else>
              <el-form-item prop="rollover">
                <el-input-number
                  v-model="form.rollover"
                  style="width: 145px"
                  :controls="false"
                  :disabled="isAffiliateUser"
                />
              </el-form-item>
            </el-col>
            <el-col style="padding:8px 0;" :span="4" v-if="addAmountAdjustmentType === 'CALCULATE'">
              {{ calculateRollover() }}
            </el-col>
          </template>
        </el-row>
        <el-row v-if="!isAffiliateUser">
          <el-form-item
            :label="t('fields.gameTypeRollover')"
            prop="gameTypeRollover"
          >
            <el-select
              v-model="uiControl.selectedGameTypeRolloverType"
              style="width: 250px"
              filterable
            >
              <el-option
                v-for="f in uiControl.gameTypeRolloverTypes"
                :key="f.key"
                :label="f.displayName"
                :value="f.value"
              />
            </el-select>
            <div v-if="uiControl.selectedGameTypeRolloverType !== null && uiControl.selectedGameTypeRolloverType !== 'ALL_TYPES'">
              <div v-for="(item, index) in gameTypes" :key="index">
                <el-select
                  v-model="item.key"
                  size="small"
                  :placeholder="t('fields.gameType')"
                  class="filter-item"
                  style="width: 100px; margin-top: 5px"
                >
                  <el-option
                    v-for="gameType in uiControl.gameTypeRollover"
                    :key="gameType.key"
                    :label="t(`gameType.${gameType.displayName}`)"
                    :value="gameType.value"
                    :disabled="gameTypes.some(({key}) => key === gameType.value)"
                  />
                </el-select>
                <span v-if="uiControl.selectedGameTypeRolloverType === 'GAME_TYPE'">
                  :
                  <el-input-number v-if="item.key" :controls="false" style="width: 100px " v-model="item.value" :min="1" :max="selectedRolloverType === 'MULTIPLE'? 100 : 999999999999999" />
                  <el-input-number v-else :controls="false" style="width: 100px " v-model="item.value" />
                </span>
                <el-button
                  v-if="index === gameTypes.length - 1"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  style="margin-left: 20px"
                  @click="addRollover()"
                  plain
                >
                  {{ t('fields.add') }}
                </el-button>
                <el-button
                  v-else
                  icon="el-icon-remove"
                  size="mini"
                  type="danger"
                  style="margin-left: 20px"
                  @click="delRollover(index)"
                  plain
                >
                  {{ t('fields.delete') }}
                </el-button>
                <span style="padding: 8px; text-align: center;" v-if="item.key && item.value && addAmountAdjustmentType === 'CALCULATE'">{{ calculateRollover(item.value) }}</span>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            :rows="6"
            v-model="form.remark"
            style="width: 350px"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            :loading="isBtnLoading"
            v-if="uiControl.dialogType === 'CREATE_ADD'"
            type="primary"
            @click="createAdd"
          >
            {{ t('fields.confirm') }}
          </el-button>
          <el-button
            :loading="isBtnLoading"
            v-if="uiControl.dialogType === 'CREATE_DEDUCT'"
            type="primary"
            @click="createDeduct"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="t('fields.exportToExcel')"
      v-model="uiControl.messageVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>

    <el-table
      size="small"
      :data="page.records"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="site" :label="t('fields.site')" min-width="100" />
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        min-width="120"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="vipName" :label="t('fields.vipLevel')" min-width="100" />
      <el-table-column prop="type" :label="t('fields.type')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.amount < 0">{{ t('fields.deduct') }}</span>
          <span v-else>{{ t('fields.add') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cause"
        :label="t('fields.cause')"
        min-width="180"
      />
      <el-table-column
        prop="currency"
        :label="t('fields.currencyWallet')"
        min-width="120"
      ></el-table-column>
      <el-table-column
        prop="amount"
        :label="t('fields.amount')"
        min-width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{ data: scope.row.amount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="beforeAmount"
        :label="t('fields.beforeAmount')"
        min-width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{ data: scope.row.beforeAmount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="afterAmount"
        :label="t('fields.afterAmount')"
        min-width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{ data: scope.row.afterAmount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('fields.remark')"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.remark === null">-</span>
          <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        :label="t('fields.createBy')"
        min-width="150"
      />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        min-width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!isCnySite(request.siteId) || (isCnySite(request.siteId) && LOGIN_USER_TYPE === ADMIN.value)"
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadMemberAmountAdjust"
      @size-change="loadMemberAmountAdjust"
    />
    <div class="table-footer">
      <span>{{ t('fields.totalReimburseAmount') }}</span>
      <span style="margin-left: 10px">$</span>
      <span v-formatter="{ data: page.totalReimburse, type: 'money' }" />
      <span style="margin-left: 20px">{{ t('fields.noOfReimbursement') }}</span>
      <span style="margin-left: 10px">{{ page.numberOfReimbursement }}</span>
      <span style="margin-left: 20px">{{ t('fields.totalDeductAmount') }}</span>
      <span style="margin-left: 10px">$</span>
      <span v-formatter="{ data: page.totalDeduct, type: 'money' }" />
      <span style="margin-left: 20px">{{ t('fields.noOfDeduction') }}</span>
      <span style="margin-left: 10px">{{ page.numberOfDeduction }}</span>
    </div>
  </div>
  <div v-if="uiControl.progress !== 100" class="loading-overlay">
    <div class="loading-box">
      <el-progress type="circle" :percentage="uiControl.progress" />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { debounce } from "lodash";
import { computed, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import { getMemberLoginNameList } from "../../../api/system-message-template";
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import {
  createAddMemberAmountAdjust,
  createDeductMemberAmountAdjust,
  getMemberAmountAdjust,
  getTotalReimburseAmount,
  getTotalDeductionAmount,
  getNumberOfReimburse,
  getNumberOfDeduct,
  createBatchAmountAdjust,
  getExport,
} from '../../../api/member-amount-adjust'
import {
  getSiteListSimple,
  getSupportedCurrencyBySiteId,
} from '../../../api/site'
import { getReasonsSimple } from '../../../api/site-adjustment-reason'
import {
  findIdByLoginNames,
  findIdByLoginName,
  getMemberBalanceByLoginNameSite,
} from '../../../api/member'
import { useStore } from '../../../store'
import { ADMIN, TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { getConfigList } from '../../../api/config'
import { isCnySite } from "../../../utils/site";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const memberAmountAdjustForm = ref(null)
const importRefForm = ref(null)
const addAmountAdjustmentType = ref('NORMAL');
// const calculate = reactive({
//   deposit: 0,
// })
const isBtnLoading = ref(false)
const siteList = reactive({
  list: [],
})
const adjustTypeList = reactive({
  requestList: [],
  formList: [],
  importFormList: [],
})

const siteCurrencyConfig = reactive({
  supportMultiWallet: null,
  defaultCurrency: null,
})

const currencyList = reactive({
  currencyGroupList: [],
})

const adjustRollover = reactive({
  selectedItem: null,
  importedSelectedItem: null,
})

const shortcuts = getShortcuts(t)

const EXPORT_AMOUNT_ADJUST_LIST_HEADER = ['Login Name', 'Amount']

const IMPORT_AMOUNT_ADJUST_LIST_JSON = ['loginName', 'amount']



const uiControl = reactive({
  messageVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  rolloverType: [
    { key: 1, displayName: t('fields.rollOverAmt'), value: 'AMOUNT' },
    { key: 2, displayName: t('fields.rollOverMulti'), value: 'MULTIPLE' },
  ],
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE_ADD',
  editBtn: true,
  removeBtn: true,
  operationType: [
    { key: 1, displayName: 'ADD', value: 'ADD' },
    { key: 2, displayName: 'DEDUCT', value: 'DEDUCT' },
  ],
  addType: [
    { key: 1, displayName: t('fields.addNormalAmountAdjust'), value: 'NORMAL' },
    { key: 2, displayName: t('fields.addCalculateAmountAdjust'), value: 'CALCULATE' },
  ],
  importDialogVisible: false,
  balance: null,
  gameTypeRolloverTypes: [
    { key: 1, displayName: t('gameTypeRolloverSetting.anyTypes'), value: 'ALL_TYPES' },
    { key: 2, displayName: t('gameTypeRolloverSetting.specifyTypes'), value: 'SPECIFY_TYPES' },
    { key: 3, displayName: t('gameTypeRolloverSetting.excludeTypes'), value: 'EXCLUDE_TYPES' },
    { key: 4, displayName: t('gameTypeRolloverSetting.specifyGameType'), value: 'GAME_TYPE' },
  ],
  gameTypeRollover: [
    { key: 1, displayName: 'SLOT', value: 'slot' },
    { key: 2, displayName: 'LIVE', value: 'live' },
    { key: 3, displayName: 'FISH', value: 'fish' },
    { key: 4, displayName: 'SPORT', value: 'sport' },
    { key: 5, displayName: 'ESPORT', value: 'esport' },
    { key: 6, displayName: 'POKER', value: 'poker' },
    { key: 7, displayName: 'LOTTERY', value: 'lottery' },
    { key: 8, displayName: 'CASUAL', value: 'casual' },
  ],
  selectedGameTypeRolloverType: 'MULTIPLE',
  isNewRollover: true,
  oldRollOver: {
    rollover: 0,
    gameTypeRollover: null,
    gameLists: [],
    selectType: null
  },
  progress: 100
})

const gameTypes = ref([])
const selectedRolloverType = ref('MULTIPLE');

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalReimburse: 0,
  numberOfReimbursement: 0,
  totalDeduct: 0,
  numberOfDeduction: 0,
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  createTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  loginName: null,
  operationType: null,
  cause: null,
  createBy: null,
  reimburseAmount: null,
  sendSummary: null
})

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  loginName: null,
  amount: null,
  rollover: null,
  cause: null,
  remark: null,
  currency: null,
  sendSummary: null
})

const importForm = reactive({
  siteId: null,
  currency: null,
  cause: null,
  remark: null,
  rollover: null,
  gameTypeRollover: null
})

const list = reactive({
  vips: [],
  members: [],
  sites: [],
})


const selectionList = reactive({
  members: [],
})

const inputValue = ref('')
const dynamicTags = ref([])

const handleClose = tag => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  const selectionArr = [...selectionList.members]
  selectionArr.forEach(element => {
    if (element.value === tag) {
      list.members.splice(1, 0, element)
      list.members.sort(function (a, b) {
        return a.id - b.id
      })
      selectionList.members.splice(selectionList.members.indexOf(element), 1)
    }
  })
  inputValue.value = ''
}

const loginNameValidator = async (rule, value, callback) => {
  if (!form.siteId) {
    ElMessage({ message: t('message.validateSiteRequired'), type: 'error' })
    return;
  }

  let bal
  if (uiControl.dialogType === 'CREATE_DEDUCT') {
    const response = await getMemberBalanceByLoginNameSite(
      value,
      form.siteId,
      form.currency
    )
    bal = response.data

    if (bal === null || bal === undefined) {
      callback(new Error(t('message.memberNotInSite')))
    } else {
      uiControl.balance = bal
      callback()
    }
  } else {
    uiControl.balance = null
    const response = await getMemberBalanceByLoginNameSite(
      value,
      form.siteId,
      form.currency
    )
    bal = response.data

    if (bal === null || bal === undefined) {
      callback(new Error(t('message.memberNotInSite')))
    } else {
      callback()
    }
  }
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [
    required(t('message.validateLoginNameRequired')),
    { validator: loginNameValidator, trigger: 'blur' },
  ],
  amount: [required(t('message.validateAmountRequired'))],
  deposit: [required(t('message.validateDepositAmountRequired'))],
  rollover: computed(() =>
    uiControl.dialogType === 'CREATE_ADD' ? [required(t('message.validateRolloverRequired'))] : []
  ), // Use computed to make it reactive
  cause: [required(t('message.validateCauseRequired'))],
})

function validateField(field) {
  /* if (formRef.value) {
    formRef.value.validateField(field);
  } */
}

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  cause: [required(t('message.validateCauseRequired'))],
})

function handleRadioChange(value) {
  if (value === 'CALCULATE') {
    selectedRolloverType.value = 'MULTIPLE'
  }
  // Perform your desired action here
  // Example: calling an API, updating state, etc.
}
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date(Date.now() + 3600 * 1000 * 24))
        .subtract(2, 'months')
        .startOf('month')
        .format('x') ||
    time.getTime() > new Date(Date.now() + 3600 * 1000 * 24).getTime()
  )
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
  request.siteId = store.state.user.siteId
  form.siteId = store.state.user.siteId
  importForm.siteId = store.state.user.siteId
}

async function loadFormSelect() {
  form.loginName = null
  form.cause = null
  form.currency = null
  uiControl.balance = null
  siteCurrencyConfig.supportMultiWallet = null
  siteCurrencyConfig.defaultCurrency = null
  await loadCauseBySiteId()
  await loadSiteConfig()
}

async function loadFormImportSelect() {
  siteCurrencyConfig.supportMultiWallet = null
  siteCurrencyConfig.defaultCurrency = null
  await loadImportSiteConfig()
}

async function loadCauseBySiteId() {
  if (request.siteId) {
    const { data: adjustType } = await getReasonsSimple(request.siteId)
    adjustTypeList.requestList = adjustType

    if (form.siteId === request.siteId) {
      adjustTypeList.formList = adjustType
    }else if(form.siteId){
      const { data: adjustType2 } = await getReasonsSimple(form.siteId)
      adjustTypeList.formList = adjustType2
    }

    if (importForm.siteId === request.siteId) {
      adjustTypeList.importFormList = adjustType
    }else if(importForm.siteId){
      const { data: adjustType3 } = await getReasonsSimple(importForm.siteId)
      adjustTypeList.importFormList = adjustType3
    }

  }




}

async function loadSiteConfig() {
  getSiteConfig(form.siteId)
}

async function loadImportSiteConfig() {
  getSiteConfig(importForm.siteId)
}
const isAffiliateUser = ref(false)
const handleSelect = item => {
  if (item) {
    if (item.ref === 'AFFILIATE' || uiControl.dialogType === 'CREATE_DEDUCT') {
      isAffiliateUser.value = true
      form.rollover = 0
    }else{
      isAffiliateUser.value = false;
      form.rollover = undefined
    }
    // Clear previous selections
    dynamicTags.value = []
    selectionList.members = []

    // Push the new selected item
    dynamicTags.value.push(item.value)
    const removed = list.members.splice(list.members.indexOf(item), 1)
    const removedArr = [...removed]
    selectionList.members.push(removedArr[0])

    // Reset input
    inputValue.value = ''
    form.loginName = item.value;
  }

  inputValue.value = ''
}

const cachedGameTypes = ref([]);
const cachedUIAmt = ref([]);
const checkRolloverType = () => {
  if (selectedRolloverType.value === 'MULTIPLE') {
    cachedUIAmt.value = form.rollover
    if (form.rollover > 100) {
      form.rollover = 100
    } else {
      form.rollover = undefined
    }
    cachedGameTypes.value = gameTypes.value.map(type => ({ ...type }));
    gameTypes.value.forEach(type => {
      if (type.value > 100) {
        type.value = 100;
      }
    });
  } else {
    // gameTypes.value = cachedGameTypes.value.map(type => ({ ...type }));
    if (cachedGameTypes.value.length > 0) {
      gameTypes.value = cachedGameTypes.value.map(type => ({ ...type }));
    }
    if (cachedUIAmt.value) {
      form.rollover = cachedUIAmt.value
    }
  }
}
function delRollover(index) {
  gameTypes.value.splice(index, 1)
}
function compareOldGameLists () {
  if (uiControl.oldRollOver.gameLists.length !== gameTypes.value.length) {
    return false;
  }
  if (JSON.stringify(uiControl.oldRollOver.gameLists) !== JSON.stringify(gameTypes.value)) {
    return false;
  }
  return true;
}
function constructRollover() {
  // debugger;
  if (uiControl.isNewRollover === false && uiControl.oldRollOver.rollover === form.rollover &&
      (!uiControl.oldRollOver.gameLists.length || (uiControl.oldRollOver.gameLists.length && compareOldGameLists())) &&
      (!uiControl.oldRollOver.selectType || (uiControl.oldRollOver.selectType === uiControl.selectedGameTypeRolloverType))
  ) {
    form.rollover = form.rollover;
    return JSON.stringify(uiControl.oldRollOver.gameTypeRollover);
  }
  const json = { newRollover: true };
  if (uiControl.selectedGameTypeRolloverType === 'GAME_TYPE') {
    json.rolloverType = 'INDIVIDUAL_' + selectedRolloverType.value + '_SPECIFY_TYPES'
    if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
    json.rolloverType = 'INDIVIDUAL_AMOUNT_SPECIFY_TYPES'
    }
    Object.values(gameTypes.value).forEach(item => {
      if (item.key) {
        if (!item.originalValue) {
          item.originalValue = { ...item }; // Deep clone the entire item for safekeeping
        }
        if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
          // Calculate the rollover for each game type
          const amount = +form.amount || 0; // Assuming item.value has an amount
          const deposit = +form.deposit || 0;
          const rolloverMultiplier = item.value || 1;
          console.log(amount)
          console.log(deposit)
          console.log(rolloverMultiplier)
          // Calculate the new rollover value
          const calculatedRollover = (amount + deposit) * rolloverMultiplier - deposit;
          console.log(calculatedRollover)
          json[item.key] = calculatedRollover;
        } else {
          json[item.key] = item.value;
        }
      }
    });
  } else {
    json.rolloverType = 'TOTAL_' + selectedRolloverType.value + '_' + uiControl.selectedGameTypeRolloverType
    if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
      json.rolloverType = 'TOTAL_AMOUNT_' + uiControl.selectedGameTypeRolloverType
      json.rollover = calculateRollover()
    } else {
      json.rollover = form.rollover
    }
    const excludeTypes = [];
    Object.values(gameTypes.value).forEach(item => {
      if (item.key) {
        excludeTypes.push(item.key);
      }
    });

    json.gameTypes = excludeTypes;
  }

  if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
    form.rollover = typeof form.rollover === 'number' ? calculateRollover() : 1
  } else {
    form.rollover = typeof form.rollover === 'number' ? form.rollover : 1;
  }
  return JSON.stringify(json)
}

const debouncedFetchSuggestions = debounce((queryString, callback) => {
  if (!form.siteId) {
    ElMessage({ message: t('message.validateSiteRequired'), type: 'error' })
    return;
  }
  querySearch(queryString, callback);
}, 1500); // Adjust debounce time as needed


const querySearch = async (queryString, callback) => {
  if (!queryString) {
    callback();
    return;
  } else if (queryString.length < 3) {
    callback();
    return;
  }

  try {
    const { data: ret } = await getMemberLoginNameList(form.siteId, queryString);

    const results = ret.map(item => ({
      value: item.value,
      id: item.id,
      ref: item.ref
    }));
    callback(results);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    callback();
  }
}

async function getSiteConfig(siteId) {
  const { data: fiatResponse } = await getConfigList('fiat_wallet', siteId)
  const fiatConfig = fiatResponse[0] ? fiatResponse[0].value : null

  const { data: multiWalletResponse } = await getConfigList(
    'support_multi_wallet',
    siteId
  )
  const multiWalletConfig = multiWalletResponse[0]
    ? multiWalletResponse[0].value
    : null

  if (multiWalletConfig === 'OPEN') {
    siteCurrencyConfig.supportMultiWallet = multiWalletConfig
    const { data: currencyResponse } = await getSupportedCurrencyBySiteId(
      siteId
    )
    if (currencyResponse) {
      currencyList.currencyGroupList = [
        ...new Set(
          currencyResponse
            .filter(currency => currency && currency.currencyGroup)
            .map(currency => currency.currencyGroup)
        ),
      ]
    }
    siteCurrencyConfig.defaultCurrency = fiatConfig
    if (form.currency === null) {
      form.currency = fiatConfig
    }
  } else {
    siteCurrencyConfig.defaultCurrency = fiatConfig
    form.currency = fiatConfig
  }
}

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate]
  request.siteId = store.state.user.siteId
  request.loginName = null
  request.operationType = null
  request.cause = null
  request.createBy = null
  request.reimburseAmount = null
  request.sendSummary = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime[0] = formatInputTimeZone(
        query.createTime[0],
        timeZone,
        'start'
      )
      query.createTime[1] = formatInputTimeZone(
        query.createTime[1],
        timeZone,
        'end'
      )
      query.createTime = query.createTime.join(',')
    }
    if (request.reimburseAmount !== null) {
      query.reimburseAmount = request.reimburseAmount
    }
  }

  return query
}

async function loadMemberAmountAdjust() {
  page.loading = true
  page.totalReimburse = 0
  page.totalDeduct = 0
  page.numberOfReimbursement = 0
  page.numberOfDeduction = 0
  const query = checkQuery()
  try {
    const { data: ret } = await getMemberAmountAdjust(query)
    page.pages = ret.pages
    page.records = ret.records
    page.total = ret.total
    if (page.records.length !== 0) {
      const { data: noOfReimburse } = await getNumberOfReimburse(query)
      const { data: noOfDeduct } = await getNumberOfDeduct(query)
      if (noOfReimburse > 0) {
        const { data: reimburseAmount } = await getTotalReimburseAmount(query)
        page.numberOfReimbursement = noOfReimburse
        page.totalReimburse = reimburseAmount
      }
      if (noOfDeduct > 0) {
        const { data: deductAmount } = await getTotalDeductionAmount(query)
        page.numberOfDeduction = noOfDeduct
        page.totalDeduct = deductAmount
      }
    }
    page.loading = false
  }catch(error){
    page.loading = false
  }
}

async function showDialog(type) {
  addAmountAdjustmentType.value = 'NORMAL'
  if (type === 'CREATE_ADD') {
    if (memberAmountAdjustForm.value) {
      memberAmountAdjustForm.value.resetFields()
      adjustRollover.importedSelectedItem = null
      adjustRollover.selectedItem = null
      form.rollover = undefined
    }
    form.rollover = undefined
    form.sendSummary = null
    uiControl.dialogTitle = t('fields.addMemberAmountAdjust')
  } else if (type === 'CREATE_DEDUCT') {
    if (memberAmountAdjustForm.value) {
      memberAmountAdjustForm.value.resetFields()
      adjustRollover.importedSelectedItem = null
      adjustRollover.selectedItem = null
    }
    form.rollover= 0;
    uiControl.balance = null
    form.sendSummary = null
    uiControl.dialogTitle = t('fields.deductMemberAmountAdjust')
  }
  await loadFormSelect()
  uiControl.dialogType = type
  uiControl.dialogVisible = true
  uiControl.selectedGameTypeRolloverType = null
  gameTypes.value = []
  addRollover()
}
async function showImportDialog() {
  uiControl.importDialogVisible = true
  uiControl.selectedGameTypeRolloverType = null
  gameTypes.value = []
  addRollover()
}
function addRollover() {
  gameTypes.value.push({
    key: '',
    value: '',
  })
}
function handleCauseChange(selectedValue) {
  const selectedItem = adjustTypeList.formList.find(
    item => item.reason === selectedValue
  )
  // if (selectedItem) {
  //   adjustRollover.selectedItem = selectedItem.rollover
  //   form.rollover = selectedItem.rollover
  // }
}

function handleImportCauseChange(selectedValue) {
  const selectedItem = adjustTypeList.formList.find(
    item => item.reason === selectedValue
  )
  if (selectedItem) {
    adjustRollover.importedSelectedItem = selectedItem.rollover
    importForm.rollover = selectedItem.rollover
  }
}

async function handleBalanceType(value) {
  let bal
  if (uiControl.dialogType === 'CREATE_DEDUCT') {
    const response = await getMemberBalanceByLoginNameSite(
      form.loginName,
      form.siteId,
      value
    )
    bal = response.data

    if (bal === null || bal === undefined) {
      uiControl.balance = null
    } else {
      uiControl.balance = bal
    }
  }
}
function calculateRollover(item) {
  if (!form.amount || !form.deposit) {
    return undefined
  }
  const amount = +form.amount || 0;
  const deposit = +form.deposit || 0;
  if (item) {
    const multi = +item || 1
    return ((amount + deposit) * multi) - deposit;
  } else {
    const multi = form.rollover || 1;
    return ((amount + deposit) * multi) - deposit;
  }

}
function createAdd() {
  const originalDeposit = form.deposit;
  const originalRollover = form.rollover;

  memberAmountAdjustForm.value.validate(async valid => {
    isBtnLoading.value = true;
    form.id = null;
    form.memberId = null;

    try {
      if (valid) {
        const { data: id } = await findIdByLoginName(form.loginName, form.siteId);
        form.memberId = id;

        if (isAffiliateUser.value === true) {
          form.rollover = 0;
          form.gameTypeRollover = null;
        } else {
          form.gameTypeRollover = constructRollover();
        }

        delete form.deposit;
        delete form.rollover;
        await createAddMemberAmountAdjust(form);
        uiControl.dialogVisible = false;
        await loadMemberAmountAdjust();
        ElMessage({ message: t('message.addSuccess'), type: 'success' });
      }
    } catch (error) {
      form.deposit = originalDeposit;
      form.rollover = originalRollover;
      console.log(error);
    } finally {
      isBtnLoading.value = false;
    }
  });
}
function createDeduct() {
  memberAmountAdjustForm.value.validate(async valid => {
    isBtnLoading.value = true;
    try {
      form.id = null;
      form.memberId = null;
      const { data: id } = await findIdByLoginName(form.loginName, form.siteId);
      form.memberId = id;

      if (isAffiliateUser.value === true) {
        form.rollover = 0;
        form.gameTypeRollover = null;
      } else {
        form.gameTypeRollover = constructRollover();
      }

      if (valid) {
        await createDeductMemberAmountAdjust(form);
        uiControl.dialogVisible = false;
        await loadMemberAmountAdjust();
        ElMessage({ message: t('message.addSuccess'), type: 'success' });
      }
    } catch (error) {
      console.error('Error during createDeduct:', error);
    } finally {
      isBtnLoading.value = false;
    }
  });
}
async function downloadTemplate() {
  const exportAmountAdjust = [EXPORT_AMOUNT_ADJUST_LIST_HEADER]
  const maxLengthAdmountAdjust = []
  const wsAmountAdjust = XLSX.utils.aoa_to_sheet(exportAmountAdjust)
  setWidth(exportAmountAdjust, maxLengthAdmountAdjust)
  const wsAdmountAdjustCols = maxLengthAdmountAdjust.map(w => {
    return { width: w }
  })
  wsAmountAdjust['!cols'] = wsAdmountAdjustCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Member_Amount_Adjust')
  wb.Sheets.Member_Amount_Adjust = wsAmountAdjust
  XLSX.writeFile(wb, 'member_amount_adjust.xlsx')
}

/* eslint-disable */
function setWidth(exportData, maxLength) {
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key]
      maxLength[key] =
        typeof value === 'number'
          ? maxLength[key] >= 10
            ? maxLength[key]
            : 10
          : maxLength[key] >= value.length + 2
          ? maxLength[key]
          : value.length + 2
    })
  })
}

function chooseFile() {
  document.getElementById('importFile').click()
}

function importToTable(file) {
  importedPage.loading = true
  importedPage.buttonLoading = false
  const files = file.target.files[0]
  const allowFileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (allowFileType.find(ftype => ftype.includes(files.type))) {
    const fileReader = new FileReader()

    fileReader.onload = async event => {
      const { result } = event.target
      const workbook = XLSX.read(result, { type: 'binary' })
      let data = []
      for (const sheet in workbook.Sheets) {
        data = data.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: IMPORT_AMOUNT_ADJUST_LIST_JSON,
            range: 1,
          })
        )
        uiControl.progress = 0
        for (let i = 0; i < data.length; i += 50) {
          const sublist = data.slice(i, i + 50)
          const chunk = sublist.map(d => d.loginName).join(',')
          const { data: result} = await findIdByLoginNames(
            chunk,
            importForm.siteId
          )
          for (let j = i; j < i + sublist.length; j++) {
            data[j].memberId = result[data[j].loginName]
            uiControl.progress = Math.round(
              ((j + 1) / data.length) * 100
            )
          }
        }
      }
      importedPage.records = data
      importedPage.pages = Math.ceil(
        importedPage.records.length / importedPage.size
      )
    }
    fileReader.readAsBinaryString(files)
    document.getElementById('importFile').value = ''
  } else {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  }
  importedPage.loading = false
}

function changeImportedPage(page) {
  importedPage.current = page
}

function clearImport() {
  uiControl.importDialogVisible = false
  importedPage.buttonLoading = false
  importedPage.loading = false
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
  importForm.cause = null
}

async function confirmImport() {
  importedPage.buttonLoading = true
  importRefForm.value.validate(async valid => {
    if (valid) {
      const recordCopy = importedPage.records.filter(record => record.memberId !== '-1')
      const data = []
      Object.entries(recordCopy).forEach(([key, value]) => {
        const item = {}
        if (value) {
          item.cause = importForm.cause
          item.currency = importForm.currency
          item.siteId = importForm.siteId
          item.remark = importForm.remark
          Object.entries(value).forEach(([k, v]) => {
            if (k !== 'loginName') {
              item[k] = v
            }
          });

          item.gameTypeRollover= constructRollover();

        }
        data.push(item)
      })

      const records = [...data]
      do {
        if (records.length > 10000) {
          await createBatchAmountAdjust(records.slice(0, 10000))
          records.splice(0, 10000)
        } else {
          await createBatchAmountAdjust(records)
          records.splice(0, records.length)
        }
      } while (records.length > 0)
      ElMessage({ message: t('message.importSuccess'), type: 'success' })
      clearImport()
      loadMemberAmountAdjust()
      importForm.cause = null
      importForm.currency = null
    }
    importedPage.buttonLoading = false
  })
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (form.amount !== null && form.amount.toString().indexOf('.') > -1) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

// async function populateMemberBalance() {
//   if (uiControl.dialogType === 'CREATE_DEDUCT') {
//     const { data: bal } = await getMemberBalanceByLoginNameSite(form.loginName, form.siteId);
//     uiControl.balance = bal;
//   } else {
//     uiControl.balance = null;
//   }
// }

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadCauseBySiteId()
  await loadMemberAmountAdjust()
  // await loadSiteConfig()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-box {
  background: white;
  padding: 20px 40px;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
}
</style>

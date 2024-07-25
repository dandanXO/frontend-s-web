<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="transaction-container">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("transit.transitRecord") }}</span>
    </div>
    <div class="account-content transit">
      <el-tabs v-model="recordActive" @tab-click="searchRecord" type="card">
        <el-tab-pane name="deposit" :label="$t('transit.deposit')">
          <div>
            <el-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.deposit.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.deposit.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item class="search">
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table :data="dataState.deposit" v-loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.deposit"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'depositDate'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.depositDate }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'status'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getDepositStatus(scope.row.status) }}
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'paymentType'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getDepositType(scope.row.paymentType) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'operation'" #default="scope">
                  <template v-if="scope.row.status === 'PENDING'">
                    <div style="display: flex; align-items: center">
                      <el-button size="small" class="common-btn" @click="openReminder(scope.row)">
                        {{ $t("transit.remind") }}asd
                      </el-button>
                    </div>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="turnover" :label="$t('transit.turnover')">
          <div>
            <el-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.turnover.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.turnover.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <div class="unbind-record-wrapper">
            <el-table :data="dataState.turnover" v-loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.turnover"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'platform'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getPlatform(scope.row.platform) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'subType'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getSubType(scope.row.subType, scope.row.type) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'platformCode'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getPlatform(scope.row.platformCode) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            /> -->
          </div>
        </el-tab-pane>
        <el-tab-pane name="withdraw" :label="$t('transit.withdraw')">
          <div>
            <el-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.withdraw.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.withdraw.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.withdraw"
              :datel-source="dataState.withdraw"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #withdrawDate="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </el-table> -->

            <el-table :data="dataState.withdraw" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.withdraw"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'status'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ getWithdrawStatus(scope.row.status) }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'operation'" #default="scope">
                  <template v-if="scope.row.status === 'STEP_1'">
                    <div style="display: flex; align-items: center">
                      <el-button size="small" class="common-btn" @click="openReminder(scope.row)">
                        {{ $t("account.reminder") }}
                      </el-button>
                    </div>
                  </template>

                  <template v-if="scope.row.status === 'APPLY' || scope.row.status === 'STEP_2'">
                    <div style="display: flex; align-items: center">
                      <el-button
                        size="small"
                        color="red"
                        class="common-btn cancel"
                        @click="openWithdrawCancel(scope.row)"
                      >
                        {{ $t("common.cancel") }}
                      </el-button>
                    </div>
                  </template>

                  <template
                    v-if="
                      scope.row.status === 'SUCCESS' &&
                      (scope.row.currencyName === 'CNY' || scope.row.currencyName === 'AliCNY') &&
                      scope.row.confirmStatus === 0
                    "
                  >
                    <div style="display: flex; align-items: center">
                      <el-button size="small" class="common-btn" @click="openWithdrawConfirm(scope.row)">
                        {{ $t("account.confirm_deposit") }}
                      </el-button>
                    </div>
                  </template>
                </template>
              </el-table-column>
            </el-table>

            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane name="transfer" :label="$t('transit.transfer')">
          <div>
            <el-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.transfer.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.transfer.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table :data="dataState.transfer" v-loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.transfer"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'platform'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getPlatform(scope.row.platform) }}
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'type'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getTransferChangeType(scope.row.type) }}
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'status'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getTransferType(scope.row.status) }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane> -->
        <el-tab-pane name="rebates" :label="$t('transit.rebates')">
          <div>
            <el-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.rebates.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.rebates.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table :data="dataState.rebates" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.rebates"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-table
              :columns="tableColumns.rebates"
              :datel-source="dataState.rebates"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </el-table>-->
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="gameBetRecord" :label="$t('transit.gameBetRecord')">
          <div class="payout-total">
            <div>{{ $t("transit.totalBet") }}: {{ totalBetRecord.totalBet }}</div>
            <div>{{ $t("transit.totalPayout") }}: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <el-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <el-form-item :label="$t('transit.platform')">
                  <el-select
                    clearable
                    style="width: 200px"
                    v-model="searchForm.gameBetRecord.platform"
                    :placeholder="$t('transit.platform')"
                    @change="searchRecord"
                    value-key="code"
                  >
                    <el-option key="" :label="`-${$t('transit.allPlatform')}-`" value="">-</el-option>
                    <el-option
                      v-for="p in platformsList"
                      :key="p.code"
                      :label="getPlatform(p.code)"
                      :value="p.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.gameBetRecord.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.gameBetRecord.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.gameBetRecord"
              :datel-source="dataState.gameBetRecord"
              :row-key="(record) => record.gameType"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
            </el-table> -->

            <el-table :data="dataState.gameBetRecord" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.gameBetRecord"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'betTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ getFormatBetTime(scope.row.betTime) }}</span>
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'platform'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getPlatform(scope.row.platform) }}
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'bet'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span v-if="scope.row.bet !== null">
                      {{ scope.row.bet }}
                    </span>
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'payout'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span v-if="scope.row.payout !== null">
                      {{ scope.row.payout }}
                    </span>
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'gameType'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getGameType(scope.row.gameType) }}
                  </div>
                </template>
                <template v-if="tbl.dataIndex === 'status'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getBetStatus(scope.row.status) }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="reminderRecord" :label="$t('transit.reminderRecord')">
          <div>
            <el-form layout="inline" :model="searchForm.reminderRecord">
              <div class="left">
                <el-form-item :label="$t('common.startDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.reminderRecord.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item :label="$t('common.endDate')">
                  <el-date-picker
                    :clearable="false"
                    v-model="searchForm.reminderRecord.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">
                    {{ $t("common.search") }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table :data="dataState.reminderRecord" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.reminderRecord"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'type'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.type === 1 ? $t("status.deposit") : $t("status.withdraw") }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- <el-modal
        width="90%"
        v-model:visible="betRecordDialog"
        :maskClosable="false"
        :closable="true"
        :footer="null"
      >
        <div class="modal-head-title">บันทึกการเดิมพัน</div>
        <el-table
          :columns="tableColumns.betRecord"
          :datel-source="dataState.betRecord"
          :row-key="(record) => record.betId"
          :loading="loading"
          :pagination="betPagination"
          @change="recordBetPage"
        >
        </el-table>
      </el-modal> -->

      <!-- <el-modal
        width="90%"
        v-model:visible="reminderRecordDialog"
        :maskClosable="false"
        :closable="true"
        :footer="null"
      >
        <div class="modal-head-title">催单</div>
        <div>record thing here</div>
      </el-modal> -->

      <el-dialog
        v-model="reminderDialog"
        :title="$t('account.reminder')"
        width="50%"
        align-center
        style="max-width: 800px"
        :before-close="clearItems"
      >
        <span>
          <el-form
            ref="formRef"
            :model="reminderForm"
            :hide-required-mark="true"
            name="basic"
            autocomplete="off"
            label-width="110"
            label-suffix=":"
            style="width: 100%; max-width: 400px; margin: 0px auto 0px; padding-top: 50px; padding-bottom: 50px"
          >
            <el-form-item tabindex="1" :label="$t('account.str_serial_number')" prop="serialNumber">
              <el-input v-model="reminderForm.orderNo" :placeholder="$t('account.str_serial_number')" disabled />
            </el-form-item>

            <el-form-item :label="$t('account.select_image')" prop="photos">
              <FileUpload @photo-response="getImageLink" ref="uploadFileRef" />
            </el-form-item>

            <el-form-item :label="$t('account.str_remark')" prop="remarks">
              <el-input
                type="textarea"
                v-model="reminderForm.memberRemark"
                :placeholder="$t('account.str_remark')"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </el-form-item>

            <el-button
              size="large"
              color="#3bafda"
              class="common-btn"
              style="margin-left: 110px"
              :loading="loadingBtn"
              @click="submitReminder()"
            >
              {{ $t("account.submit") }}
            </el-button>
          </el-form>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, watch, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  loadRecords,
  gameBetRecordTotal,
  saveFinanceFeedback,
  getVerifyingFeedbackCount,
  financeFeedbackList,
  confirmationOfWithdrawalReceived,
  cancellationOfWithdrawalReceived
} from "@/api/personal/personal";
import moment from "moment";
import { getPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import FileUpload from "@/components/FileUpload.vue";
import EmptyData from "@/components/emptyData.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { i18nStore } from '@/store/language'
import { storeToRefs } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export default defineComponent({
  components: {
    EmptyData,
    FileUpload
  },
  name: "TransitRecordView",
  setup() {

    const { t } = useI18n();

    const loadingBtn = ref(false);
    const store = userStore();
    const uploadFileRef = ref();
    const recordActive = ref("deposit");
    const reminderForm = reactive({});
    const totalBetRecord = reactive({
      totalBet: 0,
      totalPayout: 0
    });
    const searchForm = reactive({
      turnover: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10,
        pagingState: null
      },
      rebates: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10
      },
      transfer: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10
      },
      withdraw: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10
      },
      deposit: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10
      },
      gameBetRecord: {
        startDate: "",
        endDate: "",
        platform: "",
        memberId: store.id,
        current: 1,
        size: 10,
        pagingState: null
      },
      betRecord: {
        platform: "",
        gameType: "",
        memberId: store.id,
        current: 1,
        size: 10
      },
      reminderRecord: {
        startDate: "",
        endDate: "",
        current: 1,
        size: 10
      }
    });
    const dataState = reactive({
      deposit: [],
      rebates: [],
      transfer: [],
      withdraw: [],
      turnover: [],
      betRecord: [],
      gameBetRecord: [],
      reminderRecord: []
    });
    const commonColumns = [
      {
        title: t('transit.serialNo'),
        dataIndex: "serialNumber",
        key: "serialNumber"
      }
    ];
    const tableColumns = ref({
      deposit: [
        ...commonColumns,
        {
          title: t('transit.depositAmount'),
          dataIndex: "depositAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        },
        {
          title: t('transit.paymentType'),
          dataIndex: "paymentType"
        },
        {
          title: t('transit.depositDate'),
          dataIndex: "depositDate",
          slots: { customRender: "depositDate" }
        },
        {
          title: t('transit.operation'),
          dataIndex: "operation",
          slots: { customRender: "operation" }
        }
      ],
      withdraw: [
        ...commonColumns,
        {
          title: t('transit.withdrawAmount'),
          dataIndex: "withdrawAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        },
        {
          title: t('transit.withdrawDate'),
          dataIndex: "withdrawDate",
          slots: { customRender: "withdrawDate" }
        },
        {
          title: t('transit.operation'),
          dataIndex: "operation",
          slots: { customRender: "operation" }
        }
      ],
      transfer: [
        ...commonColumns,
        {
          title: t('transit.type'),
          dataIndex: "type",
          key: "type",
          slots: { customRender: "type" }
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform",
          key: "platform"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount",
          key: "withdrawAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status",
          key: "status",
          slots: { customRender: "status" }
        },
        {
          title: t('transit.time'),
          dataIndex: "transferDate",
          key: "transferDate",
          slots: { customRender: "transferDate" }
        }
      ],
      rebates: [
        ...commonColumns,
        {
          title: t('transit.privilegeName'),
          dataIndex: "privilegeName"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount"
        },
        {
          title: t('transit.recordTime'),
          dataIndex: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      turnover: [
        ...commonColumns,
        {
          title: t('transit.subType'),
          dataIndex: "subType"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount"
        },
        {
          title: t('transit.platform'),
          dataIndex: "platformCode"
        },
        {
          title: t('transit.recordTime'),
          dataIndex: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      gameBetRecord: [
        {
          title: t('transit.betTime'),
          dataIndex: "betTime",
          slots: { customRender: "betTime" }
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform"
        },
        {
          title: t('transit.bet'),
          dataIndex: "bet"
        },
        {
          title: t('transit.payout'),
          dataIndex: "payout"
        },
        {
          title: t('transit.gameType'),
          dataIndex: "gameType"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        }
      ],
      betRecord: [
        {
          title: t('transit.betId'),
          dataIndex: "betId"
        },
        {
          title: t('transit.transactionId'),
          dataIndex: "transactionId"
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform"
        },
        {
          title: t('transit.bet'),
          dataIndex: "bet"
        },
        {
          title: t('transit.payout'),
          dataIndex: "payout"
        },
        {
          title: t('transit.beforeBalance'),
          dataIndex: "beforeBalance"
        },
        {
          title: t('transit.afterBalance'),
          dataIndex: "afterBalance"
        },
        {
          title: t('transit.betStatus'),
          dataIndex: "betStatus"
        },
        {
          title: t('transit.gameType'),
          dataIndex: "gameType"
        },
        {
          title: t('transit.betTime'),
          dataIndex: "betTime",
          slots: { customRender: "betTime" }
        },
        {
          title: t('transit.settleTime'),
          dataIndex: "settleTime",
          slots: { customRender: "settleTime" }
        },
        {
          title: t('transit.result'),
          dataIndex: "result"
        },
        {
          title: t('transit.sportBetResult'),
          dataIndex: "sportBetResult"
        }
      ],
      reminderRecord: [
        {
          title: t('transit.orderNo'),
          dataIndex: "orderNo"
        },
        {
          title: t('transit.financeRemark'),
          dataIndex: "financeRemark"
        },
        {
          title: t('transit.feedbackTime'),
          dataIndex: "feedbackTime",
          slots: { customRender: "feedbackTime" }
        },
        {
          title: t('transit.type'),
          dataIndex: "type",
          slots: { customRender: "type" }
        }
      ]
    });
    const loading = ref(false);
    const pagination = reactive({
      pageSize: 20,
      total: 0,
      pagingState: ""
    });
    const betPagination = reactive({
      pageSize: 20,
      total: 0,
      pagingState: ""
    });
    const searchRecord = (tab) => {
      // console.log(tab)
      console.log(searchForm[recordActive.value])
      if(!searchForm[recordActive.value]["startDate"] || !searchForm[recordActive.value]["endDate"]){
        ElMessage({
          message: t('transit.startEndDate'),
          type: "error"
        });
        return;
      }


      if (tab && tab.props && tab.props.name) {
        recordActive.value = tab.props.name;
      }
      // recordActive.value = key.props.name
      loading.value = true;
      if (recordActive.value === "gameBetRecord") {
        getPlatList(recordActive.value);
      } else if (recordActive.value === "reminderRecord") {
        financeFeedbackList(searchForm[recordActive.value]).then((response) => {
          if (response.code === 0) {
            pagination.total = response.data.total;
            const dataSource = dataState[recordActive.value];
            //clear array and then push new record
            dataSource.splice(0);
            dataSource.push(...response.data.records);
          } else {
            ElMessage.error(response.message)
          }
        });
        return;
      }

      if (recordActive.value === "turnover" || recordActive.value === "gameBetRecord") {
        if (searchForm[recordActive.value].current === 1) {
          searchForm[recordActive.value].pagingState = null;
        } else {
          searchForm[recordActive.value].pagingState = pagination.pagingState;
        }
      }
      if(recordActive.value === "gameBetRecord" && searchForm[recordActive.value].platform==='BBINDY'){
        searchForm[recordActive.value].platform = "BBIN"
      }
      loadRecords(recordActive.value, searchForm[recordActive.value]).then((response) => {
        if (response.code === 0) {
          pagination.total = response.data.total;
          if (recordActive.value === "turnover" || recordActive.value === "gameBetRecord") {
            pagination.pagingState = response.data.pagingState;
          }

          if(recordActive.value === 'gameBetRecord') {
            totalBetRecord.totalBet = response.data.sums.totalBet;
            totalBetRecord.totalPayout = response.data.sums.totalPayout;
          }

          const dataSource = dataState[recordActive.value];
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
          loading.value = false;
        } else {
          ElMessage.error(response.message);
          loading.value = false;
        }
      }).catch((error) => {
        console.log("error", error);
        // message.error( error.message, 4 );
      }).then(() => {
        loading.value = false;
      });
    };

    const recordPage = (pagination) => {
      searchForm[recordActive.value].current = pagination;
      searchRecord();
    };
    const recordBetPage = (pagination) => {
      searchForm.betRecord.current = pagination.current;
      if (pagination.current === 1) {
        searchForm.betRecord.pagingState = null;
      } else {
        searchForm.betRecord.pagingState = betPagination.pagingState;
      }
      betDetails(selectedBetRecord);
    };

    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate()) < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + "")
      };
      var useDate = newDate.Y + newDate.M + newDate.D;
      return useDate;
    };

    const getTime = () => {
      ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord", "reminderRecord"].forEach(function(v) {
        if (v in searchForm) {
          searchForm[v].startDate = chgDate(7);
          searchForm[v].endDate = chgDate(0);
          if (v === "gameBetRecord") {
            // 结束时间如果不跟开始时间一个月，则从当月1号开始
            if (moment(searchForm[v].startDate).format("YYYY-MM") !== moment(searchForm[v].endDate).format("YYYY-MM")) {
              searchForm[v].startDate = moment(searchForm[v].endDate).format("YYYY-MM") + "-01";
            }
          }
        }
      });
      searchRecord();
    };

    const route = useRoute();
    onMounted(() => {
      getTime();
    });
    const platformsList = ref([]);
    const getPlatList = (v) => {
      const startMonth = new Date(searchForm[v].startDate).getMonth();
      const endMonth = new Date(searchForm[v].endDate).getMonth();
      if (startMonth !== endMonth) {
        ElMessage.error(t('account.start_date_end_date_must_same'));
      }

      getPlatformList().then((ret) => {
        platformsList.value = ret;
      });

      // const obj = {
      //   memberId: searchForm.gameBetRecord.memberId,
      //   platform: searchForm.gameBetRecord.platform,
      //   startDate: searchForm.gameBetRecord.startDate,
      //   endDate: searchForm.gameBetRecord.endDate
      // };
      // gameBetRecordTotal(obj).then((ret) => {
      //   if (ret.code === 0) {
      //     totalBetRecord.totalBet = ret.data.totalBet;
      //     totalBetRecord.totalPayout = ret.data.totalPayout;
      //   } else {
      //     ElMessage.error(ret.message);
      //   }
      // });

    };

    const selectedBetRecord = ref({});
    const betRecordDialog = ref(false);
    const reminderDialog = ref(false);
    const clearItems = (done) => {
      uploadFileRef.value.clear();
      done();
    };
    const openReminder = (record) => {
      getVerifyingFeedbackCount().then((res) => {
        if (res.code === 0) {
          if (res.data < 3) {
            reminderDialog.value = true;
            reminderForm.orderNo = record.serialNumber;
            reminderForm.photos = null;
            reminderForm.memberRemark = "";
            if (recordActive.value === "deposit") {
              reminderForm.type = 1;
              reminderForm.recordTime = moment(record.depositDate).format("YYYY-MM-DD HH:mm:ss");
            } else if (recordActive.value === "withdraw") {
              reminderForm.type = 2;
              reminderForm.recordTime = moment(record.withdrawDate).format("YYYY-MM-DD HH:mm:ss");
            }
          } else {
            ElMessage.error(t('account.cannot_submit_new_reminder'));
          }
        } else {
          ElMessage.error(res.message);
        }
      });
    };
    const openWithdrawConfirm = (record) => {
      const obj = {
        id: record.id,
        withdrawDate: record.withdrawDate
      };
      confirmationOfWithdrawalReceived(obj).then((res) => {
        if (res.code === 0) {
          ElMessageBox.alert(t('bankError.depositConfirmed'), {
            // if you want to disable its autofocus
            // autofocus: false,
            title: t('common.areyousure'),
            center: true,
            confirmButtonText: t('common.confirm'),
            showClose: false,
            buttonSize: "large"
          }).then(() => {
            getTime();
          });
        } else {
          ElMessage.error(res.message);
        }
      });
    };

    const openWithdrawCancel = (record) => {
      const obj = {
        id: record.id,
        withdrawDate: record.withdrawDate
      };
      cancellationOfWithdrawalReceived(obj).then((res) => {
        if (res.code === 0) {
          ElMessageBox.alert(t('bankError.withdrawCancelled'), {
            title: t('common.systemError'),
            center: true,
            confirmButtonText: t('common.confirm'),
            showClose: false,
            buttonSize: "large"
          }).then(() => {
            getTime();
          });
        }
      });
    };
    const submitReminder = () => {
      loadingBtn.value = true;
      if (!reminderForm.photos) {
        ElMessage.warning(
          t("account.please_upload_image")
        );
      } else {
        console.log(reminderForm);
        saveFinanceFeedback(reminderForm).then((res) => {
          if (res.code === 0) {
            ElMessage.success(t('account.upload_success'));
            reminderDialog.value = false;
            formRef.value.resetFields();
            uploadFileRef.value.clear();
          } else {
            ElMessage.error(res.message);
          }
        });
      }
      loadingBtn.value = false;
    };
    const betDetails = (record) => {
      dataState.betRecord = [];
      selectedBetRecord.value = record;
      const obj = {
        platform: record.platform,
        betTime: moment(record.betTime).format("YYYY-MM-DD"),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
        size: searchForm.betRecord.size,
        pagingState: searchForm.betRecord.pagingState
      };
      loadRecords("betRecord", obj).then((response) => {
        if (response.code === 0) {
          betPagination.total = response.data.total;
          betRecordDialog.value = true;
          betPagination.pagingState = response.data.pagingState;
          // dataState.betRecord = response.data.records
          dataState.betRecord.push(...response.data.records);
        } else {
          ElMessage.error(response.message);
        }
      });
    };

    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value;
    const getImageLink = (linkId) => {
      // reminderForm.photos = linkId;
      reminderForm.photos = imgURL + "/" + linkId;
    };

    const getTurnoverType = (turnoverType) => {
      if (!turnoverType) {
        return "";
      }
      if (turnoverType === "WITHDRAW_FAIL") {
        return t('status.withdrawFailed'); // Fail Withdrawal
      } else if (turnoverType === "WITHDRAW") {
        return t('status.withdraw'); // Withdraw
      } else if (turnoverType === "PROMO") {
        return t('status.promotion'); // 优惠
      } else if (turnoverType === "DEPOSIT") {
        return t('status.deposit'); //
      } else if (turnoverType === "TRANSFER") {
        return t('status.transfer'); // 转账
      } else if (turnoverType === "ADJUST") {
        return t('status.adjustment'); // 账变
      } else {
        return turnoverType;
      }
    };
    const getTransferType = (transferType) => {
      if (!transferType) {
        return "";
      }
      if (transferType === "APPLY") {
        return t('status.applying') //Applying
      } else if (transferType === "FAIL") {
        return t('status.failed') // Failed
      } else if (transferType === "SUCCESS") {
        return t('status.success'); // Success
      } else if (transferType === "STEP_1" || transferType === "PENDING") {
        return t('status.underReview'); //Under review
      } else if (transferType === "STEP_2") {
        return t('status.toBePaid'); // To be paid
      } else if (transferType === "STEP_3") {
        return t('status.normalPayment'); // Payment on going
      } else if (transferType === "STEP_4") {
        return t('status.automaticPayment'); // Automatic Payment
      } else if (transferType === "STEP_5") {
        return t('status.suspend'); // Suspend
      } else if (transferType === "AUTOPAY") {
        return t('status.automaticPayment'); // Automatic Payment
      } else if (transferType === "WAITING_CALLBACK") {
        return t('status.automaticPaymentInProgress'); // Waiting Callback
      } else if (transferType === "SENDING") {
        return t('status.sending') // Sending
      } else if (transferType === "SUPPLEMENT_SUCCESS") {
        return t('status.success'); // Supplement Success
      } else if (transferType === "CLOSED") {
        return t('status.closed'); // Closed
      } else if (transferType === "WITHDRAW_FAIL") {
        return t('status.withdrawFailed'); // Fail Withdrawal
      } else if (turnoverType === "WITHDRAW") {
        return t('status.withdraw'); // Withdraw
      } else if (turnoverType === "PROMO") {
        return t('status.promotion'); // 优惠
      } else if (turnoverType === "DEPOSIT") {
        return t('status.deposit'); //
      } else if (turnoverType === "TRANSFER") {
        return t('status.transfer'); // 转账
      } else if (turnoverType === "ADJUST") {
        return t('status.adjustment'); // 账变
      } else {
        return transferType;
      }
    };

    const getTransferChangeType = (transferChangeType) => {
      if (!transferChangeType) {
        return "";
      }
      if (transferChangeType === "WITHDRAW") {
        return t('status.withdraw'); // Withdraw
      } else if (transferChangeType === "WITHDRAW_FAIL") {
        return t('status.withdrawFailed'); // Withdraw
      }else if (transferChangeType === "DEPOSIT") {
        return t('status.deposit'); // DEPOSIT
      } else {
        return transferChangeType;
      }
    };

    const getFormatBetTime = (betTime) => {
      return moment(betTime).format("YYYY-MM-DD HH:mm:ss");
    }

    const getPlatform = (platformName) => {
      if (!platformName) {
        return "";
      }
      if (platformName === "AG") {
        return "AG " + t('account.livecasino') + ", XIN " + t('account.slot'); // AG
      }else if (platformName === "GPI") {
        return "GPI " + t('account.slot') + ", GPI " + t('account.lottery'); // AG
      }  else if (platformName === "BBINDY") {
        return "BBIN "  + t('account.livecasino');
      } else if (platformName === "KP") {
        return "King Poker" ;
      } else if (platformName === "KM") {
        return "King Maker";
      } else if (platformName === "V8") {
        return "V8 " + t('account.poker');
      } else if (platformName === "TCG") {
        return "TCG " + t('account.lottery') ;
      }else if (platformName === "LOTTO") {
        return "LOTTO " + t('account.lottery') ;
      }else if (platformName === "MGP") {
        return "MGP " + t('account.slot') ;
      }  else if (platformName === "EBET") {
        return "WE " + t('account.livecasino');
      } else if (platformName === "PT") {
        return "PT " + t('account.slot');
      } else if (platformName === "PG") {
        return "PG " + t('account.slot');
      } else if (platformName === "SW") {
        return "SW " + t('account.slot');
      } else if (platformName === "SABA") {
        return "SABA " + t('account.sport');
      }else if(platformName === 'GFSBO'){
        return "SBOBET " + t('account.sport');
      }else if(platformName === 'CMD'){
        return "CMD " + t('account.sport');
      } else if (platformName === "BG") {
        return "BG " + t('account.livecasino');
      } else if (platformName === "Evo") {
        return "Evo " + t('account.livecasino');
      } else if (platformName === "BBINDY") {
        return "BBIN " + t('account.livecasino');
      } else if (platformName === "BBIN") {
        return "BBIN " + t('account.livecasino');
      } else if (platformName === "WE") {
        return "WE " + t('account.livecasino');
      }else if (platformName === "WM") {
        return "WM " + t('account.livecasino');
      } else if (platformName === "AE") {
        return "Sexy " + t('account.livecasino');
      } else if (platformName === "PMLIVE") {
        return "DB " + t('account.livecasino');
      }else if (platformName === "TFGaming") {
        return "TFGaming " + t('account.esport');
      } else if (platformName === "WS") {
        return "WS168 " + t('account.cockfight');
      }else if (platformName === "SP") {
        return "SP " + t('account.fishing');
      }else if (platformName === "JILI") {
        return "JILI " + t('account.fishing');
      }   else {
        return platformName;
      }
    };

    const getSubType = (subType, type) => {
      // return subType + "_" + type;

      if (!type) {
        return "";
      }
      if(type === 'WITHDRAW_FAIL'){
        return t('status.withdrawFailed');
      }
      if (subType === "DEPOSIT") {
        return t('status.deposit'); // 转进
      } else if (subType === "TRANSFER") {
        return t('status.transfer'); // 转出
      } else if (type === "WITHDRAW") {
        return t('status.withdraw'); // 转出
      } else if (type === "DEPOSIT") {
        return t('status.deposit');; // 转出
      }else {
        return subType;
      }
    };

    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === "APPLY") {
        return t('status.applying'); //Applying
      } else if (withdrawStatus === "FAIL") {
        return t('status.failed'); // Failed
      } else if (withdrawStatus === "SUCCESS") {
        return t('status.success'); // Success
      } else if (withdrawStatus === "STEP_1" || withdrawStatus === "PENDING") {
        return t('status.underReview'); //Under review
      } else if (withdrawStatus === "STEP_2") {
        return t('status.toBePaid'); // To be paid
      } else if (withdrawStatus === "STEP_3") {
        return t('status.normalPayment');// Payment on going
      } else if (withdrawStatus === "STEP_4") {
        return t('status.automaticPayment');; // Automatic Payment
      } else if (withdrawStatus === "STEP_5") {
        return t('status.suspend'); // Suspend
      } else if (withdrawStatus === "AUTOPAY") {
        return t('status.automaticPayment'); // Automatic Payment
      } else if (withdrawStatus === "WAITING_CALLBACK") {
        return t('status.automaticPaymentInProgress'); // Waiting Callback
      } else {
        return withdrawStatus;
      }
    };
    const getDepositStatus = (depositStatus) => {
      if (!depositStatus) {
        return "";
      }
      if (depositStatus === "PENDING") {
        return t('status.normalPayment'); // Pending
      } else if (depositStatus === "SUCCESS") {
        return t('status.success'); // Success
      } else if (depositStatus === "SUPPLEMENT_SUCCESS") {
        return t('status.success'); // Supplement Success
      } else if (depositStatus === "CLOSED") {
        return t('status.closed'); // Closed
      } else {
        return depositStatus;
      }
    };
    const getDepositType = (depositType) => {
      if (!depositType) {
        return "";
      }
      if (depositType === "BANK") {
        return t('status.bank'); // VIP转卡
      } else if (depositType === "USDTERC") {
        return t('status.usdterc'); // USDT ERC
      } else if (depositType === "USDTTRC") {
        return t('status.usdttrc'); // USDT TRC
      } else if (depositType === "OFFLINE") {
        return t('status.offline'); // 线下转卡
      } else if (depositType === "UNION") {
        return "UNION"; // 银联快捷
      } else if (depositType === "QUICKPAYMENT") {
        return t('account.quickpayment'); // 小额转卡
      } else if (depositType === "SPECIALPAY") {
        return t('status.bank'); // 网银转账
      } else if (depositType === "ALIPAY") {
        return "ALIPAY"; // 支付宝转卡
      } else if (depositType === "ALIPAYCODE") {
        return "ALIPAY"; // 支付宝
      } else if (depositType === "WECHATCODE") {
        return "WECHATPAY"; // 微信支付
      } else if (depositType === "QQCODE") {
        return "QQCODE"; // QQ支付
      } else if (depositType === "KDPAY") {
        return "KDPAY"; // K豆
      } else if (depositType === "DDPAY") {
        return "DDPAY"; // 钉钉
      } else if (depositType === "SZPAY") {
        return "SZPAY"; // 数字人民币
      } else if (depositType === "CARDPAY") {
        return t('status.scratch_card'); // 点卡支付
      } else if (depositType === "ONLINECODE") {
        return "ONLINECODE"; // 云闪付
      } else if (depositType === "DYPAY") {
        return t('status.tiktok'); // 抖音
      } else if (depositType === "AUTOPAY") {
        return t('status.automatic_paying'); // 自动支付
      } else {
        return depositType;
      }
    };
    const getGameType = (gameType) => {
      if (!gameType) {
        return "";
      }
      if (gameType === "SLOT") {
        return t('menu.slot'); // Slot
      } else if (gameType === "LIVE") {
        return t('menu.liveCasino'); // Live
      } else if (gameType === "FISH") {
        return t('menu.fishing'); // Fish
      } else if (gameType === "SPORT") {
        return t('menu.sports'); // Sport
      } else if (gameType === "ESPORT") {
        return t('menu.esports'); // E-Sport
      } else if (gameType === "POKER") {
        return t('menu.poker'); // Poker
      } else if (gameType === "LOTTERY") {
        return t('menu.lottery'); // Lottery
      } else {
        return gameType;
      }
    };

    const getBetStatus = (betStatus) => {
      if (!betStatus) {
        return "";
      }
      if (betStatus === "BET") {
        return t('status.bet'); // Bet
      } else if (betStatus === "SETTLE") {
        return t('status.settlement'); // Settle
      } else if (betStatus === "SETTLED") {
        return t('status.settled'); // Bet & Settled
      }else if (betStatus === "BET_N_SETTLE") {
        return t('status.betAndClosed'); // Bet & Settled
      } else if (betStatus === "CANCEL") {
        return t('status.cancel'); // Cancel
      } else if (betStatus === "PATCH") {
        return t('status.fixed'); // Patch
      } else {
        return betStatus;
      }
    };
    const formRef = ref(null);
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    watch(languageVal, () => {
      tableColumns.value = {
      deposit: [
        ...commonColumns,
        {
          title: t('transit.depositAmount'),
          dataIndex: "depositAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        },
        {
          title: t('transit.paymentType'),
          dataIndex: "paymentType"
        },
        {
          title: t('transit.depositDate'),
          dataIndex: "depositDate",
          slots: { customRender: "depositDate" }
        },
        {
          title: t('transit.operation'),
          dataIndex: "operation",
          slots: { customRender: "operation" }
        }
      ],
      withdraw: [
        ...commonColumns,
        {
          title: t('transit.withdrawAmount'),
          dataIndex: "withdrawAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        },
        {
          title: t('transit.withdrawDate'),
          dataIndex: "withdrawDate",
          slots: { customRender: "withdrawDate" }
        },
        {
          title: t('transit.operation'),
          dataIndex: "operation",
          slots: { customRender: "operation" }
        }
      ],
      transfer: [
        ...commonColumns,
        {
          title: t('transit.type'),
          dataIndex: "type",
          key: "type",
          slots: { customRender: "type" }
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform",
          key: "platform"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount",
          key: "withdrawAmount"
        },
        {
          title: t('transit.status'),
          dataIndex: "status",
          key: "status",
          slots: { customRender: "status" }
        },
        {
          title: t('transit.time'),
          dataIndex: "transferDate",
          key: "transferDate",
          slots: { customRender: "transferDate" }
        }
      ],
      rebates: [
        ...commonColumns,
        {
          title: t('transit.privilegeName'),
          dataIndex: "privilegeName"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount"
        },
        {
          title: t('transit.recordTime'),
          dataIndex: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      turnover: [
        ...commonColumns,
        {
          title: t('transit.subType'),
          dataIndex: "subType"
        },
        {
          title: t('transit.amount'),
          dataIndex: "amount"
        },
        {
          title: t('transit.platform'),
          dataIndex: "platformCode"
        },
        {
          title: t('transit.recordTime'),
          dataIndex: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      gameBetRecord: [
        {
          title: t('transit.betTime'),
          dataIndex: "betTime",
          slots: { customRender: "betTime" }
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform"
        },
        {
          title: t('transit.bet'),
          dataIndex: "bet"
        },
        {
          title: t('transit.payout'),
          dataIndex: "payout"
        },
        {
          title: t('transit.gameType'),
          dataIndex: "gameType"
        },
        {
          title: t('transit.status'),
          dataIndex: "status"
        }
      ],
      betRecord: [
        {
          title: t('transit.betId'),
          dataIndex: "betId"
        },
        {
          title: t('transit.transactionId'),
          dataIndex: "transactionId"
        },
        {
          title: t('transit.gamePlatform'),
          dataIndex: "platform"
        },
        {
          title: t('transit.bet'),
          dataIndex: "bet"
        },
        {
          title: t('transit.payout'),
          dataIndex: "payout"
        },
        {
          title: t('transit.beforeBalance'),
          dataIndex: "beforeBalance"
        },
        {
          title: t('transit.afterBalance'),
          dataIndex: "afterBalance"
        },
        {
          title: t('transit.betStatus'),
          dataIndex: "betStatus"
        },
        {
          title: t('transit.gameType'),
          dataIndex: "gameType"
        },
        {
          title: t('transit.betTime'),
          dataIndex: "betTime",
          slots: { customRender: "betTime" }
        },
        {
          title: t('transit.settleTime'),
          dataIndex: "settleTime",
          slots: { customRender: "settleTime" }
        },
        {
          title: t('transit.result'),
          dataIndex: "result"
        },
        {
          title: t('transit.sportBetResult'),
          dataIndex: "sportBetResult"
        }
      ],
      reminderRecord: [
        {
          title: t('transit.orderNo'),
          dataIndex: "orderNo"
        },
        {
          title: t('transit.financeRemark'),
          dataIndex: "financeRemark"
        },
        {
          title: t('transit.feedbackTime'),
          dataIndex: "feedbackTime",
          slots: { customRender: "feedbackTime" }
        },
        {
          title: t('transit.type'),
          dataIndex: "type",
          slots: { customRender: "type" }
        }
      ]
    };
    })
    return {
      recordActive,
      uploadFileRef,
      reminderForm,
      searchForm,
      dataState,
      tableColumns,
      searchRecord,
      recordPage,
      loading,
      pagination,
      getTime,
      chgDate,
      checkType(ts) {
        if (ts === 1) {
          return t('status.deposit');
        } else {
          return t('status.withdraw');
        }
      },
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      recordBetPage,
      betPagination,
      totalBetRecord,
      reminderDialog,
      openReminder,
      submitReminder,
      getImageLink,
      getTurnoverType,
      getTransferType,
      getSubType,
      getWithdrawStatus,
      getDepositStatus,
      getDepositType,
      getGameType,
      getBetStatus,
      openWithdrawConfirm,
      openWithdrawCancel,
      loadingBtn,
      clearItems,
      formRef,
      getTransferChangeType,
      getPlatform,
      getFormatBetTime
    };
  }
});
</script>

<style scoped lang="scss">
.payout-total {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

:deep(.ant-select:hover .ant-select-clear) {
  background: #2b2b4b;
}

.account-content.transit {
  min-height: 740px;
  margin: 0;
  padding: 0;

  .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
  .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
    padding: 20px;
  }
}

.account-container {
  .account-content-wrapper {
    .unbind-record-wrapper {
      margin-top: 20px;
    }

    .common-btn {
      cursor: pointer;

      &.search-btn {
        margin-top: 0;
        padding: 3px 5px;
        font-size: 14px;
      }
    }

    .transit .ant-form {
      display: flex;
      justify-content: space-between;
    }

    .ant-form-inline .ant-form-item {
      align-items: center;
    }

    .ant-form-inline .ant-form-item.search {
      margin-right: 0;
    }

    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 20px;
    }
  }
}

.transaction-container {
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
  border-radius: 15px;
  padding: 20px 40px;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .left {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 15px;
      }

      .account-btn {
        &.search-btn {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>

<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div className="menu-title-container">
      <span className="menu-title">交易记录</span>
    </div>
    <div class="account-content transit">
      <el-tabs v-model="recordActive" @tab-click="searchRecord" type="card">
        <el-tab-pane name="deposit" label="存款记录">
          <div>
            <el-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker v-model="searchForm.deposit.startDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.deposit.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item class="search">
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
                      <el-button class="common-btn" @click="openReminder(scope.row)">催单</el-button>
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
        <el-tab-pane name="turnover" label="账变记录">
          <div>
            <el-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker v-model="searchForm.turnover.startDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.turnover.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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

                <template v-if="tbl.dataIndex === 'type'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getTurnoverType(scope.row.type) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'subType'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getSubType(scope.row.subType, scope.row.type) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <!--            <el-pagination-->
            <!--              @current-change="recordPage"-->
            <!--              :total="pagination.total"-->
            <!--              :current-page="searchForm[recordActive].current"-->
            <!--              :page-size="searchForm[recordActive].size"-->
            <!--            />-->
          </div>
        </el-tab-pane>
        <el-tab-pane name="withdraw" label="提款记录">
          <div>
            <el-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker v-model="searchForm.withdraw.startDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.withdraw.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
                      <el-button class="common-btn" @click="openReminder(scope.row)">催单</el-button>
                    </div>
                  </template>

                  <template v-if="scope.row.status === 'APPLY' || scope.row.status === 'STEP_2'">
                    <div style="display: flex; align-items: center">
                      <el-button size="small" color="red" @click="openWithdrawCancel(scope.row)">取消</el-button>
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
                      <el-button class="common-btn" @click="openWithdrawConfirm(scope.row)">确认到账</el-button>
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
        <el-tab-pane name="transfer" label="转账记录">
          <div>
            <el-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker v-model="searchForm.transfer.startDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.transfer.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
        </el-tab-pane>
        <el-tab-pane name="rebates" label="优惠记录">
          <div>
            <el-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker v-model="searchForm.rebates.startDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.rebates.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
        <el-tab-pane name="gameBetRecord" label="投注记录">
          <div v-if="searchForm.gameBetRecord.platform.length === 0" class="payout-total">
            <div>总投注：{{ totalBetRecord.totalBet }}</div>
            <div>总派彩：{{ totalBetRecord.totalPayout }}</div>
            <div>总有效投注：{{ totalBetRecord.totalValidBet }}</div>
          </div>
          <div>
            <el-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <el-form-item label="平台">
                  <el-select
                    allowClear
                    style="width: 300px"
                    v-model="searchForm.gameBetRecord.platformName"
                    placeholder="平台"
                    @change="searchRecord"
                  >
                    <el-option key="" value="">-</el-option>
                    <el-option
                      v-for="p in platformsList"
                      :label="p.alias"
                      :key="p.code + '@' + p.gameType + '@' + p.alias"
                      :value="p.code + '@' + p.gameType + '@' + p.alias"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.gameBetRecord.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.gameBetRecord.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
                <template v-if="tbl.dataIndex === 'betId'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <el-tooltip class="box-item" effect="dark" :content="scope.row.betId" placement="top-start">
                      <a @click="copy(scope.row.betId)">
                        复制
                        <span style="color: black">{{ scope.row.betId.slice(0, 1) }}...</span>
                      </a>
                    </el-tooltip>
                  </div>
                </template>
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
        <el-tab-pane name="reminderRecord" label="催单记录">
          <div>
            <el-form layout="inline" :model="searchForm.reminderRecord">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.reminderRecord.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker v-model="searchForm.reminderRecord.endDate" valueFormat="YYYY-MM-DD" placeholder="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" class="common-btn" @click="searchRecord">搜索</el-button>
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
                    <span>{{ scope.row.type === 1 ? "存款" : "提款" }}</span>
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
        title="催单"
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
            <el-form-item tabindex="1" label="单号" prop="serialNumber">
              <el-input v-model="reminderForm.orderNo" placeholder="单号" disabled />
            </el-form-item>

            <el-form-item label="选择图片" prop="photos">
              <FileUpload @photo-response="getImageLink" ref="uploadFileRef" />
            </el-form-item>

            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                v-model="reminderForm.memberRemark"
                placeholder="备注"
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
              提交
            </el-button>
          </el-form>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  loadRecords,
  saveFinanceFeedback,
  getVerifyingFeedbackCount,
  financeFeedbackList,
  confirmationOfWithdrawalReceived,
  cancellationOfWithdrawalReceived
} from "@/api/personal/personal";
import moment from "moment";
import {useLocalStorage} from "@vueuse/core";
// import { message } from "ant-design-vue";
import {getLoggedInPlatformList, getPlatformWithTypeList} from "@/api/platform/platform";
import {userStore} from "@/store";
import FileUpload from "@/components/FileUpload.vue"
import EmptyData from "@/components/emptyData.vue"
import { useRoute } from 'vue-router';


const copy = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  ElMessage.success('已复制');
}
const loadingBtn = ref(false);
const store = userStore()
const uploadFileRef = ref();
const recordActive = ref("deposit");
const reminderForm = reactive({});
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0,
  totalValidBet: 0
})
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
    gameType: "",
    platformName: "",
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
  },
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
    title: "编码",
    dataIndex: "serialNumber",
    key: "serialNumber"
  }
];
const tableColumns = {
  deposit: [
    ...commonColumns,
    {
      title: "金额",
      dataIndex: "depositAmount"
    },
    {
      title: "状态",
      dataIndex: "status"
    },
    {
      title: "存款类型",
      dataIndex: "paymentType"
    },
    {
      title: "存款日期",
      dataIndex: "depositDate",
      slots: {customRender: "depositDate"}
    },
    {
      title: "操作",
      dataIndex: "operation",
      slots: {customRender: "operation"}
    }
  ],
  withdraw: [
    ...commonColumns,
    {
      title: "金额",
      dataIndex: "withdrawAmount"
    },
    {
      title: "状态",
      dataIndex: "status"
    },
    {
      title: "提款日期",
      dataIndex: "withdrawDate",
      slots: {customRender: "withdrawDate"}
    },
    {
      title: "操作",
      dataIndex: "operation",
      slots: {customRender: "operation"}
    }
  ],
  transfer: [
    ...commonColumns,
    {
      title: "账变类型",
      dataIndex: "type",
      key: "type",
      slots: {customRender: "type"}
    },
    {
      title: "游戏平台",
      dataIndex: "alias",
      key: "platform"
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "withdrawAmount"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      slots: {customRender: "status"}
    },
    {
      title: "时间",
      dataIndex: "transferDate",
      key: "transferDate",
      slots: {customRender: "transferDate"}
    }
  ],
  rebates: [
    ...commonColumns,
    {
      title: "优惠名",
      dataIndex: "privilegeName"
    },
    {
      title: "金额",
      dataIndex: "amount"
    },
    {
      title: "记录时间",
      dataIndex: "recordTime",
      slots: {customRender: "recordTime"}
    }
  ],
  turnover: [
    ...commonColumns,
    {
      title: "账变类型",
      dataIndex: "type"
    },
    {
      title: "金额",
      dataIndex: "amount"
    },
    {
      title: "平台",
      dataIndex: "subType",
      slots: {customRender: "subType"}
    },
    {
      title: "时间",
      dataIndex: "recordTime",
      slots: {customRender: "recordTime"}
    }
  ],
  gameBetRecord: [
    {
      title: "注单号",
      dataIndex: "transactionId"
    },
    {
      title: "游戏时间",
      dataIndex: "betTime",
      slots: { customRender: "betTime" }
    },
    {
      title: "游戏平台",
      dataIndex: "platform"
    },
    {
      title: "投注",
      dataIndex: "bet"
    },
    {
      title: "派彩",
      dataIndex: "payout"
    },
    {
      title: "游戏类型",
      dataIndex: "gameType"
    },
    {
      title: "投注状态",
      dataIndex: "status"
    }
  ],
  betRecord: [
    // {
    //   title: "รหัสเดิมพัน",
    //   dataIndex: "betId"
    // },
    // {
    //   title: "รหัสธุรกรรม",
    //   dataIndex: "transactionId"
    // },
    // {
    //   title: "แพลตฟอร์ม",
    //   dataIndex: "platform"
    // },
    // {
    //   title: "เดิมพัน",
    //   dataIndex: "bet"
    // },
    // {
    //   title: "การจ่ายเงิน",
    //   dataIndex: "payout"
    // },
    // {
    //   title: "วงเงินก่อนหน้า",
    //   dataIndex: "beforeBalance"
    // },
    // {
    //   title: "วงเงินหลังจาก",
    //   dataIndex: "afterBalance"
    // },
    // {
    //   title: "สถานะการเดิมพัน",
    //   dataIndex: "betStatus"
    // },
    // {
    //   title: "ประเภทของเกม",
    //   dataIndex: "gameType"
    // },
    // {
    //   title: "เวลาเดิมพัน",
    //   dataIndex: "betTime",
    //   slots: {customRender: "betTime"}
    // },
    // {
    //   title: "เวลาชำระเงิน",
    //   dataIndex: "settleTime",
    //   slots: {customRender: "settleTime"}
    // },
    // {
    //   title: "ผลลัพท์",
    //   dataIndex: "result"
    // },
    {
      title: " 下注 ID",
      dataIndex: "betId"
    },
    {
      title: "交易 ID",
      dataIndex: "transactionId"
    },
    {
      title: "游戏平台",
      dataIndex: "platform"
    },
    {
      title: "下注",
      dataIndex: "bet"
    },
    {
      title: "支出",
      dataIndex: "payout"
    },
    {
      title: "余额前金额",
      dataIndex: "beforeBalance"
    },
    {
      title: "余额后金额",
      dataIndex: "afterBalance"
    },
    {
      title: "投注状态",
      dataIndex: "betStatus"
    },
    {
      title: "游戏类型",
      dataIndex: "gameType"
    },
    {
      title: "下注时间",
      dataIndex: "betTime",
      slots: { customRender: "betTime" }
    },
    {
      title: "结算时间",
      dataIndex: "settleTime",
      slots: { customRender: "settleTime" }
    },
    {
      title: "结果",
      dataIndex: "result"
    },
    {
      title: "体育投注结果",
      dataIndex: "sportBetResult"
    },
  ],
  reminderRecord: [
    {
      title: "订单号",
      dataIndex: "orderNo"
    },
    {
      title: "财务反馈",
      dataIndex: "financeRemark"
    },
    {
      title: "反馈时间",
      dataIndex: "feedbackTime",
      slots: {customRender: "feedbackTime"}
    },
    {
      title: "类型",
      dataIndex: "type",
      slots: {customRender: "type"}
    },
  ],
};
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

export default defineComponent({
  components: {
    EmptyData,
    FileUpload,
  },
  name: "TransitRecordView",
  setup() {
    const searchRecord = (tab) => {
      if (tab && tab.props && tab.props.name) {
        recordActive.value = tab.props.name
      }
      // recordActive.value = key.props.name
      loading.value = true;
      if (recordActive.value === 'gameBetRecord') {
        getPlatList(recordActive.value);
      } else if (recordActive.value === 'reminderRecord') {
        financeFeedbackList(searchForm[recordActive.value]).then((response) => {
          if (response.code === 0) {
            pagination.total = response.data.total;
            const dataSource = dataState[recordActive.value];
            //clear array and then push new record
            dataSource.splice(0);
            dataSource.push(...response.data.records);
          }
        })
        return;
      }

      if (recordActive.value === 'turnover' || recordActive.value === 'gameBetRecord') {
        if (searchForm[recordActive.value].current === 1) {
          searchForm[recordActive.value].pagingState = null;
        } else {
          searchForm[recordActive.value].pagingState = pagination.pagingState;
        }
        if (recordActive.value === 'gameBetRecord') {
          let selectedPlatform = searchForm.gameBetRecord.platformName;
          if (selectedPlatform && selectedPlatform.includes("@")){
            const platformArr = selectedPlatform.split('@');
            searchForm.gameBetRecord.platform = platformArr[0];
            searchForm.gameBetRecord.gameType = platformArr[1];
            searchForm.gameBetRecord.platformName = platformArr[2];
          } else if(selectedPlatform==="") {
            searchForm.gameBetRecord.platform = ""
            searchForm.gameBetRecord.gameType = ""
            searchForm.gameBetRecord.platformName = null
          }
        }
      }
      console.log(searchForm[recordActive.value]);
      loadRecords(recordActive.value, searchForm[recordActive.value]).then((response) => {
        if (response.code === 0) {
          pagination.total = response.data.total;
          if (recordActive.value === 'turnover' || recordActive.value === 'gameBetRecord') {
            pagination.pagingState = response.data.pagingState;
          }

          if(recordActive.value === 'gameBetRecord') {
            totalBetRecord.totalBet = response.data.sums.totalBet;
            totalBetRecord.totalPayout = response.data.sums.totalPayout;
            totalBetRecord.totalValidBet= response.data.sums.totalValidBet;
          }

          const dataSource = dataState[recordActive.value];
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
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
      searchForm.betRecord.current = pagination.current
      if (pagination.current === 1) {
        searchForm.betRecord.pagingState = null;
      } else {
        searchForm.betRecord.pagingState = betPagination.pagingState;
      }
      betDetails(selectedBetRecord);
    }

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
      ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord", "reminderRecord"].forEach(function (v) {
        if (v in searchForm) {
          searchForm[v].startDate = chgDate(7);
          searchForm[v].endDate = chgDate(0);
          if(v === "gameBetRecord") {
            // 结束时间如果不跟开始时间一个月，则从当月 1 号开始
            if(moment(searchForm[v].startDate).format("YYYY-MM") !== moment(searchForm[v].endDate).format("YYYY-MM")) {
              searchForm[v].startDate = moment(searchForm[v].endDate).format("YYYY-MM") + "-01";
            }
          }
        }
      });
      searchRecord();
    };

    const route = useRoute();

    onMounted(() => {
      if (route.query.type === 'withdraw') {
        recordActive.value = 'withdraw';
      }
      getTime();
    });
    const platformsList = ref([])
    const getPlatList = (v) => {
      const startMonth = new Date(searchForm[v].startDate).getMonth()
      const endMonth = new Date(searchForm[v].endDate).getMonth()
      if (startMonth !== endMonth) {
        ElMessage.error('开始与结束月份必须一致');
      }
      getPlatformWithTypeList().then((ret) => {
        platformsList.value = ret
      })
    };
    const selectedBetRecord = ref({})
    const betRecordDialog = ref(false)
    const reminderDialog = ref(false)
    const clearItems = (done) => {
      uploadFileRef.value.clear();
      done()
    }
    const openReminder = (record) => {
      getVerifyingFeedbackCount().then((res) => {
        if (res.code === 0) {
          if (res.data < 3) {
            reminderDialog.value = true
            reminderForm.orderNo = record.serialNumber
            reminderForm.photos = null
            reminderForm.memberRemark = ""
            if (recordActive.value === 'deposit') {
              reminderForm.type = 1
              reminderForm.recordTime = moment(record.depositDate).format('YYYY-MM-DD HH:mm:ss')
            } else if (recordActive.value === 'withdraw') {
              reminderForm.type = 2
              reminderForm.recordTime = moment(record.withdrawDate).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            ElMessage.error('无法提交新催单，目前尚有未处理的催单。')
          }
        }
      })
    }
    const openWithdrawConfirm = (record) => {
      const obj = {
        id: record.id,
        withdrawDate: record.withdrawDate
      }
      confirmationOfWithdrawalReceived(obj).then((res) => {
        if (res.code === 0) {

          ElMessageBox.alert('已经确认到账', {
                // if you want to disable its autofocus
                // autofocus: false,
                title: '系统提示',
                center: true,
                confirmButtonText: '确认',
                showClose: false,
                buttonSize: 'large'
            }).then(() => {
              getTime()
            })
        }
      })
    }

    const openWithdrawCancel = (record) => {
      const obj = {
        id: record.id,
        withdrawDate: record.withdrawDate
      };
      cancellationOfWithdrawalReceived(obj).then((res) => {
        if (res.code === 0) {
          ElMessageBox.alert("已经取消提款", {
            // if you want to disable its autofocus
            // autofocus: false,
            title: "系统提示",
            center: true,
            confirmButtonText: "确认",
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
    const submitReminder = () => {
      loadingBtn.value = true;
      if (!reminderForm.photos) {
        ElMessage.warning(
            `请上传图片提交`
        );
      } else {
        console.log(reminderForm)
        saveFinanceFeedback(reminderForm).then((res) => {
          if (res.code === 0) {
            ElMessage.success(`催单上传成功。`);
            reminderDialog.value = false;
            formRef.value.resetFields();
            uploadFileRef.value.clear();
          }
        })
      }
      loadingBtn.value = false;
    }
    const betDetails = (record) => {
      dataState.betRecord = []
      selectedBetRecord.value = record
      const obj = {
        platform: record.platform,
        betTime: moment(record.betTime).format('YYYY-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
        size: searchForm.betRecord.size,
        pagingState: searchForm.betRecord.pagingState
      }
      loadRecords("betRecord", obj).then((response) => {
        if (response.code === 0) {
          betPagination.total = response.data.total;
          betRecordDialog.value = true
          betPagination.pagingState = response.data.pagingState;
          // dataState.betRecord = response.data.records
          dataState.betRecord.push(...response.data.records);

        }
      })
    }

    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value;

    const getImageLink = (linkId) => {
      reminderForm.photos = `${linkId}`
    }

    const getFormatBetTime = (betTime) => {
      return moment(betTime).format("YYYY-MM-DD HH:mm:ss");
    }

    const getPlatform = (platformName) => {
      if (!platformName) {
        return ''
      }
      if (platformName === 'AG') {
        return 'PA 真人，PA 电子' // AG
      } else if (platformName === 'BBINDY') {
        return 'BBIN 真人' // BBINDY
      }  else if (platformName === 'KY') {
        return '开元棋牌' // KY
      }  else if (platformName === 'DT') {
        return '大唐棋牌' // DT
      }  else if (platformName === 'TCG') {
        return 'TCG 彩票' // TCG
      }  else if (platformName === 'SGWin') {
        return '双赢彩票' // SGWin
      } else if (platformName === 'PTDY') {
        return 'PT 电子' // SGWin
      } else if (platformName === 'PGDY') {
        return 'PG 电子' // SGWin
      } else {
        return platformName
      }
    }

    const getTurnoverType = (turnoverType) => {
      if (!turnoverType) {
        return ''
      }
      if (turnoverType === 'WITHDRAW_FAIL') {
        return '提款失败' // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return '提款' // Withdraw
      }  else if (turnoverType === 'PROMO') {
        return '优惠' // 优惠
      }  else if (turnoverType === 'DEPOSIT') {
        return '存款' // 存款
      }  else if (turnoverType === 'TRANSFER') {
        return '转账' // 转账
      }  else if (turnoverType === 'ADJUST') {
        return '账变' // 账变
      } else {
        return turnoverType
      }
    }
    const getTransferType = (transferType) => {
      if (!transferType) {
        return ''
      }
      if (transferType === 'APPLY') {
        return '申请中' //Applying
      } else if (transferType === 'FAIL') {
        return '失败' // Failed
      } else if (transferType === 'SUCCESS') {
        return '成功' // Success
      } else if (transferType === 'STEP_1' || transferType === 'PENDING') {
        return '审核中' //Under review
      } else if (transferType === 'STEP_2') {
        return '待支付' // To be paid
      } else if (transferType === 'STEP_3') {
        return '支付中' // Payment on going
      } else if (transferType === 'STEP_4') {
        return '自动支付' // Automatic Payment
      } else if (transferType === 'STEP_5') {
        return '请联系客服查询原因' // Suspend
      } else if (transferType === 'AUTOPAY') {
        return '自动支付' // Automatic Payment
      } else if (transferType === 'WAITING_CALLBACK') {
        return '自动支付中' // Waiting Callback
      } else if (transferType === 'SUPPLEMENT_SUCCESS') {
        return '成功' // Supplement Success
      } else if (transferType === 'CLOSED') {
        return '关闭' // Closed
      } else if (transferType === 'WITHDRAW_FAIL') {
        return '提款失败' // Fail Withdrawal
      } else if (transferType === 'WITHDRAW') {
        return '提款' // Withdraw
      }  else if (transferType === 'PROMO') {
        return '优惠' // 优惠
      }  else if (transferType === 'DEPOSIT') {
        return '存款' // 存款
      }  else if (transferType === 'TRANSFER') {
        return '转账' // 转账
      }  else if (transferType === 'ADJUST') {
        return '账变' // 账变
      } else {
        return transferType
      }
    }

    const getTransferChangeType = (transferChangeType) => {
      if (!transferChangeType) {
        return ''
      }
       if (transferChangeType === 'WITHDRAW') {
        return '转出' // Withdraw
      }  else if (transferChangeType === 'DEPOSIT') {
        return '转入' // DEPOSIT
      } else {
        return transferChangeType
      }
    }

    const getSubType = (subType, type) => {
      // return subType + "_" + type;
      if (!type) {
        return "";
      }
      if (type === "WITHDRAW_FAIL") {
        return "转账失败";
      }
      if (subType === "DEPOSIT") {
        return "转进"; // 转进
      } else if (subType === "WITHDRAW") {
        return "转出"; // 转出
      } else if (type === "WITHDRAW") {
        return "转出"; // 转出
      } else if (type === "DEPOSIT") {
        return "转进"; // 转出
      }else if (type === "VIP_REBATE"){
        return "VIP 返水"; // VIP 返水
      } else {
        return subType;
      }
    };

    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return '处理中' //Applying
      } else if (withdrawStatus === 'FAIL') {
        return '失败' // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return '成功' // Success
      } else if (withdrawStatus === 'STEP_1' || withdrawStatus === 'PENDING') {
        return '处理中' //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return '待支付' // To be paid
      } else if (withdrawStatus === 'STEP_3') {
        return '支付中' // Payment on going
      } else if (withdrawStatus === 'STEP_4') {
        return '自动支付' // Automatic Payment
      } else if (withdrawStatus === 'STEP_5') {
        return '请联系客服查询原因' // Suspend
      } else if (withdrawStatus === 'AUTOPAY') {
        return '自动支付' // Automatic Payment
      } else if (withdrawStatus === 'WAITING_CALLBACK') {
        return '自动支付中' // Waiting Callback
      } else {
        return withdrawStatus
      }
    };
    const getDepositStatus = (depositStatus) => {
      if (!depositStatus) {
        return ''
      }
      if (depositStatus === 'PENDING') {
        return '支付中' // Pending
      } else if (depositStatus === 'SUCCESS') {
        return '成功' // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return '成功' // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return '关闭' // Closed
      } else {
        return depositStatus
      }
    }
    const getDepositType = (depositType) => {
      if (!depositType) {
        return ''
      }
      if (depositType === 'BANK') {
        return 'VIP 转卡' // VIP 转卡
      } else if (depositType === 'USDTERC') {
        return 'USDT ERC' // USDT ERC
      } else if (depositType === 'USDTTRC') {
        return 'USDT TRC' // USDT TRC
      } else if (depositType === 'OFFLINE') {
        return '线下转卡' // 线下转卡
      } else if (depositType === 'UNION') {
        return '银联快捷' // 银联快捷
      } else if (depositType === 'QUICKPAYMENT') {
        return '小额转卡' // 小额转卡
      } else if (depositType === 'SPECIALPAY') {
        return '网银转账' // 网银转账
      } else if (depositType === 'ALIPAY') {
        return '支付宝转卡' // 支付宝转卡
      } else if (depositType === 'ALIPAYCODE') {
        return '支付宝' // 支付宝
      } else if (depositType === 'WECHATCODE') {
        return '微信支付' // 微信支付
      } else if (depositType === 'QQCODE') {
        return 'QQ 支付' // QQ 支付
      } else if (depositType === 'KDPAY') {
        return 'K 豆' // K 豆
      } else if (depositType === 'BLBPAY') {
        return '808 钱包' // 808 钱包
      } else if (depositType === 'DDPAY') {
        return '钉钉' // 钉钉
      } else if (depositType === 'HBPAY') {
        return '和包' // 和包
      }  else if (depositType === 'SZPAY') {
        return '数字人民币' // 数字人民币
      }  else if (depositType === 'CARDPAY') {
        return '点卡支付' // 点卡支付
      }  else if (depositType === 'ONLINECODE') {
        return '云闪付' // 云闪付
      }  else if (depositType === 'DYPAY') {
        return '抖音' // 抖音
      }   else if (depositType === 'AUTOPAY') {
        return '自动支付' // 自动支付
      } else {
        return depositType
      }
    }
    const getGameType = (gameType) => {
      if (!gameType) {
        return ''
      }
      if (gameType === 'SLOT') {
        return '电子' // Slot
      } else if (gameType === 'LIVE') {
        return '真人' // Live
      } else if (gameType === 'FISH') {
        return '捕鱼' // Fish
      } else if (gameType === 'SPORT') {
        return '体育' // Sport
      } else if (gameType === 'ESPORT') {
        return '电竞' // E-Sport
      } else if (gameType === 'POKER') {
        return '棋牌' // Poker
      } else if (gameType === 'LOTTERY') {
        return '彩票' // Lottery
      } else {
        return gameType
      }
    }

    const getBetStatus = (betStatus) => {
      if (!betStatus) {
        return ''
      }
      if (betStatus === "BET") {
        return "投注"; // Bet
      } else if (betStatus === "SETTLE") {
        return "结算"; // Settle
      } else if (betStatus === "SETTLED") {
        return "已结算"; // Bet & Settled
      }else if (betStatus === "BET_N_SETTLE") {
        return "投注并结算"; // Bet & Settled
      } else if (betStatus === "CANCEL") {
        return "取消"; // Cancel
      } else if (betStatus === "PATCH") {
        return "修补"; // Patch
      } else {
        return betStatus;
      }
    }
    const formRef = ref(null)

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
          return 'Deposit'
        } else {
          return 'Withdraw'
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
      imgURL,
      getFormatBetTime,
      copy
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

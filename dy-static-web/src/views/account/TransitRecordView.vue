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
                  <el-date-picker
                    v-model="searchForm.deposit.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.deposit.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item class="search">
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table :data="dataState.deposit" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.deposit"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template
                  v-if="tbl.dataIndex === 'depositDate'"
                  #default="scope"
                >
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.depositDate }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'status'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getDepositStatus(scope.row.status) }}
                  </div>
                </template>
                <template
                  v-if="tbl.dataIndex === 'paymentType'"
                  #default="scope"
                >
                  <div style="display: flex; align-items: center">
                    {{ getDepositType(scope.row.paymentType) }}
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'operation'" #default="scope">
                  <template v-if="scope.row.status === 'PENDING'">
                    <div style="display: flex; align-items: center">
                      <el-button
                        size="small"
                        class="common-btn"
                        @click="openReminder(scope.row)"
                        >催单
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
        <el-tab-pane name="turnover" label="转账记录">
          <div>
            <el-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.turnover.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.turnover.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.turnover"
              :datel-source="dataState.turnover"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <template #subType="{ record }">
                <span v-if="record.type === 'TRANSFER'">
                  {{
                    record.subType === "DEPOSIT" ? "TRANSFER IN" : "TRANSFER IN"
                  }}
                </span>
                <span v-else>
                  {{ record.subType }}
                </span>
              </template>
            </el-table> -->

            <el-table :data="dataState.turnover" :loading="loading">
              <template #empty>
                <EmptyData />
              </template>

              <el-table-column
                v-for="tbl in tableColumns.turnover"
                :key="tbl.key"
                :prop="tbl.dataIndex"
                :label="tbl.title"
              >
                <template
                  v-if="tbl.dataIndex === 'recordTime'"
                  #default="scope"
                >
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
                  </div>
                </template>

                <template v-if="tbl.dataIndex === 'type'" #default="scope">
                  <div style="display: flex; align-items: center">
                    {{ getTurnoverType(scope.row.type) }}
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
        <el-tab-pane name="withdraw" label="提款记录">
          <div>
            <el-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.withdraw.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.withdraw.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
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
                <template
                  v-if="tbl.dataIndex === 'recordTime'"
                  #default="scope"
                >
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
                      <el-button
                        size="small"
                        class="common-btn"
                        @click="openReminder(scope.row)"
                        >催单
                      </el-button>
                    </div>
                  </template>

                  <template
                    v-if="
                      scope.row.status === 'SUCCESS' &&
                      scope.row.currencyName === 'CNY' &&
                      scope.row.confirmStatus === 0
                    "
                  >
                    <div style="display: flex; align-items: center">
                      <el-button
                        size="small"
                        class="common-btn"
                        @click="openWithdrawConfirm(scope.row)"
                        >确认到账
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
        <!-- <el-tab-pane name="transfer" label="Transfer">
          <div>
            <el-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.transfer.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.transfer.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="success"
                  class="common-btn"
                  @click="searchRecord"
                >搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table
              :columns="tableColumns.transfer"
              :datel-source="dataState.transfer"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #type="{ record }">
                <span> {{ record.type }} - {{ record.platform }} </span>
              </template>
              <template #status="{ text, record }">
                <span>
                  <el-tag
                    :color="
                      record.status === 'SUCCESS'
                        ? '#87d068'
                        : record.status === 'SENDING'
                        ? '#55acee'
                        : '#cd201f'
                    "
                  >
                    {{ text }}
                  </el-tag>
                </span>
              </template>
              <template #transferDate="{ text }">
                <span>{{ "humanDatetime(text }}</span>
              </template>
            </el-table>
          </div>
        </el-tab-pane> -->
        <el-tab-pane name="rebates" label="优惠记录">
          <div>
            <el-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.rebates.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.rebates.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
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
                <template
                  v-if="tbl.dataIndex === 'recordTime'"
                  #default="scope"
                >
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
          <div class="payout-total">
            <div>总投注: {{ totalBetRecord.totalBet }}</div>
            <div>总派彩: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <el-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <el-form-item label="平台">
                  <el-select
                    allowClear
                    style="width: 300px"
                    v-model="searchForm.gameBetRecord.platform"
                    placeholder="平台"
                    @change="searchRecord"
                  >
                    <el-option
                      v-for="p in platformsList"
                      :key="p.name"
                      :value="p.name"
                    >
                      {{ p.name }}
                    </el-option>
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
                  <el-date-picker
                    v-model="searchForm.gameBetRecord.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
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
                <template
                  v-if="tbl.dataIndex === 'recordTime'"
                  #default="scope"
                >
                  <div style="display: flex; align-items: center">
                    <span>{{ scope.row.recordTime }}</span>
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
                  <el-date-picker
                    v-model="searchForm.reminderRecord.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    class="common-btn"
                    @click="searchRecord"
                    >搜索
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
                <template
                  v-if="tbl.dataIndex === 'recordTime'"
                  #default="scope"
                >
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
            style="
              width: 100%;
              max-width: 400px;
              margin: 0px auto 0px;
              padding-top: 50px;
              padding-bottom: 50px;
            "
          >
            <el-form-item tabindex="1" label="单号" prop="serialNumber">
              <el-input
                v-model="reminderForm.orderNo"
                placeholder="单号"
                disabled
              />
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
              @click="submitReminder()"
              >提交</el-button
            >
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
  gameBetRecordTotal,
  saveFinanceFeedback,
  getVerifyingFeedbackCount,
  financeFeedbackList,
  confirmationOfWithdrawalReceived
} from "@/api/personal/personal";
import moment from "moment";
// import { message } from "ant-design-vue";
import {getPlatformList} from "@/api/platform/platform";
import {userStore} from "@/store";
import FileUpload from "@/components/FileUpload.vue"
import EmptyData from "@/components/emptyData.vue"

const store = userStore()
const uploadFileRef = ref();
const recordActive = ref("deposit");
const reminderForm = reactive({});
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
})
const searchForm = reactive({
  turnover: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
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
    size: 10
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
    title: "序列号",
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
      title: "转账类型",
      dataIndex: "type",
      key: "type",
      slots: {customRender: "type"}
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
      title: "转账日期",
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
      title: "周转型",
      dataIndex: "type"
    },
    {
      title: "金额",
      dataIndex: "amount"
    },
    {
      title: "周转亚型",
      dataIndex: "subType",
      slots: {customRender: "subType"}
    },
    {
      title: "记录时间",
      dataIndex: "recordTime",
      slots: {customRender: "recordTime"}
    }
  ],
  gameBetRecord: [
    // {
    //   title: "รหัสเดิมพัน",
    //   dataIndex: "betId"
    // },
    {
      title: "游戏名称",
      dataIndex: "gameName"
    },
    {
      title: "游戏平台",
      dataIndex: "platform"
    },
    {
      title: "赌注",
      dataIndex: "bet"
    },
    {
      title: "支出",
      dataIndex: "payout"
    },
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
    {
      title: "游戏类型",
      dataIndex: "gameType"
    },
    // {
    //   title: "เวลาเดิมพัน",
    //   dataIndex: "betTime",
    //   slots: { customRender: "betTime" }
    // },
    // {
    //   title: "เวลาชำระเงิน",
    //   dataIndex: "settleTime",
    //   slots: { customRender: "settleTime" }
    // },
    // {
    //   title: "ผลลัพท์",
    //   dataIndex: "result"
    // },
    // {
    //   title: "",
    //   dataIndex: "actions",
    //   slots: { customRender: "actions" }
    // },
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
  total: 0
});
const betPagination = reactive({
  pageSize: 20,
  total: 0
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
        getPlatList();
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
      loadRecords(recordActive.value, searchForm[recordActive.value]).then((response) => {
        if (response.code === 0) {
          pagination.total = response.data.total;
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
        }
      });
      searchRecord();
    };

    onMounted(() => {
      getTime();
    });
    const platformsList = ref([])
    const getPlatList = () => {
      getPlatformList().then((ret) => {
        platformsList.value = ret
      })

      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate: searchForm.gameBetRecord.startDate,
        endDate: searchForm.gameBetRecord.endDate,
      }
      gameBetRecordTotal(obj).then((ret) => {
        if (ret.code === 0) {
          totalBetRecord.totalBet = ret.data.totalBet
          totalBetRecord.totalPayout = ret.data.totalPayout
        }
      })

    };
    const selectedBetRecord = ref({})
    const betRecordDialog = ref(false)
    const reminderDialog = ref(false)
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
    const submitReminder = () => {
      console.log(reminderForm);
      if (!reminderForm.photos) {
        ElMessage.warning(
            `请上传图片提交`
        );
      } else {
        saveFinanceFeedback(reminderForm).then((res) => {
          if (res.code === 0) {
            ElMessage.success(`催单上传成功。`);
            reminderDialog.value = false;
            reminderForm.value = {}
          }
        })
      }
    }
    const betDetails = (record) => {
      dataState.betRecord = []
      selectedBetRecord.value = record
      const obj = {
        gameName: record.gameName,
        platform: record.platform,
        betTime: moment(record.betTime).format('YYYY-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
        size: searchForm.betRecord.size,
      }
      loadRecords("betRecord", obj).then((response) => {
        if (response.code === 0) {
          betPagination.total = response.data.total;
          betRecordDialog.value = true
          // dataState.betRecord = response.data.records
          dataState.betRecord.push(...response.data.records)
        }
      })
    }

    const getImageLink = (linkId) => {
      console.log(linkId);
      reminderForm.photos = `https://xinfa-files.s3.ap-southeast-1.amazonaws.com/order/2/${linkId}`
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
      } else {
        return turnoverType
      }
    }
    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return '申请中' //Applying
      } else if (withdrawStatus === 'FAIL') {
        return '失败' // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return '成功' // Success
      } else if (withdrawStatus === 'STEP_1') {
        return '审核中' //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return '待支付' // To be paid
      } else if (withdrawStatus === 'STEP_3') {
        return '支付中' // Payment on going
      } else if (withdrawStatus === 'STEP_4') {
        return '自动支付' // Automatic Payment
      } else if (withdrawStatus === 'STEP_5') {
        return '暂不处理' // Suspend
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
        return 'VIP转卡' // VIP转卡
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
        return 'QQ支付' // QQ支付
      } else if (depositType === 'KDPAY') {
        return 'K豆' // K豆
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
      getWithdrawStatus,
      getDepositStatus,
      getDepositType,
      openWithdrawConfirm
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

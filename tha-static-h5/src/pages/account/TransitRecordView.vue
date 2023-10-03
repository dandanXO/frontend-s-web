<template>
  <div>
    <div className="menu-title-container">
      <!-- <span className="menu-title">บันทึกการโอน</span> -->
    </div>
    <div class="account-content transit">
      <q-tabs v-model="recordActive" class="form-wrapped">
        <q-tab name="deposit" :label="$t('lang.deposit')" />
        <q-tab name="turnover" :label="$t('lang.turnover')" />
        <q-tab name="withdraw" :label="$t('lang.withdraw')" />
        <!-- <q-tab name="transfer" :label="$t('lang.transfer')" /> -->
        <q-tab name="rebates" :label="$t('lang.rebates')" />
        <q-tab name="gameBetRecord" :label="$t('lang.gameBetRecord')" />
        <q-tab name="reminderRecord" :label="$t('lang.reminderRecord')" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="recordActive" animated>
        <q-tab-panel name="deposit">
          <div>
            <q-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <q-input filled v-model="searchForm.deposit.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.deposit.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.deposit.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.deposit.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.deposit"
            :rows="dataState.deposit"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div>
                  {{ getDepositStatus(props.value) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-operation="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.status === 'PENDING'"
                  size="sm"
                  label="เตือนความจำ"
                  color="brand"
                  @click="($event) => openReminder(props)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="turnover">
          <div>
            <q-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <q-input filled v-model="searchForm.turnover.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.turnover.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.turnover.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.turnover.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.turnover"
            :rows="dataState.turnover"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <div>
                  {{ getTurnoverType(props.value) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="withdraw">
          <div>
            <q-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <q-input filled v-model="searchForm.withdraw.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.withdraw.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.withdraw.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.withdraw.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.withdraw"
            :rows="dataState.withdraw"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div>
                  {{ getWithdrawStatus(props.value) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-operation="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.status === 'STEP_1'"
                  size="sm"
                  label="เตือนความจำ"
                  color="brand"
                  @click="($event) => openReminder(props)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="transfer">
          <div>
            <q-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <q-input filled v-model="searchForm.transfer.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.transfer.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.transfer.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.transfer.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.transfer"
            :rows="dataState.transfer"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-serialNumber="props">
              <q-td :props="props">
                <div>
                  <q-badge color="purple" :label="props.value" />
                </div>
                <div class="my-table-details">
                  {{ props.row.details }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="rebates">
          <div>
            <q-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <q-input filled v-model="searchForm.rebates.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.rebates.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.rebates.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.rebates.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.rebates"
            :rows="dataState.rebates"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          />
        </q-tab-panel>
        <q-tab-panel name="gameBetRecord">
          <div class="payout-total">
            <div>ยอดเดิมพัน: {{ totalBetRecord.totalBet }}</div>
            <div>ยอดเงินที่จ่าย: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <q-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <q-input filled v-model="searchForm.gameBetRecord.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.gameBetRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="left">
                <q-select
                 style="width: 100%;"
                  v-model="searchForm.gameBetRecord.platform"
                  filled
                  clearable
                  :options="platformsList"
                  label="แพลตฟอร์มเกม"
                  color="white"
                  label-color="grey"
                  option-label="name"
                  option-value="name"
                  emit-value
                  map-options
                />
                  <!-- <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input> -->
                <!-- <q-input filled v-model="searchForm.gameBetRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input> -->
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.gameBetRecord"
            :rows="dataState.gameBetRecord"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >

            <!-- <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn color="deep-orange" @click="betDetails(props.row)" label="บันทึกการเดิมพัน"></q-btn>
              </q-td>
            </template> -->
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="reminderRecord">
          <div>
            <q-form layout="inline" :model="searchForm.reminderRecord">
              <div class="left">
                <q-input filled v-model="searchForm.reminderRecord.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.reminderRecord.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.reminderRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.reminderRecord.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="ปิด"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn
                class="q-mb-md"
                label="ค้นหา"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.reminderRecord"
            :rows="dataState.reminderRecord"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="orderNo"
          >

            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <div>
                  {{ checkType(props.value) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog style="margin: 20px;" v-model="betRecordDialog">
          <q-table
            :loading="loading"
            :columns="tableColumns.betRecord"
            :rows="dataState.betRecord"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
          </q-table>
      </q-dialog>

      <q-dialog v-model="reminderDialog" no-backdrop-dismiss no-esc-dismis>
        <q-card class="reminder-dialog-card">
          <q-card-section>
            <q-toolbar>
              <q-toolbar-title>เตือนความจำ</q-toolbar-title>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-card-section>
          <q-card-section>
            <q-form
              ref="formRef"
              v-model="reminderForm"
              hide-required-mark
              name="basic"
              colon
              autocomplete="off"
              label-align="left"
              label-cols="5"
              class="reminder-dialog-form"
            >
              <q-input
                label="หมายเลขสั่งซื้อ"
                filled
                v-model="reminderForm.orderNo"
                color="white"
                padding="none"
                readonly
                disable
              />
              <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
              <q-input
                type="textarea"
                v-model="reminderForm.memberRemark"
                label="หมายเหตุ"
                filled
                autogrow
                color="white"
                class="q-mt-md"
                :rows="2"
                :max-rows="5"
              />
              <q-btn
                class="common-btn q-mt-md"
                color="brand"
                label="ส่ง"
                @click="submitReminder"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Close"
              flat
              color="primary"
              @click="reminderDialog = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import { userStore } from "stores/index"
import FileUpload from "components/FileUpload.vue"
import moment from "moment"
var qs = require("qs");
const store = userStore();
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
    endDate: ""
  },
  rebates: {
    startDate: "",
    endDate: ""
  },
  transfer: {
    startDate: "",
    endDate: ""
  },
  withdraw: {
    startDate: "",
    endDate: ""
  },
  deposit: {
    startDate: "",
    endDate: ""
  },
  gameBetRecord: {
    startDate: "",
    endDate: "",
    platform: "",
    memberId: store.id
  },
  betRecord: {
    platform: "",
    gameType: "",
    memberId: store.id
  },
  reminderRecord: {
    startDate: "",
    endDate: ""
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
  reminderRecord: [],
});
const commonColumns = [
  {
    label: "หมายเลขสั่งซื้อ",
    field: "serialNumber"
  }
];
const tableColumns = {
  deposit: [
    ...commonColumns,
    {
      label: "ยอดเงิน",
      field: "depositAmount"
    },
    {
      label: "สถานะ",
      field: "status",
      name: "status"
    },
    {
      label: "วันที่ฝาก",
      field: "depositDate",
      // slots: { customRender: "depositDate" }
    },
    {
      label: "การดำเนินการ",
      field: "operation",
      name: "operation"
    },
  ],
  withdraw: [
    ...commonColumns,
    {
      label: "ยอดเงิน",
      field: "withdrawAmount"
    },
    {
      label: "สถานะ",
      field: "status",
      name: "status"
    },
    {
      label: "วันที่ถอน",
      field: "withdrawDate",
      // slots: { customRender: "withdrawDate" }
    },
    {
      label: "การดำเนินการ",
      field: "operation",
      name: "operation"
    }
  ],
  transfer: [
    ...commonColumns,
    {
      label: "รายละเอียดการโอน",
      field: "type",
      key: "type",
      // slots: { customRender: "type" }
    },
    {
      label: "ยอดเงิน",
      field: "amount",
      key: "withdrawAmount"
    },
    {
      label: "สถานะ",
      field: "status",
      key: "status",
      // slots: { customRender: "status" }
    },
    {
      label: "เวลาโอน",
      field: "transferDate",
      key: "transferDate",
      // slots: { customRender: "transferDate" }
    }
  ],
  rebates: [
    ...commonColumns,
    {
      label: "ชื่อผู้มีสิทธิ์สูง",
      field: "privilegeName"
    },
    {
      label: "ยอดเงิน",
      field: "amount"
    },
    {
      label: "เวลาบันทึก",
      field: "recordTime",
      // slots: { customRender: "recordTime" }
    }
  ],
  turnover: [
    ...commonColumns,
    {
      label: "รูปแบบ",
      field: "type",
      name: "type"
    },
    {
      label: "ยอดเงิน",
      field: "amount"
    },
    {
      label: "รูปแบบ",
      field: "subType"
    },
    {
      label: "เวลาบันทึก",
      field: "recordTime",
      // slots: { customRender: "recordTime" }
    }
  ],
  betRecord: [
    {
      label: "รหัสเดิมพัน",
      field: "betId"
    },
    {
      label: "รหัสธุรกรรม",
      field: "transactionId"
    },
    {
      label: "แพลตฟอร์ม",
      field: "platform"
    },
    {
      label: "เดิมพัน",
      field: "bet"
    },
    {
      label: "การจ่ายเงิน",
      field: "payout"
    },
    {
      label: "วงเงินก่อนหน้า",
      field: "beforeBalance"
    },
    {
      label: "วงเงินหลังจาก",
      field: "afterBalance"
    },
    {
      label: "สถานะการเดิมพัน",
      field: "betStatus"
    },
    {
      label: "ประเภทของเกม",
      field: "gameType"
    },
    {
      label: "เวลาเดิมพัน",
      field: "betTime",
      // slots: { customRender: "betTime" }
    },
    {
      label: "เวลาชำระเงิน",
      field: "settleTime",
      // slots: { customRender: "settleTime" }
    },
    {
      label: "ผลลัพท์",
      field: "result"
    },
  ],
  gameBetRecord: [
    // {
    //   label: "รหัสเดิมพัน",
    //   field: "betId"
    // },
    // {
    //   label: "รหัสธุรกรรม",
    //   field: "transactionId"
    // },
    {
      label: "เกมใหม่",
      field: "gameName"
    },
    {
      label: "แพลตฟอร์ม",
      field: "platform"
    },
    {
      label: "เดิมพัน",
      field: "bet"
    },
    {
      label: "การจ่ายเงิน",
      field: "payout"
    },
    // {
    //   label: "วงเงินก่อนหน้า",
    //   field: "beforeBalance"
    // },
    // {
    //   label: "วงเงินหลังจาก",
    //   field: "afterBalance"
    // },
    // {
    //   label: "สถานะการเดิมพัน",
    //   field: "betStatus"
    // },
    {
      label: "ประเภทของเกม",
      field: "gameType"
    },
    {
      name: 'actions',
      label: '',
      field: '',
    }
    // {
    //   label: "เวลาเดิมพัน",
    //   field: "betTime",
    //   // slots: { customRender: "betTime" }
    // },
    // {
    //   label: "เวลาชำระเงิน",
    //   field: "settleTime",
    //   // slots: { customRender: "settleTime" }
    // },
    // {
    //   label: "ผลลัพท์",
    //   field: "result"
    // },
  ],
  reminderRecord: [
    {
      label: "หมายเลขสั่งซื้อ",
      field: 'orderNo'
    },
    {
      label: "หมายเหตุ",
      field: 'financeRemark'
    },
    {
      label: "เวลาตอบรับ",
      field: "feedbackTime",
    },
    {
      label: "ประเภทธุรกรรม",
      field: "type",
      name: "type"
    }
  ]
}
const loading = ref(false);
const pagination = reactive({
  pageSize: 10,
  total: 0
});

export default defineComponent({
  name: "TransitRecordView",
  components: {
    FileUpload,
  },
  setup() {
    const reminderDialog = ref(false);
    const openReminder = (record) => {
      api.get("/session/getVerifyingFeedbackCount").then((ret) => {
        const res = ret.data
        if (res.code === 0) {
          if (res.data < 3) {
            reminderDialog.value = true
            reminderForm.orderNo = record.row.serialNumber
            reminderForm.photos = null
            reminderForm.memberRemark = "";
            if (recordActive.value === 'deposit') {
              reminderForm.type = 1
            } else if (recordActive.value === 'withdraw') {
              reminderForm.type = 2
            }
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "มีความคิดเห็นที่ยังไม่ได้รับการยีนยัน",
              icon: "report_problem"
            });
          }
        }
      })
    }

    const submitReminder = () => {
      api.post("/session/saveFinanceFeedback", qs.stringify(reminderForm)).then((res) => {
        const ret = res.data
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "สำเร็จ",
            icon: "check_circle_outline"
          });
          reminderDialog.value = false;
          reminderForm.value = {}
          uploadFileRef.value.clear()
        }
      })
    }

    watch(recordActive, (currentValue, oldValue) => {
      searchRecord()
    });
    const $q = useQuasar()

    const recordUrl = {
      deposit: "/session/member/deposit",
      turnover: "/session/member/moneyChange",
      withdraw: "/session/member/withdraw",
      rebates: "/session/member/privilege",
      gameBetRecord: "/session/member/gameBetRecord",
      reminderRecord: "/session/member/financeFeedback",
    };

    const searchRecord = () => {
      loading.value = true;
      if (recordActive.value === 'gameBetRecord') {
        getPlatList()
      }
      api.get(recordUrl[recordActive.value], {
        params: searchForm[recordActive.value]
      }).then((ret) => {
        const response = ret.data
          const dataSource = dataState[recordActive.value];
          dataSource.value = [];
        if (response.code === 0) {
          pagination.total = response.data.length;
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: response.message,
          //   icon: "report_problem"
          // });
        }
      }).catch((error) => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: error.message,
        //   icon: "report_problem"
        // });
        // console.log("error", error);
      }).then(() => {
        loading.value = false;
      });
    };

    const recordPage = (pagination) => {
      searchForm[recordActive.value].current = pagination.current;
      searchRecord();
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
        }
      });
      searchRecord();
    };

    onMounted(() => {
      getTime();
    });
    const platformsList = ref([])
    const getPlatList = () => {
      api.get("/platform").then((res) => {
        const ret = res.data
        if (ret.code === 0) {
          platformsList.value = ret.data
        }
      })
      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate: searchForm.gameBetRecord.startDate,
        endDate: searchForm.gameBetRecord.endDate,
      }
      api.get("/session/member/gameBetRecordTotal", {params: obj}).then((res) => {
        const ret = res.data
        if (ret.code === 0) {
          totalBetRecord.totalBet = ret.data.totalBet
          totalBetRecord.totalPayout = ret.data.totalPayout
        }
      })

    };
    const betRecordDialog = ref(false)
    const getTurnoverType = (turnoverType) => {
      if (turnoverType === 'WITHDRAW_FAIL') {
        return 'การถอนเงินล้มเหลว' // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return 'ถอนเงิน' // Withdraw
      } else {
        return turnoverType
      }
    }
    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return 'ส่งดำเนินการ' //Applying
      } else if (withdrawStatus === 'FAIL') {
        return 'ล้มเหลว' // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return 'สำเร็จ' // Success
      } else if (withdrawStatus === 'STEP_1') {
        return 'กำลังตรวจสอบ' //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return 'กำลังดำเนินการจ่าย' // To be paid
      }  else if (withdrawStatus === 'STEP_3') {
        return 'กำลังดำเนินการโอน' // Payment on going
      }  else if (withdrawStatus === 'STEP_4') {
        return 'ชำระอัตโนมัติ' // Automatic Payment
      }  else if (withdrawStatus === 'STEP_5') {
        return 'ระงับ' //Suspend
      } else {
        return withdrawStatus
      }
    }
    const getDepositStatus = (depositStatus) => {
      if (depositStatus === 'PENDING') {
        return 'รอดำเนินการ' // Pending
      } else if (depositStatus === 'SUCCESS') {
        return 'สำเร็จ' // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return 'เสริมความสำเร็จ' // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return 'ปิด' // Closed
      } else {
        return depositStatus
      }
    }
    const betDetails = (row) => {
      const obj = {
        gameName: row.gameName,
        platform: row.platform,
        betTime: moment(row.betTime).format('yyyy-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
      }
      api.get("/session/member/betRecord", {params: obj}).then((res) => {
        const ret = res.data
        if (ret.code === 0) {
          betRecordDialog.value = true
          dataState.betRecord = ret.data.records
        }
      })
    }

    const getImageLink = (linkId) => {
      reminderForm.photos = `https://fxlmnp.wallykrooger.com/photo/${linkId}`
    }

    return {
      recordActive,
      searchForm,
      dataState,
      tableColumns,
      commonColumns,
      searchRecord,
      recordPage,
      loading,
      pagination,
      getTime,
      chgDate,
      noDataLabel: "ไม่มีข้อมูล",
      rowPerPageLabel: "บันทึกต่อหน้า",
      humanDatetime(ts) {
        return moment(ts).format("DD-MM-YYYY HH:mm:ss");
      },
      checkType(tp) {
        if (tp === 1) {
          return 'ฝาก'
        } else {
          return 'ถอน'
        }
      },
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      totalBetRecord,
      getTurnoverType,
      getWithdrawStatus,
      getDepositStatus,
      openReminder,
      reminderDialog,
      reminderForm,
      submitReminder,
      getImageLink,
      uploadFileRef
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
.account-content.transit {
  min-height: 740px;
  margin: 10px;
  padding: 0;
  .form-wrapped {
    :deep(.ant-tabs-top-bar) {
      margin-bottom: 50px;
    }
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
        font-size: 14px;
      }
    }
    .transit .ant-form {
      display: flex;
      justify-content: space-between;
    }
    .ant-form-inline .ant-form-item.search {
      margin-right: 0;
    }
  }
}
.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  margin-top:14px;
}
.block{
  color: #fff !important;
}

</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .transit .ant-form {
        justify-content: stretch;
        align-items: stretch;
        gap: 30px;
        width: 100%;
      }
      .left {
        flex-direction: column;
        margin-top: 25px;
        text-align: center;
        width: 100%;
        .ant-form-inline .ant-form-item {
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 100%;
        }
        .ant-calendar-picker {
          width: 100%;
        }
      }
      .account-btn {
        &.search-btn {
          margin-top: 10px;
        }
      }
    }
  }
}
.reminder-dialog-card {
  width: 100%;
  max-width: 448px;
}

.reminder-dialog-form {
  padding: 12px;
}
</style>

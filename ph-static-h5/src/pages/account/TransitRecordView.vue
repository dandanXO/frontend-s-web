<template>
  <div>
    <div class="account-content transit">
      <q-tabs
        style="display: none"
        inline-label
        outside-arrows
        mobile-arrows
        v-model="recordActive"
        class="form-wrapped"
      >
        <q-tab name="deposit" label="Deposit" />
        <q-tab name="turnover" label="Profit" />
        <q-tab name="withdraw" label="Withdraw" />
        <!-- <q-tab name="transfer" label="โอน" /> -->
        <q-tab name="rebates" label="Rebates" />
        <q-tab name="gameBetRecord" label="Game bet record" />
        <q-tab name="reminderRecord" label="Reminder record" />
      </q-tabs>
      <!-- <q-separator /> -->
      <q-tab-panels v-model="recordActive" animated>
        <q-tab-panel name="deposit">
          <div>
            <q-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <q-input filled v-model="searchForm.deposit.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.deposit.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.deposit.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.deposit.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
            :loading="loading"
            :columns="tableColumns.deposit"
            :rows="dataState.deposit"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:item="props">
              <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-table__grid-item-card q-table__card">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Order Number</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Amount</div>
                    <div class="q-table__grid-item-value">{{ props.row.depositAmount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Status</div>
                    <div class="q-table__grid-item-value">{{ getDepositStatus(props.row.status) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Deposit Date</div>
                    <div class="q-table__grid-item-value">{{ toHumanDate(props.row.depositDate) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Operation</div>
                    <div class="q-table__grid-item-value">
                      <q-btn
                        v-if="props.row.status === 'PENDING'"
                        size="sm"
                        label="Reminder"
                        color="brand"
                        @click="($event) => openReminder(props)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

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
                  label="Reminder"
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
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.turnover.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.turnover.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.turnover.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
            :loading="loading"
            :columns="tableColumns.turnover"
            :rows="dataState.turnover"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:item="props">
              <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-table__grid-item-card q-table__card">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Order Number</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Type</div>
                    <div class="q-table__grid-item-value">{{ getTurnoverType(props.row.type) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Amount</div>
                    <div class="q-table__grid-item-value">{{ props.row.amount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Profit Type</div>
                    <div class="q-table__grid-item-value">{{ props.row.subType }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Record Time</div>
                    <div class="q-table__grid-item-value">{{ toHumanDate(props.row.recordTime) }}</div>
                  </div>
                </div>
              </div>
            </template>

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
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.withdraw.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.withdraw.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.withdraw.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
            :loading="loading"
            :columns="tableColumns.withdraw"
            :rows="dataState.withdraw"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:item="props">
              <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-table__grid-item-card q-table__card">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Order Number</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Amount</div>
                    <div class="q-table__grid-item-value">{{ props.row.withdrawAmount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Status</div>
                    <div class="q-table__grid-item-value">{{ getWithdrawStatus(props.row.status) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Withdrawal Date</div>
                    <div class="q-table__grid-item-value">{{ toHumanDate(props.row.withdrawDate) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Operation</div>
                    <div class="q-table__grid-item-value">
                      <q-btn
                        v-if="props.row.status === 'STEP_1'"
                        size="sm"
                        label="Reminder"
                        color="brand"
                        @click="($event) => openReminder(props)"
                      />

                      <q-btn
                        v-if="props.row.status === 'SUCCESS' && props.row.confirmStatus === 0"
                        size="sm"
                        label="Confirm Withdraw"
                        color="brand"
                        @click="openWithdrawConfirmDialog(props)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

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
                  label="Reminder"
                  color="brand"
                  @click="($event) => openReminder(props)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <!--        <q-tab-panel name="transfer">-->
        <!--          <div>-->
        <!--            <q-form layout="inline" :model="searchForm.transfer">-->
        <!--              <div class="left">-->
        <!--                <q-input filled v-model="searchForm.transfer.startDate">-->
        <!--                  <template v-slot:append>-->
        <!--                    <q-icon name="event" class="cursor-pointer">-->
        <!--                      <q-popup-proxy-->
        <!--                          cover-->
        <!--                          transition-show="scale"-->
        <!--                          transition-hide="scale"-->
        <!--                      >-->
        <!--                        <q-date-->
        <!--                            v-model="searchForm.transfer.startDate"-->
        <!--                            mask="YYYY-MM-DD"-->
        <!--                        >-->
        <!--                          <div class="row items-center justify-end">-->
        <!--                            <q-btn-->
        <!--                                v-close-popup-->
        <!--                                label="Close"-->
        <!--                                color="white"-->
        <!--                                flat-->
        <!--                            />-->
        <!--                          </div>-->
        <!--                        </q-date>-->
        <!--                      </q-popup-proxy>-->
        <!--                    </q-icon>-->
        <!--                  </template>-->
        <!--                </q-input>-->
        <!--                <q-input filled v-model="searchForm.transfer.endDate">-->
        <!--                  <template v-slot:append>-->
        <!--                    <q-icon name="event" class="cursor-pointer">-->
        <!--                      <q-popup-proxy-->
        <!--                          cover-->
        <!--                          transition-show="scale"-->
        <!--                          transition-hide="scale"-->
        <!--                      >-->
        <!--                        <q-date-->
        <!--                            v-model="searchForm.transfer.endDate"-->
        <!--                            mask="YYYY-MM-DD"-->
        <!--                        >-->
        <!--                          <div class="row items-center justify-end">-->
        <!--                            <q-btn-->
        <!--                                v-close-popup-->
        <!--                                label="Close"-->
        <!--                                color="white"-->
        <!--                                flat-->
        <!--                            />-->
        <!--                          </div>-->
        <!--                        </q-date>-->
        <!--                      </q-popup-proxy>-->
        <!--                    </q-icon>-->
        <!--                  </template>-->
        <!--                </q-input>-->
        <!--              </div>-->
        <!--              <q-btn-->
        <!--                  class="q-mb-md"-->
        <!--                  label="Search"-->
        <!--                  color="brand"-->
        <!--                  @click="searchRecord"-->
        <!--              />-->
        <!--            </q-form>-->
        <!--          </div>-->
        <!--          <q-table-->
        <!--              :grid="$q.screen.lt.md"-->
        <!--              :loading="loading"-->
        <!--              :columns="tableColumns.transfer"-->
        <!--              :rows="dataState.transfer"-->
        <!--              :no-data-label="noDataLabel"-->
        <!--              :rows-per-page-label="rowPerPageLabel"-->
        <!--              row-key="serialNumber"-->
        <!--          >-->
        <!--      -->
        <!--            <template v-slot:body-cell-serialNumber="props">-->
        <!--              <q-td :props="props">-->
        <!--                <div>-->
        <!--                  <q-badge color="purple" :label="props.value"/>-->
        <!--                </div>-->
        <!--                <div class="my-table-details">-->
        <!--                  {{ props.row.details }}-->
        <!--                </div>-->
        <!--              </q-td>-->
        <!--            </template>-->
        <!--          </q-table>-->
        <!--        </q-tab-panel>-->
        <q-tab-panel name="rebates">
          <div>
            <q-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <q-input filled v-model="searchForm.rebates.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.rebates.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.rebates.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.rebates.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
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
            <div>Total bet: {{ totalBetRecord.totalBet }}</div>
            <div>Total Payout: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <q-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <q-input filled v-model="searchForm.gameBetRecord.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.gameBetRecord.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.gameBetRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.gameBetRecord.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="left">
                <q-select
                  style="width: 100%"
                  v-model="searchForm.gameBetRecord.platform"
                  filled
                  clearable
                  :options="platformsList"
                  label="Platforms"
                  color="light-blue-4"
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
                              label="Close"
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
                              label="Close"
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
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
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
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.reminderRecord.startDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.reminderRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.reminderRecord.endDate" mask="MM/DD/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
            :loading="loading"
            :columns="tableColumns.reminderRecord"
            :rows="dataState.reminderRecord"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="orderNo"
          >
            <template v-slot:item="props">
              <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-table__grid-item-card q-table__card">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Order Number</div>
                    <div class="q-table__grid-item-value">{{ props.row.orderNo }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Finance Remark</div>
                    <div class="q-table__grid-item-value">{{ props.row.financeRemark }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Feedback Date</div>
                    <div class="q-table__grid-item-value">{{ toHumanDate(props.row.feedbackTime) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">Reminder Type</div>
                    <div class="q-table__grid-item-value">{{ checkType(props.row.type) }}</div>
                  </div>
                </div>
              </div>
            </template>

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
      <q-dialog style="margin: 20px" v-model="betRecordDialog">
        <q-table
          :loading="loading"
          :columns="tableColumns.betRecord"
          :rows="dataState.betRecord"
          :no-data-label="noDataLabel"
          :rows-per-page-label="rowPerPageLabel"
          row-key="serialNumber"
        ></q-table>
      </q-dialog>

      <q-dialog v-model="reminderDialog" no-backdrop-dismiss no-esc-dismis>
        <q-card class="reminder-dialog-card">
          <q-card-section>
            <q-toolbar>
              <q-toolbar-title>Reminder</q-toolbar-title>
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
                label="Serial number"
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
                label="Remarks"
                filled
                autogrow
                color="white"
                class="q-mt-md"
                :rows="2"
                :max-rows="5"
              />
              <q-btn class="common-btn q-mt-md" color="brand" label="Submit" @click="submitReminder" />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Close" flat color="primary" @click="reminderDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog width="100%" v-model="isConfirmWithdraw" no-backdrop-dismiss no-esc-dismis>
        <q-card style="width: 100%; padding: 20px">
          <q-card-section class="q-mb-md">
            System Message
            <br />
            <br />
            Confirm Deposit.
          </q-card-section>
          <q-btn @click="openWithdrawConfirm()" label="Confirm" color="green" style="margin-right: 8px" />
          <q-btn @click="isConfirmWithdraw = false" label="Cancel" color="warning" />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import {api} from "boot/axios"
import {SessionStorage, useQuasar} from "quasar"
import * as _ from "lodash"
import {userStore} from "stores/index"
import FileUpload from "components/FileUpload.vue"
import moment from "moment"
import {useRoute} from "vue-router";
import { getPlatformList } from "src/api/platform/platform";

export default defineComponent({
  name: "TransitRecordView",
  components: {
    FileUpload,
  },
  setup() {
    var qs = require("qs");
    const store = userStore();
    const route = useRoute();
    const uploadFileRef = ref();
    const recordActive = ref(route.params.type);
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
        label: "Serial Number",
        field: "serialNumber"
      }
    ];
    const tableColumns = {
      deposit: [
        ...commonColumns,
        {
          label: "Deposit amount",
          field: "depositAmount"
        },
        {
          label: "Payment Type",
          field: "paymentType",
          name: "paymentType"
        },
        {
          label: "Status",
          field: "status",
          name: "status"
        },
        {
          label: "Deposit Date",
          field: "depositDate",
          // slots: { customRender: "depositDate" }
        },
        {
          label: "Operation",
          field: "operation",
          name: "operation"
        }
      ],
      withdraw: [
        ...commonColumns,
        {
          label: "Withdraw Amount",
          field: "withdrawAmount"
        },
        {
          label: "Status",
          field: "status",
          name: "status"
        },
        {
          label: "Withdrawal Date",
          field: "withdrawDate",
          // slots: { customRender: "withdrawDate" }
        },
        {
          label: "Operation",
          field: "operation",
          name: "operation"
        }
      ],
      transfer: [
        ...commonColumns,
        {
          label: "Type",
          field: "type",
          key: "type",
          // slots: { customRender: "type" }
        },
        {
          label: "Amount",
          field: "amount",
          key: "withdrawAmount"
        },
        {
          label: "Status",
          field: "status",
          key: "status",
          // slots: { customRender: "status" }
        },
        {
          label: "Transfer Date",
          field: "transferDate",
          key: "transferDate",
          // slots: { customRender: "transferDate" }
        }
      ],
      rebates: [
        ...commonColumns,
        {
          label: "Privilege Name",
          field: "privilegeName"
        },
        {
          label: "Amount",
          field: "amount"
        },
        {
          label: "Record Time",
          field: "recordTime",
          // slots: { customRender: "recordTime" }
        }
      ],
      turnover: [
        ...commonColumns,
        {
          label: "Type",
          field: "type",
          name: "type"
        },
        {
          label: "Amount",
          field: "amount"
        },
        {
          label: "Sub Type",
          field: "subType"
        },
        {
          label: "Record Time",
          field: "recordTime",
          // slots: { customRender: "recordTime" }
        }
      ],
      betRecord: [
        {
          label: "Bet ID",
          field: "betId"
        },
        {
          label: "Transaction ID",
          field: "transactionId"
        },
        {
          label: "Platform",
          field: "platform"
        },
        {
          label: "Bet",
          field: "bet"
        },
        {
          label: "Payout",
          field: "payout"
        },
        {
          label: "Before Balance",
          field: "beforeBalance"
        },
        {
          label: "After Balance",
          field: "afterBalance"
        },
        {
          label: "Bet Status",
          field: "betStatus"
        },
        {
          label: "Game Type",
          field: "gameType"
        },
        {
          label: "Bet Time",
          field: "betTime",
          // slots: { customRender: "betTime" }
        },
        {
          label: "Settle Time",
          field: "settleTime",
          // slots: { customRender: "settleTime" }
        },
        {
          label: "Result",
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
          label: "Game Name",
          field: "gameName"
        },
        {
          label: "Platform",
          field: "platform"
        },
        {
          label: "Bet",
          field: "bet"
        },
        {
          label: "Payout",
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
          label: "Game Type",
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
          label: "Order No.",
          field: 'orderNo'
        },
        {
          label: "Finance Remark",
          field: 'financeRemark'
        },
        {
          label: "Feedback Time",
          field: "feedbackTime",
          slots: {customRender: "feedbackTime"}
        },
        {
          label: "Type",
          field: "type",
          name: "type"
        }
      ],
    }
    const loading = ref(false);
    const pagination = reactive({
      pageSize: 10,
      total: 0
    });
    const pageName= ref("");
    const pageNameLists = ref({
      deposit: "Deposit",
      turnover: "Turnover",
      withdraw: "Withdraw",
      rebates: "Rebates",
      gameBetRecord: "Game Bet Records",
      reminderRecord: "Reminder Records",
    });

    console.log(recordActive.value);
    watch(() => route.params.type, (val) => {
      // console.log(val);
      if(val){
        recordActive.value = val;
        pageName.value= pageNameLists.value[val];
      }

    }, {immediate: true})


    const isConfirmWithdraw = ref(false);
    const reminderDialog = ref(false);
    const passDet = ref(null);

    const openReminder = (record) => {
      // 点催单按钮前访问回你的数字<3才能点击
      api.get("/session/getVerifyingFeedbackCount").then((res) => {
        if (res.code === 0) {
          if (res.data < 3) {
            reminderDialog.value = true
            reminderForm.orderNo = record.row.serialNumber
            reminderForm.memberRemark = null;
            reminderForm.photos = null;
            if (recordActive.value === 'deposit') {
              reminderForm.type = 1
              reminderForm.recordTime = moment(record.row.depositDate).format('YYYY-MM-DD HH:mm:ss')
            } else if (recordActive.value === 'withdraw') {
              reminderForm.type = 2
              reminderForm.recordTime = moment(record.row.withdrawDate).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "There is an existing reminder.",
              icon: "report_problem"
            });
          }
        }
      })
    }

    const openWithdrawConfirmDialog = (record) => {
      isConfirmWithdraw.value = true;
      passDet.value = record;
    };

    const openWithdrawConfirm = () => {
      const obj = {
        id: passDet.value.row.id,
        withdrawDate: passDet.value.row.withdrawDate
      };

      api
          .post("/session/withdraw/confirm", qs.stringify(obj))
          .then((response) => {
            // Handle the response
            if (response.data.code === 0) {
              isConfirmWithdraw.value = false;

              $q.notify({
                color: "positive",
                position: "top",
                message: "Withdrawal has been confirmed.",
                icon: "check_circle_outline"
              });
              removeSessionKeys("/session/member/withdraw");
              searchRecord();
            }

            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          })

          .catch((error) => {
            // Handle the error
            console.error(error);
          });
    };


    const submitReminder = () => {
      // Check if image upload is empty
      if (!reminderForm.photos) {
        // Display an error message here
        $q.notify({
          color: "negative",
          position: "bottom",
          message: ('Please upload image for submission'),
          icon: "report_problem"
        });
        return;
      }

      api.post("/session/saveFinanceFeedback", qs.stringify(reminderForm)).then((res) => {
        // console.log(reminderForm)

        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Success",
            icon: "check_circle_outline"
          });
          reminderDialog.value = false;
          reminderForm.value = {}
          uploadFileRef.value.clear()
        }
      })
    }

    watch(recordActive, (currentValue, oldValue) => {
      if(currentValue){
        searchRecord()
      }
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

      let startDate = moment(searchForm[recordActive.value].startDate).format("YYYY-MM-DD");
      let endDate = moment(searchForm[recordActive.value].endDate).format("YYYY-MM-DD");

      api.get(recordUrl[recordActive.value], {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      }).then((res) => {

        const dataSource = dataState[recordActive.value];
        dataSource.value = [];
        if (res.code === 0) {
          pagination.total = res.data.length;
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...res.data.records);
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
      ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord", "reminderRecord"].forEach(function (v) {
          searchForm[v].startDate = moment().add(-7, 'day').format("MM/DD/YYYY");
          searchForm[v].endDate = moment().format("MM/DD/YYYY");
          if(v === "gameBetRecord") {
            // 结束时间如果不跟开始时间一个月，则从当月1号开始
            if(moment(searchForm[v].startDate).format("YYYY-MM") !== moment(searchForm[v].endDate).format("YYYY-MM")) {
              searchForm[v].startDate = moment(searchForm[v].endDate).format("YYYY-MM") + "-01";
            }
          }
      });
      searchRecord();
    };

    onMounted(() => {
      getTime();
    });
    const platformsList = ref([])
    const getPlatList = () => {
		getPlatformList().then((res) => {

        if (res.code === 0) {
          platformsList.value = res.data
        }
      })
      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate:  moment(searchForm.gameBetRecord.startDate).format("YYYY-MM-DD"),
        endDate:  moment(searchForm.gameBetRecord.endDate).format("YYYY-MM-DD"),
      }
      api.get("/session/member/gameBetRecordTotal", {params: obj}).then((res) => {

        if (res.code === 0) {
          totalBetRecord.totalBet = res.data.totalBet
          totalBetRecord.totalPayout = res.data.totalPayout
        }
      })

    };
    const betRecordDialog = ref(false)
    const getTurnoverType = (turnoverType) => {
      if (turnoverType === 'WITHDRAW_FAIL') {
        return 'Fail Withdrawal' // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return 'Withdraw' // Withdraw
      } else {
        return turnoverType
      }
    }
    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return 'Applying' //Applying
      } else if (withdrawStatus === 'FAIL') {
        return 'Failed' // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return 'Success' // Success
      } else if (withdrawStatus === 'STEP_1') {
        return 'Under review' //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return 'To be paid' // To be paid
      } else if (withdrawStatus === 'STEP_3') {
        return 'Paying' // Payment on going
      } else if (withdrawStatus === 'STEP_4') {
        return 'Automatic Payment' // Automatic Payment
      } else if (withdrawStatus === 'STEP_5') {
        return 'Suspend' //Suspend
      } else if (withdrawStatus === 'WAITING_CALLBACK') {
        return 'Paying' //Paying
      } else {
        return withdrawStatus
      }
    }
    const getDepositStatus = (depositStatus) => {
      if (depositStatus === 'PENDING') {
        return 'Pending' // Pending
      } else if (depositStatus === 'SUCCESS') {
        return 'Success' // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return 'Supplement Success' // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return 'Closed' // Closed
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

        if (res.code === 0) {
          betRecordDialog.value = true
          dataState.betRecord = res.data.records
        }
      })
    }

    const getImageLink = (linkId) => {
      reminderForm.photos = `${linkId}`
    }

    const removeSessionKeys = (prefix) => {
      var keys = SessionStorage.getAllKeys();
      _.each(keys, function (key, item) {
        // console.log(key);
        if (key.indexOf(prefix) > -1) {
          SessionStorage.remove(key);
        }
      })
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
      noDataLabel: "No information",
      rowPerPageLabel: "Record per page",
      checkType(tp) {
        if (tp === 1) {
          return 'Deposit'
        } else {
          return 'Withdraw'
        }
      },
      pageName,
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      totalBetRecord,
      getTurnoverType,
      getWithdrawStatus,
      getDepositStatus,
      toHumanDate(ts) {
        return moment(ts).format("MM-DD-YYYY HH:mm:ss");
      },
      openReminder,
      reminderDialog,
      reminderForm,
      submitReminder,
      getImageLink,
      uploadFileRef,
      openWithdrawConfirmDialog,
      openWithdrawConfirm,
      isConfirmWithdraw,
      passDet,
      removeSessionKeys
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
  margin: 5px 10px 10px;
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
  margin-bottom: 20px;
  margin-top: 25px;
}

.block {
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

.menu-title {
  padding: 0px;
  padding-top: 4px;
}

.reminder-dialog-form {
  padding: 12px;
}
</style>

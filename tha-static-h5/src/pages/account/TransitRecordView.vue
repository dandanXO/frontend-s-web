<template>
  <div>
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <!-- :grid="$q.screen.lt.md" -->
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
                <div class="q-table__grid-item-card q-table__card q-table__card--dark q-dark">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.order_number") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.amount") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.depositAmount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.status") }}</div>
                    <div class="q-table__grid-item-value">{{ getDepositStatus(props.row.status) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.deposit_date") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.depositDate }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.operation") }}</div>
                    <div class="q-table__grid-item-value">
                      <q-btn
                        v-if="props.row.status === 'PENDING'"
                        size="sm"
                        :label="$t('lang.reminder')"
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
                  :label="$t('lang.reminder')"
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
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
                <div class="q-table__grid-item-card q-table__card q-table__card--dark q-dark">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.order_number") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.type") }}</div>
                    <div class="q-table__grid-item-value">{{ getTurnoverType(props.row.type) }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.amount") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.amount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.format") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.subType }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.record_time") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.recordTime }}</div>
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
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
              <!-- <pre>{{props}}</pre> -->
                <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                  <div class="q-table__grid-item-card q-table__card q-table__card--dark q-dark">
                      <div class="q-table__grid-item-row">
                          <div class="q-table__grid-item-title">{{ $t("lang.order_number") }}</div>
                          <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                      </div>
                      <div class="q-table__grid-item-row">
                          <div class="q-table__grid-item-title">{{ $t("lang.amount") }}</div>
                          <div class="q-table__grid-item-value">{{ props.row.withdrawAmount }}</div>
                      </div>
                      <div class="q-table__grid-item-row">
                          <div class="q-table__grid-item-title">{{ $t("lang.status") }}</div>
                          <div class="q-table__grid-item-value">{{ getWithdrawStatus(props.row.status) }}</div>
                      </div>
                      <div class="q-table__grid-item-row">
                          <div class="q-table__grid-item-title">{{ $t("lang.withdrawal_date") }}</div>
                          <div class="q-table__grid-item-value">{{ props.row.withdrawDate }}</div>
                      </div>
                      <div class="q-table__grid-item-row">
                          <div class="q-table__grid-item-title">{{ $t("lang.operation") }}</div>
                          <div class="q-table__grid-item-value">
                            <q-btn
                              v-if="props.row.status === 'STEP_1'"
                              size="sm"
                              :label="$t('lang.reminder')"
                              color="brand"
                              @click="($event) => openReminder(props)"
                            />

                            <q-btn
                              v-if="
                                props.row.status === 'SUCCESS' &&
                                props.row.confirmStatus === 0
                              "
                              size="sm"
                              :label="$t('lang.confirm_withdraw_success')"
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
                  :label="$t('lang.reminder')"
                  color="brand"
                  @click="($event) => openReminder(props)"
                />

                <q-btn
                  v-if="
                    props.row.status === 'SUCCESS' &&
                    props.row.confirmStatus === 0
                  "
                  size="sm"
                  :label="$t('lang.confirm_withdraw_success')"
                  color="brand"
                  @click="openWithdrawConfirmDialog(props)"
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
            </q-form>
          </div>
          <q-table
            :grid="$q.screen.lt.md"
            :loading="loading"
            :columns="tableColumns.transfer"
            :rows="dataState.transfer"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:item="props">
              <div :props="props" class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div class="q-table__grid-item-card q-table__card q-table__card--dark q-dark">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.order_number") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.serialNumber }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.privilege_name") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.privilegeName }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.amount") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.amount }}</div>
                  </div>
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ $t("lang.record_time") }}</div>
                    <div class="q-table__grid-item-value">{{ props.row.recordTime }}</div>
                  </div>
                </div>
              </div>
            </template>

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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
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
            <div>{{ $t('lang.bet_amount') }} {{ totalBetRecord.totalBet }}</div>
            <div>{{ $t('lang.amount_paid') }} {{ totalBetRecord.totalPayout }}</div>
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                  style="width: 100%"
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
                            :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
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
                              :label="$t('lang.close_btn')"
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
                              :label="$t('lang.close_btn')"
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
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
              />
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
          :grid="$q.screen.lt.md"
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
              <q-toolbar-title>{{ $t("lang.reminder") }}</q-toolbar-title>
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
                :label="$t('lang.order_number')"
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
                :label="$t('lang.finance_remark')"
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
                :label="$t('lang.send')"
                @click="submitReminder"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              :label="$t('lang.close_btn')"
              flat
              color="primary"
              @click="reminderDialog = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog
        width="100%"
        v-model="isConfirmWithdraw"
        no-backdrop-dismiss
        no-esc-dismis
      >
        <q-card style="width: 100%; padding: 20px">
          <q-card-section class="q-mb-md">
            {{ $t("lang.system_message") }}
            <br />
            <br />
            {{ $t("lang.confirm_deposit_msg") }}
          </q-card-section>
          <q-btn
            @click="openWithdrawConfirm()"
            :label="$t('lang.confirm')"
            color="green"
            style="margin-right: 8px"
          />
          <q-btn
            @click="isConfirmWithdraw = false"
            :label="$t('lang.cancel')"
            color="warning"
          />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "stores/index"
import FileUpload from "components/FileUpload.vue"
import moment from "moment"
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: "TransitRecordView",
  components: {
    FileUpload,
  },
  setup() {

    var qs = require("qs");
    const store = userStore();
    const {t} = useI18n();
    const uploadFileRef = ref();
    const recordActive = ref("deposit");
    const isConfirmWithdraw = ref(false);
    const passDet = ref(null);
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
        label: t('lang.order_number'),
        field: "serialNumber"
      }
    ];
    const tableColumns = {
      deposit: [
        ...commonColumns,
        {
          label: t('lang.amount'),
          field: "depositAmount",
          name: "depositAmount"
        },
        {
          label: t('lang.status'),
          field: "status",
          name: "status"
        },
        {
          label: t('lang.deposit_date'),
          field: "depositDate",
          name: "depositDate"
          // slots: { customRender: "depositDate" }
        },
        {
          label: t('lang.operation'),
          field: "operation",
          name: "operation"
        },
      ],
      withdraw: [
        ...commonColumns,
        {
          label: t('lang.amount'),
          field: "withdrawAmount"
        },
        {
          label: t('lang.status'),
          field: "status",
          name: "status"
        },
        // {
        //   label: 'Confirm Status',
        //   field: "confirmStatus",
        //   name: 'confirmStatus'
        //   // slots: { customRender: "withdrawDate" }
        // },
        {
          label: t('lang.withdraw_date'),
          field: "withdrawDate",
          // slots: { customRender: "withdrawDate" }
        },
        {
          label: t('lang.operation'),
          field: "operation",
          name: "operation"
        }
      ],
      transfer: [
        ...commonColumns,
        {
          label: t('lang.type'),
          field: "type",
          key: "type",
          // slots: { customRender: "type" }
        },
        {
          label: t('lang.amount'),
          field: "amount",
          key: "withdrawAmount"
        },
        {
          label: t('lang.status'),
          field: "status",
          key: "status",
          // slots: { customRender: "status" }
        },
        {
          label: t('lang.transfer_date'),
          field: "transferDate",
          key: "transferDate",
          // slots: { customRender: "transferDate" }
        }
      ],
      rebates: [
        ...commonColumns,
        {
          label: t('lang.privilege_name'),
          field: "privilegeName"
        },
        {
          label: t('lang.amount'),
          field: "amount"
        },
        {
          label: t('lang.record_time'),
          field: "recordTime",
          // slots: { customRender: "recordTime" }
        }
      ],
      turnover: [
        ...commonColumns,
        {
          label: t('lang.type'),
          field: "type",
          name: "type"
        },
        {
          label: t('lang.amount'),
          field: "amount"
        },
        {
          label: t('lang.sub_type'),
          field: "subType"
        },
        {
          label: t('lang.record_time'),
          field: "recordTime",
          // slots: { customRender: "recordTime" }
        }
      ],
      betRecord: [
        {
          label: t('lang.bet_code'),
          field: "betId"
        },
        {
          label: t('lang.transaction_id'),
          field: "transactionId"
        },
        {
          label: t('lang.platform'),
          field: "platform"
        },
        {
          label: t('lang.bet'),
          field: "bet"
        },
        {
          label: t('lang.payout'),
          field: "payout"
        },
        {
          label: t('lang.before_balance'),
          field: "beforeBalance"
        },
        {
          label: t('lang.after_balance'),
          field: "afterBalance"
        },
        {
          label: t('lang.bet_status'),
          field: "betStatus"
        },
        {
          label: t('lang.game_type'),
          field: "gameType"
        },
        {
          label: t('lang.bet_time'),
          field: "betTime",
          // slots: { customRender: "betTime" }
        },
        {
          label: t('lang.settle_time'),
          field: "settleTime",
          // slots: { customRender: "settleTime" }
        },
        {
          label: t('lang.result'),
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
          label: t('lang.game_name'),
          field: "gameName"
        },
        {
          label: t('lang.platform'),
          field: "platform"
        },
        {
          label: t('lang.bet'),
          field: "bet"
        },
        {
          label: t('lang.payout'),
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
          label: t('lang.game_type'),
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
          label: t('lang.order_number'),
          field: 'orderNo'
        },
        {
          label: t('lang.finance_remark'),
          field: 'financeRemark'
        },
        {
          label: t('lang.feedback_time'),
          field: "feedbackTime",
        },
        {
          label: t('lang.reminder_type'),
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


    const reminderDialog = ref(false);
    const openReminder = (record) => {
      // console.log(record.row.depositDate)
      api.get("/session/getVerifyingFeedbackCount").then((ret) => {
        const res = ret.data
        if (res.code === 0) {
          if (res.data < 3) {
            reminderDialog.value = true
            reminderForm.orderNo = record.row.serialNumber
            reminderForm.photos = null
            reminderForm.memberRemark = "";
            if (recordActive.value === 'deposit') {
              reminderForm.type = 1;
              reminderForm.recordTime = record.row.depositDate;
            } else if (recordActive.value === 'withdraw') {
              reminderForm.type = 2;
              reminderForm.recordTime = record.row.withdrawDate;
            }
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: t('lang.opinions_not_confirmed'),
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
                message: "已经确认到账",
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
      api.post("/session/saveFinanceFeedback", qs.stringify(reminderForm)).then((res) => {
        const ret = res.data
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('lang.success'),
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
        return t('lang.withdrawal_failed') // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return t('lang.withdrawal') // Withdraw
      } else if (turnoverType === 'ADJUST') {
        return t('lang.adjust') // Withdraw
      } else if (turnoverType === 'PROMO') {
        return t('lang.promo') // Withdraw
      } else if (turnoverType === 'DEPOSIT') {
        return t('lang.deposit') // Withdraw
      } else {
        return turnoverType
      }
    }
    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return t('lang.applying') //Applying
      } else if (withdrawStatus === 'FAIL') {
        return t('lang.failed') // Failed
      } else if (withdrawStatus === 'PENDING') {
        return t('lang.pending') // Pending
      } else if (withdrawStatus === 'SUCCESS') {
        return t('lang.success') // Success
      } else if (withdrawStatus === 'STEP_1') {
        return t('lang.under_review') //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return t('lang.to_be_paid') // To be paid
      } else if (withdrawStatus === 'STEP_3') {
        return t('lang.payment_on_going') // Payment on going
      } else if (withdrawStatus === 'STEP_4') {
        return t('lang.automatic_payment') // Automatic Payment
      } else if (withdrawStatus === 'STEP_5') {
        return t('lang.suspend') //Suspend
      } else {
        return withdrawStatus
      }
    }
    const getDepositStatus = (depositStatus) => {
      if (depositStatus === 'PENDING') {
        return t('lang.pending') // Pending
      } else if (depositStatus === 'SUCCESS') {
        return t('lang.success') // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return t('lang.supplement_success') // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return t('lang.close_btn') // Closed
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
      noDataLabel: t('lang.no_data_label'),
      rowPerPageLabel: t('lang.row_per_page_label'),
      humanDatetime(ts) {
        return moment(ts).format("DD-MM-YYYY HH:mm:ss");
      },
      checkType(tp) {
        if (tp === 1) {
          return t('lang.deposit')
        } else {
          return t('lang.withdraw')
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
  margin-top: 14px;
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

.reminder-dialog-form {
  padding: 12px;
}
</style>

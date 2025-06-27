<template>
    <div class="container">
        <div class="filters">
            <InputField :isDark="true"> 
                <template #input>
                    <div class="date-field">
                        <q-input filled :model-value="formattedDateRange" readonly>
                            <template v-slot:append>
                                <img src="../../../assets/images/earn-money/calendar-icon.svg" />
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="searchForm.dateRange" mask="YYYY-MM-DD" range
                                        @update:model-value="onSelectChangeDate">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup :label="$t('btn.close')" color="white" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </template>
                        </q-input>
                    </div>
                </template>
            </InputField>
            <q-btn class="btn-primary primary-btn" @click="getMyDividendsInfo" :disable="isLoading"
                :label="$t('btn.confirm')" />
        </div>


        <div class="info panel bordered">
            <div class="card-title">{{ $t('dividend.myDividend') }}</div>
            <div class="card-desc"></div>
            <div v-if="isLoading" class="stacks-loader" style="margin:30px auto;"></div>
            <table v-else class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%"
                style="text-align: center">
                <thead>
                    <template v-if="activeMemberDividendRateData.length === 1">
                        <tr>
                            <th>{{ $t("dividend.dividendRate") }}</th>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <th>{{ $t("dividend.activeMember") }}</th>
                            <th>{{ $t("dividend.dividendRate") }}</th>
                        </tr>
                    </template>
                </thead>
                <tbody>
                    <template v-if="activeMemberDividendRateData.length === 1">
                        <tr v-for="data, index in activeMemberDividendRateData" :key="index">
                            <td>
                                <span>{{ (data?.commissionRate * 100).toFixed(0) }}%</span>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="data, index in activeMemberDividendRateData" :key="index">
                            <td>
                                <span>≥{{ data?.activePlayer }}</span>
                            </td>
                            <td>
                                <span>{{ (data?.commissionRate * 100).toFixed(0) }}%</span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div>{{ (searchForm.dateRange?.from) ? searchForm.dateRange.from : searchForm.dateRange }} to {{ (searchForm.dateRange?.to) ? searchForm.dateRange.to : searchForm.dateRange}}</div>
                <!-- <div class="collapse">
                    <span></span>
                    <img class="collapse-icon" src="../../../assets/images/account/dividend/collapse-icon.png" />
                </div> -->
            </div>

            <div class="stats">
                <div class="row">
                    <div class="label">{{ $t('dividend.netAmountReceives') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.finalCommission }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.status') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <div v-else :class="dividendInfo.status?.toLowerCase()">{{ getStatusLabel(dividendInfo.status)
                        }}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.activeMember') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.activePlayer }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.periodValidBet') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.bet }}</span>
                    </div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">{{ $t('dividend.periodPnL') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.commissionAmount }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.periodSettledPnL') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.commissionAmount }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.dividendAmount') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.commissionAmount * dividendInfo.commissionRate }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="label">{{ $t('dividend.disbursementTime') }}</div>
                    <div class="value">
                        <q-spinner v-if="isLoading" />
                        <span v-else>{{ dividendInfo.payTime }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { api } from 'src/boot/axios';
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive, computed, onActivated, onMounted, onBeforeMount } from 'vue';
import { t } from "src/boot/lang";
import { useAffiliateStore } from "src/stores/affiliate";
import { useRouter } from 'vue-router';

const router = useRouter();
const affiliateStore = useAffiliateStore();
const isLoading = ref(false);
const activeMemberDividendRateData = ref([]);
const today = new Date();
const dayBefore = new Date();
dayBefore.setDate(today.getDate() - 30); // 30days before

const formatDate = (date) => date.toISOString().split("T")[0];

const formattedDateRange = computed(() => {
    const range = searchForm.dateRange;
    if (!range) return "";
    if(typeof range === "string") return range;
    const { from, to } = range;
    return `${formatDateToSlash(from)} ~ ${formatDateToSlash(to)}`;
});

const formatDateToSlash = (str) => {
    if (!str || typeof str !== "string" || !str.includes("-")) return "";
    const [year, month = "01", day = "01"] = str.split("-");
    return `${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
};

const searchForm = reactive({
    dateRange: {
        from: formatDate(dayBefore),
        to: formatDate(today)
    }
});

const dividendInfo = ref({
    activePlayer: 0,
    totalWinLoss: 0,
    platformFeeAmount: 0,
    bonusAmount: 0,
    accountAdjustment: 0,
    paymentFeeAmount: 0,
    commissionAmount: 0,
    commissionRate: 0,
    commissionAdjustment: 0,
    finalCommission: 0,
    status: "CHECKING",
    payTime: "-",
    payout: 0,
    bet: 0
});

const getStatusLabel = (statusStr) => {
    switch (statusStr) {
        case 'CHECKING':
            return t('dividend.statusChecking');
        case 'PAY':
            return t('dividend.statusPay');
        case 'CLEARED':
            return t('dividend.statusCleared');
        case 'CANCEL':
            return t('dividend.statusCancelled');
        default:
            return statusStr;
    }
}

const getMyDividendsInfo = () => {
    isLoading.value = true;
    const recordDate = (() => {
        if(searchForm.dateRange?.from) {
            return searchForm.dateRange.from + "," + searchForm.dateRange.to;
        } else {
            return searchForm.dateRange + "," + searchForm.dateRange;
        }
    })();

    api.get('/session/affiliate/settlement?recordDates=' + recordDate).then((res) => {
        dividendInfo.value = res.data;
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    })

    api.get('/session/affiliate/get-commission-tier').then((res) => {
        activeMemberDividendRateData.value = res.data;
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    })
}

onBeforeMount(async () => {
    const showDividendPage = await affiliateStore.checkIsCanShowDividendPage();
    if(!showDividendPage) {
        router.push('/affiliate/agent');
    }
})

onMounted(() => {
    getMyDividendsInfo();
    
})

onActivated(() => {
    getMyDividendsInfo();
})
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;

    .filters {
        display: flex;
        justify-content: space-between;
        align-items: center;

        :deep(.landing-input) {
            width: 100%;
            margin-right: 10px;
        }

        .primary-btn {
            padding: 0 30px;
            white-space: nowrap;
        }
    }
}

.separator {
    border: 0.97px solid #FFFFFF1A;
}

.detailed-stats {
    margin-top: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;
    padding: 20px 10px;

    .header {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 15px;
        line-height: 11px;
        letter-spacing: 0px;
        margin-bottom: 15px;

        .collapse {
            display: flex;
            align-items: center;

            .collapse-icon {
                margin-left: 10px;
            }
        }
    }

    .row {
        display: flex;
        justify-content: space-between;
        font-weight: 400;
        font-size: 13px;
        line-height: 15px;
        letter-spacing: 0px;
        color: #B2BDBF;
        width: 100%;
        margin-bottom: 10px;

        .icon,
        .label,
        .value {
            display: flex;
            align-items: center;
        }

        .icon {
            width: 7%;
            justify-content: center;
        }

        .label {
            width: 60%;
            text-align: left;
        }

        .value {
            width: 33%;
            text-align: right;
            justify-content: flex-end;

            .checking,
            .pay,
            .clear,
            .cancelled {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 27px;
            }

            .checking {
                color: #ffe500;
                font-size: 0.825rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 4px 10px;
                border-radius: 4px;
                background: rgba(255, 229, 0, 0.2);
                min-height: unset;
            }

            .pay {
                color: #FBAB1B;
                font-size: 0.825rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 4px 10px;
                border-radius: 4px;
                background: rgba(251, 171, 27, 0.2);
                min-height: unset;
            }

            .clear {
                color: #21EF89;
                font-size: 0.825rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 4px 10px;
                border-radius: 4px;
                background: rgba(33, 239, 137, .2);
                min-height: unset;
            }

            .cancelled {
                color: #FF3434;
                font-size: 0.825rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 4px 10px;
                border-radius: 4px;
                background: rgba(255, 52, 52, 0.2);
                min-height: unset;
            }
        }
    }
}

.info {
    margin-top: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;

    .card-desc {
        text-align: center;
        margin: 15px 10px;
    }

    .card-title {
        background: url("../../../assets/images/earn-money/panel-header-bg.png") center center no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        line-height: 15px;
        vertical-align: middle;
        text-transform: uppercase;
        text-align: center;
        padding: 10px 40px;
        width: fit-content;
        margin: -13px auto 0px auto;
    }

    .card-table {
        text-align: center;
        font-family: "Manrope", sans-serif;
        font-size: 10px;
        color: #000;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        thead {
            th {
                color: #ffffff80;
                font-weight: 700;
                font-size: 12px;
                min-width: 100px;
            }
        }

        tbody {
            td {
                color: #fff;
                padding: 10px 4px;
                font-size: 12px;
            }

            tr {
                &:nth-child(odd) {
                    background: #ffffff0d;
                }
            }
        }
    }
}

.date-field {
    :deep(.q-field__append) {
        width: 100%;
        justify-content: flex-end;
        position: absolute;
        right: 2%;
        top: 50%;
        transform: translate(0%, -50%);
    }
}
</style>
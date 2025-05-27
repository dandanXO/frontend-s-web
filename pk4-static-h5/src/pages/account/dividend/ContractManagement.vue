<template>
    <div class="container">
        <div class="filters">
            <InputField :isDark="true">
                <template #input>
                    <q-input class="input" v-model="formDetail.realName" outlined clearable hide-bottom-space>
                        <template v-slot:append>
                            <q-btn class="primary-btn" color="primary" :label="$t('btn.confirm')" @click="() => { }" />
                        </template>
                    </q-input>
                </template>
            </InputField>
        </div>

        <div class="info panel bordered">
            <table class="card-table" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="text-align: center">
                <tbody>
                    <tr v-for="downline, index in downlineInfo" :key="index">
                        <td><img src="../../../assets/images/account/dividend/avatar-icon.png" /></td>
                        <td class="user">{{ downline.loginName }}</td>
                        <td class="user">{{ (downline.commission * 100).toFixed(0) }}%</td>
                        <td v-if="downline.commission === 0" class="create-contract-btn" @click="() => createContract(downline)">create contract</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <q-dialog v-model="isShowContractDialog" width="100%">
            <div class="contract-dialog">
                <div class="downline"><img src="../../../assets/images/account/dividend/avatar-icon.png" />{{ selectedContract.loginName }}</div>

                <div class="row">
                    <div>{{ $t('dividend.rate') }} ({{ parseFloat((selectedContract.commission * 100).toFixed(0)) }}%)</div>
                    <div>
                        <select v-model="selectedContract.commission" style="width:100%">
                            <option v-for="rate in availableCommissionRates" :key="rate" :value="rate">{{ (rate * 100).toFixed(0) }}%</option>
                        </select>

                    </div>
                </div>

                <div class="action-btns">
                    <div class="cancel-btn" @click="selectedContract = null">{{ $t('btn.cancel') }}</div><div class="submit-btn" @click="editCommission(selectedContract.affiliateId)">{{ $t('btn.submit') }}</div>
                </div>
            </div>
        </q-dialog>
    </div>
</template>

<script setup>
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive, onMounted, computed, onActivated } from 'vue';
import { api } from 'src/boot/axios';
import { userStore } from 'src/stores';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const qs = require('qs');
const activeMemberDividendRateData = ref([]);
const formDetail = reactive([]);
const isLoading = ref(false);
const store = userStore();
const downlineInfo = ref([]);
const selectedContract = ref(null);
const isShowContractDialog = computed(() => selectedContract.value !== null)
const $q = useQuasar();
const { t } = useI18n();

const createContract = (downline) => {
    selectedContract.value = downline;
}

function convertStartDate(date) {
    return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
    size: 20,
    current: 1,
    regTime: [convertStartDate(new Date()), convertDate(new Date())],
    loginName: null,
    memberTypes: "AFFILIATE",
    status: true
});

const availableCommissionRates = computed(() => {
    const highestDividendRate = parseFloat((activeMemberDividendRateData.value.reduce((max, item) => item.commissionRate > max ? item.commissionRate : max, 0) * 100).toFixed(2));

    if(highestDividendRate === 40) {
        return [0.15, 0.10, 0.05];
    }
    
    if(highestDividendRate === 35) {
        return [0.10, 0.05];
    }
    
    if(highestDividendRate === 30) {
        return [0.05];
    }
    
    if(25 <= highestDividendRate) {
        return [];
    }

    return [];
});

const editCommission = (affId) => {
    const params = {
        affiliateId: affId,
        siteId: 26,
        commission: selectedContract.value.commission
    }
    api.post('/session/affiliate/edit-commission?_method=PUT', qs.stringify(params)).then((res) => {
        if(res.code === 0) {
            selectedContract.value = null;
            $q.notify({
              type: "positive",
              position: "top",
              message: t('notify.success'),
              icon: "check_circle_outline"
            });
            initData();
        }
    })
}

const initData = () => {
    const requestCopy = { ...request };
    const query = {};
    Object.entries(requestCopy).forEach(([key, value]) => {
        if (value) {
            query[key] = value;
        }
    });

    if (request.regTime !== null) {
        if (request.regTime.length === 2) {
            query.regTime = JSON.parse(JSON.stringify(request.regTime))

            query.regTime[0] = '2020-01-01'
            query.regTime[1] = moment(query.regTime[1]).format('YYYY-MM-DD')

            query.regTime = query.regTime.join(',')
        } else {
            query.regTime = moment(request.regTime[0]).format(
                'YYYY-MM-DD'
            )
        }
    }

    query.recordTime = query.regTime;
    query.loginName = request.loginName;

    if (request.status !== null) {
        query.status = request.status = true;
    }

    query.siteId = 26;
    query.id = store.memberId;

    api.get('/session/affiliate/get-downline-commission', {
        params: query
    }).then((res) => {
        downlineInfo.value = res.data;
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    });

    api.get('/session/affiliate/get-commission-tier').then((res) => {
        activeMemberDividendRateData.value = res.data;
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    })
}

onMounted(() => {
    initData();
})

onActivated(() => {
    initData();
})

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
}

.filters {
    display: flex;
    justify-content: space-between;

    :deep(.landing-input) {
        width: 100%;
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
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
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

                &.user {
                    text-align: left;
                }

                &.create-contract-btn {
                    color: #FF9500;
                    font-weight: 700;
                    text-align: right;
                    padding-right: 10px;
                }
            }

            tr {
                &:nth-child(odd) {
                    background: #ffffff0d;
                }

                &:nth-child(even) {
                    background: #0665D3;
                }
            }
        }
    }
}

.primary-btn {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    box-shadow: 0px 0.5px 2px 0px #0667D599;
    min-width: 100px;
    max-width: 120px;
    font-weight: bold;
}
</style>

<style lang="scss">
.contract-dialog {
    background-color: white;
    width: 300px;
    height: 180px;
    padding: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .downline {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-weight: 700;
    }

    .row {
        display: grid;
        grid-template-columns: 100px 1fr;
        align-items: center;
    }

    .action-btns {
        display: flex;
        gap: 10px;
    }

    .cancel-btn, .submit-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
            filter: brightness(1.1);
        }

        &:active {
            transform: translateY(2px);
        }
    }

    .cancel-btn {
        width: 144px;
        height: 38px;
        border-radius: 3.51px;
        background-color: #BCDCFF;
    }

    .submit-btn {
        width: 144px;
        height: 38px;
        border-radius: 3.51px;
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        color: white;
    }
}
</style>
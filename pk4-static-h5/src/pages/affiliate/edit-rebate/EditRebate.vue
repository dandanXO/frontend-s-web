<template>
    <div class="my-dividend-container">
        <div class="filter">
            <InputField :isDark="true">
                <template #input>
                    <q-input class="input" v-model="request.loginName" outlined clearable hide-bottom-space>
                        <template v-slot:append>
                            <q-btn class="confirm-btn" color="primary" :label="$t('btn.confirm')" @click="loadBetRecords" />
                        </template>
                    </q-input>
                </template>
            </InputField>
        </div>

        <div class="header">
            <div class="username">
                <img src="../../../assets/images/affiliate/team-management/username-icon.png" />
                <div>{{ store.nickName }}</div>
            </div>
            <div style="color: #21EF89;">Total: {{ page.total }}</div>
        </div>

        <div class="detailed-stats panel bordered" v-for="record, index in page.records" :key="index">
            <div class="header">
                <div class="group">
                    <span>{{ record.nickName }}</span>
                </div>
                <div class="link">{{ record.belongType }}</div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="row">
                    <div class="label">Deposit</div>
                    <div class="value">{{ record.totalDeposit }}</div>
                </div>
                <div class="row">
                    <div class="label">Withdrawal</div>
                    <div class="value">{{ record.totalWithdrawal }}</div>
                </div>
                <div class="row">
                    <div class="label">Bonus</div>
                    <div class="value">{{ record.totalBonus }}</div>
                </div>
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value valid-bet">{{ record.totalValidBet }}</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value win-loss">{{ record.totalPayout }}</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Profit and Loss</div>
                        <div class="value profit-loss">{{ record.totalOayout - record.totalValidBet }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { api } from 'src/boot/axios';
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive, onMounted } from 'vue';
import moment from 'moment';
import { userStore } from 'src/stores';

const formDetail = reactive([]);
const store = userStore();

const page = reactive({
    pages: 0,
    records: [],
    loading: false,
    total: 0,
    sums: {
        total: 0,
        totalBet: 0.0000,
        totalPayout: 0.0000,
        totalValidBet: 0.0000
    }
});

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

const loadBetRecords = async () => {
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

            query.regTime[0] = moment(query.regTime[0]).format('YYYY-MM-DD')
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
    const { data: ret } = await api.get('/session/affiliate/downline', {
        params: query
    });
    page.pages = ret.pages;
    if (ret.sums !== null && ret.sums !== undefined) {
        page.total = ret.total;
        page.records = ret.records;
        page.totalBet = ret.sums.totalBet;
        page.totalPayout = ret.sums.totalPayout;
        page.totalCompanyProfit = ret.sums.totalBet - ret.sums.totalPayout;
    }
    page.loading = false;
}

onMounted(() => {
    loadBetRecords();
})
</script>

<style lang="scss" scoped>
:deep(.landing-input) {
    width: 100%;
}

.tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .tab-item {
        padding: 2px 20px;
        border-radius: 20px;

        &.active {
            text-align: center;
            background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        }
    }
}

.filter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .datetime-dropdown {
        color: #FFFFFF80;
    }
}

.my-dividend-container {
    display: flex;
    flex-direction: column;
}

.dropdown,
.input {
    margin-bottom: 10px;
}

.dropdown {
    width: 70%;
}

.separator {
    border: 0.97px solid #FFFFFF1A;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 15px;
    line-height: 11px;
    letter-spacing: 0px;
    margin-bottom: 15px;

    .username {
        display: flex;
        align-items: center;

        >* {
            margin-right: 10px;
        }
    }

    .filter {
        display: flex;
        align-items: center;

        .filter-value {
            color: #B2BDBF;
            font-weight: 400;
            font-size: 12px;
            line-height: 100%;

        }

        >* {
            margin-left: 10px;
        }
    }

    .group {
        display: flex;
        align-items: center;

        >* {
            margin-right: 18px;
        }
    }

    .link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 8px;
        background-color: #252C46;
        color: #fff;
    }
}

.detailed-stats {
    margin-bottom: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;
    padding: 10px;


    .col {
        display: flex;
        justify-content: space-between;

        .col-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .label {
                font-weight: 400;
                font-size: 13px;
                line-height: 15px;
                letter-spacing: 0px;
                color: #B2BDBF;
                width: 100%;
                margin-bottom: 10px;
            }

            .valid-bet {
                color: #EF2121;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .win-loss {
                color: #218FEF;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .profit-loss {
                color: #21EF89;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
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
            width: 15%;
            justify-content: center;

            .num {
                background-color: #49283A;
                color: #FF3434;
                padding: 2px 5px;
                border-radius: 20px;
            }
        }

        .label {
            width: 55%;
            text-align: left;
        }

        .value {
            width: 30%;
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
            }

            tr {
                &:nth-child(odd) {
                    background: #ffffff0d;
                }
            }
        }
    }
}

.confirm-btn {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    box-shadow: 0px 0.5px 2px 0px #0667D599;
    min-width: 100px;
    max-width: 120px;
    font-weight: bold;
}
</style>
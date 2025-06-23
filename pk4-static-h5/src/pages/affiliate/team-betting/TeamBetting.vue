<template>
    <div class="my-dividend-container">

        <div class="tabs">
            <div class="tab-item" :class="{ active: typesSelection.label === 'ALL' }" @click="typesSelection.label = 'ALL'">ALL</div>
            <div class="tab-item" :class="{ active: typesSelection.label === 'SLOT' }" @click="typesSelection.label = 'SLOT'">SLOT</div>
            <div class="tab-item" :class="{ active: typesSelection.label === 'LIVE' }" @click="typesSelection.label = 'LIVE'">LIVE</div>
            <div class="tab-item" :class="{ active: typesSelection.label === 'SPORT' }" @click="typesSelection.label = 'SPORT'">SPORT</div>
            <div class="tab-item" :class="{ active: typesSelection.label === 'FISH' }" @click="typesSelection.label = 'FISH'">FISH</div>
            <div class="tab-item" :class="{ active: typesSelection.label === 'POKER' }" @click="typesSelection.label = 'POKER'">POKER</div>
        </div>

        <div class="filter">
            <InputField :isDark="true">
                <template #input>
                    <q-input class="input" v-model="request.loginName" outlined clearable hide-bottom-space>
                        <template v-slot:append>
                            <q-btn class="get-code-btn" color="primary" :label="$t('btn.confirm')" @click="loadBetRecords" />
                        </template>
                    </q-input>
                </template>
            </InputField>
        </div>

        <div class="date-filter filter">
            <InputField :isDark="true">
                <template #input>
                    <q-input readonly class="dropdown" outlined v-model="typesSelection.label" @click="openTypeSelectionDialog" dense
                        :display-value="'Types'" />
                </template>
            </InputField>
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="request.platform" :options="vendorsList" option-label="name" option-value="code" dense 
                        label="Vendors" emit-value map-options/>
                </template>
            </InputField>
            <InputField :isDark="true">
                <template #input>
                    <q-input readonly class="dropdown" outlined v-model="daysSelection.label" @click="openDaySelectionDialog" dense placeholder="Date" />
                </template>
            </InputField>
        </div>

        <div class="detailed-stats panel bordered" v-for="record, index in page.records" :key="index">
            <div class="header">
                <div class="group">
                    <span>{{ record.gameType }}</span>
                </div>
                <div class="link">{{ record.loginName }}</div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">{{ record.gameName }}</div>
                        <div class="value green-text">{{ record.competitionName }}</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value red-text">{{ record.validBet }}</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value blue-text">{{ record.payout }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <q-dialog width="100%" v-model="isDaySelectionDialog" persistent>
        <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
        <div class="popout-dialog-container">

            <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg x-n-container">
            <div class="filter-grid">
                <div class="filter-item" :class="{ active: daysSelection.label === 'Today' }"
                @click="changeDaySelection('Today')">Today</div>
                <div class="filter-item" :class="{ active: daysSelection.label === 'Yesterday' }"
                @click="changeDaySelection('Yesterday')">Yesterday</div>
                <div class="filter-item" :class="{ active: daysSelection.label === '7-days' }"
                @click="changeDaySelection('7-days')">7-days</div>
                <div class="filter-item" :class="{ active: daysSelection.label === 'This Month' }"
                @click="changeDaySelection('This Month')">This Month</div>
            </div>

            <div style="display:flex;">
                <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
                <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="confirmDaySelection" />
            </div>
            </div>
        </div>
        </div>
    </q-dialog>

    <q-dialog width="100%" v-model="isTypeSelectionDialog" persistent>
        <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
        <div class="popout-dialog-container">

            <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg x-n-container">
            <div class="filter-grid">
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'ALL' }"
                @click="changeTypeSelection('ALL')">ALL</div>
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'SLOT' }"
                @click="changeTypeSelection('SLOT')">SLOT</div>
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'LIVE' }"
                @click="changeTypeSelection('LIVE')">LIVE</div>
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'SPORT' }"
                @click="changeTypeSelection('SPORT')">SPORT</div>
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'FISH' }"
                @click="changeTypeSelection('FISH')">FISH</div>
                <div class="filter-item" :class="{ active: dialogTypesSelection.label === 'POKER' }"
                @click="changeTypeSelection('POKER')">POKER</div>
            </div>

            <div style="display:flex;">
                <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
                <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="confirmTypeSelection" />
            </div>
            </div>
        </div>
        </div>
    </q-dialog>
</template>

<script setup>
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive, onMounted } from 'vue';
import { api } from 'boot/axios';
import { userStore } from "src/stores";
import moment from 'moment';


const store = userStore();
const formDetail = reactive([]);
const selectedTab = ref('All');

const vendorsList = ref([]);

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

const isDaySelectionDialog = ref(false)
const daysSelection = ref({ label: '7-days', value: 7 });
const openDaySelectionDialog = () => {
  isDaySelectionDialog.value = true
}

const changeDaySelection = (type) => {
  daysSelection.value = { label: type, value: type };
}

const confirmDaySelection = () => {
  isDaySelectionDialog.value = false;
}

const isTypeSelectionDialog = ref(false)
const typesSelection = ref({ label: 'ALL', value: 'ALL' });
const dialogTypesSelection = ref({ label: 'ALL', value: 'ALL' });

const openTypeSelectionDialog = () => {
  dialogTypesSelection.value = typesSelection.value;
  isTypeSelectionDialog.value = true;
}

const changeTypeSelection = (type) => {
  dialogTypesSelection.value = { label: type, value: type };
}

const confirmTypeSelection = () => {
  typesSelection.value = dialogTypesSelection.value;
  isTypeSelectionDialog.value = false;
  loadBetRecords();
}

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

const request = reactive({
  size: 20,
  current: 1,
  betTime: [convertStartDate(new Date()), convertDate(new Date())],
  loginName: null,
  platform: null,
  gameType: [],
  status: ["SETTLED", "CANCEL"],
  affiliateId: null,
});

const loadBetRecords = async () => {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.betTime !== null) {
    if (request.betTime.length === 2) {
      query.betTime = request.betTime.join(",");
    }
  }
  if (request.status !== null) {
    if (request.status.length === 1) {
      query.status = request.status[0];
    } else {
      query.status = request.status.join(",");
    }
  }
  query.siteId = 26;
  if (typesSelection.value.label !== 'ALL') {
    query.gameType = typesSelection.value.label;
  } 
//   if (query.gameType === 'SPORT') {
//     query.gameType = 'SPORT,ESPORT';
//   } else if (query.gameType === 'FISH') {
//     query.gameType = 'FISH,CASUAL';
//   } else if (query.gameType === 'LIVE') {
//     query.gameType = 'LIVE,POKER';
//   }
  const { data: ret } = await api.get('/session/affiliate/bet-records', {
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

const initData = () => {
    loadBetRecords();
}
const initVendors = () => {
    api.get('session/affiliate/platforms').then((res) => {
        vendorsList.value = res.data;
    })
}

onMounted(() => {
    initData();
    initVendors();
})
</script>

<style lang="scss" scoped>
.date-filter {
    :deep(.landing-input) {
        width: 33%;

        .dropdown {
            width: 95%;
        }
    }
}

.filter {
    :deep(.landing-input) {
        width: 100%;
    }
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
            margin-right: 10px;
        }
    }

    .link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 8px;
        background-color: #42392A;
        color: #FBAB1B;
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

            .red-text {
                color: #EF2121;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .blue-text {
                color: #218FEF;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .green-text {
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

.get-code-btn {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    box-shadow: 0px 0.5px 2px 0px #0667D599;
    min-width: 100px;
    max-width: 120px;
    font-weight: bold;
}

.popout-dialog-container {
  .filter-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;

    .filter-item {
      margin: 5px;
      border-radius: 4px;
      background: #EAEFF9;
      padding: 8px 12px;
      white-space: nowrap;

      &.active {
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        color: #fff;
      }
    }
  }
}
</style>
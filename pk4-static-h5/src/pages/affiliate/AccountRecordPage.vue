<template>
  <div class="acc-record-container q-pa-md">
    <div class="acc-record-options">
      <InputField :isDark="true">
        <template #input>
          <q-select
            class="dropdown"
            outlined
            v-model="recordType"
            :options="options"
            option-value="value"
            option-label="label"
            dense
            emit-value
            map-options
            popup-content-class="custom-dropdown"
            @update:model-value="onSelectChange"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    :src="require(`../../assets/images/account/account-record/${scope.opt.icon}.png`)"
                    alt=""
                    width="20"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:selected>
              <div class="row items-center no-wrap">
                <img
                  :src="
                    require(`../../assets/images/account/account-record/${
                      options.find((o) => o.value === recordType)?.icon
                    }.png`)
                  "
                  alt=""
                  width="20"
                  class="q-mr-sm"
                />

                <span>
                  {{ options.find((o) => o.value === recordType)?.label }}
                </span>
              </div>
            </template>
          </q-select>
        </template>
      </InputField>

      <InputField :isDark="true">
        <template #input>
          <div class="date-field">
            <q-input filled :model-value="formattedDateRange" readonly>
              <template v-slot:append>
                <img src="../../assets/images/earn-money/calendar-icon.svg" />
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="searchForm.startDate"
                    mask="YYYY-MM-DD"
                    range
                    @update:model-value="onSelectChangeDate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </template>
            </q-input>
          </div>
        </template>
      </InputField>
    </div>

    <InputField :isDark="true">
      <template #input>
        <q-input
          class="input"
          v-model="moneyChangeByType.loginName"
          outlined
          hide-bottom-space
          @update:model-value="filterSuggestions"
          :loading="loadingSuggestions"
        >
          <template v-slot:append>
            <q-btn
              class="get-code-btn"
              color="primary"
              :label="$t('btn.confirm')"
              :disable="!moneyChangeByType.loginName"
              @click="confirmSelection"
            />
          </template>
        </q-input>
      </template>
    </InputField>

    <div v-if="filteredShow">
      <div class="downline-list">
        <template v-for="(item, index) in filteredDownLinesRecords" :key="index">
          <div class="downline-item" @click="setRecordItem(item)">
            <div class="item-icon"><q-icon name="person" /></div>
            <div class="item-name">{{ item.loginName }}</div>
          </div>
        </template>
      </div>
    </div>

    <div>
      <q-table flat bordered grid :rows="downLinesRecordsView" hide-pagination row-key="name" hide-header no-caps />

      <div class="pagination">
        <q-btn
          @click="prevPage"
          :disabled="moneyChangeByType.current === 1"
          icon="chevron_left"
          class="rounded-borders"
          color="neonblue"
        ></q-btn>
        <span>{{ moneyChangeByType.current }} / {{ moneyChangeByType.pages }}</span>
        <q-btn
          @click="nextPage"
          :disabled="moneyChangeByType.current === moneyChangeByType.pages || moneyChangeByType.pages === 0"
          icon="chevron_right"
          class="rounded-borders"
          color="neonblue"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { api } from "src/boot/axios";
import { userStore } from "stores/index";
import InputField from "src/components/auth/InputField.vue";

const store = userStore();
const qs = require("qs");
const formDetail = reactive({ loginName: "" });
const downLinesRecords = ref([]);
const filteredDownLinesRecords = ref([]);
const downLinesRecordsView = ref([]);
const loadingSuggestions = ref(false);
const recordType = ref("ALL");
const options = ref([
  {
    label: "All",
    value: "ALL",
    icon: "icon-all"
  },
  {
    label: "Deposit",
    value: "DEPOSIT",
    icon: "icon-deposit"
  },
  {
    label: "Withdrawal",
    value: "WITHDRAW",
    icon: "icon-withdraw"
  },
  {
    label: "Betting",
    value: "BET",
    icon: "icon-betting"
  },
  {
    label: "Bonus",
    value: "PROMO",
    icon: "icon-bonus"
  },
  {
    label: "Rebate",
    value: "VIP_REBATE",
    icon: "icon-all"
  },
  {
    label: "Dividend",
    value: "TRANSFER",
    icon: "icon-winning"
  }
]);

const today = new Date();
const dayBefore = new Date();
dayBefore.setDate(today.getDate() - 30); // 30days before
const formatDate = (date) => date.toISOString().split("T")[0];

const searchForm = reactive({
  startDate: {
    from: formatDate(dayBefore),
    to: formatDate(today)
  },
  endDate: "",
  platform: ""
});

const formattedDateRange = computed(() => {
  const range = searchForm.startDate;
  if (!range || typeof range === "string") return "";
  const { from, to } = range;
  return `${formatDateToSlash(from)} ~ ${formatDateToSlash(to)}`;
});

const formatDateToSlash = (str) => {
  if (!str || typeof str !== "string" || !str.includes("-")) return "";
  const [year, month = "01", day = "01"] = str.split("-");
  // return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
  return `${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
};

const getAllDownlines = () => {
  api
    .get(`/session/affiliate/getAllDownlines`)
    .then((res) => {
      if (res.code === 0) {
        downLinesRecords.value = res.data;
        // filteredDownLinesRecords.value = downLinesRecords.value;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};

const filterSuggestions = () => {
  const query = moneyChangeByType.loginName.trim().toLowerCase();
  if (!query) {
    // filteredDownLinesRecords.value = downLinesRecords.value;
    filteredDownLinesRecords.value = [];
    return;
  }

  filteredDownLinesRecords.value = downLinesRecords.value.filter((item) =>
    item.loginName.toLowerCase().includes(query)
  );
  filteredShow.value = true;
};

const confirmSelection = () => {
  if (!moneyChangeByType.loginName) return;
  getDownlineMemberDetails();
};

const moneyChangeByType = reactive({
  current: 1,
  size: 10,
  // startDate: formatDate(dayBefore),
  // endDate: formatDate(today),
  startDate: searchForm.startDate.from,
  endDate: searchForm.startDate.to,
  type: "ALL",
  loginName: "",
  total: 0,
  pages: 0
});

const getDownlineMemberDetails = () => {
  const params = {
    current: moneyChangeByType.current,
    size: moneyChangeByType.size,
    startDate: searchForm.startDate.from,
    endDate: searchForm.startDate.to,
    loginName: moneyChangeByType.loginName
    // ...(moneyChangeByType.type !== null && { type: moneyChangeByType.type })
  };

  if (moneyChangeByType.type === "ALL") {
    delete params.type;
  } else {
    params.type = moneyChangeByType.type;
  }

  api
    .get(`/session/member/moneyChangeByType`, { params })
    .then((res) => {
      if (res.code === 0) {
        downLinesRecordsView.value = res.data.records;
        moneyChangeByType.current = res.data.current;
        moneyChangeByType.pages = res.data.pages;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};

const setPreLoginName = () => {
  moneyChangeByType.loginName = store.nickName;
};

const filteredShow = ref(false);

const setRecordItem = (item) => {
  console.log(item);
  moneyChangeByType.loginName = item.loginName;
  getDownlineMemberDetails();
  filteredShow.value = false;
};

const prevPage = () => {
  if (moneyChangeByType.current > 1) {
    moneyChangeByType.current--;
    getDownlineMemberDetails();
  }
};

const nextPage = () => {
  if (moneyChangeByType.current < moneyChangeByType.pages) {
    moneyChangeByType.current++;
    getDownlineMemberDetails();
  }
};

const onSelectChange = (value) => {
  moneyChangeByType.type = value;
  getDownlineMemberDetails();
};

const onSelectChangeDate = () => {
  getDownlineMemberDetails();
};

onMounted(() => {
  setPreLoginName();
  getAllDownlines();
  getDownlineMemberDetails();
});
</script>

<style lang="scss" scoped>
.acc-record-container {
  display: flex;
  flex-direction: column;
}

.dropdown,
.input {
  margin-bottom: 10px;
}

.dropdown {
  // width: 50%;
}

.acc-record-options {
  display: flex;
  justify-content: space-between;
  gap: 16px;

  :deep(.form-field-label) {
    display: none;
  }

  :deep(.landing-input) {
    width: 100%;
  }
}

.date-field {
  display: flex;
  align-items: center;
  // width: 50%;

  span {
    color: #ffffff99;
    padding: 0px 12px;
  }

  .q-field {
    // padding: 8px 0px;
    background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);
    border-radius: 12px;
  }

  .q-field__native {
    padding: 0;
    color: #b0b0b0;
  }
}

.separator {
  border: 0.97px solid #ffffff1a;
}

.detailed-stats {
  margin-top: 26px;
  border-radius: 10px;
  border: 1px solid #ffffff1a;
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
    color: #b2bdbf;
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
  border: 1px solid #ffffff1a;

  .card-desc {
    text-align: center;
    margin: 15px 10px;
  }

  .card-title {
    // background: url("../../../assets/images/earn-money/panel-header-bg.png") center center no-repeat;
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
  background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  color: #fff;
  box-shadow: 0px 0.5px 2px 0px #0667d599;
  min-width: 100px;
  max-width: 120px;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  align-items: center;
}
</style>

<style scoped>
.custom-dropdown {
  background: #ffffff !important;

  .q-item {
    color: #363c4a;
    background: #ffffff !important;
  }
  .q-item--active {
  }
}

.downline-list {
  border-radius: 8px;
  overflow: hidden;
  .downline-item {
    display: flex;
    padding: 12px;
    background: #293348;
    align-items: center;
    gap: 8px;

    .item-icon {
      font-size: 20px;
      border-radius: 50%;
      background-color: #507ce8;
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .item-name {
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>

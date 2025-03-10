<template>
  <q-dialog v-model="_modelValue" @show="getRecords">
    <div class="record-dialog-inner-wrapper">
      <div class="tab-wrapper">
        <div class="tab" :class="{ selected: currentTab === 'invitation' }" @click="handleTabClick('invitation')">
          Registros de Convites
        </div>
        <div class="tab" :class="{ selected: currentTab === 'lottery' }" @click="handleTabClick('lottery')">
          Registros de Loteria
        </div>
      </div>

      <div>
        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel name="invitation">
            <div class="record-wrapper invitation">
              <template v-if="invitationRecords.length">
                <div v-for="(record, index) in invitationRecords" :key="index" class="record">
                  <span>{{ moment(record.referTime).format("MM-DD HH:mm:ss") }}</span>
                  <span class="name">{{ record.loginName }}</span>
<!--                  <span>Invitation successful</span>-->
                </div>
              </template>
              <span v-else class="no-record-text">Sem Registros</span>
            </div>
          </q-tab-panel>
          <q-tab-panel name="lottery">
            <div class="record-wrapper lottery">
              <template v-if="lotteryRecords.length">
                <div v-for="(record, index) in lotteryRecords" :key="index" class="record">
                  <span>{{ moment(record.time).format("MM-DD HH:mm:ss") }}</span>
                  <span class="amount">{{ `${store.currency.value} ${record.amount}` }}</span>
                </div>
              </template>
              <span v-else class="no-record-text">Sem Registros</span>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <q-inner-loading :showing="isLoading" />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import moment from "moment";
import { eventapi } from "src/boot/axios";
import { computed, ref } from "vue";
import { userStore } from "stores/index";

const store = userStore();
const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue"]);

const currentTab = ref("invitation");
const invitationRecords = ref([]);
const lotteryRecords = ref([]);
const isLoading = ref(false);

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const handleTabClick = (tab) => {
  currentTab.value = tab;
};

const getRecords = () => {
  const invitationRecordApi = eventapi.get("/refer-spin/invitation-record");
  const lotteryRecordApi = eventapi.get("/refer-spin/amount-record");
  isLoading.value = true;

  Promise.allSettled([invitationRecordApi, lotteryRecordApi])
    .then(([invitationRes, lotteryRes]) => {
      console.log(invitationRes, lotteryRes);
      if (invitationRes?.value.code === 0) {
        invitationRecords.value = invitationRes?.value.data;
      }
      if (lotteryRes?.value.code === 0) {
        lotteryRecords.value = lotteryRes?.value.data;
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>
<style lang="scss" scoped>
.record-dialog-inner-wrapper {
  width: 90%;
  max-width: 450px;
  background-color: #917ca1;
  border-radius: 14px;
  border: 1px solid #e8c4ff99;
  padding: 12px;

  .tab-wrapper {
    display: flex;
    align-items:stretch;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;

    .tab {
      flex: 1;
      background-color: #d9d9d9;
      border-radius: 12px;
      padding: 10px 8px;
      font-size: 16px;
      display:flex;
      line-height: 16px;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #666666;
      text-align: center;

      &.selected {
        background: linear-gradient(356.25deg, #3b156e -0.21%, #8100ae 93.65%);
        color: #fff;
      }
    }
  }

  .q-tab-panels {
    background: transparent;
    .q-tab-panel {
      padding: 0;
    }
  }

  .record-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #5817aa99;
    border: 1px solid #e8c4ff99;
    border-radius: 8px;
    padding: 12px 8px;
    height: 30vh;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &.invitation {
      .record {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &.lottery {
      .record {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .record {
      display: grid;
      gap: 8px;

      > span {
        white-space: wrap;
        font-size: 12px;
        color: #fff;
        &:last-child {
          text-align: right;
          text-overflow: ellipsis;
          white-space: wrap;
          //overflow: hidden;
        }
      }

      .name {
        text-overflow: ellipsis;
        white-space: wrap;
        //white-space: nowrap;
        //overflow: hidden;
      }

      .amount {
        font-weight: 900;
        color: #cd91ff;
      }
    }

    .no-record-text {
      text-align: center;
      font-weight: 700;
    }
  }
}

@media screen and (max-width: 450px) {
  .record-dialog-inner-wrapper {
    .tab-wrapper {
      .tab {
        font-size: 14px;
      }
    }
  }
}

@media screen and (max-width: 400px) {
  .record-dialog-inner-wrapper {
    .tab-wrapper {
      .tab {
        font-size: 12px;
      }
    }
  }
}
</style>

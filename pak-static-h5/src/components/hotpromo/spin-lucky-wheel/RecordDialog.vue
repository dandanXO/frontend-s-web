<template>
  <q-dialog v-model="_modelValue">
    <div class="record-dialog-inner-wrapper">
      <div class="tab-wrapper">
        <div class="tab" :class="{ selected: currentTab === 'invitation' }" @click="handleTabClick('invitation')">
          {{ $t("hotPromo.invitationRecords") }}
        </div>
        <div class="tab" :class="{ selected: currentTab === 'lottery' }" @click="handleTabClick('lottery')">
          {{ $t("hotPromo.lotteryRecords") }}
        </div>
      </div>

      <div>
        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel name="invitation">
            <div class="record-wrapper invitation">
              <template v-if="info.invitedList.length">
                <div v-for="(record, index) in info.invitedList" :key="index" class="record">
                  <span>{{ moment(record.depositDate).format("MM-DD HH:mm:ss") }}</span>
                  <span class="name">{{ record.loginName }}</span>
                  <!-- <span>Invitation successful</span> -->
                </div>
              </template>
              <span v-else class="no-record-text">
                {{ $t("hotPromo.noRecords") }}
              </span>
            </div>
          </q-tab-panel>
          <q-tab-panel name="lottery">
            <div class="record-wrapper lottery">
              <template v-if="info.records.length">
                <div v-for="(record, index) in info.records" :key="index" class="record">
                  <span>{{ moment(record.recordTime).format("MM-DD HH:mm:ss") }}</span>
                  <span class="amount"> {{$t("hotPromo.rs")}} {{ record.bonus }}</span>
                </div>
              </template>
              <span v-else class="no-record-text">
                {{ $t("hotPromo.noRecords") }}
              </span>
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
import { computed, inject, ref } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const currentTab = ref("invitation");
const invitationRecords = ref([]);
const lotteryRecords = ref([]);
const isLoading = ref(false);

const info = inject("info");

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const handleTabClick = (tab) => {
  currentTab.value = tab;
};
</script>
<style lang="scss" scoped>
.record-dialog-inner-wrapper {
  width: 90%;
  max-width: 450px;
  background-color: #860000;
  border-radius: 14px;
  padding: 12px;

  .tab-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;

    .tab {
      flex: 1;
      background-color: #d9d9d9;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 16px;
      font-weight: 700;
      color: #666666;
      text-align: center;

      &.selected {
        background: linear-gradient(356.25deg, #FF3A3E -0.21%, #CC1111 93.65%);
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
    background: #9B111399;
    border: 1px solid #c4fff799;
    border-radius: 8px;
    padding: 12px;
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
        font-size: 12px;
        color: #fff;
        &:last-child {
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }

      .name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .amount {
        font-weight: 900;
        color: #EC9823;
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

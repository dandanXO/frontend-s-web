<template>
  <q-dialog v-model="_modelValue">
    <div class="record-dialog-inner-wrapper">
      <div class="tab-wrapper">
        <div class="tab" :class="{ selected: currentTab === 'invitation' }" @click="handleTabClick('invitation')">
          Invitation records
        </div>
        <div class="tab" :class="{ selected: currentTab === 'lottery' }" @click="handleTabClick('lottery')">
          Lottery records
        </div>
      </div>

      <q-tab-panels v-model="currentTab" animated>
        <q-tab-panel name="invitation">
          <div class="record-wrapper invitation">
            <div v-for="(record, index) in invitationRecords" :key="index" class="record">
              <span>{{ moment(record.date).format("MM-DD hh:mm:ss") }}</span>
              <span class="name">{{ record.name }}</span>
              <span>Invitation successful</span>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="lottery">
          <div class="record-wrapper lottery">
            <div v-for="(record, index) in lotteryRecords" :key="index" class="record">
              <span>{{ moment(record.date).format("MM-DD hh:mm:ss") }}</span>
              <!-- <span class="name">{{ record.name }}</span> -->
              <span class="amount">500$</span>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-dialog>
</template>
<script setup>
import moment from "moment";
import { computed, ref } from "vue";

const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue"]);

const currentTab = ref("invitation");
const invitationRecords = ref(new Array(10).fill({ date: "2025-02-03 15:34:32", name: "John Doe1111" }));
const lotteryRecords = ref(new Array(10).fill({ date: "2025-02-03 15:34:32", name: "John Doe1111" }));

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
  background-color: #917ca1;
  border-radius: 14px;
  border: 1px solid #e8c4ff99;
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
        grid-template-columns: minmax(100px, 1fr) 1fr minmax(50px, 1fr);
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
        color: #cd91ff;
      }
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

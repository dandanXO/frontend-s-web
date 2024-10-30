<template>
  <div class="flex-div">
    <span>开始：</span>
    <q-input rounded outlined dense :model-value="startDate">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              :model-value="startDate"
              mask="YYYY-MM-DD"
              @update:model-value="(newDate) => searchRecord(newDate, true)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <span>结束：</span>
    <q-input rounded outlined dense :model-value="endDate">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              :model-value="endDate"
              mask="YYYY-MM-DD"
              @update:model-value="(newDate) => searchRecord(newDate, false)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script setup>
const props = defineProps({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["handleDateChange"]);

const searchRecord = (val, isStartDate) => {
  emit("handleDateChange", { val, isStartDate });
};
</script>
<style lang="scss">
.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 14px;
    padding-left: 5px;
    min-width: 50px;

    &:nth-child(3) {
      margin-left: 10px;
    }

    &.select-stage {
      min-width: 80px;
    }
  }
}
</style>

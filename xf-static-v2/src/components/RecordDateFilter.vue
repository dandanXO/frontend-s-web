<template>
  <div class="flex-div">
    <span>日期：</span>
    <q-input readonly rounded outlined dense :model-value="startDate" color="white" bg-color="recinputstyle">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              color="recinputstyle"
              :model-value="startDate"
              mask="YYYY-MM-DD"
              @update:model-value="(newDate) => searchRecord(newDate, true)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="white" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <span>—</span>
    <q-input readonly rounded outlined dense :model-value="endDate" color="white" bg-color="recinputstyle">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              color="recinputstyle"
              :model-value="endDate"
              mask="YYYY-MM-DD"
              @update:model-value="(newDate) => searchRecord(newDate, false)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="white" flat />
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
  gap: 0;
  span {
    font-size: 14px;
    min-width: 50px;
    text-align: center;

    &.select-stage {
      min-width: 80px;
    }
  }
}

.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: double;
}

.q-field--outlined.q-field--rounded .q-field__control {
  border-radius: 8px;
}

.q-field--readonly.q-field--float .q-field__native,
.q-field--readonly.q-field--float .q-field__input {
  color: white;
}
</style>

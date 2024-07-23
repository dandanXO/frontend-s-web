<template>
  <div>
    <div class="dailylogin">
      <div class="dailylogin-title">
        <img src="../../../assets/images/promotion/hotpromo/dailylogin/cal.png" />
        <div>{{ t('promo.check_in_detail_for_this_month') }}</div>
      </div>
      <div class="months">
        <div
          @click="mth.checkInActive ? checkIn(mth) : null"
          v-for="(mth, index) in dateDetails"
          :key="index"
          class="mth"
          :class="{
            'check-in': mth.checkInActive,
            'checked-in': mth.isCheckedIn
          }"
        >
          <div class="day">
            {{ index + 1 }}
            <span class="times">{{ t('promo.times') }}</span>
          </div>
          <div class="number">+ {{ mth.number }}</div>
          <el-button v-if="mth.checkInActive" class="common-btn" style="width:90%">{{ t('promo.check_in_now') }}</el-button>
          <el-button v-else-if="mth.isCheckedIn" class="common-btn" style="width:90%">{{ t('promo.check_in_now') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { checkInInfo, signIn } from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const dateDetails = ref([]);
const init = () => {
  loadDailyCheckIn();
};

const checkInDetails = ref();
const loadDailyCheckIn = () => {
  checkInInfo().then((res) => {
    if (res.code === 0) {
      checkInDetails.value = res.data;
      generateMonthMaxDaysArray(checkInDetails.value);
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  });
};
const generateMonthMaxDaysArray = (details) => {
  // Clear the array to ensure it's empty before generating
    dateDetails.value = [];

    // Generate the array of objects based on monthMaxDays
    for (let i = 0; i < details.monthMaxDays; i++) {
      dateDetails.value.push({
        number: details?.signBonus?.[i],
        checkInActive: false,
        isCheckedIn: false
      });
    }
    getCheckInDays(details);
};
const getCheckInDays = (details) => {
  // Get checked in days
  dateDetails.value.forEach((date, dateIndex) => {
    if (dateIndex < details.monthCount) {
      date.isCheckedIn = true;
    }
    if (details.dayCount === 0) {
      const indexToSetActive = details.monthCount;
      // Check if the index is found
      if (indexToSetActive !== -1) {
        // Set checkInActive to true for the specific index
        dateDetails.value[indexToSetActive].checkInActive = true;
      }
    }
  });
}
const checkIn = (mth) => {
  signIn().then((res) => {
    if (res.code === 0) {
      mth.isCheckedIn = true;
      ElMessage({
        type: "success",
        message: t('common.claimedSuccess')
      });
      getCheckInDays(res.data)
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  });
};
onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped>
.dailylogin {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

  box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .dailylogin-title {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 40px;
  }
  .months {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    column-gap: 40px;
    padding: 30px 30px 20px;
    background: #ffffffcc;
    .mth {
      &.check-in {
        cursor: pointer;
        background: url(../../../assets/images/promotion/hotpromo/dailylogin/sign.png) no-repeat center center;
        width: 150px;
        padding: 20px;
      }
      &.checked-in {
        cursor: pointer;
        background: url(../../../assets/images/promotion/hotpromo/dailylogin/signed.png) no-repeat center center;
        width: 150px;
        padding: 20px;

        .common-btn {
          filter: grayscale(1);
        }

        .number {
          color: #434343;
        }
      }
      &.non-active {
        background: none;
        .number {
          color: #6e6e6e;
        }
        .day {
          color: #6e6e6e;
        }
      }
      width: calc((100% - (40px * 6)) / 7);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #4c4c6c;
      height: 200px;
      padding-bottom: 55px;
      .day {
        font-size: 40px;
        .times {
          font-size: 20px;
        }
      }
      .number {
        color: #2095ff;
        font-size: 20px;
      }
    }
  }
}
</style>

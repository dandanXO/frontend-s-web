<template>
  <div>
    <div class="dailylogin">
      <div class="dailylogin-title">
        <img src="../../../assets/images/promotion/hotpromo/dailylogin/cal.png" />
        本月签到明细
      </div>
      <div class="months">
        <div
          @click="mth.isCheckedIn = true"
          v-for="(mth, index) in dateDetails"
          :key="index"
          class="mth"
          :class="{ 'check-in': mth.checkInActive, 'checked-in': mth.isCheckedIn }"
        >
          <div class="day">
            {{ index + 1 }}
            <span class="times">次</span>
          </div>
          <div class="number">+ {{ mth.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { checkInInfo } from "@/api/index/promo";

const dateDetails = ref([]);
const init = () => {
  loadDailyCheckIn();
};

const checkInDetails = ref();
const loadDailyCheckIn = () => {
  checkInInfo().then((res) => {
    if (res.code === 0) {
      checkInDetails.value = res.data;
      generateMonthMaxDaysArray(checkInDetails.value.monthMaxDays);
    }
  });
};
const generateMonthMaxDaysArray = (monthMaxDays) => {
  // Clear the array to ensure it's empty before generating
  dateDetails.value = [];

  // Generate the array of objects based on monthMaxDays
  for (let i = 0; i < monthMaxDays; i++) {
    dateDetails.value.push({
      number: 7,
      checkInActive: true,
      isCheckedIn: false
    });
  }
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
    color: #ffffff;
    font-size: 40px;
  }
  .months {
    background: #ffffff;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    column-gap: 40px;
    padding: 40px;
    background: radial-gradient(#73b2ff 0%, #3981ff 100%);
    .mth {
      &.check-in {
        cursor: pointer;
        background: url(../../../assets/images/promotion/hotpromo/dailylogin/sign.png) no-repeat center center;
      }
      &.checked-in {
        cursor: pointer;
        background: url(../../../assets/images/promotion/hotpromo/dailylogin/signed.png) no-repeat center center;
        .number {
          color: #434343;
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

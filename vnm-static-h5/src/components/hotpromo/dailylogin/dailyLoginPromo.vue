<template>
  <div>
    <div class="dailylogin">
      <div class="dailylogin-title">
        <div><img src="../../../assets/images/promo/hotpromo/dailylogin/cal.png" /></div>
        <div>{{ $t("lang.daily_login_title") }}</div>
      </div>
      <div class="months">
        <div
          @click="mth.checkInActive ? checkInOfTheDay(mth) : null"
          v-for="(mth, index) in dateDetails"
          :key="index"
          class="mth"
          :class="{ 'check-in': mth.checkInActive, 'checked-in': mth.isCheckedIn, 'today-checked-in': todayCheckedIn }"
        >
          <div class="day">
            {{ index + 1 }}
            <span class="times">{{ $t("lang.daily_times") }}</span>
          </div>
          <div class="number">+{{ mth.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n();
const dateDetails = ref([]);
const todayCheckedIn = ref(false);

const init = (maxDays, dayCount, monthCount) => {
  dateDetails.value = [];
  if (dayCount > 0) todayCheckedIn.value = true;
  const totalItems = maxDays;
  for (let i = 0; i < totalItems; i++) {
    dateDetails.value.push({
      number: checkInDetails.signBonus?.[i],
      checkInActive: i < monthCount + (1 - dayCount),
      isCheckedIn: i < monthCount
    });
  }
};

const checkInDetails = reactive({
  monthMaxDays: 29,
  dayCount: 0,
  monthCount: 0
});
const loadDailyCheckIn = () => {
  eventapi.get("/sign-in/info").then((res) => {
    if (res.code === 0) {
      checkInDetails.monthMaxDays = res.data.monthMaxDays;
      checkInDetails.dayCount = res.data.dayCount;
      checkInDetails.monthCount = res.data.monthCount;
      checkInDetails.signBonus = res.data.signBonus;
      init(checkInDetails.monthMaxDays, checkInDetails.dayCount, checkInDetails.monthCount);
    } else {
      // draft data
      let ress = {
        code: 0,
        data: {
          monthMaxDays: 31,
          dayCount: 0,
          signBonus: [
            8.8,8.8,8.8,28,8.8,8.8,48,9.8,9.8,9.8,38,9.8,9.8,68,10.8,28,10.8,48,10.8,10.8,88,10.8,10.8,10.8,58,10.8,10.8,128,28,28,28
          ],
          monthCount: 0
        }
      };
      console.log(ress);
      checkInDetails.monthMaxDays = ress.data.monthMaxDays;
      checkInDetails.dayCount = ress.data.dayCount;
      checkInDetails.monthCount = ress.data.monthCount;
      checkInDetails.signBonus = ress.data.signBonus;
      init(checkInDetails.monthMaxDays, checkInDetails.dayCount, checkInDetails.monthCount);
    }
  });
};

const checkInOfTheDay = (mth) => {
  // console.log(mth);
  if (mth.isCheckedIn) {
    return;
  }
  eventapi.put("/sign-in/claim").then((res) => {
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: t("lang.daily_check_in_successful"),
        icon: "check_circle_outline"
      });
      loadDailyCheckIn();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });
};

onMounted(() => {
  loadDailyCheckIn();
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
  border-radius: 12px;

  &.daily-details {
    background: #e7f3ff;

    .dailylogin-title {
      color: #3981ff;
    }

    .mth {
      background: transparent !important;
      margin: 0 !important;
      padding: 15px 0 !important;
      height: auto !important;
      .number {
        color: #1c1c25 !important;
        font-size: 14px !important;
        font-weight: bold;
      }

      .day {
        opacity: 0.5;
      }
    }

    .months {
      padding: 0 0 20px;
      .mth {
        border: 1px solid #ecedf0;

        border-bottom: 0;
        border-left: 0;
      }
    }
  }

  .dailylogin-title {
    height: 52px;
    color: #ffffff;
    font-size: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px;

    img {
      display: block;
      width: 30px !important;
    }
  }
  .months {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    padding: 0px 5px 20px;
    border-radius: 12px;
    overflow: hidden;
    background: radial-gradient(#ffffff 0%, #fbfcffee 100%);

    .mth {
      padding: 4px;

      &.check-in {
        cursor: pointer;
        background-image: url(../../../assets/images/promo/hotpromo/dailylogin/sign.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        z-index: 2;

        &.today-checked-in {
          filter: grayscale(0.7);
          opacity: 0.6;
        }
      }
      &.checked-in {
        cursor: pointer;
        background-image: url(../../../assets/images/promo/hotpromo/dailylogin/signed.png);
        background-repeat: no-repeat;
        background-position: center center;
        //background: transparent;
        opacity: 0.6;
        background-size: 100% 100%;
        .number {
          color: #434343;
        }
      }

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #4c4c6c;
      height: 90px;
      margin-bottom: -20px;
      padding-bottom: 18px;
      .day {
        font-size: 14px;
        font-weight: 700;

        .times {
          font-size: 9px;
        }
      }
      .number {
        color: #2095ff;
        font-size: 9px;
      }
    }
  }
}
</style>

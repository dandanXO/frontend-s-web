<template>
  <div class="check-in-calendar-wrapper">
    <div class="calendar-info" :class="props.isModal ? 'is-modal' : ''">
      <div class="month" @click="openMonthPicker">
        <img
          v-if="props.isModal && globalStore.isDarkMode"
          class="calendar-header-image"
          src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/calendar-icon-dark.png"
        />
        <img
          v-else
          class="calendar-header-image"
          src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/calendar-icon.png"
        />
        <div class="month-text">{{ moment(datesInMonth?.[0]).format("MMM") }}</div>
        <input ref="monthPickerRef" type="month" style="width:0px;border:none;margin:0;padding:0;" @change="changeMonth" />
      </div>
      <div class="total-days-signed-in">
        Signed in:
        <span class="days-text">{{ checkedInDates.length }} days</span>
      </div>
    </div>
    <div class="check-in-calendar">
      <div class="calendar-header">
        <div class="day-wrapper">Mon</div>
        <div class="day-wrapper">Tue</div>
        <div class="day-wrapper">Wed</div>
        <div class="day-wrapper">Thu</div>
        <div class="day-wrapper">Fri</div>
        <div class="day-wrapper">Sat</div>
        <div class="day-wrapper">Sun</div>
      </div>
      <div class="calendar-content">
        {{ checkInDates }}
        <div v-for="date in datesInMonth" :key="date" class="day-wrapper">
          <div class="day-text">{{ moment(date).format("DD") }}</div>
          <div
            class="sign-in-btn"
            v-if="moment(date).isSame(moment(), 'date') && todayCheckInAvail"
            @click="onClickCheckIn"
          >
            Sign In
          </div>
          <template v-else-if="moment(date).isSameOrBefore(moment(new Date), 'date') && moment(date).isSameOrAfter(moment(eventStart), 'date') && moment(date, YEAR_MONTH_DAY_FORMAT).isSameOrBefore(moment(new Date, YEAR_MONTH_DAY_FORMAT), 'date')">
            <template v-if="checkedInDates.includes(date)">
              <div v-if="globalStore.isDarkMode" class="signed-in-btn">Signed In</div>
              <img
                v-else
                class="is-checked-icon-image"
                src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/check-icon.png"
              />
            </template>
            <div class="sign-in-btn" v-else-if="todayReCheckInAvail" @click="onClickReCheckIn(date)">Re-Check In</div>
            <img
              v-else
              class="is-checked-icon-image"
              src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/cross-icon.png"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import moment from "moment";
import { globalStore } from "@/store";
import { getTodayCheckInStatus, checkIn, reCheckIn } from "../../../api/index/promo";
import { userStore } from "@/store";
import { message } from "ant-design-vue";

const store = userStore();

const props = defineProps(["isModal"]);

const YEAR_MONTH_FORMAT = "YYYY-MM";
const YEAR_MONTH_DAY_FORMAT = "YYYY-MM-DD";

const datesInMonth = ref([]);
const checkedInDates = ref([]);
const todayCheckInAvail = ref(false);
const todayReCheckInAvail = ref(false);
const eventStart = ref();
const eventEnd = ref();
const monthPickerRef = ref();

const getDaysFromMonth = (date, format) => {
    const start = moment(date || moment().format(YEAR_MONTH_FORMAT), format || YEAR_MONTH_FORMAT).startOf('month');
    const end = moment(date || moment().format(YEAR_MONTH_FORMAT), format || YEAR_MONTH_FORMAT).endOf('month');

    const current = start.clone();
    const daysInMonthArr = [];

    while (current.isBefore(end)) {
        daysInMonthArr.push(current.format(YEAR_MONTH_DAY_FORMAT));
        current.add(1, "day");
    }

    return daysInMonthArr;
}

const openMonthPicker = () => {
    monthPickerRef.value.showPicker();
}

const changeMonth = (ev) => {
    datesInMonth.value = getDaysFromMonth(ev.target.value);
}

const onClickCheckIn = () => {
  if (!store.token) {
    message.warning("Login to check in", 5);
    return;
  }

  checkIn({ promoCode: "P4W-VIP-DAILY-CHECKIN-BONUS" })
    .then((res) => {
      if (res.code === 0) {
        checkedInDates.value = res.data.checkInDates;
        todayCheckInAvail.value = res.data.todayCheckInAvail;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const onClickReCheckIn = (date) => {
  if (!store.token) {
    message.warning("Login to re-check in", 5);
    return;
  }

  reCheckIn({ promoCode: "P4W-VIP-DAILY-CHECKIN-BONUS", date })
    .then((res) => {
      if (res.code === 0) {
        checkedInDates.value = res.data.checkInDates;
        todayReCheckInAvail.value = res.data.todayReCheckInAvail;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  if (store.token) {
    getTodayCheckInStatus("P4W-VIP-DAILY-CHECKIN-BONUS")
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          checkedInDates.value = data.checkInDates ?? [];
          todayReCheckInAvail.value = data.todayReCheckInAvail ?? false;
          todayCheckInAvail.value = data.todayCheckInAvail ?? false;
          eventStart.value = data.eventStart;
          eventEnd.value = data.eventEnd;
          datesInMonth.value = getDaysFromMonth();
        }
      })
      .catch((err) => {
        console.log(err);
        message.warning(`Unable to get today's check in status`);
      });
  } else {
    datesInMonth.value = getDaysFromMonth();
  }
});
</script>
<style lang="scss" scoped>
.check-in-calendar-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  max-width: 80vw;
  margin: 0 auto;

  .calendar-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .month {
      font-size: 1.5rem;
      color: #fff;
      font-weight: 700;
      display: flex;
      gap: 10px;
      align-items: center;
      text-transform: uppercase;
      padding: 0px 20px;

      .calendar-header-image {
        filter: brightness(0) invert(1);
        width: 30px;
      }

      .month-text {
        display: flex;
        align-items: center;
        margin-top: 8px;
      }
    }

    .total-days-signed-in {
      font-size: 20px;
      color: #fff;
      font-weight: 700;
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 20px;
    }

    &.is-modal {
      .month {
        color: #4813e9;

        .calendar-header-image {
          filter: none;
        }
      }
      .total-days-signed-in {
        color: #83a3ca;
      }
    }
  }

  .check-in-calendar {
    display: flex;
    flex-direction: column;

    .calendar-header {
      background: #ecf5ff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 10px 0;

      .day-wrapper {
        color: #2b2b82;
        font-size: 1rem;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 auto;
      }
    }

    .calendar-content {
      background: #ffffff;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 15px;
      padding: 15px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;

      .day-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 70px;
        width: 70px;
        margin: 0 auto;

        .day-text {
          font-size: 1rem;
          color: #83a3ca;
        }

        .is-checked-icon-image {
          width: 100%;
          max-width: 20px;
        }
        .signed-in-btn {
          font-size: 12px;
          background: url(../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/signed-in.png) no-repeat center
            center;
          background-size: contain;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 15px;
          white-space: nowrap;
        }
      }
    }

    .sign-in-btn {
      border-radius: 26.316px;
      background: linear-gradient(270deg, #152df4 0%, #af0be8 100%);
      box-shadow: 0px -4px 4px 0px #02009e inset, -1px 2px 4px 0px rgba(255, 255, 255, 0.8) inset;
      color: #fff;
      display: inline-flex;
      font-size: 1rem;
      padding: 3px 15px;
      white-space: nowrap;
      width: 100%;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      cursor: pointer;
      font-size: 12px;
      width: 80px;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }
}

.dark-theme {
  .check-in-calendar-wrapper {
    .calendar-info {
      .month {
      }

      .total-days-signed-in {
        .days-text {
          color: #fff;
        }
      }

      &.is-modal {
        .month {
          color: #83a3ca;
        }
        .total-days-signed-in {
          color: #83a3ca;
        }
      }
    }

    .check-in-calendar {
      .calendar-header {
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);

        .day-wrapper {
          color: #fff;
        }
      }

      .calendar-content {
        background: #191a19;

        .day-wrapper {
          .day-text {
            color: #ffffff;
          }

          .is-checked-icon-image {
          }
        }
      }

      .sign-in-btn {
        border-radius: 26.316px;
        background: linear-gradient(270deg, #e84600 0%, #e8df00 100%);
        box-shadow: 0px 5.263px 6.579px 0px rgba(11, 8, 29, 0.2) inset,
          0px -5.263px 6.579px 0px rgba(11, 8, 29, 0.2) inset;
      }
    }
  }
}
</style>

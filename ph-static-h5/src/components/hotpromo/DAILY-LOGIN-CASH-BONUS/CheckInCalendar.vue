<template>
    <div class="check-in-calendar-wrapper">
        <div class="calendar-info" :style="props.isModal ? 'display:none;' : ''">
            <div class="month"  @click="openMonthPicker">
                <img class="calendar-header-image" src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/calendar-icon.png" />
                <div class="month-text">{{ moment(datesInMonth?.[0]).format('MMM') }}</div>
                <input ref="monthPickerRef" type="month" style="width:0px;border:none;margin:0;padding:0;" @change="changeMonth" />
            </div>
            <div class="total-days-signed-in">
                Signed in: {{ checkedInDates.length }} days
            </div>
        </div>
        <div class="check-in-calendar">
            <div class="calendar-header">
                <img class="calendar-header-image" src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/sign-in-calendar.png" />
            </div>
            <div class="calendar-content">
                <div v-for="date in datesInMonth" :key="date" class="day-wrapper">
                    <div class="day-text">{{ moment(date).format('DD') }}</div>
                    <div class="sign-in-btn" v-if="moment(date).isSame(moment(), 'date') && todayCheckInAvail" @click="onClickCheckIn">
                        Sign In
                    </div>
                    <template v-else-if="moment(date).isSameOrBefore(moment(new Date), 'date') && moment(date).isSameOrAfter(moment(eventStart), 'date') && moment(date, YEAR_MONTH_DAY_FORMAT).isSameOrBefore(moment(new Date, YEAR_MONTH_DAY_FORMAT), 'date')">
                        <img v-if="checkedInDates.includes(date)" class="is-checked-icon-image" src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/check-icon.png" />
                        <div class="sign-in-btn" v-else-if="todayReCheckInAvail" @click="onClickReCheckIn(date)" style="font-size: 8px">
                            Re-Check In
                        </div>
                        <img v-else class="is-checked-icon-image" src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/cross-icon.png" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';
import { getTodayCheckInStatus, checkIn, reCheckIn } from '../../../api/index/promo';
import { useQuasar } from 'quasar';
import { userStore } from "src/stores";

var qs = require("qs");

const props = defineProps(['isModal']);
const $q = useQuasar();
const store = userStore();

const YEAR_MONTH_FORMAT = 'YYYY-MM';
const YEAR_MONTH_DAY_FORMAT = 'YYYY-MM-DD';

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
    if(!store.token) {
        $q.notify({
            color: "negative",
            position: "top",
            message: "Login to check in",
            icon: "report_problem"
        });
        return;
    }

    checkIn(qs.stringify({promoCode: 'P4W-VIP-DAILY-CHECKIN-BONUS'})).then((res) => {
        if(res.code === 0) {
            checkedInDates.value = res.data.checkInDates;
            todayCheckInAvail.value = res.data.todayCheckInAvail;
        }
    }).catch((err) => {
        console.log(err)
    })
}

const onClickReCheckIn = (date) => {
    if(!store.token) {
        $q.notify({
            color: "negative",
            position: "top",
            message: "Login to re-check in",
            icon: "report_problem"
        });
        return;
    }

    reCheckIn(qs.stringify({promoCode: 'P4W-VIP-DAILY-CHECKIN-BONUS', date})).then((res) => {
        if(res.code === 0) {
            checkedInDates.value = res.data.checkInDates;
            todayReCheckInAvail.value = res.data.todayReCheckInAvail;
        }
    }).catch((err) => {
        console.log(err)
    })
}

onMounted(() => {
    if(store.hasToken()) {
        getTodayCheckInStatus({promoCode: 'P4W-VIP-DAILY-CHECKIN-BONUS'}).then((res) => {
            if(res.code === 0) {
                const data = res.data;
                checkedInDates.value = data.checkInDates ?? [];
                todayReCheckInAvail.value = data.todayReCheckInAvail ?? false;
                todayCheckInAvail.value = data.todayCheckInAvail ?? false;
                eventStart.value = data.eventStart;
                eventEnd.value = data.eventEnd;
                datesInMonth.value = getDaysFromMonth();
            }
        }).catch((err) => {
            console.log(err);
            $q.notify({
                color: "negative",
                position: "top",
                message: `Unable to get today's check in status`,
                icon: "report_problem"
            });
        });;
    } else {
        datesInMonth.value = getDaysFromMonth();
    }
})

</script>
<style lang="scss" scoped>

.check-in-calendar-wrapper {
    padding: 10px;

    .calendar-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .month {
            font-size: 20px;
            color: #fff;
            font-weight: 700;
            display: flex;
            gap: 5px;
            align-items: center;
            text-transform: uppercase;
            padding: 20px;

            .calendar-header-image {
                max-width: 25px;
            }

            .month-text {
                display: flex;
                align-items: center;
                margin-top: 5px;
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
    }

    .check-in-calendar {
        display: flex;
        flex-direction: column;

        .calendar-header {
            background: linear-gradient(270deg, #5800E8 0%, #0062E8 100%);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;

            .calendar-header-image {
                display: flex;
                width: 100%;
                max-width: 300px;
                margin: auto;
                padding: 20px;
            }
        }
        
        .calendar-content {
            background: #FFFFFF;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            padding: 10px;
            gap: 20px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;

            .day-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                height: 50px;
                width: 50px;

                .day-text {
                    font-size: 18px;
                    color: #83A3CA;
                }

                .sign-in-btn {
                    border-radius: 26.316px;
                    background: linear-gradient(270deg, #152DF4 0%, #AF0BE8 100%);
                    box-shadow: 0px -4px 4px 0px #02009E inset, -1px 2px 4px 0px rgba(255, 255, 255, 0.80) inset;
                    color: #fff;
                    display: inline-flex;
                    font-size: 10px;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    text-align: center;
                    width: 55px;
                    height: 25px;

                }

                .is-checked-icon-image {
                    width: 100%;
                    max-width: 20px;
                }
            }
        }
    }
}

.body--dark {
    .check-in-calendar-wrapper {

        .check-in-calendar {

            .calendar-header {
            }
            
            .calendar-content {
                background: #191A19;

                .day-wrapper {

                    .day-text {
                        color: #ffffff;
                    }

                    .sign-in-btn {
                        border-radius: 26.316px;
                        background: linear-gradient(270deg, #E84600 0%, #E8DF00 100%);
                        box-shadow: 0px 5.263px 6.579px 0px rgba(11, 8, 29, 0.20) inset, 0px -5.263px 6.579px 0px rgba(11, 8, 29, 0.20) inset;
                    }

                    .is-checked-icon-image {
                    }
                }
            }
        }
    }
}
</style>
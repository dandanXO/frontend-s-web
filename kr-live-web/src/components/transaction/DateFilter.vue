<template>
    <q-input dense outlined :modelValue="props.startDate" @change="(startDate) => {
        emit('updateStartDate', startDate)
    }">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date :modelValue="props.startDate" @update:model-value="(startDate) => {
                        emit('updateStartDate', startDate)
                    }" mask="YYYY-MM-DD" :locale="dateLocale">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('lang.date_picker_close')" flat />
                            <q-btn v-close-popup :label="$t('lang.date_picker_confirm')" flat />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
    <q-input dense outlined :modelValue="props.endDate" @change="(endDate) => {
        emit('updateEndDate', endDate)
    }">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date :modelValue="props.endDate" @update:model-value="(endDate) => {
                        emit('updateEndDate', endDate)
                    }" mask="YYYY-MM-DD" :locale="dateLocale">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('lang.date_picker_close')" flat />
                            <q-btn v-close-popup :label="$t('lang.date_picker_confirm')" flat />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps(['startDate', 'endDate']);
const emit = defineEmits(['udpateStartDate', 'updateEndDate']);
const { t } = useI18n();

const dateLocale = {
    days: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    daysShort: '일_월_화_수_목_금_토'.split('_'),
    months: '일월_이월_삼월_사월_오월_유월_칠월_팔월_구월_시월_십일월_십이월'.split('_'),
    monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: '날들'
}


// const dateLocale = {
//     days: [
//         t('lang.date_picker_sunday'),
//         t('lang.date_picker_monday'),
//         t('lang.date_picker_tuesday'),
//         t('lang.date_picker_wednesday'),
//         t('lang.date_picker_thursday'),
//         t('lang.date_picker_friday'),
//         t('lang.date_picker_saturday')
//     ],
//     daysShort: [
//         t('lang.date_picker_sun'),
//         t('lang.date_picker_mon'),
//         t('lang.date_picker_tue'),
//         t('lang.date_picker_wed'),
//         t('lang.date_picker_thu'),
//         t('lang.date_picker_fri'),
//         t('lang.date_picker_sat')
//     ],
//     months: [
//         t('lang.date_picker_january'),
//         t('lang.date_picker_february'),
//         t('lang.date_picker_march'),
//         t('lang.date_picker_april'),
//         t('lang.date_picker_may'),
//         t('lang.date_picker_june'),
//         t('lang.date_picker_july'),
//         t('lang.date_picker_august'),
//         t('lang.date_picker_september'),
//         t('lang.date_picker_october'),
//         t('lang.date_picker_november'),
//         t('lang.date_picker_december')
//     ],
//     monthsShort: [
//         t('lang.date_picker_jan'),
//         t('lang.date_picker_feb'),
//         t('lang.date_picker_mar'),
//         t('lang.date_picker_apr'),
//         t('lang.date_picker_may_short'),
//         t('lang.date_picker_jun'),
//         t('lang.date_picker_jul'),
//         t('lang.date_picker_aug'),
//         t('lang.date_picker_sep'),
//         t('lang.date_picker_oct'),
//         t('lang.date_picker_nov'),
//         t('lang.date_picker_dec')
//     ],
//     firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
//     format24h: true,
//     pluralDay: '날들'
// }

</script>

<style scoped lang="scss"></style>
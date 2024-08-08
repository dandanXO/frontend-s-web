<template>
    <div class="deposit-reminder">
        <div class="content">
            <div class="header">
                <q-icon name="warning" color="orange" size="1.5em" />
                <div>{{ $t('lang.deposit_reminder') }}</div>
                <div class=caption>{{ $t('lang.deposit_reminder_caption') }}</div>
            </div>
            <div class="deposit-reminder-text" v-html="props.reminderText"></div>
            <div class="action"></div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['reminderText']);

</script>

<style lang="scss" scoped>
.deposit-reminder {
    display: flex;
    border-left: 3px solid #ff9100;
    background-color: #fbfbfb;
    border-radius: 4px;
    overflow: hidden;
    margin: 10px 0;

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;

        .header {
            background-color: #fff4e5;
            color: #242321;
            padding: 5px 10px;
            width: 100%;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
            border: 1px solid #ededed;

            .caption {
                color: grey;
                font-size: x-small;
            }
        }

        .deposit-reminder-text {
            font-size: x-small;
            white-space: pre-line;
            background-color: transparent;
            line-height: 1rem;
            color: #242321;
            padding: 5px 10px;
            max-height: 80px;
            overflow: auto;
        }
    }
}
</style>
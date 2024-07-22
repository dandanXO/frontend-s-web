<template>


    <MessageCompose v-if="isCompose" :onClickBack="() => isCompose = false" />
    <template v-else>
        <div class="message-page">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;" v-if="!isCompose">
                <!-- <div style="margin:0;" @click="isCompose = true">
                    <div style="display:flex;align-items:center;gap:3px;cursor:pointer;">
                        <q-icon :name="'edit'" />
                        {{ $t('lang.message_compose') }}
                    </div>
                </div> -->

                <!-- <q-tabs v-model="inboxCategory" dense inline-label class="inbox-type-tabs">
                    <q-tab name="ALL">
                        <div style="display:flex; align-items: center;gap:5px;"> <img
                                :src="require('../../../assets/icon/pageModal/all-message-icon.svg')"
                                :style="inboxCategory === 'ALL' ? '' : 'filter:contrast(0)'" />
                            <div class="inbox-type" :style="inboxCategory === 'ALL' ? 'color: #00FFFF' : ''">{{
                                $t('lang.message_type_all')
                                }}</div>
                        </div>
                    </q-tab>
                    <q-tab name="Outbox">
                        <div style="display:flex; align-items: center;gap:5px;"> <img
                                :src="require('../../../assets/icon/pageModal/outbox-icon.svg')"
                                :style="inboxCategory === 'Outbox' ? '' : 'filter:contrast(0)'" />
                            <div class="inbox-type" :style="inboxCategory === 'Outbox' ? 'color: #00FFFF' : ''">{{
                                $t('lang.message_type_outbox')
                                }}</div>
                        </div>
                    </q-tab>
                    <q-tab name="NOTIFICATION">
                        <div style="display:flex; align-items: center;gap:5px;"> <img
                                :src="require('../../../assets/icon/pageModal/inbox-icon.svg')"
                                :style="inboxCategory === 'NOTIFICATION' ? '' : 'filter:contrast(0)'" />
                            <div class="inbox-type" :style="inboxCategory === 'NOTIFICATION' ? 'color: #00FFFF' : ''">{{
                                $t('lang.message_type_inbox')
                                }}</div>
                        </div>
                    </q-tab>
                </q-tabs> -->
            </div>


            <div class="message-compose-form">
                <div class="message-container">
                    <div class="message-list-wrapper">
                        <div class="header">
                            <q-pagination :modelValue="inboxMessages.current" :max="inboxMessages.pages"
                                :max-pages="inboxMessages.size" @update:model-value="(currentPage) => {
                                    initOutbox(currentPage)
                                }" boundary-links input color="white" input-class="text-white-10" dense />
                            <!-- <span v-if="selectedMessages?.length">{{ `${$t('lang.message_selected')}
                                (${selectedMessages?.length})`
                                }}</span> -->
                            <span>{{ $t('lang.announcement_total')
                                }} {{ inboxMessages.total }}</span>
                        </div>

                        <q-list bordered separator class="message-list">
                            <template v-if="isLoading">
                                <q-item v-for="rectSkeleton in 6" :key="rectSkeleton">
                                    <q-skeleton type="QToolbar" style="width:100%;" />
                                </q-item>
                            </template>
                            <template v-else>

                                <q-item clickable v-ripple v-for="item in inboxMessages.records" :key="item.page"
                                    @click="readMessage(item.id)" :active="item === selected"
                                    active-class="active-message"
                                    :class="{ unread: item.hasOwnProperty('readTime') && !item.readTime }"
                                    class="message">
                                    <q-item-section thumbnail style="margin:0;">
                                        <q-checkbox size="xs" v-model="item.selected" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label lines="2"><span class="title">{{ item.title
                                                }}</span></q-item-label>
                                        <q-item-label caption lines="2"><span class="caption">{{ item.content
                                                }}</span></q-item-label>
                                    </q-item-section>

                                    <q-item-section side top class="info-wrapper">
                                        <q-item-label caption>
                                            <span class="date-time">{{ getLocaleDateTime(item.sendTime ||
                                                item.createTime)
                                                }}</span>
                                        </q-item-label>
                                        <q-item-label caption lines="2"><span class="caption"
                                                v-if="item.hasOwnProperty('readTime')" style="font-size:10px;"
                                                :style="!item.readTime ? 'color:#FF0000' : 'color:#FFC000'">{{
                                                    !item.readTime ? $t('lang.message_unread') : $t('lang.message_read')
                                                }}</span></q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-list>
                    </div>
                    <q-scroll-area class="message-content-wrapper">
                        <template v-if="isLoading">
                            <q-item v-for="rectSkeleton in 10" :key="rectSkeleton">
                                <q-skeleton type="text" style="width:100%;" />
                            </q-item>
                        </template>
                        <template v-else>
                            <div class="message-content-wrapper">
                                <div class="message-actions">
                                    <q-btn-group flat>
                                        <q-btn :disable="!selectedMessages?.length" size="md"
                                            :label="$t('lang.message_process_all_read')" @click="readMAllMessage" />
                                        <q-btn v-if="selectedMessages?.length" size="md"
                                            :label="$t('lang.message_delete_selected') + (selectedMessages?.length ? `(${selectedMessages.length})` : '')"
                                            @click="deleteSelectedMessage" />
                                        <q-btn :disable="!selectedMessages?.length" size="md"
                                            :label="$t('lang.message_delete_read')" @click="deleteAllMessage" />
                                    </q-btn-group>
                                </div>
                                <div v-if="selected" class="message-content">
                                    <div>
                                        <div class="title">{{ selected.title }}</div>
                                    </div>
                                    <div class="date-time-wrapper">
                                        <span class="date-time text-caption"
                                            v-if="selected.sendTime || selected.createTime">
                                            {{ getLocaleDateTime(selected.sendTime || selected.createTime, true) }}
                                        </span>
                                    </div>
                                    <div class="content-loading" v-if="isFetchingContent">
                                        <template v-for="rectSkeleton in 5" :key="rectSkeleton">
                                            <q-skeleton type="text" style="width:100%;" />
                                        </template>
                                    </div>
                                    <div v-else class="content" v-html="selected.content" style="white-space: pre-line">
                                    </div>
                                </div>
                                <div class="message-no-data" v-else>{{ $t('lang.message_no_selected') }}</div>
                            </div>
                        </template>
                    </q-scroll-area>
                </div>
            </div>
        </div>
    </template>
</template>

<script setup id="FinanceDeposit">
import { ref, onMounted, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import moment from 'moment'
import { getLocaleDateTime } from "src/boot/utils";
import { userStore } from "src/stores";
import MessageCompose from "./MessageCompose.vue";
import { useI18n } from "vue-i18n";

var qs = require("qs");

const $q = useQuasar();
const selected = ref();
const isLoading = ref(false);
const inboxCategory = ref('ALL');
const store = userStore();
const props = defineProps(['inboxType']);
const isCompose = ref(false);
const { t } = useI18n();

const selectedMessages = computed(() => inboxMessages.value.records?.filter((item) => item.selected).map(({ id }) => id));

const inboxCategories = [
    { type: 'Outbox', label: 'lang.message_type_outbox' },
    { type: 'ALL', label: 'lang.message_type_all' }, { type: 'ANNOUNCEMENT', label: 'lang.message_type_announcement' }, { type: 'NOTIFICATION', label: 'lang.message_type_inbox' }, { type: 'ACTIVITY', label: 'lang.message_type_activity' }, { type: 'PAYMENT', label: 'lang.message_type_payment' }];

const isFetchingContent = ref(false);
const inboxMessages = ref([]);

const selectFirstMessage = () => {
    if (inboxMessages.value.records?.length) {
        // if don't have timeout, ellipsis for title won't show
        setTimeout(() => {
            const message = inboxMessages.value.records[0];
            selected.value = message;
            if (!message.readTime) {
                readMessage(message.id, false)
            }
        }, 100)
    }
}

watch(() => props.inboxType, () => {
    inboxCategory.value = props.inboxType;
})

watch(() => inboxCategory.value, () => {
    initOutbox();
});

watch(() => inboxMessages.value.records, () => {
    selectFirstMessage();
});

const initOutbox = (page = 1) => {
    isLoading.value = true;

    const url = (() => {
        if (inboxCategory.value === 'Outbox') {
            return '/session/outbox';
        }

        return '/session/inbox';
    })();

    Promise.all([api.get(url, {
        params: {
            messageType: inboxCategory.value === 'ALL' ? undefined : inboxCategory.value,
            current: page,
            size: inboxMessages.value.size || 10,
            orderBy: 'sendTime'
        }
    })]).then(([repliesRes]) => {
        const { code: repliesResCode, data: repliesResData } = repliesRes.data

        if (repliesResCode === 0) {
            const repliesResDataRecordsWithSelected = repliesResData.records.map((data) => ({
                ...data,
                selected: false
            }))
            inboxMessages.value = { ...repliesResData, records: repliesResDataRecordsWithSelected };
        }

        isLoading.value = false;
    }).catch(() => {
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    })
}

const deleteMessage = (id) => {
    api.post("/session/inbox/delete",
        qs.stringify({
            id: id
        })
    ).then((res) => {
        const { code, data } = res.data

        if (code === 0) {
            $q.notify({
                message: "삭제됨",
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
            });

            inboxMessages.value.records = inboxMessages.value.records.filter(({ id: messageId }) => messageId !== id);
        }

        isFetchingContent.value = false;
    })
        .catch((error) => {
            console.log(error);
            isFetchingContent.value = false;
        });
}

const readMessage = (id, showReadNotify = true) => {
    const currentMail = inboxMessages.value.records.find((data) => data.id === id);
    selected.value = currentMail;

    if (!currentMail?.readTime && inboxCategory.value !== 'Outbox') {
        isFetchingContent.value = true;

        api.post("/session/inbox/read",
            qs.stringify({
                id: id
            })
        ).then((res) => {
            const { code, data } = res.data

            if (code === 0 && !currentMail.readTime && showReadNotify) {
                $q.notify({
                    message: "메시지 읽기",
                    type: "positive",
                    position: "top",
                    icon: "check_circle_outline"
                });
                store.unreadCount--;
            }

            if (!currentMail.readTime) {
                currentMail.readTime = moment().format('YYYY-MM-DD HH:mm:ss');
            }

            isFetchingContent.value = false;
        })
            .catch((error) => {
                console.log(error);
                isFetchingContent.value = false;
            });
    }
}

const readMAllMessage = () => {
    api
        .post("/session/inbox/readAll")
        .then((res) => {
            const { code, data } = res.data

            if (code === 0) {
                $q.notify({
                    message: t('lang.message_read_all_message'),
                    type: "positive",
                    position: "top",
                    icon: "check_circle_outline"
                });

                initOutbox();
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

const deleteAllMessage = () => {
    api
        .post("/session/inbox/deleteAll")
        .then((res) => {
            const { code, data } = res.data

            if (code === 0) {
                $q.notify({
                    message: t('lang.message_delete_all_message'),
                    type: "positive",
                    position: "top",
                    icon: "check_circle_outline"
                });

                initOutbox();

                selected.value = null;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

const deleteSelectedMessage = () => {
    const mailIdArr = selectedMessages.value;
    const formattedIds = mailIdArr.join(",");
    api
        .post(
            "/session/inbox/deleteMultiple",
            qs.stringify({
                ids: formattedIds
            })
        )
        .then((res) => {
            const { code, data } = res.data

            if (code === 0) {
                $q.notify({
                    message: t('lang.message_delete_selected_message'),
                    type: "positive",
                    position: "top",
                    icon: "check_circle_outline"
                });

                const newRecords = inboxMessages.value.records.filter((data) => !selectedMessages.value.includes(data.id));
                inboxMessages.value.records = newRecords
            }
        })
        .catch((error) => {
            console.log(error);
        });

};

onMounted(() => {
    initOutbox();
})
</script>

<style lang="scss" scoped>
.inbox-type-tabs {
    .inbox-type {
        text-transform: capitalize;
    }
}

.message-page {
    height: 100%;
    padding: 0 20px 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.message-category-dropdown {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 10px;
    z-index: 1;
}

.content-form {
    padding: 10px 0;
}

.message-compose-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    height: 100%;
}

.back-btn {
    width: 100px;
    height: 30px;
    font-size: 12px;
    letter-spacing: -1px;
}

.compose-btn {
    width: 60px;
    height: 30px;
    font-size: 12px;
    letter-spacing: -1px;
}

.message-container {
    display: grid;
    grid-template-columns: minmax(300px, 30%) minmax(300px, auto);
    height: 100%;
    gap: 10px;

    .total {
        margin-left: auto;
    }

    .message-list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-height: 100%;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .message-list {
            overflow-y: auto;
            max-height: 100%;
            height: 100%;

            .message {
                padding: 8px 10px;
            }

            .active-message {
                background: linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%);
            }

            .active-message,
            .unread {

                .title,
                .caption,
                .date-time {
                    color: #fff;
                    font-weight: bold;
                }
            }
        }
    }

    .message-actions {
        display: flex;
        justify-content: flex-end;
    }

    .message-content-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-height: 100%;

        .date-time-wrapper {
            display: flex;
            flex-direction: column;
        }

        .message-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 100%;
            overflow-y: auto;
            padding-right: 10px;

            .title {
                font-size: 2.4rem;
                line-height: 3rem;
                font-weight: bold;
            }

            .date-time {
                margin-left: auto;
            }

            .content-loading {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: auto;
                gap: 5px;
            }

            .attachment-img {
                max-width: 100%;
            }

            .content {
                line-height: 1.7rem;
            }
        }

        .message-no-data {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    @media (max-width: 768px) {
        display: grid;
        grid-template-columns: minmax(180px, 30%) auto;

        .message-list-wrapper {
            .header {
                flex-direction: column;
            }

            .message-list {
                .message {
                    padding: 0;
                }
            }
        }

        .q-item {
            display: flex;
            flex-direction: column;
            padding: 0;
            font-size: 12px;


            .title {
                font-size: 15px;
                line-height: 20px;
            }

            .text-caption {
                font-size: 10px;
                line-height: 20px;
            }

            .attachment {
                margin: 5px 0px;
            }

            .q-item__section {
                padding-left: 0;
                align-items: flex-start;
                padding: 5px;

                &.info-wrapper {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }

        .message-content-wrapper {

            .message-content {
                font-size: 12px;

                .title {
                    font-size: 20px;
                    line-height: 28px;
                }

                .content {
                    line-height: 20px;
                }
            }
        }
    }
}
</style>

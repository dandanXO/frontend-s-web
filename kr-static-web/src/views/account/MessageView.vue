<template>
    <div class="message-page">
        <div class="message-compose-form">
            <div class="message-container">
                <div class="message-list-wrapper">
                    <div class="header">
                        <el-skeleton v-if="isLoading" class="total" />
                        <template v-else>
                            <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="inboxMessages.total"
                            @current-change="(currentPage) => {
                                initOutbox(currentPage)
                            }"
                            v-model:current-page="inboxMessages.current"
                            default-page-size="10" />
                            <span>{{ $t('message.message_total')
                                }} {{ inboxMessages.total }}</span>
                        </template>
                    </div>

                    <div class="message-list">
                        <template v-if="isLoading">
                            <el-skeleton :rows="6" style="width:100%;" />
                        </template>
                        <template v-else>
                            <div v-for="item in inboxMessages.records" :key="item.page"
                                @click="readMessage(item.id)" :active="item === selected" active-class="active-message"
                                :class="{ unread: item.hasOwnProperty('readTime') && !item.readTime }" class="message">
                                <div>
                                    <el-checkbox v-model="item.selected" />
                                </div>
                                <div>
                                    <div><span class="title">{{ item.title
                                            }}</span></div>
                                    <div><span class="caption">{{ item.content
                                            }}</span></div>
                                </div>

                                <div side top class="info-wrapper">
                                    <div>
                                        <span class="date-time">{{ getLocaleDateTime(item.sendTime ||
                                            item.createTime)
                                            }}</span>
                                    </div>
                                    <div><span class="caption"
                                            v-if="item.hasOwnProperty('readTime')" style="font-size:10px;"
                                            :style="!item.readTime ? 'color:#FF0000' : 'color:#FFC000'">{{
                                                !item.readTime ? $t('message.message_unread') : $t('message.message_read')
                                            }}</span></div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="message-content-wrapper">
                    <template v-if="isLoading">
                        <el-skeleton :rows="10" style="width:100%;" />
                    </template>
                    <template v-else>
                        <div class="message-content-wrapper">
                            <div class="message-actions">
                                <el-button-group flat>
                                    <el-button type="primary" :disable="!selectedMessages?.length" @click="readMAllMessage">
                                        {{ $t('message.message_process_all_read') }}
                                    </el-button>
                                    <el-button type="primary" v-if="selectedMessages?.length"
                                        @click="deleteSelectedMessage">
                                        {{ $t('message.message_delete_selected') + (selectedMessages?.length ? `(${selectedMessages.length})` : '') }}
                                    </el-button>
                                    <el-button type="primary" :disable="!selectedMessages?.length" @click="deleteAllMessage">
                                        {{ $t('message.message_delete_read') }}
                                    </el-button>
                                </el-button-group>
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
                                        <el-skeleton style="width:100%;" />
                                    </template>
                                </div>
                                <div v-else class="content" v-html="selected.content" style="white-space: pre-line">
                                </div>
                            </div>
                            <div class="message-no-data" v-else>{{ $t('message.message_no_selected') }}</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup id="FinanceDeposit">
import { ref, onMounted, watch, computed } from "vue";
import { userStore } from "@/store";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { i18nStore } from "@/store/language";
import { server } from "@/utils/request";

var qs = require("qs");

const selected = ref();
const isLoading = ref(false);
const inboxCategory = ref('ALL');
const store = userStore();
const props = defineProps(['inboxType']);
const { t } = useI18n();
const { languageVal } = i18nStore();

const getLocaleDateTime = (dateTimeStr, isIncludeTime = false) => {
  if(languageVal === 'kr') {
    return dayjs(dateTimeStr).locale('ko').format(isIncludeTime ? "LLL" : "LL");
  }

  if(languageVal === 'en') {
    return isIncludeTime ? dayjs(dateTimeStr).format('YYYY-MM-DD hh:mm A') : dayjs(dateTimeStr).format('YYYY-MM-DD');
  }

  return dayjs(dateTimeStr).locale('ko').format(isIncludeTime ? "LLL" : "LL");
}

const selectedMessages = computed(() => inboxMessages.value.records?.filter((item) => item.selected).map(({ id }) => id));

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

    Promise.all([server.REST.get(url, {
        params: {
            messageType: inboxCategory.value === 'ALL' ? undefined : inboxCategory.value,
            current: page,
            size: inboxMessages.value.size || 10,
            orderBy: 'sendTime'
        }
    })]).then(([repliesRes]) => {
        const { code: repliesResCode, data: repliesResData } = repliesRes

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

const readMessage = (id, showReadNotify = true) => {
    const currentMail = inboxMessages.value.records.find((data) => data.id === id);
    selected.value = currentMail;

    if (!currentMail?.readTime && inboxCategory.value !== 'Outbox') {
        isFetchingContent.value = true;

        server.REST.post("/session/inbox/read",
            qs.stringify({
                id: id
            })
        ).then((res) => {
            const { code, data } = res

            if (code === 0 && !currentMail.readTime && showReadNotify) {
                // $q.notify({
                //     message: "메시지 읽기",
                //     type: "positive",
                //     position: "top",
                //     icon: "check_circle_outline"
                // });
                store.unreadCount--;
            }

            if (!currentMail.readTime) {
                currentMail.readTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
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
    server.REST.post("/session/inbox/readAll")
        .then((res) => {
            const { code, data } = res

            if (code === 0) {
                // $q.notify({
                //     message: t('message.message_read_all_message'),
                //     type: "positive",
                //     position: "top",
                //     icon: "check_circle_outline"
                // });

                initOutbox();
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

const deleteAllMessage = () => {
    server.REST.post("/session/inbox/deleteAll")
        .then((res) => {
            const { code, data } = res

            if (code === 0) {
                // $q.notify({
                //     message: t('message.message_delete_all_message'),
                //     type: "positive",
                //     position: "top",
                //     icon: "check_circle_outline"
                // });

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
    server.REST.post(
            "/session/inbox/deleteMultiple",
            qs.stringify({
                ids: formattedIds
            })
        )
        .then((res) => {
            const { code, data } = res

            if (code === 0) {
                // $q.notify({
                //     message: t('message.message_delete_selected_message'),
                //     type: "positive",
                //     position: "top",
                //     icon: "check_circle_outline"
                // });

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
        background-color: white;
        padding: 20px;

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
                display:grid;
                grid-template-columns: 20px 1fr auto;
                gap: 5px;
                padding: 8px 10px;
                border-bottom: 1px solid grey;

                .info-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
            }

            .active-message {
                background: linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%);
            }

            .active-message,
            .unread {

                .title,
                .caption,
                .date-time {
                    // color: #fff;
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

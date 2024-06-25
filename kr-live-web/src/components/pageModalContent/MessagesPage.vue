<template>
    <div class="message-page">
        <div style="display:flex;justify-content:space-between;">
            <q-btn v-if="!isCreateMode" flat dense icon="edit" :label="$t('lang.message_compose')"
                @click="isCreateMode = true" no-caps />
            <q-btn v-else flat dense icon="arrow_back" :label="$t('lang.message_previous_page')"
                @click="isCreateMode = false" no-caps />

            <q-btn-dropdown v-if="!isCreateMode" flat :label="$t(inboxCategoryLabel)" dense>
                <q-list>
                    <q-item clickable v-close-popup @click="inboxCategory = category.type"
                        v-for="category in inboxCategories" :key="category.type">
                        <q-item-section>
                            <q-item-label>{{ $t(category.label) }}</q-item-label>
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-btn-dropdown>
        </div>


        <div class="form-wrapper" v-if="isCreateMode">
            <form class="content-form form-template">
                <div class="form-item">
                    <label>{{ $t('lang.feedback_category') }}</label>
                    <q-select outlined dense name="title" v-model="composeForm.messageType" :options="messageTypes"
                        ref="messageTypeRef" :rules="[(val) => !!val || $t('lang.feedback_category_select')]" clearable
                        @update:model-value="type => composeForm.title = type" />
                </div>
                <div class="form-item">
                    <label>{{ $t('lang.message_title') }}</label>
                    <q-input dense outlined ref="titleRef" :placeholder="$t('lang.message_title_placeholder')"
                        v-model="composeForm.title" clearable lazy-rules :rules="[
                            (val) => (val && val.length > 0) || $t('lang.message_cannot_be_empty'),
                        ]" />
                </div>
                <div class="form-item">
                    <label>{{ $t('lang.message_content') }}</label>
                    <q-input dense outlined ref="contentRef" type="textarea" rows="6" v-model="composeForm.content"
                        clearable lazy-rules :rules="[
                            (val) => (val && val.length > 0) || $t('lang.message_cannot_be_empty'),
                        ]" />
                </div>
            </form>

            <div class="action-buttons">
                <div class="primary-button blue" @click.prevent="sendMessage">{{ $t('lang.message_compose_confirm') }}
                </div>
            </div>
        </div>
        <div class="message-compose-form" v-else>
            <div class="message-container">
                <div class="message-list-wrapper">
                    <div class="header">
                        <q-pagination :modelValue="inboxMessages.current" :max="inboxMessages.pages"
                            :max-pages="inboxMessages.size" @update:model-value="(currentPage) => {
                                initOutbox(currentPage)
                            }" boundary-links input color="white" input-class="text-white-10" dense />
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
                                @click="readMessage(item.id)" :active="item === selected" active-class="active-message"
                                :class="{ unread: item.hasOwnProperty('readTime') && !item.readTime }" class="message">
                                <q-badge v-if="item.hasOwnProperty('readTime') && !item.readTime" rounded
                                    style="background:#DF3D31;margin:auto;margin-right:5px;min-height:9px;padding:2px 4.5px;"
                                    :title="$t('lang.message_unread')" />
                                <q-item-section>
                                    <q-item-label lines="2"><span class="title">{{ item.title }}</span></q-item-label>
                                    <q-item-label caption lines="2"><span class="caption">{{ item.content
                                            }}</span></q-item-label>
                                </q-item-section>

                                <q-item-section side top class="info-wrapper">
                                    <q-item-label caption>
                                        <span class="date-time">{{ getLocaleDateTime(item.sendTime || item.createTime)
                                            }}</span>
                                    </q-item-label>
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
                        <div v-if="selected" class="message-content">
                            <div>
                                <div class="title">{{ selected.title }}</div>
                            </div>
                            <div class="date-time-wrapper">
                                <span class="date-time text-caption" v-if="selected.sendTime || selected.createTime">
                                    {{ getLocaleDateTime(selected.sendTime || selected.createTime, true) }}
                                </span>
                                <!-- <span class="date-time text-caption text-grey" v-if="selected.readTime">
                                {{ $t('lang.message_read_at') }}
                                {{
                                    getLocaleDateTime(selected.readTime, true)
                                }}
                            </span> -->
                            </div>
                            <div class="content-loading" v-if="isFetchingContent">
                                <template v-for="rectSkeleton in 5" :key="rectSkeleton">
                                    <q-skeleton type="text" style="width:100%;" />
                                </template>
                            </div>
                            <div v-else class="content" v-html="selected.content" style="white-space: pre-line"></div>
                        </div>
                        <div class="message-no-data" v-else>{{ $t('lang.announcement_no_selected') }}</div>
                    </template>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>

<script setup id="FinanceDeposit">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import moment from 'moment'
import { getLocaleDateTime } from "src/boot/utils";
import { userStore } from "src/stores";
var qs = require("qs");

const $q = useQuasar();
const isCreateMode = ref(false);
const titleRef = ref();
const contentRef = ref();
const selected = ref();
const isLoading = ref(false);
const inboxCategory = ref('ALL');
const inboxCategoryLabel = computed(() => {
    const category = inboxCategories.find(({ type }) => type === inboxCategory.value);

    if (category) {
        return category.label;
    }

    return '';
})
const store = userStore();

const inboxCategories = [{ type: 'Outbox', label: 'lang.message_type_outbox' }, { type: 'ALL', label: 'lang.message_type_all' }, { type: 'ANNOUNCEMENT', label: 'lang.message_type_announcement' }, { type: 'NOTIFICATION', label: 'lang.message_type_notification' }, { type: 'ACTIVITY', label: 'lang.message_type_activity' }, { type: 'PAYMENT', label: 'lang.message_type_payment' }]

const composeForm = reactive({
    title: "",
    content: "",
});

const isFetchingContent = ref(false);
const messageTypes = ref([]);
const inboxMessages = ref([]);

const selectFirstMessage = () => {
    if (inboxMessages.value.records) {
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

watch(() => inboxCategory.value, () => {
    initOutbox();
})

watch(() => inboxMessages.value.records, () => {
    selectFirstMessage();
})

const sendMessage = () => {
    titleRef.value.validate();
    contentRef.value.validate();

    if (titleRef.value.hasError || contentRef.value.hasError) {
    } else {
        api.post("/session/writeOutbox", qs.stringify(composeForm)).then((res) => {
            const resCode = res.data.code;
            const resMessage = res.data.message
            if (resCode === 0) {
                $q.notify({
                    color: "positive",
                    position: "top",
                    message: "성공적으로 보냈습니다",
                    icon: "check_circle_outline"
                });
                composeForm.title = "";
                composeForm.content = "";
            } else {
                $q.notify({
                    color: "negative",
                    position: "top",
                    message: resMessage,
                    icon: "report_problem"
                });
            }
        });
    }
};

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
            inboxMessages.value = repliesResData;
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

const initMessageTypes = () => {
    api.get("/session/feedback/types").then((typesRes) => {
        const { code: typesResCode, data: typesResData } = typesRes.data

        if (typesResCode === 0) {
            messageTypes.value = typesResData;
        }
    })
}

onMounted(() => {
    initOutbox();
    initMessageTypes();
})
</script>

<style lang="scss" scoped>
.message-page {
    padding: 20px;
    height: 100%;
}

.content-form {
    padding: 10px 0;
}

.message-compose-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    height: calc(100% - 35px);
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

    .total {
        margin-left: auto;
    }

    .message-list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-right: 10px;
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

    .message-content-wrapper {
        height: 100%;

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

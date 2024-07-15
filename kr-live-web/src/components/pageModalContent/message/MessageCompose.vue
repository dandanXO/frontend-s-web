<template>
    <div class="page-container">
        <div class="form-wrapper">
            <div style="margin:0;" class="primary-button blue-square" @click="props?.onClickBack">{{ $t('lang.feedback_previous_page') }}</div>
            <form class="content-form form-template">
                <div class="form-item">
                    <label>{{ $t('lang.feedback_category') }}</label>
                    <q-skeleton v-if="isFetchingMessageTypes" type="QInput" />
                    <q-select v-else outlined dense name="title" v-model="composeForm.messageType"
                        :options="messageTypes" ref="messageTypeRef" clearable
                        @update:model-value="type => composeForm.title = type" :disable="isSubmittingMessage"
                        :loading="isSubmittingMessage" />
                </div>
                <div class="form-item">
                    <label>{{ $t('lang.message_title') }}</label>
                    <q-skeleton v-if="isFetchingMessageTypes" type="QInput" />
                    <q-input v-else dense outlined ref="titleRef" :placeholder="$t('lang.message_title_placeholder')"
                        v-model="composeForm.title" clearable lazy-rules :rules="[
                            (val) => (val && val.length > 0) || $t('lang.message_cannot_be_empty'),
                        ]" :disable="isSubmittingMessage" :loading="isSubmittingMessage" />
                </div>
                <div class="form-item">
                    <label>{{ $t('lang.message_content') }}</label>
                    <q-skeleton v-if="isFetchingMessageTypes" type="QInput" />
                    <q-input v-else dense outlined ref="contentRef" type="textarea" rows="6"
                        v-model="composeForm.content" clearable lazy-rules :rules="[
                            (val) => (val && val.length > 0) || $t('lang.message_cannot_be_empty'),
                        ]" :disable="isSubmittingMessage" :loading="isSubmittingMessage" />
                </div>
            </form>
        </div>

        <div class="action-buttons">
            <q-btn class="primary-button blue" @click.prevent="sendMessage" :label="$t('lang.message_compose_confirm')"
                :disable="isSubmittingMessage" :loading="isSubmittingMessage" />
        </div>
    </div>
</template>

<script setup id="FinanceDeposit">
import { reactive, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
var qs = require("qs");

const $q = useQuasar();
const titleRef = ref();
const contentRef = ref();
const props = defineProps(['onClickBack'])

const composeForm = reactive({
    title: "",
    content: "",
});

const messageTypes = ref([]);

const isFetchingMessageTypes = ref(false);
const isSubmittingMessage = ref(false);

const sendMessage = () => {
    titleRef.value.validate();
    contentRef.value.validate();

    if (titleRef.value.hasError || contentRef.value.hasError) {
    } else {
        isSubmittingMessage.value = true;
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
            isSubmittingMessage.value = false;
        }).catch(() => {
            isSubmittingMessage.value = false;
        });
    }
};

const initMessageTypes = () => {
    isFetchingMessageTypes.value = true;

    api.get("/session/feedback/types").then((typesRes) => {
        const { code: typesResCode, data: typesResData } = typesRes.data

        if (typesResCode === 0) {
            messageTypes.value = typesResData;
        }

        isFetchingMessageTypes.value = false;
    }).catch(() => {
        isFetchingMessageTypes.value = false;
    })
}

onMounted(() => {
    initMessageTypes();
})
</script>

<style lang="scss" scoped>
.message-page {
    height: 100%;
    padding: 20px;
}

.content-form {
    padding: 10px 0;
}

.form-wrapper {
    padding: 20px;
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

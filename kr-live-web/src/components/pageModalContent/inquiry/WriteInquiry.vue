<template>
    <div class="form-wrapper">
        <form class="content-form form-template">
            <div class="primary-button blue-square back-btn" @click="props.onClickBack">
                {{ $t('lang.feedback_previous_page') }}
            </div>
            <div class="form-item">
                <label>{{ $t('lang.feedback_category') }}</label>
                <q-select outlined dense name="title" v-model="composeForm.feedbackType" :options="feedbackTypes"
                    ref="feedbackTypeRef" :rules="[(val) => !!val || $t('lang.feedback_category_select')]" />
            </div>
            <div class="form-item">
                <label>{{ $t('lang.feedback_title') }}</label>
                <q-input dense outlined ref="titleRef" :placeholder="$t('lang.feedback_title_placeholder')"
                    v-model="composeForm.title" clearable lazy-rules :rules="[
                        (val) => (val && val.length > 0) || $t('lang.feedback_cannot_be_empty'),
                    ]" />
            </div>
            <div class="form-item">
                <label>{{ $t('lang.feedback_content') }}</label>

                <q-input dense outlined ref="contentRef" type="textarea" rows="4" v-model="composeForm.content"
                    clearable lazy-rules :rules="[
                        (val) => (val && val.length > 0) || $t('lang.feedback_cannot_be_empty'),
                    ]" />
            </div>
        </form>

        <div class="action-buttons">
            <div class="primary-button blue" @click.prevent="sendMessage">{{ $t('lang.feedback_compose_confirm') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { api } from "boot/axios";
import { useQuasar } from "quasar";

var qs = require("qs");

const props = defineProps(['onClickBack']);

const $q = useQuasar();

const feedbackTypes = ref([]);
const composeForm = reactive({
    title: "",
    content: "",
    feedbackType: ""
});
const isLoading = ref(false);
const titleRef = ref();
const contentRef = ref();

const sendMessage = () => {
    titleRef.value.validate();
    contentRef.value.validate();

    if (titleRef.value.hasError || contentRef.value.hasError) {
    } else {
        api.post("/session/feedback", qs.stringify(composeForm)).then((res) => {
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

const initInquiryTypes = () => {
    isLoading.value = true;

    Promise.all([api.get("/session/feedback/types")]).then(([typesRes]) => {
        const { code: typesResCode, data: typesResData } = typesRes.data

        if (typesResCode === 0) {
            feedbackTypes.value = typesResData;
        }

        console.log('here', typesResData)
        isLoading.value = false;
    }).catch(() => {
        isLoading.value = false;
    }).finally(() => {
        isLoading.value = false;
    })
}

onMounted(() => {
    initInquiryTypes();
})
</script>

<style lang="scss" scoped>
.back-btn {
    width: 60px;
    height: 30px;
    font-size: 12px;
    letter-spacing: -1px;
}
</style>
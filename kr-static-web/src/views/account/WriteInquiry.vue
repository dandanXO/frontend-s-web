<template>
    <div class="write-inquiry form-wrapper">
        <el-form ref="formRef" :rules="formRules" :model="composeForm" label-width="200" size="large" class="content-form form-template">
            <el-button type="primary" class="" @click="props.onClickBack">
                {{ $t('feedback.feedback_previous_page') }}
            </el-button>
            <el-form-item prop="feedbackType">
            <div class="form-item">
                <label>{{ $t('feedback.feedback_category') }}</label>
                <el-select outlined dense name="title" v-model="composeForm.feedbackType" 
                    ref="feedbackTypeRef">
                    <el-option
                        v-for="item in feedbackTypes"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                    </el-select>
            </div>
        </el-form-item>
        <el-form-item prop="title">
            <div class="form-item">
                <label>{{ $t('feedback.feedback_title') }}</label>
                <el-input dense outlined ref="titleRef" :placeholder="$t('feedback.feedback_title_placeholder')"
                    v-model="composeForm.title" clearable />
            </div>
        </el-form-item>
        <el-form-item prop="content">
            <div class="form-item">
                <label>{{ $t('feedback.feedback_content') }}</label>

                <el-input dense outlined ref="contentRef" type="textarea" rows="4" v-model="composeForm.content"
                    clearable />
            </div>
        </el-form-item>
        </el-form>

        <div class="action-buttons">
            <el-button type="primary" class="primary-button blue" @click.prevent="sendMessage(formRef)">{{ $t('feedback.feedback_compose_confirm') }}
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { server } from "@/utils/request";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const props = defineProps(['onClickBack']);

const { t } = useI18n();

const formRules = {
  feedbackType: [
    {
      required: true,
      message: t('feedback.feedback_category_select'),
      trigger: "change"
    }
  ],
  title: [
    {
      required: true,
      message: t('feedback.feedback_cannot_be_empty'),
      trigger: "change"
    }
  ],
  content: [
    {
      required: true,
      message: t('feedback.feedback_cannot_be_empty'),
      trigger: "change"
    }
  ],
};

const feedbackTypes = ref([]);
const composeForm = reactive({
    title: "",
    content: "",
    feedbackType: ""
});
const isLoading = ref(false);
const titleRef = ref();
const contentRef = ref();
const formRef = ref([]);

const sendMessage = async (elForm) => {
  if (!elForm) return;
  await elForm
    .validate((valid) => {
      if (valid) {
        server.REST.post("/session/feedback", composeForm).then((res) => {
            const resCode = res.code;
            const resMessage = res.message
            if (resCode === 0) {
                ElMessage.success("성공적으로 보냈습니다");
                composeForm.title = "";
                composeForm.content = "";
            } else {
                ElMessage.error(resMessage);
            }
        });
      } else {
      }
    })
    .catch((errr) => {
      console.log(errr);
    });
};

const initInquiryTypes = () => {
    isLoading.value = true;

    Promise.all([server.REST.get("/session/feedback/types")]).then(([typesRes]) => {
        const { code: typesResCode, data: typesResData } = typesRes

        if (typesResCode === 0) {
            feedbackTypes.value = typesResData;
        }

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

.form-wrapper.write-inquiry {
    :deep(.el-form-item__content) {
        margin:0 !important;
    }

    .form-item {
        width: 100%;
    }
}
</style>
<template>
  <a-modal v-model:visible="visible" :footer="null" centered :body-style="{ padding: 0 }" :width="335">
    <div class="feedback-modal-wrapper">
      <h3 class="feedback-modal-title">{{ $t("layout.header.feedbackModal.title") }}</h3>
      <a-form ref="formRef" class="feedback-modal-form" :model="form" :rule="rules" hide-required-mark>
        <a-form-item
          required
          name="feedbackType"
          :label="$t('layout.header.feedbackModal.form.type.label')"
          label-align="left"
        >
          <a-select
            v-model:value="form.feedbackType"
            :placeholder="$t('layout.header.feedbackModal.form.type.placeholder')"
            :options="feedbackTypes.map((type) => ({ value: type }))"
          />
        </a-form-item>
        <a-form-item
          required
          name="title"
          :label="$t('layout.header.feedbackModal.form.title.label')"
          label-align="left"
        >
          <a-input v-model:value="form.title" :placeholder="$t('layout.header.feedbackModal.form.title.placeholder')" />
        </a-form-item>

        <a-form-item
          required
          name="photo"
          :label="$t('layout.header.feedbackModal.form.photo.label')"
          label-align="left"
        >
          <button
            class="feedback-modal-upload-block"
            :class="{ dragging: uploadFieldStatus === 'dragging' }"
            :disabled="uploadFieldStatus === 'loading'"
            @click="handleUpload"
            @dragenter.prevent="handleDragEnter"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @dragover.prevent
          >
            <img v-if="form.photo" :src="imgUrl + form.photo" />
            <RiImageFill v-if="!form.photo && uploadFieldStatus === 'idle'" />
            <RiFileAddFill v-if="uploadFieldStatus === 'dragging'" />
            <a-spin v-if="uploadFieldStatus === 'loading'" />
          </button>
        </a-form-item>

        <a-form-item
          required
          name="content"
          :label="$t('layout.header.feedbackModal.form.content.label')"
          label-align="left"
        >
          <a-textarea
            v-model:value="form.content"
            :placeholder="$t('layout.header.feedbackModal.form.content.placeholder')"
            :auto-size="{ minRows: 6 }"
          />
        </a-form-item>
        <a-button class="common-btn" :loading="uploadFieldStatus === 'loading'" @click="onSubmit">
          {{ $t("layout.header.feedbackModal.confirmButton") }}
        </a-button>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { getFeedbackType, submitFeedback } from "@/api/personal/mailbox";
import { RiImageFill, RiFileAddFill } from "vue-remix-icons";
import { useHandleUpload } from "@/hooks/upload";
import { ElMessage } from "element-plus";
import { uploadImage } from "@/api/image";
import { userStore } from "@/store";
import { useI18n } from "vue-i18n";

const uploadOption = { accept: "image/jpeg,image/png,image/gif", multiple: false };
const imgUrl = process.env.VUE_APP_IMAGE_CDN + "/";

const visible = defineModel();
defineEmits(["submit"]);

const { t } = useI18n();

const { handleUpload, manualEmit } = useHandleUpload(async ([file]) => {
  uploadFieldStatus.value = "loading";
  const formData = new FormData();
  formData.append("files", file);
  formData.append("dir", "feedback");
  formData.append("overwrite", false);
  formData.append("includeDir", true);
  const result = await uploadImage(formData);
  if (result.code === 0) {
    form.value.photo = result.data;
    ElMessage.success(t("layout.header.feedbackModal.uploadSuccess"));
    uploadFieldStatus.value = "success";
  } else {
    ElMessage.error(t("layout.header.feedbackModal.uploadFail"));
    uploadFieldStatus.value = "idle";
  }
}, uploadOption);

const formRef = ref();
const store = userStore();
const feedbackTypes = ref([]);
// idle, dragging, loading, success
const uploadFieldStatus = ref("idle");
const form = ref({
  feedbackType: "",
  title: "",
  photo: "",
  content: ""
});
const rules = computed(() => ({
  feedbackType: [{ required: true, message: t("layout.header.feedbackModal.form.type.error.required") }],
  title: [
    { required: true, message: t("layout.header.feedbackModal.form.title.error.required") },
    { max: 255, message: t("layout.header.feedbackModal.form.title.error.max") }
  ],
  content: [
    { required: true, message: t("layout.header.feedbackModal.form.content.error.required") },
    { max: 255, message: t("layout.header.feedbackModal.form.content.error.max") }
  ]
}));

const handleDragEnter = () => {
  if (["loading", "success"].includes(uploadFieldStatus.value)) return;
  uploadFieldStatus.value = "dragging";
};

const handleDragLeave = () => {
  if (["loading", "success"].includes(uploadFieldStatus.value)) return;
  uploadFieldStatus.value = "idle";
};

const handleDrop = (e) => {
  const { accept, multiple } = uploadOption;
  if (["loading", "success"].includes(uploadFieldStatus.value)) return;
  const files = e.dataTransfer.files;
  if (!multiple && files.length > 1) {
    ElMessage.error("Only one file can be uploaded");
    return;
  }
  const acceptType = accept.includes(",") ? accept.split(",") : accept;
  for (file of files) {
    if (!acceptType.includes(file.type)) {
      ElMessage.error("Unsupported file type");
      return;
    }
  }

  manualEmit(files);
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      submitFeedback(form.value).then((res) => {
        if (res.code === 0) {
          ElMessage.success(t("layout.header.feedbackModal.submitSuccess"));
          uploadFieldStatus.value = "idle";
          formRef.value.resetFields();
        } else {
          ElMessage.error(t("layout.header.feedbackModal.submitFail"));
        }
      });
    })
    .catch((error) => console.log(error));
};

const loadFeedBackType = () => {
  getFeedbackType()
    .then((res) => {
      if (res.code === 0) {
        feedbackTypes.value = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  if (store.token) {
    loadFeedBackType();
  }
});

defineExpose({ loadFeedBackType });
</script>
<style scoped lang="scss">
.feedback-modal-wrapper {
  background-color: var(--body-background-color);
  border-radius: 10px;
  padding: 13px 16px;

  .feedback-modal-title {
    font-size: 18px;
    line-height: 20.92px;
    text-align: center;
    color: #ffffff;
  }

  .feedback-modal-form {
    .feedback-modal-upload-block {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0b0e0d;
      height: 96px;
      width: 100%;
      border-radius: 10px;

      &.dragging {
        border: 2px solid #8ac542;
        background-color: #131313;

        svg {
          fill: #ffffff;
        }
      }

      svg {
        width: 32px;
        fill: #5f6061;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>

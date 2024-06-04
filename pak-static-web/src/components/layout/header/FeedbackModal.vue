<template>
  <a-modal v-model:visible="visible" :footer="null" centered :body-style="{ padding: 0 }" :width="335">
    <div class="feedback-modal-wrapper">
      <h3 class="feedback-modal-title">PostComments</h3>
      <a-form ref="formRef" class="feedback-modal-form" :model="form" :rule="rules" hide-required-mark>
        <a-form-item required name="type" label="Type of opinion" label-align="left">
          <a-select
            v-model:value="form.type"
            placeholder="Please select the opinion type"
            :options="feedbackTypes.map((type) => ({ value: type }))"
          />
        </a-form-item>
        <a-form-item required name="title" label="Title" label-align="left">
          <a-input v-model:value="form.title" placeholder="pleases enter Title" />
        </a-form-item>

        <a-form-item required name="img" label="upload image" label-align="left">
          <button class="feedback-modal-upload-block">
            <img v-if="form.img" src="" />
            <RiImageFill v-else />
          </button>
        </a-form-item>

        <a-form-item required name="content" label="Content" label-align="left">
          <a-textarea
            v-model:value="form.content"
            placeholder="Please enter your feedback"
            :auto-size="{ minRows: 6 }"
          />
        </a-form-item>
        <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit">CONFIRM</a-button>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getFeedbackType } from "@/api/personal/mailbox";
import { RiImageFill } from "vue-remix-icons";

const visible = defineModel();
defineEmits(["submit"]);

const formRef = ref();
const feedbackTypes = ref([]);
const form = ref({
  type: "",
  title: "",
  img: "",
  content: ""
});

const rules = ref({
  type: [{ required: true, message: "Opinion type is required" }],
  title: [
    { required: true, message: "Title is required" },
    { max: 255, message: "Title should be less than 255 characters" }
  ],
  content: [
    { required: true, message: "Content is required" },
    { max: 255, message: "Content should be less than 500 characters" }
  ]
});

const onSubmit = () => {};

onMounted(() => {
  getFeedbackType()
    .then((res) => {
      if (res.code === 0) {
        feedbackTypes.value = res.data;
      }
    })
    .catch((error) => console.log(error));
});
</script>
<style scoped lang="scss">
.feedback-modal-wrapper {
  background-color: var(--body-background-color);
  border-radius: 10px;
  padding: 13px 16px;

  .feedback-modal-title {
    font-family: Poppins;
    font-size: 18px;
    font-weight: 700;
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

      svg {
        width: 32px;
        fill: #5f6061;
      }
    }
  }
}
</style>

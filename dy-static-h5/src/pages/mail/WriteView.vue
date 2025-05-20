<template>
  <div class="write-letter">
    <q-form ref="formRef" :model="mailDetailList">
      <div class="q-pa-md bg-white q-ma-sm">
        <div class="top row justify-between items-center">
          <div class="title">标题</div>
          <div class="selector-wrapper">
            <q-btn-dropdown
              class="text-blue-6"
              border
              :label="`${mailDetailList.feedbackType || '快捷输入'}`"
              menu-anchor="bottom end"
            >
              <q-list>
                <q-item v-for="(item, i) in feedbackTypes" :key="i" clickable v-close-popup @click="onItemClick(item)">
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <span class="selector-error-msg">{{ feedbackTypesErrorMsg }}</span>
          </div>
        </div>
        <q-input
          :rules="[
            (val) => (val && val.length > 0) || '请输入标题',
            (val) => (val && val.length < 255) || '标题长度为255以下.'
          ]"
          ref="titleRef"
          name="title"
          counter
          bottom-slots
          maxlength="255"
          v-model="mailDetailList.title"
          class="q-mt-md write-input"
          filled
          placeholder="请输入标题"
        />
      </div>

      <div class="write-board-div q-pa-md">
        <div class="top q-pb-md">上传图片</div>
        <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
      </div>

      <div class="q-pa-md bg-white q-ma-sm">
        <div class="top title q-pb-xs">内容</div>
        <q-input
          ref="contentRef"
          :rules="[
            (val) => (val && val.length > 0) || '请输入内容',
            (val) => (val && val.length < 501) || '内容长度为500以下'
          ]"
          name="content"
          filled
          type="textarea"
          :auto-size="{ minRows: 4, maxRows: 16 }"
          class="mail-txtarea q-mb-md write-input"
          counter
          maxlength="500"
          v-model="mailDetailList.content"
          placeholder="请输入内容"
        />
      </div>
      <div class="q-pa-md">
        <q-btn color="dyblue" class="fit submit-btn" @click="onSubmit" label="发送" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import FileUpload from "components/FileUpload.vue";

var qs = require("qs");
const $q = useQuasar();
const router = useRouter();

const feedbackTypes = ref([]);

const uploadFileRef = ref();
const getImageLink = (linkId) => {
  mailDetailList.value.photo = linkId;
};

const loadFeedbackType = () => {
  api
    .get("/session/feedback/types", {})
    .then((res) => {
      const { code, data } = res;
      if (code === 0) feedbackTypes.value = data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const mailDetailList = ref({
  feedbackType: "",
  title: "",
  content: ""
});
const onItemClick = (item) => {
  mailDetailList.value.feedbackType = item;
  feedbackTypesErrorMsg.value = "";
};

const titleRef = ref();
const contentRef = ref();
const feedbackTypesErrorMsg = ref("");
const onSubmit = () => {
  titleRef.value.validate();
  contentRef.value.validate();
  if (titleRef.value.hasError || contentRef.value.hasError || !mailDetailList.value.feedbackType) {
    $q.loading.hide();
    if(!mailDetailList.value.feedbackType) {
      feedbackTypesErrorMsg.value = "请选择反馈类型";
    }
  } else {
    api
      .post("/session/feedback", qs.stringify(mailDetailList.value))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "发送成功",
            icon: "check_circle_outline"
          });

          mailDetailList.value.feedbackType = "";
          mailDetailList.value.title = "";
          mailDetailList.value.content = "";

          router.push("/account/mail");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

onMounted(() => {
  loadFeedbackType();
});
</script>

<style scoped lang="scss">
.write-letter {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .title {
    font-weight: 600;
    font-size: 16px;
  }

  .selector-wrapper {
    display: flex;
    flex-direction: column;
    .selector-error-msg {
      color: var(--q-negative);
      padding: 8px 12px 0;
      font-size: 12px;
      line-height: 1;
      min-height: 26px;
    }
  }

  .q-field--filled .q-field__control {
    border-radius: 10px;
  }

  .submit-btn {
    height: 45px;
    font-size: 16px;
    border-radius: 8px;
    background: linear-gradient(180deg, #52acff, #3559da);
  }
}
</style>

<template>
  <q-page class="write-letter">
    <div class="box-width">
      <q-form ref="formRef" :model="mailDetailList">
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.feedbackType')">
                <template #input>
                  <q-select
                    outlined
                    clearable
                    :options="feedbackTypes"
                    :display-value="`${mailDetailList.feedbackType || $t('form.feedbackType_select')}`"
                    v-model="mailDetailList.feedbackType"
                    :rules="[(val) => !!val || $t('form.feedbackType_pleaseSelect')]"
                    ref="feedbackTypeRef"
                    hide-bottom-space
                    type="text"
                  >
                  </q-select>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.subjectTitle')">
                <template #input>
                  <q-input
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.subjectTitle_rules_01'),
                      (val) => (val && val.length <= 200) || $t('form.subjectTitle_rules_02')
                    ]"
                    ref="titleRef"
                    name="title"
                    type="text"
                    counter
                    bottom-slots
                    clearable
                    maxlength="200"
                    v-model="mailDetailList.title"
                    class="textarea-input"
                    label-color="brand"
                    :placeholder="$t('form.subjectTitle_placeholder')"
                  />
                </template>
              </InputField>
            </template>
          </InputRowGrid>
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.uploadImage')">
                <template #input>
                  <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
                </template>
              </InputField>
            </template>
          </InputRowGrid>
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.feedbackType')">
                <template #input>
                    <q-input
                      ref="contentRef"
                      :rules="[
                        (val) => (val && val.length > 0) || $t('form.content_rules_01'),
                        (val) => (val && val.length < 501) || $t('form.content_rules_02')
                      ]"
                      name="content"
                      standout
                      type="textarea"
                      :auto-size="{ minRows: 4, maxRows: 16 }"
                      class="textarea-input mail-txtarea q-mb-md"
                      counter
                      maxlength="500"
                      v-model="mailDetailList.content"
                      :placeholder="$t('form.content_placeholder')"
                      label-color="brand"
                    ></q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </q-form>
    </div>
  </q-page>

  <q-dialog  width="100%" v-model="modalSendSuccess" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("notify.messageSent") }}</div>
        <div class="txt-content q-mt-md text-center">{{ $t("notify.feedbackSentSuccess") }}</div>
        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn label="Confirm" no-caps class="btn-confirm" v-close-popup @click="emitClose()" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import FileUpload from "components/FileUpload.vue";
import InputField from "components/auth/InputField.vue";
import InputRowGrid from "components/auth/InputRowGrid.vue";

const emit = defineEmits(["close-modal"]);

const emitClose = () => {
  emit("close-modal");
};

var qs = require("qs");
const $q = useQuasar();
const router = useRouter();
const options = ["存款问题", "转账问题", "提款问题", "其他"];
const mailDetailList = ref({
  feedbackType: "",
  title: "",
  content: ""
});

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

const onItemClick = (item) => {
  mailDetailList.value.feedbackType = item;
};
const feedbackTypeRef = ref();
const titleRef = ref();
const contentRef = ref();
const modalSendSuccess = ref(false);
const onSubmit = () => {
  feedbackTypeRef.value.validate();
  titleRef.value.validate();
  contentRef.value.validate();
  if (titleRef.value.hasError || contentRef.value.hasError || feedbackTypeRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post("/session/feedback", qs.stringify(mailDetailList.value))
      .then((response) => {
        if (response.code === 0) {
          modalSendSuccess.value = true;

          mailDetailList.value.feedbackType = "";
          mailDetailList.value.title = "";
          mailDetailList.value.content = "";
          uploadFileRef.value.resetFile();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const closePage = () => {
  router.push("/account/letters");
  mailDetailList.value.title = "";
  mailDetailList.value.content = "";
};
onMounted(() => {
  loadFeedbackType();
});
</script>

<style scoped lang="scss">
.modal-feedback-div {
  background: white;
}

.write-letter {
  width: 100%;
  margin: 10px auto 30px;

  .top {
    display: flex;
    justify-content: space-between;
  }

  .write-board-div {
    // background: $white;
    // box-shadow: $shadow-bg;

    margin: 14px auto 15px;

    .q-field--filled .q-field__control {
      // background: salmon;
    }
  }

  .textarea-input {
    border-radius: 10px;

    .q-field__control {
      // background: salmon;
      // #0b0e0d
    }
  }
}
</style>
<style lang="scss">
.write-board-div {
  .q-field--filled .q-field__control {
    border-radius: 10px;
    // border: 1px solid #000;
    // background: #f7f8fb;
    // background: salmon;
  }
}

.body--dark {
  .write-letter {
    .write-board-div {
      // @include content-block-dark-with-border;
      .q-field--filled .q-field__control {
        // background: #0b0e0d;
        background: salmon;
        // border: 1px solid #000000;
      }
    }
  }
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
  padding: 0px;
}

.title {
  color: #8c968f;
}

.btn-confirm {
  
  // font-weight: 700;
  // width: 100%;
  // padding: 10px 10px;
  // font-size: 16px;
  // background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  // color: #000000;
  // box-shadow: 0px 2px 0px 0px #1cca6a;
  // border-radius: 4px;
  // height: unset;
  background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  color: #ffffff;
  width: 100%;
  border-radius: 12px;
  padding: 10px;
  font-weight: bold;
}
</style>

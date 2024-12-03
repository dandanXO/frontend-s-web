<template>
  <q-page class="write-letter">
    <div class="box-width">
      <q-form ref="formRef" :model="mailDetailList" class="q-px-md">
        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md">
            <div class="title">{{ $t("form.feedbackType") }}</div>
          </div>
          <q-select
            name="title"
            v-model="mailDetailList.feedbackType"
            :options="feedbackTypes"
            :label="`${mailDetailList.feedbackType || $t('form.feedbackType_select')}`"
            ref="feedbackTypeRef"
            :rules="[(val) => !!val || $t('form.feedbackType_pleaseSelect')]"
            label-color="brand"
            outlined
            color="green"
          />

          <!--
          <q-btn-dropdown style="width:100%;" color="brightbtn" :label="`${mailDetailList.feedbackType || '快捷输入'}`" menu-anchor="bottom end">
            <q-list>
              <q-item v-for="(item, i) in feedbackTypes" :key="i" clickable v-close-popup @click="onItemClick(item)">
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          -->
        </div>
        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md">
            <div class="title">{{ $t("form.subjectTitle") }}</div>
          </div>
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
            maxlength="200"
            v-model="mailDetailList.title"
            class="textarea-input"
            label-color="brand"
            outlined
            color="green"
            :placeholder="$t('form.subjectTitle_placeholder')"
          />
        </div>

        <!-- <InputRowGrid>
          <template #fields>
            <InputField :label="'Subject title'">
              <template #input>
                <q-input
                  type="text"
                  maxlength="200"
                  v-model="mailDetailList.title"
                  hide-bottom-space
                  ref="titleRef"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter subject title',
                    (val) => (val && val.length <= 200) || 'Subject title length is 200 words or less'
                  ]"
                  label-color="brand"
                  outlined
                  color="green"
                  placeholder="Please enter subject title"
                ></q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid> -->

        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md title">{{ $t("form.uploadImage") }}</div>
          <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
        </div>

        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md title">{{ $t("form.content") }}</div>
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
            outlined
            color="green"
          ></q-input>
        </div>
        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">{{ $t("btn.post") }}</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>

  <q-dialog width="100%" v-model="modalSendSuccess" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />
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
@import "../css/mixin.scss";

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

    .q-field {
      :deep(.q-field__control) {
        background: #ffffff1a;

        &::before {
          @include gradient-border(
            linear-gradient(
              90deg,
              rgba(243, 195, 93, 0.15) 0%,
              rgba(243, 195, 93, 0) 24%,
              rgba(243, 195, 93, 0.15) 100%
            )
          );
        }
      }
      :deep(.q-field__label) {
        color: #5f6061;
      }
      :deep(.q-placeholder)::placeholder {
        color: #5f6061;
      }
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
  background: url(../assets/images/index/btn-bg-green-small.png) no-repeat center center;
  background-size: contain;
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #000a01;
  border: none;
  &::before {
    display: none;
  }
}
</style>

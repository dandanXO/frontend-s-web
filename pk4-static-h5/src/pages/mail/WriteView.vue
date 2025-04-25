<template>
  <q-page class="write-letter">
    <div class="box-width">
      <q-form ref="formRef" :model="mailDetailList">
        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md">
            <div class="title">Feedback type</div>
          </div>
          <q-select
            name="title"
            v-model="mailDetailList.feedbackType"
            :options="feedbackTypes"
            :label="`${mailDetailList.feedbackType || 'Quick Input'}`"
            ref="feedbackTypeRef"
            :rules="[(val) => !!val || 'Please select']"
            label-color="brand"
            outlined
            color="green"
            bg-color="black"
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
            <div class="title">Subject title</div>
          </div>
          <q-input
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter subject title',
              (val) => (val && val.length <= 200) || 'Subject title length is 200 words or less'
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
            placeholder="Please enter subject title"
            bg-color="black"
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
          <div class="top q-pb-md title">Upload image</div>
          <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
        </div>

        <div class="write-board-div q-py-sm">
          <div class="top q-pb-md title">Content</div>
          <q-input
            ref="contentRef"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter content',
              (val) => (val && val.length < 501) || 'Content length is 500 words or less'
            ]"
            name="content"
            standout
            type="textarea"
            :auto-size="{ minRows: 4, maxRows: 16 }"
            class="textarea-input mail-txtarea q-mb-md"
            counter
            maxlength="500"
            v-model="mailDetailList.content"
            placeholder="Please enter content"
            label-color="brand"
            outlined
            color="green"
            bg-color="black"
          ></q-input>
        </div>
        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">POST</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>

  <q-dialog width="100%" v-model="modalSendSuccess" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Message Sent</div>
        <div class="txt-content q-mt-md text-center">Your feedback has been sent successfully!</div>
        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn label="Confirm" no-caps class="btn-confirm" v-close-popup @click="router.push('/account/feedback')" />
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog class="modal-feedback-div" @hide="closePage" v-model="zmodalSendSuccess">
    <q-card style="width: 330px" class="modalcontent">
      <div class="headers">
        <div class="black-titles">Feedback sent</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/inbox/success-tick-icon.svg" />
        <p>Feedback sent successfully</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="text-teal">
        <q-btn class="common-md-btn" flat label="Confirm" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import FileUpload from "components/FileUpload.vue";
import InputField from "components/auth/InputField.vue";
import InputRowGrid from "components/auth/InputRowGrid.vue";

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

// .btn-cancel {
//   // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
//   // border: 1px solid #5d8956;
//   // font-weight: 700;
//   // color: #fff;
//   // border: 1px solid #ffffff80;
//   // border-radius: 12px;
//   // width: 140px;
//   // height: 42px;
//   font-weight: 700;
//   width: 100%;
//   padding: 10px 40px;
//   font-size: 16px;
//   background: #455152;
//   color: #ffffff;

//   box-shadow: 0px 2px 0px 0px #2A3637;
// }
// .btn-confirm {
//   // background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
//   // border: 1px solid #5d8956;
//   // font-weight: 700;
//   // width: 140px;
//   // height: 42px;
//   // color: #fff;
//   // border-radius: 12px;
  
//   font-weight: 700;
//   width: 100%;
//   padding: 10px 10px;
//   font-size: 16px;
//   background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);
//   color: #000000;
//   box-shadow: 0px 2px 0px 0px #1CCA6A;
//   border-radius: 4px;
//   height: unset;
// }

</style>

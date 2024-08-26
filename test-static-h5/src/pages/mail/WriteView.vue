<template>
  <q-page class="write-letter">
    <div class="box-width">
      <q-form ref="formRef" :model="mailDetailList">
        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">
            <div class="title">意见类型</div>
          </div>
          <q-select
            name="title"
            v-model="mailDetailList.feedbackType"
            :options="feedbackTypes"
            :label="`${mailDetailList.feedbackType || '快捷输入'}`"
            ref="feedbackTypeRef"
            :rules="[(val) => !!val || '请选择']"
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
        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">
            <div class="title">标题</div>
          </div>
          <q-input
            :rules="[
              (val) => (val && val.length > 0) || '请输入标题',
              (val) => (val && val.length <= 200) || '标题长度为200或以下.'
            ]"
            ref="titleRef"
            name="title"
            counter
            bottom-slots
            maxlength="200"
            v-model="mailDetailList.title"
            class="textarea-input"
            filled
            placeholder="请输入标题"
          />
        </div>

        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">上传图片</div>
          <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
        </div>

        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">内容<span class="red-note">注:若您的建议和反馈被本平台使用采纳，我们将奉送38~888元奖金</span></div>
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
            class="textarea-input mail-txtarea q-mb-md"
            counter
            maxlength="500"
            v-model="mailDetailList.content"
            placeholder="请输入您的信息内容"
          />
        </div>
        <div class="q-ma-sm">
          <q-btn class="common-large-btn full-width q-mt-lg" @click="onSubmit" label="发送" />
        </div>
      </q-form>
    </div>
  </q-page>

  <q-dialog class="modal-common-div" @hide="closePage" v-model="modalSendSuccess">
    <q-card style="width: 330px" class="modalcontent">
      <div class="headers">
        <div class="black-titles">邮件已发送</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/inbox/success-tick-icon.svg" />
        <p>提交成功！</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="text-teal">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
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
.write-letter {
  width: 100%;
  margin: 10px auto 30px;

  .top {
    display: flex;
    justify-content: space-between;
  }

  .write-board-div {
    background: $white;
    box-shadow: $shadow-bg;

    margin: 14px auto 15px;

    .red-note {
        color: #ff0000;
        width: 85%;
      }
    .q-field--filled .q-field__control {
    }
  }

  .textarea-input {
    border-radius: 10px;

    .q-field__control {
    }
  }
}
</style>
<style lang="scss">
.write-board-div {
  .q-field--filled .q-field__control {
    border-radius: 10px;
    border: 1px solid $bg-blue;
    background: #f7f8fb;
  }
}

.body--dark {
  .write-letter {
    .write-board-div {
      @include content-block-dark-with-border;
      .q-field--filled .q-field__control {
        background: unset;
        border: 1px solid $border-dark;
      }
    }
  }
}
</style>

<template>
  <q-page class="write-letter">
    <div class="box-width">
      <q-form ref="formRef" :model="mailDetailList">
        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">
            <div class="title">{{ $t("lang.compose_title") }}</div>
            <!-- <q-btn-dropdown color="brightbtn" label="快捷输入" menu-anchor="bottom end">
              <q-list>
                <q-item v-for="(item, i) in options" :key="i" clickable v-close-popup @click="onItemClick(item)">
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown> -->
          </div>
          <q-input
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.compose_pleaseinserttitle'),
              (val) => (val && val.length < 255) || $t('lang.compose_titlelength')
            ]"
            ref="titleRef"
            name="title"
            counter
            bottom-slots
            maxlength="255"
            v-model="mailDetailList.title"
            class="textarea-input"
            filled
            :placeholder="$t('lang.compose_pleaseinserttitle')"
          />
        </div>
        <div class="write-board-div q-pa-md">
          <div class="top q-pb-md">{{ $t("lang.compose_content") }}</div>
          <q-input
            ref="contentRef"
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.compose_pleaseinsertcontent'),
              (val) => (val && val.length < 501) || $t('lang.compose_contentlength')
            ]"
            name="content"
            filled
            type="textarea"
            :auto-size="{ minRows: 4, maxRows: 16 }"
            class="textarea-input mail-txtarea q-mb-md"
            counter
            maxlength="500"
            v-model="mailDetailList.content"
            :placeholder="$t('lang.compose_pleaseinsertcontent')"
          />
        </div>
        <div class="q-ma-sm">
          <q-btn class="common-large-btn full-width q-mt-lg" @click="onSubmit" :label="$t('lang.compose_send')" />
        </div>
      </q-form>
    </div>
  </q-page>

  <q-dialog class="modal-common-div" @hide="closePage" v-model="modalSendSuccess">
    <q-card style="width: 330px" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.compose_msgsent") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/inbox/success-tick-icon.svg" />
        <p>{{ $t("lang.compose_msgsubmitsuccess") }}</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat :label="$t('lang.compose_confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
var qs = require("qs");
const $q = useQuasar();
const router = useRouter();
const options = ["存款问题", "转账问题", "提款问题", "其他"];
const mailDetailList = ref({
  title: "",
  content: ""
});
const onItemClick = (item) => {
  mailDetailList.value.title = item;
};
const titleRef = ref();
const contentRef = ref();
const modalSendSuccess = ref(false);
const onSubmit = () => {
  titleRef.value.validate();
  contentRef.value.validate();
  if (titleRef.value.hasError || contentRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post("/session/writeOutbox", qs.stringify(mailDetailList.value))
      .then((response) => {
        if (response.code === 0) {
          modalSendSuccess.value = true;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const closePage = () => {
  router.push("/account/inbox");
  mailDetailList.value.title = "";
  mailDetailList.value.content = "";
};
onMounted(() => {});
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
</style>

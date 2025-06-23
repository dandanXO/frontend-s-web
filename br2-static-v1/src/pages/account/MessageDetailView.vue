<template>
  <div class="msg-detail-container">
    <div class="header">
      <div class="title">{{ mailDataRef.title }}</div>
      <div class="send-time">{{ mailDataRef.sendTime && convertToGMT7(mailDataRef.sendTime) }}</div>
    </div>
    <div class="content">{{ mailDataRef.content }}</div>
  </div>
</template>

<script setup>
import { onActivated, ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { convertToGMT55, convertToGMT7 } from "src/boot/utils";

const router = useRouter();
const store = userStore();
const qs = require("qs");

const mailDataRef = ref(store.currentMailData);

const onCloseBtnClick = () => {
  router.push("/account/message");
};

const updateMailReadStatus = () => {
  api
    .post(
      "/session/inbox/read",
      qs.stringify({
        id: mailDataRef.value.id
      })
    )
    .then((response) => {
      store.addReadMsg(mailDataRef.value.id);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onActivated(() => {
  mailDataRef.value = store.currentMailData;
  updateMailReadStatus();
});
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;

  .dialog-title {
    margin: 0 0 0 2.5rem;
    background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  .close-btn {
    width: 2rem;
    height: 2rem;
  }
}

.msg-detail-container {
  margin: 1rem;
  padding: 1rem 1.5rem;
  background-color: #1F241F;
  border-radius: 6px;

  .header {
    display: grid;
    width: 100%;
    border-bottom: 1px solid #35383F;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 0rem 0 0.8rem;
    }

    .send-time {
      font-size: 12px;
      // font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      margin: 0rem 0 0.4rem;
      text-align: left;
    }
  }

  .content {
    font-size: 14px;
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>

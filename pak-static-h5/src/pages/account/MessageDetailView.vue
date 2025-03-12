<template>
  <!--  <div class="dialog-header">-->
  <!--    <div></div>-->
  <!--    <div class="text-h5 dialog-title">Message Detail</div>-->
  <!--    <img class="close-btn" src="../../assets/images/index/close-btn.png" alt="" @click="onCloseBtnClick()" />-->
  <!--  </div>-->

  <div class="msg-detail-container">
    <div class="send-time">{{ mailDataRef.sendTime && convertToGMT55(mailDataRef.sendTime) }}</div>
    <div class="header">
      <div class="title">{{ mailDataRef.title }}</div>
    </div>
    <div class="content">{{ mailDataRef.content }}</div>
  </div>
</template>

<script setup>
import { onActivated, ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import moment from "moment";
import { convertToGMT55 } from "src/boot/utils";

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
      "/session/pm/inbox/read",
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
  padding: 20px;
  background: #323738;
  border-radius: 10px;
  margin: 20px;
    .send-time {
      font-size: 14px;
      font-weight: 700;
      color: #B2BDBF;
    }
  .header {
    // display: grid;
    // grid-template-columns: 1fr 120px;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 1rem 0;
    }

  }

  .content {
    font-size: 14px;
    // font-weight: 700;
    color: #FFFFFF80;

  }
}
</style>

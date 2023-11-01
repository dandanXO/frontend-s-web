<template>
  <div class="dialog-header">
    <div></div>
    <div class="text-h5 dialog-title">Message Detail</div>
    <img class="close-btn" src="../../assets/images/index/close-btn.png" alt="" @click="onCloseBtnClick()" />
  </div>

  <ContentView contentTopStatus="faded">
    <div class="msg-detail-container">
      <div class="title">{{ mailDataRef.title }}</div>
      <div class="send-time">{{ mailDataRef.sendTime && moment(mailDataRef.sendTime).format("YYYY-MM-DD HH:mm") }}</div>

      <div class="title">{{ mailDataRef.title }}</div>
      <div class="content">{{ mailDataRef.content }}</div>
    </div>
  </ContentView>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import moment from "moment";
import ContentView from "../../components/ContentView.vue";

const router = useRouter();
const store = userStore();

const mailDataRef = ref(store.currentMailData);

const onCloseBtnClick = () => {
  router.push("/account/message");
};
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
  .title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0.25rem 0;
  }

  .send-time {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    margin: 0.75rem 0;
  }

  .content {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>

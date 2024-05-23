<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <div class="" v-if="isCreateMode">
        <q-btn :label="'뒤쪽에'" @click="isCreateMode = false" color="blue" />
        <form class="content-form">
          <p>
            <input placeholder="제목을 입력해주세요." v-model="serviceForm.title" />
          </p>
          <p>
            <textarea rows="4" v-model="serviceForm.content" />
          </p>
        </form>
      </div>
      <div v-else>
        <div style="width:100%;display:flex;justify-content:flex-end;">
          <q-btn :label="'글쓰기'" @click="isCreateMode = true" style="margin-left:auto" color="blue" />
        </div>
        <q-item-section class="table-row-head">
          <q-item-label>번호</q-item-label>
          <q-item-label>제목</q-item-label>
          <q-item-label>날짜</q-item-label>
        </q-item-section>
        <template v-for="item in articleData" :key="item.page">
          <q-item-section class="table-row table-row-title">
            <q-item-label>{{ item.number }}</q-item-label>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label>{{ item.date }}</q-item-label>
          </q-item-section>
        </template>
      </div>
    </q-card-section>
    <q-card-actions class="modal-body-buttons" align="center">
      <q-btn class="form-button blue" label="확신하는" @click.prevent="sendMessage"></q-btn>
      <!-- <q-btn class="form-button yellow" label="전체확인"></q-btn> -->
    </q-card-actions>
  </div>
</template>

<script setup id="FinanceDeposit">
import { reactive, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
var qs = require("qs");

const $q = useQuasar();
const isCreateMode = ref(false);

const serviceForm = reactive({
  title: "",
  content: ""
});

const feedbackData = ref([]);

const sendMessage = () => {
  api.post("/session/writeOutbox", qs.stringify(serviceForm)).then((res) => {
    const resCode = res.data.code;
    const resMessage = res.data.message
    if (resCode === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "성공적으로 보냈습니다",
        icon: "check_circle_outline"
      });
      serviceForm.title = "";
      serviceForm.content = "";
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: resMessage,
        icon: "report_problem"
      });
    }
  });
};

const initFeedbackReplies = () => {
  api.get('/session/feedback/replies').then((res) => {
    const { code, data } = res.data

    if(code === 0) {
      feedbackData.value = data.records;
    }
  })
}

onMounted(() => {
  initFeedbackReplies();
})
</script>

<style lang="scss" scoped>
.modal-body-content {
  .table-row-head {
    padding-top: 4px;
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    .q-item__label {
      margin: auto;
      padding-bottom: 12px;
      &:nth-child(2) {
        text-align: left;
        margin-left: unset;
        margin-right: unset;
      }
    }
  }
  .table-row {
    padding: 0 10px 0 10px;
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    .q-item__label {
      margin: auto;
      //padding-bottom: 12px;
      &:nth-child(2) {
        text-align: left;
        margin-left: unset;
        margin-right: unset;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .table-row-title {
    background: #212121;
    margin-bottom: 5px;
    padding: 10px 0;
  }
  .content-form {
    p {
      margin-top: 20px;
    }
    input,
    textarea {
      width: 100%;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5c5c5c;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }
  }
}
.modal-body-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
}
.modal-body-content {
}
.modal-body-buttons {
  width: 100%;
  .form-button {
    //display: inline-block;
    height: 70px;
    width: 200px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    &.blue {
      background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
    }
    &.yellow {
      background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
    }
  }
}

@media (max-width: 768px) {
  .modal-body-buttons {
    .form-button {
      width: 140px;
      height: 40px;
      max-width: 40vw;
    }
  }
}
</style>

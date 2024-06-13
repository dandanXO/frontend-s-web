<template>
  <div class="feedback-form">
    <div class="form-wrapper" v-if="isCreateMode">
      <form class="content-form form-template">
        <div class="primary-button blue-square back-btn" @click="isCreateMode = false">
          전 페이지로 이동
        </div>
        <div class="form-item">
          <label>유형</label>
          <q-select outlined dense name="title" v-model="serviceForm.feedbackType" :options="feedbackTypes"
            ref="feedbackTypeRef" :rules="[(val) => !!val || '선택해주세요']" />
        </div>
        <div class="form-item">
          <label>제목을</label>
          <q-input dense outlined ref="titleRef" placeholder="제목을 입력해주세요." v-model="serviceForm.title" clearable
            lazy-rules :rules="[
              (val) => (val && val.length > 0) || '비워둘 수 없습니다.',
            ]" />
        </div>
        <div class="form-item">
          <label>내용물</label>

          <q-input dense outlined ref="contentRef" type="textarea" rows="4" v-model="serviceForm.content" clearable
            lazy-rules :rules="[
              (val) => (val && val.length > 0) || '비워둘 수 없습니다.',
            ]" />
        </div>
      </form>

      <div class="action-buttons">
        <div class="primary-button blue" @click.prevent="sendMessage">확신하는</div>
      </div>
    </div>
    <div class="feedback-compose-form" v-else>
      <div class="primary-button blue-square compose-btn" @click="isCreateMode = true" style="margin-left:auto">
        글쓰기
      </div>



      <div class="feedback-replies-list">
        <q-list bordered class="rounded-borders">
          <div style="max-height: 500px;overflow-y:auto;">
            <q-expansion-item v-for="item in outboxData" :key="item.page" @click="readFeedback(item.id)"
              expand-separator :icon="item.readTime ? 'mark_email_read' : 'mark_email_unread'" :label="item.title"
              :caption="`보낸 시간 ${moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')} | 읽는 시간 ${moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`">
              <q-card style="background:transparent;padding:10px;margin:0px;">
                <q-card-section style="white-space:pre-wrap;max-height:400px;overflow-y:auto;">
                  {{ item.content }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup id="FinanceDeposit">
import { reactive, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import moment from 'moment'
var qs = require("qs");

const $q = useQuasar();
const isCreateMode = ref(false);
const titleRef = ref();
const contentRef = ref();

const serviceForm = reactive({
  title: "",
  content: "",
  feedbackType: ""
});

const feedbackTypes = ref([]);

const outboxData = ref([]);

const sendMessage = () => {
  titleRef.value.validate();
  contentRef.value.validate();

  if (titleRef.value.hasError || contentRef.value.hasError) {
  } else {
    api.post("/session/feedback", qs.stringify(serviceForm)).then((res) => {
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
  }
};

const initOutbox = () => {
  api.get('/session/feedback/replies').then((res) => {
    const { code, data } = res.data

    if (code === 0) {
      outboxData.value = data.records;
    }
  })

  api.get("/session/feedback/types").then((res) => {
    const { code, data } = res.data
    feedbackTypes.value = data;
  })
}

const readFeedback = (id) => {
  const currentMail = outboxData.value.find((data) => data.id === id);

  if (!currentMail?.content) {
    api.get(`/session/feedback/${id}/read`).then((res) => {
      const { code, data } = res.data

      if (code === 0 && !currentMail.readTime) {
        $q.notify({
          message: "메시지 읽기",
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
      }

      currentMail.content = data.content;
      currentMail.readTime = moment().format('YYYY-MM-DD HH:mm:ss');
    })
      .catch((error) => {
        console.log(error);
      });
  }
}

onMounted(() => {
  initOutbox();
})
</script>

<style lang="scss" scoped>
.feedback-form {
  .feedback-compose-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
  }

  .back-btn {
    width: 100px;
    height: 30px;
    font-size: 12px;
    letter-spacing: -1px;
  }

  .compose-btn {
    width: 60px;
    height: 30px;
    font-size: 12px;
    letter-spacing: -1px;
  }

  .feedback-replies-list {
    // max-width: 485px;
  }
}

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

.modal-body-content {}

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

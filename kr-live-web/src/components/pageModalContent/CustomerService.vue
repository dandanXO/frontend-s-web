<template>
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
        <label>제목</label>
        <q-input dense outlined ref="titleRef" placeholder="제목 입력해주세요." v-model="serviceForm.title" clearable
          lazy-rules :rules="[
            (val) => (val && val.length > 0) || '비워둘 수 없습니다.',
          ]" />
      </div>
      <div class="form-item">
        <label>내용</label>

        <q-input dense outlined ref="contentRef" type="textarea" rows="4" v-model="serviceForm.content" clearable
          lazy-rules :rules="[
            (val) => (val && val.length > 0) || '비워둘 수 없습니다.',
          ]" />
      </div>
    </form>

    <div class="action-buttons">
      <div class="primary-button blue" @click.prevent="sendMessage">확인</div>
    </div>
  </div>
  <div class="feedback-compose-form" v-else>
    <div class="feedback-container">
      <div class="feedback-list-wrapper">
        <div class="header">
          <div class="primary-button blue-square compose-btn" @click="isCreateMode = true">
            글쓰기
          </div>
          <span class="total">{{ $t('lang.announcement_total') }} {{ feedbackReplies.length }}</span>
        </div>

        <q-list bordered separator class="feedback-list">
          <q-item clickable v-ripple v-for="item in feedbackReplies" :key="item.page" @click="readFeedback(item.id)"
            :active="item === selected" active-class="active-announcement">
            <q-item-section>
              <q-item-label lines="2"><span class="title">{{ item.title }}</span></q-item-label>
              <!-- <q-item-label caption lines="2"><span class="caption">{{ item.content }}</span></q-item-label> -->
            </q-item-section>

            <q-item-section side top class="info-wrapper">
              <q-item-label caption><span class="date-time">{{ formatDate(item.createTime) }}</span></q-item-label>
              <q-icon name="mark_email_read" v-if="item.readTime" :title="$t('lang.feedback_read')" />
              <q-icon name="mark_email_unread" v-else :title="$t('lang.feedback_unread')" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-scroll-area class="feedback-content-wrapper">
        <div v-if="selected" class="feedback-content">
          <div>
            <div class="title">{{ selected.title }}</div>
          </div>
          <span class="date-time">{{ formatDate(selected.createTime) }}</span>
          <span class="date-time">{{ $t('lang.feedback_read_at') }} {{ formatDate(selected.readTime, 'LLL') }}</span>
          <div class="content-loading" v-if="isFetchingContent">
            <q-spinner-gears size="50px" /><span>{{ $t('lang.feedback_loading_content') }}</span>
          </div>
          <div v-else class="content" v-html="selected.content" style="white-space: pre-line"></div>
        </div>
        <div class="feedback-no-data" v-else>{{ $t('lang.announcement_no_selected') }}</div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup id="FinanceDeposit">
import { reactive, ref, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import moment from 'moment'
var qs = require("qs");

const $q = useQuasar();
const isCreateMode = ref(false);
const titleRef = ref();
const contentRef = ref();
const selected = ref();

const serviceForm = reactive({
  title: "",
  content: "",
  feedbackType: ""
});

const isFetchingContent = ref(false);

const feedbackTypes = ref([]);

const feedbackReplies = ref([]);

const selectFirstFeedback = () => {
  if (!selected.value && feedbackReplies.value) {
    // if don't have timeout, ellipsis for title won't show
    setTimeout(() => {
      selected.value = feedbackReplies.value[0];
    }, 100)
  }
}
watch(() => feedbackReplies.value, () => {
  selectFirstFeedback();
})

onMounted(() => {
  if (feedbackReplies.value) {
    selectFirstFeedback();
  }
})

const formatDate = (timestamp, format) => moment(timestamp).locale('ko').format(format || "LL");

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
      feedbackReplies.value = data.records;
    }
  })

  api.get("/session/feedback/types").then((res) => {
    const { code, data } = res.data
    feedbackTypes.value = data;
  })
}

const readFeedback = (id) => {
  const currentMail = feedbackReplies.value.find((data) => data.id === id);
  selected.value = currentMail;

  if (!currentMail?.content) {
    isFetchingContent.value = true;

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

      isFetchingContent.value = false;
    })
      .catch((error) => {
        console.log(error);
        isFetchingContent.value = false;
      });
  }
}

onMounted(() => {
  initOutbox();
})
</script>

<style lang="scss" scoped>
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

.feedback-container {
  display: grid;
  grid-template-columns: minmax(300px, 30%) minmax(300px, auto);
  min-height: 550px;

  .total {
    margin-left: auto;
  }

  .feedback-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-right: 10px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .feedback-list {
      overflow-y: auto;
      max-height: 550px;
      height: 100%;

      .active-announcement {
        background: linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%);

        .title {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .feedback-content-wrapper {
    height: 100%;

    .feedback-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 550px;
      overflow-y: auto;
      padding-right: 10px;

      .title {
        font-size: 3rem;
        line-height: 4rem;
        font-weight: bold;
      }

      .date-time {
        margin-left: auto;
      }

      .content-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
        gap: 5px;
      }

      .attachment-img {
        max-width: 100%;
      }

      .content {
        line-height: 1.7rem;
      }
    }

    .feedback-no-data {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(150px, 30%) 70%;

    .q-item {
      display: flex;
      flex-direction: column;
      padding: 0;
      font-size: 0.7rem;

      .title {
        font-size: 15px;
        line-height: 20px;
      }

      .text-caption {
        font-size: 12px;
        line-height: 20px;
      }

      .attachment {
        margin: 5px 0px;
      }

      .q-item__section {
        padding-left: 0;
        align-items: flex-start;
        padding: 5px;

        &.info-wrapper {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .feedback-content-wrapper {

      .feedback-content {
        font-size: 12px;

        .title {
          font-size: 24px;
          line-height: 28px;
        }

        .content {
          line-height: 20px;
        }
      }
    }
  }
}
</style>

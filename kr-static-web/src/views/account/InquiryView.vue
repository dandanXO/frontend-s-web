<template>
  <div class="inquiry-page">
    <WriteInquiry v-if="isCreateMode" :onClickBack="() => (isCreateMode = false)" />
    <div class="feedback-compose-form" v-else>
      <div class="feedback-container">
        <div class="feedback-list-wrapper">
          <el-skeleton v-if="isLoading" />
          <el-button type="primary" v-else class="" @click="isCreateMode = true">
            {{ $t("feedback.feedback_write_inquiry") }}
          </el-button>
          <div class="header">
            <el-skeleton v-if="isLoading" class="total" />
            <template v-else>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="inquiriesList.total"
                @current-change="
                  (currentPage) => {
                    initOutbox(currentPage);
                  }
                "
                v-model:current-page="inquiriesList.current"
                default-page-size="10"
              />

              <span class="total">{{ $t("message.message_total") }} {{ inquiriesList.total }}</span>
            </template>
          </div>

          <div class="feedback-list">
            <template v-if="isLoading">
              <el-skeleton :rows="6" style="width: 100%" />
            </template>
            <template v-else>
              <div
                v-for="item in inquiriesList.records"
                :key="item.page"
                @click="readFeedback(item.id)"
                class="feedback"
                :class="item === selected ? 'active-feedback' : ''"
              >
                <div thumbnail style="margin: 0">
                  <el-checkbox v-model="item.selected" />
                </div>
                <div>
                  <div>
                    <span class="title">{{ item.title }}</span>
                  </div>
                </div>

                <div class="info-wrapper">
                  <div>
                    <span class="date-time">{{ getLocaleDateTime(item.createTime) }}</span>
                  </div>
                  <div>
                    <span
                      class="caption"
                      v-if="item.hasOwnProperty('readTime')"
                      style="font-size: 10px"
                      :style="!item.readTime ? 'color:#808080' : 'color:#FFC000'"
                    >
                      {{
                        !item.replyId
                          ? $t("feedback.feedback_waiting_admin_reply")
                          : $t("feedback.feedback_admin_replied")
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="feedback-content-wrapper">
          <template v-if="isLoading">
            <el-skeleton :row="10" style="width: 100%" />
          </template>
          <template v-else>
            <div>
              <div class="feedback-actions">
                <el-button-group flat>
                  <el-button type="primary" v-if="selectedMessages?.length" @click="deleteSelectedMessage">
                    {{
                      $t("feedback.feedback_delete_selected") +
                      (selectedMessages?.length ? `(${selectedMessages.length})` : "")
                    }}
                  </el-button>
                </el-button-group>
              </div>
            </div>
            <template v-if="selected">
              <div class="feedback-content" v-for="(inquiry, index) in [selected, ...repliesOfInquiries]" :key="index">
                <div>
                  <div class="title">{{ inquiry.title }}</div>
                </div>
                <span class="date-time" v-if="inquiry.createTime">{{ getLocaleDateTime(inquiry.createTime) }}</span>
                <span class="date-time" v-if="inquiry.readTime">
                  {{ $t("feedback.feedback_read_at") }} {{ getLocaleDateTime(inquiry.readTime, true) }}
                </span>
                <div class="content-loading" v-if="isFetchingContent">
                  <el-skeleton :rows="5" style="width: 100%" />
                </div>
                <div v-else class="content" v-html="inquiry.content" style="white-space: pre-line"></div>
                <hr style="width: 90%" v-if="repliesOfInquiries.length && index !== repliesOfInquiries.length" />
              </div>
            </template>
            <div class="feedback-no-data" v-else>{{ $t("feedback.feedback_no_selected") }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, markRaw, defineAsyncComponent } from "vue";
import { server } from "@/utils/request";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { i18nStore } from "@/store/language";
import { userStore } from "@/store";

const WriteInquiry = markRaw(defineAsyncComponent(() => import("./WriteInquiry.vue")));

const { languageVal } = i18nStore();
const getLocaleDateTime = (dateTimeStr, isIncludeTime = false) => {
  if (languageVal === "kr") {
    return dayjs(dateTimeStr)
      .locale("ko")
      .format(isIncludeTime ? "LLL" : "LL");
  }

  if (languageVal === "en") {
    return isIncludeTime ? dayjs(dateTimeStr).format("YYYY-MM-DD hh:mm A") : dayjs(dateTimeStr).format("YYYY-MM-DD");
  }

  return dayjs(dateTimeStr)
    .locale("ko")
    .format(isIncludeTime ? "LLL" : "LL");
};

const isCreateMode = ref(false);
const selected = ref();
const isLoading = ref(false);
const { t } = useI18n();

const isFetchingContent = ref(false);

const inquiriesList = ref([]);
const replyInquiries = ref([]);

const selectedMessages = computed(() =>
  inquiriesList.value.records?.filter((item) => item.selected).map(({ id }) => id)
);

const selectFirstFeedback = () => {
  if (inquiriesList.value.records?.length) {
    // if don't have timeout, ellipsis for title won't show
    setTimeout(() => {
      const inquiry = inquiriesList.value.records[0];

      selected.value = inquiry;
      if (!inquiry.readTime) {
        readFeedback(inquiry.id, false);
      }
    }, 100);
  }
};
watch(
  () => inquiriesList.value,
  () => {
    selectFirstFeedback();
  }
);

onMounted(() => {
  if (inquiriesList.value) {
    selectFirstFeedback();
  }
});

const store = userStore();

const deleteSelectedMessage = () => {
  const mailIdArr = selectedMessages.value;
  const formattedIds = mailIdArr.join(",");

  server.REST.post("session/feedback/delete", {
    ids: formattedIds
  })
    .then((res) => {
      const { code, data } = res;

      if (code === 0) {
        ElMessage.success(t("feedback.feedback_delete_selected_message"));

        const newRecords = inquiriesList.value.records.filter((data) => !selectedMessages.value.includes(data.id));
        inquiriesList.value.records = newRecords;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const repliesOfInquiries = computed(() =>
  replyInquiries.value.records.filter(({ id }) => id === selected.value.replyId)
);

const initOutbox = () => {
  isLoading.value = true;

  Promise.all([server.REST.get("/session/feedback/sysReply"), server.REST.get("/session/feedback/replies")])
    .then(([inquiriesRes, replyInquiriesRes]) => {
      const { code: inquiriesResCode, data: inquiriesResData } = inquiriesRes;
      const { code: replyInquiriesResCode, data: replyInquiriesResData } = replyInquiriesRes;

      if (inquiriesResCode === 0) {
        const inquiriesResDataRecordsWithSelected = inquiriesResData.records.map((data) => ({
          ...data,
          selected: false
        }));
        inquiriesList.value = { ...inquiriesResData, records: inquiriesResDataRecordsWithSelected };
      }

      if (replyInquiriesResCode === 0) {
        replyInquiries.value = replyInquiriesResData;
      }
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const readFeedback = (id, showReadNotify = true) => {
  // debugger;
  const currentMail = inquiriesList.value.records.find((data) => data.id === id);
  selected.value = currentMail;

  if (!currentMail?.readTime) {
    isFetchingContent.value = true;

    server.REST.get(`/session/feedback/${id}/read`)
      .then((res) => {
        const { code, data } = res;

        if (code === 0 && !currentMail.readTime && showReadNotify) {
          ElMessage.success("메시지 읽기");
        }

        if (!currentMail.readTime) {
          currentMail.readTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        }

        // store.repliedTotal--;
        // if (store.repliedTotal < 0) {
        //   store.repliedTotal = 0;
        // }

        currentMail.content = data.content;

        isFetchingContent.value = false;
      })
      .catch((error) => {
        console.log(error);
        isFetchingContent.value = false;
      });
  }
};

onMounted(() => {
  initOutbox();
});
</script>

<style lang="scss" scoped>
.inquiry-page {
  height: 100%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.feedback-compose-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  height: 100%;
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
  gap: 10px;

  .total {
    margin-left: auto;
  }

  .feedback-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 100%;
    background-color: white;
    padding: 20px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .feedback-list {
      overflow-y: auto;
      max-height: 550px;
      height: 100%;

      .feedback {
        display: grid;
        grid-template-columns: 20px 1fr auto;
        gap: 5px;
        padding: 8px 10px;
        border-bottom: 1px solid grey;

        .info-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      }

      .active-feedback {
        background: #aed0f7;

        .title {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .feedback-actions {
    display: flex;
    justify-content: flex-end;
  }

  .feedback-content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 100%;

    .feedback-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 550px;
      overflow-y: auto;
      padding-right: 10px;

      .title {
        font-size: 2rem;
        line-height: 3rem;
        font-weight: bold;
      }

      .date-time {
        margin-left: auto;
      }

      .content-loading {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: auto;
        gap: 5px;
      }

      .attachment-img {
        max-width: 100%;
      }

      .content {
        font-size: 1.5rem;
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

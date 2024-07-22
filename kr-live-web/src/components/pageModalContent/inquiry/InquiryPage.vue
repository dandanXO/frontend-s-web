<template>
  <div class="inquiry-page">
    <WriteInquiry v-if="isCreateMode" :onClickBack="() => isCreateMode = false" />
    <div class="feedback-compose-form" v-else>
      <div class="feedback-container">
        <div class="feedback-list-wrapper">
          <q-skeleton v-if="isLoading" type="QBtn" />
          <div v-else class="primary-button blue-square compose-btn" @click="isCreateMode = true">
            {{ $t('lang.feedback_write_inquiry') }}
          </div>
          <div class="header">
            <q-skeleton v-if="isLoading" class="total" type="QChip" />
            <template v-else>
              <q-pagination :modelValue="inquiriesList.current" :max="inquiriesList.pages"
                :max-pages="inquiriesList.size" @update:model-value="(currentPage) => {
                  initOutbox(currentPage)
                }" boundary-links input color="white" input-class="text-white-10" dense />

              <span class="total">{{ $t('lang.announcement_total') }} {{ inquiriesList.total }}</span>
            </template>
          </div>

          <q-list bordered separator class="feedback-list">
            <template v-if="isLoading">
              <q-item v-for="rectSkeleton in 6" :key="rectSkeleton">
                <q-skeleton type="QToolbar" style="width:100%;" />
              </q-item>
            </template>
            <template v-else>
              <q-item clickable v-ripple v-for="item in inquiriesList.records" :key="item.page"
                @click="readFeedback(item.id)" :active="item === selected" active-class="active-announcement">
                <q-item-section thumbnail style="margin:0;">
                  <q-checkbox size="xs" v-model="item.selected" />
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="2"><span class="title">{{ item.title }}</span></q-item-label>
                </q-item-section>

                <q-item-section side top class="info-wrapper">
                  <q-item-label caption><span class="date-time">{{ getLocaleDateTime(item.createTime)
                      }}</span></q-item-label>
                  <q-item-label caption lines="2"><span class="caption" v-if="item.hasOwnProperty('readTime')"
                      style="font-size:10px;" :style="!item.readTime ? 'color:#808080' : 'color:#FFC000'">{{
                        !item.replyId ? $t('lang.feedback_waiting_admin_reply') : $t('lang.feedback_admin_replied')
                      }}</span></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <q-scroll-area class="feedback-content-wrapper">
          <template v-if="isLoading">
            <q-item v-for="rectSkeleton in 10" :key="rectSkeleton">
              <q-skeleton type="text" style="width:100%;" />
            </q-item>
          </template>
          <template v-else>
            <div>
              <div class="feedback-content-wrapper">
                <div class="feedback-actions">
                  <q-btn-group flat>
                    <q-btn v-if="selectedMessages?.length" size="md"
                      :label="$t('lang.feedback_delete_selected') + (selectedMessages?.length ? `(${selectedMessages.length})` : '')"
                      @click="deleteSelectedMessage" />
                  </q-btn-group>
                </div>
              </div>
              <template v-if="selected">
                <div class="feedback-content" v-for="inquiry, index in [selected, ...repliesOfInquiries]">
                  <div>
                    <div class="title">{{ inquiry.title }}</div>
                  </div>
                  <span class="date-time" v-if="inquiry.createTime">{{ getLocaleDateTime(inquiry.createTime) }}</span>
                  <span class="date-time" v-if="inquiry.readTime">{{ $t('lang.feedback_read_at') }} {{
                    getLocaleDateTime(inquiry.readTime, true)
                  }}</span>
                  <div class="content-loading" v-if="isFetchingContent">
                    <template v-for="rectSkeleton in 5" :key="rectSkeleton">
                      <q-skeleton type="text" style="width:100%;" />
                    </template>
                  </div>
                  <div v-else class="content" v-html="inquiry.content" style="white-space: pre-line">
                  </div>
                  <q-separator v-if="repliesOfInquiries.length && index !== repliesOfInquiries.length" />
                </div>
              </template>
              <div class="feedback-no-data" v-else>{{ $t('lang.announcement_no_selected') }}</div>
            </div>
          </template>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup id="FinanceDeposit">
import { ref, onMounted, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import moment from 'moment'
import { getLocaleDateTime } from "src/boot/utils";
import WriteInquiry from 'components/pageModalContent/inquiry/WriteInquiry.vue';
import { useI18n } from "vue-i18n";

var qs = require("qs");
const $q = useQuasar();
const isCreateMode = ref(false);
const selected = ref();
const isLoading = ref(false);
const { t } = useI18n();

const isFetchingContent = ref(false);

const inquiriesList = ref([]);
const replyInquiries = ref([]);

const selectedMessages = computed(() => inquiriesList.value.records?.filter((item) => item.selected).map(({ id }) => id));

const selectFirstFeedback = () => {
  if (inquiriesList.value.records?.length) {
    // if don't have timeout, ellipsis for title won't show
    setTimeout(() => {
      const inquiry = inquiriesList.value.records[0];

      selected.value = inquiry;
      if (!inquiry.readTime) {
        readFeedback(inquiry.id, false)
      }
    }, 100)
  }
}
watch(() => inquiriesList.value, () => {
  selectFirstFeedback();
})

onMounted(() => {
  if (inquiriesList.value) {
    selectFirstFeedback();
  }
})

const deleteSelectedMessage = () => {
  const mailIdArr = selectedMessages.value;
  const formattedIds = mailIdArr.join(",");
  api
    .post(
      "session/feedback/delete",
      qs.stringify({
        ids: formattedIds
      })
    )
    .then((res) => {
      const { code, data } = res.data

      if (code === 0) {
        $q.notify({
          message: t('lang.feedback_delete_selected_message'),
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });

        const newRecords = inquiriesList.value.records.filter((data) => !selectedMessages.value.includes(data.id));
        inquiriesList.value.records = newRecords
      }
    })
    .catch((error) => {
      console.log(error);
    });

  $q.notify({
    message: "공사중",
    type: "positive",
    position: "top",
    icon: "check_circle_outline"
  });
};

const repliesOfInquiries = computed(() => replyInquiries.value.records.filter(({ id }) => id === selected.value.replyId));

const initOutbox = () => {
  isLoading.value = true;

  Promise.all([api.get("/session/feedback/sysReply"), api.get('/session/feedback/replies')]).then(([inquiriesRes, replyInquiriesRes]) => {
    const { code: inquiriesResCode, data: inquiriesResData } = inquiriesRes.data
    const { code: replyInquiriesResCode, data: replyInquiriesResData } = replyInquiriesRes.data

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
  }).catch(() => {
    isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  })
}

const readFeedback = (id, showReadNotify = true) => {
  const currentMail = inquiriesList.value.records.find((data) => data.id === id);
  selected.value = currentMail;

  if (!currentMail?.content) {
    isFetchingContent.value = true;

    api.get(`/session/feedback/${id}/read`).then((res) => {
      const { code, data } = res.data

      if (code === 0 && !currentMail.readTime && showReadNotify) {
        $q.notify({
          message: "메시지 읽기",
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
      }

      if (!currentMail.readTime) {
        currentMail.readTime = moment().format('YYYY-MM-DD HH:mm:ss');
      }

      currentMail.content = data.content;

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
        font-size: 3rem;
        line-height: 4rem;
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

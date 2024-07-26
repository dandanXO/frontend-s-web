<template>
  <div class="table-record">
    <!--    <MailComponent :loading="visible" :list="inquiriesList.records" type="outbox" />-->

    <q-page>
      <div v-if="!visible">
        <!--            <q-infinite-scroll @load="onLoad" :offset="150">-->
        <q-card
          v-for="(det, n) in mailData"
          :key="n"
          class="mail-inbox-list"
          :class="{ active: isSelectedMail === det.id }"
          style=""
          @click="toggleMail(det)"
        >
          <div class="title-div" :class="`${det.readTime && det.sendTime ? '' : 'unread'}`">
            <div>
              <q-checkbox
                v-if="allowSelectMultiple"
                rounded
                :model-value="selectedMailIds[det.id] ?? false"
                @update:model-value="(newValue) => (selectedMailIds[det.id] = newValue ?? false)"
                size="sm"
                style="font-size: 14px"
                color="#0089ED"
              />
              <q-chip size="sm" color="yellow" label="답변완료" v-if="det.replyId" />
              <q-chip size="sm" color="red" text-color="white" label="답변대기" v-else />
              {{ det.title }}
            </div>

            <div class="right-title">
              <RiArrowUpSLine v-if="isSelectedMail === det.id" />
              <RiArrowDownSLine v-if="isSelectedMail !== det.id" />
            </div>
          </div>
          <div class="mailcontents" v-if="isSelectedMail === det.id">
            <div style="text-align: right; width: 100%">
              <span class="date-time">{{ det.sendTime }}</span>
            </div>
            {{ det.content }}

            <div v-if="theReplyId && repliesOfInquiries.length > 0">
              <hr />
              <h4>{{ repliesOfInquiries[0].title }}</h4>

              <div>
                {{ repliesOfInquiries[0].content }}
              </div>
              <div style="text-align: right; width: 100%">
                <span class="date-time">{{ repliesOfInquiries[0].sendTime }}</span>
              </div>
            </div>
          </div>
        </q-card>

        <!--              <template v-slot:loading>-->
        <!--                <div v-if="comList.length > 0">-->
        <!--                  <div class="row justify-center q-my-md">-->
        <!--                    <q-spinner-dots color="primary" size="40px" />-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--                <div v-else class="q-pa-md" style="text-align: center">-->
        <!--                  {{ truncatedList.length === 0 ? $t("lang.mail_nodata") : $t("lang.mail_nodatayet") }}-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </q-infinite-scroll>-->
      </div>

      <div class="loading-container" v-else>
        <q-inner-loading :showing="visible">
          <q-spinner-gears size="50px" color="brand" />
          <div class="label">{{ $t("lang.mail_loading") }}</div>
        </q-inner-loading>
      </div>
    </q-page>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import qs from "qs";

const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime"
});
const selected = ref();
const isLoading = ref(false);

const onLoad = (index, done) => {
  comList.value = props.list;
  setTimeout(() => {
    if (comList.value.length) {
      var slicedArray = comList.value.splice(0, 6);
      slicedArray.forEach((element) => {
        truncatedList.value.push(element);
      });
      done();
    }
  }, 200);
};
const isSelectedMail = ref(-1);
const toggleMail = (mail) => {
  if (isSelectedMail.value !== mail.id) {
    isSelectedMail.value = mail.id;

    // debugger;
    theReplyId.value = mail.replyId;

    openMsg(mail);
  } else {
    isSelectedMail.value = -1;
  }
};

const theReplyId = ref();
const selectedMailIds = ref({});
const isFetchingContent = ref(false);
const allowSelectMultiple = ref(false);

const inquiriesList = ref([]);
const replyInquiries = ref([]);
const repliesOfInquiries = computed(() => replies.value.filter(({ id }) => id === theReplyId.value));

const replies = ref([]);
const loadOutbox = () => {
  isLoading.value = true;

  api
    .get("/session/feedback/replies")
    .then((response) => {
      if (response.code === 0) {
        replies.value = response.data.records;
        visible.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });

  api
    .get("/session/feedback/sysReply")
    .then((response) => {
      if (response.code === 0) {
        mailData.value = response.data.records;
        visible.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });

  // Promise.all([api.get("/session/feedback/sysReply"), api.get("/session/feedback/replies")]).then(
  //   ([inquiriesRes, replyInquiriesRes]) => {
  //     const { code: inquiriesResCode, data: inquiriesResData } = inquiriesRes.data;
  //     const { code: replyInquiriesResCode, data: replyInquiriesResData } = replyInquiriesRes.data;
  //
  //     if (inquiriesResCode === 0) {
  //       const inquiriesResDataRecordsWithSelected = inquiriesResData.records.map((data) => ({
  //         ...data,
  //         selected: false
  //       }));
  //       inquiriesList.value = { ...inquiriesResData, records: inquiriesResDataRecordsWithSelected };
  //     }
  //
  //     if (replyInquiriesResCode === 0) {
  //       replyInquiries.value = replyInquiriesResData;
  //     }
  //
  //     visible.value = false;
  //   }
  // );
};

const isDeleteMailModal = ref(false);
const showMailId = ref();
const openMsg = (mail) => {
  const { id, readTime } = mail;
  showMailId.value = id;
  mail.readTime = moment().format("YYYY-MM-DD");

  // console.log(mail);
  // mailboxNotifyState[mailboxMessageTab.value].forEach((mail) => {
  //   if (mail.id === id) {
  //     mail.readTime = moment().format("YYYY-MM-DD");
  //   }
  // });
  // console.log(mailboxNotifyState[mailboxMessageTab.value]);

  if (!readTime) {
    api
      .post(
        "/session/inbox/read",
        qs.stringify({
          id: id
        })
      )
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            message: t("lang.msg_readmsg"),
            type: "positive",
            position: "top",
            icon: "check_circle_outline"
          });
          onLoad();
        }
      })
      .catch((error) => {
        isDeleteMailModal.value = false;
        console.log(error);
      });
  }
};

onMounted(() => {
  loadOutbox();
});
</script>
<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;
  .label {
    color: #bacef1;
  }
}
</style>
<style scoped lang="scss">
.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 0 0 10px;

  .label {
    flex: 1;
  }

  .desc {
    flex: 3;
    word-break: break-all;
  }
}

.mail-inbox-list {
  margin-bottom: 16px;

  .title-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 10px;
    font-size: 1.1rem;
    color: $font-1;
    word-break: break-all;

    &.unread {
      font-weight: bold;
    }
  }

  .right-title {
    display: flex;
  }

  .mailcontents {
    padding: 12px 12px 16px;
    background: #e0f0ff;
    color: $font-1;
    font-size: 1rem;
    height: auto;
    overflow: hidden;
    text-overflow: ellipsis;

    h4 {
      margin: 10px auto;
    }
  }
}

.buttons {
  text-align: right;
}

.loading-container {
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin: 0px 10px;
  flex-wrap: wrap;
}

.tab-flex {
  display: flex;
  align-items: center;
}
.red-dot-icon {
  height: 10px;
  width: 10px;
  background: #db0011;
  border-radius: 50%;
  margin-right: 5px;
}
</style>

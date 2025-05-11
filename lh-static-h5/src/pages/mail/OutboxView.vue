<template>
  <div class="table-record">
    <div :key="index" v-for="(item, index) in mailboxMessageTypeData">
      <div v-if="!loading">
        <q-infinite-scroll @load="onLoad" :offset="150">
          <q-card
            v-for="(det, n) in truncatedListByType"
            :key="n"
            class="mail-inbox-list"
            :class="{ active: isSelectedMail === det.id }"
            style=""
            @click="toggleMail(det)"
          >
            <div class="title-div" :class="`${det.readTime && det.sendTime ? '' : 'unread'}`">
              <div class="title-wrapper">
                <q-checkbox
                  v-if="allowSelectMultiple"
                  rounded
                  :model-value="selectedMailIds[det.id] ?? false"
                  @update:model-value="(newValue) => (selectedMailIds[det.id] = newValue ?? false)"
                  size="sm"
                  style="font-size: 14px"
                  color="#0089ED"
                />

                <div class="read-label" v-if="det.readTime && det.sendTime">
                  <img src="../../assets/images/inbox/read-mail.png" />
                </div>
                <div class="read-label" v-else>
                  <img src="../../assets/images/inbox/unread-mail.png" />
                </div>

                <div class="title-text" :title="det.title" v-html="det.title"></div>
                <div v-if="det.sendTime" class="send-time" :title="`发送时间: ${formatSendTime(det.sendTime)}`">
                  <i>{{ formatSendTime(det.sendTime) }}</i>
                </div>
                <div class="right-title">
                  <img
                    src="../../assets/images/inbox/arrow-down-icon.svg"
                    :class="isSelectedMail === det.id && 'arrow-rotate'"
                  />
                </div>
              </div>
            </div>
            <div v-if="isSelectedMail === det.id && det.content" class="mailcontents">
              <span style="color: #aaaaaa; font-size: 15px;">正文: </span>
              <div class="q-pb-sm" v-html="det.content.replace(/\n/g, '<br/>')"></div>
              <div class="q-pa-md" style="background: #ffffffa5; border-radius: 10px;"  v-if="isSelectedMail === det.id && det.replyMessageContent">
              <span style="color: #aaaaaa; font-size: 15px;">回复: </span><div v-html="det.replyMessageContent.replace(/\n/g, '<br/>')"></div>
               </div>
            </div>
            <div v-if="mailType === 'outbox'" class="buttons">
              <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm" />
              <q-btn outline label="复制" size="sm" color="bright" />
            </div>
          </q-card>

          <template v-slot:loading>
            <div v-if="comList.length > 0">
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </div>
            <div v-else class="q-pa-md" style="text-align: center">
              {{ truncatedList.length === 0 ? "暂无数据" : "暂无更多数据了" }}
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div class="loading-container" v-else>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="brand" />
          <div class="label">加载中</div>
        </q-inner-loading>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useNotify } from "src/hooks/notify";
import moment from "moment";

const loading = ref(true);
const mailData = ref([]);

const notify = useNotify();
const mailboxMessageTypeData = ref([{ num: 1, type: "ALL", name: "全部" }]);
const mailboxMessageTab = ref(mailboxMessageTypeData.value[0].type);

const $q = useQuasar();
const truncatedList = ref([]);
const truncatedListByType = computed(() => {
  return truncatedList.value.filter((listItem) => {
    if (mailboxMessageTab.value === "ALL") {
      return true;
    }

    return listItem.type === mailboxMessageTab.value;
  });
});
const comList = ref([]);
const allowSelectMultiple = ref(false);
const selectedMailIds = ref({});

const humanDatetime = (ts) => {
  return moment(ts).format("YYYY-MM-DD HH:mm:ss");
};
const formatSendTime = (ts) => {
  return moment(ts).format("MM-DD");
};

const onLoad = (index, done) => {
  comList.value = mailData.value;
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
    openMsg(mail);
  } else {
    isSelectedMail.value = -1;
  }
};
const msgType = ref();

const loadOutbox = () => {
  var mailboxData = {
    type: null,
    orderBy: "createTime",
    current: 1,
    size: 100,
  }
  api
    .get("/session/feedback/messages", {
      params: mailboxData,
    })
    .then((response) => {
      if (response.code === 0) {
        mailData.value = response.data.records;
        loading.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const showMailId = ref();
const openMsg = (mail) => {
  const { id, readTime } = mail;
  showMailId.value = id;
  mail.readTime = moment().format("YYYY-MM-DD");

  api
    .get(`/session/feedback/${id}/read`)
    .then((res) => {
      if (res.code === 0) {
        // !readTime &&
        //   notify({
        //     message: "已读消息",
        //     type: "success"
        //   });
        mail.content = res.data.content;
        onLoad();
      }
    })
    .catch((error) => {
      console.log(error);
    });
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

    .read-label {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }

    .title-wrapper {
      width: 100%;
      display: flex;
      align-items: center;

      .title-text {
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
        margin: 0px;

        p {
          margin: 0px 0px 0px 0px;
        }
      }

      .send-time {
        font-size: 0.8rem;
        font-weight: 400;
        margin: 0 10px;
      }
    }

    &.unread {
      font-weight: bold;
    }
  }

  .right-title {
    display: flex;
    width: 20px;
    img {
      display: block;
      width: 16px;
      transition: 0.3s all;

      &.arrow-rotate {
        transform: scaleY(-1);
      }
    }
  }

  .mailcontents {
    padding: 12px 12px 16px;
    background: #e0f0ff;
    color: $font-1;
    font-size: 1rem;
    height: auto;
    overflow: hidden;
    overflow-wrap: break-word;
    // text-overflow: ellipsis;
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

.q-tab {
  &--active {
    color: #000;
  }
}

.body--dark {
  .q-card {
    box-shadow: none;
    .title-div {
      @include content-block-dark;
    }
    .mailcontents {
      background: $background-dark-header;
      color: $white;
    }
  }

  .q-tab-panels {
    background: $background-dark;
  }

  .q-tab {
    &--active {
      color: $primary-dark;
    }
  }
}

p {
  margin: 0px;
}
</style>

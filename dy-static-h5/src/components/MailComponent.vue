<template>
  <q-page>
    <MailDetail v-if="route.query.id && selectedMail" :mail="selectedMail" />
      <template v-else>
      <template v-if="props.type !== 'outbox'">
        <q-tabs indicator-color="bright" align="justify" v-model="mailboxMessageTab">
          <q-tab :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
            <div class="tab-flex">
              <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" />
              <div>{{ item.name }}</div>
            </div>
          </q-tab>
        </q-tabs>
      </template>

      <q-tab-panels v-model="mailboxMessageTab" animated>
        <q-tab-panel :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
          <div v-if="!loading">
            <div
              class="action-buttons"
              v-if="props.type !== 'outbox' && truncatedListByType && truncatedListByType.length"
            >
              <q-btn v-if="truncatedListByType.length" class="common-md-btn" size="md" @click="readMails(item.type)">
                全部已读
              </q-btn>
              <q-btn v-if="truncatedListByType.length" class="common-md-btn" size="md" @click="deleteMails(item.type)">
                全部删除
              </q-btn>
              <q-toggle v-if="truncatedListByType.length" v-model="allowSelectMultiple" :label="'选择多个'" left-label />
              <q-btn v-if="hasMailSelected && allowSelectMultiple" class="common-md-white-btn" size="md" @click="readMails(item.type)">
                已读
              </q-btn>
              <q-btn v-if="hasMailSelected && allowSelectMultiple" class="common-md-white-btn" size="md" @click="deleteMails(item.type)">
                删除
              </q-btn>
            </div>
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
                      <img src="../assets/images/inbox/read-mail.png" />
                    </div>
                    <div class="read-label" v-else>
                      <img src="../assets/images/inbox/unread-mail.png" />
                    </div>

                    <div class="title-text" :title="det.title" v-html="det.title"></div>
                    <div v-if="det.sendTime" class="send-time" :title="`发送时间: ${formatSendTime(det.sendTime)}`">
                      <i>{{ formatSendTime(det.sendTime) }}</i>
                    </div>
                    <div class="right-title">
                      <img
                        src="../assets/images/inbox/arrow-down-icon.svg"
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
        </q-tab-panel>
      </q-tab-panels>

      <q-dialog width="100%" v-model="isDeleteMailModal">
        <q-card style="width: 100%; padding: 20px" class="text-black">
          <q-card-section class="q-mb-md text-center" style="flex-direction: column">
            <strong>温馨提示</strong>
            <br />
            <br />
            确认删除信息？
          </q-card-section>
          <q-card-actions align="center">
            <q-btn class="common-md-btn" size="md" @click="confirmDeleteMails(type)" label="确认" />
            <q-btn class="common-md-white-btn" size="md" @click="isDeleteMailModal = false" label="取消" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      </template>
  </q-page>
</template>
<script>
import { defineComponent, onMounted, ref, computed, watch } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import qs from "qs";
import { useRoute, useRouter } from "vue-router";
import MailDetail from "./mail/MailDetail.vue";
import { MAILBOX_TYPES } from "src/constant/mailbox";

export default defineComponent({
  components: {
    MailDetail
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: function () {
        return true;
      }
    },
    mailType: {
      type: String,
      default: function () {
        return "";
      }
    },
    type: {
      type: String,
      default: function () {
        return "";
      }
    }
  },
  emits: ["readMsg"],
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const selectedMail = ref(null);

    const mailboxMessageTypeData = ref(MAILBOX_TYPES);
    const mailboxMessageTab = ref(mailboxMessageTypeData.value[0].type);
    if (props.type === "outbox") {
      mailboxMessageTab.value = mailboxMessageTypeData.value[4].type;
    }
    const $q = useQuasar();
    const isDeleteMailModal = ref(false);

    const sliceOffset = ref(0)
    const sliceLimit = 6
    const truncatedList = computed(() => {
      return props.list.slice(0, sliceOffset.value)
    })

    const truncatedListAll = ref([])
    const truncatedListByType = computed(() => {
      return truncatedList.value.filter((listItem) => {
        if (mailboxMessageTab.value === "ALL") {
          return true;
        }
        return listItem.type === mailboxMessageTab.value;
      });
    });

    const comList = computed(() => props.list)

    const allowSelectMultiple = ref(false);
    const selectedMailIds = ref({});
    const hasMailSelected = computed(() => Object.values(selectedMailIds.value).includes(true));
    const onLoad = (index, done) => {
      comList.value = props.list;
      if (route.query.id && !selectedMail.value) {
        selectedMail.value = props.list.find((mail) => mail.id === Number(route.query.id));
      }

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
      selectedMail.value = mail;
      openMsg(mail);
      router.push({ query: { id: mail.id, type: mailboxMessageTab.value } });
      // if (isSelectedMail.value !== mail.id) {
      //   isSelectedMail.value = mail.id;
      // } else {
      //   isSelectedMail.value = -1;
      // }
    };
    const msgType = ref();

    const readMails = (type) => {
      msgType.value = type;
      if (hasMailSelected.value) {
        const messagesIdArr = Object.keys(selectedMailIds.value);
        const formattedIds = messagesIdArr.join(",");
        api
          .post(
            "/session/pm/inbox/readMultiple",
            qs.stringify({
              ids: formattedIds
            })
          )
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                message: "读取已选择的消息",
                type: "success"
              });

              // Update the readTime property of selected messages
              truncatedList.value.forEach((item) => {
                if (selectedMailIds.value[item.id]) {
                  item.readTime = Date.now(); // Set readTime to current time
                }
              });

              allowSelectMultiple.value = false;
              selectedMailIds.value = {};
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (type !== "ALL") {
        api
          .post(
            "/session/pm/inbox/readAll",
            qs.stringify({
              type: type
            })
          )
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                message: "全部消息已读",
                type: "success"
              });

              // Update the readTime property of all messages
              const currentTime = Date.now();
              truncatedList.value.forEach((item) => {
                if (item.type === type) {
                  item.readTime = currentTime; // Set readTime to current time for messages of the specified type
                }
              });

              allowSelectMultiple.value = false;
              selectedMailIds.value = {};

              onLoad();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .post("/session/pm/inbox/readAll")
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                message: "全部消息已读",
                type: "success"
              });

              // Update the readTime property of all messages
              const currentTime = Date.now();
              truncatedList.value.forEach((item) => {
                // if (item.type === type) {
                item.readTime = currentTime; // Set readTime to current time for messages of the specified type
                // }
              });
              truncatedListAll.value.forEach((item) => {
                // if (item.type === type) {
                item.readTime = currentTime; // Set readTime to current time for messages of the specified type
                // }
              });

              allowSelectMultiple.value = false;
              selectedMailIds.value = {};

              onLoad();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

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

      if (props.type === "outbox") {
        api
          .get(`/session/feedback/${id}/read`)
          .then((res) => {
            if (res.code === 0) {
              !readTime &&
                $q.notify({
                  message: "已读消息",
                  type: "success"
                });
              mail.content = res.data.content;
              onLoad();
            }
          })
          .catch((error) => {
            isDeleteMailModal.value = false;
            console.log(error);
          });
      } else if (!readTime) {
        api
          .post(
            "/session/pm/inbox/read",
            qs.stringify({
              id: id
            })
          )
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                message: "已读消息",
                type: "success"
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

    const deleteMails = (type) => {
      isDeleteMailModal.value = true;
      if (type === "ALL") {
        msgType.value = null;
      } else {
        msgType.value = type;
      }
    };

    const confirmDeleteMails = (type) => {
      if (hasMailSelected.value) {
        const mailIdArr = Object.keys(selectedMailIds.value);
        const formattedIds = mailIdArr.join(",");
        api
          .post(
            "/session/pm/inbox/deleteMultiple",
            qs.stringify({
              ids: formattedIds
            })
          )
          .then((res) => {
            if (res.code === 0) {
              isDeleteMailModal.value = false;
              // Remove items from truncatedListByType if their IDs match with selectedMailIds and are marked as true
              truncatedList.value = truncatedList.value.filter((mail) => !selectedMailIds.value[mail.id]);

              notify({
                message: "删除已选择的消息",
                type: "success"
              });
              onLoad();

              mailIdArr.length = 0;
              selectedMailIds.value = {};
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (msgType.value !== null) {
        api
          .post(
            "/session/pm/inbox/deleteAll",
            qs.stringify({
              type: msgType.value
            })
          )
          .then((res) => {
            isDeleteMailModal.value = false;

            truncatedList.value = truncatedList.value.filter((item) => item.type !== msgType.value);
            if (res.code === 0) {
              notify({
                message: "已删除全部消息",
                type: "success"
              });
              onLoad();
              // truncatedList.value = [];
              selectedMailIds.value = {};
            }
          })
          .catch((error) => {
            isDeleteMailModal.value = false;
            console.log(error);
          });
      } else {
        api
          .post("/session/pm/inbox/deleteAll")
          .then((res) => {
            isDeleteMailModal.value = false;

            truncatedList.value = truncatedList.value.filter((item) => item.type !== msgType.value);
            if (res.code === 0) {
              notify({
                message: "已删除全部消息",
                type: "success"
              });
              onLoad();
              truncatedList.value = [];
              selectedMailIds.value = {};
            }
          })
          .catch((error) => {
            isDeleteMailModal.value = false;
            console.log(error);
          });
      }
    };

    const hasUnreadMessages = (type) => {
      if (type === "ALL") {
        return truncatedListAll.value.some((item) => item.readTime === null);
      }
      return truncatedListAll.value.some((item) => item.type === type && item.readTime === null);
    };

    watch(mailboxMessageTab, (newType) => {
      truncatedList.value = [];
      context.emit("tabChange", newType);
    });

    onMounted(() => {
      onLoad();
    });
    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      formatSendTime(ts) {
        return moment(ts).format("MM-DD");
      },
      onLoad,
      truncatedList,
      comList,
      toggleMail,
      isSelectedMail,
      mailboxMessageTypeData,
      mailboxMessageTab,
      readMails,
      deleteMails,
      confirmDeleteMails,
      isDeleteMailModal,
      allowSelectMultiple,
      selectedMailIds,
      hasMailSelected,
      truncatedListByType,
      props,
      msgType,
      showMailId,
      openMsg,
      hasUnreadMessages,
      route,
      selectedMail
    };
  }
});
</script>
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
        * {
          margin: unset;
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
</style>

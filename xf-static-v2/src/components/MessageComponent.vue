<template>
  <q-page>
    <MailDetail v-if="route.query.id && selectedMail" :mail="selectedMail" />

    <template v-else>
      <q-tabs align="justify" indicator-color="transparent" v-model="mailboxMessageTab">
        <q-tab :key="index" :name="item.type" v-for="(item, index) in MAILBOX_TYPES">
          <div class="tab-flex">
            <!-- <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" /> -->
            <q-badge class="red-dot-icon" v-if="unreadCount[item.type]">{{ unreadCount[item.type] }}</q-badge>
            <div>{{ item.name }}</div>
          </div>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="mailboxMessageTab" animated>
        <q-tab-panel :key="index" :name="item.type" v-for="(item, index) in MAILBOX_TYPES">
          <div v-if="!loading">
            <div
              class="action-buttons"
              v-if="props.type !== 'outbox' && truncatedListByType && truncatedListByType.length"
            >
              <q-btn
                v-if="truncatedListByType.length"
                color="brightbtn"
                size="md"
                @click="readMails(item.type)"
                rounded
              >
                全部已读
              </q-btn>
              <q-btn
                v-if="truncatedListByType.length"
                color="darkbtn"
                size="md"
                @click="deleteMails(item.type)"
                rounded
              >
                全部删除
              </q-btn>
              <q-toggle
                v-if="truncatedListByType.length"
                v-model="allowSelectMultiple"
                :label="'选择多个'"
                left-label
                color="blue"
                class="q-ml-auto"
              />
              <q-btn v-if="hasMailSelected" color="darkbtn" size="md" @click="readMails(item.type)" rounded>已读</q-btn>
              <q-btn v-if="hasMailSelected" color="darkbtn" size="md" @click="deleteMails(item.type)" rounded>
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
                <div
                  class="mailcontents"
                  v-if="isSelectedMail === det.id && det.content"
                  v-html="det.content.replace(/\n/g, '<br/>')"
                ></div>
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
              <q-spinner-ios color="white" size="8em" />
              <div class="label">加载中</div>
            </q-inner-loading>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-dialog width="100%" v-model="isDeleteMailModal">
        <q-card style="width: 100%; padding: 20px" class="text-white">
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
import { defineComponent, onActivated, onMounted, ref, computed, toRaw } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import qs from "qs";
import MailDetail from "./mail/MessageDetail.vue";
import { route } from "quasar/wrappers";
import { useRoute, useRouter } from "vue-router";

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

    const MAILBOX_TYPES = [
      { num: 1, type: "NOTIFICATION", name: "通知" },
      // { num: 5, type: "MATCH", name: "赛事" },
      { num: 2, type: "ACTIVITY", name: "活动" },
      { num: 3, type: "ANNOUNCEMENT", name: "公告" },
      { num: 4, type: "PAYMENT", name: "充提" },
      { num: 5, type: "ALL", name: "全部" }
    ];

    const mailboxMessageTab = ref(MAILBOX_TYPES[0].type);
    if (props.type === "outbox") {
      mailboxMessageTab.value = "ALL";
    }
    const $q = useQuasar();
    const isDeleteMailModal = ref(false);
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
    const hasMailSelected = computed(() => Object.values(selectedMailIds.value).includes(true));

    const selectedMail = ref(null);

    const unreadCount = computed(() => {
      const result = {};
      MAILBOX_TYPES.forEach(({ type }) => {
        if (type === "ALL") {
          result[type] = truncatedList.value.filter((item) => item.readTime === null).length;
        } else {
          result[type] = truncatedList.value.filter((item) => item.type === type && item.readTime === null).length;
        }
      });
      return result;
    });

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
            "/session/inbox/readMultiple",
            qs.stringify({
              ids: formattedIds
            })
          )
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                type: "positive",
                message: "读取已选择的消息",
                position: "top"
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
            "/session/inbox/readAll",
            qs.stringify({
              type: type
            })
          )
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                type: "positive",
                message: "全部消息已读",
                position: "top"
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
          .post("/session/inbox/readAll")
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                type: "positive",
                message: "全部消息已读",
                position: "top"
              });

              // Update the readTime property of all messages
              const currentTime = Date.now();
              truncatedList.value.forEach((item) => {
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
      selectedMail.value = mail;

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
                  type: "positive",
                  message: "已读消息",
                  position: "top"
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
            "/session/inbox/read",
            qs.stringify({
              id: id
            })
          )
          .then((res) => {
            if (res.code === 0) {
              // notify({
              //   message: "已读消息",
              //   type: "success"
              // });
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
            "/session/inbox/deleteMultiple",
            qs.stringify({
              ids: formattedIds
            })
          )
          .then((res) => {
            if (res.code === 0) {
              isDeleteMailModal.value = false;
              // Remove items from truncatedListByType if their IDs match with selectedMailIds and are marked as true
              truncatedList.value = truncatedList.value.filter((mail) => !selectedMailIds.value[mail.id]);

              $q.notify({
                type: "positive",
                message: "删除已选择的消息",
                position: "top"
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
            "/session/inbox/deleteAll",
            qs.stringify({
              type: msgType.value
            })
          )
          .then((res) => {
            isDeleteMailModal.value = false;

            truncatedList.value = truncatedList.value.filter((item) => item.type !== msgType.value);
            if (res.code === 0) {
              $q.notify({
                type: "positive",
                message: "已删除全部消息",
                position: "top"
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
          .post("/session/inbox/deleteAll")
          .then((res) => {
            isDeleteMailModal.value = false;

            truncatedList.value = truncatedList.value.filter((item) => item.type !== msgType.value);
            if (res.code === 0) {
              $q.notify({
                type: "positive",
                message: "已删除全部消息",
                position: "top"
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
        return truncatedList.value.filter((item) => item.readTime === null).length;
      }
      return truncatedList.value.filter((item) => item.type === type && item.readTime === null).length;
    };

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
      MAILBOX_TYPES,
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
      selectedMail,
      route,
      unreadCount
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
    color: #7a80a1;
    word-break: break-all;
    cursor: pointer;

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
        color: #fff;

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
      transform: rotate(-90deg);

      &.arrow-rotate {
        transform: scaleY(-1);
      }
    }
  }

  .mailcontents {
    padding: 12px 12px 16px;
    background: #e0f0ff;
    color: #7a80a1;
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
  justify-content: center;
  padding: 2px 5px;
  background: #db0011;
  border-radius: 25px;
  margin-right: 5px;
  font-size: 10px;
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
      background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
      border: none;
      box-shadow: none;
    }
    .mailcontents {
      background: #3e4756;
      color: $white;
    }
  }

  .q-tab-panels {
    background: #1a2338;
  }

  .q-tab {
    &--active {
      color: #fff;
      font-weight: bold;
      // color: $primary-dark;
    }
  }
}

p {
  margin: 0px;
}

.q-tabs {
  background-color: #213057;
  background-attachment: fixed;
  border-radius: 50px;
  border: 1px solid #ffffff33;
  min-height: 36px;
  margin: 16px;
  padding: 6px;
}

.q-tab {
  min-height: 36px;
  &.q-tab--active {
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
    border-radius: 50px;
    color: #fff;
    box-shadow: 0px 0px 4px 0px #ffffff inset;
  }
}
</style>

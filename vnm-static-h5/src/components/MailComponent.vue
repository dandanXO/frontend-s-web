<template>
  <q-page>
    <!-- <template v-if="props.type !== 'outbox'">
      <q-tabs active-color="dark" indicator-color="bright" align="justify" v-model="mailboxMessageTab">
        <q-tab :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
          <div class="tab-flex">
            <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" />
            <div>{{ item.name }}</div>
          </div>
        </q-tab>
      </q-tabs>
    </template> -->

    <q-tab-panels v-model="mailboxMessageTab" animated>
      <q-tab-panel :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
        <div v-if="!loading">
          <div
            class="action-buttons"
            v-if="props.type !== 'outbox' && truncatedListByType && truncatedListByType.length"
          >
            <q-btn v-if="truncatedListByType.length" class="common-md-btn" size="md" @click="readMails(item.type)">
              {{ $t("lang.mail_allread") }}
            </q-btn>
            <q-btn v-if="truncatedListByType.length" class="common-md-btn" size="md" @click="deleteMails(item.type)">
              {{ $t("lang.mail_deleteall") }}
            </q-btn>
            <q-toggle
              v-if="truncatedListByType.length"
              v-model="allowSelectMultiple"
              :label="$t('lang.mail_selectone')"
              left-label
            />
            <q-btn v-if="hasMailSelected" class="common-md-white-btn" size="md" @click="readMails(item.type)">
              {{ $t("lang.mail_read") }}
            </q-btn>
            <q-btn v-if="hasMailSelected" class="common-md-white-btn" size="md" @click="deleteMails(item.type)">
              {{ $t("lang.mail_delete") }}
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
                  <q-chip size="sm" :label="$t('lang.mail_read')" v-if="det.readTime && det.sendTime" />
                  {{ det.title }}
                </div>

                <div class="right-title">
                  <img src="../assets/images/inbox/mail-arrow-up-icon.svg" v-if="isSelectedMail === det.id" />
                  <img src="../assets/images/inbox/mail-arrow-down-icon.svg" v-if="isSelectedMail !== det.id" />
                </div>
              </div>
              <div class="mailcontents" v-if="isSelectedMail === det.id">
                {{ det.content }}
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
                {{ truncatedList.length === 0 ? $t("lang.mail_nodata") : $t("lang.mail_nodatayet") }}
              </div>
            </template>
          </q-infinite-scroll>
        </div>

        <div class="loading-container" v-else>
          <q-inner-loading :showing="loading">
            <q-spinner-gears size="50px" color="brand" />
            <div class="label">{{ $t("lang.mail_loading") }}</div>
          </q-inner-loading>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog width="100%" v-model="isDeleteMailModal">
      <q-card style="width: 100%; padding: 20px" class="text-black">
        <q-card-section class="q-mb-md text-center" style="flex-direction: column">
          <strong>{{ $t("lang.system_hint") }}</strong>
          <br />
          <br />
          {{ $t("lang.system_delete_all_msg") }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="common-md-btn" size="md" @click="confirmDeleteMails(type)" :label="$t('lang.system_confirm')" />
          <q-btn
            class="common-md-white-btn"
            size="md"
            @click="isDeleteMailModal = false"
            :label="$t('lang.system_cancel')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import qs from "qs";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
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
    const { t } = useI18n();
    const mailboxMessageTypeData = ref([
      { num: 5, type: "ALL", name: t("lang.mail_all") },
      { num: 1, type: "NOTIFICATION", name: t("lang.mail_notification") },
      { num: 2, type: "ACTIVITY", name: t("lang.mail_activity") },
      { num: 3, type: "ANNOUNCEMENT", name: t("lang.mail_announcement") },
      { num: 4, type: "PAYMENT", name: t("lang.mail_payment") }
    ]);
    const mailboxMessageTab = ref(mailboxMessageTypeData.value[0].type);
    if (props.type === "outbox") {
      mailboxMessageTab.value = mailboxMessageTypeData.value[4].type;
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
    const comList = ref({});
    const allowSelectMultiple = ref(false);
    const selectedMailIds = ref({});
    const hasMailSelected = computed(() => Object.values(selectedMailIds.value).includes(true));
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
        openMsg(mail);
      } else {
        isSelectedMail.value = -1;
      }
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
                message: t("lang.msg_readallselected"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
                message: t("lang.msg_readallmsg"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
                message: t("lang.msg_readallmsg"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
            "/session/pm/inbox/read",
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

              $q.notify({
                message: t("lang.msg_deleteselected"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
              $q.notify({
                message: t("lang.msg_deleteallmsg"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
              $q.notify({
                message: t("lang.msg_deleteallmsg"),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
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
        return truncatedList.value.some((item) => item.readTime === null);
      }
      return truncatedList.value.some((item) => item.type === type && item.readTime === null);
    };

    onMounted(() => {
      onLoad();
    });
    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
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
      hasUnreadMessages
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

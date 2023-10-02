<template>

  <div class="mail-wrapper">
    <div class="bottom-content">
      <div class="left-list">
        <div class="buttons">
          <div class="left-btns">
            <div
              class="inbox-btn"
              :class="{ active: !viewSentList }"
              @click="mailTabChange('inbox')"
            >
              {{ $t('lang.inbox') }}
            </div>
            <div
              class="sent-btn"
              :class="{ active: viewSentList }"
              @click="mailTabChange('sent')"
            >
              {{ $t('lang.outbox') }}
            </div>
          </div>
          <div class="rounded-btn" @click="newMailVisible = true">
            {{ $t('lang.write') }}
            <div class="new"><RiMailAddLine /></div>
          </div>
        </div>
        <div class="mail-list">
          <div
            v-if="mailboxState.mailboxList[mailboxState.active].list.length > 0"
          >
            <div style="flex: 2" v-if="!newMailVisible">
              <div class="mailbox-list" :class="{ hide: mailOpened }">
                <div
                  class="mailbox-item"
                  :class="{ active: selectedId === m.id, unread: !m.status }"
                  v-for="(m, index) in mailboxState.mailboxList[
                    mailboxState.active
                  ].list"
                  :key="m.id"
                  @click="selectItem(m, index)"
                >
                  <div class="mailbox-title">{{ m.title }}</div>
                  <p v-if="m.content" class="mailbox-content" v-html="(m.content = m.content.replace(/(?:\r\n|\r|\n)/g, '<br>'))"></p>
                  <div class="txt-right">
                    {{
                      mailboxState.active === "sent"
                        ? format(m.createTime)
                        : m.sendTime
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div
              style="flex: 3"
              class="openedmail"
              :class="{ active: mailOpened }"
              v-if="!newMailVisible && selectedId"
            >
              <div class="b-button" @click="mailOpened = false">{{ $t('lang.go_back') }}</div>
              <div class="mailbox-item">
                <div class="mailbox-title">{{ mailDetailList.title }}</div>
                <div class="txt-right">{{ mailDetailList.readTime }}</div>

                <p class="mailbox-content" v-html="mailDetailList.content"></p>
              </div>
            </div>
            <div
              style="flex: 3"
              class="closedmail"
              :class="{ active: !mailOpened }"
              v-if="!newMailVisible && !selectedId"
            >
              {{ $t('lang.no_message_selected')}}
            </div>
          </div>
          <div style="flex: 3" class="viewmail" v-if="newMailVisible">
            <div class="newmail-section">
              <q-form
                ref="formRef"
                :hideRequiredMark="true"
                :model="mailboxState.mailboxList.write"
                :rules="rules"
                :colon="false"
                :label-col="{ span: 2 }"
              >
                <q-input
                  filled
                  :rules="[
                    (val) => (val && val.length > 0) || $t('lang.please_specific_title'),
                    (val) =>
                      (val && val.length < 255) || $t('lang.length_should_less_255')
                  ]"
                  ref="titleRef"
                  name="title"
                  class="q-mb-md"
                  counter
                  bottom-slots
                  maxlength="255"
                  v-model="mailboxState.mailboxList.write.title"
                  :placeholder="$('lang.subject')"
                />
                <q-input
                  ref="contentRef"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('lang.enter_information'),
                    (val) =>
                      (val && val.length < 501) || $t('lang.max_length_500')
                  ]"
                  name="content"
                  filled
                  type="textarea"
                  :auto-size="{ minRows: 4, maxRows: 16 }"
                  class="mail-txtarea q-mb-md"
                  counter
                  maxlength="500"
                  v-model="mailboxState.mailboxList.write.content"
                  :placeholder="$t('lang.message_cannot_be_empty')"
                />
                <q-btn color="brand" class="q-mt-md common-large-btn" @click="onSubmit" :label="$t('lang.send')" />
              </q-form>
            </div>
          </div>
        </div>
        <div
          class="mail-list"
          v-if="
            mailboxState.mailboxList[mailboxState.active].list.length <= 0 &&
            !newMailVisible
          "
        >
          <span class="mailbox-list no-message">{{ $t('lang.no_message_at_moment') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { RiMailAddLine } from "vue-remix-icons";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";
import {useI18n} from "vue-i18n";
var qs = require("qs");

export default defineComponent({
  name: "MailboxView",
  components: { RiMailAddLine },
  setup() {
    const {t} = useI18n();
    const mailboxState = reactive({
      active: "inbox",
      mailboxList: {
        inbox: {
          list: [],
          pageNum: null,
          pageSize: null,
          total: 0,
        },
        sent: {
          list: [],
          pageNum: null,
          pageSize: null,
          total: 0,
          orderBy: 'createTime'
        },
        write: {
          title: "",
          content: "",
        },
      },
    });
    const format = (time) => {
      return moment(time).format('DD/mm/YY, h:mm:ss A');
    }
    const $q = useQuasar();
    var qs = require("qs");
     const mailboxData = ref({});
    const mailOpened = ref(false);
    const viewSentList = ref(false);
    const newMailVisible = ref(false);
    const selectedIndex = ref(null);
    const selectedId = ref(false);
    const selectItem = (item, index) => {
      api.post("/session/inbox/read", qs.stringify({ id:item.id })).then((ret) => {
        const res = ret.data;
        if (res.code === 0) {
         loadPersonalMailbox();
        }
      })
      selectedId.value = item.id;
      mailOpened.value = true;
      newMailVisible.value = false
      selectedIndex.value = index;
      mailDetailList.value = item;
    }
    const loadPersonalMailbox = () => {
      mailboxState.mailboxList[mailboxState.active].list = []
      if (mailboxState.active === 'inbox') {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "sendTime"
        }
        $q.loading.show({
          message: t('lang.loading') + '...'
        })
        api.get("/session/inbox", {
          params: {
            type: mailboxData.value.type,
            current: mailboxData.value.current,
            size: mailboxData.value.size,
            orderBy: mailboxData.value.orderBy
          }
        }).then((res) => {
          $q.loading.hide()
          const response = res.data
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
          }
        }).catch((error) => {
          $q.loading.hide()
          console.log("error", error);
        });
      }
      if (mailboxState.active === 'sent') {
      mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "createTime"
        }
        $q.loading.show({
          message: t('lang.loading') + '...'
        })
        api.get("/session/outbox", {
          params: {
            type: mailboxData.value.type,
            current: mailboxData.value.current,
            size: mailboxData.value.size,
            orderBy: mailboxData.value.orderBy
          }
        }).then((res) => {
          $q.loading.hide()
          const response = res.data
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
            mailboxState.mailboxList[mailboxState.active].total = response.data.total;
          }
        }).catch((error) => {
          $q.loading.hide()
          console.log("error", error);
        });
      }
    };
    const changePage = (page, pageSize) => {
      loadPersonalMailbox(page, pageSize)
      // const pageSize = 2
    };

    const mailTabChange = (nk) => {
      selectedId.value = null
      mailOpened.value = false

     mailboxData.value = {
        type: null,
        current: mailboxState.mailboxList[nk].pageNum,
        size: mailboxState.mailboxList[nk].pageSize,
        orderBy: 'createTime'
      }

      if (nk === 'sent') {
        mailboxState.active = 'sent'
        viewSentList.value = true
        loadPersonalMailbox()
      }
      else if (nk === 'inbox') {
        mailboxState.active = 'inbox'
        viewSentList.value = false
        loadPersonalMailbox();
      }
      newMailVisible.value = false
    };

    onMounted(() => {
      loadPersonalMailbox();
    });

    const formRef = ref();
    const mailDetailList = ref({})
    const rules = {
      title: [
        {
          required: true,
          message: t('lang.please_specific_title'),
          trigger: "blur",
        },
        {
          max: 255,
          message: t('lang.length_should_less_255'),
          trigger: "change",
        },
      ],
      content: [
        {
          required: true,
          message: t('lang.enter_information'),
          trigger: "blur",
        },
        {
          max: 500,
          message: t('lang.max_length_500'),
          trigger: "change",
        },
      ],
    };
    const titleRef = ref();
    const contentRef = ref();
    const onSubmit = () => {
      titleRef.value.validate();
      contentRef.value.validate();
      if (
        titleRef.value.hasError ||
        contentRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
          api.post("/session/writeOutbox", qs.stringify(mailboxState.mailboxList.write)).then((ret) => {
            const response = ret.data
            if(response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t('lang.success'),
                  icon: "check_circle_outline"
                });
                mailboxState.mailboxList.write.title = "";
                mailboxState.mailboxList.write.content = "";
                newMailVisible.value = false
                mailTabChange('sent')
              } else {

                // $q.notify({
                //   color: "negative",
                //   position: "top",
                //   message: response.message,
                //   icon: "report_problem"
                // });
              }
          })
        .catch((error) => {
          console.log("error", error);
        });
      }
    };
    return {
      mailboxState,
      loadPersonalMailbox,
      mailTabChange,
      changePage,
      formRef,
      rules,
      onSubmit,
      viewSentList,
      newMailVisible,
      selectItem,
      selectedIndex,
      mailDetailList,
      mailOpened,
      selectedId,
      mailboxData,
      titleRef,
      contentRef,
      format,
      moment
    }
  },
});
</script>
<style lang="scss">
.account-container {
  .account-content-wrapper {
    .mail-wrapper {
      .ant-input {
        background: #2b2b4b;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.account-content.mail {
  min-height: 740px;
  margin-bottom: 0;
  padding: 0;

  :deep(.ant-form-horizontal .ant-form-item-label) {
    text-align: left;
  }
  :deep(.ant-tabs-tabpane) {
    padding: 20px 0;
  }
}
.pagination-wrapper {
  text-align: center;
  margin: 0 auto;
  padding: 20px;
  &.hidden {
    display: block;
  }
}
.q-pagination {
  justify-content: center;
}
:deep(.ant-tabs-nav .ant-tabs-tab) {
  font-size: 16px;
}
:deep(.ant-tabs-nav .ant-tabs-tabpane) {
  padding: 20px 30px;
}
.mail-wrapper {
  flex: 1;
  .buttons {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .rounded-btn {
    padding: 0;
    display: flex;
    justify-content: flex-end;
    border-radius: 30px;
    align-items: center;
    gap: 10px;
    color: $red-color;
    cursor: pointer;
    font-weight: bold;
    .new {
      background: $linear-bg-1;
      padding: 10px;
      border-radius: 20px;
      width: 40px;
      height: 40px;
      svg {
        fill: #ffffff;
        width: 20px;
        display: inline-block;
      }
    }
  }
  .left-btns {
    display: flex;
    justify-content: space-evenly;
    border-radius: 30px;
    align-items: center;
    gap: 0;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    .inbox-btn,
    .sent-btn,
    .compose-btn {
      border-radius: 10px;
      height: 40px;
      padding: 8px 10px;
      min-width: 130px;
      flex: 1;
      text-align: center;
      margin: 10px 0;
    }
    .active {
      color: #ffffff;
      background: #23263c;
    }
  }
  .bottom-content {
    background: #2b2b4b;
    margin: 10px;
    border-radius: 20px;
    padding: 10px;
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: flex-start;
    .left-list {
      flex: 2;
      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .mail-list {
      flex: 2;
      background: #23263c;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .mailbox-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 20px;
        overflow: auto;
        padding: 20px;
        min-height: 445px;
        &.no-message {
          justify-content: center;
          align-items: center;
        }
        .mailbox-item {
          border-bottom: 1px solid #51518c;
          &.unread {
            &:before {
              position: absolute;
              right: 20px;
              top: 20px;
              margin: auto;
              content: "";
              border-radius: 50%;
              background: $red-color;
              width: 8px;
              height: 8px;
              vertical-align: middle;
              display: inline-block;
            }
          }
          display: flex;
          padding: 20px;
          gap: 10px;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          z-index: 5;
          .status {
            font-weight: bold;
            font-size: 10px;
            color: #ffffff;
            background: coral;
            padding: 3px 10px;
            border-radius: 20px;
            position: absolute;
            right: 20px;
            top: -10px;
          }
          .mailbox-title {
            flex: 1;
            // font-size: 16px;
            // line-height: 16px;
            // border-radius: 20px;
            font-weight: bold;
            color: #ffffff;
            vertical-align: middle;
            position: relative;
          }
          .mailbox-content {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #ffffff;
            margin: 0;
            height: 80px;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
          }
          .txt-right {
            flex: 1;
            color: #a3a3a3;
            text-align: right;
            width: 100%;
          }
        }
      }

      .openedmail {
        color: #ffffff;
        display: block;
        margin: 20px;
        background: #2b2b4b;
        border-radius: 10px;
        margin-left: 0;
        &.active {
          display: block;
        }
        .b-button {
          background: #23263c;
          cursor: pointer;
          display: none;
          padding: 10px;
          border-radius: 10px;
          margin: 10px;
        }
        .rounded-btn {
          margin-bottom: 10px;
          justify-content: flex-end;
        }

        .mailbox-item {
          padding: 20px;
          &.active {
            &:after {
              content: "";
              position: absolute;
              width: 90%;
              bottom: -10px;
              background: #313553;
              margin: auto;
              border-radius: 0 0 30px 30px;
              box-shadow: inset 0 0 20px -20px #000000;
              left: 0;
              right: 0;
            }
          }
          .mailbox-title {
            font-size: 30px;
            line-height: 30px;
            margin-bottom: 10px;
          }
          .mailbox-content {
            width: 100%;
            color: #ffffff;
            margin: 0;
            max-height: 360px;
            overflow: auto;
          }
          .txt-right {
            margin-bottom: 20px;
            text-align: left;
          }
        }
      }
      .closedmail {
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #2b2b4b;
        border-radius: 10px;
        margin-left: 0;
        display: none;
      }
      .mail-txtarea {
        // height: 180px;
      }

      .viewmail {
        flex: 3;
        padding: 20px;
        .newmail-section {
          text-align: right;
        }
      }
    }
  }
}
.write-btn {
  width: 300px;
  height: 50px;
  font-size: 18px;
  line-height: 50px;
  border: none;
  background-color: linear-gradient(to right, #de4545, #db7e42);
  cursor: pointer;
}
</style>
<style scoped lang="scss">
.mail-wrapper {
  .ant-input {
    background: #2b2b4b;
  }
  .mailbox-list {
    .mailbox-item {
      width: 100%;
      padding: 15px 18px 18px 18px;
      &.read,
      &.unread {
        &::after {
          width: 76px;
          height: 32px;
          line-height: 32px;
        }
      }
      .mailbox-content {
        width: 100%;
        overflow: hidden;
      }
    }
  }
  .bottom-content {
    .mail-list {
      flex-direction: column;
      .openedmail {
        display: none;
        margin: 20px;
        &.active {
          display: block;
        }
        .b-button {
          display: inline-block;
          margin-bottom: 10px;
        }
      }
      .closedmail {
        display: none;
      }
      .mailbox-list {
        &.hide {
          display: none;
        }
      }
    }
    .viewmail {
      width: 100%;
    }
  }
  .pagination-wrapper {
    &.hidden {
      display: none;
    }
  }
}
</style>

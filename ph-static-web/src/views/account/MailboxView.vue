<template>
  <div class="menu-title-container">
    <span class="menu-title">Mailbox</span>
  </div>
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
              Inbox
            </div>
            <div
              class="sent-btn"
              :class="{ active: viewSentList }"
              @click="mailTabChange('sent')"
            >
              Outbox
            </div>
          </div>
          <div class="rounded-btn" @click="newMailVisible = true">
            Compose
            <div class="new"><RiMailAddLine /></div>
          </div>
        </div>
        <div class="mail-list">
          <div style="flex: 2" v-if="!newMailVisible">
            <div class="mailbox-list" :class="{ hide: mailOpened }">
              <div
                class="mailbox-item"
                :class="{ active: selectedId === m.id, unread: m.status }"
                v-for="(m, index) in mailboxState.mailboxList[
                  mailboxState.active
                ].list"
                :key="m.id"
                @click="selectItem(m, index)"
              >
                <div class="mailbox-title">{{ m.title }}</div>
                <p class="mailbox-content" v-html="m.content"></p>
                <div class="txt-right">{{ m.readTime }}</div>
              </div>
            </div>
            <div class="pagination-wrapper" :class="{ hidden: mailOpened }">
              <a-pagination
                simple
                v-model:current="
                  mailboxState.mailboxList[mailboxState.active].pageNum
                "
                :total="mailboxState.mailboxList[mailboxState.active].total"
                show-less-items
                hideOnSinglePage
                :defaultPageSize="2"
                :pageSize="
                  mailboxState.mailboxList[mailboxState.active].pageSize
                "
                @change="changePage(mailboxState.active)"
              />
            </div>
          </div>
          <div
            style="flex: 3"
            class="openedmail"
            :class="{ active: mailOpened }"
            v-if="!newMailVisible && selectedId"
          >
            <div class="b-button" @click="mailOpened = false">Back</div>
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
            There are no messages selected.
          </div>
          <div style="flex: 3" class="viewmail" v-if="newMailVisible">
            <div class="newmail-section">
              <a-form
                ref="formRef"
                :hideRequiredMark="true"
                :model="mailboxState.mailboxList.write"
                :rules="rules"
                :colon="false"
                :label-col="{ span: 2 }"
              >
                <a-form-item ref="title" name="title">
                  <a-input
                    v-model:value="mailboxState.mailboxList.write.title"
                    placeholder="Subject"
                  />
                </a-form-item>
                <a-form-item ref="content" name="content">
                  <a-textarea
                    :auto-size="{ minRows: 4, maxRows: 16 }"
                    class="mail-txtarea"
                    v-model:value="mailboxState.mailboxList.write.content"
                    placeholder="Content cannot be empty"
                  />
                </a-form-item>
                <a-form-item>
                  <button
                    class="common-btn"
                    style="display: inline-block"
                    type="submit"
                    @click="onSubmit"
                  >
                    Submit
                  </button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { mailInbox, mailOutbox, wirteMail } from "@/api/personal/mailbox";
import { RiMailAddLine } from "vue-remix-icons";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "MailboxView",
  components: { RiMailAddLine },
  setup() {
    const mailboxState = reactive({
      active: "inbox",
      mailboxList: {
        inbox: {
          list: [],
          pageNum: 1,
          pageSize: 2,
          total: 0,
        },
        sent: {
          list: [],
          pageNum: 1,
          pageSize: 2,
          total: 0,
          orderBy: 'createTime'
        },
        write: {
          title: "",
          content: "",
        },
      },
    });
     const mailboxData = ref({});
    const mailOpened = ref(false);
    const viewSentList = ref(false);
    const newMailVisible = ref(false);
    const selectedIndex = ref(null);
    const selectedId = ref(false);
    const selectItem = (item, index) => {
      selectedId.value = item.id;
      mailOpened.value = true;
      newMailVisible.value = false
      selectedIndex.value = index;
      mailDetailList.value = item;
      item.status = ''
    }
    const loadPersonalMailbox = () => {

     mailboxData.value = {
        type: null,
        current: mailboxState.mailboxList[mailboxState.active].pageNum,
        size: mailboxState.mailboxList[mailboxState.active].pageSize,
        orderBy: "sendTime"
      }
      mailboxState.mailboxList[mailboxState.active].list = []
      if (mailboxState.active === 'inbox') {

      mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize
        }
        mailInbox(mailboxData.value).then((response) => {
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
          }
        }).catch((error) => {
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
        mailOutbox(mailboxData.value).then((response) => {
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
            mailboxState.mailboxList[mailboxState.active].total = response.data.total;
          }
        }).catch((error) => {
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
          message: "title is required",
          trigger: "blur",
        },
        {
          max: 255,
          message: "Length should be less than 255",
          trigger: "change",
        },
      ],
      content: [
        {
          required: true,
          message: "content is required",
          trigger: "blur",
        },
        {
          max: 500,
          message: "Length should be less than 500",
          trigger: "change",
        },
      ],
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          message.loading("login...", 1, () => {
            wirteMail(mailboxState.mailboxList.write)
              .then((response) => {
                if(response.code === 0) {
                  message.success("success");
                  mailboxState.mailboxList.write.title = "";
                  mailboxState.mailboxList.write.content = "";
                  newMailVisible.value = false
                  mailTabChange('sent')
                } else {
                  message.error(response.message);
                }
              })
              .catch((error) => {
                  console.log(error.message);
              });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
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
      mailboxData
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
.account-container {
  .account-content-wrapper {
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
      padding: 20px;
      &.hidden {
        display: block;
      }
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
        color: #db7e42;
        cursor: pointer;
        font-weight: bold;
        .new {
          background: #de4545;
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
          padding: 10px;
          border-radius: 10px;
          // height: 40px;
          // padding: 8px 20px;
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
          .mailbox-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 20px;
            overflow: auto;
            padding: 20px;
            min-height: 445px;
            .mailbox-item {
              &.unread {
                &:before {
                  position: absolute;
                  right: 20px;
                  top: 20px;
                  margin: auto;
                  content: "";
                  border-radius: 50%;
                  background: #de4545;
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
              &.active {
                background: #2b2b4b;
              }
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
            margin: 20px;
            background: #2b2b4b;
            border-radius: 10px;
            margin-left: 0;
          }
          .mail-txtarea {
            height: 180px;
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
  }
}
</style>
<style scoped lang="scss">
.pagination-wrapper :deep(.ant-pagination) {
  color: #ffffff;
  &.ant-pagination-simple .ant-pagination-simple-pager input {
    background: #2b2b4b;
    border: #2b2b4b;
  }
}
:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: #de4845;
}
:deep(.ant-select-selector:focus) {
  border-color: #de4845;
}
:deep(.ant-select:not(.ant-select-disabled):visited .ant-select-selector) {
  border-color: #de4845;
}
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  border-color: #de4845;
  color: #de4845;
}
:deep(.ant-pagination-next:focus .ant-pagination-item-link) {
  border-color: #de4845;
  color: #de4845;
}
:deep(.ant-pagination-prev:hover .ant-pagination-item-link) {
  border-color: #de4845;
  color: #de4845;
}
:deep(.ant-pagination-prev:focus .ant-pagination-item-link) {
  border-color: #de4845;
  color: #de4845;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .mail-wrapper {
        .ant-input {
          background: #2b2b4b;
        }
        .bottom-content {
          .mail-list {
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
    }
  }
}
</style>

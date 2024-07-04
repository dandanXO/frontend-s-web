<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title">{{ $t('menu.mailbox') }}</div>
    </div>
    <div class="account-content mail">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
        <el-tab-pane name="inbox" :label="$t('mail.inbox')">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 300px;
            "
            v-if="!isLoading['inbox']"
          >
            {{ $t('common.loading') }}
          </div>
          <div v-else-if="mailboxState.mailboxList.inbox.list.length > 0">
            <div class="mailbox-list">
              <template v-for="(m, mi) in mailboxState.mailboxList.inbox.list" :key="m.id">
                <div :class="`mailbox-item`" @click="openMsg(m)">
                  <div class="mailbox-preview">
                    <div :class="`mailbox-title ${m.readTime ? 'read' : 'unread'}`">
                      <el-tag type="info" v-if="m.readTime">{{ $t('mail.isRead') }}</el-tag>
                      <el-tag type="danger" v-else>{{ $t('mail.unread') }}</el-tag>
                      {{ m.title }}
                    </div>
                    <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                  </div>

                  <div v-if="isShowSelect" class="mailbox-checkbox">
                    <el-checkbox v-model="selectedIds[m.id]" size="large" />
                  </div>
                </div>

                <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                  <div class="mailbox-content" v-html="m.content || $t('common.loading')"></div>
                  <div class="mailbox-date">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    <div>{{ new Date(m.sendTime).toLocaleString(languageVal) }}</div>
                    <el-icon class="delete-btn">
                      <Delete @click="deleteMsg(m.id, mi)" />
                    </el-icon>
                  </div>
                </div>
              </template>
            </div>
            <div class="pagination-wrapper">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList.inbox.total"
                :current-page="mailboxState.mailboxList.inbox.pageNum"
                :page-size="mailboxState.mailboxList.inbox.pageSize"
              />
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 300px;
            "
            v-else
          >
            {{ $t('common.noRecordFound') }}
          </div>
        </el-tab-pane>
        <el-tab-pane key="sent" name="sent" :label="$t('mail.outbox')">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 300px;
            "
            v-if="!isLoading['outbox']"
          >
            {{ $t('common.loading') }}
          </div>
          <div v-else-if="mailboxState.mailboxList.sent.list.length > 0">
            <div class="mailbox-list">
              <div class="mailbox-list">
                <template v-for="(m, mi) in mailboxState.mailboxList.sent.list" :key="m.id">
                  <div :class="`mailbox-item`" @click="m.isOpen = !m.isOpen">
                    <div class="mailbox-preview">
                      <div :class="mailbox-title">
                        {{ m.title }}
                      </div>
                      <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                    </div>

                    <div v-if="isShowSelect" class="mailbox-checkbox">
                      <el-checkbox v-model="selectedIds[m.id]" size="large" />
                    </div>
                  </div>

                  <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                    <div class="mailbox-content" v-html="m.content || $t('common.loading')"></div>
                    <div class="mailbox-date">
                      <el-icon>
                        <Calendar />
                      </el-icon>
                      <div>{{ new Date(m.createTime).toLocaleString(languageVal) }}</div>
<!--                      <el-icon class="delete-btn">-->
<!--                        <Delete @click="deleteMsg(m.id, mi)" />-->
<!--                      </el-icon>-->
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="pagination-wrapper" :class="{ hidden: mailOpened }">
              <!-- <el-pagination
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
              /> -->

              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList[mailboxState.active].total"
                :current-page="mailboxState.mailboxList[mailboxState.active].pageNum"
                :page-size="mailboxState.mailboxList[mailboxState.active].pageSize"
              />
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 300px;
            "
            v-else
          >

            {{ $t('common.noRecordFound') }}
          </div>
        </el-tab-pane>
        <el-tab-pane name="write" :label="$t('mail.write')">
          <div>
            <el-form
              ref="formRef"
              hideRequiredMark="true"
              :model="mailboxState.mailboxList.write"
              :rules="rules"
              :colon="false"
              :label-col="{ span: 2 }"
              label-width="100"
            >
              <el-form-item
                ref="title"
                name="title"
                :label="$t('mail.title')"
                :wrapperCol="{ span: 6 }"
              >
                <el-input
                  v-model="mailboxState.mailboxList.write.title"
                  :placeholder="$t('placeholder.title')"
                />
              </el-form-item>
              <el-form-item
                ref="content"
                name="content"
                :label="$t('mail.content')"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4 }"
                  v-model="mailboxState.mailboxList.write.content"
                  :placeholder="$t('placeholder.content')"
                  show-word-limit
                  maxlength="500"
                />
              </el-form-item>
              <el-form-item>
                <template #label></template>

                <div class="btn-container">
                  <!-- <el-button @click="resetFields" class="standard-button">{{ $t('common.clear') }}</el-button> -->
                  <el-button @click="onSubmit" class="standard-button btn-color-blue">{{ $t('common.submit') }}</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, reactive, onMounted } from "vue";
import { mailInbox, mailOutbox, wirteMail, readMail, getUnreadTotal, deleteMultipleMail } from "@/api/personal/mailbox";
import { ElMessage } from "element-plus";
import { Calendar, Delete, MessageBox, ArrowDown, Check } from "@element-plus/icons-vue";
import moment from "moment";

import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { userStore } from "@/store";
import { useI18n } from "vue-i18n";

const {t} = useI18n()
const store = userStore();
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
const openMsg = (m) => {
  const { id, readTime } = m;

  mailboxState.mailboxList[mailboxState.active].list.forEach((mail) => {
    if (mail.id === id) {
      mail.readTime = moment().format("YYYY-MM-DD");
    }
  });

  if (m.isOpen === undefined) m.isOpen = false;
  m.isOpen = !m.isOpen;
  m.readTime = true;

  // if (!m.content) {
  readMail({ id })
    .then((res) => {
      const { code, data } = res;

      clearMailInboxCache();
      checkMailboxUnread();
      // loadPersonalMailbox();
      // if (code === 0) m.content = data.content;
    })
    .catch((error) => {
      console.log(error);
    });
  // }
};
const mailboxData = ref([]);
const isLoading= reactive({
  inbox: false,
  outbox: false
})
const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 4,
      total: 0,
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 4,
      total: 0,
    },
    write: {
      title: "",
      content: "",
    },
  },
});

const loadPersonalMailbox = () => {
  mailboxState.mailboxList[mailboxState.active].list = []
  if (mailboxState.active === "inbox") {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList["inbox"].pageNum,
      size: mailboxState.mailboxList["inbox"].pageSize,
      orderBy: "sendTime"
    }
    mailInbox(mailboxData.value).then((res) => {
      isLoading["inbox"]=true;
      if (res.code === 0) {
        const response = res.data
        mailboxState.mailboxList["inbox"].list.push(...response.records);
        mailboxState.mailboxList["inbox"].total = (response.total);
      }
    }).catch((error) => {
      isLoading["inbox"]=true;
      console.log(error);
      // message.error(error.message, 4)
    });
  } else {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList["sent"].pageNum,
      size: mailboxState.mailboxList["sent"].pageSize,
      orderBy: "createTime"
    }
    mailOutbox(mailboxData.value).then((response) => {
      isLoading["outbox"]=true;
      if (response.code === 0) {
        mailboxState.mailboxList["sent"].list.push(...response.data.records);
        mailboxState.mailboxList["sent"].total = response.data.total;
      }
    }).catch((error) => {
      isLoading["outbox"]=true;
      console.log(error);
      // message.error(error.message, 4)
    });
  }
};

const changePage = (key) => {
  mailboxState.mailboxList[mailboxState.active].pageNum = key;
  loadPersonalMailbox();
};

const mailTabChange = (nk) => {
  mailboxState.active = nk.props.name
  if(nk.props.name !== "write") {
    // const mailList = mailboxState.mailboxList[nk.props.name].list;
    // if(mailList.length === 0) {
    //   loadPersonalMailbox();
    // }

    loadPersonalMailbox();
  }
};

const checkMailboxUnread = () => {
  getUnreadTotal()
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        store.unreadTotal = data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteMsg = (id) => {
  const formattedIds= id;
  deleteMultipleMail(formattedIds)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: t('account.msg_deleted'),
          type: "success"
        });

        checkMailboxUnread();
        loadPersonalMailbox();
      } else {
        ElMessage.error(res.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

onMounted(() => {
  loadPersonalMailbox();
  checkMailboxUnread()
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});

const formRef = ref();
const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
    {
      max: 255,
      message: "长度为 255",
      trigger: "change",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入内容",
      trigger: "blur",
    },
    {
      max: 500,
      message: "长度应少过 500 字",
      trigger: "change",
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      wirteMail(mailboxState.mailboxList.write)
        .then((response) => {
          if(response.code === 0) {
            ElMessage({
              message: t('status.success'),
              type: 'success',
            })

            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
          } else {
            // message.error(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          // message.error(error.message, 4)
        });
    })
    .catch((error) => {
      console.log(error);
      // message.error(error.message, 4)
    });
};
// export default defineComponent({
//   name: "MailboxView",
//   components: {
//     Calendar
//   },
//   setup() {

//   },
// });
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {

    .el-form-item {
      flex-direction: row;
    }
    .el-form-item__content {
      max-width: unset;
    }
    .account-content.mail {
      min-height: 740px;
      margin-bottom: 0;
      padding: 0;
      .ant-form.ant-form-horizontal
      .ant-form-item
      .ant-form-item-control-input-content
      .ant-input {
        background: #16151c;
      }
      :deep(.ant-form-horizontal .ant-form-item-label) {
        text-align: left;
      }
      :deep(.ant-tabs-tabpane) {
        padding: 20px;
      }
    }
    .pagination-wrapper {
      text-align: center;
      padding-top: 20px;
    }
    :deep(.ant-tabs-nav .ant-tabs-tab) {
      font-size: 16px;
    }
    :deep(.ant-tabs-nav .ant-tabs-tabpane) {
      padding: 20px 30px;
    }
    .mailbox-list {
      min-height: 450px;
      font-size: 14px;
      width: 100%;
      transition: 0.3s all;

      &.select-state {
        width: calc(100% - 50px);
      }

      .mailbox-item,
      .mailbox-content-wrapper {
        margin-bottom: 10px;
        padding: 0 15px;
      }

      .mailbox-checkbox {
        position: absolute;
        right: -20px;
        top: 0;
      }

      .mailbox-item {
        position: relative;
        overflow: visible;
        padding: 10px 15px;
        text-align: left;
        transition: all 0.3s;
        background: #f7f8fb;
        cursor: pointer;
        border-radius: 10px;

        &:hover {
          background: #eeeeee;
        }

        .mailbox-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .mailbox-title {
            font-size: 14px;
            line-height: 14px;
            color: #7a80a1;

            &.read {
            }

            &.unread {
              font-weight: bold;
            }
          }

          .mailbox-accordion {
            width: 15px;
            transform: rotate(-90deg);
            transition: 0.3s;

            &.open {
              transform: rotate(0);
            }
          }
        }
      }

      .mailbox-content-wrapper {
        max-height: 0;
        overflow: hidden;
        transition: 0.5s;
        color: #7a80a1;

        &.open {
          max-height: 100px;
        }

        .mailbox-content {
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
          word-break: break-word;
        }

        .mailbox-date {
          text-align: right;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;

          .delete-btn {
            margin: 0 0 0 10px;
            cursor: pointer;
          }
        }
      }
    }

    .mail-txtarea {
      height: 180px;
    }

    .write-btn {
      width: 300px;
      height: 50px;
      font-size: 18px;
      line-height: 50px;
      border: none;
      background-color: #ffd800;
      cursor: pointer;
    }
  }
}
</style>

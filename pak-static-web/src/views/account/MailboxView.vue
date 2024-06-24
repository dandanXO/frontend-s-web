<template>
  <div class="menu-title-container">
    <span class="menu-title">{{ $t("personalView.message.title") }}</span>
  </div>
  <div v-if="!isReadingMail" class="mailbox-mail-list">
    <template v-if="mailboxState.mailboxList.inbox.list.length">
      <div v-for="(mail, index) in mailboxState.mailboxList.inbox.list" :key="index" class="mailbox-mail-item">
        <h3 class="mailbox-mail-item__title">{{ mail.title }}</h3>
        <div class="mailbox-mail-item__preview">{{ mail.content }}</div>
        <div class="mailbox-mail-item__inner-wrapper">
          <span class="mailbox-mail-item__date">{{ moment(mail.sendTime).format("MM/DD/YYYY") }}</span>
          <button class="mailbox-mail-item__read-btn" @click="handleReadMail(mail.id)">
            {{ $t("personalView.message.list.moreButton") }}
            <RiArrowRightSLine />
          </button>
        </div>
        <div v-if="!mail.readTime" class="mailbox-mail-item__unread">
          {{ $t("personalView.message.list.unread") }}
        </div>
      </div>
    </template>
    <NoData v-else />
  </div>
  <div v-else class="mailbox-mail-detail">
    <button class="mailbox-mail-detail__return-btn" @click="() => (isReadingMail = false)">
      {{ $t("personalView.message.detail.backButton") }}
    </button>
    <div class="mailbox-mail-detail__inner-wrapper">
      <h3 class="mailbox-mail-detail__title">{{ readingMail.title }}</h3>
      <span class="mailbox-mail-detail__date">{{ moment(readingMail.sendTime).format("MM/DD/YYYY HH:mm") }}</span>
    </div>
    <p class="mailbox-mail-detail__content">{{ readingMail.content }}</p>
  </div>
  <!-- <div class="mail-wrapper">
    <div class="bottom-content">
      <div class="left-list">
        <div class="buttons">
          <div class="left-btns">
            <div class="inbox-btn" :class="{ active: !viewSentList }" @click="mailTabChange('inbox')">Inbox</div>
            <div class="sent-btn" :class="{ active: viewSentList }" @click="mailTabChange('sent')">Outbox</div>
          </div>
          <div class="rounded-btn" @click="newMailVisible = true">
            Compose
            <div class="new">
              <RiMailAddLine />
            </div>
          </div>
        </div>
        <div class="mail-list">
          <div v-if="!newMailVisible" style="flex: 2">
            <div class="mailbox-list" :class="{ hide: mailOpened }">
              <div
                v-for="(m, index) in mailboxState.mailboxList[mailboxState.active].list"
                :key="m.id"
                class="mailbox-item"
                :class="{ active: selectedId === m.id, unread: m.status }"
                @click="selectItem(m, index)"
              >
                <div class="mailbox-title">
                  {{ m.title }}
                </div>
                <p class="mailbox-content" v-html="m.content" />
              </div>
            </div>
            <div class="pagination-wrapper" :class="{ hidden: mailOpened }">
              <a-pagination
                v-model:current="mailboxState.mailboxList[mailboxState.active].pageNum"
                simple
                :total="mailboxState.mailboxList[mailboxState.active].total"
                show-less-items
                hide-on-single-page
                :default-page-size="2"
                :page-size="mailboxState.mailboxList[mailboxState.active].pageSize"
                @change="changePage(mailboxState.active)"
              />
            </div>
          </div>
          <div v-if="!newMailVisible && selectedId" style="flex: 3" class="openedmail" :class="{ active: mailOpened }">
            <div class="b-button" @click="mailOpened = false">Back</div>
            <div class="mailbox-item">
              <div class="mailbox-title">
                {{ mailDetailList.title }}
                <div class="txt-right">
                  {{ mailDetailList.sendTime }}
                </div>
              </div>

              <p class="mailbox-content" v-html="mailDetailList.content" />
            </div>
          </div>
          <div
            v-if="!newMailVisible && !selectedId"
            style="flex: 3"
            class="closedmail"
            :class="{ active: !mailOpened }"
          >
            There are no messages selected.
          </div>
          <div v-if="newMailVisible" style="flex: 3" class="viewmail">
            <div class="newmail-section">
              <a-form
                ref="formRef"
                :hide-required-mark="true"
                :model="mailboxState.mailboxList.write"
                :rules="rules"
                :colon="false"
                :label-col="{ span: 2 }"
              >
                <a-form-item ref="title" name="title">
                  <a-input v-model:value="mailboxState.mailboxList.write.title" placeholder="Subject" />
                </a-form-item>
                <a-form-item ref="content" name="content">
                  <a-textarea
                    v-model:value="mailboxState.mailboxList.write.content"
                    :auto-size="{ minRows: 4, maxRows: 16 }"
                    class="mail-txtarea"
                    placeholder="Content cannot be empty"
                  />
                </a-form-item>
                <a-form-item>
                  <button class="common-btn" style="margin-left: auto; width: unset" type="submit" @click="onSubmit">
                    Submit
                  </button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { mailInbox, mailOutbox, wirteMail, readMail } from "@/api/personal/mailbox";
import { RiArrowRightSLine } from "vue-remix-icons";
import moment from "moment";
import NoData from "@/components/common/NoData.vue";

const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 2,
      total: 0
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 2,
      total: 0,
      orderBy: "createTime"
    },
    write: {
      title: "",
      content: ""
    }
  }
});

const isReadingMail = ref(false);
const readingMail = ref();
const mailOpened = ref(false);
const viewSentList = ref(false);
const newMailVisible = ref(false);
const selectedIndex = ref(null);
const selectedId = ref(false);
const selectItem = (item, index) => {
  selectedId.value = item.id;
  mailOpened.value = true;
  newMailVisible.value = false;
  selectedIndex.value = index;
  mailDetailList.value = item;
  item.status = "";
};
const loadPersonalMailbox = () => {
  mailboxState.mailboxList[mailboxState.active].list = [];
  if (mailboxState.active === "inbox") {
    const params = {
      type: null,
      current: null,
      size: null
    };
    mailInbox(params)
      .then((response) => {
        if (response.code === 0) {
          mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  // if (mailboxState.active === "sent") {
  //   params = {
  //     type: null,
  //     current: mailboxState.mailboxList[mailboxState.active].pageNum,
  //     size: mailboxState.mailboxList[mailboxState.active].pageSize,
  //     orderBy: "createTime"
  //   };
  //   mailOutbox(params)
  //     .then((response) => {
  //       if (response.code === 0) {
  //         mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
  //         mailboxState.mailboxList[mailboxState.active].total = response.data.total;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }
};
// const changePage = (page, pageSize) => {
//   loadPersonalMailbox(page, pageSize);
//   // const pageSize = 2
// };

const handleReadMail = (id) => {
  const targetMail = mailboxState.mailboxList.inbox.list.find((mail) => mail.id === id);
  if (!targetMail) return;

  readMail({ id })
    .then((res) => {
      if (res.code === 0) {
        readingMail.value = targetMail;
        isReadingMail.value = true;
      }
    })
    .catch((error) => console.log(error));
};

onMounted(() => {
  loadPersonalMailbox();
});
</script>
<style scoped lang="scss">
.mailbox-mail-list {
  display: flex;
  flex-direction: column;
  gap: 25px;

  .mailbox-mail-item {
    padding: 18px 20px;
    border: 1px solid #ffffff0d;
    background: #ffffff0d;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .mailbox-mail-item__title {
      margin-bottom: 8px;
      font-size: 16px;
      line-height: 19.2px;
      color: #ffffff;
    }

    .mailbox-mail-item__preview {
      width: 50%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 400;
      line-height: 21.6px;
      color: #9f9f9f;
    }

    .mailbox-mail-item__inner-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .mailbox-mail-item__date {
        font-size: 12px;
        font-weight: 400;
        line-height: 16.2px;
        color: #ffffff80;
      }

      .mailbox-mail-item__read-btn {
        display: flex;
        align-items: center;
        gap: 7px;
        border: 0.78px solid #ffffffcc;
        background: linear-gradient(180deg, #70bc62 0%, #33562d 100%);
        border-radius: 20px;
        padding: 5px 14px;
        padding-right: 10px;
        font-size: 16px;
        font-weight: 400;
        line-height: 21.6px;
        color: #ffffffcc;

        svg {
          fill: #ffffffcc;
          width: 18px;
        }

        &:hover {
          background: linear-gradient(180deg, #33562d 0%, #70bc62 100%);
        }
      }
    }

    .mailbox-mail-item__unread {
      display: flex;
      align-items: end;
      justify-content: center;
      position: absolute;
      background-color: #70bc62;
      border-radius: 5px;
      width: 50px;
      height: 50px;
      transform: rotate(45deg);
      top: -22px;
      right: -22px;
      font-size: 12px;
      line-height: 16px;
    }
  }
}

.mailbox-mail-detail {
  .mailbox-mail-detail__return-btn {
    background-color: transparent;
    border: 1px solid #13e25c;
    padding: 8px 12px;
    margin-bottom: 10px;
  }

  .mailbox-mail-detail__inner-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;

    .mailbox-mail-detail__title {
      font-size: 20px;
      line-height: 24px;
      color: #ffffff;
    }

    .mailbox-mail-detail__date {
      font-size: 16px;
      font-weight: 400;
      line-height: 21.6px;
      color: #9f9f9f;
    }
  }

  .mailbox-mail-detail__content {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.6px;
    color: #ffffffcc;
  }
}
</style>

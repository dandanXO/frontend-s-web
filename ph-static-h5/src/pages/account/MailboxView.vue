<template>
  <q-dialog v-model="mailOpened">
    <div class="openedmail" :class="{ active: mailOpened }" v-if="selectedId">
      <div class="mail-header">
        <div class="title">Mailbox</div>
        <div class="close-btn" @click="mailOpened = false">X</div>
      </div>
      <div class="mailbox-item">
        <div class="text-h6 mailbox-title">
          <div class="title">{{ mailDetailList.title }}</div>
          <div class="read-time">{{ mailDetailList.readTime }}</div>
        </div>

        <p class="text-subtitle2 mailbox-content" v-html="mailDetailList.content"></p>
      </div>
    </div>
  </q-dialog>

  <q-item-section class="mailbox-cat-container">
    <q-expansion-item ref="inboxRef" class="acct-nav-item" icon="inbox" label="Inbox" @click="mailTabChange('inbox')">
      <div class="mail-list">
        <div v-if="mailboxState.mailboxList['inbox'].list.length">
          <div class="mailbox-list" :class="{ hide: mailOpened }">
            <div
              v-for="mail in mailboxState.mailboxList['inbox'].list"
              :key="`${currTab}--${mail.id}`"
              class="rounded-borders q-ma-none-important mail-card"
              @click="selectItem(mail)"
            >
              <div class="q-px-md q-py-sm">
                <div class="text-h6 mail-title">{{ mail.title }}</div>
                <div class="text-subtitle2 mail-content">{{ mail.content }}</div>
                <div class="text-subtitle2 mail-readtime">{{ mail.readTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <span v-else class="mailbox-list no-message">There are currently no messages.</span>
      </div>
    </q-expansion-item>

    <q-expansion-item ref="sendRef" class="acct-nav-item" icon="send" label="Sent" @click="mailTabChange('sent')">
      <div class="mail-list">
        <div v-if="mailboxState.mailboxList['sent'].list.length">
          <div class="mailbox-list" :class="{ hide: mailOpened }">
            <div
              v-for="mail in mailboxState.mailboxList['sent'].list"
              :key="`${currTab}--${mail.id}`"
              class="rounded-borders q-ma-none-important mail-card"
              @click="selectItem(mail)"
            >
              <div class="q-px-md q-py-sm">
                <div class="text-h6 mail-title">{{ mail.title }}</div>
                <div class="text-subtitle2 mail-content">{{ mail.content }}</div>
                <div class="text-subtitle2 mail-readtime">{{ mail.readTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <span v-else class="mailbox-list no-message">There are currently no messages.</span>
      </div>
    </q-expansion-item>

    <q-expansion-item ref="composeRef" class="acct-nav-item" icon="edit" label="Compose">
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
              (val) => (val && val.length > 0) || 'Title is required.',
              (val) => (val && val.length < 255) || 'Length should be less than 255.'
            ]"
            ref="titleRef"
            name="title"
            class="q-mb-md"
            counter
            bottom-slots
            maxlength="255"
            v-model="mailboxState.mailboxList.write.title"
            placeholder="Title"
          />
          <q-input
            ref="contentRef"
            :rules="[
              (val) => (val && val.length > 0) || 'Content is required',
              (val) => (val && val.length < 501) || 'Length should be less than 500'
            ]"
            name="content"
            filled
            type="textarea"
            :auto-size="{ minRows: 4, maxRows: 16 }"
            class="mail-txtarea q-mb-md"
            counter
            maxlength="500"
            v-model="mailboxState.mailboxList.write.content"
            placeholder="Content"
          />

          <div class="btn-wrapper">
            <q-btn class="cancel-btn" @click="onCancel" label="Cancel" />
            <q-btn class="send-btn" @click="onSubmit" label="Send" />
          </div>
        </q-form>
      </div>
    </q-expansion-item>
  </q-item-section>
</template>

<script setup>
import { onMounted, computed, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const qs = require("qs");

const inboxRef = ref();
const sendRef = ref();
const composeRef = ref();

const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: null,
      pageSize: null,
      total: 0
    },
    sent: {
      list: [],
      pageNum: null,
      pageSize: null,
      total: 0,
      orderBy: "createTime"
    },
    write: {
      title: "",
      content: ""
    }
  }
});

const currTab = computed(() => mailboxState.active);

const mailboxData = computed(() => ({
  type: null,
  current: mailboxState.mailboxList[currTab.value].pageNum,
  size: mailboxState.mailboxList[currTab.value].pageSize,
  orderBy: currTab.value === "inbox" ? "sendTime" : "createTime"
}));

const mailOpened = ref(false);
const viewSentList = ref(false);
const selectedId = ref(false);
const selectItem = (item) => {
  selectedId.value = item.id;
  mailOpened.value = true;
  mailDetailList.value = item;
  item.status = "";
};

const loadPersonalMailbox = () => {
  let message = "Loading Inbox...";
  let endpoint = "/session/inbox";

  if (currTab.value === "sent") {
    message = "Loading Outbox...";
    endpoint = "/session/outbox";
  }

  $q.loading.show({ message });

  api
    .get(endpoint, { params: mailboxData.value })
    .then((res) => {
      if (res.code === 0) {
        mailboxState.mailboxList[currTab.value].list = res.data.records;
      }
    })
    .catch((error) => console.log("error", error))
    .finally($q.loading.hide);
};

const mailTabChange = (nk) => {
  selectedId.value = null;
  mailOpened.value = false;

  mailboxData.value = {
    type: null,
    current: mailboxState.mailboxList[nk].pageNum,
    size: mailboxState.mailboxList[nk].pageSize,
    orderBy: "createTime"
  };

  mailboxState.active = nk;
  viewSentList.value = true;
  loadPersonalMailbox();
};

const formRef = ref();
const mailDetailList = ref({});
const rules = {
  title: [
    {
      required: true,
      message: "title is required",
      trigger: "blur"
    },
    {
      max: 255,
      message: "Length should less then 255",
      trigger: "change"
    }
  ],
  content: [
    {
      required: true,
      message: "content is required",
      trigger: "blur"
    },
    {
      max: 500,
      message: "Length should less then 500",
      trigger: "change"
    }
  ]
};
const titleRef = ref();
const contentRef = ref();

const onSubmit = () => {
  titleRef.value.validate();
  contentRef.value.validate();
  if (titleRef.value.hasError || contentRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post("/session/writeOutbox", qs.stringify(mailboxState.mailboxList.write))
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Success",
            icon: "check_circle_outline"
          });

          mailboxState.mailboxList.write.title = "";
          mailboxState.mailboxList.write.content = "";

          mailTabChange("sent");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const onCancel = () => {
  composeRef.value.hide();
};

onMounted(() => {
  loadPersonalMailbox;
});
</script>

<style scoped lang="scss">
.openedmail {
  width: 90%;
  padding: 15px;
  border-radius: 0.75rem;
  border: 1px solid #fff;
  background: #ecf5ff;
  box-shadow: 0px 2px 10px 0px #fff inset, 0px 0px 17.6px 0px #fff inset;

  .mail-header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 15px 0;

    .title {
      color: #222;
      font-size: 1rem;
      font-weight: 700;
    }

    .close-btn {
      color: #b9b9bb;
      font-size: 1rem;
      font-weight: 700;
    }
  }

  .mailbox-item {
    .mailbox-title {
      display: flex;
      justify-content: space-between;

      .title,
      .read-time {
        color: #2b2b82;
      }
    }

    .mailbox-content {
      color: #83a3ca;
    }
  }
}

.mailbox-cat-container {
  margin: 10px 10px 20px;
  gap: 8px;
  box-shadow: 0px 9px 25px rgba(20, 17, 50, 0.1);
  border-radius: 20px;

  .acct-nav-item {
    padding: 6px 16px;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    margin: 0 0px;
    height: 100%;
    border-radius: 0.75rem;
    border: 1px solid #fff;
    background: rgba(255, 255, 255, 0.6);
    color: #83a3ca;

    :deep(.q-item__section--avatar) {
      min-width: unset;
    }

    .acct-nav-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .arrow {
      color: #83a3ca;
    }

    svg {
      width: 30px;
      padding: 0;
      fill: #0062e8;
    }

    &:active {
      background: #1e88e5;
      color: #fff;

      svg {
        fill: #fff;
      }
    }
  }

  .newmail-section {
    :deep(.q-field--filled .q-field__control) {
      background: transparent;
    }

    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 25px;

      .cancel-btn,
      .send-btn {
        min-width: 100px;
        border: 1px solid;
        border-radius: 2.125rem;
        font-weight: 600px;
      }

      .cancel-btn {
        background: white;
        border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
        color: #222;
      }

      .send-btn {
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        border-image-source: linear-gradient(237.56deg, #5cffeb -21.06%, #9a5ca9 55.65%, #2cffd9 137.61%);
        box-shadow: 0px 3.1666667461395264px 3.9583334922790527px 0px #0b081d33 inset;
        box-shadow: 0px -3.1666667461395264px 3.9583334922790527px 0px #0b081d33 inset;
        color: white;
      }
    }
  }

  .mail-list {
    .mail-card {
      background: transparent;
      border-top: 0.5px solid #ddebfb;
      border-radius: unset;

      .mail-title {
        color: #2b2b82;
      }

      .mail-content,
      .mail-readtime {
        color: #83a3ca;
      }
    }
  }
}
</style>

<!-- dark theme -->
<style scoped lang="scss">
body.body--dark {
  .openedmail {
    background: #15141a;
    border: 1px solid;
    border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
    box-shadow: unset;

    .mail-header {
      .title {
        color: rgba(255, 255, 255, 0.4);
      }

      .close-btn {
        color: #b9b9bb;
      }
    }

    .mailbox-item {
      .mailbox-title {
        .title,
        .read-time {
          color: white;
        }
      }

      .mailbox-content {
        color: #83a3ca;
      }
    }
  }

  .acct-nav-item {
    border: 0.5px solid;
    border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
    background: linear-gradient(168deg, rgba(0, 31, 140, 0.37) -25.44%, rgba(5, 12, 24, 0.77) 99.56%);
    box-shadow: 0px -10px 40px 0px rgba(11, 16, 35, 0.8);
    // backdrop-filter: blur(2px);
  }

  .newmail-section {
    .btn-wrapper {
      .cancel-btn {
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid;
        border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02));
      }
    }
  }

  .mail-list {
    .mail-card {
      .mail-title {
        color: white;
      }
    }
  }
}
</style>

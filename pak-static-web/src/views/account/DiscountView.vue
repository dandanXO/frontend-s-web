<template>
  <div class="menu-title-container">
    <span class="menu-title">Discount</span>
  </div>
  <div v-for="(mail, index) in mailboxState.mailboxList.inbox.list" :key="index" class="mailbox-mail-item">
    <h3 class="mailbox-mail-item__title">{{ toGMT5(mail.recordTime, "MM/DD/YYYY") }}</h3>
    <div class="mailbox-mail-item__preview">{{ mail.content }}</div>
    <div class="mailbox-mail-item__inner-wrapper">
      <span class="mailbox-mail-item__date">{{ moment(mail.recordTime).format("MM/DD/YYYY") }}</span>
      <button class="mailbox-mail-item__read-btn" @click="handleReadMail(mail.id)">
        More
        <RiArrowRightSLine />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getDiscount } from "@/api/personal/discount";
import { RiArrowRightSLine } from "vue-remix-icons";
import moment from "moment";
import { toGMT5 } from "@/utils/utils";

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
    getDiscount(params)
      .then((response) => {
        if (response.code === 0) {
          mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

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
      font-weight: 700;
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
      font-weight: 700;
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
      font-weight: 700;
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

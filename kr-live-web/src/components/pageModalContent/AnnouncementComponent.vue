<template>
  <div class="announcement-container">
    <div class="announcement-list-wrapper">
      <span class="total">{{ $t('lang.announcement_total') }} {{ announcementList.length }}</span>

      <q-list bordered separator class="announcement-list">
        <q-item clickable v-ripple v-for="item in announcementList" :key="item.page" @click="selected = item"
          :active="item === selected" active-class="active-announcement">
          <q-item-section>
            <q-item-label><span class="title">{{ item.title }}</span></q-item-label>
            <q-item-label caption lines="3"><span class="caption">{{ item.content }}</span></q-item-label>
          </q-item-section>

          <q-item-section top thumbnail class="q-ml-none" v-if="item.attachment">
            <img class="attachment" :src="getAttachmentImgSrc(item.attachment)" />
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption><span class="date-time">{{ formatDate(item.createTime) }}</span></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-scroll-area class="announcement-content-wrapper">
      <div v-if="selected" class="announcement-content">
        <div>
          <div class="title">{{ selected.title }}</div>
        </div>
        <span class="date-time">{{ formatDate(selected.createTime) }}</span>
        <div class="attachment" v-if="selected.attachment">
          <img class="attachment-img" :src="getAttachmentImgSrc(selected.attachment)" />
        </div>
        <div class="content">{{ selected.content }}</div>
      </div>
      <div class="announcement-no-data" v-else>{{ $t('lang.announcement_no_selected') }}</div>
    </q-scroll-area>
  </div>
</template>

<script setup id="FinanceDeposit">
import { ref, watch } from "vue";
import { userStore } from "stores/index";
import moment from "moment";
import { storeToRefs } from "pinia";

const store = userStore();
const { announcementList } = storeToRefs(store);
const selected = ref();
const formatDate = (timestamp) => moment(timestamp).format("YYYY/MM/DD");
const getAttachmentImgSrc = (attachmentPath) => process.env.IMAGE_CDN + '/announcement/' + attachmentPath;

watch(() => announcementList.value, () => {
  if (!selected.value && announcementList.value) {
    selected.value = announcementList.value[0];
  }
})

</script>

<style lang="scss" scoped>
.announcement-container {
  display: grid;
  grid-template-columns: minmax(300px, 30%) auto;
  min-height: 550px;

  .total {
    margin-left: auto;
  }

  .announcement-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-right: 10px;

    .announcement-list {
      overflow-y: auto;
      max-height: 550px;

      .active-announcement {
        background: linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%);

        .title {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .announcement-content-wrapper {
    height: 100%;

    .announcement-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 550px;
      overflow-y: auto;
      padding-right: 10px;

      .title {
        font-size: 3rem;
        line-height: 4rem;
        font-weight: bold;
      }

      .date-time {
        margin-left: auto;
      }

      .attachment-img {
        max-width: 100%;
      }

      .content {
        line-height: 1.7rem;
      }
    }

    .announcement-no-data {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(150px, 30%) 70%;

    .q-item {
      display: flex;
      flex-direction: column;
      padding: 4px 8px;
      font-size: 0.7rem;

      .title {
        font-size: 15px;
        line-height: 20px;
      }

      .text-caption {
        font-size: 12px;
        line-height: 20px;
      }

      .attachment {
        margin: 5px 0px;
      }

      .q-item__section {
        padding-left: 0;
        align-items: flex-start;
      }
    }

    .announcement-content-wrapper {

      .announcement-content {
        font-size: 12px;

        .title {
          font-size: 24px;
          line-height: 28px;
        }

        .content {
          line-height: 20px;
        }
      }
    }
  }
}
</style>
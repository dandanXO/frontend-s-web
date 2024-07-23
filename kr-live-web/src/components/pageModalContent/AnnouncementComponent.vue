<template>
  <div class="announcement-container page-container">
    <div class="announcement-list-wrapper">
      <q-skeleton class="total" v-if="isLoading" type="QChip" />
      <span class="total" v-else>{{ $t('lang.announcement_total') }} {{ announcementList?.length }}</span>

      <q-list bordered separator class="announcement-list">
        <template v-if="isLoading">
          <q-item v-for="rectSkeleton in 6" :key="rectSkeleton">
            <q-skeleton type="QToolbar" style="width:100%;" />
          </q-item>
        </template>
        <template v-else>
          <q-item clickable v-ripple v-for="item in announcementList" :key="item.page" @click="selected = item"
            :active="item === selected" active-class="active-announcement" class="announcement">
            <q-item-section>
              <q-item-label lines="1"><span class="title">{{ item.title }}</span></q-item-label>
              <q-item-label caption lines="2"><span class="caption">{{ item.content }}</span></q-item-label>
            </q-item-section>

            <q-item-section side top class="info-wrapper">
              <q-item-label caption><span class="date-time">{{ formatDate(item.createTime) }}</span></q-item-label>
              <q-icon name="image" v-if="item.attachment" :title="$t('lang.announcement_has_attachment')" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
    <q-scroll-area class="announcement-content-wrapper">
      <template v-if="isLoading">
        <q-item v-for="rectSkeleton in 10" :key="rectSkeleton">
          <q-skeleton type="text" style="width:100%;" />
        </q-item>
      </template>
      <template v-else>
        <div v-if="selected" class="announcement-content">
          <div>
            <div class="title">{{ selected.title }}</div>
          </div>
          <span class="date-time">{{ formatDate(selected.createTime) }}</span>
          <div class="attachment" v-if="selected.attachment">
            <img class="attachment-img" :src="getAttachmentImgSrc(selected.attachment)" />
          </div>
          <div class="content" v-html="selected.content" style="white-space: pre-line"></div>
        </div>
        <div class="announcement-no-data" v-else>{{ $t('lang.announcement_no_selected') }}</div>
      </template>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { userStore } from "stores/index";
import { getLocaleDateTime } from "src/boot/utils";

const store = userStore();
const announcementList = ref();
const selected = ref();
const formatDate = (timestamp) => getLocaleDateTime(timestamp);
const getAttachmentImgSrc = (attachmentPath) => process.env.IMAGE_CDN + '/announcement/' + attachmentPath;
const isLoading = ref(false);

const selectFirstAnnouncement = () => {
  if (!selected.value && announcementList.value) {
    // if don't have timeout, ellipsis for title won't show
    setTimeout(() => {
      selected.value = announcementList.value[0];
    }, 100)
  }
}
watch(() => announcementList.value, () => {
  selectFirstAnnouncement();
})

onMounted(() => {
  if (announcementList.value) {
    selectFirstAnnouncement();
  } else {
    isLoading.value = true;
    store.getAnnouncementList().then((announcements) => {
      announcementList.value = announcements;
      isLoading.value = false;
    }).catch((err) => {
      isLoading.value = false;
    });
  }
})

</script>

<style lang="scss" scoped>
.announcement-container {
  display: grid;
  grid-template-columns: minmax(300px, 30%) minmax(300px, auto);
  padding: 20px;

  .total {
    margin-left: auto;
  }

  .announcement-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-right: 10px;
    min-height: 100%;

    .announcement-list {
      overflow-y: auto;
      max-height: 100%;
      height: 100%;

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
      max-height: 100%;
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
    grid-template-columns: minmax(150px, 30%) auto;

    .announcement-list-wrapper {
      .header {
        flex-direction: column;
      }

      .announcement-list {
        .announcement {
          padding: 0;
        }
      }
    }

    .q-item {
      display: flex;
      flex-direction: column;
      padding: 0;
      font-size: 12px;

      .title {
        font-size: 15px;
        line-height: 20px;
      }

      .text-caption {
        font-size: 10px;
        line-height: 20px;
      }

      .attachment {
        margin: 5px 0px;
      }

      .q-item__section {
        padding-left: 0;
        align-items: flex-start;
        padding: 5px;

        &.info-wrapper {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .announcement-content-wrapper {

      .announcement-content {
        font-size: 12px;

        .title {
          font-size: 20px;
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
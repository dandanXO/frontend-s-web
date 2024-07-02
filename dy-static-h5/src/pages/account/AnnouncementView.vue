<template>
  <div class="announcement-section">
    <div class="transit-buttons">
      <div class="" v-for="(trans, i) in tabItems" :key="i">
        <div class="btn" @click="openAnnounce(trans)">
          <div
            class="announce-tabimg"
            :style="{
              backgroundImage: (() => {
                try {
                  return `url(${require(`../../assets/account/announce/announce-icon-${trans.id}.png`)})`;
                } catch (e) {
                  return `url(${require(`../../assets/account/announce/announce-icon-16.png`)})`;
                }
              })()
            }"
          ></div>

          {{ trans.name }}
          <div class="right">
            <q-icon name="keyboard_arrow_right" v-if="!(selectedId == trans.id)" size="md" />
            <q-icon name="keyboard_arrow_down" v-if="selectedId == trans.id" size="md" />
          </div>
        </div>

        <div class="announce-field">
          <div class="empty-field" v-if="selectedId == trans.id && isEmptyAnnoucements(trans.id)">
            <p>暂无公告。</p>
          </div>
          <q-list class="rounded-borders" v-if="selectedId == trans.id">
            <span v-for="ann in announcementsList" :key="ann">
              <div v-if="ann.typeId === selectedId">
                <q-expansion-item class="expansion-bg" expand-separator :label="ann.title">
                  <q-card>
                    <q-card-section>
                      {{ ann.content }}
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <div class="text-center q-pa-md text-brand" v-if="ann.content.length === 0">暂时无通知</div>
              </div>
            </span>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import {api} from "boot/axios";

export default defineComponent({
  name: "AnnouncementView",
  setup() {
    const tab = ref("");
    const tabItems = ref([]);
    const announcementsList = ref([]);
    const announcementTypes = ref([]);
    const activeKey = ref(null);
    const isAnnounceShow = ref(false);
    const selectedId = ref(-1);


    const loadAnnouncement = () => {
      api.get("/announcement").then((res) => {
        if (res.code === 0) {
          if (res.data.announcements) {
            const d = res.data.announcements;
            announcementsList.value = d;
            console.log(announcementsList.value)
          }
          if (res.data.type) {
            const e = res.data.type
            tabItems.value = e;
            activeKey.value = res.data.type[0].id;
          }
        }
      });
    };

    const isEmptyAnnoucements = (id) => {
      if (selectedId.value === -1) {
        return false;
      }
      var hasAnnounce = true;

      announcementsList.value.forEach(item => {
        if (item.typeId == id) {
          hasAnnounce = false;
        }
      })

      return hasAnnounce;
    }

    const openAnnounce = (announce) => {
      console.log(announce);
      if (selectedId.value === -1) {
        selectedId.value = announce.id;
        isAnnounceShow.value = true;
      } else {
        if (selectedId.value != announce.id) {
          selectedId.value = announce.id;
          isAnnounceShow.value = true;
        } else {
          selectedId.value = -1;
          isAnnounceShow.value = false;
        }
      }


    }

    onMounted(() => {
      loadAnnouncement();
    });

    return {
      tab,
      tabItems,
      announcementsList,
      announcementTypes,
      activeKey,
      openAnnounce,
      isAnnounceShow,
      selectedId,
      isEmptyAnnoucements
    };
  }
});
</script>
<style lang="scss">
.announcement-section {
  .announce-tabimg {
    width: 20px;
    height: 20px;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    width: 100%;
    margin: 0 auto;
  }

  .q-tabs__content {
    background: #fff;
  }

  .q-tab {
    min-height: 40px;
  }

  .q-tab--active {
    color: #3e5cc0 !important;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
    padding: 10px;
  }

  .q-item {
    background: #0078e910;
    // background: #fff;
    // background: #0078ed10;
    // background: rgba(255, 255, 255, 0.5);
    // border-left: 0.5px solid #757575;
    // border-right: 0.5px solid #757575;
  }

  .q-tab--active .q-tab__indicator {
    background: url("../../assets/images/promotion/tab_bg.png") no-repeat center center;
    background-size: 20px 10px;
    width: 100%;
    height: 10px;
  }

  .notice_txt {
    background: linear-gradient(to right, #ac61e0, #6848f5);
    padding: 30px 10px 10px;
    border-radius: 5px;

    .notice-inner {
      background: #fff;
      border-radius: 5px;
    }
  }

  .q-expansion-item--expanded {
    .q-item {
      // background: #eee;
    }
  }

  .q-expansion-item__content {
    background: #fff;
    // padding: 10px 10px 15px;
    // border-left: 0.5px solid #757575;
    // border-right: 0.5px solid #757575;
    // border-bottom: 0.5px solid #757575;
  }

  .download-item {
    background: #ffffff;
    padding: 10px;

    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;

      img {
        width: 40px;
      }
    }

    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
  }

  .transit-buttons {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    color: #000;

    .btn {
      border-top: 0.5px solid #00000010;
      // color: #333;
      color: #0078e999;
      height: 46px;
      text-decoration: none;
      position: relative;
      background: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 24px;
      font-size: 16px;
      letter-spacing: 1px;

      img {
        width: 16px;
      }

      .right {
        position: absolute;
        right: 18px;

        svg {
          fill: #757575;
        }
      }

      &:last-child {
        border-bottom: 0.5px solid #0089ed50;
      }

      &:active {
        filter: brightness(0.85);
      }
    }
  }

  .empty-field {
    padding: 8px 20px;
    text-align: center;

    p {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>

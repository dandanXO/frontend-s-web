<template>
  <div class="announcement-section">
    <q-tabs active-color="dark" indicator-color="bright" align="justify" v-model="activeKey">
      <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.id" :label="tab.name" />
    </q-tabs>

    <q-tab-panels v-model="activeKey" animated>
      <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.id">
        <q-list class="rounded-borders">
          <span v-for="ann in announcementsList" :key="ann">
            <div v-if="ann.typeId === tab.id">
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
      </q-tab-panel>
    </q-tab-panels>
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

    const loadAnnouncement = () => {
      api.get("/announcement").then((res) => {
        if (res.code === 0) {
          if (res.data.announcements) {
            const d = res.data.announcements;
            announcementsList.value = d;
            // console.log(announcementsList.value)
          }
          if (res.data.type) {
            const e = res.data.type
            tabItems.value = e;
            activeKey.value = res.data.type[0].id;
          }
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      });
    };

    onMounted(() => {
      loadAnnouncement();
    });

    return {
      tab,
      tabItems,
      announcementsList,
      announcementTypes,
      activeKey
    };
  }
});
</script>
<style lang="scss">
.announcement-section {
  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    width: 100%;
    margin: 0 auto;
  }

  .q-tabs__content {
    //background: #fff;
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
    // background: #fff;
    background: #063c50;
  }

  .q-tab--active .q-tab__indicator {
    background: url("../../assets/images/promo/tab_bg.png") no-repeat center center;
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
      background: #063c50;
    }
  }

  .q-expansion-item__content {
    background: var(--q-dark);

    padding: 10px 10px 15px;
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
}
</style>

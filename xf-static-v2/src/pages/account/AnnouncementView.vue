<template>
  <div class="announcement-section">
    <q-tabs indicator-color="transparent" align="justify" v-model="activeKey">
      <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.id" :label="tab.name" />
    </q-tabs>

    <q-tab-panels v-model="activeKey" animated>
      <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.id">
        <q-list>
          <span v-for="ann in announcementsList" :key="ann" class="q-gutter-y-md">
            <div v-if="ann.typeId === tab.id">
              <q-expansion-item class="expansion-bg" expand-separator :label="ann.title">
                <!-- <q-card> -->
                <!-- <q-card-section> -->
                {{ ann.content }}
                <!-- </q-card-section> -->
                <!-- </q-card> -->
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
import { defineComponent, onMounted, ref } from "vue";
import { api } from "boot/axios";

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
            console.log(announcementsList.value)
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
<style lang="scss" scoped>
.announcement-section {
  .q-tabs {
    background-color: #213057;
    background-attachment: fixed;
    border-radius: 50px;
    border: 1px solid #ffffff33;
    min-height: 36px;
    margin: 16px;
  }

  .q-tab {
    min-height: 36px;
    &.q-tab--active {
      background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
      border-radius: 50px;
      color: #fff;
      box-shadow: 0px 0px 4px 0px #ffffff inset;
    }
  }

  .q-tab--inactive {
    color: #ffffff99;
  }

  .q-tabs__content--align-justify .q-tab {
    margin: 6px;
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

  :deep(.q-item) {
    background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
    border-radius: 8px;
  }

  :deep(.q-expansion-item--expanded) {
    .q-item {
      // background: #063c50;
    }
  }

  :deep(.q-expansion-item__content) {
    background: #394870;
    padding: 10px 10px 15px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    color: #ffffff99;
  }

  .q-tab-panel {
    padding-top: 0;
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

.q-tab-panels--dark {
  background: none;
}
</style>

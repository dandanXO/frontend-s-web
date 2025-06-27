<template>
  <div class="announcement-section">
    <q-tabs
        indicator-color="transparent"
        align="justify"
        v-model="activeTab"
    >
      <q-tab
          v-for="(tab) in announcementTypes"
          :key="tab.id"
          :name="tab.id"
          :label="tab.name"
      />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel v-for="(tab) in announcementTypes" :key="tab.id" :name="tab.id">
        <q-list class="rounded-borders">
          <span v-for="ann in announcementsList" :key="ann.id">
            <div v-if="ann.type === tab.id">
              <q-expansion-item
                  class="expansion-bg"
                  expand-separator
                  :label="ann.title"
              >
                <q-card>
                  <q-card-section>
                    {{ ann.content }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <div
                  class="text-center q-pa-md text-brand"
                  v-if="ann.content.length === 0"
              >
                No Content Yet
              </div>
            </div>
          </span>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script lang="js">
import { defineComponent, onMounted, ref, reactive } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "AnnouncementView",
  setup() {
    const tab = ref("");
    const activeTab = ref("");
    const announcementsList = ref([]);
    const announcementTypes = ref([]);
    const request = reactive({
      size: 20,
      current: 1,
      siteId: 26,
      announcementType: null,
    });

    const loadAnnouncementType = () => {
      api.get("/session/affiliate/announcement-type").then((res) => {
        if (res.code === 0) {
          announcementTypes.value = res.data;
          activeTab.value = res.data[0].id;
        }
      });
    };

    const loadAnnouncementList = () => {
      api.get("/session/affiliate/announcement-list", { params: request }).then((res) => {
        if (res.code === 0) {
          announcementsList.value = res.data.records;
        }
      });
    };

    onMounted(() => {
      loadAnnouncementType();
      loadAnnouncementList();
    });

    return {
      tab,
      announcementsList,
      announcementTypes,
      request,
      activeTab,
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
    color: #3e5cc0 !important;;
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
    // background: url("../../assets/images/promotion/tab_bg.png") no-repeat center
    // center;
    background-size: 20px 10px;
    width: 100%;
    // height: 10px;
    // opacity: 0;
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

<template>
  <div class="announcement-section">
    <q-tabs
      v-model="tab"
      active-color="white"
      indicator-color="bright"
      align="justify"
    >
      <q-tab
        v-for="(tab, i) in tabItems"
        :key="i"
        :name="tab.name"
        :label="tab.label"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
        <q-list class="rounded-borders">
          <span v-for="ann in announcementsList" :key="ann">
            <div v-if="ann.type === tab.name">
              <q-expansion-item
                v-for="(promo, e) in ann.promotions"
                :key="e"
                expand-separator
                :label="promo.label"
                header-class="text-brand"
              >
                <div class="notice_txt">
                  <div class="notice-inner">
                    <div class="q-pa-md">
                      {{ promo.content }}
                    </div>
                    <div class="text-right q-pa-sm text-grey-6">
                      {{ promo.date }}
                    </div>
                  </div>
                </div>
              </q-expansion-item>
              <div
                class="text-center q-pa-md text-brand"
                v-if="ann.promotions.length === 0"
              >
                暂时无通知
              </div>
            </div>
          </span>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script lang="js">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AnnouncementView",
  setup() {
    const tab = ref("webpromo");
    const tabItems = [
      {
        name: "webpromo",
        label: "网站优惠"
      },
      {
        name: "bonus",
        label: "恭喜中大奖"
      },
      {
        name: "changes",
        label: "变更通知"
      },
      {
        name: "notices",
        label: "维护通知"
      },
      {
        name: "important",
        label: "重要通知"
      }
    ];
    const announcementsList = [];

    return {
      tab,
      tabItems,
      announcementsList
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

  .q-tab {
    min-height: 40px;
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
    background: #fff;
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
      background: #eee;
    }
  }

  .q-expansion-item__content {
    background: #fff;
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

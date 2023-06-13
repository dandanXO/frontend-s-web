<template>
  <div class="promo">
    <q-tabs v-model="tab" align="justify">
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
                <div class="q-pa-md">
                  {{ promo.content }}
                </div>
                <div class="text-right q-pa-sm">
                  {{ promo.date }}
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
<script setup>
import { ref } from "vue";
const tab = ref("all");
const tabItems = [
  {
    name: "all",
    label: "全部",
  },
  {
    name: "esport",
    label: "电竞",
  },
  {
    name: "sport",
    label: "体育",
  },
  {
    name: "livecasino",
    label: "真人",
  },
  {
    name: "slots",
    label: "电游",
  },
];
const announcementsList = [
  {
    type: "webpromo",
    promotions: [
      {
        label: "温馨提醒",
        content:
          "尊敬的东赢会员：您好，3月1日起，东赢官网救援活动将仅提供今日救援，取消昨日救援，请符合的会员及时申请，同时救援比例和申请次数也有所改动，详情请咨询客服或前往优惠页面进行查看，感谢您的理解！（2021年2月28日）",
        date: "2021-02-28 13:34:13",
      },
      {
        label: "网站优惠",
        content:
          "尊敬的东赢会员：11月25日起，东赢邀新朋，唤旧友，100元彩金免费领！加入东赢，更多给力优惠不断更新中，快快行动，加入我们吧",
        date: "2019-11-26 17:12:49",
      },
    ],
  },
  {
    type: "bonus",
    promotions: [
      {
        label: "恭喜中大奖",
        content:
          "恭喜来自山东济南会员XFZJ0***31，在2021年12月20日PT平台“币币币”游戏中击中507,488.31元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2021年12月20日）",
        date: "2021-11-25 17:16:04",
      },
      {
        label: "恭喜中大奖",
        content:
          "恭喜来自山西省太原市会员XFZXW***93，在2020年10月17日SW平台“加油,金龙!”游戏中击中549,000.00元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2020年10月18日）",
        date: "2020-10-18 02:46:17",
      },
      {
        label: "恭喜中大奖",
        content:
          "恭喜来自吉林省的XFWC***587王先生在PT平台“奥林匹斯之国王”中击中321168.11元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢娱乐2019年5月21日",
        date: "2019-04-09 11:29:10",
      },
      {
        label: "恭喜中大奖",
        content:
          "恭喜来自四川省德阳市会员XFQDK**88，在2020年1月23日PT平台紫色狂热屋游戏中击中285639.03元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2020年1月23日 ）",
        date: "2020-01-23 19:43:55",
      },
    ],
  },
  {
    type: "changes",
    promotions: [
      {
        label: "账号升级更新",
        content:
          "恭喜来自山东济南会员XFZJ0***31，在2021年12月20日PT平台“币币币”游戏中击中507,488.31元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2021年12月20日）",
        date: "2021-11-25 17:16:04",
      },
    ],
  },
  {
    type: "notices",
    promotions: [],
  },
  {
    type: "important",
    promotions: [
      {
        label: "账户信息安全须知",
        content:
          "恭喜来自山东济南会员XFZJ0***31，在2021年12月20日PT平台“币币币”游戏中击中507,488.31元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2021年12月20日）",
        date: "2021-11-25 17:16:04",
      },
      {
        label: "温馨提醒",
        content:
          "恭喜来自山东济南会员XFZJ0***31，在2021年12月20日PT平台“币币币”游戏中击中507,488.31元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2021年12月20日）",
        date: "2021-11-25 17:16:04",
      },
      {
        label: "存款方式提醒",
        content:
          "恭喜来自山东济南会员XFZJ0***31，在2021年12月20日PT平台“币币币”游戏中击中507,488.31元累积大奖！加入东赢，惊喜随行，下一个中奖的就是您！东赢官网（2021年12月20日）",
        date: "2021-11-25 17:16:04",
      },
    ],
  },
];
</script>
<style lang="scss">
.promo {
  .q-tabs {
    // background: rgba(113, 125, 146, 0.2);
    background: #ffffff;
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
    // height: 100%;
    background: url("../assets/images/promotion/tab_bg.png") no-repeat center center;
  }
  .q-tab__label {
    z-index: 1;
  }
  .q-tab-panels {
    background: none;
    padding: 10px;
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

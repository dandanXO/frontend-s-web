<template>
  <div class="about-container">
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-menu-item
        :index="index"
        v-for="(item, index) in tabInfo.slice(0, 2)"
        :key="item.id"
        @click="updateTab(item.id)"
      >
        <img v-if="activeTab === item.id" class="icon-selected-img" src="../assets/about/tab_selected.png" />
        <div
          style="display: flex; gap: 10px; justify-content: flex-start; align-items: center; flex: 1; margin-left: 50px"
        >
          <img class="icon-img" :src="require(`../assets/about/icon_${item.id}.png`)" />
          <div class="tab-label" :class="{ active: activeTab === item.id }">{{ item.label }}</div>
        </div>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <img v-if="activeTab === 'qa'" class="icon-selected-img" src="../assets/about/tab_selected.png" />
          <div
            style="
              display: flex;
              gap: 10px;
              justify-content: flex-start;
              align-items: center;
              flex: 1;
              margin-left: 50px;
            "
          >
            <img class="icon-img" :src="require(`../assets/about/icon_qa.png`)" />
            <div class="tab-label" :class="{ active: activeTab === 'qa' }">游戏问题</div>
          </div>
        </template>
        <el-menu-item index="2-1" @click="updateTab('aboutQaGame')" style="margin-left: 70px">电子竞技</el-menu-item>
        <el-menu-item index="2-2" @click="updateTab('aboutQaSport')" style="margin-left: 70px">体育问题</el-menu-item>
        <el-menu-item index="2-3" @click="updateTab('aboutQaPerson')" style="margin-left: 70px">真人问题</el-menu-item>
        <el-menu-item index="2-4" @click="updateTab('aboutQaOther')" style="margin-left: 70px">其他问题</el-menu-item>
      </el-sub-menu>
      <el-menu-item
        :index="index + 3"
        v-for="(item, index) in tabInfo.slice(3, 9)"
        :key="item.id"
        @click="updateTab(item.id)"
      >
        <img v-if="activeTab === item.id" class="icon-selected-img" src="../assets/about/tab_selected.png" />
        <div
          style="display: flex; gap: 10px; justify-content: flex-start; align-items: center; flex: 1; margin-left: 50px"
        >
          <img class="icon-img" :src="require(`../assets/about/icon_${item.id}.png`)" />
          <div class="tab-label" :class="{ active: activeTab === item.id }">{{ item.label }}</div>
        </div>
      </el-menu-item>
    </el-menu>
    <div class="about-content">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AboutUs from "../components/about/AboutUs.vue";
import AboutResponsibility from "../components/about/AboutResponsibility.vue";
import AboutGuide from "../components/about/AboutGuide.vue";
import AboutQA from "../components/about/AboutQA.vue";
import AboutPrivacy from "../components/about/AboutPrivacy.vue";
import AboutContact from "../components/about/AboutContact.vue";
import AboutRule from "../components/about/AboutRule.vue";
import AboutSportRule from "../components/about/AboutSportRule.vue";
import AboutCooperate from "../components/about/AboutCooperate.vue";
import AboutQaGame from "../components/about/AboutQaGame.vue";
import AboutQaSport from "../components/about/AboutQaSport.vue";
import AboutQaOther from "../components/about/AboutQaOther.vue";
import AboutQaPerson from "../components/about/AboutQaPerson.vue";

const activeTab = ref("guide");

const tabInfo = ref([
  { id: "guide", label: "新手引导", component: AboutGuide },
  { id: "sportrule", label: "体育投注规则", component: AboutSportRule },
  { id: "qa", label: "游戏问题", component: AboutQA },
  { id: "responsibility", label: "竞猜责任", component: AboutResponsibility },
  { id: "us", label: "关于我们", component: AboutUs },
  { id: "cooperate", label: "合作商户", component: AboutCooperate },
  { id: "rule", label: "规则与条款", component: AboutRule },
  { id: "privacy", label: "隐私保护规则", component: AboutPrivacy },
  { id: "contact", label: "联系我们", component: AboutContact },
  { id: "aboutQaGame", label: "", component: AboutQaGame, key: "qa" },
  { id: "aboutQaSport", label: "", component: AboutQaSport, key: "qa" },
  { id: "aboutQaOther", label: "", component: AboutQaOther, key: "qa" },
  { id: "aboutQaPerson", label: "", component: AboutQaPerson, key: "qa" }
]);

const route = useRoute();
const router = useRouter();

const currentComponent = computed(() => {
  const res = tabInfo.value.find((item) => item.id === route.query.id);
  console.log(res);

  return res ? res.component : AboutGuide;
});

const updateTab = (name) => {
  router.push({ query: { id: name } });
};

watch(
  () => route.query,
  () => {
    if (route.query?.id) {
      const res = tabInfo.value.find((item) => item.id === route.query.id);

      activeTab.value = res ? res.key ?? res.id : "guide";
      window.scrollTo(0, 0);
    } else {
      activeTab.value === "guide";
      router.push({ query: { id: "guide" } });
    }
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.about-container {
  display: flex;
  margin: 0 auto;
  padding: 50px 5% 120px;
  height: 100%;
  min-height: 800px;
  gap: 20px;
  background-image: url(../assets/about/background-image.png);
  background-size: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  background-color: #e7f1fd;

  .icon-selected-img {
    position: absolute;
    left: 0;
    width: 5px;
  }

  .icon-img {
    width: 20px;
    height: 20px;
  }

  .tab-label {
    font-family: PingFang SC;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: normal;
    color: #a4aabb;

    &.active {
      color: #424f72;
    }
  }

  :deep(.el-tabs) {
    flex-grow: 1;
  }

  .about-content,
  :deep(.el-tabs__header) {
    padding: 25px 40px 50px;
    border-radius: 0.9375rem;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 800px;
    flex: 1;

    .title {
      color: #424f72;
      font-family: Microsoft YaHei;
      font-size: 1.125rem;
      font-weight: 700;
      line-height: normal;
    }

    .separator {
      border: 1px solid rgba(0, 0, 0, 0.2);
      margin: 15px 0;
    }
  }

  .about-content {
    background-image: url("../assets/about/white-b.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  :deep(.el-tabs__content) {
  }

  :deep(.el-tabs__item) {
    margin: 8px 10px;
    padding: 0 50px;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 10px;
    color: #a4aabb;
  }

  :deep(.el-tabs__item.is-active) {
    background: #e7f3ff;
    height: 50px;
    color: #424f72;
  }

  :deep(.el-menu-item) {
    height: 50px;
    color: #a4aabb;
    padding-right: 44px;
  }

  .el-menu-vertical-demo {
    box-shadow: 0px 0px 10px 0px #0000001a;
    border-radius: 20px;
    width: 280px;
    padding: 15px 10px;
  }

  :deep(.el-menu-item.is-active) {
    color: #424f72;
  }
}

.dark {
  .about-container {
    background: $background-dark;

    :deep(.el-tabs__header),
    .about-content {
      background-color: $background-content-block-dark;
    }

    :deep(.el-tabs__item) {
      &.is-active {
        color: $color-white;
        background-color: $background-content-block-lighter-dark;

        .icon-selected-img {
          background-color: transparent;
        }
      }
    }

    .tab-label {
      &.active {
        color: #0075ff;
      }
    }

    .about-content {
      color: $font-3-dark;

      .title {
        color: $color-white;
      }
    }
  }
}
</style>

<template>
  <div class="about-container">
    <el-card body-style="border-radius: 20px;">
      <el-tabs v-model="activeTab" tab-position="left" @tab-click="updateTab">
        <el-tab-pane v-for="(e, i) in tabInfo" :key="`aboutus-${i}`" :name="e.id">
          <template #label>
            <img v-if="activeTab === e.id" class="icon-selected-img" src="../assets/about/tab_selected.png" />
            <img class="icon-img" :src="require(`../assets/about/icon_${e.id}.png`)" />
            <div class="tab-label">{{ $t(e.labelKey) }}</div>
          </template>
          <div class="about-content">
            <div class="title">{{ $t(e.labelKey) }}</div>
            <div class="separator"></div>
            <component :is="e.component"></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AboutUs from "../components/about/AboutUs.vue";
import AboutInfo from "../components/about/AboutInfo.vue";
import AboutLaw from "../components/about/AboutLaw.vue";
import AboutRule from "../components/about/AboutRule.vue";
import AboutBlame from "../components/about/AboutBlame.vue";

const activeTab = ref("aboutus");
const tabInfo = ref([
  { id: "aboutus", labelKey: "about.aboutus", component: AboutUs },
  { id: "info", labelKey: "about.collectInformation", component: AboutInfo },
  { id: "law", labelKey: "about.legalBasis", component: AboutLaw },
  { id: "rule", labelKey: "about.bettingRules", component: AboutRule },
  { id: "blame", labelKey: "about.blame", component: AboutBlame }
]);

const route = useRoute();
const router = useRouter();
const affCode = sessionStorage.getItem("AFFILIATE_CODE");

const updateTab = (pane) => {
  if (pane.props.name === "agent")
    window.open("https://lh1-affiliate.phoicynxeey.com/lh/login?agent=" + (affCode ? affCode : ""), "_self");
  else router.push({ query: { id: pane.props.name } });
};

watch(
  () => route.query,
  () => {
    if (route.query === null) {
      activeTab.value === "about";
    } else {
      activeTab.value = route.query.id;
      window.scrollTo(0, 0);
    }
  }
);

onMounted(() => {
  if (route.query.id) activeTab.value = route.query.id;
});
</script>

<style scoped lang="scss">
.about-container {
  display: flex;
  width: 90%;
  margin: 0 auto;
  padding: 10px 0;
  height: 100%;
  min-height: 1240px;
  max-width: $maxwidth;
  border-radius: 20px;

  .icon-selected-img {
    position: absolute;
    left: 0;
    width: 5px;
  }

  .icon-img {
    width: 20px;
  }

  .tab-label {
    font-family: PingFang SC;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: normal;
  }

  .about-content,
  :deep(.el-tabs__header) {
    padding: 50px 20px;
    border-radius: 0.9375rem;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 1240px;

    .title {
      color: $font-5;
      font-size: 1.125rem;
      font-weight: 700;
      line-height: normal;
    }

    .separator {
      border: 1px solid rgba(0, 0, 0, 0.2);
      margin: 15px 0;
    }
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
    color:  $font-5;
  }
}
</style>

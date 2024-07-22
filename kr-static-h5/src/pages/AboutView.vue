<template>
  <q-page>
    <div class="about-tabs-div">
      <div
        v-for="(tab, index) in tabInfo"
        :key="index"
        class="about-item"
        @click="updateTab(tab.id)"
        :class="activeTab.id === tab.id ? 'is-active' : ''"
      >
        <span>{{ $t(tab.labelKey) }}</span>
      </div>
    </div>

    <div class="about-board">
      <component :is="activeTab.component" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AboutUs from "components/about/AboutUs.vue";
import AboutInfo from "components/about/AboutInfo.vue";
import AboutLaw from "components/about/AboutLaw.vue";
import AboutRule from "components/about/AboutRule.vue";
import AboutBlame from "components/about/AboutBlame.vue";

const activeTab = ref({});
const tabInfo = ref([
  { id: "aboutus", labelKey: "lang.about.aboutus", component: AboutUs },
  { id: "info", labelKey: "lang.about.collectInformation", component: AboutInfo },
  { id: "law", labelKey: "lang.about.legalBasis", component: AboutLaw },
  { id: "rule", labelKey: "lang.about.bettingRules", component: AboutRule },
  { id: "blame", labelKey: "lang.about.blame", component: AboutBlame }
]);

const route = useRoute();
const router = useRouter();

const updateTab = (id) => {
  router.push({ query: { id } });
};

watch(
  () => route.query,
  () => {
    const tabFromQuery = route.query.id;
    if (!tabFromQuery) {
      activeTab.value = tabInfo.value[0];
      return;
    }

    activeTab.value = tabInfo.value.find((tab) => tab.id === tabFromQuery);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.about-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 1rem 0.9rem 1rem;
  margin: 10px auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;

  .about-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 10px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.about-board {
  width: $box-width;
  margin: 10px auto 30px;
  background: $white;
  border-radius: 10px;
  box-shadow: $shadow-bg;
  padding: 16px 12px 25px;
}
</style>

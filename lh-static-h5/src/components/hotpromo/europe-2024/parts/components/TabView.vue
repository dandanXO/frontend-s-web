<template>
  <div class="tab-view-wrapper">
    <div class="tab-view-tabs-wrapper">
      <button class="tab-view-tabs__scroll-btn" v-if="scrollable" @click="handleScrollClick('prev')">
        <img src="../..//images/tab-btn-left.png" />
      </button>

      <div class="tab-view-tabs__inner-wrapper">
        <button
          v-for="(tab, index) in displayTabList"
          class="tab-view-tabs__tab"
          :key="index"
          :class="{
            active: activeTab === tab
          }"
          @click="() => (activeTab = tab)"
        >
          <slot v-if="$slots.tab" name="tab" :tab="tab" />
          <span v-else>{{ tab }}</span>
        </button>
      </div>

      <button class="tab-view-tabs__scroll-btn" v-if="scrollable" @click="handleScrollClick('next')">
        <img src="../..//images/tab-btn-right.png" />
      </button>
    </div>
    <div class="tab-view-content-wrapper">
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, toRefs, ref } from "vue";

const props = defineProps({
  scrollable: Boolean,
  tabList: Array,
  tabPerPage: {
    type: Number,
    default: 5
  }
});
const { scrollable, tabList, tabPerPage } = toRefs(props);

const activeTab = defineModel();

const currentPage = ref(0);

const maximumPage = computed(() => Math.floor(tabList.value.length / tabPerPage.value));
const displayTabList = computed(() => {
  if (!scrollable.value) return tabList.value;

  const start = tabPerPage.value * currentPage.value;
  return tabList.value.slice(start, start + tabPerPage.value);
});

const handleScrollClick = (type) => {
  const pageDirection = type === "next" ? 1 : -1;
  const newPageNumber = currentPage.value + pageDirection;

  if (newPageNumber >= maximumPage.value || newPageNumber < 0) return;
  currentPage.value = newPageNumber;
};
</script>
<style scoped lang="scss">
.tab-view-wrapper {
  .tab-view-tabs-wrapper {
    display: flex;
    justify-content: center;
    gap: 18px;

    .tab-view-tabs__scroll-btn {
      background-color: transparent;
      border: none;
      margin-top: 12px;
      align-self: flex-start;

      img {
        max-width: 32px;
      }
    }

    .tab-view-tabs__inner-wrapper {
      display: flex;
      border: 1px solid #ffffff66;
      border-radius: 20px 20px 0 0;
      overflow: auto;

      .tab-view-tabs__tab {
        background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
        border: none;
        padding: 12px 12px 18px;
        position: relative;
        font-family: Microsoft YaHei UI;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;
        text-align: center;
        color: #ffffff;

        &:not(:last-child) {
          &::before {
            display: block;
            content: "";
            position: absolute;
            width: 1px;
            background: #ffffff4d;
            right: 0;
            top: 16px;
            bottom: 26px;
          }
        }

        &.active {
          background: linear-gradient(180deg, #00c2ff 0%, #aaebff 52.5%, #00c2ff 100%);
          font-weight: 700;
          color: #0166cb;

          &::before {
            display: none;
          }
        }
      }
    }
  }

  .tab-view-content-wrapper {
    border: 7px solid #ffffff;
    border-radius: 20px;
    background: #d1eeff;
    box-shadow: 0px 0px 17.5px 17px #00286533 inset;
    padding: 16px 18px;
    margin-top: -13px;
    position: relative;
  }
}
</style>

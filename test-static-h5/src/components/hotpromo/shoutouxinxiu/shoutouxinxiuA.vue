<template>
  <div class="europe-container">
    <div class="tab-content">
      <div class="sched-buttons">
        <div v-for="(tab, index) in schedTabs" :key="index" style="position: relative; flex: 1;">
          <div class="bar" v-show="schedActiveTab === index"></div>
          <button @click="activateSchedTab(index)" :class="{ active: schedActiveTab === index }">
            {{ tab.name }}
          </button>
        </div>
      </div>
      <div class="sched-content">
        <component :is="schedTabs[schedActiveTab].content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import NewComersLimeLight from "./components/NewComersLimeLight.vue";
import EmergencyFund from "./components/EmergencyFund.vue";

const props = defineProps({
  tabtitle: String
});

const schedTabs = ref([
  { name: "新秀享头彩", content: NewComersLimeLight },
  { name: "救援金", content: EmergencyFund }
]);
const schedActiveTab = ref(0);
function activateSchedTab(index) {
  schedActiveTab.value = index;
}
</script>
<style scoped lang="scss">
.sched-buttons {
  width: 260px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1400px;
  margin: 10px auto;
  gap: 8px;

  .bar {
    position: absolute;
    left: 50%;
    top: -12px;
    transform: translateX(-50%);
    width: 72px;
    height: 4px;
    background: white;
    border-radius: 27px;
  }

  button {
    background: url(./images/schedinactive-tab.png) no-repeat;
    background-size: contain;
    color: #ffffff;
    font-weight: bold;
    font-size: 12px;
    font-weight: 700;
    line-height: 34.75px;
    letter-spacing: 0.12em;
    text-align: center;
    border: none;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4px;
    width: 100%;
    height: 70px;
    white-space: nowrap;

    &.active {
      background-image: url(./images/schedactive-tab.png);
    }
  }
}
</style>

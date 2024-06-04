<template>
  <div class="tab-title">
      {{ tabtitle }}
  </div>
  <div class="sched-buttons">
  <button
      v-for="(tab, index) in schedTabs"
      :key="index"
      @click="activateSchedTab(index)"
      :class="{ active: schedActiveTab === index }"
  >
      {{ tab.name }}
  </button>
  </div>
  <div class="sched-content">
      <component :is="schedTabs[schedActiveTab].content" />
  </div>
</template>

<script setup>
  import { ref, defineProps } from 'vue';
  import NewComersLimeLight from "@/components/hotpromo/europe-2024/parts/newcomerslimelight.vue"
  import EmergencyFund from "@/components/hotpromo/europe-2024/parts/emergencyfund.vue"

const props = defineProps({
  tabtitle: String
});

const schedTabs = ref([
{ name: '新秀享头彩', content: NewComersLimeLight },
{ name: '救援金', content: EmergencyFund },
]);
const schedActiveTab = ref(0);
function activateSchedTab(index) {
  schedActiveTab.value = index;
}
</script>
<style lang="scss">

  .sched-buttons {
    width: 100%;
    display: flex;
  justify-content: center;
    align-items: center;
    max-width: 1400px;
    margin: 10px auto;
    button {
      background: url(../images/schedinactive-tab.png)no-repeat center center;
      width: 240px;
      height: 86px;
      background-size: contain;
      color: #ffffff;
      font-weight: bold;
      font-family: 'PingFang SC';
      font-size: 25px;
      font-weight: 800;
      line-height: 34.75px;
      letter-spacing: 0.12em;
      text-align: center;

      &.active {
        background-image: url(../images/schedactive-tab.png);
      }
    }
  }
  </style>
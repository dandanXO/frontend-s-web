<template>
  <div class="shoutouxinxiu-container">
    <div class="tab-content">
      <div class="sched-buttons">
        <div v-for="(tab, index) in schedTabs" :key="index" style="position: relative;">
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
import NewComersLimeLight from "@/components/hotpromo/shoutouxinxiu/components/newcomerslimelight.vue";
import EmergencyFund from "@/components/hotpromo/shoutouxinxiu/components/emergencyfund.vue";

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
.shoutouxinxiu-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;

  .rule-title {
    text-align: center;
  }
  .tab-buttons {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    max-width: 1000px;
    margin: 0px auto;
    button {
      background: url(images/inactive-tab.png) no-repeat center center;
      width: 250px;
      height: 60px;
      background-size: contain;
      color: #ffffff;
      font-weight: bold;
      font-family: "PingFang SC";
      font-size: 20px;
      font-weight: 800;
      text-align: center;

      &.active {
        background-image: url(images/active-tab.png);
      }
    }
  }
  .tab-content {
    min-height: 350px;
    // padding-top:20px;
    .tab-title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      font-weight: bold;
      line-height: 59.57px;
      letter-spacing: 0.12em;
      text-align: left;
      margin: 2vh auto 5vh;
      background: linear-gradient(360deg, #bcf3ff 10.4%, #ffffff 100%);
      border: none;
      color: transparent; /* Hide the original text */
      -webkit-background-clip: text; /* Apply background gradient to the text */
      background-clip: text;

      &:before,
      &:after {
        content: "";
        height: 48px;
        width: 180px;
        background: url(images/titlewing.png) no-repeat center center;
        background-size: contain;
      }
      &:after {
        transform: rotateY(180deg);
      }
    }
  }

  .note {
    color: #faff00;
    font-family: "Microsoft Yahei UI";
    text-align: center;
    margin: 80px auto;
    font-size: 24px;
    display: block;
  }
}

.sched-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1400px;
  margin: 10px auto;

  .bar {
    position: absolute;
    left: 50%;
    top: -12px;
    transform: translateX(-50%);
    width: 104px;
    height: 6px;
    background: white;
    border-radius: 27px;
  }

  button {
    background: url(./images/schedinactive-tab.png) no-repeat center center;
    width: 283px;
    height: 125px;
    background-size: contain;
    color: #ffffff;
    font-weight: bold;
    font-family: "PingFang SC";
    font-size: 25px;
    font-weight: 800;
    line-height: 34.75px;
    letter-spacing: 0.12em;
    text-align: center;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;

    &.active {
      background-image: url(./images/schedactive-tab.png);
      height: 146px;
    }
  }
}
</style>

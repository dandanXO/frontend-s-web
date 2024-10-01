<template>
  <div class="jili-container">
    <div class="jili-top-banner">
      <div class="jili-banner-text">
        <img src="../../../assets/images/promotion/hotpromo/23/jili-top-50-text.png" />
        <img style="width: 230px" src="../../../assets/images/promotion/hotpromo/23/jili-members-weekly-betting.png" />
        <img src="../../../assets/images/promotion/hotpromo/23/jili-members-weekly-betting-white.png" />
      </div>
      <div class="jili-banner-icon">
        <img src="../../../assets/images/promotion/hotpromo/23/jili-top-icon.png" />
      </div>
    </div>

    <!-- <div class="jili-gift-box">
      <img src="../../../assets/images/promotion/hotpromo/23/jili-gift.png" style="width: 200px; height: 200px" />
    </div>
    <q-btn @click="$emit('claim-slot')" class="jili-claim-btn" unelevated>
      <img src="../../../assets/images/promotion/hotpromo/23/jili-claim-btn.png" style="width: 180px; height: 50px" />
    </q-btn> -->

    <div class="jili-result-box">
      <div class="jili-table">
        <div v-for="(rank, i) in jiliRanks" class="jili-rank" :key="i">
          <img
            v-if="i < 3"
            :src="require(`../../../assets/images/promotion/hotpromo/23/jili-no-${Number(i) + 1}.png`)"
            style="width: 60px; height: 30px"
          />
          <div class="jili-rank-span1" style="color: #ffffff; text-align: center" v-else>{{ i + 1 }}</div>
          <span class="jili-rank-span2">{{ rank.loginName }}</span>
          <span class="jili-rank-span3">₱{{ rank.amount }}</span>
        </div>
      </div>
    </div>

    <div class="jili-rule-box rich-content-control" v-html="props.pageContent" />
    <!--    <div class="jili-rule-box">-->
    <!--      <div class="jili-rule-title">Activity Rule</div>-->
    <!--      <div class="jili-rule-content">-->
    <!--        Offical government licenseGood user reputationExcellent product experienceOffical government licenseGood user-->
    <!--        reputationExcellent product experience-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script setup>
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";

const props = defineProps({
  pageContent: {
    type: String,
    required: false
  }
});

const jiliRanks = ref([]);
const getJiliRank = () => {
  api.get("/top-winner/top-bet").then((res) => {
    if (res.code === 0) {
      jiliRanks.value = res.data;
    }
    console.log(res);
  });
};
onMounted(() => {
  getJiliRank();
});
</script>

<style scoped lang="scss">
.jili-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url("../../../assets/images/promotion/hotpromo/23/jili-h5-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.jili-top-banner {
  display: flex;
  max-height: 100vh;
  justify-content: space-between;
  width: 100%;
}

.jili-banner-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  width: 40%;
  margin-top: 20px;
  margin-left: 20px;
}

.jili-banner-icon {
  display: flex;
  justify-content: flex-end;
  height: 240px;
}

.jili-gift-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.jili-claim-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.jili-result-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 30px;
  height: 250px;
  background: url("../../../assets/images/promotion/hotpromo/23/jili-table-bg.png") no-repeat;
  background-size: 100% 250px;
}

.jili-table {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  max-height: 200px;
  overflow: auto;
}

.jili-rank {
  display: flex;
  justify-content: flex-start;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  // height: 80px;
  // margin: 5px 10px;
}

.jili-rank-span1 {
  display: flex;
  justify-content: center;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: center;
  color: #ffffff;
  flex: 1;
}

.jili-rank-span2 {
  display: flex;
  justify-content: center;
  margin: 0 20px;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  color: #83a3ca;
  flex: 1;
}

.jili-rank-span3 {
  display: flex;
  justify-content: center;
  margin: 0 20px;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
  flex: 1;
}

.jili-rule-box {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-left: 30px;
  margin-bottom: 20px;
  color: #fff;
}

.jili-rule-title {
  display: flex;
  justify-content: flex-start;
  color: #ffffff;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
}

.jili-rule-content {
  width: 100%;
  font-family: Microsoft YaHei UI;
  font-size: 12px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  color: #83a3ca;
}
</style>
<script setup></script>

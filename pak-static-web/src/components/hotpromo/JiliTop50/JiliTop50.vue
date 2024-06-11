<template>
  <div class="jili-container">
    <div class="jili-top">
      <div class="top-text">
        <span class="span"><img src="../../../assets/images/promotion/hotpromo/23/jili-top-50-text.png" /></span>
        <span class="span">
          <img src="../../../assets/images/promotion/hotpromo/23/jili-members-weekly-betting.png" />
        </span>
        <span class="span">
          <img src="../../../assets/images/promotion/hotpromo/23/jili-members-weekly-betting-white.png" />
        </span>
      </div>
      <div class="top-icon">
        <img src="../../../assets/images/promotion/hotpromo/23/jili-top-icon.png" />
      </div>
    </div>

    <!-- <div class="jili-claim-block">
      <div class="jili-gift"><img src="../../../assets/images/promotion/hotpromo/23/jili-gift.png" /></div>
      <div class="jili-claim-btn" @click="$emit('claim-slot')">
        <img src="../../../assets/images/promotion/hotpromo/23/jili-claim-btn.png" />
      </div>
    </div> -->

    <div class="jili-result-block">
      <div class="jili-result-table">
        <div class="jili-table">
          <div v-for="(rank, i) in jiliRanks" class="jili-rank" :key="i">
            <img
              v-if="i < 3"
              :src="require(`../../../assets/images/promotion/hotpromo/23/jili-no-${Number(i) + 1}.png`)"
              style="size: 26px; margin: 0 32px"
            />
            <div class="jili-rank-span1" v-else>{{ i + 1 }}</div>
            <span class="jili-rank-span2">{{ rank.loginName }}</span>
            <span class="jili-rank-span3">₱{{ rank.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="jili-rules-block rich-content-control" v-html="props.pageContent" />
    <!--    <div class="jili-rules-block">-->
    <!--      <span class="jili-rules-span">Activity Rules</span>-->
    <!--      <p class="jili-rules-text">Offical government licenseGood user reputationExcellent product experience.</p>-->
    <!--      <p class="jili-rules-text">-->
    <!--        Offical government licenseGood user reputationExcellent product experienceOffical government licenseGood user-->
    <!--        reputationExcellent product experience.-->
    <!--      </p>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import { getJiliRanks } from "@/api/index/promo";
import { onMounted, ref } from "vue";

const props = defineProps({
  pageContent: {
    type: String,
    required: false
  }
});

const jiliRanks = ref([]);
const getJiliRank = () => {
  getJiliRanks().then((res) => {
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
  background-image: url("../../../assets/images/promotion/hotpromo/23/jili-bg.png");
  min-height: 100vh;
}

.jili-top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}
.top-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 50px;
  width: 50%;
}
.span {
  display: flex;
  justify-content: flex-start;
}
.top-icon {
  display: flex;
  justify-content: flex-end;
}

.jili-claim-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  margin-top: -300px;
}
.jili-gift {
  display: flex;
  justify-content: center;
  align-content: center;
}
.jili-claim-btn {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: -160px;

  &:hover {
    cursor: pointer;
  }
}

.jili-result-block {
  display: flex;
  justify-content: center;
  align-items: center;
}

.jili-result-table {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: url("../../../assets/images/promotion/hotpromo/23/jili-result-table-bg.png");
  background-size: 100% 500px;
}
.jili-table {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-height: 85%;
  overflow: auto;
}
.jili-rank {
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  height: 70px;
  margin: 15px 10px;
}
.jili-rank-span1 {
  display: flex;
  justify-content: center;
  margin: 10px 50px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: center;
  color: #ffffff;
}
.jili-rank-span2 {
  display: flex;
  justify-content: center;
  margin: 10px 50px;
  font-size: 20px;
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
  margin: 10px 35px;
  font-size: 30px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
  flex: 1;
}
.jili-rules-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 240px;
  padding-bottom: 30px;
  padding-top: 30px;
  color: #fff;
}
.jili-rules-span {
  display: flex;
  font-size: 20px;
  font-weight: 900;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 15px;
  color: #ffffff;
}
.jili-rules-text {
  display: flex;
  font-size: 20px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: #83a3ca;
  margin-bottom: 30px;
}
</style>

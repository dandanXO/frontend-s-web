<template>
  <div class="support-service">
    <div class="inner">
      <div class="title">
        全行业最强推广支持
      </div>
      <div class="subtitle">
        THE MOST POWERFUL PROMOTION SUPPOERT
      </div>
      <div class="bar" />
      <div class="services">
        <div class="serv-boxes">
          <div class="serv-box" v-for="(c, i) in servlist" :key="i">
            <div class="servicon">
              <img :src="require(`../../assets/images/${c.icon}.svg`)">
            </div>
            <div class="type">{{ c.title }}</div>
            <div class="sub">{{ c.sub }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const servlist = ref([
  {
    icon: 'cmail',
    title: '支持全渠道推广',
    sub:
      '提供全面丰富的图片、视频推广素材，专业定制马甲包，支持分发全网每个角落',
  },
  {
    icon: 'cmail',
    title: '15天成为推广达人',
    sub: '专家团队24小时提供专业指导，零基础也可快速成为推广达人',
  },
  {
    icon: 'cmail',
    title: '最全数据报表',
    sub: '全面分析佣金组成、会员游戏状况，对您的会员了如指掌',
  },
])
</script>
<style lang="scss">
.support-service {
  background: url('../../assets/images/login/cus-bg.png');
  width: 100%;
  height: 100vh;
  .inner {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 50px;
    position: relative;
    height: 100%;
  }
  .title {
    color: #043860;
    font-size: 50px;
    font-family: PFBold;
  }
  .subtitle {
    color: #7f7f7f;
    margin-top: 20px;
  }
  .bar {
    width: 100%;
    max-width: 600px;
    height: 5px;
    margin-top: 10px;
    background: linear-gradient(
      90deg,
      #33b5ff 0%,
      rgba(26, 173, 255, 0) 101.54%
    );
  }
  .services {
    display: flex;
    flex-direction: row-reverse;
    margin: 50px auto;
    .girl {
      flex: 1;
      img {
        width: 100%;
      }
    }
    .serv-boxes {
      flex: 2;
      display: flex;
      justify-content: center;
      margin: 20px auto;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
    }
    .serv-box {
      .title {
        color: #0a1629;
        font-weight: bold;
      }
      .sub {
        color: #999999;
      }
    }
  }
}
</style>

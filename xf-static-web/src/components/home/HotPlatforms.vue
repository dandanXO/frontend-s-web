<template>
    <div class="game-item">
          <div v-for="plat in hotPlatforms">
            <router-link class="quick-plat" :style="{ backgroundImage: `url(${require(`@/assets/home/plat_bg_${plat.name}.png`)})` }"
            :to="`${plat.link}`">
              <!-- <router-link class="quick-plat" to="/" @click="checkMaintenance"> -->
              <div class="quickplat-title">{{ plat.title }}</div>
              <div class="quickplat-logos">
                <span v-for="logo in plat.logos" class="logo"><img :src="require(`@/components/pages/img/${plat.name}/${plat.name}-logo-${logo.code.toLowerCase()}.png`)"></span>
              </div>
              <div class="quickplat-desc">{{ plat.desc }}</div>
              
              <img class="bottom-img" :src="require(`@/assets/home/plat_img_${plat.name}.png`)" alt="" />
            </router-link>
            
          </div>
        </div>
</template>
<script setup>
import { ref } from "vue";
const hotPlatforms = ref([
      {
        name: "live",
        link: "/live-casino",
        title: "真人投注",
        desc: "全网最美性感荷官，视觉交互极致高清；包桌咪牌模式可选，骰宝轮盘游戏多元；庄闲龙宝专业路纸；美女主播陪玩在线；如临现场旗舰体验",
        logos: [
            {
                code: "BBINDY"
            },
            {
                code: "WE"
            },
            {
                code: "AG"
            },
            {
                code: "BG"
            },
            {
                code: "PMLIVE"
            },
        ]
      },
      {
        name: "sport",
        link: "/sports",
        title: "体育赛事",
        desc: "运动类型悉数收录，赛事级别立体覆盖；单场比赛百种玩法，业界前沿赔率最佳；滚球投注秒速确认，跳车结算丰俭由人；视频动画全程直播。",
        logos: [
            {
                code: "IM"
            },
            {
                code: "PM"
            },
            {
                code: "SABA"
            },
        ]
      },
      {
        name: "poker",
        link: "/poker",
        title: "棋牌游戏",
        desc: "多元化棋牌首创娱乐休闲新玩法在线抢红包；抢庄牛牛、龙虎斗、21点、麻将、万人等应有尽有，多款棋牌任君选、棋牌彰显胸怀，使您乐在其中！",logos: [
            {
                code: "DT"
            },
            {
                code: "KY"
            },
        ]
      }
    ])
</script>
<style scoped lang="scss">
.game-item {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      margin: 20px auto 80px;
      gap: 100px;
      justify-content: center;
      align-items: center;
      .quick-plat {
        width: 335px;
        height: 450px;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        justify-content: flex-start;
        padding: 30px 0 0;
        align-items: center;
        flex-direction: column;
        position: relative;
        text-decoration: none;
        .bottom-img{ 
          width: 100%; 
          position: absolute;
          bottom: -70px;
        }
        .quickplat-title {
          font-family: PingFang SC;
          font-size: 28px;
          font-weight: 600;
          line-height: 40px;
          color: #ffffff;

        }
        .quickplat-logos {
            display: flex;
            width: 90%;
            gap: 10px;
            margin: 20px auto 0;
            justify-content: center;
            .logo {
                background: url(@/assets/home/plat_icon_bg.png)no-repeat center center;
                background-size: contain;
                padding: 10px;
                max-width: 30px;
            }
        }
        .quickplat-desc {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;
            color: #B8b8b8;
            width: 90%;
            margin: 10px auto;
        }
      }
    }
    </style>
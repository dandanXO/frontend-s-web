<template>
  <div class="btn-container">
    <img class="icon" src="./img/flower.png" />
    <div class="styled-box">
      <div class="title">Show your creativity and become the face of B9.GAME!</div>
      <ul class="content">
        <li>
          Win
          <span class="sp1">PKR 3,000,000</span>
          and worldwide recognition with just one video!
        </li>
        <li>Do you have creative ideas?</li>
        <li>Do you want to be in the spotlight?</li>
        <li>
          <span class="sp2">B9.GAME</span>
          is searching for its next Brand Ambassador, and it could be YOU!
        </li>
      </ul>
    </div>
    <div class="sec-title">
      <img class="sec-icon" src="./img/sec-icon.png" />
      <div class="sec-content">Amazing Rewards Await You!</div>
    </div>
  </div>
  <div class="thrid-section">
    <div>1st Prize - Annual Brand Ambassador</div>
    <ul>
      <li>
        Represent
        <span class="l1">B9.GAME</span>
        for 12 months
      </li>
      <li>
        Prize Money:
        <span class="l2">PKR 3,000,000</span>
      </li>
    </ul>

    <div>2nd Prize - Creative Star</div>
    <ul>
      <li>
        Represent
        <span class="l1">B9.GAME</span>
        for 6 months
      </li>
      <li>
        Prize Money:
        <span class="l2">PKR 300,000</span>
      </li>
    </ul>
    <div>3rd Prize - Innovation Champ</div>
    <ul>
      <li>
        Represent
        <span class="l1">B9.GAME</span>
        for 1 month
      </li>
      <li>
        Prize Money:
        <span class="l2">PKR 30,000</span>
      </li>
    </ul>
    <div style="color: red">
      Participation Bonus Get
      <span style="color: rgba(255, 157, 0, 1)">PKR 3,000</span>
      if your video gets over 1,000 views!
    </div>
    <div class="thrid-title">
      <img class="thrid-icon" src="./img/sec-icon.png" />
      <div class="thrid-content">Participation Bonus</div>
    </div>
    <div>
      <span style="color: rgba(255, 255, 255, 0.8)">
        if your video got 1000 views you will get 3000 pkr three simple steps to participate in game
      </span>
      <ul>
        <li style="color: rgba(255, 255, 255, 0.8)">1- download b9 game</li>
        <li style="color: rgba(255, 255, 255, 0.8)">2- sign up</li>
        <li style="color: rgba(255, 255, 255, 0.8)">3- get the invitation link</li>
      </ul>
    </div>
  </div>
  <div class="four-section">
    <div class="content">
      <div class="title">Create a Creative Video</div>
      <div class="text">
        Show your talent with unique content! Whether it's gameplay, rewards, user stories, or fun ideas, don't forget
        to include your invitation link in the video.
      </div>
    </div>
    <div class="content">
      <div class="title">Upload Your Video</div>
      <div class="text">Share your video on TikTok, YouTube Shorts, or Instagram Reels and increase your views!</div>
    </div>
  </div>
  <div class="five-section">
    <img src="./img/five-title.png" />
    <div class="additional-info">
      <ul>
        <li>Your video must remain published and pinned for at least 1 month.</li>
        <li>
          Rewards are based on the number of views for a single video (no combining views). Fake views will disqualify
          you.
        </li>
        <li>
          Event duration:
          <span class="sp1">19th January 2025 - 19th March 2025</span>
          .
        </li>
        <li>How to Claim Rewards?</li>
        <li>
          Once your video reaches 1,000 views, contact
          <span class="sp2">B9.GAME</span>
          Customer Support to submit your video link and ID. Your reward will be processed within 7 working days!
        </li>
        <li>
          Don't Miss Out! Download
          <span class="sp2">B9.GAME</span>
          now, use your creativity, and shine like a star!
        </li>
        <li>“This is your chance to make Pakistan proud!”</li>
        <li>
          “The next
          <span class="sp2">B9.GAME</span>
          Brand Ambassador could be YOU!"
        </li>
      </ul>
    </div>
  </div>
  <div class="ranking-section">
    <img class="ranking-top-img" src="./img/ranking-top.png" />
    <div class="ranking-container">
      <div class="ranking-header">
        <div class="rank-index">RANKING</div>
        <div>NAME</div>
        <!-- <div>AMOUNT</div> -->
      </div>
      <div class="ranking-content">
        <div class="ranking-item" v-for="n in 5" :key="n">
          <div
            class="rank-index"
            :style="`background: ${
              n <= 3
                ? 'url(' +
                  require(`./img/rank-${n}.png`) +
                  ') no-repeat center center; color: #9E6213; font-weight: 900; min-height: 24px'
                : 'none'
            }`"
          >
            <template v-if="n > 3">
              {{ n }}
            </template>
          </div>
          <div class="rank-name">
            <a :href="params[`ambassador_${n}`]" target="_blank">
              {{ params[`ambassador_${n}`] }}
            </a>
          </div>
          <!-- <div class="rank-amt">
            <img src="./img/coin.png" />
            888
          </div> -->
        </div>
      </div>
      <img class="ranking-container-decoration left" src="./img/ranking-left.png" />
      <img class="ranking-container-decoration right" src="./img/ranking-right.png" />
      <img class="ranking-container-decoration bottom" src="./img/ranking-bottom.png" />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";
import { api } from "boot/axios";

const router = useRouter();

const store = userStore();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

const isFtdPromoEnded = computed(() => {
  if (store.ftd !== "OPEN") {
    return true;
  }
  return false;
});

const gotoDepositPage = () => {
  const redirectPage = params && params.page ? params.page : "/deposit?from=/promo";
  router.push(redirectPage);
};

const loadAppTabs = () => {
  api.get("/opt-session/getPakAppTabs").then((res) => {
    if (res.code === 0) {
      const { data } = res;
      if (data && data.hasOwnProperty("ftd")) {
        store.ftd = data.ftd;
      }
    }
  });
};

onMounted(() => {
  loadAppTabs();
});
</script>
<style lang="scss">
.btn-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: auto;
  padding: 14px;
  position: relative;
  .icon {
    z-index: 2;
    position: absolute;
    top: -10%;
    left: 2%;
    width: 128px !important;
    height: 128px !important;
  }
}
.styled-box {
  z-index: 1;
  font-size: 12px;
  font-weight: 700;
  line-height: 17px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  background-image: url(./img/f-bg.png);
  background-color: rgba(30, 55, 31, 0.3);
  background-position: 100% 100%;
  background-repeat: no-repeat;
  border: 1px solid rgba(51, 126, 58, 1);
  border-radius: 12px;
  padding: 8px;
  position: relative;

  .title {
    font-size: 16px;
    color: #fff;
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .content {
    font-size: 16px;
    color: rgba(214, 214, 214, 1);
  }
  .sp1 {
    color: rgba(255, 204, 0, 1);
  }
  .sp2 {
    color: rgba(0, 255, 178, 1);
  }
}
.sec-title {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(./img/sec-bg.png);
  height: 26px;
  width: 80%;
  margin: 20px auto 16px;
  .sec-icon {
    width: 17px !important;
    height: 17px !important;
    margin-right: 4px;
  }
  .sec-content {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}
.thrid-section {
  padding: 0 14px;
  font-size: 14px;
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
  font-weight: 700;
  line-height: 15px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  .l1 {
    color: rgba(0, 255, 178, 1);
  }
  .l2 {
    color: rgba(255, 204, 0, 1);
  }
  ul {
    color: rgba(203, 203, 203, 1);
    margin-top: 12px !important;
    margin-bottom: 8px !important;
  }
  li {
    margin-bottom: 4px !important;
  }
}
.thrid-title {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(./img/sec-bg.png);
  height: 26px;
  width: 80%;

  margin: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  .thrid-icon {
    width: 17px !important;
    height: 17px !important;
    margin-right: 4px;
  }
  .thrid-content {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}

.four-section {
  padding: 0 14px;
  font-size: 14px;
  .content {
    margin-top: 20px;
  }
  .title {
    text-shadow: 2px 2px 2px rgba(255, 147, 64, 1);
    font-style: italic;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    background-image: url(./img/four-bg.png);
    background-position: 100% 100%;
    background-size: 100% 100%;
    height: 28px;
    width: 200px;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text {
    font-size: 12px;
    font-weight: 700;
    line-height: 17px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}
.five-section {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    margin: 24px 0 !important;
  }
  .additional-info {
    // padding: 15px;
    // border-radius: 10px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }
  .additional-info ul li {
    margin-bottom: 0px !important;
    color: #d1d1d1;
  }
  .sp1 {
    color: #ffd700;
  }
  .sp2 {
    font-weight: 700;
    color: rgba(0, 255, 178, 1);
  }
}

.ranking-section {
  background-image: url(./img/ranking-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  padding-top: 15%;
}
.ranking-top-img {
  top: 10%;
  margin: auto;
  max-width: 70%;
}

.ranking-container {
  position: relative;
  background: #1e371f;
  border: 2px solid #337e3a;
  border-radius: 10px;
  padding-top: 20px;
  margin: -6% 30px 88px;
  font-weight: 700;
  width: calc(100% - 60px);

  .ranking-header {
    display: grid;
    grid-template-columns: minmax(30px, 1fr) 3fr;
    background: #0000001a;
    border-radius: 24px;
    padding: 16px 4px;
    margin: 0 10px;
    text-align: center;
    .rank-index {
      text-align: center;
      margin: 0 20px;
    }
  }
  @media (max-width: 435px) {
    .ranking-content,
    .ranking-header {
      font-size: 10px;
    }
  }
  @media (max-width: 375px) {
    .ranking-content,
    .ranking-header {
      font-size: 9px;
    }
  }
  .ranking-content {
    margin-top: 16px;

    .ranking-item {
      display: grid;
      grid-template-columns: minmax(30px, 1fr) 3fr;
      height: 65px;
      padding: 0 14px;
      align-items: center;
      overflow-wrap: anywhere;
      .rank-index {
        font-size: 1rem;
        text-align: center;
        background-repeat: no-repeat !important;
        background-size: contain !important;
        background-position: center !important;
      }
      .rank-name {
        color: #ff4c00;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        a {
          color: inherit;
        }
      }
      .rank-amt {
        display: flex;
        color: #64ffce;
        align-items: center;
        img {
          height: 20px;
          width: 20px !important;
          margin-right: 10px;
        }
      }
    }
    .ranking-item:nth-child(odd) {
      background-color: #0000001a;
    }
  }
  .ranking-container-decoration {
    position: absolute;
    margin-bottom: unset !important;
    &.left {
      max-width: 50px;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &.right {
      max-width: 20px;
      top: 30%;
      right: 0;
      transform: translate(100%, -50%);
    }
    &.bottom {
      max-width: 88px;
      bottom: 0;
      right: 0;
      transform: translate(0, 100%);
    }
  }
}
</style>

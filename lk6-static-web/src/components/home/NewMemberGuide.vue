<template>
  <div class="new-member-guide-dialog" :show-close="false" v-if="store.regSuccessGuideVisible">
    <div class="step1-container" v-if="step === 1">
      <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" />
      <img src="../../assets/home/guide/step1-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="title">
          <div style="font-size: 38px">恭喜您</div>
          <div>雷火账号创建成功~</div>
        </div>
        <div>
          <img src="../../assets/home/guide/step1-arrow.png" alt="" />
        </div>
        <div class="subtitle">点击跟随新用户小指南 <br />绑定手机号有<span>彩金</span>赠送</div>

        <div class="next-button" @click="handleNext(2)">好的</div>
      </div>
    </div>

    <div class="step2-container" v-else-if="step === 2">
      <div class="step2-img">
        <img src="../../assets/home/guide/step2-img.png" alt="" />
      </div>
      <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" />
      <img src="../../assets/home/guide/step2-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="title">
          <div>
            电竞/体育/真人/棋牌
            <br />
            电子/小游戏/彩票/捕鱼
          </div>
        </div>
        <div class="subtitle">一目了然 轻松娱乐</div>
        <div class="page-count">1/5</div>
        <div class="next-button" @click="handleNext(3)">下一个</div>
      </div>
    </div>
    <div class="step3-container" v-else-if="step === 3">
      <div class="step3-img">
        <img src="../../assets/home/guide/step3-img1.png" alt="" /> 
      </div>
      <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" />
      <img src="../../assets/home/guide/step3-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="title">
          <div style="font-size: 38px">各种优惠红包彩金</div>
        </div>
        <div class="subtitle">现金红包拿到手软 轻松娱乐</div>
        <div class="page-count">2/5</div>
        <div class="next-button" @click="handleNext(4)">下一个</div>
      </div>
    </div>
    <div class="step4-container" v-else-if="step === 4">
      <div style="position: relative">
        <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" />
        <div class="content">
          <div class="title">
            <div style="font-size: 38px">
              扫码下载雷火 APP
              <br />
              APP 嗨翻周末夜
            </div>
          </div>
          <div class="subtitle">周六周日准时开启红包雨</div>
          <div class="page-count">3/5</div>
          <div class="next-button" @click="handleNext(5)">下一个</div>
        </div>
      </div>

      <img src="../../assets/home/guide/step4-img.png" alt="" class="step4-img" />
    </div>
    <div class="step5-container" v-else-if="step === 5">
      <div class="step5-img">
        <img src="../../assets/home/guide/step5-img1.png" alt="" />
      </div>
      <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" width="100%" />
      <div class="content">
        <div class="title">
          <div style="font-size: 38px">点击这里</div>
        </div>
        <div class="subtitle">到个人中心</div>
        <div class="page-count">4/5</div>
        <div class="next-button" @click="handleNext(6)">下一个</div>
      </div>
    </div>
    <div class="step6-container" v-else-if="step === 6">
      <div class="step6-img1">
        <img src="../../assets/home/guide/step6-img1.png" alt="" />
      </div>

      <div class="step6-img2">
        <img src="../../assets/home/guide/step6-img2.png" alt="" />
      </div>

      <img class="step-bg" src="../../assets/home/guide/step-bg.png" alt="" width="100%" />
      <div class="content">
        <div class="title">
          <div style="font-size: 38px">点击这里充值</div>
          <div>开启您的雷火游戏之旅</div>
        </div>
        <div class="page-count">5/5</div>
        <div class="next-button" @click="closeNewMemerGuide">知道了</div>

        <div class="subtitle" style="text-decoration: underline;cursor:pointer;" @click="goToPromo">点击前往新人活动</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "@/store";
import { useRouter } from 'vue-router';
import debounce from "lodash/debounce";

const store = userStore();
const step = ref(1);
const router = useRouter();

const props = defineProps(['openAppMenu', 'closeAppMenu']);

const adjustGuide = () => {
  const value = step.value;

  if(value === 2) {
    setTimeout(() => {
      const { x, y } = document.querySelector('.navigations').getBoundingClientRect();
      const step2img = document.querySelector('.step2-img');
      step2img.style.top = `calc(${y}px - 20px)`;
      step2img.style.left = `calc(${x}px + 55px)`;
      step2img.style.visibility = 'visible';
    }, 500)
  } else if(value === 3) {
    setTimeout(() => {
      const { x, y } = document.querySelector('.hover-icon.promotion').getBoundingClientRect();
      const step3img = document.querySelector('.step3-img');
      step3img.style.top = `calc(${y}px - 22px)`;
      step3img.style.left = `calc(${x}px - 175px)`;
      step3img.style.visibility = 'visible';
    }, 500)
    
  } else if(value === 4) {
    props?.openAppMenu();

    setTimeout(() => {
      const { x, y } = document.querySelector('.dl-wrapper').getBoundingClientRect();
      const step4img = document.querySelector('.step4-img');
      step4img.style.top = `calc(${y}px - 40px)`;
      step4img.style.left = `calc(${x}px - 430px)`;
      step4img.style.visibility = 'visible';
    }, 500);
  } else if(value === 5) {
    props?.closeAppMenu();

    setTimeout(() => {
      const { x, y } = document.querySelector('.profile-img').getBoundingClientRect();
      const step5img = document.querySelector('.step5-img');
      step5img.style.top = `calc(${y}px - 8px)`;
      step5img.style.left = `calc(${x}px - 208px)`;
      step5img.style.visibility = 'visible';
    }, 500);
  } else if(value === 6) {
    router.push('/center/deposit');

    setTimeout(() => {
      const { x, y } = document.querySelector('.icon-rounded.deposit').getBoundingClientRect();
      const step6img1 = document.querySelector('.step6-img1');
      step6img1.style.top = `calc(${y}px - 15px)`;
      step6img1.style.left = `calc(${x}px - 20px)`;
      step6img1.style.visibility = 'visible';
    }, 1000);

    setTimeout(() => {
      const { x: x2, y: y2 } = document.querySelector('.btn-confirm').getBoundingClientRect();
      const step6img2 = document.querySelector('.step6-img2');
      step6img2.style.top = `calc(${y2}px - 80px)`;
      step6img2.style.left = `calc(${x2}px - 143px)`;
      step6img2.style.visibility = 'visible';
    }, 2500);
  }
}

const goToPromo = () => {
  router.push('/promotion?name=lh1-newplayer-guide');
  closeNewMemerGuide();
}

const handleNext = (value) => {
  step.value = value;
  adjustGuide();
};

const closeNewMemerGuide = () => {
  store.regSuccessGuideVisible = false;
}

onMounted(() => {
  window.addEventListener("resize", debounce((e) => {
    if(step.value && store.regSuccessGuideVisible) {
      adjustGuide();
    }
  }, 1000));
})
</script>

<style lang="scss">
.new-member-guide-dialog {
  background: #252525d9;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99999999999;
  display:flex;
  align-items: center;
  justify-content: center;
}

.step1-container,
.step2-container,
.step3-container,
.step4-container,
.step5-container,
.step6-container {
  position: relative;
  width: 350px;

  .step-bg {
    width: 100%;
  }

  .flag {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 195px;
  }

  .content {
    position: absolute;
    bottom: 75px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 200px;
    gap: 16px;
    font-family: 'FZZBHJW';

    .title {
      color: #3aefff;
      font-size: 32px;
      text-align: center;
      white-space: nowrap;
    }

    .subtitle {
      font-size: 20px;
      color: white;
      text-align: center;

      span {
        color: #3AEFFF;
      }
    }

    .page-count {
      font-size: 20px;
      color: #3aefff;
      text-align: center;
      font-family: sans-serif;
    }

    .next-button {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
      font-size: 20px;
      width: 140px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8px;
      cursor: pointer;
    }
  }

  .arrow {
    position: absolute;
    left: 10%;
    top: -10%;
  }
}

.step2-container {
  .step2-img {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    position: fixed;
    visibility: hidden;
  }
}

.step3-container {
  .flag {
    left: -60px;
    width: 130px;
  }

  .arrow {
    top: -10%;
    right: 15%;
    left: unset;
  }

  .step3-img {
    position: fixed;
    display: flex;
    justify-content: end;
    visibility: hidden;
  }
}

.step4-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 7%;

  .arrow {
    right: -50%;
    bottom: 10%;
    left: unset;
    top: unset;
  }

  .step4-img {
    position: fixed;
    visibility: hidden;
  }
}

.step5-container {
  left: 10%;
  top: -5%;

  .content {
    bottom: 100px;
  }

  .step5-img {
    position: fixed;
    visibility: hidden;
  }
}

.step6-container {
  top: -5%;

  .step6-img1, .step6-img2 {
    position: fixed;
    visibility: hidden;
  }
}
</style>

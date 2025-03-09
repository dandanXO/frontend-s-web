<template>
  <div class="new-member-guide-dialog" :show-close="false">
    <div class="step1-container" v-if="step === 1">
      <img class="step-bg" src="../../assets/images/home/guide/step-bg.png" alt="" />
      <img src="../../assets/images/home/guide/step1-flag.png" alt="" class="flag" />
      <div class="content">
        <div>
          <div class="title">恭喜您</div>
          <div class="subtitle q-mt-sm">兴發账号创建成功~</div>
        </div>
        <div>
          <img src="../../assets/images/home/guide/step1-arrow.png" alt="" style="height: 54px" />
        </div>
        <div class="description">点击跟随新用户小指南</div>

        <div class="next-button" @click="handleNext(2)">好的</div>
      </div>
    </div>

    <div class="step2-container" v-else-if="step === 2">
      <div class="step2-img">
        <img src="../../assets/images/home/guide/step2-img.png" alt="" />
      </div>
      <img class="step-bg" src="../../assets/images/home/guide/step-bg.png" alt="" />
      <img src="../../assets/images/home/guide/step2-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="subtitle q-mt-md">
          <div>
            电竞/体育/真人/棋牌
            <br />
            电子/小游戏/彩票/捕鱼
          </div>
        </div>
        <div class="description q-pb-md">一目了然 轻松娱乐</div>
        <div class="step-txt">1/4</div>

        <div class="next-button" @click="handleNext(3)">好的</div>
      </div>
    </div>
    <div class="step3-container" v-else-if="step === 3">
      <div class="step3-img">
        <img src="../../assets/images/home/guide/step3-img1.png" alt="" />
      </div>
      <img class="step-bg" src="../../assets/images/home/guide/step-bg.png" alt="" />
      <img src="../../assets/images/home/guide/step3-flag.png" alt="" class="flag" />
      <div class="content">
        <div>
          <div class="subtitle q-mt-lg" style="font-size: 20px">各种优惠红包彩金</div>
        </div>
        <div class="description">现金红包拿到手软 轻松娱乐</div>

        <div class="step-txt">2/4</div>
        <div class="next-button" @click="handleNext(4)">好的</div>
      </div>
    </div>
    <div class="step4-container" v-else-if="step === 4">
      <div style="position: relative">
        <img class="step-bg" src="../../assets/images/home/guide/step-bg.png" alt="" />
        <div class="content">
          <div class="subtitle q-mt-xl" style="font-size: 20px">点击这里</div>
          <div class="description q-pb-xs">到个人中心</div>
          <div class="step-txt">3/4</div>
          <div class="next-button" @click="handleNext(5)">好的</div>
        </div>
      </div>

      <img src="../../assets/images/home/guide/step4-img.png" alt="" class="step4-img" />
    </div>
    <div class="step5-container" v-else-if="step === 5">
      <div class="step5-img">
        <img src="../../assets/images/home/guide/step5-img1.png" alt="" />
      </div>
      <img class="step-bg" src="../../assets/images/home/guide/step-bg.png" alt="" width="100%" />
      <div class="content">
        <div></div>
        <div class="title">点击这里充值</div>
        <div class="description q-pb-xs">开启您的兴發游戏之旅</div>
        <div class="step-txt">4/4</div>
        <div class="next-button" @click="closeNewMemerGuide">好的</div>

        <!-- <div class="btm-info" @click="goToPromo">点击前往新人活动</div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import debounce from "lodash/debounce";

const store = userStore();
const step = ref(1);
const router = useRouter();

const props = defineProps(["openAppMenu", "closeAppMenu"]);

const adjustGuide = () => {
  const value = step.value;

  if (value === 2) {
    setTimeout(() => {
      const { x, y } = document.querySelector(".home-header-section").getBoundingClientRect();
      const step2img = document.querySelector(".step2-img");
      const menuBar = document.querySelector(".home-header-section");
      step2img.style.top = `calc(${y}px - 120px)`;
      step2img.style.left = "50%";
      step2img.style.transform = "translateX(-50%)";
      step2img.style.visibility = "visible";

      menuBar.style.opacity = "0";
    }, 500);
  } else if (value === 3) {
    setTimeout(() => {
      // const { x, y } = document.querySelector(".bottom-nav .q-tabs .q-tabs__content a.q-tab:(second nth child)").getBoundingClientRect();
      const { x, y } = document
        .querySelector(".bottom-nav .q-tabs .q-tabs__content a.q-tab:nth-child(2)")
        .getBoundingClientRect();
      const promoNav = document.querySelector(".bottom-nav .q-tabs .q-tabs__content a.q-tab:nth-child(2)");
      promoNav.style.visibility = "hidden";

      const step3img = document.querySelector(".step3-img");
      step3img.style.bottom = `10px`;
      step3img.style.left = `calc(${x}px - 0)`;
      step3img.style.visibility = "visible";

      const menuBar = document.querySelector(".home-header-section");
      menuBar.style.opacity = "1";
    }, 500);
  } else if (value === 4) {
    setTimeout(() => {
      const { x, y } = document
        .querySelector(".bottom-nav .q-tabs .q-tabs__content a.q-tab:nth-child(3)")
        .getBoundingClientRect();
      const step4img = document.querySelector(".step4-img");
      step4img.style.bottom = `8px`;
      // step4img.style.left = `calc(${x}px - 0)`;
      step4img.style.left = "50%";
      step4img.style.transform = "translateX(-50%)";
      step4img.style.visibility = "visible";

      const promoNav = document.querySelector(".bottom-nav .q-tabs .q-tabs__content a.q-tab:nth-child(2)");
      promoNav.style.visibility = "visible";
    }, 500);
  } else if (value === 5) {
    router.push("/account");

    setTimeout(() => {
      const { x, y } = document.querySelector(".acc-btns-container .q-btn:first-child").getBoundingClientRect();
      const step5img = document.querySelector(".step5-img");
      step5img.style.top = `calc(${y}px - 5px)`;
      step5img.style.right = `calc(${x}px - 36px)`;
      step5img.style.visibility = "visible";

      const depositBtn = document.querySelector(".acc-btns-container .q-btn:first-child");
      depositBtn.style.visibility = "hidden";
    }, 1000);
  } else {
    const depositBtn = document.querySelector(".acc-btns-container .q-btn:first-child");
    depositBtn.style.visibility = "visible";
  }
};

const goToPromo = () => {
  router.push("/promotion?name=xf-official-gift");
  closeNewMemerGuide();
};

const handleNext = (value) => {
  step.value = value;
  adjustGuide();
};

const closeNewMemerGuide = () => {
  store.regSuccessGuideVisible = false;
};

onMounted(() => {
  window.addEventListener(
    "resize",
    debounce((e) => {
      if (step.value && store.regSuccessGuideVisible) {
        adjustGuide();
      }
    }, 1000)
  );
});


</script>

<style lang="scss">
.new-member-guide-dialog {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: FZZhanBiHei-M22S;
  font-size: 16.93px;
  font-weight: 400;
  line-height: 19.25px;
  text-align: center;
  overflow-y: hidden;
}

.step1-container,
.step2-container,
.step3-container,
.step4-container,
.step5-container,
.step6-container {
  position: relative;

  .step-bg {
    width: 240px;
  }

  .flag {
    position: absolute;
    top: 2px;
    right: -10px;
    width: 75px;
  }

  .content {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 240px;
    gap: 5px;
    height: 100%;
    padding: 56px 36px 68px 36px;
    .title,
    .subtitle {
      color: #3aefff;
      font-size: 24px;
      text-align: center;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 16px;
    }

    .description {
      font-size: 12px;
      color: white;
      text-align: center;
      flex: 1;
      align-content: center;
    }

    .step-txt {
      color: #3aefff;
      font-size: 12px;
    }

    .btm-info {
      text-decoration: underline;
      cursor: pointer;
      font-size: 14px;
      color: white;
    }

    .next-button {
      background: linear-gradient(180deg, rgba(0, 199, 192, 1) 0%, rgba(9, 150, 199, 1) 100%);
      color: white;
      font-size: 16px;
      border-radius: 10px;
      width: 100px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .arrow {
    position: absolute;
    left: 10%;
    top: -10%;
  }
}

.step1-container {
  .flag {
    width: 100px;
    top: -6px;
    right: -20px;
  }
}
.step2-container {
  // margin-top:-150px;
  margin-top: -200px;
  .step2-img {
    width: 100%;
    // height: 90px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    position: fixed;
    visibility: hidden;

    img {
      display: block;
      width: 100%;
      margin: 0 auto;
      max-width: 468px;
    }
  }
}

.step3-container {
  .flag {
    left: -26px;
    top: -32px;
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

    img {
      display: block;
      width: 100%;
      max-width: 250px;
    }
  }

  .subtitle {
    font-size: 20px;
  }
}

.step4-container {
  display: flex;
  align-items: center;
  width: auto;
  position: absolute;

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
  .step5-img {
    position: fixed;
    visibility: hidden;
  }
  .content {
    padding-bottom: 54px;
  }
  .title {
    font-size: 20px !important;
    margin-top: 40px;
  }
  .description {
    align-content: start;
  }
}
</style>

<template>
  <el-dialog class="new-member-guide-dialog" :show-close="false" v-model="store.regSuccessGuideVisible">
    <div class="step1-container" v-if="step === 1">
      <img src="../../assets/home/guide/step-bg.png" alt="" />
      <img src="../../assets/home/guide/step1-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="title">
          <div style="font-size: 48px">恭喜您</div>
          <div>雷火账号创建成功~</div>
        </div>
        <div>
          <img src="../../assets/home/guide/step1-arrow.png" alt="" />
        </div>
        <div class="subtitle">点击跟随新用户小指南</div>

        <div class="next-button" @click="handleNext(2)">好的</div>
      </div>
    </div>

    <div class="step2-container" v-else-if="step === 2">
      <div class="step2-img">
        <img src="../../assets/home/guide/step2-img.png" alt="" />
      </div>
      <img src="../../assets/home/guide/step2-arrow.png" alt="" class="arrow" />
      <img src="../../assets/home/guide/step-bg.png" alt="" />
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

        <div class="next-button" @click="handleNext(3)">下一个</div>
      </div>
    </div>
    <div class="step3-container" v-else-if="step === 3">
      <div class="step3-img">
        <div class="image-wrapper">
          <img src="../../assets/home/guide/step3-img1.png" alt="" />
        </div>
      </div>
      <img src="../../assets/home/guide/step3-arrow.png" alt="" class="arrow" />
      <img src="../../assets/home/guide/step-bg.png" alt="" />
      <img src="../../assets/home/guide/step3-flag.png" alt="" class="flag" />
      <div class="content">
        <div class="title">
          <div style="font-size: 48px">各种优惠红包彩金</div>
        </div>
        <div class="subtitle">现金红包拿到手软 轻松娱乐</div>

        <div class="next-button" @click="handleNext(4)">下一个</div>
      </div>
    </div>
    <div class="step4-container" v-else-if="step === 4">
      <div style="position: relative">
        <img src="../../assets/home/guide/step4-arrow.png" alt="" class="arrow" />
        <img src="../../assets/home/guide/step-bg.png" alt="" />
        <div class="content">
          <div class="title">
            <div style="font-size: 48px">
              扫码下载雷火 APP
              <br />
              APP 嗨翻周末夜
            </div>
          </div>
          <div class="subtitle">周六周日准时开启红包雨</div>

          <div class="next-button" @click="handleNext(5)">下一个</div>
        </div>
      </div>

      <img src="../../assets/home/guide/step4-img.png" alt="" class="step4-img" />
    </div>
    <div class="step5-container" v-else-if="step === 5">
      <div class="step5-img">
        <div class="image-wrapper">
          <img class="avatar" src="../../assets/home/guide/step5-img1.png" alt="" />
        </div>
      </div>
      <img src="../../assets/home/guide/step5-arrow.png" alt="" class="arrow" />
      <img src="../../assets/home/guide/step-bg.png" alt="" width="100%" />
      <div class="content">
        <div class="title">
          <div style="font-size: 48px">点击这里</div>
        </div>
        <div class="subtitle">到个人中心</div>

        <div class="next-button" @click="handleNext(6)">下一个</div>
      </div>
    </div>
    <div class="step6-container" v-else-if="step === 6">
      <div class="arrow1-wrapper">
        <div class="step6-img">
          <div class="image-wrapper">
            <img src="../../assets/home/guide/step6-img1.png" alt="" />
          </div>
        </div>
        <img src="../../assets/home/guide/step6-arrow1.png" alt="" class="arrow1" />
      </div>
      <div class="arrow2-wrapper">
        <img src="../../assets/home/guide/step6-arrow2.png" alt="" class="arrow2" />
        <div class="confirm-btn">
          <div class="confirm-btn-content">确定</div>
        </div>
      </div>

      <img src="../../assets/home/guide/step-bg.png" alt="" width="100%" />
      <div class="content">
        <div class="title">
          <div style="font-size: 48px">点击这里充值</div>
          <div>开启您的雷火游戏之旅</div>
        </div>

        <div class="next-button" @click="closeNewMemerGuide">知道了</div>

        <div class="subtitle" style="text-decoration: underline">点击前往新人活动</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { userStore } from "@/store";
import { useRouter } from 'vue-router';

const store = userStore();
const step = ref(1);
const router = useRouter();

const props = defineProps(['openAppMenu', 'closeAppMenu']);

const handleNext = (value) => {
  console.log(value);
  step.value = value;

  if(value === 4) {
    props?.openAppMenu();
  } else if(value === 5) {
    props?.closeAppMenu();
  } else if(value === 6) {
    router.push('/center/personal');
  }
};

const closeNewMemerGuide = () => {
  store.regSuccessGuideVisible = false;
}
</script>

<style lang="scss">
.new-member-guide-dialog {
  background: transparent !important;
  display: flex;
  justify-content: center;

  .el-dialog__header {
    background: none;
  }

  .el-dialog__body {
    padding: 0 !important;
  }
}

.step1-container,
.step2-container,
.step3-container,
.step4-container,
.step5-container,
.step6-container {
  position: relative;
  width: 464px;

  .flag {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 195px;
  }

  .content {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 240px;
    gap: 16px;

    .title {
      color: #3aefff;
      font-size: 32px;
      text-align: center;
      white-space: nowrap;
    }

    .subtitle {
      font-size: 24px;
      color: white;
      text-align: center;
    }

    .next-button {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
      font-size: 32px;
      border-radius: 10px;
      width: 186px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 12px;
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
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: -10%;
  }
}

.step3-container {
  .flag {
    left: -100px;
  }

  .arrow {
    top: -10%;
    right: 15%;
    left: unset;
  }

  .step3-img {
    position: fixed;
    width: 500px;
    height: 90px;
    top: 0;
    right: 43%;
    display: flex;
    justify-content: end;

    .image-wrapper {
      background: url("../../assets/home/guide/step3-img2.png") center no-repeat;
      background-size: contain;
      width: 82px;
      height: 82px;
      display: flex;
      justify-content: center;
      padding: 10px;
      align-items: center;
    }
  }
}

.step4-container {
  display: flex;
  align-items: center;
  gap: 200px;
  width: auto;
  position: absolute;
  left: -15%;

  .arrow {
    right: -50%;
    bottom: 10%;
    left: unset;
    top: unset;
  }

  .step4-img {
    width: 288px;
    height: 288px;
    margin-bottom: 15%;
  }
}

.step5-container {
  left: 10%;
  top: -5%;
  width: 409px;

  .step5-img {
    position: fixed;
    width: 500px;
    height: 90px;
    top: 0.2%;
    right: 21%;
    display: flex;
    justify-content: end;

    .image-wrapper {
      background: url("../../assets/home/guide/step5-img2.png") center no-repeat;
      background-size: contain;
      width: 125px;
      height: 125px;
      display: flex;
      justify-content: center;
      padding: 10px;
      align-items: center;

      .avatar {
        width:100px;
        height:100px;
      }
    }
  }

  .arrow {
    right: -55%;
    left: unset;
    top: -5%;
  }
}

.step6-container {
  width: 376px;
  left: -50%;
  bottom: -30%;

  .image-wrapper {
    background: url("../../assets/home/guide/step6-img2.png") center no-repeat;
    background-size: contain;
    width: 82px;
    height: 82px;
    display: flex;
    justify-content: center;
    padding: 10px;
    align-items: center;
  }

  .arrow1-wrapper {
    position: absolute;
    top: 0%;
    left: -85%;

    .step6-img {
      display: inline-flex;
    }

    .arrow1 {
      top: 90px;
      position: relative;
    }
  }

  .arrow2-wrapper {
    position: absolute;
    display: flex;
    right: -70%;
    top: 35%;

    .arrow2 {
      position: relative;
    }

    .confirm-btn {
      width: 209px;
      height: 58px;
      background: url('../../assets/home/guide/step6-confirm-btn-bg.png') no-repeat;
      background-size: contain;
      padding: 8px;
      position: relative;
      top: 40px;

      .confirm-btn-content {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 8px white solid;
        color: white;
      }
    }
  }
}
</style>

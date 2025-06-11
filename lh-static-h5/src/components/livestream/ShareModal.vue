<template>
  <q-dialog v-model="model" @hide="handleModalClose">
    <div class="share-modal-outer-wrapper">
      <div class="share-modal-wrapper">
        <div class="share-modal-content-wrapper">
          <template v-if="!isShareCopied">
            <router-link v-for="(step, index) in steps" :key="index" :to="step.redirect">
              <button class="share-modal-step-button" :data-step-ideographic="`第${stepIdeographic[index]}步`">
                <div class="share-modal-step-button__placeholder" />
                <img :src="step.text" alt="Step Text" class="share-modal-step-button__text" />
                <img :src="step.icon" alt="Step Icon" class="share-modal-step-button__icon" />
              </button>
            </router-link>
          </template>
          <template v-else>
            <img class="share-modal-copy-success" src="../../assets/images/livestream/share/check.png" />
            <p class="share-modal-copy-success-text">
              <span class="title">复制成功</span>
              <br />
              <span>赶快分享给好友吧！</span>
            </p>
          </template>
        </div>

        <q-btn v-if="!isShareCopied" class="share-modal-bottom-button" flat @click="copyUrl">
          复制地址，分享给朋友
        </q-btn>
        <q-btn v-else v-close-popup class="share-modal-bottom-button" flat>我已知晓</q-btn>
      </div>
      <div class="share-modal-close-btn">
        <img v-close-popup src="../../assets/images/livestream/share/icon-close.png" />
      </div>
    </div>
    <div class="share-modal-decorator" />
  </q-dialog>
</template>
<script setup>
import TextImg1 from "../../assets/images/livestream/share/text-1.png";
import TextImg2 from "../../assets/images/livestream/share/text-2.png";
import TextImg3 from "../../assets/images/livestream/share/text-3.png";
import IconImg1 from "../../assets/images/livestream/share/icon-1.png";
import IconImg2 from "../../assets/images/livestream/share/icon-2.png";
import IconImg3 from "../../assets/images/livestream/share/icon-3.png";
import { useNotify } from "src/hooks/notify";
import { ref } from "vue";

const props = defineProps(["url"]);

const model = defineModel({
  type: Boolean,
  default: false
});

const notify = useNotify();

const stepIdeographic = ["一", "二", "三"];

const steps = [
  {
    text: TextImg1,
    icon: IconImg1
    // redirect: "/register"
  },
  {
    text: TextImg2,
    icon: IconImg2
    // redirect: "/deposit"
  },
  {
    text: TextImg3,
    icon: IconImg3
    // redirect: "/account/invite"
  }
];

const isShareCopied = ref(false);

const copyUrl = async () => {
  if (props.url) {
    try {
      await navigator.clipboard.writeText(props.url);
      isShareCopied.value = true;
      // notify({
      //   message: "复制成功",
      //   type: "info",
      //   duration: 2000
      // });
    } catch (err) {
      console.error("Failed to copy:", err);
      isShareCopied.value = false;
      notify({
        message: "复制失败",
        type: "error"
      });
    }
  }
};

const handleModalClose = () => {
  if (isShareCopied.value) {
    isShareCopied.value = false;
  }
};
</script>
<style lang="scss" scoped>
.share-modal-outer-wrapper {
  position: relative;

  .share-modal-wrapper {
    position: relative;
    width: 80vw;
    max-width: 300px;
    background: url("../../assets/images/livestream/share/bg.png") no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 300 / 467;

    .share-modal-content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 60% 16px 0;

      .share-modal-step-button {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        padding: 6px 0;
        position: relative;
        background-color: #f7f8fb;
        border-radius: 10px;
        border: none;
        box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;

        &::before {
          content: attr(data-step-ideographic);
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(96.28deg, #fc7e08 0.15%, #ffb700 88.42%);
          border-top-left-radius: 10px;
          border-bottom-right-radius: 10px;
          padding: 3px 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #4f3800;
          letter-spacing: 0.88px;
        }

        .share-modal-step-button__placeholder {
          width: 66px;
          max-width: 24%;
        }

        .share-modal-step-button__text {
          max-width: 33%;
        }
        .share-modal-step-button__icon {
          width: 66px;
          max-width: 24%;
        }
      }

      .share-modal-copy-success {
        max-width: 60%;
      }

      .share-modal-copy-success-text {
        font-size: 1rem;
        color: #424f72;
        text-align: center;
        .title {
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 14px;
        }
      }
    }

    .share-modal-bottom-button {
      position: absolute;
      bottom: 16px;
      width: max-content;
      left: 50%;
      transform: translateX(-50%);
      background: url("../../assets/images/livestream/share/button-bg.png") no-repeat center center;
      background-size: 100% 100%;
      margin: 0 auto;
      padding: 11px 40px;
      color: #fff;
      font-size: 0.9rem;
    }
  }
  .share-modal-close-btn {
    display: flex;
    justify-content: center;
    margin-top: 18px;
    img {
      max-width: 32px;
    }
  }
}

.share-modal-decorator {
  position: fixed;
  background: url("../../assets/images/livestream/share/bg-decorator.png") no-repeat center center;
  background-size: 100% 100%;
  aspect-ratio: 476 / 629;
  width: 80vw;
  max-width: 300px;
  z-index: -1;
  transform: translate(-33%, -50%);
}

.body--dark {
  .share-modal-outer-wrapper {
    .share-modal-wrapper {
      background-image: url("../../assets/images/livestream/share/bg-dark.png");

      .share-modal-content-wrapper {
        .share-modal-step-button {
          background-color: #323944;
          box-shadow: none;
          .share-modal-step-button__text {
            filter: brightness(0) invert(1);
          }
        }

        .share-modal-copy-success-text {
          color: #7f8da1;
          .title {
            color: #fff;
          }
        }
      }

      .share-modal-bottom-button {
        background-image: url("../../assets/images/livestream/share/button-bg-dark.png");
      }
    }
  }
}
</style>

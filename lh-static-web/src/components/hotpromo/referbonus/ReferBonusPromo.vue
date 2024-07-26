<template>
  <div class="refer-bonus-container">
    <div class="refer-bonus-wrapper">
      <HotPromotionNav :label="'携手宏图'"></HotPromotionNav>

      <div class="title">携手宏图</div>
      <div class="desc-wrapper">
        <div class="desc">
          本站用户打开:个人中心--点击“呼朋唤友”复制推广链接，通过QQ、微信、论坛、贴吧、直播间、微博等方式分享，成功邀请即可获得现金奖励!
        </div>
      </div>

      <div class="referral-info">
        <div class="bg">
          <div class="left">
            <img src="../../../assets/images/promotion/hotpromo/common/referral_people.png" />
            <div class="title">邀请注册</div>
          </div>
          <div class="right">
            <div class="desc">
              <span>0</span>
              人
            </div>
          </div>
        </div>

        <div class="bg">
          <div class="left">
            <img src="../../../assets/images/promotion/hotpromo/common/referral_fee.png" />
            <div class="title">获得邀请彩金</div>
          </div>
          <div class="right">
            <div class="desc">
              <span>0.00</span>
              元
            </div>
          </div>
        </div>
      </div>

      <div class="share-container">
        <div ref="qrRef" class="qr"><VueQrious :value="`${referralLink}`" /></div>
        <div class="share-link">
          <div class="copy" @click="copyLink()">复制分享链接</div>
          <div class="link">{{ referralLink }}</div>
        </div>
        <div class="dl-qr-btn" @click="downloadQRCode()">下载分享二维码</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import HotPromotionNav from "@/components/HotPromotionNav.vue";
import VueQrious from "vue-qrious";
import { getReferralLink } from "@/api/personal/share";
import { useNotify } from "@/hooks/notify";
const notify = useNotify();

const referralLink = ref("referralLink");
const getReferral = () => {
  getReferralLink()
    .then((res) => {
      if (res.code === 0) referralLink.value = "https://" + location.hostname + `/refer/${res.data}`;
      else notify.error(res.message)
    })
    .catch((err) => {
      console.log(err);
    });
};

const copyLink = () => {
  navigator.clipboard.writeText(referralLink.value);

  notify({
    message: `复制成功`,
    type: "success"
  });
};

const qrRef = ref();
const downloadQRCode = () => {
  const link = window.document.createElement("a");
  link.href = qrRef.value.firstChild.src;
  link.download = "app";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  getReferral();
});
</script>

<style scoped lang="scss">
.refer-bonus-container {
  font-size: 14px;
  color: #596281;
  line-height: 26px;

  .refer-bonus-wrapper {
    width: 1075px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;

    .title {
      font-size: 2rem;
      color: #3f8cff;
      font-weight: bold;
      margin-left: 10px;
      text-align: center;
    }

    .desc-wrapper {
      margin: 0 0 20px 0;

      .desc {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: normal;
        text-align: center;
      }
    }

    .referral-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;

      .bg {
        width: 50%;
        background: url("../../../assets/images/promotion/hotpromo/common/btn_mask.png");
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 25px;
        border-radius: 1.25rem;
        background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

        .left {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          .title {
            color: #7a8eb9;
            font-size: 1.5rem;
            font-weight: 700;
          }
        }

        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          .desc {
            color: #7a8eb9;
            font-size: 1.5rem;
            font-weight: 700;

            span {
              color: #424f72;
            }
          }
        }

        img {
          width: 75px;
        }
      }
    }

    .share-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px;
      border-radius: 1.25rem;
      background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
      box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

      .share-link {
        position: relative;
        font-size: 1rem;

        .copy {
          border-radius: 6.25rem;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
          width: 700px;
          text-align: right;
          color: white;
          font-weight: 600;
          padding: 10px 15px;
          cursor: pointer;
        }

        .link {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 6.25rem;
          background: linear-gradient(180deg, #fff 0%, #fff 100%);
          box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
          width: 550px;
          font-weight: 400;
          color: #7a8eb9;
          padding: 10px 15px;
        }
      }

      .dl-qr-btn {
        padding: 10px 15px;
        color: #3f8cff;
        border-radius: 6.25rem;
        background: linear-gradient(180deg, #fff 0%, #fff 100%);
        box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
        text-align: center;
        font-size: 1rem;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: normal;
        cursor: pointer;
      }
    }
  }
}
</style>

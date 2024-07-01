<template>
  <div class="share-container">
    <div class="personal-content-box">
      <div class="personal-title-box">推广分享</div>
      <div class="title-top-line1">
        <div class="top-line1-content">
          您通过推广链接邀请的用户注册并存款，您将获得最高累计
          <span class="prize-span">2,000</span>
          元的奖励。
        </div>
      </div>
      <div class="title-top-line2">
        <div class="share-link-section">
          <span class="span-text">推广链接</span>
          <div class="share-link-div">
            <a :href="selfTgurl" target="_blank" id="selfTgurl">{{ selfTgurl }}</a>
            <button class="mui-btn-primary copy-btn" @click="copyText(selfTgurl)">复制</button>
          </div>
        </div>
      </div>

      <div class="share-qr-section">
        <div class="flex-c-c-center">
          <div style="width: 100%">
            <span class="span-text">推广二维码</span>
          </div>
          <div class="share-qr-div">
            <VueQRCodeComponent size="200" id="qr-code" :text="qrCode" />

            <div class="share-info-div">
              <div class="share-info-box">
                <div class="user-sign-bg">
                  <svg class="user-sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"
                      fill="rgba(99,139,240,1)"
                    />
                  </svg>
                </div>

                <span>累计注册</span>
                <div class="total-info-div">
                  <span class="total-span" id="total-signup-no">{{ totalSignUp }}</span>
                  人
                </div>
              </div>

              <div class="share-info-box">
                <svg class="money-sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="75" height="75">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9v-1h3v-2h-2.586l2.122-2.121-1.415-1.415L12 8.586 9.879 6.464 8.464 7.88 10.586 10H8v2h3v1H8v2h3v2h2v-2h3v-2h-3z"
                    fill="rgba(70,106,235,1)"
                  />
                </svg>

                <span>累计充值</span>
                <div class="total-info-div">
                  <span class="total-span" id="total-topup-no">{{ totalTopUp }}</span>
                  人
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {computed, defineComponent, onMounted, ref} from "vue";
import VueQRCodeComponent from 'vue-qrcode-component'
import {userStore} from "src/stores";
import {Platform, useQuasar} from "quasar";
import {api} from "boot/axios"
import {isAndroid} from "boot/utils";

export default defineComponent({
  name: "ShareView",
  components: {
    VueQRCodeComponent
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const selfTgurl = ref("");
    const qrCode = computed(() => {
      return selfTgurl.value;
    });

    const copyText = (text) => {
      copyToClipboard(text);
      setTimeout(() => {
        $q.notify({
          color: "positive",
          position: "top",
          message: "复制成功！",
          icon: "check_circle_outline"
        });
      }, 100)

    }

    async function copyToClipboard(textToCopy) {
      // alert(window.isSecureContext);
      // alert(navigator.clipboard);
      // alert(Platform.is.chrome);
      // Navigator clipboard api needs a secure context (https)
      // else if (navigator.clipboard && Platform.is.chrome) {
      //     await navigator.clipboard.writeText(textToCopy);
      //   }

      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (error) {
        console.error(error);
      } finally {
        document.body.removeChild(textArea);
        // textArea.remove();
      }
    }

    const totalSignUp = ref(0)
    const totalTopUp = ref(0)

    const getReferral = () => {
      api.get('/session/member/referralCode').then(async (res) => {
        if(isAndroid()) {
          const appDownloadUrl = await store.getAppDownloadUrl();
          const appReferralLinkBaseURL = appDownloadUrl.replace('.app', '.com');
          const appReferralLink = `${appReferralLinkBaseURL}/refer/${res.data}`;
          selfTgurl.value = appReferralLink;
          return;
        }

        selfTgurl.value = `${window.location.origin}/refer/${res.data}`;
      }).catch((err) => {
      })

      api.get("/session/referred/count").then((res) => {
        console.log(res)
        if(res.code === 0){
          totalSignUp.value = res.data.referredMember;
          totalTopUp.value = res.data.depositMember;
        }

      })
    };

    onMounted(() => {
      getReferral();
    });

    return {
      selfTgurl,
      qrCode,
      copyText,
      totalSignUp,
      totalTopUp
    }
  }
});
</script>
<style lang="scss">
.share-container {
  background: #fff;
}

.personal-content-box {
  margin-top: 0px;
  padding: 20px 20px 100px;
  color: #2a2a2a;
}

.personal-content-box .title-top-line1 {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: baseline;
  padding-bottom: 30px;
}

.personal-content-box .prize-span {
  color: #32afda;
  font-size: 20px;
}

.personal-content-box .top-line1-content {
  line-height: 26px;
  text-align: left;
  font-size: 16px;
}

.personal-content-box .activity-info-div {
  color: #32afda;
  cursor: pointer;
}

.personal-content-box .activity-info-div:hover {
  opacity: 0.8;
}

.personal-content-box .activity-info-div:active {
  opacity: 0.7;
}

.personal-content-box .title-top-line2 {
  margin-top: 6px;
  padding-bottom: 30px;
}

.personal-content-box .share-qr-section {
  padding-top: 10px;
}

.share-qr-section .flex-c-c-center {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
}

.share-qr-section .share-qr-div {
}

.share-qr-section .qr-code-img {
  width: 180px;
  height: 180px;
  cursor: pointer;
}

.share-qr-section .share-info-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  gap: 15px;
}

.share-qr-section .share-info-box {
  width: 140px;
  height: 80px;
  background-image: linear-gradient(-37deg, #597ceb 0%, #83bcfe 100%), linear-gradient(#ffffff, #ffffff);
  background-blend-mode: normal, normal;
  border-radius: 10px;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
  padding-bottom: 10px;
  padding-left: 14px;
  padding-top: 6px;
}

.share-qr-section .share-info-box .user-sign-bg {
  position: absolute;
  text-align: center;
  display: flex;
  align-items: center;
  right: 9px;
  top: 8px;

  z-index: 1;
  width: 65px;
  height: 65px;
  background: #466aeb;
  justify-content: center;
  border-radius: 50%;
}

.share-qr-section .share-info-box .user-sign {
  width: 46px;
  height: 46px;
  font-size: 46px !important;
  line-height: 46px;
  border-radius: 50%;

  color: #638bf0;
  background: #466aeb;
}

.share-qr-section .share-info-box .money-sign {
  font-size: 75px !important;
  background: transparent;
  width: 75px;
  color: #466aeb;
  right: 3px;
  top: 2px;
  position: absolute;
}

.share-qr-section .share-qr-div {
  text-align: center;
}

.personal-content-box .span-text {
  font-size: 20px;
  font-weight: 600;
}

.personal-content-box a {
  font-size: 14px;
  display: block;
  padding: 0px 5px;
  margin-bottom: 0px;
  line-height: 48px;
  border-radius: 4px;
  overflow: hidden;
  // border: 1px solid #aaa;
  background: #f2f2f2;
  flex: 1;
  height: 48px;
  color: #000;
  text-decoration: none;
}

.share-link-div .copy-btn {
  font-size: 14px;
  color: #fff;
  width: 60px;
  height: 48px;
  background-image: linear-gradient(180deg, #52acff 0%, #3559da 100%);
  background-blend-mode: normal, normal;
  border-radius: 4px;
  border: 0px;
  letter-spacing: 2px;
}

.share-link-div .copy-btn:hover {
  transition: 0.1ms;
  opacity: 0.8;
}

.share-link-div .copy-btn:active {
  transition: 0.1ms;
  opacity: 0.7;
}

#qr-code {
  text-align: center;

  img {
    margin: 0 auto;
  }
}

.personal-content-box .share-link-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;
  flex-direction: column;
}

.personal-content-box .share-link-div {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;
}

.share-info-box > span {
  color: #fff;
  font-size: 16px;
  position: absolute;
  top: 14px;
  z-index: 3;
}

.share-info-box > span {
  color: #fff;
  font-size: 14px;
}

.share-info-box .total-info-div {
  font-size: 14px;
  color: #fff;
  text-align: left;
}

.share-info-box .total-span {
  font-size: 24px;
  color: #fff;
  padding-right: 4px;
  font-weight: 700;
}

.personal-content-box .personal-title-box {
  width: 100%;
  padding-bottom: 10px;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
}
</style>

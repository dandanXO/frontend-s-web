<template>
  <q-page class="share-container">
    <div class="personal-content-box">
      <div class="shadow-box grad">
        <div class="qr-title">推广分享</div>
        <div class="title-top-line1">
          <div class="top-line1-content">
            您通过推广链接邀请的用户注册并存款，您将获得最高累计
            <span class="prize-span">2,000</span>
            元的奖励。<router-link to="/promo?name=lh1-invite">活动详情</router-link>
          </div>
        </div>
      </div>

      <div class="shadow-box">
        <div class="title-top-line2">
          <div class="share-link-section">
            <span class="qr-title">推广链接</span>
            <div class="share-link-div">
              <div id="selfTgurl">{{ selfTgurl }}</div>
              <q-btn class="copy-btn common-sm-btn" @click="copyText(selfTgurl)">复制</q-btn>
            </div>
          </div>
        </div>
        <div class="qr-title">推广二维码</div>
        <div class="share-qr-div">
          <VueQRCodeComponent size="200" id="qr-code" :text="qrCode" />
        </div>
      </div>

      <div class="share-qr-section">
        <div class="share-info-div">
          <div class="share-info-box">
            <img
              class="user-sign"
              :src="
                $q.dark.isActive
                  ? require('../../assets/images/account/share-total-dark.png')
                  : require('../../assets/images/account/share-total.png')
              "
            />

            <span>累计注册</span>
            <div class="total-info-div">
              <span class="total-span" id="total-signup-no">{{ refTotalRegister }}</span>
              人
            </div>
          </div>

          <div class="share-info-box">
            <img
              class="topup-sign"
              :src="
                $q.dark.isActive
                  ? require('../../assets/images/account/share-topup-dark.png')
                  : require('../../assets/images/account/share-topup.png')
              "
            />

            <span>累计充值</span>
            <div class="total-info-div">
              <span class="total-span" id="total-topup-no">{{ refTotalDeposit }}</span>
              人
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="personal-content-box">
      <div class="shadow-box grad" id="summon-share">
        <div class="qr-title">唤醒分享</div>
        <div class="title-top-line1">
          <div class="top-line1-content">
            您通过唤醒链接激活的老用户存款，双方都可获得不限量彩金。
            <router-link to="/promo?name=lh1-summon-event">活动详情</router-link>
          </div>
        </div>
      </div>

      <div class="shadow-box">
        <div class="title-top-line2">
          <div class="share-link-section">
            <span class="qr-title">唤醒链接</span>
            <div class="share-link-div">
              <div id="selfTgurl">{{ SummonQrCode }}</div>
              <q-btn class="copy-btn common-sm-btn" @click="copyText(SummonQrCode)">复制</q-btn>
            </div>
          </div>
        </div>
        <div class="qr-title">唤醒二维码</div>
        <div class="share-qr-div">
          <VueQRCodeComponent size="200" id="qr-code" :text="qrCode" />
        </div>
      </div>

      <div class="share-qr-section">
        <div class="share-info-div">
          <div class="share-info-box">
            <img
              class="user-sign"
              :src="
                $q.dark.isActive
                  ? require('../../assets/images/account/share-total-dark.png')
                  : require('../../assets/images/account/share-total.png')
              "
            />

            <span>成功唤醒</span>
            <div class="total-info-div">
              <span class="total-span" id="total-signup-no">{{ refTotalSummon }}</span>
              人
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="js">
import {computed, defineComponent, onActivated, onMounted, ref} from "vue";
import VueQRCodeComponent from 'vue-qrcode-component'
import {userStore} from "src/stores";
import {useQuasar, Platform, scroll} from "quasar";
import {api, eventapi} from "boot/axios"
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ShareView",
  components: {
    VueQRCodeComponent
  },
  setup() {
    const { getScrollTarget, setVerticalScrollPosition } = scroll;
    const route = useRoute();
    const $q = useQuasar();
    const store = userStore();
    const selfTgurl = ref("");
    const SummonUrl = ref("");

    const refCode = ref("");
    const refTotalRegister = ref("");
    const refTotalDeposit = ref("");
    const refTotalSummon = ref("");


    let tgDomain = location.origin;
    if (store.isApp() || window.location.pathname === "/invitefriend") {
      tgDomain = 'https://' + store.evip;
    }


    const qrCode = computed(() => {
      return selfTgurl.value;
    });

    const SummonQrCode = computed(() => {
      return SummonUrl.value;
    });

    function scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 0;
      setTimeout(() => {
        setVerticalScrollPosition(target, offset, duration)
      },150)
    }

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
      if (navigator.clipboard && window.isSecureContext && Platform.is.chrome) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
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
    }

    onMounted(() => {
      api.get("/session/member/referralCode").then((res) => {
        // console.log(reminderForm)
        if (res.code === 0) {
          refCode.value = res.data;
          selfTgurl.value = tgDomain + "/refer/" + refCode.value;
          SummonUrl.value = tgDomain + "/summon/" + refCode.value;
        }
      });

      api.get("/session/member/referStats").then((res) => {
        // console.log(reminderForm)
        if (res.code === 0) {
          refTotalRegister.value = res.data.totalRegister;
          refTotalDeposit.value = res.data.totalDeposit;
        }
      });

      eventapi.get("/member-summon/get-total-summon").then((res) => {
        // console.log(reminderForm)
        if (res.code === 0) {
          refTotalSummon.value = res.data;
        }
      });
    })

    onActivated(() => {
      const isSummon =  sessionStorage.getItem("GO_SUMMON");
      const isSummon2 =  localStorage.getItem("GO_SUMMON");
      // scroll to #summon-share section if route has hash pattern /account/invite#summon-share
      if(route.hash === '#summon-share' || isSummon || isSummon2) {
        sessionStorage.removeItem("GO_SUMMON")
        localStorage.removeItem("GO_SUMMON")
        scrollToElement(document.getElementById('summon-share'));
      }
    })

    return {
      selfTgurl,
      qrCode,
      refTotalRegister,
      refTotalDeposit,
      copyText,
      SummonUrl,
      SummonQrCode,
      refTotalSummon,
      store
    }
  }
});
</script>
<style lang="scss">
.share-container {
  .shadow-box {
    background: $white;
    border-radius: 10px;
    padding: 15px 12px 24px;
    box-shadow: $shadow-bg;
    margin-bottom: 15px;
    &.grad {
      background: linear-gradient(180deg, #4ad8fc, #3f9dff);
      color: #ffffff;
      .qr-title, .prize-span, .top-line1-content a {
        color: #ffffff;
      }
    }
  }

  .personal-content-box {
    width: $box-width;
    margin: 12px auto 30px;
    color: $font-1;

    .prize-span {
      color: $primary;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .top-line1-content {
      line-height: 26px;
      text-align: center;
      font-size: 16px;
      a {
        color: $primary;
        text-decoration: underline;
      }
    }

    .activity-info-div {
      color: $primary;
      cursor: pointer;
    }

    .activity-info-div:hover {
      opacity: 0.8;
    }

    .activity-info-div:active {
      opacity: 0.7;
    }

    .share-qr-section {
      padding-top: 10px;
    }
  }

  .qr-title {
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0px auto 10px;
    color: $font-2;
  }

  .personal-content-box .title-top-line1 {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: baseline;
    // padding-bottom: 30px;
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
    width: 100%;
    margin: 0px auto 10px;
    justify-content: center;
    gap: 20px;

    .share-info-box {
      width: 46%;
      height: 90px;
      background-color: $white;
      border-radius: 10px;
      position: relative;
      box-shadow: $shadow-bg;

      display: flex;
      flex-direction: column;
      gap: 5px;
      justify-content: flex-end;
      padding: 12px 15px 15px;
    }

    .user-sign {
      font-size: 75px !important;
      background: transparent;
      height: 60%;
      aspect-ratio: 1/1;
      color: #466aeb;
      right: 15px;
      top: 20%;
      position: absolute;
    }

    .topup-sign {
      font-size: 75px !important;
      background: transparent;
      height: 60%;
      aspect-ratio: 1/1;
      color: #466aeb;
      right: 15px;
      top: 20%;
      position: absolute;
    }

    .share-qr-div {
      text-align: center;
    }
  }

  .personal-content-box .span-text {
    font-size: 18px;
  }

  .copy-btn {
    margin-bottom: 15px;
  }

  .personal-content-box #selfTgurl {
    color: #458bff;
    font-size: 1rem;
    display: block;
    margin-bottom: 15px;
  }

  #qr-code {
    text-align: center;
    margin-bottom: 12px;

    img {
      margin: 0 auto;
    }
  }

  .personal-content-box .share-link-section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .personal-content-box .share-link-div {
    text-align: center;
    word-break: break-all;
  }

  .share-info-box > span {
    color: $font-1;
    font-size: 1rem;
    position: absolute;
    top: 10px;
    z-index: 3;
  }

  .share-info-box .total-info-div {
    font-size: 0.85rem;
    color: $primary;
    text-align: left;
  }

  .share-info-box .total-span {
    font-size: 1.5rem;
    color: $primary;
    padding-right: 4px;
    font-weight: bold;
  }

  .personal-content-box .personal-title-box {
    width: 100%;
    padding-bottom: 10px;
    text-align: center;
    font-size: 18px;
  }
}

.body--dark {
  .share-container {
    .shadow-box {
      @include content-block-dark-with-border;
      .qr-title {
        color: $font-3-dark;
      }
      .title-top-line1 {
        .prize-span,
        a {
          color: $primary-dark;
        }
      }
    }

    .share-qr-section {
      .share-info-div {
        .share-info-box {
          @include content-block-dark-with-border;
          .total-info-div {
            color: #999999;
            .total-span {
              color: unset;
            }
          }
        }
      }
    }
  }
}
</style>

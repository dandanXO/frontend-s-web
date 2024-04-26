<template>
  <q-page class="share-container">
    <div class="personal-content-box">
      <div class="qr-title">{{ $t("lang.share_invitefriends") }}</div>
      <div class="shadow-box">
        <div class="title-top-line1">
          <div id="selfTgurl">{{ selfTgurl }}</div>
          <q-btn @click="copyText(selfTgurl)" style="min-width: 110px">{{ $t("lang.share_copy") }}</q-btn>
        </div>
      </div>

      <div class="shadow-box-info">
        <table border="0" cellpadding="10" cellspacing="0" style="width: 100%">
          <tr class="box-header-row">
            <td v-html="$t('lang.share_table_header_01')" />
            <td v-html="$t('lang.share_table_header_02')" />
            <td v-html="$t('lang.share_table_header_03')" />
            <td v-html="$t('lang.share_table_header_04')" />
          </tr>
          <template v-if="referredData.length === 0">
            <tr class="box-content-row">
              <td colspan="4">
                <div>
                  <img
                    src="../../assets/images/common/empty-data.png"
                    style="display: block; width: 100px; margin: 20px auto 0"
                  />
                </div>
                {{ $t("lang.share_table_content_empty") }}
              </td>
            </tr>
          </template>

          <template v-else>
            <tr v-for="(item, i) in referredData" :key="i">
              <td>{{ item.loginName }}</td>
              <td>{{ item.regTime }}</td>
              <td>{{ item.totalBet }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </template>
        </table>
      </div>

      <div class="qr-title">{{ $t("lang.share_para_title") }}</div>
      <div class="share-tnc">
        <ol>
          <li v-html="$t('lang.share_tnc_para_01')" />
          <li v-html="$t('lang.share_tnc_para_02')" />
          <li v-html="$t('lang.share_tnc_para_03')" />
          <ol type="a">
            <li v-html="$t('lang.share_tnc_para_03_a')" />
            <ol type="i">
              <li v-html="$t('lang.share_tnc_para_03_a_i')" />
              <li v-html="$t('lang.share_tnc_para_03_a_ii')" />
            </ol>
            <li v-html="$t('lang.share_tnc_para_03_b')" />
            <ol type="i">
              <li v-html="$t('lang.share_tnc_para_03_b_i')" />
              <li v-html="$t('lang.share_tnc_para_03_b_ii')" />
              <li v-html="$t('lang.share_tnc_para_03_b_iii')" />
            </ol>
          </ol>
          <li v-html="$t('lang.share_tnc_para_04')" />
          <li v-html="$t('lang.share_tnc_para_05')" />
          <li v-html="$t('lang.share_tnc_para_06')" />
          <li v-html="$t('lang.share_tnc_para_07')" />
          <li v-html="$t('lang.share_tnc_para_08')" />
          <li v-html="$t('lang.share_tnc_para_09')" />
          <li v-html="$t('lang.share_tnc_para_10')" />
        </ol>
      </div>
    </div>
  </q-page>
</template>
<script lang="js">
import {computed, defineComponent, onMounted, ref} from "vue";
import VueQRCodeComponent from 'vue-qrcode-component'
import {userStore} from "src/stores";
import {useQuasar, Platform} from "quasar";
import {api} from "boot/axios"
import {Clipboard} from '@capacitor/clipboard';
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ShareView",
  components: {
    // VueQRCodeComponent
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const selfTgurl = ref("");
    const { t } = useI18n();
    const refCode = ref("");
    const refTotalRegister = ref("");
    const refTotalDeposit = ref("");


    let tgDomain = location.origin;
    if (store.isApp()) {
      tgDomain = 'https://' + store.evip;
    }


    const qrCode = computed(() => {
      return selfTgurl.value;
    });


    const copyText = (text) => {
      console.log("asdasdasd",text)
      copyToClipboard(text);
      setTimeout(() => {
        $q.notify({
          color: "positive",
          position: "top",
          message: t('lang.share_copy_success'),
          icon: "check_circle_outline"
        });
      }, 100)

    }

    async function copyToClipboard(textToCopy) {
      // alert(window.isSecureContext);
      // alert(navigator.clipboard);
      // alert(Platform.is.chrome);
      // Navigator clipboard api needs a secure context (https)
      if (store.getDeviceType() === 'ANDROID') {
        await Clipboard.write({
          string: textToCopy
        });
      } else if (navigator.clipboard && window.isSecureContext && Platform.is.chrome) {
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

    const referredData = ref([])

    onMounted(() => {
      api.get("/session/member/referralCode").then((res) => {
        // console.log(reminderForm)
        if (res.code === 0) {
          refCode.value = res.data;
          selfTgurl.value = tgDomain + "/refer/" + refCode.value;
        }
      });

      // api.get("/session/member/referStats").then((res) => {
      //   // console.log(reminderForm)
      //   if (res.code === 0) {
      //     refTotalRegister.value = res.data.totalRegister;
      //     refTotalDeposit.value = res.data.totalDeposit;
      //   }
      // });

      api.get("/session/vnm/referred").then((res) => {
        // console.log(reminderForm)
        if (res.code === 0) {
          referredData.value = res.data;
        }
      });


    })

    return {
      selfTgurl,
      qrCode,
      refTotalRegister,
      refTotalDeposit,
      copyText,
      referredData
    }
  }
});
</script>

<style lang="scss">
.share-container {
  .share-tnc {
    ol {
      padding-left: 20px;

      li {
        margin-bottom: 10px;
        color: #9aa8cb;
      }
    }
  }

  .shadow-box-info {
    background: $white;
    border-radius: 10px;
    box-shadow: $shadow-bg;
    margin-bottom: 15px;

    .box-header-row {
      background: #e7f3ff;

      td {
        font-weight: bold;
      }
    }

    .box-content-row {
      text-align: center;
      td {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    }
  }

  .shadow-box {
    background: $white;
    border-radius: 10px;
    padding: 12px;
    box-shadow: $shadow-bg;
    margin-bottom: 15px;
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
      // text-align: center;
      font-size: 16px;
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
    text-align: left;
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0px auto 10px;
    color: $font-2;
  }

  .personal-content-box .title-top-line1 {
    // margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
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
    justify-content: space-between;
    gap: 20px;

    .share-info-box {
      width: 46%;
      height: 100px;
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
      bottom: 10%;
      position: absolute;
    }

    .topup-sign {
      font-size: 75px !important;
      background: transparent;
      height: 60%;
      aspect-ratio: 1/1;
      color: #466aeb;
      right: 15px;
      bottom: 10%;
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
    color: $primary;
    font-size: 1.2rem;
    display: block;
    // margin-bottom: 15px;
    border: 1px solid #aaa;
    word-break: break-all;
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
    line-height: 1.3;
    width: 80%;
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
</style>

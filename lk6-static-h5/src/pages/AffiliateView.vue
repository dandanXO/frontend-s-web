<template>
  <div class="affiliate-container">
    <div class="page-title">
      <div class="page-title-img">
        <img v-if="languageVal !== 'en'" src="../assets/images/affiliate/title.png" />
        <img v-else src="../assets/images/affiliate/title-en.png" />
      </div>
    </div>
    <div class="page-title-text">
      <span class="page-title-text__stroke">{{ $t("affiliate.agentSupport") }}</span>
      <span class="page-title-text__fill">{{ $t("affiliate.agentSupport") }}</span>
    </div>
    <q-input
      style="width: 100%; opacity: 0; height: 5px; pointer-events: none"
      filled
      color="white"
      ref="copyinput"
      v-model="text_copied"
    />
    <div class="contact-list">
      <div v-for="(info, index) in contactInfo" :key="index" class="contact-item">
        <div class="contact-info">
          <img :src="require(`../assets/images/affiliate/${info.icon}`)" alt="Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">{{ info.label }}</span>
            <span class="contact-id ellipsis">{{ info.value }}</span>
          </div>
        </div>
        <div class="contact-actions">
          <button @click="copyText(info.value, info.label)" class="copy-button">{{ $t("btn.copy") }}</button>
          <a v-if="info.download" :href="info.download" target="_blank" class="download-button" rel="noopener">
            <img src="../assets/images/affiliate/download.svg" alt="download" />
          </a>
        </div>
      </div>
    </div>
    <div class="button-group">
      <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">
        <button class="login-button">{{ $t("btn.login") }}</button>
      </a>
      <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">
        <button class="join-us-button">{{ $t("btn.joinUs") }}</button>
      </a>
    </div>

    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <div class="page-title-text">
          <span class="page-title-text__stroke">{{ $t("affiliate.commissionPercentage") }}</span>
          <span class="page-title-text__fill">{{ $t("affiliate.commissionPercentage") }}</span>
        </div>

        <div class="affiliate-sub">
          <div class="affiliate-subtitle">{{ $t("affiliate.commissionStructureExample") }}</div>
          <div class="affiliate-inner">
            <table>
              <tbody>
                <tr>
                  <th>{{ $t("affiliate.table.commissionStructure.agent") }}</th>
                  <th>{{ $t("affiliate.table.commissionStructure.profit") }}</th>
                  <th>{{ $t("affiliate.table.commissionStructure.activeValidMembers") }}</th>
                  <th>{{ $t("affiliate.table.commissionStructure.commissionRate") }}</th>
                </tr>
                <tr v-for="(item, index) in commissionStructure" :key="index">
                  <td>{{ item.level }}</td>
                  <td>{{ item.profit }}</td>
                  <td>{{ item.activeMembers }}</td>
                  <td>{{ item.commissionRate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <div class="page-title-text">
          <span class="page-title-text__stroke">{{ $t("affiliate.commissionCalculation") }}</span>
          <span class="page-title-text__fill">{{ $t("affiliate.commissionCalculation") }}</span>
        </div>

        <div class="affiliate-sub">
          <div class="affiliate-subtitle">{{ $t("affiliate.commissionCalculationExample") }}</div>
          <div class="affiliate-inner">
            <table>
              <tbody>
                <tr>
                  <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                    {{ $t("affiliate.table.commissionCalculation.winLose") }}
                  </td>
                  <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                    10,000
                  </td>
                </tr>
                <tr>
                  <td class="highlight">{{ $t("affiliate.table.commissionCalculation.platformFee") }}</td>
                  <td class="highlight">-800</td>
                </tr>
                <tr>
                  <td :colspan="2">
                    {{ $t("affiliate.table.commissionCalculation.platformFeeFormula", { rate: "15%" }) }}
                  </td>
                </tr>
                <tr>
                  <td class="highlight">{{ $t("affiliate.table.commissionCalculation.bonus") }}</td>
                  <td class="highlight">-200</td>
                </tr>
                <tr>
                  <td :colspan="2">{{ $t("affiliate.table.commissionCalculation.bonusFormula") }}</td>
                </tr>
                <tr>
                  <td class="highlight">{{ $t("affiliate.table.commissionCalculation.netProfit") }}</td>
                  <td class="highlight">9,000</td>
                </tr>
                <tr>
                  <td class="highlight">{{ $t("affiliate.table.commissionCalculation.commissionRate") }}</td>
                  <td class="highlight">x35%</td>
                </tr>
                <tr>
                  <td class="result">{{ $t("affiliate.table.commissionCalculation.totalCommission") }}</td>
                  <td class="result">2798.4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="affiliate-subgroup agent-content-item rule">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <div class="page-title-text">
          <span class="page-title-text__stroke">{{ $t("affiliate.commissionTerm") }}</span>
          <span class="page-title-text__fill">{{ $t("affiliate.commissionTerm") }}</span>
        </div>

        <div class="affiliate-sub">
          <img class="bonus-rabbit" src="../assets/images/affiliate/bonus-rabbit.png" alt="" />
          <div class="affiliate-inner">
            <ol>
              <li v-for="(term, key) in terms" :key="key">
                <ul>
                  <li v-for="(subTerm, subKey) in term" :key="`${key}-${subKey}`">{{ subTerm }}</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { userStore } from "../stores/index";
import { Platform, useQuasar } from "quasar";
import { useNotify } from "src/hooks/notify.js";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { i18nStore } from "src/router/language";

const affCode = sessionStorage.getItem("AFFILIATE_CODE");
const notify = useNotify();

const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
  const left = (screen.width - popupWinWidth) * 2;
  const top = (screen.height - popupWinHeight) / 4;
  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
  );
};

const affiliateUrl = ref("https://6666vip.cc/lk6/");
const text_copied = ref("");
const copyinput = ref(null);
const $q = useQuasar();
const { t, locale, getLocaleMessage } = useI18n();
const { languageVal } = storeToRefs(i18nStore());

const contactInfo = computed(() => [
  // { icon: "qq-logo.png", label: t("affiliate.contact.qq"), value: "6.vip", download: "https://im.qq.com/index/" },
  {
    icon: "tg-logo.png",
    label: t("affiliate.contact.telegram"),
    value: "@6.vip",
    download: "https://telegram.org/"
  },
  // {
  //   icon: "skype-logo.png",
  //   label: t("affiliate.contact.skype"),
  //   value: "live:.cid.6.vip",
  //   download: "https://www.skype.com/zh-Hans/get-skype/"
  // },
  // {
  //   icon: "sigua-logo.png",
  //   label: t("affiliate.contact.sigua"),
  //   value: "6.vip",
  //   download: "https://ya.cn/index.html"
  // },
  // { icon: "amico-logo.png", label: t("affiliate.contact.amico"), value: "6.vip", download: "https://am35.cc" },
  //{ icon: "email-logo.png", label: t("affiliate.contact.email"), value: "leihuo188@gmail.com" }
]);

const commissionStructure = computed(() => [
  { level: t("affiliate.agentLevel.brown"), profit: "＜10W", activeMembers: 5, commissionRate: "35%" },
  { level: t("affiliate.agentLevel.silver"), profit: "10W-30W", activeMembers: 10, commissionRate: "40%" },
  { level: t("affiliate.agentLevel.gold"), profit: "30W-60W", activeMembers: 25, commissionRate: "45%" },
  { level: t("affiliate.agentLevel.diamond"), profit: "60W-100W", activeMembers: 50, commissionRate: "50%" },
  { level: t("affiliate.agentLevel.crown"), profit: ">100W", activeMembers: 80, commissionRate: "55%" }
]);

const terms = computed(() => getLocaleMessage(locale.value)["affiliate"]["term"] || []);

const copyText = (text, msgTitle) => {
  text_copied.value = text;
  console.log(text_copied.value);
  setTimeout(() => {
    const copyText = copyinput.value;
    console.log(copyText);

    copyText.select();
    document.execCommand("copy");
    console.log("Copied");

    notify({
      type: "success",
      message: t("common.notification.copySuccess.message", { str: msgTitle })
    });
  }, 100);
};
</script>

<style lang="scss" scoped>
.affiliate-container {
  padding: 1.2rem 1rem;
  background: url("../assets/images/affiliate/bg-affiliate.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: "PingFang";

  .page-title {
    display: flex;
    flex-direction: column;
    word-break: keep-all;
    text-align: center;
    text-shadow: 0px 7.804098606109619px 7.804098606109619px rgba(0, 0, 0, 0.47),
      3.9020493030548096px 3.9020493030548096px 0px #9da6d4;
    font-weight: 400;
    background: url("../assets/images/affiliate/title-bg.jpeg"), lightgray 50% / cover no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #b1e4ff;
    padding: 0;
  }

  .page-title-img {
    margin: 0 auto 32px;

    img {
      width: 100%;
    }
  }

  .page-title-text {
    position: relative;
    margin-bottom: 34px;
    text-align: center;
    font-size: clamp(20px, 6vw, 32px);
    font-weight: 900;
    color: transparent;

    .page-title-text__stroke {
      --stroke-width: 1px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(180deg, #e2ebfa 0%, #ffffff 76.92%);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-stroke: var(--stroke-width) transparent;
      text-shadow: var(--stroke-width) 0 0 #e2ebfa, calc(var(--stroke-width) * -1) 0 0 #ffffff,
        0 var(--stroke-width) 0 #e2ebfa, 0 calc(var(--stroke-width) * -1) 0 #ffffff;
      z-index: 1;
    }

    .page-title-text__fill {
      position: relative;
      z-index: 2;
      background: linear-gradient(180deg, #7abdff -22.99%, #3a8aff 64.94%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    // &::before {
    //   content: attr(data-text);
    //   position: absolute;
    //   z-index: -1;
    //   // background: linear-gradient(180deg, #e2ebfa 0%, #ffffff 76.92%);
    //   // background-clip: text;
    //   // -webkit-background-clip: text;
    //   // color: transparent;
    //   -webkit-text-stroke: 1px #fff;
    //   text-stroke: 1px #fff;
    // }
  }

  .ambassador {
    display: flex;
    justify-content: center;
    padding: 0 0rem;

    .ambassador-img {
      width: 50%;
    }

    .btn-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 7.5rem;
      margin: 1.5rem 2rem 0 2rem;

      color: #fff;
      text-align: center;
      font-weight: 400;
      line-height: normal;
      word-break: keep-all;

      .join-btn,
      .login-btn {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #93c7ff inset, 0px -3.664px 3.664px 0px #275ec1 inset;
        overflow: hidden;

        .mask {
          width: 7rem;
          position: absolute;
          z-index: -1;
        }
      }
    }
  }

  .contact-us {
    margin: 2.5rem 0;
    .register-btn-wrapper {
      position: relative;

      .register-btn {
        width: 100%;
        color: #fff;
        text-align: center;
        font-weight: 400;
        line-height: normal;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #93c7ff inset, 0px -3.664px 3.664px 0px #275ec1 inset;
      }

      .mask-img {
        position: absolute;
        left: 2.5rem;
        top: 0.25rem;
        width: 7rem;
      }

      .mask-img2 {
        position: absolute;
        right: 2.5rem;
        top: 0.25rem;
        width: 7rem;
      }
    }

    .contact-info {
      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 2.25rem;

        .two-four-hour-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 7rem;
          border-radius: 0.25rem;
          overflow: hidden;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          box-shadow: 0px 2.7097px 2.7097px 0px #93c7ff inset, 0px -2.16776px 2.16776px 0px #275ec1 inset;

          .two-four-mask {
            height: 1.5rem;
          }

          .two-four-content {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;

            .two-four-img {
              width: 1rem;
              margin: 0 0.25rem 0 0;
            }

            .two-four-text {
              color: white;
              font-size: 0.7379rem;
            }
          }
        }
      }
    }
  }
}

.contact-list {
  background-color: rgba(227, 238, 255, 1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-info {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.contact-icon {
  background: linear-gradient(180deg, #ffffff 0%, #b8d5fb 87.95%, #ffffff 100%);
  border-radius: 50%;
  padding: 5px;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.contact-name {
  font-weight: bold;
  color: rgba(155, 161, 188, 1);
}

.contact-id {
  color: #303442;
  font-size: 0.9em;
  font-weight: 600;
  // flex-shrink: 1;
  max-width: 160px;
}

.contact-actions {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  width: 108px;
}

.copy-button {
  flex-basis: 50%;
  background-color: rgba(219, 232, 255, 1);
  color: rgba(132, 143, 177, 1);
  border: none;
  border-radius: 30px;
  padding: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}
.download-button {
  flex-basis: 50%;
  background-color: rgba(8, 181, 255, 1);
  color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 30px;
  padding: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  img {
    display: block;
    margin: 0 auto;
  }
}

.copy-button:hover,
.download-button:hover {
  background-color: rgba(219, 232, 255, 1);
}

.copy-button:active,
.download-button:active {
  background-color: #006a9c;
}

.button-group {
  width: 100%;
  max-width: 320px;
  margin: 32px auto 40px;
  display: flex;
  justify-content: center;
}
a {
  flex: 1;
}
.login-button,
.join-us-button {
  width: 95%;
  border: none;
  justify-content: space-between;
  border-radius: 30px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button {
  background: url("../assets/images/affiliate/login-btn.png") no-repeat center center;
  background-size: 100% 100%;
  box-shadow: 0px 4.76px 4.76px 0px #0000000d;
  color: #3f4f75;
}

.login-button:hover {
}

.join-us-button {
  background: url("../assets/images/affiliate/join-us-btn.png") no-repeat center center;
  background-size: 100% 100%;
  box-shadow: 0px 4.76px 4.76px 0px #0000000d;
  color: #fff;
}

.join-us-button:hover {
  // background-color: #007bbd;
  // box-shadow: 0 6px 12px rgba(0, 123, 189, 0.7);
}
.affiliate-subgroup {
  margin: 40px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .affiliate-sub {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 15px;
    padding: 10px 8px;
    box-shadow: 0px 0px 10px 0px #0000001a;
    color: #424f72;
    box-sizing: border-box;
    position: relative;
    .affiliate-subtitle {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #303441;
    }
    .affiliate-inner {
      background: #e3eeff;
      border-radius: 8px;
      padding: 8px;
      color: #43609c;
      height: 100%;

      ol {
        padding-left: 20px;
        margin: 0;
        &::marker {
          vertical-align: top;
        }

        ul {
          list-style-type: disc;
          padding-left: 0;
          li:first-child {
            list-style: none;
          }
          li:not(:first-child) {
            margin-left: 20px;
          }
        }
      }

      .highlight {
        background: #3578d033;
        color: #43609c;
      }

      .result {
        background: #3578d066;
        color: #43609c;
      }
    }
    .affiliate-terms {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 15px;
      &:before {
        background: linear-gradient(180deg, #8dbbec -42.2%, #3b4ba3 105.96%);
        content: "";
        width: 6px;
        height: 24px;
        display: inline-block;
        margin-right: 10px;
      }
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
    }
  }
}

.agent-content-item {
  &.rule {
    .affiliate-sub {
      padding-top: 24px;
      .affiliate-inner {
        position: relative;
      }
    }
  }
}

// .agent-content-item ul {
//   font-family: "PingFang";
//   font-size: 12px;
//   font-weight: 400;
//   line-height: 28px;
//   text-align: left;
//   margin: 0;
//   padding-left: 20px;
// }
.agent-content-item table {
  width: 100%;
  margin-top: 10px;
  border-spacing: 0;
  font-size: 12px;
  border-radius: 8px;
  overflow: hidden;
}
.agent-content-item table td,
.agent-content-item table th {
  text-align: center;
  color: #dde8f7;
  background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%);
}
.agent-content-item table td {
  height: 36px;
  background: #e3eeff;
  color: #43609c;
  border: 0.76px solid #3578d01a;
}
.agent-content-item table th {
  height: 36px;
}
.bonus-rabbit {
  position: absolute;
  top: -50px;
  right: 0;
  width: 100%;
  max-width: 128px;
}
</style>

<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="affiliate-title">
        <div>
          <img
            v-if="languageVal === 'en'"
            :src="require(`../assets/images/affiliate/agent-title-en.png`)"
            alt=""
            style="height: 228px; width: 700px; display: flex; margin: 0auto"
          />
          <img
            v-else
            :src="require(`../assets/images/affiliate/agent-title.png`)"
            alt=""
            style="height: 228px; width: 700px; display: flex; margin: 0auto"
          />
          <div>
            <div class="contact-left">
              <div class="contact-box mail-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-qq.png" />
                </div>
                <div class="contact-name">{{ $t("agent.jointQQ") }}</div>
                <span ref="contact0" class="contact-text">6.vip</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('0')">{{ copybtntxt0 }}</button>
                  <a target="_blank" href="https://im.qq.com/index/" class="download-btn">
                    <img :src="require(`../assets/images/affiliate/download-icon.svg`)" />
                  </a>
                </div>
              </div>
              <div class="contact-box qq-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-telegram.png" />
                </div>
                <div class="contact-name">Telegram</div>
                <span ref="contact1" class="contact-text">@6.vip</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('1')">{{ copybtntxt1 }}</button>
                  <a target="_blank" href="https://telegram.org/download" class="download-btn">
                    <img :src="require(`../assets/images/affiliate/download-icon.svg`)" />
                  </a>
                </div>
              </div>
              <div class="contact-box skype-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-teams.png" />
                </div>
                <div class="contact-name">{{ $t("agent.jointTeams") }}</div>
                <span ref="contact2" class="contact-text" style="font-size: 7px">live:.cid.6.vip</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('2')">{{ copybtntxt2 }}</button>
                  <a
                    target="_blank"
                    class="download-btn"
                    href="https://www.microsoft.com/en-us/microsoft-teams/group-chat-software/"
                  >
                    <img :src="require(`../assets/images/affiliate/download-icon.svg`)" />
                  </a>
                </div>
              </div>
              <div class="contact-box telegram-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-bubble.png" />
                </div>
                <div class="contact-name">{{ $t("agent.sigua") }}</div>
                <span ref="contact3" class="contact-text">6.vip</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('3')">{{ copybtntxt3 }}</button>
                  <a target="_blank" class="download-btn" href="https://ya.cn/index.html">
                    <img :src="require(`../assets/images/affiliate/download-icon.svg`)" />
                  </a>
                </div>
              </div>
              <div class="contact-box bubble-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/amico-icon.png" />
                </div>
                <div class="contact-name">Amico</div>
                <span ref="contact4" class="contact-text">6.vip</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('4')">{{ copybtntxt4 }}</button>
                  <a target="_blank" class="download-btn" href="https://am35.cc">
                    <img :src="require(`../assets/images/affiliate/download-icon.svg`)" />
                  </a>
                </div>
              </div>
            </div>

            <div class="buttons">
              <a class="login-btn" :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">
                {{ $t("btn.login") }}
              </a>
              <a class="join-us-btn" :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">
                {{ $t("btn.joinUs") }}
              </a>
            </div>
          </div>
        </div>
        <img
          v-if="languageVal === 'en'"
          :src="require(`../assets/images/affiliate/agent-main-en.png`)"
          style="height: 460px; width: 600px; display: flex; margin: 0auto"
        />
        <img
          v-else
          :src="require(`../assets/images/affiliate/agent-main.png`)"
          style="height: 460px; width: 600px; display: flex; margin: 0auto"
        />
      </div>

      <div class="affiliate-program-first">
        <img
          src="@/assets/images/affiliate/contact-phone.png"
          style="height: 571px; width: 500px; display: flex; margin: 0auto"
        />

        <div class="affiliate-subgroup agent-content-item" style="width: 60%">
          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <img
              v-if="languageVal === 'en'"
              :src="require(`../assets/images/affiliate/bonus-percentage-title-en.png`)"
              style="width: 600px"
              alt=""
            />
            <img v-else :src="require(`../assets/images/affiliate/bonus-percentage-title.png`)" alt="" />
            <div class="affiliate-sub">
              <div class="affiliate-subtitle">{{ $t("agent.commissionStructure") }}</div>
              <div class="affiliate-inner">
                <table>
                  <tbody>
                    <tr>
                      <th>{{ $t("agent.profit") }}</th>
                      <th>{{ $t("agent.activePlayer") }}</th>
                      <th>{{ $t("agent.commissionRate") }}</th>
                      <th>{{ $t("agent.rechargedMember2ndAndAbove") }}</th>
                      <th>{{ $t("agent.bonusCommissionRate") }}</th>
                      <th>{{ $t("agent.postBonusCommissionRate") }}</th>
                    </tr>
                    <tr>
                      <td>8000+</td>
                      <td>＜10W</td>
                      <td>5</td>
                      <td>35%</td>
                      <td>35%</td>
                      <td>35%</td>
                    </tr>
                    <tr>
                      <td>500,001-800,000</td>
                      <td>10W-30W</td>
                      <td>10</td>
                      <td>40%</td>
                      <td>40%</td>
                      <td>40%</td>
                    </tr>
                    <tr>
                      <td>300,001-500,000</td>
                      <td>30W-60W</td>
                      <td>25</td>
                      <td>45%</td>
                      <td>45%</td>
                      <td>45%</td>
                    </tr>
                    <tr>
                      <td>80,001-300,000</td>
                      <td>60W-100W</td>
                      <td>50</td>
                      <td>50%</td>
                      <td>50%</td>
                      <td>50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="affiliate-program affiliate-program-last">
        <img
          v-if="languageVal === 'en'"
          style="width: 800px; margin-bottom: 30px"
          :src="require(`../assets/images/affiliate/bonus-title-en.png`)"
          alt=""
        />
        <img
          v-else
          :src="require(`../assets/images/affiliate/bonus-title.png`)"
          style="width: 243px; margin-bottom: 30px"
          alt=""
        />

        <div class="affiliate-subgroup agent-content-item">
          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <div class="affiliate-sub" style="max-height: 650px; width: 450px">
              <div class="affiliate-subtitle">{{ $t("agent.belowSampleCalculation") }}</div>
              <div class="affiliate-inner">
                <table>
                  <tr>
                    <td class="first-row">
                      {{ $t("agent.totalGameWinLoss") }}
                    </td>
                    <td class="first-row">10,000</td>
                  </tr>
                  <tr>
                    <td class="highlight">{{ $t("agent.platformFee") }}</td>
                    <td class="highlight">-1500</td>
                  </tr>
                  <tr>
                    <td :colspan="2">{{ $t("agent.platformFeeExplained") }} x 15%</td>
                  </tr>
                  <tr>
                    <td class="highlight">{{ $t("agent.bonuses") }}</td>
                    <td class="highlight">-20</td>
                  </tr>
                  <tr>
                    <td :colspan="2">{{ $t("agent.feesCanViewInDetails") }}</td>
                  </tr>
                  <tr>
                    <td class="highlight">{{ $t("agent.netProfit") }}</td>
                    <td class="highlight">8,480</td>
                  </tr>
                  <tr>
                    <td class="highlight">{{ $t("agent.commissionRate") }}</td>
                    <td class="highlight">*33%</td>
                  </tr>
                  <tr>
                    <td class="result">{{ $t("agent.totalCommission") }}</td>
                    <td class="result">2,798.4</td>
                  </tr>
                </table>
              </div>
            </div>
            <img
              width="350px"
              style="display: flex; margin: auto"
              :src="require(`../assets/images/affiliate/calc-decor.png`)"
              alt=""
            />
          </div>

          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <div class="affiliate-sub" style="max-height: 950px; justify-content: flex-start">
              <img :src="require(`../assets/images/affiliate/bonus-rabbit.png`)" alt="" class="bonus-rabbit" />
              <div class="affiliate-inner" style="max-height: 850px; margin-top: 69px">
                <div style="font-size: 20px">{{ $t("agent.commissionTermsAndConditions") }}</div>
                <ol>
                  <li>
                    {{ $t("agent.commissionTermsAndConditions01") }}
                    <ul>
                      <li>{{ $t("agent.commissionTermsAndConditions0101") }}</li>
                      <li>{{ $t("agent.commissionTermsAndConditions0102") }}</li>
                    </ul>
                  </li>
                  <li>
                    {{ $t("agent.commissionTermsAndConditions02") }}
                    <ul>
                      <li>{{ $t("agent.commissionTermsAndConditions0201") }}</li>
                      <li>{{ $t("agent.commissionTermsAndConditions0202") }}</li>
                    </ul>
                  </li>
                  <li>
                    {{ $t("agent.commissionTermsAndConditions03") }}
                    <ul>
                      <li>{{ $t("agent.commissionTermsAndConditions0301") }}</li>
                      <li>{{ $t("agent.commissionTermsAndConditions0302") }}</li>
                      <li>{{ $t("agent.commissionTermsAndConditions0303") }}</li>
                      <li>{{ $t("agent.commissionTermsAndConditions0304") }}</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";
import { useDark } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { i18nStore } from "@/store/language";
import { useI18n } from "vue-i18n";

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const affiliateUrl = ref("https://6666vip.cc/lk6/");

    const isDark = useDark();

    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      // console.log(top)
      window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
      );
    };
    const contact0 = ref();
    const contact1 = ref();
    const contact2 = ref();
    const contact3 = ref();
    const contact4 = ref();
    const contact5 = ref();
    const copybtntxt0 = ref(t("btn.copy"));
    const copybtntxt1 = ref(t("btn.copy"));
    const copybtntxt2 = ref(t("btn.copy"));
    const copybtntxt3 = ref(t("btn.copy"));
    const copybtntxt4 = ref(t("btn.copy"));
    const copybtntxt5 = ref(t("btn.copy"));
    const copyMessage = (position) => {
      let copyText = null;
      copyText = eval(`contact${position}.value.innerText`);
      // Create a temporary textarea element
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = copyText;
      document.body.appendChild(tempTextarea);

      // Select the text and copy it
      tempTextarea.select();
      document.execCommand("copy");

      // Remove the temporary textarea element
      document.body.removeChild(tempTextarea);
      const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4, copybtntxt5];
      copybtntxt[position].value = t("btn.copied");
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Total Member Nett Winloss (MYR)",
        dataIndex: "winLoss",
        key: "winLoss"
      },
      {
        title: "Total Active Player",
        dataIndex: "activePlayer",
        key: "activePlayer"
      },
      {
        title: "Commission Rate",
        dataIndex: "commsRate",
        key: "commsRate"
      }
    ];
    const data = [
      {
        key: "1",
        winLoss: "5 and above",
        activePlayer: "< 5",
        commsRate: "12%"
      },
      {
        key: "2",
        winLoss: "5-66,825",
        activePlayer: "≥ 5",
        commsRate: "28%"
      },
      {
        key: "3",
        winLoss: "66,826 and above",
        activePlayer: "≥ 5",
        commsRate: "40%"
      }
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      data,
      affCode,
      regDevice,
      store,
      openWindow,
      affiliateUrl,
      isDark,
      contact0,
      contact1,
      contact2,
      contact3,
      contact4,
      contact5,
      copyMessage,
      copybtntxt0,
      copybtntxt1,
      copybtntxt2,
      copybtntxt3,
      copybtntxt4,
      copybtntxt5,
      languageVal
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  font-size: 15px;
  background-color: #f3f7fd;

  .affiliate {
    font-family: "PingFang SC";
    background: url("../assets/images/affiliate/background-image.png") no-repeat center top;
    background-position: top center;
    background-size: 100% 100%;
    background-color: #f3f7fd;
    margin: 0 auto;
    padding: 100px 20px 160px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 100px;

    .affiliate-title,
    .affiliate-program-first,
    .affiliate-program {
      display: flex;
      justify-content: space-between;
      max-width: 1400px;
      width: 100%;
    }
    .affiliate-program-last {
      // margin-top: -150px;
      flex-direction: column;
      height: 950px;
      justify-content: flex-start;
    }

    .buttons {
      display: flex;
      gap: 25px;
      align-items: center;
      justify-content: center;
      align-items: center;
      margin-top: 50px;

      .login-btn {
        background: url("../assets/images/affiliate/login-btn-bg.png") center center no-repeat;
        background-size: 100% 100%;
        width: 170px;
        height: 50px;
        color: #3f4f75;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "PingFang SC";
        font-weight: 600;
        font-size: 20px;
        line-height: 100%;
        letter-spacing: 0%;

        &:hover {
          filter: brightness(0.9);
        }
      }

      .join-us-btn {
        background: url("../assets/images/affiliate/join-us-btn-bg.png") center center no-repeat;
        background-size: 100% 100%;
        width: 170px;
        height: 50px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "PingFang SC";
        font-weight: 600;
        font-size: 20px;
        line-height: 100%;
        letter-spacing: 0%;

        &:hover {
          filter: brightness(0.9);
        }
      }
    }
  }
}

.contact-left {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}

.contact-box {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 16px 12px 12px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0px 0px 9.81px 0px #08224a21 inset;
  border: 0.76px solid #ffffff;

  &--long {
    flex-direction: row;
    width: 330px;
    height: 25px;
    justify-content: center;
    margin: 16px auto 0;
    // color: #303442;
    font-weight: bold;
  }
}

.contact-name {
  color: #9ba1bc;
}
.contact-text {
  color: #303442;
}
.contact-icon {
  background: url(../assets/images/affiliate/icon-bg.png) no-repeat center center;
  width: 36px;
  height: 36px;
  background-size: cover;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 24px;
  }
}

.contact-icon-email {
  margin-top: 2px;
}

.contact-text-email {
  margin-left: 12px;
  margin-right: 8px;
}

.contact-buttons {
  display: flex;
  gap: 10px;
}

.copy-btn {
  background-color: #dbe8ff;
  border-radius: 100px;
  color: #848fb1;
  font-family: "PingFang SC";
  flex: 1;
  padding: 0 8px;
  white-space: nowrap;
}

.download-btn {
  background-color: #08b5ff;
  border-radius: 100px;
  color: #fff;
  font-family: "PingFang SC";
  flex: 1;
  padding: 0 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.affiliate-main-title {
  font-size: 36px;
  color: #2e84f5;
  text-align: center;
}
.affiliate-subgroup {
  margin-bottom: -32px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 50px;
  .affiliate-sub {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: white;
    border-radius: 15px;
    padding: 10px 40px;
    box-shadow: 0px 0px 10px 0px #0000001a;
    color: #424f72;
    box-sizing: border-box;
    position: relative;
    .affiliate-subtitle {
      font-size: 30px;
      font-weight: 700;
      color: #303441;
    }
    .affiliate-inner {
      background: #e3eeff;
      border-radius: 8px;
      padding: 20px;
      color: #43609c;
      height: 100%;

      ol {
        // list-style: none;
        padding-left: 20px;

        li {
          padding: 5px 0;
        }

        ul {
          list-style-type: disc;
        }
      }

      .first-row {
        background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%);
        color: #ffffff;
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
.agent-content-item ol {
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 400;
  line-height: 40px;
  text-align: left;
  margin: 0;
  padding-left: 20px;
}
.agent-content-item table {
  width: 100%;
  margin-top: 10px;
  border-spacing: 0;
  font-size: 18px;
  border-radius: 8px;
  overflow: hidden;
}
.agent-content-item table td,
.agent-content-item table th {
  text-align: center;
  color: #dde8f7;
  border: 1px solid #4d8de1;
  background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%);
  padding: 5px 25px;
}
.agent-content-item table td {
  height: 42px;
  background: #e3eeff;
  color: #43609c;
  border: 0.76px solid #3578d01a;
}
.agent-content-item table th {
  height: 56px;
}
.agent-contact-bg {
  background-color: #f8f8f8;
  box-shadow: 0px 5px 4px 0px rgba(12, 3, 7, 0.1);
  border-radius: 5px;
}
.agent-contact-main {
  width: 944px;
  height: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.agent-contact-logo {
  width: 150px;
  text-align: center;
  font-size: 24px;
  color: #518bf7;
}
.agent-contact-ways {
  width: 515px;
}
.agent-ways-box {
  margin-top: 25px;
}
.agent-contact-ewm {
  width: 150px;
}
.agent-contact-ewm img {
  width: 100%;
}

.bonus-rabbit {
  width: 250px;
  position: absolute;
  top: -96px;
  right: 47px;
}

.dark {
  .affiliate {
    background: #15213e;

    .buttons {
      a {
        background: url("../assets/images/home/standard-button-bg.svg") no-repeat center center;
        background-size: cover;
        box-shadow: none;
        border-radius: 8px;
        border: 1px solid #3a93ce;

        &.outline {
          background: url("../assets/images/home/secondary-button-bg.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 8px;
          border: 1px solid #ffffff4d;
          color: #fff;
        }
      }
    }

    .affiliate-inner {
      background: #17223e;
      color: #fff;

      .highlight {
        color: #fff;
      }

      .result {
        color: #fff;
      }
    }
  }

  .affiliate-sub {
    background-color: #1624404d;
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0) 98.7%);
    border: 1px solid #be945733;

    .affiliate-subtitle {
      color: #fff;
    }
  }

  .agent-content-item table th {
    background: linear-gradient(180deg, #8dbbec -42.2%, #3b4ba3 105.96%);
    border-color: #17223e;
  }
  .agent-content-item table td {
    background: #374569;
    color: #fff;
    border-color: #17223e;
  }

  .contact-box {
    background: linear-gradient(180deg, #3e5384 0%, #3558ab 100%);
    border: none;

    .contact-text {
      color: #fff;
    }

    .download-btn {
      background: #4798e4;
      border-radius: 4px;
    }

    .copy-btn {
      background: #fff;
      border-radius: 4px;
      color: #000;
    }
  }
}
</style>

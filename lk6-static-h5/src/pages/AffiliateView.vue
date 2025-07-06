<template>
  <div class="affiliate-container">
    <div class="page-title" v-if="!$q.dark.isActive">
      <div class="page-title-img"><img src="../assets/images/affiliate/title-1.png" /></div>
      <div class="page-title-img"><img src="../assets/images/affiliate/title-2.png" /></div>
      <div class="page-title-img" style="margin-top: 32px"><img src="../assets/images/affiliate/title-3.png" /></div>
    </div>
    <div class="page-title-img" v-else><img src="../assets/images/affiliate/title-1.png" /></div>
    <q-input style="width: 100%; opacity: 0; height: 5px" filled color="white" ref="copyinput" v-model="text_copied" />
    <div class="contact-list">
      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/qqlogo.png" alt="QQ Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">东赢 QQ</span>
            <span class="contact-id">1827985941</span>
          </div>
        </div>
        <div class="contact-actions">
          <button @click="copyText('1827985941')" class="copy-button">复制</button>
          <a target="_blank" href="https://im.qq.com/index/" class="download-button" rel="noopener">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/tglogo.png" alt="Telegram Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Telegram</span>
            <span class="contact-id">@dyghs_01</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('@dyghs_01')">复制</button>
          <a target="_blank" class="download-button" href="https://telegram.org/" rel="noopener">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/skypelogo.png" alt="Skype Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Skype</span>
            <span class="contact-id">live:.cid.1b8d9a018a52a8f5</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('live:.cid.1b8d9a018a52a8f5')">复制</button>
          <a target="_blank" class="download-button" href="https://www.skype.com/zh-Hans/get-skype/" rel="noopener">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/mmlogo.png" alt="丝瓜 Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">丝瓜</span>
            <span class="contact-id">LH1008666</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('LH1008666')">复制</button>
          <a target="_blank" class="download-button" href="https://ya.cn/index.html" rel="noopener">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/servicelogo.png" alt="Amico Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Amico</span>
            <span class="contact-id">vip777</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('vip777')">复制</button>
          <a target="_blank" class="download-button" href="https://am35.cc" rel="noopener">下载</a>
        </div>
      </div>
    </div>
    <div class="button-group">
      <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"><button class="login-button">登录</button></a>
      <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">
        <button class="join-us-button">加入我们</button>
      </a>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <img style="width: 120px; height: 30px" src="../assets/images/affiliate/bonus-percentage-title.png" alt="" />
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">以下为佣金占比示例</div>
          <div class="affiliate-inner">
            <table>
              <tbody>
                <tr>
                  <th>代理</th>
                  <th>盈利</th>
                  <th>有效活跃会员</th>
                  <th>佣金比例</th>
                </tr>
                <tr>
                  <td>铜牌</td>
                  <td>＜10W</td>
                  <td>5</td>
                  <td>35%</td>
                </tr>
                <tr>
                  <td>银牌</td>
                  <td>10W-30W</td>
                  <td>10</td>
                  <td>40%</td>
                </tr>
                <tr>
                  <td>金牌</td>
                  <td>30W-60W</td>
                  <td>25</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td>钻石</td>
                  <td>60W-100W</td>
                  <td>50</td>
                  <td>50%</td>
                </tr>
                <tr>
                  <td>皇冠</td>
                  <td>>100W</td>
                  <td>80</td>
                  <td>55%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <img style="width: 120px; height: 30px" src="../assets/images/affiliate/bonus-title.png" alt="" />
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">佣金计算 (以下为示例)</div>
          <div class="affiliate-inner">
            <table>
              <tr>
                <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                  平台输赢
                </td>
                <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                  10,000
                </td>
              </tr>
              <tr>
                <td class="highlight">平台费</td>
                <td class="highlight">-800</td>
              </tr>
              <tr>
                <td :colspan="2">平台费=游戏总输赢 x8%</td>
              </tr>
              <tr>
                <td class="highlight">红利</td>
                <td class="highlight">-200</td>
              </tr>
              <tr>
                <td :colspan="2">返水，红利，存提手续费后台可见明细</td>
              </tr>
              <tr>
                <td class="highlight">净利润</td>
                <td class="highlight">9,000</td>
              </tr>
              <tr>
                <td class="highlight">佣金比例</td>
                <td class="highlight">x35%</td>
              </tr>
              <tr>
                <td class="result">代理佣金</td>
                <td class="result">3,150</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <img style="width: 120px; height: 30px" src="../assets/images/affiliate/rule-title.png" alt="" />

        <div class="affiliate-sub">
          <img class="bonus-rabbit" src="../assets/images/affiliate/bonus-rabbit.png" alt="" />
          <div class="affiliate-inner">
            <ul>
              <li>1.佣金派发时间：每月 1 号至 10 号期间，所有佣金由系统直接发放到代理账户，无需流水，即可提款。</li>
              <li>2.每月至少有五个有效活跃会员才能结算佣金，当月存款≥500，流水≥1000 为一个活跃玩家。</li>
              <li>
                3.代理推广每月至少需要新注册活跃会员达到 3
                名或以上，如无法达到将视为零推广，代理部有权减少或扣除部分佣金，如果三个月累积新增活跃会员未达到十位，将会停用代理账户，需代理联系平台客服重新开启。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "../stores/index";
import { Platform, useQuasar } from "quasar";
import { useNotify } from "src/hooks/notify.js";
import { ref } from "vue";

const affiliateUrl = ref("https://dy2-affiliate.mndofithly.com/dy/");
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
const text_copied = ref("");
const copyinput = ref(null);
const $q = useQuasar();
const affCode = sessionStorage.getItem("AFFILIATE_CODE");
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
      message: `${msgTitle ? msgTitle : ""}复制成功！`
    });
  }, 100);
};
</script>

<style lang="scss">
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
  }

  .page-title-img {
    width: 90%;
    margin: 0 auto;

    img {
      width: 100%;
    }
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
  max-width: 400px;
  width: 100%;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-info {
  display: flex;
  align-items: center;
}

.contact-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: bold;
  color: rgba(155, 161, 188, 1);
}

.contact-id {
  color: rgba(48, 52, 66, 1);
  font-size: 0.9em;
  overflow: auto;
  max-width: 120px;
}

.contact-actions {
  display: flex;
  gap: 10px;
  width: 108px;
}

.copy-button {
  background-color: rgba(219, 232, 255, 1);
  color: rgba(132, 143, 177, 1);
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.download-button {
  background-color: rgba(8, 181, 255, 1);
  color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  margin-top: 32px;
  display: flex;
  flex-direction: row;
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
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button {
  box-shadow: 0px -1.52px 3.48px 0px rgba(177, 215, 255, 1) inset;
  box-shadow: 0px -0.76px 2.79px 0px rgba(88, 148, 255, 1) inset;
  background: linear-gradient(180deg, #f7f7f7 0%, #f5f9ff 100%);

  color: #6a7ba2;
}

.login-button:hover {
}

.join-us-button {
  // background-color: #008cdd;
  color: #ffffff;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);

  box-shadow: 0px -1.52px 3.48px 0px rgba(177, 215, 255, 1) inset;

  box-shadow: 0px -0.76px 2.79px 0px rgba(88, 148, 255, 1) inset;
}

.join-us-button:hover {
  // background-color: #007bbd;
  // box-shadow: 0 6px 12px rgba(0, 123, 189, 0.7);
}
.affiliate-subgroup {
  margin: 24px 0px;
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

      ul {
        list-style: none;
        padding: 0;
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
.agent-content-item ul {
  font-family: "PingFang";
  font-size: 12px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
  margin: 0;
  padding-left: 20px;
}
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
  border: 1px solid #4d8de1;
  background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%);
}
.agent-content-item table td {
  height: 45px;
  background: #e3eeff;
  color: #43609c;
  border: 0.76px solid #3578d01a;
}
.agent-content-item table th {
  height: 56px;
}
.bonus-rabbit {
  position: absolute;
  top: -100px;
  right: -20px;
  width: 128px;
  height: 114px;
}
.body--dark {
  .affiliate-container {
    .ambassador {
      .btn-wrapper {
        .join-btn,
        .login-btn {
          background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #3a93ce;
          color: #ffffff;
        }
        .contact-btn {
          background: url("../assets/images/account/secondary-btn.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #ffffff4d;
          color: #ffffff;
        }
        .mask {
          display: none;
        }
      }
    }
    .contact-us {
      .register-btn-wrapper {
        .register-btn {
          background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #3a93ce;
          color: #ffffff;
        }
      }
    }
    .page-title {
      -webkit-text-stroke-color: #ffffff4d;
      text-shadow: 0px 7.8040986061px 7.8040986061px rgba(0, 0, 0, 0.47), 3.9020493031px 3.9020493031px 0px #9da6d4;
    }
  }
}
</style>

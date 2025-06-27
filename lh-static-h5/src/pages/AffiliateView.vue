<template>
  <div class="affiliate-container">
    <div class="page-title">
      <div class="page-title-img"><img src="../assets/images/affiliate/title-1.png" /></div>
      <div class="page-title-img"><img src="../assets/images/affiliate/title-2.png" /></div>
      <div class="page-title-img" style="margin-top: 32px"><img src="../assets/images/affiliate/title-3.png" /></div>
    </div>
    <!--    <div class="page-title-img" v-else><img src="../assets/images/affiliate/affiliate-title.png" /></div>-->
    <q-input style="width: 100%; opacity: 0; height: 5px" filled color="white" ref="copyinput" v-model="text_copied" />
    <div class="contact-list">
      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/qqlogo.png" alt="QQ Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">雷火 QQ</span>
            <span class="contact-id">2115894008</span>
          </div>
        </div>
        <div class="contact-actions">
          <button @click="copyText('2115894008')" class="copy-button">复制</button>
          <a target="_blank" href="https://im.qq.com/index/" class="download-button">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/tglogo.png" alt="Telegram Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Telegram</span>
            <span class="contact-id">@leihuo686</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('@leihuo686')">复制</button>
          <a target="_blank" class="download-button" href="https://telegram.org/download">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/skypelogo.png" alt="Skype Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Skype</span>
            <span class="contact-id">live:.cid.8099acb97a5ea41</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('live:.cid.8099acb97a5ea41')">复制</button>
          <a target="_blank" class="download-button" href="https://www.skype.com/zh-Hans/get-skype/">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/mmlogo.png" alt="丝瓜 Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">丝瓜</span>
            <span class="contact-id">Lh080688</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('Lh080688')">复制</button>
          <a target="_blank" class="download-button" href="https://ya.cn/index.html">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/servicelogo.png" alt="Amico Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Amico</span>
            <span class="contact-id">vip333</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('vip333')">复制</button>
          <a target="_blank" class="download-button" href="https://am35.cc">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/emaillogo.png" alt="Eamil Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">雷火投诉邮箱</span>
            <span class="contact-id">leihuo188@gmail.com</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('leihuo188@gmail.com')">复制</button>
        </div>
      </div>
    </div>
    <div class="button-group">
      <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"><button class="login-button">登陆</button></a>
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
          <div class="affiliate-subtitle">以下为佣金计算示例</div>
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
                <td :colspan="2">平台费=游戏总输赢x8%</td>
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
                <td class="result">总佣金</td>
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

const affiliateUrl = ref("https://lh1-affiliate.phoicynxeey.com/lh/");
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
  padding: 1.5rem;
  background: url("../assets/images/affiliate/bg-affiliate.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .page-title {
    display: flex;
    flex-direction: column;
    word-break: keep-all;
    text-align: center;
    text-shadow: 0px 7.804098606109619px 7.804098606109619px rgba(0, 0, 0, 0.47),
      3.9020493030548096px 3.9020493030548096px 0px #9da6d4;
    // font-size: 3.46239rem;
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

  .branding {
    display: flex;
    justify-content: space-between;
    padding: 0 1.25rem;
    margin: 1.25rem 0 0rem 0;

    .branding-wrapper {
      display: flex;

      .hand-img,
      .headset-img,
      .vg-img {
        width: 1.25rem;
        height: 1.25rem;
        margin: 0.15rem 0.25rem 0 0;
      }

      .desc-container {
        .title {
          color: $font-2;
          text-align: left;
          text-shadow: 1.1197850704193115px 1.1197850704193115px 0px #9da6d4;
          font-family: FZTanHeiS-B-GB;
          font-size: 1rem;

          font-weight: 400;
          line-height: normal;
        }

        .desc {
          color: $font-2;
          text-align: left;
          font-size: 0.75rem;

          font-weight: 500;
          line-height: normal;
          margin: 0 0 0 0.05rem;
        }
      }
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

      .contact-btn {
        background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #bbdcff inset, 0px -3.664px 3.664px 0px #a2bff4 inset;
        overflow: hidden;
        color: $font-1;

        .mask {
          width: 7rem;
          position: absolute;
          z-index: -1;
        }
      }
    }
  }

  .esport-commission {
    ul {
      list-style-type: decimal;
      padding-inline-start: 0;
      padding: 0 1rem;

      li {
        color: $font-1;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0.25rem 0;
        ul {
          padding: 0;
          li {
            list-style-type: none;
          }
        }
      }
    }

    .subtitle {
      color: $font-2;
      font-size: 0.9rem;
      font-weight: 400;
    }
  }

  .table-commission {
    margin: 2rem 0 0 0;

    thead {
      th {
        font-size: 1.15rem;
        font-weight: 600;
        color: $font-2;
        border-bottom-width: 0;
      }
    }
    thead > :first-child {
      background: $lightblue;
    }

    td:not(:last-child) {
      border-right-width: 1px;
      border-color: #ecedf0;
    }

    td {
      color: $font-1;
      font-size: 1rem;
      font-weight: 400;
    }

    .red-note {
      color: $negative;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: normal;
      margin: 0.75rem 0;
    }

    .sample-container {
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
      padding: 1rem;

      color: $font-1;
      font-size: 1rem;

      font-weight: 400;
      line-height: 2;

      .cell-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

      .contact-wrapper {
        margin: 1rem 0;

        .contact-method {
          color: $font-1;
          font-size: 1rem;
          font-weight: 400;
        }

        .contact-id {
          color: $grey-color;
          font-size: 1rem;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }

  .section-title {
    color: $primary;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: normal;
    margin: 1rem 0;
  }
}

.contact-list {
  background-color: rgba(227, 238, 255, 1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
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
  max-width: 130px;
  overflow: hidden;
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
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      &:before {
        background: linear-gradient(180deg, #8dbbec -42.2%, #3b4ba3 105.96%);
        content: "";
        width: 6px;
        height: 24px;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
}
.agent-content-item ul {
  font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial, sans-serif;

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
          color: $white;
        }
        .contact-btn {
          background: url("../assets/images/account/secondary-btn.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #ffffff4d;
          color: $white;
        }
        .mask {
          display: none;
        }
      }
    }
    .section-title {
      color: $white;
    }
    .contact-us {
      .register-btn-wrapper {
        .register-btn {
          background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #3a93ce;
          color: $white;
        }
      }
      .contact-info {
        .title-wrapper {
          .two-four-hour-wrapper {
            background: $linear-bg-180-dark;
          }
        }
      }
    }
    .page-title {
      -webkit-text-stroke-color: $font-3-dark;
      text-shadow: 0px 7.8040986061px 7.8040986061px rgba(0, 0, 0, 0.47), 3.9020493031px 3.9020493031px 0px #9da6d4;
    }
    .branding {
      .branding-wrapper {
        .desc-container {
          .title,
          .desc {
            color: $font-3-dark;
            text-shadow: none;
          }
        }
      }
    }
    .esport-commission {
      .subtitle {
        color: $font-3-dark;
      }
    }
    .table-commission {
      .q-table__container {
        background: $background-dark-light;
        thead {
          > :first-child {
            background: $background-dark-header;
            th {
              color: $font-3-dark;
              &:not(:last-child) {
                border-right: 1px solid $border-dark;
              }
            }
          }
        }
        td:not(:last-child) {
          border-color: $border-dark;
        }
      }

      .sample-container {
        @include content-block-dark;
      }
    }
  }
}
</style>

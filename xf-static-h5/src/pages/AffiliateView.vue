<template>
  <div class="affiliate-container">
    <div class="page-title">
      <div class="page-title-img"><img src="../assets/images/affiliate/title-1.png" /></div>
      <div class="page-title-img" style="margin-top: 32px"><img src="../assets/images/affiliate/title-3.png" /></div>
    </div>
    <q-input style="width: 100%; opacity: 0; height: 5px" filled color="white" ref="copyinput" v-model="text_copied" />
    <div class="contact-list">
      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/qqlogo.png" alt="QQ Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">兴发QQ</span>
            <span class="contact-id">1600337511</span>
          </div>
        </div>
        <div class="contact-actions">
          <button @click="copyText('1600337511')" class="copy-button">复制</button>
          <a target="_blank" href="https://im.qq.com/index/" class="download-button">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/tglogo.png" alt="Telegram Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Telegram</span>
            <span class="contact-id">@xf100200</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('@xf100200')">复制</button>
          <a target="_blank" class="download-button" href="https://telegram.org/">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/skypelogo.png" alt="Skype Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Skype</span>
            <span class="contact-id">live:.cid.178f76828f54342e</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('live:.cid.178f76828f54342e')">复制</button>
          <a target="_blank" class="download-button" href="https://www.skype.com/zh-Hans/get-skype/">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/mmlogo.png" alt="丝瓜 Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">丝瓜</span>
            <span class="contact-id">xfdlkf001</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('xfdlkf001')">复制</button>
          <a target="_blank" class="download-button" href="https://ya.cn/index.html">下载</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-info">
          <img src="../assets/images/affiliate/servicelogo.png" alt="Amico Icon" class="contact-icon" />
          <div class="contact-details">
            <span class="contact-name">Amico</span>
            <span class="contact-id">vip444</span>
          </div>
        </div>
        <div class="contact-actions">
          <button class="copy-button" @click="copyText('vip444')">复制</button>
          <a target="_blank" class="download-button" href="https://am35.cc">下载</a>
        </div>
      </div>
    </div>
    <div class="button-group">
      <a :href="affiliateUrl + 'login'"><button class="login-button">登陆</button></a>
      <a :href="affiliateUrl + 'register?agent=' + (affCode ? affCode : '')">
        <button class="join-us-button">加入我们</button>
      </a>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%">
        <img style="width: 120px; height: 30px" src="../assets/images/affiliate/bonus-percentage-title.png" alt="" />
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">佣金如何计划</div>
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
          <div class="affiliate-subtitle">佣金计算(以下为示例)</div>
          <div class="affiliate-inner">
            <table>
              <tr>
                <td style="background: #339ebc; color: white">平台输赢</td>
                <td style="background: #339ebc; color: white">10,000</td>
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
              <li>1.佣金派发时间：每月5号至10号期间，所有佣金由系统直接发放到代理账户，无需流水，即可提款。</li>
              <li>2.每月至少有五个有效活跃会员才能结算佣金，当月存款≥200为一个活跃玩家。</li>
              <li>
                3.代理推广每月至少需要新注册活跃会员达到3名或以上，如无法达到将视为零推广兴發平台，代理部有权减少或扣除部分佣金，如果三个月累积新增活跃会员未达到十位，将会停用代理账户，需代理联系平台客服重新开启。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

const affiliateUrl = ref("https://xf1-affiliate.gwd4jptunz.com/xf/");
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

    $q.notify({
      color: "positive",
      position: "top",
      message: `${msgTitle ? msgTitle : ""}复制成功！`,
      icon: "check_circle_outline"
    });
  }, 100);
};
</script>

<style lang="scss">
.affiliate-container {
  padding: 1rem;
  background: url("../assets/images/affiliate/bg-affiliate.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  font-family: "PingFang";

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
          color: #424f72;
          text-align: left;
          text-shadow: 1.1197850704193115px 1.1197850704193115px 0px #9da6d4;
          font-family: FZTanHeiS-B-GB;
          font-size: 1rem;

          font-weight: 400;
          line-height: normal;
        }

        .desc {
          color: #424f72;
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
        color: #7a80a1;

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
        color: #7a80a1;
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
      color: #424f72;
      font-size: 0.9rem;
      font-weight: 400;
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
          color: #7a80a1;
          font-size: 1rem;
          font-weight: 400;
        }

        .contact-id {
          color: #a4aabb;
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
  background-color: #25283a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0auto;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
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
  color: #fff;
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
  background-color: transparent;
  color: #4ffbff;
  border: 1px solid #4ffbff;
  border-radius: 100px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.download-button {
  background-color: #4ffbff;
  color: #000;
  border: none;
  border-radius: 100px;
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
  padding: 15px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button {
  background: transparent;
  border: 1px solid #00bfd7;
  color: #00bfd7;
}

.login-button:hover {
}

.join-us-button {
  // background-color: #008cdd;
  color: #ffffff;
  background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
  box-shadow: 0px 0px 4px 0px #ffffff inset;
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
    background: url(../assets/images/affiliate/section-bg.png) no-repeat center center;
    background-size: 100% 100%;
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
      color: #fff;
    }
    .affiliate-inner {
      background: #25283a;
      border-radius: 8px;
      padding: 8px;
      color: #fff;
      height: 100%;

      ul {
        list-style: none;
        padding: 0;
      }

      .highlight {
        background: #339ebc33;
        color: #fff;
      }

      .result {
        background: #339ebc66;
        color: #fff;
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
  overflow: hidden;
}
.agent-content-item table td,
.agent-content-item table th {
  text-align: center;
  color: #dde8f7;
  background: #339ebc;
  padding: 5px 12px;
}
.agent-content-item table td {
  height: 45px;
  background: transparent;
  color: #fff;
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
</style>

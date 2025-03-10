<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="affiliate-title">
        <div>
          <img style="width: 700px" :src="require(`../assets/images/affiliate/agent-title.png`)" alt="" />
          <div>
            <div class="contact-left">
              <div class="contact-box mail-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-qq.png" />
                </div>
                <div class="contact-name">兴发QQ</div>
                <span ref="contact0" class="contact-text">1600337511</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('0')">{{ copybtntxt0 }}</button>
                  <a target="_blank" href="https://im.qq.com/index/" class="download-btn">下载</a>
                </div>
              </div>
              <div class="contact-box qq-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-telegram.png" />
                </div>
                <div class="contact-name">Telegram</div>
                <span ref="contact1" class="contact-text">@xf100200</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('1')">{{ copybtntxt1 }}</button>
                  <a target="_blank" href="https://telegram.org/download" class="download-btn">下载</a>
                </div>
              </div>
              <div class="contact-box skype-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-skype.png" />
                </div>
                <div class="contact-name">Skype</div>
                <span ref="contact2" class="contact-text" style="font-size: 10px">live:.cid.178f76828f54342e</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('2')">{{ copybtntxt2 }}</button>
                  <a target="_blank" class="download-btn" href="https://www.skype.com/zh-Hans/get-skype/">下载</a>
                </div>
              </div>
              <div class="contact-box telegram-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/icon-bubble.png" />
                </div>
                <div class="contact-name">丝瓜</div>
                <span ref="contact3" class="contact-text">xfdlkf001</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('3')">{{ copybtntxt3 }}</button>
                  <a target="_blank" class="download-btn" href="https://ya.cn/index.html">下载</a>
                </div>
              </div>
              <div class="contact-box bubble-buttons">
                <div class="contact-icon">
                  <img src="../assets/images/affiliate/amico-icon.png" />
                </div>
                <div class="contact-name">Amico</div>
                <span ref="contact4" class="contact-text">vip444</span>
                <div class="contact-buttons">
                  <button class="copy-btn" @click="copyMessage('4')">{{ copybtntxt4 }}</button>
                  <a target="_blank" class="download-btn" href="https://am35.cc">下载</a>
                </div>
              </div>
            </div>
            <div class="buttons">
              <a class="outline" :href="affiliateUrl + 'login'">登录</a>
              <a :href="affiliateUrl + 'register?agent=' + (affCode ? affCode : '')">加入我们</a>
            </div>
          </div>
        </div>
        <img :src="require(`../assets/images/affiliate/agent-main.png`)" width="750" />
      </div>

      <div class="affiliate-program-first">
        <img src="@/assets/images/affiliate/contact-phone.png" />

        <div class="affiliate-subgroup agent-content-item" style="width: 60%">
          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <img :src="require(`../assets/images/affiliate/bonus-percentage-title.png`)" alt="" />
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
      </div>

      <div class="affiliate-program affiliate-program-last">
        <div class="affiliate-subgroup agent-content-item">
          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <img :src="require(`../assets/images/affiliate/bonus-calculation-title.png`)" alt="" />
            <div class="affiliate-sub" style="height: 515px; width: 450px">
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
                    <td class="result">代理佣金</td>
                    <td class="result">3,150</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: start; gap: 20px">
            <img :src="require(`../assets/images/affiliate/rule-title.png`)" alt="" />
            <div class="affiliate-sub" style="height: 515px; justify-content: end">
              <img :src="require(`../assets/images/affiliate/bonus-rabbit.png`)" alt="" class="bonus-rabbit" />
              <div class="affiliate-inner" style="height: 80%">
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
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";
// import { useDark } from "@vueuse/core";

export default defineComponent({
  setup() {
    const affiliateUrl = ref("https://xf1-affiliate.gwd4jptunz.com/xf/");

    // const isDark = useDark();

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
    const copybtntxt0 = ref("复制");
    const copybtntxt1 = ref("复制");
    const copybtntxt2 = ref("复制");
    const copybtntxt3 = ref("复制");
    const copybtntxt4 = ref("复制");
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
      const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4];
      copybtntxt[position].value = "已复制";
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
      // isDark,
      contact0,
      contact1,
      contact2,
      contact3,
      contact4,
      copyMessage,
      copybtntxt0,
      copybtntxt1,
      copybtntxt2,
      copybtntxt3,
      copybtntxt4
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  font-size: 15px;
  background-color: #f3f7fd;

  .affiliate {
    font-family: "PingFang";
    background: url("../assets/images/affiliate/background-image.jpg") no-repeat center top;
    background-position: top center;
    background-size: 100% 100%;
    background-color: #f3f7fd;
    margin: 0 auto;
    padding: 70px 20px 120px;
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
      margin-top: -150px;
    }

    .buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      font-family: "PingFang";
      margin-top: 40px;
      a {
        text-decoration: none;
        display: block;
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        width: 120px;
        padding: 0px 50px;
        background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
        border-radius: 50px;
        box-shadow: 0px -2px 5px 0px #b1d7ff inset;

        &.outline {
          background: transparent;
          border: 1px solid #00bfd7;
          color: #00bfd7;
          box-shadow: none;
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
  background: url(../assets/images/affiliate/contact-bg.png) no-repeat center center;
  background-size: 100% 100%;
  justify-content: center;
  gap: 5px;
  align-items: center;
  color: #ffffff;
  width: 135px;
  height: 145px;
  border-radius: 8px;
  font-size: 13px;
}

.contact-name {
  color: #9ba1bc;
  font-size: 15px;
}
.contact-text {
  color: #fff;
}
.contact-icon {
  background: url(../assets/images/affiliate/icon-bg.png) no-repeat center center;
  width: 42px;
  height: 42px;
  background-size: cover;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 28px;
  }
}
.contact-buttons {
  display: flex;
  gap: 10px;
}

.copy-btn {
  background-color: transparent;
  border: 1px solid #4ffbff;
  border-radius: 100px;
  color: #4ffbff;
  font-family: "PingFang";
  flex: 1;
  padding: 0 8px;
  white-space: nowrap;
  font-size: 15px;
}

.download-btn {
  background-color: #4ffbff;
  border-radius: 100px;
  color: #000;
  font-family: "PingFang";
  flex: 1;
  padding: 0 8px;
  white-space: nowrap;
  font-size: 15px;
  text-decoration: none;
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
    background: url(../assets/images/affiliate/section-bg.png) no-repeat center center;
    background-size: 100% 100%;
    border-radius: 15px;
    padding: 20px 40px;
    box-shadow: 0px 0px 10px 0px #0000001a;
    color: #424f72;
    box-sizing: border-box;
    position: relative;
    .affiliate-subtitle {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
    }
    .affiliate-inner {
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: #25283a;
      border-radius: 8px;
      padding: 15px;
      color: #fff;
      height: 100%;

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 10px 0;
        }
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
  font-family: PingFang;
  font-size: 20px;
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
  font-size: 16px;
  overflow: hidden;
}
.agent-content-item table td,
.agent-content-item table th {
  text-align: center;
  color: #dde8f7;
  background: #339ebc;
  padding: 5px 25px;
}
.agent-content-item table td {
  height: 35px;
  background: transparent;
  color: #fff;
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
  position: absolute;
  top: -140px;
  right: -20px;
}
</style>

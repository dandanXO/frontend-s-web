<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="buttons">
        <a :href="'https://agt.wrxjpo3vh.com/dy/register?agent=' + (affCode ? affCode : '')" target="_blank">
          加入我们
        </a>
        <a href="https://agt.wrxjpo3vh.com/dy/login" target="_blank">登录</a>
        <a
          @click.stop.prevent="
            openWindow(
              `https://csweb01.c8nhwrqx4.com/?partnerCode=DYCS&way=${regDevice}&lang=zh-CN&token=${store.token}`,
              'Chat Server',
              350,
              650
            )
          "
        >
          联系我们
        </a>
      </div<template>
  <div class="affiliate-container">
    <div class="page-title" v-if="!$q.dark.isActive">
      <div class="page-title-img" ><img src="../assets/images/affiliate/title-1.png" /></div>
      <div class="page-title-img" ><img src="../assets/images/affiliate/title-2.png" /></div>
      <div class="page-title-img" style="margin-top:32px;" ><img src="../assets/images/affiliate/title-3.png" /></div>
    </div>
    <div class="page-title-img" v-else><img src="../assets/images/affiliate/title-1.png" /></div>
    <q-input style="width: 100%; opacity: 0; display: none;" filled color="white" ref="copyinput" v-model="text_copied" />
    <div class="contact-list">
        <div class="contact-item">
            <div class="contact-info">
                <img src="../assets/images/affiliate/qqlogo.png" alt="QQ Icon" class="contact-icon">
                <div class="contact-details">
                    <span class="contact-name">雷火 QQ</span>
                    <span class="contact-id">1827985941</span>
                </div>
            </div>
            <div class="contact-actions">
                <button @click="copyText('1903687863')" class="copy-button">复制</button>
                <a target="_blank" href="https://im.qq.com/index/" class="download-button">下载</a>
            </div>
        </div>

        <div class="contact-item">
            <div class="contact-info">
                <img src="../assets/images/affiliate/tglogo.png" alt="Telegram Icon" class="contact-icon">
                <div class="contact-details">
                    <span class="contact-name">Telegram</span>
                    <span class="contact-id">@dyhykf001</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="copy-button" @click="copyText('@LH18668')">复制</button>
                <a target="_blank" class="download-button" href="https://telegram.org/">下载</a>
            </div>
        </div>

        <div class="contact-item">
            <div class="contact-info">
                <img src="../assets/images/affiliate/skypelogo.png" alt="Skype Icon" class="contact-icon">
                <div class="contact-details">
                    <span class="contact-name">Skype</span>
                    <span class="contact-id">live:.cid.1b8d9a018a52a8f5</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="copy-button"  @click="copyText('live:.cid.1a1ab9b6b5b0721f')">复制</button>
                <a target="_blank" class="download-button" href="https://www.skype.com/zh-Hans/get-skype/">下载</a>
            </div>
        </div>

        <div class="contact-item">
            <div class="contact-info">
                <img src="../assets/images/affiliate/mmlogo.png" alt="丝瓜 Icon" class="contact-icon">
                <div class="contact-details">
                    <span class="contact-name">丝瓜</span>
                    <span class="contact-id">LH1008666</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="copy-button" @click="copyText('LH1008666')">复制</button>
                <a target="_blank" class="download-button" href="https://ya.cn/index.html">下载</a>
            </div>
        </div>

        <div class="contact-item">
            <div class="contact-info">
                <img src="../assets/images/affiliate/servicelogo.png" alt="Amico Icon" class="contact-icon">
                <div class="contact-details">
                    <span class="contact-name">Amico</span>
                    <span class="contact-id">vip777</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="copy-button"  @click="copyText('Vip333')">复制</button>
                <a target="_blank" class="download-button" href="https://am35.cc">下载</a>
            </div>
        </div>
    </div>
    <div class="button-group">
        <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"><button class="login-button">登陆</button></a>
        <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"><button class="join-us-button">加入我们</button></a>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%;">
            <img style="width: 120px; height: 30px;" src="../assets/images/affiliate/bonus-percentage-title.png" alt="" />
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
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%;">
            <img style="width: 120px; height: 30px;" src="../assets/images/affiliate/bonus-title.png" alt="" />
            <div class="affiliate-sub">
              <div class="affiliate-subtitle">以下为佣金计算示例</div>
              <div class="affiliate-inner">
                <table>
                  <tr>
                    <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                      平台输赢
                    </td>
                    <td style="background: linear-gradient(180deg, #4da3ff -42.2%, #76b1ff 105.96%); color: white">
                      10000
                    </td>
                  </tr>
                  <tr>
                    <td class="highlight">-平台费</td>
                    <td class="highlight">-800</td>
                  </tr>
                  <tr>
                    <td :colspan="2">平台费=游戏总输赢*15%</td>
                  </tr>
                  <tr>
                    <td class="highlight">-红利</td>
                    <td class="highlight">-200</td>
                  </tr>
                  <tr>
                    <td :colspan="2">返水，红利，存提手续费后台可见明细</td>
                  </tr>
                  <tr>
                    <td class="highlight">=净利润</td>
                    <td class="highlight">9000</td>
                  </tr>
                  <tr>
                    <td class="highlight">*佣金比例</td>
                    <td class="highlight">*35%</td>
                  </tr>
                  <tr>
                    <td class="result">总佣金</td>
                    <td class="result">2798.4</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
    </div>
    <div class="affiliate-subgroup agent-content-item">
      <div style="display: flex; flex-direction: column; align-items: center; justify-self: center; width: 100%;">
            <img style="width: 120px; height: 30px;" src="../assets/images/affiliate/rule-title.png" alt="" />
            
            <div class="affiliate-sub">
              <img class="bonus-rabbit" src="../assets/images/affiliate/bonus-rabbit.png" alt="" />
              <div class="affiliate-inner">
                <ul>
                  <li>1.佣金派发时间：每月 1 号至 10 号期间，所有佣金由系统直接发放到代理账户，无需流水，即可提款。</li>
                  <li>2.每月至少有五个有效活跃会员才能结算佣金，当月存款≥500，流水≥1000 为一个活跃玩家。</li>
                  <li>
                    3.代理推广每月至少需要新注册活跃会员达到 3 名或以上，如无法达到将视为零推广，代理部有权减少或扣除部分佣金，如果三个月累积新增活跃会员未达到十位，将会停用代理账户，需代理联系平台客服重新开启。
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
const notify = useNotify()
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
const $q= useQuasar();
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
          message: `${msgTitle?msgTitle:''}复制成功！`
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

    img{
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

.copy-button:hover, .download-button:hover {
    background-color: rgba(219, 232, 255, 1);
}

.copy-button:active, .download-button:active {
    background-color: #006a9c;
}

.button-group {
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: row;
}
a{
  flex: 1;
}
.login-button, .join-us-button { 
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
    box-shadow: 0px -1.52px 3.48px 0px rgba(177, 215, 255, 1) inset; box-shadow: 0px -0.76px 2.79px 0px rgba(88, 148, 255, 1) inset;
    background: linear-gradient(180deg, #F7F7F7 0%, #F5F9FF 100%);

    color: #6a7ba2;
}

.login-button:hover {
    
}

.join-us-button {
    // background-color: #008cdd;
    color: #ffffff;
    background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);

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
  font-family: PingFang SC;
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
          background: url('../assets/images/account/primary-btn.svg') no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #3A93CE;
          color: #ffffff;
        }
        .contact-btn {
          background: url('../assets/images/account/secondary-btn.svg') no-repeat center center;
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
          background: url('../assets/images/account/primary-btn.svg') no-repeat center center;
          background-size: cover;
          box-shadow: none;
          border-radius: 4px;
          border: 1px solid #3A93CE;
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
>
    </div>
    <div class="affiliate-program">
      <div class="affiliate-main-title">东赢佣金方案</div>
      <div class="affiliate-subgroup agent-content-item">
        <div class="affiliate-sub" style="margin-top: 0">
          <div class="affiliate-subtitle">分红条款</div>
          <ul>
            <li>月充值金额≥200 元为活跃玩家，当月需要至少五个活跃会员才能结算佣金。</li>
            <li>当月的佣金分佣发放时间为下个月的五号到十号会结算完毕。</li>
            <li>佣金有系统直接发放到代理账户，无需流水，绑定银行卡后即可申请提款。</li>
            <li>
              代理佣金计算方式：
              <br />
              <span class="agent-stress-tip">[（投注输赢额 - 优惠 100%）-（存款 + 提款）*1%-平台费*8%]*佣金比例</span>
            </li>
            <li>
              代理推广每月至少需要新注册活跃会员达到 3 名，如无达到将视为无推广东赢平台，佣金减半，如果三个月累计新注册活跃会员未达到十位将会停用代理账户等待代理重新联系网站开启。
            </li>
          </ul>
        </div>
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">佣金如何计划</div>
          <table border="0" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th>代理</th>
                <th>盈利</th>
                <th>有效活跃会员</th>
                <th>佣金比例</th>
              </tr>
            </thead>
            <tbody>
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
                <td>＞100W</td>
                <td>80</td>
                <td>55%</td>
              </tr>
            </tbody>
          </table>
          <div class="agent-stress-tip">备注：盈利=线下会员在所有场馆的总输赢减去会员申请的所有优惠</div>
        </div>
      </div>
      <div class="affiliate-subgroup agent-content-item">
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">计算公式</div>
          <div class="agent-demo-bg">
            <div>例子 1：存款 1000 元 提款 0 元 优惠申请 100 元</div>
            <div class="agent-demo-btm">
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">平台输赢</div>
                  <div class="txt-right">1100</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">扣除申请优惠</div>
                  <div class="txt-right">-100</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">扣除存提手续费 1%</div>
                  <div class="txt-right">-10</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">平台服务费</div>
                  <div class="txt-right">88</div>
                </div>
              </div>
            </div>
            <div class="agent-demo-btm">
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">盈利</div>
                  <div class="txt-right">902</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">乘以佣金比例</div>
                  <div class="txt-right">*35%</div>
                </div>
              </div>
            </div>
            <div class="agent-demo-table">
              <div class="agent-demo-table-tr">
                <div class="txt-left">代理佣金</div>
                <div class="txt-right">315.7</div>
              </div>
            </div>
          </div>
          <div class="agent-stress-tip agent-margintop-normal">备注：存提手续费=存款加上提款总额的 1%</div>
        </div>
        <div class="affiliate-sub">
          <div class="affiliate-subtitle">&nbsp;</div>
          <div class="agent-demo-bg">
            <div>例子 2：存款 130000 元 提款 10000 元 优惠申请 2000 元 余额 500</div>
            <div class="agent-demo-btm">
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">平台输赢</div>
                  <div class="txt-right">122000</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">扣除申请优惠</div>
                  <div class="txt-right">-2000</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">扣除存提手续费 1%</div>
                  <div class="txt-right">-1400</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">平台服务费</div>
                  <div class="txt-right">9760</div>
                </div>
              </div>
            </div>
            <div class="agent-demo-btm">
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">盈利</div>
                  <div class="txt-right">108840</div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">乘以佣金比例</div>
                  <div class="txt-right">*40%</div>
                </div>
              </div>
            </div>
            <div class="agent-demo-table">
              <div class="agent-demo-table-tr">
                <div class="txt-left">代理佣金</div>
                <div class="txt-right">43536</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; padding-bottom: 40px">
        <a
          :href="'https://agt.wrxjpo3vh.com/dy/register?agent=' + (affCode ? affCode : '')"
          class="agent-reg-btn"
          target="_blank"
        >
          立即申请代理
        </a>
      </div>
      <div class="agent-contact-bg">
        <div id="contactDetail" class="agent-contact-main">
          <div class="agent-contact-logo">
            <div>
              <img src="../assets/images/affiliate/agent_index_logo.png" />
            </div>
            <div>联系我们</div>
          </div>
          <div class="agent-contact-ways">
            <div class="agent-ways-box" style="margin-top: 0">
              <div class="agent-ways-way">合营部电邮</div>
              <div class="agent-ways-val">affiliate@dyvip99.com</div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营 QQ</div>
              <div class="agent-ways-val">1903577733（工作时间：14:00-23:00）</div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营 Skype</div>
              <div class="agent-ways-val">
                live:.cid.4665ed71bfa2d711(
                <a href="skype:live:.cid.4665ed71bfa2d711?chat">
                  <img src="../assets/images/affiliate/agent_skype.png" />
                </a>
                点击图标以联系，联系时请提供用户名)
              </div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营 Flygram</div>
              <div class="agent-ways-val">
                dybet5 (下载链接：
                <a href="https://www.flygram8.com" style="color: #428bca; text-decoration: underline">
                  https://www.flygram8.com
                </a>
                )
              </div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营蝙蝠 ID</div>
              <div class="agent-ways-val">
                12830840 (下载链接：
                <a href="https://www.batchat.com/#/" style="color: #428bca; text-decoration: underline">
                  https://www.batchat.com/#/
                </a>
                )
              </div>
            </div>
            <!-- <div class="agent-ways-box">
						<div class="agent-ways-way">合营微信</div>
						<div class="agent-ways-val">XF856COM</div>
					</div> -->
          </div>
          <!-- <div class="agent-contact-ewm">
					<img src="/images/agent/wechat_qr_code.jpg"/>
				</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { userStore } from "../stores/index";
import { Platform } from "quasar";

export default defineComponent({
  setup() {
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

    const regDevice = Platform.is.mobile ? "H5" : "WEB";
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
      openWindow
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  font-size: 15px;

  .affiliate {
    align-items: center;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 auto;
    background: url(../assets/images/affiliate/top_banner.png) no-repeat center top;
    background-size: contain;
    padding-top: 200px;
    margin-top: -40px;
    .buttons {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 20px;
      justify-content: center;
      margin: 0 auto;
      padding: 20px 0;
      width: 100%;
      a {
        color: #e4e4e4;
        cursor: pointer;
        text-decoration: none;
        background: #0089de;
        padding: 10px;
        display: flex;
        width: 50%;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(-90deg, #518bf7 0%, #65adff 100%), linear-gradient(#d0d0d0, #d0d0d0);
        box-shadow: 0px 2px 3px 0px rgba(12, 3, 7, 0.15);
        border-radius: 5rem;
      }
    }
    .steps {
      background: #1e1b2e;
      display: flex;
      justify-content: space-between;
      margin: 50px auto;
      max-width: 1200px;
      padding: 40px;
      width: 95%;
      .step {
        align-items: center;
        color: #fff;
        display: flex;
        gap: 10px;
        justify-content: flex-start;
        .stepdesc {
          flex-direction: column;
          display: flex;
        }
        .game-title {
          color: #ffd200;
        }
      }
    }
  }
  .affiliate-program {
    padding: 20px;
    text-align: left;
    width: 100%;
    background: #ffffff;
    .affiliate-main-title {
      color: #0089de;
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    .affiliate-subgroup {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .affiliate-sub {
        flex: 1;
        margin-top: 40px;
        width: 100%;
        .affiliate-subtitle {
          font-size: 14px;
          color: #000000;
        }
      }
    }

    .agent-content-item {
    }
    .agent-content-item ul {
      margin-top: 37px;
      margin-left: 16px;
      padding: 0;
    }
    .agent-content-item ul li {
      list-style: decimal;
      margin-bottom: 10px;
    }
    .agent-content-item table {
      width: 100%;
      background-color: #ffffff;
      box-shadow: 0 5px 4px 0 rgba(12, 3, 7, 0.1);
    }
    .agent-content-item table td,
    .agent-content-item table th {
      width: 25%;
      text-align: center;
    }
    .agent-content-item table td {
      height: 60px;
    }
    .agent-content-item table th {
      background-color: #105a67;
      color: #fff;
      font-weight: 400;
      height: 56px;
      border-color: #105a67;
    }
    .agent-stress-tip {
      color: #ee4148;
      margin-top: 21px;
      font-size: 16px;
    }
    .agent-demo-bg {
      background-color: #f8f8f8;
      line-height: 40px;
      margin-top: 10px;
      padding: 10px;
      box-shadow: 0px 5px 4px 0px rgba(12, 3, 7, 0.1);
    }
    .agent-demo-btm {
      border-bottom: 1px solid #242c3f;
    }
    .agent-demo-table {
      display: table;
      width: 100%;
    }
    .agent-demo-table-tr {
      display: table-row;
    }
    .agent-demo-table-tr div {
      display: table-cell;
      width: 50%;
    }
    .txt-left {
      text-align: left !important;
    }
    .txt-right {
      text-align: right !important;
    }
    .agent-reg-btn {
      background-color: #0089de;
      color: #fff;
      cursor: pointer;
      display: block;
      font-size: 14px;
      margin: 0 auto;
      text-align: center;
      text-decoration: none;
      width: 100%;
      padding: 5px;
    }
    .agent-contact-bg {
    }
    .agent-contact-main {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: 0 auto;
    }
    .agent-contact-logo {
      font-size: 24px;
      text-align: center;
    }
    .agent-contact-ways {
    }
    .agent-ways-box {
      margin-top: 25px;
    }
    .agent-ways-way {
      // font-size: 16px;
      color: #686c6f;
    }
    .agent-ways-val {
      // font-size: 16px;
      color: #506180;
    }
    .agent-contact-ewm {
      width: 150px;
    }
    .agent-contact-ewm img {
      width: 100%;
    }
  }
}
</style>

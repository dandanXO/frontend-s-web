<template>
    <div class="wrapper">
      <div class="affiliate">
        <div class="affiliate-title">
          <img :src="require(`../../assets/images/affiliate/title${isDark ? '-dark' : ''}.png`)" width="688" />
        </div>
        <div class="buttons">
          <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">加入我们</a>
          <a class="outline" :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')">登录</a>
          <a class="outline" :href="affiliateUrl + 'login?view=2&agent=' + (affCode ? affCode : '')" target="_blank">
            联系我们
          </a>
        </div>
        <!-- <div class="affiliate-join">
          <img :src="require(`../../assets/images/affiliate/join${isDark ? '-dark' : ''}.png`)" width="696" />
        </div> -->
  
        <div class="affiliate-program">
        <img src="@/assets/images/affiliate/rules-dark.png" />

          <div class="affiliate-subgroup agent-content-item">
            <div class="affiliate-sub">
              <div class="affiliate-subtitle">电竞佣金方案</div>
              <div class="affiliate-terms">分红条款</div>
              <ul>
                <li>月充值金额≥200元为活跃玩家,当月需要至少五个活跃会员才能结算佣金。</li>
                <li>当月的佣金分佣发放时间为下个月的五号到十号会结算完毕.</li>
                <li>佣金有系统直接发放到代理账户，无需流水，绑定银行卡后即可申请提款。</li>
                <li>
                  代理佣金计算方式：
                  <br />
                  <span class="highlight">[（投注输赢额-优惠100%）-（存款+提款）*1.6%-平台费*8%]*佣金比例</span>
                </li>
                <li>
                  代理推广每月至少需要新注册活跃会员达到3名，如无达到将视为无推广雷火平台，佣金减半，如果三个月累计新注册活跃会员未达到十位将会停用代理账户等待代理重新联系网站开启。
                </li>
              </ul>
            </div>
            <div class="affiliate-sub">
              <div class="affiliate-subtitle">佣金如何计划</div>
              <table border>
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
                    <td>＞100W</td>
                    <td>80</td>
                    <td>55%</td>
                  </tr>
                </tbody>
              </table>
              <div class="agent-stress-tip">备注：盈利=线下会员在所有场馆的总输赢减去会员申请的所有优惠</div>
            </div>
          </div>
          <img src="@/assets/images/affiliate/calc-dark.png" />
          <div class="affiliate-subgroup agent-content-item">
            <div class="affiliate-sub">
              <div class="affiliate-subtitle">计算公式</div>
              <div class="agent-demo">
                <div class="agent-demo-bg">
                  <div class="agent-demo-example-text">例子1： 存款1000元 提款0元 优惠申请100元</div>
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
                        <div class="txt-left">扣除存提手续费1.6%</div>
                        <div class="txt-right">-16</div>
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
                        <div class="txt-right">896</div>
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
                      <div class="txt-right">313.6</div>
                    </div>
                  </div>
                </div>
  
                <div class="agent-demo-bg">
                  <div class="agent-demo-example-text">例子2：存款130000元 提款10000元 优惠申请2000元 余额500</div>
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
                        <div class="txt-left">扣除存提手续费1.6%</div>
                        <div class="txt-right">-2240</div>
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
                        <div class="txt-right">108000</div>
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
                      <div class="txt-right">43200</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="agent-stress-tip agent-margintop-normal">备注：存提手续费=存款加上提款总额的1.6%</div>
            </div>
          </div>

          <div class="contact-bg">
            <div class="contact-buttons mail-buttons">
                <span style="font-size: 0px;" ref="contact0">mailto:affiliate@e8007.com</span>
                <button class="copy-btn" @click="copyMessage('0')">{{ copybtntxt0 }}</button>
            </div>
            <div class="contact-buttons qq-buttons">
              <span style="font-size: 0px;" ref="contact1">1903687863</span>
                <button class="copy-btn"  @click="copyMessage('1')">{{ copybtntxt1 }}</button>
                <a target="_blank" href="https://im.qq.com/index/" class="download-btn">下载</a>
            </div>
            <div class="contact-buttons skype-buttons">
              <span style="font-size: 0px;" ref="contact2">live:.cid.1a1ab9b6b5b0721f</span>
                <button class="copy-btn"  @click="copyMessage('2')">{{ copybtntxt2 }}</button>
                <a target="_blank" class="download-btn" href="https://www.skype.com/zh-Hans/get-skype/">下载</a>
            </div>
            <div class="contact-buttons telegram-buttons">
              <span style="font-size: 0px;" ref="contact3">@LH18668</span>
                <button class="copy-btn"  @click="copyMessage('3')">{{ copybtntxt3 }}</button>
                <a target="_blank" class="download-btn" href="https://telegram.org/">下载</a>
            </div>
            <div class="contact-buttons bubble-buttons">
              <span style="font-size: 0px;" ref="contact4">LH1008666</span>
                <button class="copy-btn"  @click="copyMessage('4')">{{ copybtntxt4 }}</button>
                <a target="_blank" class="download-btn" href="https://paopaoim.com/index.html">下载</a>
            </div>
          </div>

          <!-- <div>
            <a :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')" class="agent-reg-btn">立即申请代理</a>
          </div> -->
        </div>
      </div>
    </div>
  </template>
  <script>
  import { defineComponent, ref } from "vue";
  // import { useI18n } from "vue-i18n";
  import { userStore } from "@/store";
  import { getDevice } from "@/utils/utils";
  import { useDark } from "@vueuse/core";
  
  export default defineComponent({
    setup() {
      const affiliateUrl = ref("https://lh1-affiliate.phoicynxeey.com/lh/");
  
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
        isDark,
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
      background: url("../../assets/images/affiliate/agent_index_top_bg_vg.png") no-repeat center top;
      background-position: top center;
      background-size: 100%;
      margin: 0 auto;
      padding: 200px 20px 160px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 50px;

      .affiliate-title, .affiliate-desc, .buttons {
        margin-left: 25%;
      }
  
      .affiliate-desc {
        display: flex;
        gap: 10px;
      }
      .buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        width: 800px;
        font-family: 'PingFang SC';

        a {
          text-decoration: none;
          display: block;
          text-align: center;
          line-height: 60px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          padding: 0px 50px;
          border-radius: 50px;
          background: url("../../assets/images/affiliate/standard-button.svg") no-repeat center top;
          background-size: 100% 100%;
          box-shadow: none;

          &:hover {
            filter: brightness(0.9);
          }
  
          &.outline {
            background: url("../../assets/images/affiliate/standard-button-outline.svg") no-repeat center top;
            background-size: 100% 100%;
          }
        }
      }
      .steps {
        background: #1e1b2e;
        padding: 40px;
        width: 95%;
        margin: 50px auto;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        .step {
          display: flex;
          color: #ffffff;
          gap: 10px;
          justify-content: flex-start;
          align-items: center;
          .stepdesc {
            flex-direction: column;
            display: flex;
          }
          .game-title {
            font-family: Wave;
            color: #ffd200;
          }
        }
      }
  
      .affiliate-program {
        color: #686c6f;
        text-align: left;
        max-width: $maxwidth;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 50px;
        .affiliate-main-title {
          font-size: 36px;
          color: #2e84f5;
          text-align: center;
        }
        .affiliate-subgroup {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 50px;
          .affiliate-sub {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
            background: #fff;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0px 0px 10px 0px #0000001a;
            color: #424f72;
            &:before {
              background-color: linear-gradient(180deg, #2c3f64, #152240);
              width: 100%;
              height: 100%;
              content: "";
            }
            .affiliate-subtitle {
              font-size: 20px;
              font-weight: 700;
              color: #2e84f5;
            }
            .affiliate-terms {
              color: #424f72;
              font-size: 18px;
              font-weight: 700;
            }
            .highlight {
              color: #2e84f5;
            }
          }
        }
        .agent-content-item ul {
          padding: 0;
          width: 100%;
          padding: 30px;
            width: 100%;
            background-color: rgb(23, 34, 62);
            border-radius: 8px;
            font-family: 'PingFang SC';
        }
        .agent-content-item ul li {
          list-style: decimal;
          &:not(:last-child) {
            margin-bottom: 20px;
          }
        }
        .agent-content-item table {
          width: 100%;
          margin-top: 10px;
          border-spacing: 0;
        }
        .agent-content-item table td,
        .agent-content-item table th {
          width: 25%;
          text-align: center;
        }
        .agent-content-item table td {
          height: 60px;
          background-color: rgba(55, 69, 105, 1);
          font-family: 'PingFang SC';
        }
        .agent-content-item table th {
          color: #fff;
          height: 56px;
          font-weight: 700;
          background: linear-gradient(180deg, #8DBBEC -42.2%, #3B4BA3 105.96%);
        }
        .agent-stress-tip {
          color: #a7a5a5;
        }
        .agent-demo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          justify-items: center;
        }
        .agent-demo-bg {
          padding: 10px 0px;
        }
        .agent-demo-example-text {
          color: #424f72;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(180deg, #8DBBEC -42.2%, #3B4BA3 105.96%);
          padding: 20px;
          border-radius: 8px;
        }
        .agent-demo-btm {
          border-bottom: 1px solid #00000033;
        }
        .agent-demo-table {
          display: table;
          width: 100%;
          background: linear-gradient(0deg, #f3f3f3, #f3f3f3), linear-gradient(0deg, #ffffff, #ffffff);
          margin: 20px auto;
          border-radius: 8px;
        }
        .agent-demo-table-tr {
          display: table-row;
        }
        .agent-demo-table-tr div {
          display: table-cell;
          width: 50%;
          padding: 10px 20px;
          font-weight: 500;
          font-size: 14px;
          color: #424f72;
        }
        .txt-left {
          text-align: left !important;
        }
        .txt-right {
          text-align: right !important;
        }
        .agent-reg-btn {
          width: 413px;
          margin: 0px auto;
          text-decoration: none;
          display: block;
          text-align: center;
          line-height: 60px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          border-radius: 50px;
          box-shadow: 0px -2px 5px 0px #b1d7ff inset;
          box-shadow: 0px -1px 4px 0px #5894ff inset;
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
        .agent-ways-way {
          font-size: 16px;
          color: #518bf7;
        }
        .agent-ways-val {
          font-size: 16px;
          color: #506180;
          a {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .agent-contact-ewm {
          width: 150px;
        }
        .agent-contact-ewm img {
          width: 100%;
        }
      }
    }
  }
  
  .dark {
    .wrapper {
      .affiliate {
        background: url("../../assets/images/affiliate/agent_index_top_bg_vg_dark.png") no-repeat center top;
        background-color: #17223E;
        background-position: top center;
        background-size: 100%;
  
        .buttons {
          a {
            // background: $active-color-dark-linear;
            // box-shadow: $active-color-dark-shadow;
            // color: $color-white;
  
            &.outline {
            }
          }
        }
  
        .affiliate-program {
          .affiliate-subgroup {
            .affiliate-sub {
              @include content-block-dark;
              background: url("../../assets/images/affiliate/section-bg.png") no-repeat center center;
              background-size: 100% 100%;
              color: #fff;
  
              .affiliate-subtitle,
              .highlight {
                background: #fff;
                background-clip: text;
                color: transparent;
              }
  
              .affiliate-terms {
                color: #fff;
              }
            }
          }
  
          .agent-reg-btn {
            background: $active-color-dark-linear;
            &:hover {
              filter: brightness(1.2);
            }
          }
  
          .agent-demo-example-text {
            color: #fff;
          }
  
          .agent-content-item {
            table {
              th {
                background-color: rgba($color-white, 20%);
                color: $font-3-dark;
              }
            }
          }
  
          .agent-demo-table {
            background: $background-content-block-lighter-dark;
  
            .agent-demo-table-tr {
              div {
                color: $font-3-dark;
              }
            }
          }
        }
      }
    }
  }

  .contact-bg {
    background: url("@/assets/images/affiliate/contact-dark.png");
    background-size: 100% 100%;
    aspect-ratio: 1400 / 560;
    position: relative;

    .contact-buttons {
        display: flex;
        gap: 5px;
    }

    .mail-buttons {
        position: absolute;
        top: 37%;
        left: 41.5%;
    }

    .qq-buttons {
        position: absolute;
        top: 37%;
        left: 58.5%;
    }

    .skype-buttons {
        position: absolute;
        top: 37%;
        left: 79.5%;
    }

    .telegram-buttons {
        position: absolute;
        top: 81%;
        left: 48.5%;
    }

    .bubble-buttons {
        position: absolute;
        top: 81%;
        left: 69%;
    }

    .copy-btn {
        background-color: #fff;
        border-radius: 4px;
        color: #000;
        font-family: 'PingFang SC';
        width: 100px;
        height: 33px;
        font-weight: bold;
    }

    .download-btn {
        background-color: #4798E4;
        border-radius: 4px;
        color: #fff;
        font-family: 'PingFang SC';
        width: 100px;
        height: 33px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  }
  </style>
  
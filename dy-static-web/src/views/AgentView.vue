<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="buttons">
        <a
          :href="
            'https://www.jollycobber.com/my/register?agent=' +
            (affCode ? affCode : '')
          "
        >
        加入我们
        </a>
        <a href="https://www.jollycobber.com/my/login">
        登录
        </a>
        <a
          @click.stop.prevent="
            openWindow(
              `https://csweb01.v6kthwlug.com/?partnerId=3&lang=zh-CN&way=${regDevice}&token=${store.token}`,
              'Chat Server',
              350,
              650,
            )
          "
        >
         联系我们
        </a>
      </div>
    </div>
      <div class="affiliate-program">
        <div class="affiliate-main-title">电竞佣金方案</div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
            <!-- <div class="affiliate-subtitle">分红条款</div> -->
            <ul>
					<li>月充值金额≥200元为活跃玩家,当月需要至少五个活跃会员才能结算佣金。</li>
					<li>当月的佣金分佣发放时间为下个月的五号到十号会结算完毕。</li>
					<li>佣金有系统直接发放到代理账户，无需流水，绑定银行卡后即可申请提款。</li>
					<li>代理佣金计算方式：<br>
						<span class="agent-stress-tip">[（投注输赢额-优惠100%）-（存款+提款）*1%-平台费*8%]*佣金比例</span>
					</li>
					<li>代理推广每月至少需要新注册活跃会员达到3名，如无达到将视为无推广东赢平台，佣金减半，如果三个月累计新注册活跃会员未达到十位将会停用代理账户等待代理重新联系网站开启。</li>
				</ul>
          </div>
          <div class="affiliate-sub">
            <!-- <div class="affiliate-subtitle">佣金如何计划</div> -->
            <table>
					<tbody><tr>
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
				</tbody></table>
        <div class="agent-stress-tip">备注：盈利=线下会员在所有场馆的总输赢减去会员申请的所有优惠 </div>
          </div>
        </div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
            <!-- <div class="affiliate-subtitle">计算公式</div> -->
            <div class="agent-demo-bg">
					<div>例子1： 存款1000元     提款0元    优惠申请100元</div>
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
								<div class="txt-left">扣除存提手续费1%</div>
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
        <div class="agent-stress-tip agent-margintop-normal">备注：存提手续费=存款加上提款总额的1%</div>
          </div>
          <div class="affiliate-sub">
            <!-- <div class="affiliate-subtitle">&nbsp;</div> -->
            <div class="agent-demo-bg">
					<div>例子2：存款130000元 提款10000元 优惠申请2000元 余额500</div>
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
								<div class="txt-left">扣除存提手续费1%</div>
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
      <div class="agent-demo-btm" style="margin-top: 20px;padding-bottom: 40px;">
			<a href="/register.jsp" class="agent-reg-btn">立即申请代理</a>
		</div>
    <div class="agent-contact-bg">
			<div id="contactDetail" class="agent-contact-main">
				<div class="agent-contact-logo">
					<div>
						<img src="../assets/images/affiliate/agent_index_logo.png">
					</div>
					<div>联系我们</div>
				</div>
				<div class="agent-contact-ways">
					<div class="agent-ways-box" style="margin-top: 0;">
						<div class="agent-ways-way">合营部电邮</div>
						<div class="agent-ways-val">affiliate@xf926.com</div>
					</div>
					<div class="agent-ways-box">
						<div class="agent-ways-way">合营QQ</div>
						<div class="agent-ways-val">

						1193911745（工作时间：14:00-23:00）</div>
					</div>
					<div class="agent-ways-box">
						<div class="agent-ways-way">合营Skype</div>
						<div class="agent-ways-val">live:.cid.2e3257b6f3c30c1（ <a href=""><img src="../assets/images/affiliate/agent_skype.png"></a> 点击图标以联系，联系时请提供用户名)</div>
					</div>
					<div class="agent-ways-box">
                        <div class="agent-ways-way">合营Flygram</div>
                        <div class="agent-ways-val">搜索ID：XF666888 (下载链接: https://www.flygram8.com)</div>
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
// import { useI18n } from "vue-i18n";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";

export default defineComponent({
  setup() {
    // const { t } = useI18n();
    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      // console.log(top)
      window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" +
          popupWinWidth +
          ", height=" +
          popupWinHeight +
          ", top=" +
          top +
          ", left=" +
          left,
      );
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Total Member Nett Winloss (MYR)",
        dataIndex: "winLoss",
        key: "winLoss",
      },
      {
        title: "Total Active Player",
        dataIndex: "activePlayer",
        key: "activePlayer",
      },
      {
        title: "Commission Rate",
        dataIndex: "commsRate",
        key: "commsRate",
      },
    ];
    const data = [
      {
        key: "1",
        winLoss: "5 and above",
        activePlayer: "< 5",
        commsRate: "12%",
      },
      {
        key: "2",
        winLoss: "5-66,825",
        activePlayer: "≥ 5",
        commsRate: "28%",
      },
      {
        key: "3",
        winLoss: "66,826 and above",
        activePlayer: "≥ 5",
        commsRate: "40%",
      },
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      data,
      affCode,
      regDevice,
      store,
      openWindow,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  // background: url("../../assets/images/common/bg.jpg") no-repeat center top;
  background-size: cover;
  font-size: 15px;

  .affiliate {
    background: url("../assets/images/affiliate/agent_index_top_bg_vg.png") no-repeat center top;
    margin: 0 auto;
    padding: 290px 20px 160px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .buttons {
      display: flex;
    gap: 20px;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
      a {
        text-decoration: none;
    // display: block;
    // width: 221px;
    // height: 78px;
    // text-align: center;
    // line-height: 78px;
    // color: #e4e4e4;
    // letter-spacing: 2px;
    // font-size: 18px;
    // cursor: pointer;
    // background-image: url(../assets/images/affiliate/agent_index_btn.jpg);
    // background-position: center;
    // background-repeat: no-repeat;
    // background-size: cover;

    display: block;
    margin: 30px auto 0;
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    width: 270px;
    height: 60px;
    background-image: linear-gradient(-90deg, #518bf7 0%, #65adff 100%), linear-gradient(#d0d0d0, #d0d0d0);
    box-shadow: 0px 2px 3px 0px rgba(12, 3, 7, 0.15);
    border-radius: 30px;
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
  }
  .affiliate-program {
    color: #686c6f;
    text-align: left;
    max-width: $maxwidth;
    width: 100%;
    margin: 50px auto;
    .affiliate-main-title {
      font-size: 36px;
      color: #2e84f5;
      text-align: center;
    }
    .affiliate-subgroup {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 100px;
      margin-bottom: 100px;
      .affiliate-sub {
        flex: 1;
        .affiliate-subtitle {
          font-size: 18px;
          color: #ffffff;
        }
      }
    }

    .agent-content-item {

    }
    .agent-content-item ul {
      margin-top: 37px;
      margin-left: 16px;
      padding: 0;
      width: 100%;
    }
    .agent-content-item ul li {
      list-style: decimal;
      margin-bottom: 41px;
    }
    .agent-content-item table {
      width: 100%;
      background-color: #f8f8f8;
      margin-top: 10px;
    }
    .agent-content-item table td, .agent-content-item table th {
        width: 25%;
        text-align: center;
    }
    .agent-content-item table td {
      height: 60px;
    }
    .agent-content-item table th {
      color: #fff;
      height: 56px;
      font-weight: normal;
      background-color: #7197ff;
    }
    .agent-stress-tip {
      color: #ee4148;
    margin-top: 21px;
    }
.agent-demo-bg {
    padding: 10px 40px 24px 40px;
    line-height: 40px;
    margin-top: 10px;
    background-color: #f8f8f8;
    box-shadow: 0px 5px 4px 0px rgba(12, 3, 7, 0.1);
    color:#686c6f;
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
text-align: left!important;
}
.txt-right {
text-align: right!important;
}
.agent-reg-btn {
  width: 100%;
height: 98px;
background-color: #2e84f5;
font-size: 26px;
color: #ffffff;
line-height: 98px;
letter-spacing: 3px;
margin: 0 auto;
text-align: center;
cursor: pointer;
display: block;
text-decoration: none;
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
color: #bacef1;
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
</style>

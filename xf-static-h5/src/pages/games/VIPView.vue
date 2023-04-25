<template>
   <div class="vip-container">
    <q-tabs
      v-model="tab"
      active-color="white"
      indicator-color="bright"
    >
      <q-tab name="special" label="VIP特权" />
      <q-tab name="details" label="VIP详情" />
    </q-tabs>
    
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="special" style="padding: 0;">
        <q-carousel
       class="vip bg-transparent"
       animated
       v-model="slide"
       arrows
       swipeable
      transition-prev="slide-right"
      transition-next="slide-left"
     >
       <q-carousel-slide
         v-for="(vip, vipIndex) in vipItems"
         :key="vipIndex"
         :name="vipIndex"
       >
         <div class="carousel__item">
           <div class="vipitem">
             <div class="viplevelcard">
              <div class="vip-badgelevel">
              <div class="vip-badge">
              <img :src="require(`../../assets/vip/vip_img_${vip.vipLevel}.png`)">
              </div>
              <div class="vip-text">
              <img :src="require(`../../assets/vip/vip_text_${vip.vipLevel}.png`)">
              </div>
              </div>
              <div class="vip-badgecontent">
                {{ `>单笔存款${vip.single}元,返现${vip.rebate}, 最高${vip.highest}元` }}
              </div>
             </div>
           </div>
         </div>
       </q-carousel-slide>
     </q-carousel> 
     <div class="vip-benefits">
        <div class="bft-title">
          VIP特权
        </div>
        <div class="bft-row">
        <div class="bft-row-cnt">
          <div class="left">
          <div class="icon"><img src="../../assets/vip/deposit.png"></div>
          <div class="txt">每月存送</div>
          </div>
            <q-btn class="btn" color="brightbtn" label="领取" />
        </div>
        <div class="bft-row-cnt">
          <div class="left">
          <div class="icon"><img src="../../assets/vip/money.png"></div>
          <div class="txt">生日礼金(1倍)</div>
          </div>
            <q-btn class="btn" color="brightbtn" label="领取" />
          
        </div>
        </div>
     </div>
      </q-tab-panel>

      <q-tab-panel name="details">
              <table class="bouns_table">
            <thead>
            <tr>
                <th class="dy-vip-th">等级</th>
                <th class="dy-vip-th">升级要求</th>
                <th class="dy-vip-th">生日礼金</th>
                <th class="dy-vip-th">晋升红包</th>
<!--                <th class="dy-vip-th">日提款额度</th>-->
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>VIP1</td>
                <td>5000≤累计存款</td>
                <td>无</td>
                <td>8元</td>
<!--                <td>10万</td>-->
            </tr>
            <tr>
                <td>VIP2</td>
                <td>20000≤累积存款</td>
                <td>无</td>
                <td>8元</td>
<!--                <td>10万</td>-->
            </tr>
            <tr>
                <td>VIP3</td>
                <td>200000≤累积存款</td>
                <td>无</td>
                <td>38元</td>
<!--                <td>10万</td>-->
            </tr>
            <tr>
                <td>VIP4</td>
                <td>500000≤累积存款</td>
                <td>无</td>
                <td>88元</td>
<!--                <td>15万</td>-->
            </tr>
            <tr>
                <td>VIP5</td>
                <td>2000000≤累积存款</td>
                <td>188元</td>
                <td>288元</td>
<!--                <td>20万</td>-->
            </tr>
            <tr>
                <td>VIP6</td>
                <td>5000000≤累积存款</td>
                <td>388元</td>
                <td>588元</td>
<!--                <td>20万</td>-->
            </tr>
            <tr>
                <td>VIP7</td>
                <td>8000000≤累积存款</td>
                <td>588元</td>
                <td>1888元</td>
<!--                <td>20万</td>-->
            </tr>
            <tr>
                <td>VIP8</td>
                <td>10000000≤累积存款</td>
                <td>888元</td>
                <td>2888元</td>
<!--                <td>30万</td>-->
            </tr>
            <tr>
                <td>VIP9</td>
                <td>20000000≤累积存款</td>
                <td>1288元</td>
                <td>5888元</td>
<!--                <td>30万</td>-->
            </tr>
            <tr>
                <td>VIP10</td>
                <td>30000000≤累积存款</td>
                <td>1588元</td>
                <td>18888元</td>
<!--                <td>30万</td>-->
            </tr>
            </tbody>

        </table>
        <table class="privilege_table">
            <thead>
            <tr>
                <th class="dy-vip-th">等级</th>
                <th class="dy-vip-th">每月优惠</th>
                <th class="dy-vip-th">流水</th>
                <th class="dy-vip-th">平台限制</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>VIP1</td>
                <td>存款最少500元可申请每月一次再存15%最高奖金188元</td>
                <td>12倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP2</td>
                <td>存款最少500元可申请每月一次再存15%最高奖金258元</td>
                <td>12倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP3</td>
                <td>存款最少500元可申请每月一次再存15%最高奖金288元</td>
                <td>12倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP4</td>
                <td>存款最少1000元可申请每月一次再存25%最高奖金388元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP5</td>
                <td>存款最少1000元可申请每月一次再存25%最高奖金588元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP6</td>
                <td>存款最少1000元可申请每月一次再存25%最高奖金688元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP7</td>
                <td>存款最少2000元可申请每月一次再存35%最高奖金888元</td>
                <td>18倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP8</td>
                <td>存款至少2000元可申请每周一次再存35%最高奖金1288元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP9</td>
                <td>存款至少2000元可申请每周一次再存35%最高奖金1888元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            <tr>
                <td>VIP10</td>
                <td>存款至少2000元可申请每周一次再存40%最高奖金2888元</td>
                <td>15倍</td>
                <td>所有</td>
            </tr>
            </tbody>
        </table>
     <!-- <div class="terms-conditions">
       <div class="terms">
         <div class="term" v-for="(term, i) in terms" :key="i">
           <div class="circle-wrapper">
             <div class="circle">{{ i + 1 }}</div>
           </div>
           <div class="term-text">{{ term.text }}</div>
         </div>
       </div>
     </div> -->
     <div class="terms-conditions">
      <div class="title">
        规则与条款
      </div>
     <ol style="padding-inline-start: 15px;">
        <li>晋升标准：用户充值以及流水达到相应级别即可晋升相应VIP等级。</li>
        <li>晋升顺序：VIP等级可以越级晋升，每天仅限晋升一级。</li>
        <li>晋级奖金：用户晋级后晋级奖金将自动派发到主账户中，每个级别的晋级奖金每位用户仅能获得一次。</li>
        <li>生日奖金：用户在注册90天内过生日，今年将不能领取生日礼金，另注册时间大于90天的会员需在生日当天的VIP页面进行自助领取，每年可领取一次。</li>
        <li>奖金流水：晋级奖金、生日奖金、每月奖金领取后需要完成一倍流水后可提款，此活动不可以与其他活动共享。</li>
        <li>每月首充：领取彩金需完成相应流水后可提款，有效投注额仅对已结算并产生输赢结果的投注额进行计算，
            电竞盘：香港盘0.75以下，欧洲盘1.75以下；
            香港盘＜0.75以下、欧洲盘＜1.75以下、马来盘＜0.75以下、印尼盘＜-1.3以下、美国盘＜-133以下，串关、走盘，注单取消，对冲等情况都不算有效流水
        </li>
        <li>凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。</li>
    </ol>
     </div>

      </q-tab-panel>

    </q-tab-panels>

     <q-dialog v-model="isClaimModal" persistent>
       <q-card class="win-rebate-model">
         <q-card-section class="row items-center">
           <div class="bonus-svg-div">

             <span class="claim-amt">{{ claimMsg }}</span>
             <span class="bonus-text">Bonus</span>
           </div>
         </q-card-section>

         <q-card-actions align="center">
           <q-btn flat label="OK" color="primary" v-close-popup/>
         </q-card-actions>
       </q-card>
     </q-dialog>


   </div>


</template>

<script>
import {ref, defineComponent, onMounted} from "vue";
import {userStore} from "stores/index";
import {eventapi} from "boot/axios"
import {useQuasar} from "quasar";


export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();
    const tab = ref('special')

    const slide = ref(0);
    const showRebate = ref(false);

    const store = userStore();
    const vipLevel = ref('');
    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel"
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7"
      },
      {
        title: "VIP 8",
        dataIndex: "vip8",
        key: "vip8"
      },
      {
        title: "VIP 9",
        dataIndex: "vip9",
        key: "vip9"
      },
      {
        title: "VIP 10",
        dataIndex: "vip10",
        key: "vip10"
      },
      {
        title: "VIP 11",
        dataIndex: "vip11",
        key: "vip11"
      },
      {
        title: "VIP 12",
        dataIndex: "vip12",
        key: "vip12"
      },
    ];
    const data = [
      {
        key: "1",
        vipLevel: "Slots Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.50%",
        vip5: "0.60%",
        vip6: "0.80%",
        vip7: "1.00%"
      },
      {
        key: "2",
        vipLevel: "Fishing Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "3",
        vipLevel: "Live Casino Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "4",
        vipLevel: "Poker Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "5",
        vipLevel: "Sports/Esports Rebate",
        vip1: "0.20%",
        vip2: "0.30%",
        vip3: "0.35%",
        vip4: "0.40%",
        vip5: "0.45%",
        vip6: "0.55%",
        vip7: "0.65%"
      },
      {
        key: "6",
        vipLevel: "Lottery Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%"
      }
    ];
    const promoExclusive = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel",
        render: (text) => String(text)
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
        render: (text) => String(text)
      }
    ];
   const dataExclusive = [
       {
         key: "1",
        vipLevel: "Withdrawal Funds",
         vip1: "500,000/Day",
         vip2: "500,000/Day",
         vip3: "500,000/Day",
         vip4: "1,000,000/Day",
         vip5: "1,000,000/Day",
         vip6: "1,000,000/Day",
         vip7: "2,000,000.00/Day",
       },
       {
         key: "2",
        vipLevel: "Bet Limit",
         vip1: "Standard",
         vip2: "Standard",
         vip3: "Standard",
         vip4: "Standard",
         vip5: "High Limit",
         vip6: "High Limit",
         vip7: "High Limit",
       },
       {
         key: "3",
        vipLevel: "Priority Payment Method",
         vip1: "",
         vip2: "",
         vip3: "",
         vip4: "",
         vip5: "✔",
         vip6: "✔",
         vip7: "✔",
       },
       {
         key: "4",
        vipLevel: "24/7 VIP Customer Care Team",
         vip1: "",
         vip2: "",
         vip3: "",
         vip4: "",
         vip5: "",
         vip6: "✔",
         vip7: "✔",
       },
       {
         key: "5",
        vipLevel: "Invitation to Exclusive Events",
         vip1: "",
         vip2: "",
         vip3: "",
         vip4: "",
         vip5: "",
         vip6: "",
         vip7: "✔",
       },
     ];
    const terms = [
      {
        text: `The program applies to VIP members with valid accounts. The VIP upgrade is based on the member's total accumulated deposit amount, the daily total successful deposit amount is calculate from 00:00:01 to 23:59:59  (GMT+8)`
      },
      {
        text: `The system will automatically upgrade VIP level after 00:00:00 (GMT+8) of the next day, the VIP level only can upgrade one level a day if the member's  total 
deposit amount is eligible for the corresponding VIP level.`
      },
      {
        text: `The Free bonus, rebates and promotins benefits level corresponding to the VIP level will be updated as soon as the member's account is updated in the 
next day.`
      },
      {
        text: `Birthday bonus:the bonus need to be claim on VIP page by member self on the birthday day and overdue void, Members who celebrate their birthday less 
than 90 days from registration day will not receive this year's birthday bonus, Only members who have registered for more than 90 days can receive it, once 
a year. (Birthday bonus can be withdrawal after 1x turnover)`
      },
      {
        text: `Monthly bonus:the bonus need to be claim on VIP page by member self after the member have upgraded to a new level in the next day, Each member can 
claim 1 monthly bonus in upgrade month.(Monthly bonus can be withdrawal after 3x turnover)`
      },
      {
        text: `All draw bets, CANCEL bets, 2 sided bets, bets on Europe Handicap under 1.75, Asian Handicap under 0.75, Number Games, Fantasy Sports, Progressive RNG 
Jackpots, Progressive RNG Slot will not be counted in this promotion.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership
program at any time without prior notice.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership program at any time without prior notice.`
      }
    ];
    const vipItems = [
      {
        vipLevel: "1",
        monthly: "",
        birthday: "",
        single: "≥500",
        rebate: "15%",
        highest: "188"
      },{
        vipLevel: "2",
        upgrade: "70,000",
        monthly: "188",
        birthday: "",
        single: "≥500",
        rebate: "15%",
        highest: "258"
      },
      {
        vipLevel: "3",
        upgrade: "500,000",
        monthly: "688",
        birthday: "888",
        single: "≥500",
        rebate: "15%",
        highest: "288"
      },
      {
        vipLevel: "4",
        upgrade: "2,000,000",
        monthly: "1,588",
        birthday: "2,888",
        single: "≥1000",
        rebate: "25%",
        highest: "388"
      },
      {
        vipLevel: "5",
        upgrade: "7,000,000",
        monthly: "2,888",
        birthday: "5,888",
        single: "≥1000",
        rebate: "25%",
        highest: "588"
      },
      {
        vipLevel: "6",
        upgrade: "20,000,000",
        monthly: "6,888",
        birthday: "8,888",
        single: "≥1000",
        rebate: "25%",
        highest: "688"
      },
      {
        vipLevel: "7",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        single: "≥2000",
        rebate: "35%",
        highest: "888"
      },
      {
        vipLevel: "8",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        single: "≥2000",
        rebate: "35%",
        highest: "1288"
      },
      {
        vipLevel: "9",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        single: "≥2000",
        rebate: "35%",
        highest: "1888"
      },
      {
        vipLevel: "10",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        single: "≥2000",
        rebate: "40%",
        highest: "1888"
      },
    ];
    
    const isClaimModal = ref(false);
    const claimMsg = ref('');


    onMounted(() => {
      vipLevel.value = store.vip.replace('VIP', '');
    });

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      // console.log(eventapi);
      const eventUrl = "/bonus/claim/" + type;
      console.log(eventUrl);
      eventapi
        .put(eventUrl)
        .then((res) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;

            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;

            // $q.dialog({
            //   class: "q-px-md q-pt-md",
            //   title: "สำเร็จ",
            //   message: "You won " + rebatePoint + " !",
            //   ok: {
            //     push: true,
            //     color: 'deep-orange',
            //     label: "ตกลง",
            //     tabindex: 1
            //   },
            //   persistent: true
            // });

          } else {

            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }

        })
        .catch((error) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });


    }


    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      vipItems,
      loading,
      vipLevel,
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      tab,
    };
  }
});
</script>
<style scoped lang="scss">
.vip-container {
  min-height: 100vh;

  .banner-container {
    background: url("../../assets/vip/banner.png") no-repeat center center;
    background-size: cover;
    margin-bottom: -200px;
    padding-top: 100px;
    padding-bottom: 200px;
    // width: 1920px;
    // height: 450px;
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 300px;
    display: flex;

    .btn-wrapper {
      width: 95%;
      max-width: 1400px;
      margin: auto;
      position: relative;

      .center {
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #ffffff;

        .page-headline {
          font-size: 150px;
          line-height: 150px;
          font-family: Wave;
        }

        .page-subline {
          font-size: 25px;
          line-height: 25px;
          margin-bottom: 20px;
          font-family: Wave;
        }

        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          font-family: Wave;
          color: #ffffff;
          font-size: 60px;
          line-height: 60px;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          width: 100%;
          max-width: 460px;

          .pesos {
            font-family: sans-serif;
            font-weight: bold;
          }
        }

        .page-liner {
          font-size: 20px;
          text-transform: none;
        }

        img {
          max-width: unset;
        }

        .common-btn.getnow {
          background: #ffffff;
          color: #000000;
          border: transparent;

          &:hover {
            background: #ffd800;
          }
        }
      }
    }

    // .jp-container {
    //   display: flex;
    //   justify-content: center;
    //   text-align: center;
    //   font-size: 110px;
    //   margin-top: 30px;
    //   color: #1bcef1;
    //   font-family: jp;
    //   font-weight: 600;
    //   line-height: 120px;

    //   .jp-number-item {
    //     width: 96px;
    //     height: 120px;
    //     // background-image: url("../../assets/images/games/casino/jp_bg.png");
    //     background-repeat: no-repeat;
    //     background-size: 100% 100%;
    //   }
    // }
  }

  .inner-vip-mobile {
    display: none;
  }

  .vipitem {
    position: relative;
    display: flex;
    // background: url("../../assets/vip/vip_04.png") no-repeat top center;
    background-size: contain;
    width: 350px;
    padding: 40px 0;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    .viplevelcard {
      padding: 10px;
      width: 70%;
      height: 150px;
      background: url("../../assets/vip/vip_logo_bg.png") no-repeat center center;
      background-size: contain;
      position: relative;
      .vip-badgelevel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .vip-badge {
          flex: 1;
          img {
            width: 100%;
          }
        }
        .vip-text {
          flex: 2;
          text-align: right;
          img { 
            width: 60%;
          }
        }
      }
      .vip-badgecontent {
        font-size: .7rem;
        position:absolute;
        right: 20px;
        bottom: 20px;
      }
    }

    .vipcontents {
      padding-top: 60px;
      // background: #2b2b4b;
      color: #ffffff;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // border-top: 2px solid #db7e42;
      // border-bottom: 2px solid #db7e42;
      .title {
        font-size: 18px;
        line-height: 36px;
      }

      .inner-vip {
        background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 45px;
        line-height: 53px;
        font-family: "Arial";
      }

      .second-vip {
        // background: #2b2b4b;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 45px;
        line-height: 53px;

        div {
          flex: 1;
        }

        .common-btn {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 20px;
          margin: 0 30px 30px;
        }
      }
    }
  }
  .vip-benefits {
    padding: 10px;
      font-size: .75rem;
    .bft-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #bacef1;
      font-weight: bold;
      gap: 10px;
      &:before {
        content: "";
        width: 3px;
        height: 19px;
        background-color: #33bcd4;
        display: inline-block;
      }
    }
    .bft-row {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .bft-row-cnt {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #bacef1;
        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 40px;
          .icon {
            width: 40px;
            img {
              flex: 1;
              width: 100%;
              display: block;
            }
          }
          .text {
          }
        }
        .btn {
        }
      }
    }
  }

  .vip-program {
    .game-title {
      margin-bottom: 30px;
    }

    margin: 50px auto;
    max-width: 1080px;
    width: 95%;

    .buttons {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border: 1px solid #db7e42;
      border-radius: 10px;
      margin-bottom: 10px;

      .common-btn {
        display: block;
        width: 100%;
        text-align: center;
        background: transparent;

        &.active {
          background-image: linear-gradient(to right, #de4545, #db7e42);
        }
      }
    }

    :deep(.ant-table-thead > tr > th) {
      text-align: center;

      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    :deep(.ant-table-tbody > tr > td) {
      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    .note {
      color: #db7d42;
      margin-top: 5px;
      display: block;
    }
  }
  .q-tab-panel {
    padding: 8px;
  }
  table {
    text-align: center;
    font-size: 10px;
    color: #bacef1;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
    thead {
      background-color: #33bcd4;
      th {
        color: #ffffff;
      }
    }
    tbody {
      td {
        border: 1px solid #343A4A;
      }
    }
  }
  .terms-conditions {
    color:#52697e;
    font-size: .8rem;
    .title {
      color: #3865e8;
    }
  }

}
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.vip-container {
.q-tabs {
  background: url(../../assets/vip/vipbg.png)no-repeat top right;
  background-attachment: fixed;
}
.q-tabs--not-scrollable .q-tabs__content {
  gap: 45px;
  display: flex;
  justify-content: center;
}
.q-tabs__content--align-justify .q-tab {
  flex: unset;
}
.q-tab {
  min-height: 35px;
  &__label {
    font-size: 12px;
  }
}
.q-tab--active .q-tab__indicator {
  
    width: 80%;
    margin: 0 auto;
    height: 3px;
}

}
.q-carousel {
  overflow: hidden;
  margin: 0 auto;
  text-align: center;

  ol {
    padding: 0;
    margin: 0 auto;
    width: 100%;
    list-style-type: none;
    display: flex;
  }
}

.carousel__item {
  background: url(../../assets/vip/vipbg.png)no-repeat top center;
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: cover;
  font-size: 20px;
}

.q-carousel__slide {
  padding: 0;
  width: 100%;
}

button {
  border: 0;
}
.q-carousel__arrow {
  background: url(../../assets/vip/nextprev.png) no-repeat center center;
  background-size: contain;
  width: 30px;
  .q-icon {
    display: none;
  }
}
.q-carousel__prev,
.q-carousel__next {
  position: absolute;
  padding: 10px;

  box-sizing: content-box;
  background: url(../../assets/vip/nextprev.png) no-repeat center center;
  background-size: contain;
  top: 20%;

  .carousel__icon {
    display: none;
  }
}

.carousel__prev {
  top: 20%;
  left: 0%;
}
.q-carousel__next-arrow--horizontal {
  transform: rotate(180deg);
  right: 10px
}
</style>

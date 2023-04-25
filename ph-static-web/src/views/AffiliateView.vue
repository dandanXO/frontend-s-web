<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title">Jolly88</div>
      <div class="game-title sub">Affiliate Program</div>
      <div class="description">
        <div class="desc pro">
          <img src="../assets/images/affiliate/01.png" />
          <span>The most professional team</span>
        </div>
        <div class="desc best">
          <img src="../assets/images/affiliate/02.png" />
          <span>The best service</span>
        </div>
      </div>
      <div class="buttons">
        <!-- Action Required - Contact Us Link -->
        <a
          :href="
            'https://www.agtjlph.com/ph/register?agent=' +
            (affCode ? affCode : '')
          "
        >
          <div class="common-btn">JOIN US</div>
        </a>

        <a href="https://www.agtjlph.com/ph/login">
          <div class="common-btn">LOGIN</div>
        </a>
        <a
          @click.stop.prevent="
            openWindow(
              `https://csweb01.amv4xjcbd.com/?partnerId=8&lang=en&way=${regDevice}&token=${store.token}`,
              'Chat Server',
              350,
              650
            )
          "
        >
          <div class="common-btn">CONTACT US</div>
        </a>
      </div>
      <div class="steps">
        <div class="step">
          <div class="game-title">01</div>
          <div class="stepdesc">
            First step<br />
            To be agent
          </div>
        </div>
        <div class="step">
          <div class="game-title">02</div>
          <div class="stepdesc">
            Second step<br />
            Advertise
          </div>
        </div>
        <div class="step">
          <div class="game-title">03</div>
          <div class="stepdesc">
            third step<br />
            Get commissions
          </div>
        </div>
      </div>

      <div class="information">
        <div class="game-title sub">TERMS AND CONDITIONS</div>
        <ol class="terms">
          <li>
            <p>
              If the active members are less than 05 during a week, there will
              be no commission.
            </p>
          </li>
          <li>
            <p>
              If the affiliate account has a negative commission for the week
              (negative profit: is the amount owed by the affiliate to the
              Company), the negative amount will be cumulative to the following
              weeks until negative commission is cleared

              <br />
              All affiliates must pay fees when using our platform
              <br />
              + Deposit and withdrawal fee of the bank. <br />
              + Bonus claimed by their users. <br />
              + Platform fee
            </p>
          </li>
          <li>
            <p>
              Commission will be audited by every Monday for last week, Release
              on every Tuesday using PHP currency. From Wednesday onwards,
              affiliate may proceed to withdraw their commission.
            </p>
          </li>
          <li>
            <p>
              JOLLY88 monitor all affiliate’s user and have our own criterion
              (risk level, deposit amount, betting index…) when evaluate such
              users. If they fail to meet our criterion, we reverse the right to
              refuse to release commission to affiliate.
            </p>
          </li>
          <li>
            <p>
              One unique affiliate must register only one Email, Phone number,
              and Name
            </p>
          </li>
          <li>
            <p>
              Affiliate manipulation (faking downline account, interfere
              downline’s betting behavior, multiple device login...) intercepted
              by our system or specialist will be punished.
            </p>
          </li>
          <li>
            <p>
              Jolly88.com reserves the right to change or correct the commission
              percentage we deem appropriate.
            </p>
          </li>
          <li>
            <p>
              Jolly88.com reserves the right to change or modify the above terms
              or add any additional terms as necessary.
            </p>
          </li>
          <li>
            <p>
              Jolly88.com reserves the right to cancel the affiliate status at
              any time without prior notice in the event that affiliate accounts
              do not meet the requirements of Jolly88.com given within a certain
              time and have acts of cheating and violation.
            </p>
          </li>
        </ol>
        <div class="table">
          <div class="game-title sub">COMMISSION PLAN TABLE</div>
          <a-table
            :pagination="false"
            :columns="columns"
            row-key="activeUser"
            :data-source="dataSource"
          />
        </div>
        <div class="game-title sub">COMMISSION FORMULA</div>
        <p>
          Net profit = (Total win/loss x 90%) - Bonus - (Bank transaction fees x
          1%). <br />

          => In there: Total win/loss = Total bet - Total payout <br />

          Bank transaction fees: (deposit +withdrawal)*1% <br />

          Commission = Net profit x corresponding commission percentage.
        </p>
        <div class="boxes">
          <div class="box">
            <p>
              Example 1: affiliate A earns a monthly commission profit of 35%
            </p>
            <div class="bx-table">
              <div class="rw-left">- Total loss of customers:</div>
              <div class="rw-rgt">1,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- Total amount deposit in the month:</div>
              <div class="rw-rgt">3,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- Total amount withdrawn in the month:</div>
              <div class="rw-rgt">600,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - Total promotion customers receive in the month:
              </div>
              <div class="rw-rgt">50,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - Bank transaction fee ((deposit+withdrawn)*1%);
              </div>
              <div class="rw-rgt">36,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">=>Net profit=</div>
              <div class="rw-rgt">(1,000,000*90%)-50,000-36,000=814,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">=>Commission=</div>
              <div class="rw-rgt">814,000*35%=284,900</div>
            </div>
          </div>

          <div class="box">
            <p>
              Example 2: affiliate B earns a monthly commission profit of 50%
            </p>
            <div class="bx-table">
              <div class="rw-left">- Total loss of customers:</div>
              <div class="rw-rgt">6,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- Total amount deposit in the month:</div>
              <div class="rw-rgt">10,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- Total amount withdrawn in the month:</div>
              <div class="rw-rgt">3,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - Total promotion customers receive in the month:
              </div>
              <div class="rw-rgt">250,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - Bank transaction fee ((deposit withdrawn)*1%):
              </div>
              <div class="rw-rgt">130,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">=>Net profit=</div>
              <div class="rw-rgt">
                (6,000,000*90%)-250,000-130,000=5,020,000
              </div>
            </div>
            <div class="bx-table">
              <div class="rw-left">=>Commission=</div>
              <div class="rw-rgt">5,020,000*50%=2,510,000</div>
            </div>
          </div>
        </div>
        <div class="game-title sub">DOWNLINE AFFILIATE</div>
        <p>
          Affiliate may recruit their own downline affiliate from their users
          base (users who already registered under the affiliate link) to earn
          extra percentage of their commission plus your own commission.
        </p>
        <div class="game-title sub">PAYMENT METHODS</div>
        <ol>
          <li>
            <p>
              Commission will be settled on every Monday and paid on the every
              Tuesday, from Wednesday onwards, Affiliate may proceed to withdraw
              money
            </p>
          </li>
          <li><p>Commission will be paid in PHP OR USDT</p></li>
          <li>
            <p>
              Complaint and dispute about commission must be submit to Affiliate
              cares before Wednesday in the same week, otherwise paid commission
              cannot be changed
            </p>
          </li>
          <li>
            <p>
              Jolly88 reserves the right to change or correct the commission
              percentage we deem appropriate.
            </p>
          </li>
          <li>
            <p>
              Jolly88 reserves the right to change or modify the above terms or
              add any additional terms as necessary.
            </p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";

export default defineComponent({
  setup() {
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
          left
      );
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Active Player",
        dataIndex: "activeUser",
        key: "activeUser",
      },
      {
        title: "Net profit(PHP)",
        dataIndex: "realProfit",
        key: "realProfit",
      },
      {
        title: "Commission(%)",
        dataIndex: "commission",
        key: "commission",
      },
    ];
    const dataSource = [
      {
        activeUser: "5",
        realProfit: "1-750,000",
        commission: "30%",
      },
      {
        activeUser: "10",
        realProfit: "750,001-1,500,000",
        commission: "35%",
      },
      {
        activeUser: "15",
        realProfit: "1,500,001-2,500,000",
        commission: "40%",
      },
      {
        activeUser: "25",
        realProfit: "2,500,001-3,500,000",
        commission: "45%",
      },
      {
        activeUser: "35",
        realProfit: "3,500,001-7,000,000",
        commission: "50%",
      },
      {
        activeUser: "50",
        realProfit: ">=7,000,001",
        commission: "55%",
      },
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      dataSource,
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
  background: url("../assets/images/affiliate/bg.png") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;

  .affiliate {
    max-width: 1550px;
    margin: 0 auto;
    min-height: 90vh;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .game-title {
      &.sub {
        font-size: 30px;
      }
    }
    .description {
      margin: 50px;
      display: flex;
      gap: 50px;
      .desc {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        gap: 10px;
        img {
          width: 50px;
        }
      }
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 20px;
      .common-btn {
        min-width: 200px;
      }
    }
    .steps {
      background: #23263c;
      padding: 40px;
      border-radius: 20px;
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
      }
    }
    .information {
      max-width: 1200px;
      width: 95%;
      margin: 0 auto;
      text-align: left;
      .game-title {
        text-align: left;
        // margin: unset;
        margin: 15px 0 0;
      }
      p {
        font-size: 16px;
        color: #ffffff;
      }
      ol {
        color: #ffffff;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .terms {
        color: #ffffff;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .table {
        :deep(.ant-table .ant-table-thead > tr > th) {
          text-align: center;
        }
        :deep(.ant-table .ant-table-thead > tr > th:nth-child(odd)),
        :deep(.ant-table .ant-table-tbody > tr > td:nth-child(odd)) {
          background: #303450;
        }
      }
      .boxes {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        .box {
          flex: 1;
          background-color: #2b2b4b;
          padding: 20px;
          color: #ffffff;
          .bx-table {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .wrapper {
    .affiliate {
      .description {
        flex-direction: column-reverse;
      }
      .information {
        .boxes {
          flex-direction: column;
        }
      }
      .steps {
        flex-direction: column;
        justify-content: flex-start;
        gap: 20px;
        max-width: 260px;
        .step {
        }
      }
    }
  }
}
</style>

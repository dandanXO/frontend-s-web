<template>
  <div class="wrapper">
    <div class="side-affiliate">
      <img src="../assets/images/affiliate/sideaffiliate.png" />
    </div>
    <div class="affiliate">
      <!-- <div class="top-banner">
        <img src="../assets/images/affiliate/affiliate-banner-web.png" />
      </div> -->
      <div class="main-title">Play4win Affiliate Program</div>
      <div class="game-subtitle sub">
        <span class="yellow">up to 45%</span>
        RATE FOR AFFILIATE TOWARD TO BEST LIFE
      </div>
      <div class="game-subtitle small">UNLIMITED COMMISSIONS</div>

      <div class="buttons">
        <!-- Action Required - Contact Us Link -->
        <a
          @click.stop.prevent="
            openWindow(
              `https://csweb01.bcxu3ia8w.com/?partnerCode=Play4WinCS&lang=en&way=${regDevice}&token=${store.token}`,
              'Chat Server',
              350,
              650
            )
          "
        >
          <div class="common-btn">Contact Us</div>
        </a>
        <a :href="'https://affilliate-web.xvpxsn9gfu.com/ph/register?agent=' + (affCode ? affCode : '')">
          <div class="common-btn">Join Us</div>
        </a>

        <!-- <a href="https://affilliate-web.xvpxsn9gfu.com/ph/login">
          <div class="common-btn">LOGIN</div>
        </a> -->
      </div>

      <div class="information">
        <div class="game-title sub">TERMS AND CONDITIONS</div>
        <p>Agent must complete requirements below to be eligible for the commission:</p>
        <p>>>> Must have 3 direct active players.</p>
        <p>>>> Direct players must have minimum 100 deposit and 500 valid bets in each period.</p>
        <div class="description">
          <div class="desc best">
            <img class="isDark" src="../assets/images/affiliate/best-service-dark.png" />
            <img class="isLight" src="../assets/images/affiliate/best-service-light.png" />
          </div>
          <div class="desc pro">
            <img class="isDark" src="../assets/images/affiliate/prof-team-dark.png" />
            <img class="isLight" src="../assets/images/affiliate/prof-team-light.png" />
          </div>
        </div>
        <div class="game-title sub">Important</div>
        <p>Strictly agent playing or registered under own link is not allowed.</p>
        <p>Agent and player must have 1 account and with own withdrawal bank or e-wallet.</p>
        <p>Same percentage with your agent or 5% below difference is not allowed.</p>
        <p>Always abide the rules for agent.</p>
        <p>Fraud activity is not allowed.</p>
        <p>Violating the rules result to forfeiture of commission.</p>
        <p>Agents and player must have one account only.</p>
        <p>Commission is released every Monday.</p>

        <div class="game-title sub">Reminder</div>
        <p>Play4win reserves the right to make final decision to protect the fair rights for all agents and players.</p>
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
        "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
      );
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Active Player",
        dataIndex: "activeUser",
        key: "activeUser"
      },
      {
        title: "Net profit(PHP)",
        dataIndex: "realProfit",
        key: "realProfit"
      },
      {
        title: "Commission(%)",
        dataIndex: "commission",
        key: "commission"
      }
    ];
    const dataSource = [
      {
        activeUser: "5",
        realProfit: "1-750,000",
        commission: "30%"
      },
      {
        activeUser: "10",
        realProfit: "750,001-1,500,000",
        commission: "35%"
      },
      {
        activeUser: "15",
        realProfit: "1,500,001-2,500,000",
        commission: "40%"
      },
      {
        activeUser: "25",
        realProfit: "2,500,001-3,500,000",
        commission: "45%"
      },
      {
        activeUser: "35",
        realProfit: "3,500,001-7,000,000",
        commission: "50%"
      },
      {
        activeUser: "50",
        realProfit: ">=7,000,001",
        commission: "55%"
      }
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      dataSource,
      affCode,
      regDevice,
      store,
      openWindow
    };
  }
});
</script>

<style scoped lang="scss">
.dark-theme {
  .wrapper {
    .affiliate {
      .game-subtitle {
        &.sub,
        &.small {
          color: #ffffff;
        }
      }
      .information .game-title {
        color: #ffffff;
      }
    }
  }
}
.dark-theme {
  .description {
    .isDark {
      display: block;
    }
    .isLight {
      display: none;
    }
  }
}
.light-theme {
  .description {
    .isDark {
      display: none;
    }
    .isLight {
      display: block;
    }
  }
}
.wrapper {
  // background-color: #dae6f8;
  // color: #000;
  background-image: url(../assets/images/index/centerbg.png);
  position: relative;
  .side-affiliate {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
  .affiliate {
    max-width: 1550px;
    margin: 0 auto;
    min-height: 90vh;
    width: 90%;
    padding: 40px 0 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .main-title {
      font-size: 60px;
      line-height: 70px;
      background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      background-size: 100%;
      background-repeat: repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-background-clip: text;
      -moz-text-fill-color: transparent;
      margin-bottom: 20px;
    }
    .game-title {
      &.sub {
        color: #2b2b82;
      }
    }
    .game-subtitle {
      &.sub {
        font-size: 35px;
        margin-bottom: 12px;
        color: #2b2b82;
        margin: 0;
        line-height: 39px;
        .yellow {
          color: #ffd600;
          font-size: 52px;
        }
      }
      &.small {
        font-size: 18px;
        color: #222222;
      }
    }
    .description {
      margin: 5px;
      display: flex;
      gap: 10px;
      .desc {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 10px;
        img {
          width: 150px;
        }
      }
    }
    .buttons {
      margin: 12px 0;
      display: flex;
      gap: 12px;
      .common-btn {
        box-shadow: 0px 3.1666667461395264px 3.9583334922790527px 0px #0b081d33 inset;

        box-shadow: 0px -3.1666667461395264px 3.9583334922790527px 0px #0b081d33 inset;

        min-width: 200px;
      }
    }
    .information {
      max-width: 1200px;
      width: 95%;
      text-align: left;
      .game-title {
        text-align: left;
        // margin: unset;
        margin: 15px 0 0;
      }
      p {
        font-size: 16px;
        color: #83a3ca;
        position: relative;
        padding-left: 20px;
        &:before {
          content: "";
          width: 8px;
          height: 8px;
          background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
          position: absolute;
          transform: rotateZ(45deg);
          left: 0px;
          top: 5px;
        }
      }
      ol {
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .terms {
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .table {
        :deep(.ant-table .ant-table-thead > tr > th) {
          text-align: center;
        }
      }
      .boxes {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        .box {
          flex: 1;
          background: $primary-linear-background;
          padding: 20px;
          border-radius: 5px;

          .bx-table {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
@media (max-width: 767px) {
  .wrapper {
    .affiliate {
      .description {
        // flex-direction: column-reverse;
      }
      .information {
        .boxes {
          flex-direction: column;
        }
      }
    }
  }
}
</style>

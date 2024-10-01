<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="top-banner">
        <div class="banner-text">
          <div class="banner-percentage">
            <img
              :src="
                $q.dark.isActive
                  ? require('../assets/affiliate/percemntage-banner-dark.png')
                  : require('../assets/affiliate/percentage-banner-light.png')
              "
            />
          </div>
          <div class="banner-best-life">
            <img
              :src="
                $q.dark.isActive
                  ? require('../assets/affiliate/best-life-banner-dark.png')
                  : require('../assets/affiliate/best-life-banner-light.png')
              "
            />
          </div>
          <div class="banner-comm">
            <img
              :src="
                $q.dark.isActive
                  ? require('../assets/affiliate/comm-banner-dark.png')
                  : require('../assets/affiliate/comm-banner-light.png')
              "
            />
          </div>
          <div class="banner-affiliate">
            <img src="../assets/affiliate/affiliate-banner.png" />
          </div>
        </div>
        <div class="banner-image">
          <div class="poker-image-box">
            <img src="../assets/affiliate/poker-banner.png" />
          </div>
        </div>
      </div>

      <div class="btn-box">
        <router-link to="/liveChat" name="live">
          <q-btn class="contact-us" unelevated>
            <img
              :src="
                $q.dark.isActive
                  ? require('../assets/affiliate/contact-us-dark.png')
                  : require('../assets/affiliate/contact-us-light.png')
              "
            />
          </q-btn>
        </router-link>
        <a @click="openAffiliateLink">
          <q-btn class="join-us" unelevated>
            <img src="../assets/affiliate/join-us.png" />
          </q-btn>
        </a>
      </div>

      <div class="description-box">
        <div class="best-service">
          <img
            :src="
              $q.dark.isActive
                ? require('../assets/affiliate/best-service-dark.png')
                : require('../assets/affiliate/best-service-light.png')
            "
          />
        </div>
        <div class="prof-team">
          <img
            :src="
              $q.dark.isActive
                ? require('../assets/affiliate/prof-team-dark.png')
                : require('../assets/affiliate/prof-team-light.png')
            "
          />
        </div>
      </div>

      <!-- <div class="buttons"> -->
      <!-- Action Required - Contact Us Link -->
      <!-- <a :href="'https://affilliate-web.xvpxsn9gfu.com/ph/register?agent=' + (affCode ? affCode : '')">
          <q-btn align="around" class="full-width">JOIN US</q-btn>
        </a>
        <a href="https://affilliate-web.xvpxsn9gfu.com/ph/login">
          <q-btn align="around" class="full-width">LOGIN</q-btn>
        </a>
        <router-link to="/liveChat" name="live">
          <q-btn align="around" class="full-width">CONTACT US</q-btn>
        </router-link> -->
      <!-- </div> -->

      <div class="information">
        <div class="tnc">TERMS AND CONDITIONS</div>
        <p>Agent must complete requirements below to be eligible for the commission:</p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Must have 3 direct active players.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Direct players must have minimum 100 deposit and 500 valid bets in each period.
        </p>

        <div class="tnc">Important</div>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Strictly agent playing or registered under own link is not allowed.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Agent and player must have 1 account and with own withdrawal bank or e-wallet.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Same percentage with your agent or 5% below difference is not allowed.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Always abide the rules for agent.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Fraud activity is not allowed.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Violating the rules result to forfeiture of commission.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Agents and player must have one account only.
        </p>
        <p>
          <img src="../assets/affiliate/pointer.png" />
          Commission is released every Monday.
        </p>

        <div class="tnc">Reminder</div>
        <p>Play4win reserves the right to make final decision to protect the fair rights for all agents and players.</p>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    const columns = ref([
      { name: "activeUser", label: "Active Player", field: "activeUser" },
      { name: "realProfit", label: "Net profit(PHP)", field: "realProfit" },
      { name: "commission", label: "Commission(%)", field: "commission" }
    ]);

    const openAffiliateLink = () => {
      window.open("https://affilliate-web.xvpxsn9gfu.com/ph/register?agent=" + (affCode ? affCode : ""), "_system");
    };

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

    return {
      columns,
      dataSource,
      affCode,
      openAffiliateLink
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  .affiliate {
    max-width: 1550px;
    margin: 0 auto;
    min-height: 90vh;
    padding: 0px 0 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .game-title {
      //background-image: linear-gradient(104.75deg, #8ec1f7 39.58%, #4183d3 109.58%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      &.sub {
        font-size: 30px;
        line-height: 33px;
      }
    }

    .top-banner {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    .banner-text {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.8rem;
      padding-left: 1rem;
      padding-top: 1rem;
      padding-bottom: 0.5rem;
    }
    .banner-percentage {
      display: flex;
      justify-content: flex-start;
      width: 100%;
    }
    .banner-best-life {
      display: flex;
      justify-content: flex-start;
      width: 100%;
    }
    .banner-comm {
      display: flex;
      justify-content: flex-start;
      width: 100%;
    }
    .banner-affiliate {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      padding-top: 0.7rem;
    }
    .banner-image {
      width: 100%;
      display: flex;
      position: relative;
      justify-content: flex-end;
    }
    .poker-image-box {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.8rem;
    }

    .btn-box {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.2rem;
      justify-content: center;
      height: 100%;
    }

    .contact-us {
      display: flex;
      width: 100%;
    }

    .join-us {
      display: flex;
      width: 100%;
    }

    .description-box {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 0.2rem;
      padding-top: 1.7rem;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .best-service {
      display: flex;
      width: 50%;
      justify-content: center;
      padding-left: 10px;
    }
    .prof-team {
      display: flex;
      width: 50%;
      justify-content: center;
      padding-right: 10px;
    }

    .description {
      width: calc(100% - 24px);

      margin: 15px 0px 10px;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      display: flex;
      gap: 10px;
      .desc {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        gap: 10px;
        img {
          width: 50px;
        }
      }
    }
    // .buttons {
    //   display: flex;
    //   flex-direction: column;
    //   margin: 12px auto;
    //   gap: 20px;
    //   width: 200px;

    //   .q-btn {
    //     background: linear-gradient(360deg, #a2d2ff -59.29%, #e0efff 72.14%);
    //     color: #000;
    //     font-weight: bold;
    //     filter: brightness(1);
    //   }
    // }
    .information {
      margin: 20px auto;
      max-width: 1200px;
      width: 90%;
      text-align: left;
      .game-title {
        text-align: left;
        margin: unset;
      }
      p {
        font-size: 12px;
        color: #83a3ca;
      }
      ol {
        color: #000;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .terms {
        color: #000;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .table {
        margin-bottom: 20px;
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
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
        .box {
          flex: 1;
          background: $primary-linear;
          padding: 20px;
          border-radius: 6px;
          color: #000;
          .bx-table {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .tnc {
      font-size: 15px;
      font-weight: 700;
      line-height: 24px;
      color: rgba(43, 43, 130, 0.8);
    }
  }
}
@media (max-width: 768px) {
  .wrapper {
    .affiliate {
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

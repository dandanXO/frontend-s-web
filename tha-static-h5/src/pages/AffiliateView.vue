<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title">Jolly88</div>
      <div class="game-title sub">{{ $t("lang.affiliate_program") }}</div>
      <div class="description">
        <div class="desc pro">
          <img src="../assets/images/affiliate/01.png" />
          <span>{{ $t("lang.the_most_professional_team") }}</span>
        </div>
        <div class="desc best">
          <img src="../assets/images/affiliate/02.png" />
          <span>{{ $t("lang.excellent_service") }}</span>
        </div>
      </div>
      <div class="buttons">
        <!-- Action Required - Contact Us Link -->
        <a
          :href="
            'https://affiliate-web.monemental.com/th/register?agent=' +
            (affCode ? affCode : '')
          "
        >
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{
            $t("lang.apply")
          }}</q-btn>
        </a>
        <a href="https://affiliate-web.monemental.com/th/login">
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{
            $t("lang.login")
          }}</q-btn>
        </a>
        <router-link to="/liveChat" name="live">
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{
            $t("lang.contact_us")
          }}</q-btn>
        </router-link>
      </div>
      <div class="steps">
        <div class="step">
          <div class="game-title">01</div>
          <div class="stepdesc">
            {{ $t("lang.stepdesc_1") }}
          </div>
        </div>
        <div class="step">
          <div class="game-title">02</div>
          <div class="stepdesc">
            {{ $t("lang.stepdesc_2") }}
          </div>
        </div>
        <div class="step">
          <div class="game-title">03</div>
          <div class="stepdesc">
            {{ $t("lang.stepdesc_3") }}
          </div>
        </div>
      </div>
      <div class="information">
        <div class="game-title sub">{{ $t("lang.affiliate_tnc_title") }}</div>
        <ol class="terms">
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_1") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_2_1") }}
              <br />
              {{ $t("lang.affiliate_tnc_para_2_2") }}
              <br />
              {{ $t("lang.affiliate_tnc_para_2_3") }} <br />
              {{ $t("lang.affiliate_tnc_para_2_4") }} <br />
              {{ $t("lang.affiliate_tnc_para_2_5") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_3") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_4") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_5") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_6") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_7") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_8") }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("lang.affiliate_tnc_para_9") }}
            </p>
          </li>
        </ol>
        <div class="table">
          <div class="game-title sub">{{ $t("lang.commission_table") }}</div>
          <a-table
            :pagination="false"
            :columns="columns"
            row-key="activeUser"
            :data-source="dataSource"
          />
        </div>
        <div class="game-title sub">
          {{ $t("lang.how_to_calculate_commission") }}
        </div>
        <p>
          {{ $t("lang.affiliate_calulate_para_1_1") }}
          <br />
          {{ $t("lang.affiliate_calulate_para_1_2") }}
          <br />
          {{ $t("lang.affiliate_calulate_para_1_3") }}
        </p>

        <div class="boxes">
          <div class="box">
            <p>{{ $t("lang.affiliate_example_a") }}</p>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_1_left") }}
              </div>
              <div class="rw-rgt">500,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_2_left") }}
              </div>
              <div class="rw-rgt">15,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_3_left") }}
              </div>
              <div class="rw-rgt">8%</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_4_left") }}
              </div>
              <div class="rw-rgt">8%</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_5_left") }}
              </div>
              <div class="rw-rgt">600,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left" style="white-space: nowrap;">
                {{ $t("lang.affiliate_example_a_table_6_left") }}
              </div>
              <div class="rw-rgt text-right">【500,000 - 15,000 - (600,000 x 8%) - (500,000 x 8%) 】=397,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_a_table_7_left") }}
              </div>
              <div class="rw-rgt">397,000x30%=119,100</div>
            </div>
          </div>
        </div>

        <p>&nbsp;</p>

        <div class="boxes">

          <div class="box">
            <p>{{ $t("lang.affiliate_example_b") }}</p>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_1_left") }}
              </div>
              <div class="rw-rgt">500,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_2_left") }}
              </div>
              <div class="rw-rgt">15,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_3_left") }}
              </div>
              <div class="rw-rgt">8%</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_4_left") }}
              </div>
              <div class="rw-rgt">8%</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_5_left") }}
              </div>
              <div class="rw-rgt">600,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left" style="white-space: nowrap;">
                {{ $t("lang.affiliate_example_b_table_6_left") }}
              </div>
              <div class="rw-rgt text-right">【500,000 - 15,000 - (600,000 x 8%) - (500,000 x 8%) 】=397,000</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">
                {{ $t("lang.affiliate_example_b_table_7_left") }}
              </div>
              <div class="rw-rgt">397,000x50%=198,500</div>
            </div>
          </div>


<!--          <div class="box">-->
<!--            <p>{{ $t("lang.affiliate_example_1") }}</p>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_1_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">200,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_2_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">300,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_3_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">60,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_4_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">5,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_5_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">3,600</div>-->
<!--            </div>-->

<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_6_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">(200,000*90%)-5,000-3,600=171,400</div>-->
<!--            </div>-->

<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_1_table_7_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">171,400*30%=51,420</div>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="box">-->
<!--            <p>{{ $t("lang.affiliate_example_2") }}</p>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_1_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">8,000,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_2_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">9,600,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_3_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">6,500,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_4_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">600,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_5_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">160,000</div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_6_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">-->
<!--                (8,000,000*90%)-600,000-160,000=6,440,000-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="bx-table">-->
<!--              <div class="rw-left">-->
<!--                {{ $t("lang.affiliate_example_2_table_7_left") }}-->
<!--              </div>-->
<!--              <div class="rw-rgt">6,440,000*55%=3,542,000</div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div class="game-title sub">{{ $t("lang.downline_partners_title") }}</div>
        <p>{{ $t("lang.downline_partners_para") }}</p>
        <div class="game-title sub">{{ $t("lang.steps_for_receiving_commission") }}</div>
        <ol>
          <li>
            <p>{{ $t("lang.affiliate_receiving_comm_step_1") }}</p>
          </li>
          <!-- <li><p>ค่าคอมมิชชั่นจะถูกจ่ายเป็นเงินไทยเท่านั้น</p></li> -->
          <li>
            <p>{{ $t("lang.affiliate_receiving_comm_step_2") }}</p>
          </li>
          <li>
            <p>{{ $t("lang.affiliate_receiving_comm_step_3") }}</p>
          </li>
          <li>
            <p>{{ $t("lang.affiliate_receiving_comm_step_4") }}</p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useUI } from "stores/ui";

export default defineComponent({
  setup() {
    const ui = useUI();
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    const columns = [
      {
        title: "ยูสเซอร์ที่เปิดใช้งาน",
        dataIndex: "activeUser",
        key: "activeUser",
      },
      {
        title: "ผลกำไรจริง",
        dataIndex: "realProfit",
        key: "realProfit",
      },
      {
        title: "คอมมิชชั่น",
        dataIndex: "commission",
        key: "commission",
      },
    ];
    const dataSource = [
      {
        activeUser: "5",
        realProfit: "1-250,000",
        commission: "30%",
      },
      {
        activeUser: "10",
        realProfit: "250,001-750,000",
        commission: "35%",
      },
      {
        activeUser: "15",
        realProfit: "750,001-1,500,000",
        commission: "40%",
      },
      {
        activeUser: "25",
        realProfit: "1,500,001-2,500,000",
        commission: "45%",
      },
      {
        activeUser: "35",
        realProfit: "2,500,001-5,000,000",
        commission: "50%",
      },
      {
        activeUser: "50",
        realProfit: ">=5,000,001",
        commission: "55%",
      },
    ];

    return {
      columns,
      dataSource,
      affCode,
      ui,
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
      width: 200px;
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
      flex-direction: column;
      max-width: 260px;
      gap: 10px;
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
      width: 90%;
      margin: 0 auto;
      text-align: left;
      .game-title {
        text-align: left;
        margin: unset;
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
        flex-direction: column;
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

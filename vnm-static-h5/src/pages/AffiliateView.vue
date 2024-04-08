<template>
  <div class="affiliate-container">
    <div class="page-title">{{ $t("lang.affiliate_title") }}</div>

    <div class="branding">
      <div class="branding-wrapper">
        <img class="hand-img" src="../assets/images/affiliate/hand.png" alt="" />
        <div class="desc-container">
          <div class="title">{{ $t("lang.affiliate_professionalteam") }}</div>
        </div>
      </div>
      <div class="branding-wrapper">
        <img class="headset-img" src="../assets/images/affiliate/headset.png" alt="" />
        <div class="desc-container">
          <div class="title">{{ $t("lang.affiliate_bestqualityservice") }}</div>
        </div>
      </div>
      <div class="branding-wrapper">
        <img class="vg-img" src="../assets/images/affiliate/vg.png" alt="" />
        <div class="desc-container">
          <div class="title">{{ $t("lang.affiliate_vgofficialpartner") }}</div>
        </div>
      </div>
    </div>

    <div class="ambassador">
      <img class="ambassador-img" src="../assets/images/affiliate/ambassador.png" alt="" />
      <div class="btn-wrapper">
        <q-btn
          :href="'https://vnm-affiliate.th80to83w1.com/login?agent=' + (affCode ? affCode : '')"
          :label="$t('lang.affiliate_joinus')"
          no-caps
          size="md"
          class="join-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
        </q-btn>
        <q-btn
          :href="'https://vnm-affiliate.th80to83w1.com/login?agent=' + (affCode ? affCode : '')"
          :label="$t('lang.affiliate_login')"
          no-caps
          size="md"
          class="login-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
        </q-btn>

        <q-btn
          @click.stop.prevent="
            openWindow(
              `https://csweb01.amv4xjcbd.com/?partnerId=7&lang=vn&way=${regDevice}&token=${store.token}`,
              'Chat Server',
              350,
              650
            )
          "
          :label="$t('lang.affiliate_contactus')"
          no-caps
          size="md"
          class="contact-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-white.png" alt="" />
        </q-btn>
      </div>
    </div>

    <div class="esport-commission">
      <div class="section-title">{{ $t("lang.affiliate_01_head_title") }}</div>
      <!-- <div class="subtitle">{{ $t("lang.affiliate_01_sub_title") }}</div> -->
      <ul>
        <li>{{ $t("lang.affiliate_01_para_01") }}</li>
        <li>
          {{ $t("lang.affiliate_01_para_02") }}
          <br />
          {{ $t("lang.affiliate_01_para_02_a") }}
          <br />
          {{ $t("lang.affiliate_01_para_02_b") }}
          <br />
          {{ $t("lang.affiliate_01_para_02_c") }}
          <br />
          {{ $t("lang.affiliate_01_para_02_d") }}
        </li>
        <li>{{ $t("lang.affiliate_01_para_03") }}</li>
        <li>{{ $t("lang.affiliate_01_para_04") }}</li>
        <li>{{ $t("lang.affiliate_01_para_05") }}</li>
        <li>{{ $t("lang.affiliate_01_para_06") }}</li>
        <li>{{ $t("lang.affiliate_01_para_07") }}</li>
        <li>{{ $t("lang.affiliate_01_para_08") }}</li>
        <li>{{ $t("lang.affiliate_01_para_09") }}</li>
        <li>{{ $t("lang.affiliate_01_para_10") }}</li>
      </ul>
    </div>

    <div class="table-commission">
      <div class="section-title">{{ $t("lang.affiliate_02_head_title") }}</div>
      <q-table
        flat
        :hide-pagination="true"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :rows-per-page-options="[0]"
      ></q-table>
      <!-- <div class="red-note">{{ $t("lang.affiliate_02_note") }}</div> -->

      <div class="section-title">{{ $t("lang.affiliate_03_head_title") }}</div>
      <div class="sample-container">
        <q-card-section style="font-size: 85%">
          <div>
            {{ $t("lang.affiliate_example_01a") }}
            <br />
            {{ $t("lang.affiliate_example_01b") }}
            <br />
            {{ $t("lang.affiliate_example_01c") }}
            <br />
            {{ $t("lang.affiliate_example_01d") }}
          </div>
          <div class="q-mt-md">{{ $t("lang.affiliate_example_01") }}</div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_01") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_02") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_03") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_04") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_05") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_06") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_01_text_07") }}</div>
          </div>

          <div class="q-mt-md">{{ $t("lang.affiliate_example_02") }}</div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_01") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_02") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_03") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_04") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_05") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_06") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_example_02_text_07") }}</div>
          </div>
        </q-card-section>
      </div>
      <!-- <div class="red-note">{{ $t("lang.affiliate_03_note") }}</div> -->

      <div class="section-title q-pt-md">{{ $t("lang.affiliate_04_head_title") }}</div>
      <div class="sample-container" style="font-size: 85%">
        <q-card-section>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_03_para_01") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_03_para_02") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_03_para_03") }}</div>
          </div>
          <div class="cell-wrapper">
            <div>{{ $t("lang.affiliate_03_para_04") }}</div>
          </div>
        </q-card-section>
      </div>

      <div class="section-title q-pt-md">{{ $t("lang.affiliate_05_head_title") }}</div>
      <div class="sample-container" style="font-size: 85%">
        <q-card-section>
          <ol style="padding-left: 20px">
            <li>{{ $t("lang.affiliate_04_para_01") }}</li>
            <li>{{ $t("lang.affiliate_04_para_02") }}</li>
            <li>{{ $t("lang.affiliate_04_para_03") }}</li>
            <li>{{ $t("lang.affiliate_04_para_04") }}</li>
            <li>{{ $t("lang.affiliate_04_para_05") }}</li>
          </ol>
        </q-card-section>
      </div>
    </div>

    <div class="contact-us">
      <div class="register-btn-wrapper">
        <q-btn
          :href="'https://vnm-affiliate.th80to83w1.com/login?agent=' + (affCode ? affCode : '')"
          :label="$t('lang.affiliate_apply_agency')"
          size="lg"
          no-caps
          class="register-btn"
        >
          <img class="mask-img" src="../assets/images/affiliate/register-btn-icon.png" alt="" />
          <img class="mask-img2" src="../assets/images/affiliate/register-btn-icon2.png" alt="" />
        </q-btn>
      </div>

      <div class="contact-info">
        <div class="title-wrapper">
          <div class="section-title">{{ $t("lang.affiliate_contactus") }}</div>
          <div class="two-four-hour-wrapper">
            <img class="two-four-mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
            <img class="two-four-mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
            <div
              class="two-four-content"
              @click.stop.prevent="
                openWindow(
                  `https://csweb01.amv4xjcbd.com/?partnerId=7&lang=vn&way=${regDevice}&token=${store.token}`,
                  'Chat Server',
                  350,
                  650
                )
              "
            >
              <img class="two-four-img" src="../assets/images/affiliate/headset-white.png" alt="" />
              <span class="two-four-text">{{ $t("lang.affiliate_online_cs") }}</span>
            </div>
          </div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">{{ $t("lang.affiliate_jointemail") }}</div>
          <div class="contact-id">vnaffiliates@tf88.com</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">{{ $t("lang.affiliate_jointskype") }}</div>
          <div class="contact-id">live:.cid.f284aa8f5c120ae5 ({{ $t("lang.affiliate_clicktocontact") }})</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">{{ $t("lang.affiliate_jointletstalk") }}</div>
          <div class="contact-id">+639278280893</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lang from "src/boot/lang";
import { userStore } from "../stores/index";
import { Platform } from "quasar";
import { useI18n } from "vue-i18n";

const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
  const left = (screen.width - popupWinWidth) * 2;
  const top = (screen.height - popupWinHeight) / 4;
  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
  );
};

const affCode = sessionStorage.getItem("AFFILIATE_CODE");
const regDevice = Platform.is.mobile ? "H5" : "WEB";
const store = userStore();
const { t } = useI18n();

const columns = [
  { name: "activeMember", label: t("lang.affiliate_activemember"), field: "activeMember", align: "center" },
  { name: "profit", label: t("lang.affiliate_profit"), field: "profit", align: "center" },

  { name: "commission", label: t("lang.affiliate_commission"), field: "commission", align: "center" }
];
const rows = [
  {
    name: t("lang.affiliate_bronze"),
    profit: "0~2 tỷ",
    activeMember: "5",
    commission: "40%"
  },
  {
    name: t("lang.affiliate_silver"),
    profit: "2.01 tỷ~3 tỷ",
    activeMember: "10",
    commission: "45%"
  },
  {
    name: t("lang.affiliate_gold"),
    profit: "3.01 tỷ~4 tỷ",
    activeMember: "25",
    commission: "50%"
  },
  {
    name: t("lang.affiliate_diamond"),
    profit: "More than 4 tỷ",
    activeMember: "50",
    commission: "55%"
  }
  // {
  //   name: t("lang.affiliate_crown"),
  //   profit: ">100W",
  //   activeMember: "80",
  //   commission: "55%"
  // }
];
</script>

<style lang="scss">
.affiliate-container {
  padding: 1.5rem;
  background: url("../assets/images/affiliate/page-bg.png");
  background-repeat: no-repeat;
  background-size: contain;

  .page-title {
    word-break: keep-all;
    text-align: center;
    text-shadow: 0px 5px 4px rgba(0, 0, 0, 0.47), 2px 2px 0px #9da6d4;
    // text-shadow: 0px 7.804098606109619px 7.804098606109619px rgba(0, 0, 0, 0.47),
    //   3.9020493030548096px 3.9020493030548096px 0px #9da6d4;
    // font-family: FZTanHeiS-B-GB;
    font-size: 3.46239rem;
    font-weight: 400;
    // color: #88d0f7;
    // background: url("../assets/images/affiliate/title-bg.jpeg"), lightgray 50% / cover no-repeat;
    // background-clip: text;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    // -moz-background-clip: text;
    // -moz-text-fill-color: transparent;
    // -webkit-text-stroke-width: 1px;
    // -webkit-text-stroke-color: #88d0f7;
  }

  .branding {
    display: flex;
    justify-content: space-between;
    padding: 0 1.25rem;
    margin: 1.25rem 0 2rem 0;

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
          color: $font-2;
          text-align: left;
          text-shadow: 1.1197850704193115px 1.1197850704193115px 0px #9da6d4;
          // font-family: FZTanHeiS-B-GB;
          font-size: 1rem;

          font-weight: 400;
          line-height: normal;
        }

        .desc {
          color: $font-2;
          text-align: left;
          // font-family: PingFang SC;
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
    padding: 0 1rem;
    align-items: center;

    .ambassador-img {
      width: 50%;
      height: 100%;
      display: block;
    }

    .btn-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 7.5rem;
      margin: 1.5rem 2rem 0 2rem;

      color: #fff;
      text-align: center;
      // font-family: PingFang SC;
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
        color: $font-1;

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
        color: $font-1;
        // font-family: PingFang SC;
        font-size: 0.75rem;
        // font-weight: 600;
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
      color: $font-2;
      // font-family: PingFang SC;
      font-size: 0.9rem;
      font-weight: 400;
    }
  }

  .table-commission {
    margin: 2rem 0 0 0;

    thead {
      th {
        font-size: 1.15rem;
        font-weight: 600;
        color: $font-2;
        border-bottom-width: 0;
      }
    }
    thead > :first-child {
      background: $lightblue;
    }

    td:not(:last-child) {
      border-right-width: 1px;
      border-color: #ecedf0;
    }

    td {
      color: $font-1;
      // font-family: PingFang SC;
      font-size: 1rem;
      font-weight: 400;
    }

    .red-note {
      color: $negative;
      // font-family: PingFang SC;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: normal;
      margin: 0.75rem 0;
    }

    .sample-container {
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
      padding: 1rem;

      color: $font-1;
      // font-family: PingFang SC;
      font-size: 1rem;

      font-weight: 400;
      line-height: 2;

      .cell-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        // font-family: PingFang SC;
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
          // width: 7rem;
          border-radius: 0.25rem;
          overflow: hidden;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          box-shadow: 0px 2.7097px 2.7097px 0px #93c7ff inset, 0px -2.16776px 2.16776px 0px #275ec1 inset;

          .two-four-mask {
            height: 2.5rem;
          }

          .two-four-content {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            padding: 6px 12px;

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
          color: $font-1;
          // font-family: PingFang SC;
          font-size: 1rem;
          font-weight: 400;
        }

        .contact-id {
          color: $grey-color;
          // font-family: PingFang SC;
          font-size: 1rem;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }

  .section-title {
    color: $primary;
    // font-family: PingFang SC;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: normal;
    margin: 1rem 0;
  }
}
</style>

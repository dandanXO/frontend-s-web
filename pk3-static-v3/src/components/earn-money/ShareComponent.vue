<template>
  <div class="share-banner-img"><img src="@/assets/images/earn-money/share-banner.png" /></div>
  <div class="qr-code-container">
    <div class="qr-code-bg"><VueQRCodeComponent id="the-qrcode" :size="150" :text="selfTgurl" class="qr-code" /></div>

    <div class="save-qr-btn" @click="downloadQRImg()">{{ $t("btn.save") }}</div>
    <div>
      {{ $t("earnMoney.share.inviteNewUsers") }}
    </div>
    <div class="copy-link-container">
      <img src="../../assets/images/earn-money/share-referral.png" />
      <div class="link-wrapper">
        <div class="link">{{ selfTgurl }}</div>
        <div class="vertical-separator"></div>
        <img src="../../assets/images/earn-money/share-copy-link.png" @click="copyShareLink(selfTgurl)" />
      </div>
    </div>
  </div>
  <div class="info-wrapper q-mt-md">
    <div class="info-container">
      <div class="info-row">
        <div class="info-content-item longer-item">
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-invited.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.share.totalInvited") }}:</div>
              <div class="info-amount">{{ shareData.total }}</div>
            </div>
          </div>
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-valid-invites.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.share.validInvites") }}:</div>
              <div class="info-amount">{{ shareData.valid }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-content-item longer-item">
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-valid-invite-today.png" /></div>
              <div class="info-txt">
                {{ $t("earnMoney.share.validInvitationsToday_01") }}
                <br />
                {{ $t("earnMoney.share.validInvitationsToday_02") }}:
              </div>
              <div class="info-amount">{{ shareData.todayValid }}</div>
            </div>
          </div>
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-today-bonus.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.share.todaysBonus") }}:</div>
              <div class="info-amount">{{ store.currency.value }} {{ shareData.todayRebate }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-content-item longer-item">
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-current-lvl.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.share.currentLevel") }}:</div>
              <div class="info-amount">{{ shareData.rebateLevel }}</div>
            </div>
          </div>
          <div class="longer-group">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-current-bonus-lvl.png" /></div>
              <div class="info-txt">
                {{ $t("earnMoney.share.currentBonusLevel_01") }}
                <br />
                {{ $t("earnMoney.share.currentBonusLevel_02") }}:
              </div>
              <div class="info-amount">{{ store.currency.value }} {{ shareData.rebateAmount }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-content-item longer-item">
          <div class="longer-group-no-divide">
            <div class="info-title f-wrap">
              <div class="info-icon"><img src="../../assets/images/earn-money/share-bonus-claimed.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.share.bonusClaimed") }}:</div>
              <div class="info-amount">{{ shareData.totalRebate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="share-title-separator"></div>
  <div class="share-title">{{ $t("earnMoney.share.fixedInvitationBonus") }}</div>
  <div class="share-title-separator"></div>

  <q-table
    flat
    :hide-pagination="true"
    :rows-per-page-options="[0]"
    class="table-container q-my-md"
    :columns="columns2"
    :rows="rows2"
    row-key="name"
    dense
  ></q-table>
  <ul>
    <li class="dot-style">{{ $t("earnMoney.share.point_01_bonus") }}</li>
  </ul>

  <div class="share-title-separator"></div>
  <div class="share-title">{{ $t("earnMoney.share.remark") }}</div>
  <div class="share-title-separator"></div>

  <ul>
    <li class="dot-style">{{ $t("earnMoney.share.point_01_remark") }}</li>
    <li class="dot-style">{{ $t("earnMoney.share.point_02_remark") }}</li>
    <li class="dot-style">{{ $t("earnMoney.share.point_03_remark") }}</li>
  </ul>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { api, eventapi } from "@/boot/axios";
import { t } from "@/boot/lang";
import { userStore } from "@/stores/index";
import { useRoute } from "vue-router";
import { Platform, useQuasar } from "quasar";
import VueQRCodeComponent from "vue-qrcode-component";
import { Directory, Filesystem } from "@capacitor/filesystem";
import html2canvas from "html2canvas";

const store = userStore();
const route = useRoute();
const $q = useQuasar();

const columns2 = [
  {
    name: "level",
    label: t("earnMoney.share.table_col_invite"),
    field: "level",
    align: "center"
  },
  {
    name: "betAmount",
    label: t("earnMoney.share.table_col_reward"),
    field: "betAmount",
    align: "center"
  }
];
const rows2 = [
  {
    level: "1",
    betAmount: 200
  },
  {
    level: "2 ~ 50",
    betAmount: 250
  },
  {
    level: "51 ~ 150",
    betAmount: 300
  },
  {
    level: "151 ~ 1000",
    betAmount: 350
  },
  {
    level: "1001 ~ 5000",
    betAmount: 400
  },
  {
    level: "5001 ~ 15000",
    betAmount: 450
  },
  {
    level: "15001 ~ 50000",
    betAmount: 550
  },
  {
    level: "50001 ~ 100000",
    betAmount: 700
  },
  {
    level: "100001 ~ 150000",
    betAmount: 850
  },
  {
    level: "150001+",
    betAmount: 1000
  }
];

const selfTgurl = ref("");
const shareData = ref({
  total: 0,
  valid: 0,
  todayValid: 0,
  todayRebate: 0,
  rebateLevel: 0,
  rebateAmount: 0,
  totalRebate: 0
});
const copyinput = ref(null);
const text_copied = ref("");

const copyShareLink = (text) => {
  text_copied.value = text;
  setTimeout(() => {
    const copyText = copyinput.value;

    copyText.select();
    document.execCommand("copy");

    $q.notify({
      color: "positive",
      position: "top",
      message: `${selfTgurl.value} ${t("earnMoney.earn.copiedtoClipboard")}`,
      icon: "check_circle_outline"
    });
  }, 100);
};

const downloadQRImg = async () => {
  if (route.path === "/wv-earn-money") {
    if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
      try {
        html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
          document.body.appendChild(canvas);
          const dataUrl = canvas.toDataURL("image/jpeg");

          window.flutter_inappwebview.callHandler("downloadBase64Image", dataUrl);

          setTimeout(() => {
            canvas.style.display = "none";
          }, 750);
        });
      } catch (e) {}
    }
  } else if (Platform.is.capacitor && Platform.is.android) {
    try {
      html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
        document.body.appendChild(canvas);
        const dataUrl = canvas.toDataURL("image/jpeg");
        // console.log(dataUrl);

        // Save the image to the photo gallery
        await Filesystem.writeFile({
          path: `Pictures/myreferral.jpg`,
          data: dataUrl,
          directory: Directory.Documents,
          recursive: true
        });

        console.log("QR Code image saved to gallery.");

        $q.notify({
          color: "positive",
          position: "top",
          message: "QR Code image saved to photo gallery.",
          icon: "check_circle_outline"
        });

        canvas.style.display = "none";
      });
    } catch (error) {
      console.error("Error saving QR Code image:", error);
    }
  } else {
    const link = window.document.createElement("a");
    const imgElement = document.querySelector('img[alt="Scan me!"]');
    link.href = imgElement.src;
    link.download = "myreferral";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const getShareInitData = () => {
  eventapi
    .get("/privi/ind-refer-rebate")
    .then((res) => {
      if (res.code === 0) {
        shareData.value = res.data;
      }
    })
    .catch(() => {});
};

const getReferralCode = () => {
  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) selfTgurl.value = tgDomain + "refer/" + res.data;
  });
};
onMounted(() => {
  getShareInitData();
  getReferralCode();
});
</script>
<style scoped lang="scss">
.share-banner-img {
  img {
    width: 100%;
  }
}
.info-wrapper {
  .info-container {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    .info-row {
      display: flex;
      background: linear-gradient(180deg, rgba(139, 54, 248, 0.4) 0%, rgba(51, 74, 214, 0.4) 100%);
      border-radius: 12px;
      margin-bottom: 15px;

      > * {
        &:first-child {
          margin-right: 7.5px;
        }

        &:nth-child(2) {
          margin-left: 7.5px;
        }
      }
    }

    .info-content-item {
      width: 100%;

      padding: 20px 12px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      position: relative;

      &.line-side:before {
        content: "";
        position: absolute;
        width: 1px;
        height: calc(100% - 20px);
        background: rgba(255, 255, 255, 0.25);
        right: -10px;
        top: 10px;
      }
      &.longer-item {
        flex-direction: row;

        > * {
          &:first-child {
            margin-right: 18px;
          }

          &:nth-child(2) {
            margin-left: 18px;
          }
        }

        .longer-group {
          flex: 1;
          position: relative;

          &:first-child:before {
            content: "";
            position: absolute;
            width: 1px;
            height: calc(100% + 20px);
            background: rgba(255, 255, 255, 0.25);
            right: -20px;
            top: -10px;
          }
        }

        .longer-group-no-divide {
          flex: 1;
          position: relative;
        }

        .info-amount {
          padding-top: 0;
        }
      }

      &.last-item {
        padding-top: 16px;
        padding-bottom: 16px;

        .info-amount {
          padding-top: 0;
        }
      }

      .info-amount {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 1.35rem;
        font-weight: 700;
        margin-left: auto;
        margin-top: auto;
        padding-top: 12px;

        @media screen and (max-width: 470px) {
          font-size: 1.15rem;
          margin: 0;
          margin-left: auto;
        }

        &.font-smaller {
          font-size: 12px;
          margin-bottom: 2px;
          font-weight: 400;

          span {
            display: none;
          }
        }
      }

      .info-title {
        display: flex;
        gap: 8px;

        &.f-wrap {
          flex-wrap: wrap;
        }
      }

      .info-icon {
        img {
          display: block;
          width: 27px;
        }
      }

      .info-txt {
        align-content: center;
        font-weight: 700;
        font-size: 0.9rem;

        @media screen and (max-width: 390px) {
          font-size: 0.85rem;
        }
        @media screen and (max-width: 370px) {
          font-size: 0.75rem;
        }
      }
    }
  }
}

.qr-code-container {
  background: linear-gradient(180deg, rgba(139, 54, 248, 0.4) 0%, rgba(51, 74, 214, 0.4) 100%);
  border-radius: 12px;
  padding: 12px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  .qr-code-bg {
    border-radius: 0.625rem;
    background-color: #fff;
    padding: 10px;
    margin-top: 4px;
    > img {
      width: 40%;
      min-width: 120px;
    }
  }

  .save-qr-btn {
    background-color: #5c46e7;
    border-radius: 6px;
    width: 40%;
    min-width: 160px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
  }
}

.share-title {
  background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  height: 50px;
  line-height: 50px;
  margin: 1px 0;
}

.share-title-separator {
  background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
  height: 2px;
}

ul {
  padding-inline-start: 1rem;

  li {
    list-style-type: decimal;
    font-size: 0.95rem;
    line-height: 1.25rem;
    text-align: left;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 0.75rem 0;
  }

  .dot-style {
    list-style-type: disc;
    letter-spacing: 0.5px;
    line-height: 1.7;
  }
}

:deep(.q-table__container) {
  background: transparent !important;
  border-radius: 12px;
}
.table-container {
  :deep(thead) {
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  }

  :deep(tbody) {
    background: #652c93;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    tr {
      &:nth-child(2n) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: #502175;
      }
    }
  }

  :deep(thead) {
    th:nth-child(3) {
      white-space: normal;
    }
  }

  .text-center {
    font-size: 0.95rem;
    font-weight: 700;
    width: 2rem;
    border-bottom-width: 0;
    border-right-width: 1px;
    border-color: black;
    padding: 0 0.25rem;
  }
}

.copy-link-container {
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 8px;
  > img {
    width: 27px;
    height: 27px;
    margin: 0 6px;
  }
  .link-wrapper {
    background: linear-gradient(325.86deg, #1e1236 5.38%, #2f1661 98.11%);
    border: 2px solid #3f237a;
    // border-image-source: linear-gradient(148.87deg, #7753c2 -14.01%, #3f237a 51.97%, #7753c2 115.36%);
    border-radius: 6px;
    box-shadow: 0px 0px 20px 0px #b479ff40 inset;
    width: calc(100% - 50px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    > img {
      width: 16px;
      height: 16px;
    }
    .vertical-separator {
      width: 1px;
      background-color: #c29bff;
      margin: 0 1rem;
      height: 50%;
    }
    .link {
      width: calc(100% - 40px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

<template>
  <div>
    <q-btn class="receive-earn-btn" no-caps @click="claimPromo">
      <img src="../../../assets/images/promotion/receive-earn/receive-earn-icon.png" />
      &nbsp;&nbsp;Participar Agora
    </q-btn>

    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          Duração
        </div>
        <div class="bar-desc">Válida por tempo indeterminado</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          Elegibilidade
        </div>
        <div class="bar-desc">Todos os membros que já fizeram pelo menos um depósito com sucesso</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          Descrição
        </div>
        <div class="bar-desc">Os membros podem receber um bônus de 100% sobre o valor do segundo depósito.</div>
      </div>
    </div>

    <div class="promo-subtitle">Regras da Promoção</div>

    <div class="tnc-content">
      <ol>
        <li>Cada membro pode aproveitar este bônus de recarga uma única vez.</li>
        <li>Não é possível solicitar saques antes que o bônus seja creditado na conta.</li>
        <li>
          Para participar desta promoção, os membros devem enviar uma solicitação clicando no botão “Participar Agora”
          nesta página.
        </li>
        <li>
          O valor do depósito e o bônus devem ser apostados pelo menos 36 vezes antes de ser possível realizar um saque.
        </li>
        <li>
          Para evitar qualquer mal-entendido, a AKB188 reserva-se o direito final de interpretação desta promoção.
        </li>
      </ol>
    </div>
  </div>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
    <div class="congrats-wrapper">
      <div class="congrats-container">
        <div class="congrats-highlight">+ {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>
        <div class="congrats-txt">{{ $t("hotPromo.youGet") }} {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>

        <div class="congrats-btns">
          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-cancel">
            {{ $t("btn.cancel") }}
          </q-btn>

          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-confirm">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { userStore } from "src/stores";
import { computed, ref, onMounted } from "vue";
import { api, eventapi } from "boot/axios";
import { useRouter } from "vue-router";

const promoInfo = ref({});

const loadPromoInit = () => {
  eventapi
    .get("/session/deposit-bonus/init?promoCode=br2-ftd-bonus")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        const { data } = res;
        promoInfo.value = data;
      }
    })
    .catch((e) => {});
};

const router= useRouter();

const claimPromo = () => {
  // router.push("/deposit")
  eventapi
    .post("/session/deposit-bonus/claim?promoCode=br2-ftd-bonus")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        showPrizePopup.value = true;
        prizeAmount.value = res.data;
      }
    })
    .catch((e) => {});
};

const showPrizePopup = ref(false);
const prizeAmount = ref();

onMounted(() => {
  loadPromoInit();
});
</script>

<style lang="scss" scoped>
.money-rain-dialog {
  .money-rain-bg {
    background-image: url(../../../assets/images/promotion/receive-earn/money-rain-img.png);
    background-size: 100% 100%;
    z-index: 0;
    img {
      display: block;
      width: 100%;
      max-width: 400px;
    }
  }

  .money-rain-box {
    margin-top: -40px;
    background-image: url(../../../assets/images/promotion/receive-earn/money-rain-box.png);
    background-size: 100% 100%;
    z-index: 1;
    position: relative;
    width: 100%;
    max-width: 400px;

    img {
      display: block;
      width: 100%;
      max-width: 400px;
    }

    .money-rain-content {
      display: flex;
      padding: 16px;
      position: absolute;
      top: 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;

      img {
        display: block;
        width: 100%;
        max-width: 200px;
        margin: auto;
      }

      .content-reward {
        background: #00a919;
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-flex;
        font-weight: 900;
        margin: auto;
      }

      .content-reward-txt {
        color: #e66c3f;
        font-weight: lighter;
      }
    }
  }

  .money-rain-confirm {
    img {
      display: block;
      width: 100%;
      max-width: 140px;
      margin: 20px auto;
    }
  }
}

.receive-earn-btn {
  background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  width: 100%;
  border-radius: 8px;
  color: #2d2d2d;
  font-weight: bold;

  img {
    width: 34px !important;
  }
}

.receive-bar-container {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .receive-bar {
    background: #1f241f;
    border: 1px solid #4b4943;
    padding: 48px 12px 8px;
    position: relative;
    border-radius: 6px;

    .bar-ribbon {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      display: inline-flex;
      padding: 8px;
      height: 34px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      color: #2d2d2d;
      font-weight: bold;
      align-items: center;
      position: absolute;
      top: 12px;
      left: 0;
      img {
        display: block;
        margin-right: 8px;
      }
    }

    .bar-desc {
      padding: 8px;
    }
  }
}

.promo-subtitle {
  margin-top: 24px;
  text-transform: uppercase;
  font-weight: 900;
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
  font-style: italic;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;

  &:before {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    margin-right: 8px;
    margin-top: 4px;
  }

  &:after {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    transform: scaleX(-1);
    margin-left: 8px;
    margin-top: 4px;
  }
}

.tnc-content {
  ol li {
    margin-bottom: 8px !important;
  }

  .tnc-time-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
    margin-left: -12px;
    .tnc-time {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ffe6a1;
      margin-left: 12px;

      // &:first-child {
      //   margin-left: 0;
      // }

      &:before {
        content: "";
        background-image: url(../../../assets/images/promotion/receive-earn/icon-clock.svg);
        height: 11px;
        width: 11px;
        display: block;
        background-size: cover;
        margin-bottom: 2px;
      }
    }
  }
}

.congrats-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: url(../../assets/images/index/money-rain/congrats-bg.png) no-repeat top center;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  background-size: contain;
  flex-direction: column;
  gap: 20px;
  // padding-top: 100px;
}
.congrats-head {
  margin-top: -100px;
  font-family: "Poppins";
  font-weight: 900;
  font-size: 2.4rem;
  line-height: 3.4rem;
  max-width: 300px;
  letter-spacing: 0px;
  text-align: center;
  color: #ffd288;
}
.congrats-container {
  position: relative;
  background: url(../../../assets/images/promotion/receive-earn/congrats-modal.png) no-repeat center center;
  background-size: contain;
  width: 100%;
  height: 470px;
  .congrats-highlight {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 3rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #10d16f;
    margin-top: 280px;
  }

  .congrats-txt {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 1rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #2d2d2d;
    margin-top: 20px;
  }
  .congrats-button {
    position: absolute;
    bottom: 11.5%;
    left: 0;
    right: 0;
    margin: auto;
    font-family: Poppins;
    font-weight: 700;
    font-size: 26.48px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #ffffff;
  }

  .congrats-btns {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    .btn-cancel {
      border: 1px solid #10d16f;
      color: #2d2d2d;
    }
    .btn-confirm {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      color: #ffffff;
    }
  }
}
</style>

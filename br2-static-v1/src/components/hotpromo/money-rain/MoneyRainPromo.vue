<template>
  <div>
    <q-btn class="receive-earn-btn" no-caps @click="openMoneyRainDialog">Participar Agora</q-btn>

    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          Duração
        </div>
        <div class="bar-desc">Longo prazo (contínuo)</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          Elegibilidade
        </div>
        <div class="bar-desc">Todos os membros que fizeram pelo menos um depósito com sucesso</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          Descrição
        </div>
        <div class="bar-desc">Distribuição de envelopes vermelhos (chuva de dinheiro) em horários programados</div>
      </div>
    </div>

    <div class="promo-subtitle">Termos e Condições</div>

    <div class="tnc-content">
      <ol>
        <li>Todos os membros que fizeram um depósito com sucesso podem participar.</li>
        <li>
          De 1 a 7 de cada mês, de segunda a quinta-feira, três rodadas de chuva de dinheiro serão distribuídas diariamente nos seguintes horários:
        </li>
        <div class="tnc-time-container">
          <div class="tnc-time">12:00 - 12:59</div>
          <div class="tnc-time">18:00 - 18:59</div>
          <div class="tnc-time">21:00 - 21:59</div>
        </div>

        <li>
          De 1 a 7 de cada mês, de sexta a domingo, seis rodadas de chuva de dinheiro serão distribuídas diariamente nos seguintes horários:
        </li>
        <div class="tnc-time-container">
          <div class="tnc-time">12:00 - 12:59</div>
          <div class="tnc-time">14:00 - 14:59</div>
          <div class="tnc-time">16:00 - 16:59</div>

          <div class="tnc-time">18:00 - 18:59</div>
          <div class="tnc-time">20:00 - 20:59</div>
          <div class="tnc-time">21:00 - 21:59</div>
        </div>

        <li>Cada sessão de Chuva de Dinheiro é distribuída gratuitamente com R$100.000.</li>
        <li>O valor máximo de uma única queda é de R$7.777.</li>
        <li>O dinheiro recebido pode ser usado para jogar ou retirado diretamente.</li>
        <li>Quanto maior o seu nível de membro VIP (consulte o programa de upgrade VIP), maior o valor recebido.</li>
        <li>Para evitar qualquer mal-entendido, a AKB188 reserva-se o direito final de interpretação desta promoção.</li>
      </ol>
    </div>
  </div>

  <q-dialog v-model="moneyRainDialog" persistent>
    <div class="money-rain-dialog">
      <div class="money-rain-bg"><img src="../../../assets/images/promotion/receive-earn/money-rain-img-bg.png" /></div>
      <div class="money-rain-box">
        <img src="../../../assets/images/promotion/receive-earn/money-rain-box-bg.png" />
        <div class="money-rain-content">
          <div><img src="../../../assets/images/promotion/receive-earn/money-rain-congratulations.png" /></div>

          <div class="content-reward">+R$ 100</div>

          <div class="content-reward-txt">Você recebeu R$100</div>
        </div>
      </div>

      <div class="money-rain-confirm" @click="moneyRainDialog = false">
        <img src="../../../assets/images/promotion/receive-earn/money-rain-confirm.png" />
      </div>
    </div>
  </q-dialog>

</template>

<script setup>
import { onMounted, ref } from "vue";

const moneyRainDialog = ref(false);

const openMoneyRainDialog = () => {
  moneyRainDialog.value = true;
};
</script>

<style lang="scss" scoped>
.money-rain-dialog {
  // background-image: url(../../../)

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
  background: linear-gradient(180deg, #419f74 0%, #1d3f31 100%);
  width: 100%;
  color: #fff;
  border-radius: 50px;
  font-weight: 500;
  border: 1.5px solid #e0c4a8;
  box-shadow: 0px 4px 4px 0px #ffffff66 inset;
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
</style>

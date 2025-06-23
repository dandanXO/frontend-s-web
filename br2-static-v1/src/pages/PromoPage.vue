<template>
  <!-- <q-card-section class="page-title">优惠活动</q-card-section> -->
  <ProfileSummary v-if="!extensionState" :homeProfile="true" />
  <div class="vip-promo-tab-wrapper" v-if="!isPromoDetail">
    <q-tabs
      v-model="vipPromoTab"
      dense
      no-caps
      class="vip-promo-tab-toggle"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab name="promo" :label="$t('header.promotion')" />
      <q-tab name="vip" :label="$t('header.vip')" />
    </q-tabs>
  </div>

  <div class="promo-container" v-touch-swipe.left="swipeLeft" v-touch-swipe.right="swipeRight">
    <div class="promo">
      <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify">
        <!-- <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.name" :label="tab.label" /> -->
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
              <div class="promo-list-wrapper">
                <div
                  v-for="(promo, i) in filteredArray"
                  :key="i"
                  data-aos="zoom-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="1000"
                >
                  <div class="promo-item" v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                          <!-- <img class="promo-content" src="../assets/images/promotion/tempo/promo-1.png" /> -->
                        </div>
                      </div>
                    </a>
                  </div>

                  <div class="promo-item" v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                          <!-- <img class="promo-content" src="../assets/images/promotion/tempo/promo-1.png" /> -->
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-else class="selected-promo" :class="{ 'no-padding': selectedParam.hidetitle }"> -->
          <div v-else class="selected-promo">
            <div v-if="isFetchingPromo" class="spinner-container">
              <q-spinner color="yellow" size="70px" :thickness="5" />
            </div>
            <div class="selected-promo-wrapper">
              <q-btn dense rounded icon="close" class="back-btn text-white" size="16px" @click="backToPromoList()" />
              <div v-if="selectedPromo.redirectUrl !== 'spin-lucky-wheel'" class="banner-container">
                <img
                  class="promo-content"
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                  style="display: block; width: 100%"
                />
              </div>
              <div
                class="inner"
                :class="{
                  isSpinLuckyWheel: selectedPromo.redirectUrl === 'spin-lucky-wheel',
                  envelope:
                    selectedPromo.redirectUrl === 'spin-lucky-wheel' && ui.promoBg === 'spin-lucky-wheel-envelope',
                  wheel: selectedPromo.redirectUrl === 'spin-lucky-wheel' && ui.promoBg === 'spin-lucky-wheel'
                }"
              >
                <div
                  v-if="selectedPromo.promoType"
                  :class="{
                    welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino: selectedPromo.promoType.toLowerCase() === 'live casino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                  }"
                >
                  <div class="top-float" v-if="!selectedParam || (selectedParam && !selectedParam.hidefloat)">
                    <div class="top-subtitle" v-if="selectedPromo.subtitle">{{ selectedPromo.subtitle }}</div>
                    <div class="top-title">{{ selectedPromo.title }}</div>
                  </div>
                  <div class="promo-content-inner" v-if="!selectedParam || (selectedParam && !selectedParam.hidetitle)">
                    <div class="content-title">{{ selectedPromo.title }}</div>
                  </div>

                  <div
                    class="hot-promo-div"
                    :class="{
                      isSpinLuckyWheel: selectedPromo.redirectUrl === 'spin-lucky-wheel'
                    }"
                    v-if="selectedPromo.hasPromo"
                  >
                    <HotPromotion :list="selectedPromo" />
                  </div>
                  <div v-if="selectedPromo.redirectUrl !== 'spin-lucky-wheel'">
                    <div v-html="selectedPromo.pageContent"></div>
                  </div>

                  <div
                    class="join-container"
                    v-if="!selectedParam || (selectedParam && !selectedParam.hidebottom)"
                    :style="{
                      bottom: extensionState ? '0' : `calc(72px + ${ui.bottomInsetHeight}px)`
                    }"
                  >
                    <div class="promo-date">
                      <div class="date-txt">{{ $t("promo_page.promotionEnds") }}</div>
                      <div class="date-timer">
                        <img src="../assets/images/promotion/timer-icon.svg" alt="" />
                        <q-icon name="all_inclusive" size="22px"></q-icon>
                      </div>
                    </div>
                    <q-btn
                      class="btn-join-now"
                      :class="isFtdPromoEnded ? 'btn-disabled' : ''"
                      :disable="isFtdPromoEnded"
                      no-caps
                      :label="$t('promo_page.joinNow')"
                      @click="goToJoinNow()"
                    />
                  </div>

                  <!-- <div class="join-container">
                    <div class="promo-date">
                      <div class="date-txt">Promotion Ends</div>
                      <div class="date-timer">01/01/2024</div>
                    </div>
                    <q-btn class="btn-join-now" no-caps label="Join Now" />
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <GameModal
    v-if="route.path !== '/account/profile'"
    ref="allGames"
    :closeFullGameDialog="closeFullGameDialog"
  ></GameModal>

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-center">
      <q-card-section class="q-mb-md">
        <strong>System Prompt</strong>
        <br />
        <br />
        Please log in before performing the operation
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn label="Login" color="primary" />
      </router-link>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-if="isOpenExtension" v-model="isOpenExtension" class="dark-grey-dialog">
    <div class="dialog-mid-text">Loading...</div>
  </q-dialog>
</template>

<script lang="js">
import { Filesystem, Directory } from "@capacitor/filesystem";
import {ref, defineComponent, computed, reactive, watch, onBeforeUnmount, onActivated, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";
import {isAndroid} from "boot/utils";
import { SessionStorage } from "quasar";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";
import ProfileSummary from "components/ProfileSummary.vue";
import HotPromotion from 'components/HotPromotion'
import GameModal from "components/modal/GameModal.vue";
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    GameModal,
    HotPromotion,
    ProfileSummary
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + '/promo/';
    // const imgURL =  '../assets/images/promotion/tempo/';
    const banner = ref([]);
    const vipPromoTab = ref("promo");
    const promoState = reactive({
      active: {value: 'ALL', label: 'ALL'},
      promoList: [],
    });
    const promoTypes = ref([
      {code: "ALL", img: 'all', label: '所有游戏'},
      {code: "ESPORTS", img: 'esport', label: '电竞'},
      {code: "SPORTS", img: 'sport', label: '体育'},
      {code: "POKER", img: 'poker', label: '棋牌'},
      {code: "LIVE CASINO", img: 'live', label: '真人娱乐'},
      {code: "FISH", img: 'game', label: '老虎机/捕鱼'},
    ]);
    const promoTabActive = ref(promoTypes.value[0].value);
    const filteredArray = ref([
  //     {
  //   "id": 525,
  //   "title": "Girar a Roda da Sorte",
  //   "desktopImgUrl": "18/233913cb-58ff-4d0b-80a5-64e08086722e.png",
  //   "desktopImgUrlDark": null,
  //   "desktopImgBackgroundUrl": null,
  //   "desktopImgBackgroundUrlDark": null,
  //   "mobileImgUrl": "promo-1.png",
  //   "mobileImgUrlDark": null,
  //   "mobileImgBackgroundUrl": null,
  //   "mobileImgBackgroundUrlDark": null,
  //   "desktopBannerUrl": "18/c4159958-25ef-45e5-bff4-01ffca5d516d.png",
  //   "desktopBannerUrlDark": null,
  //   "mobileBannerUrl": "promo-1.png",
  //   "mobileBannerUrlDark": null,
  //   "redirectUrl": "promo1",
  //   "labelType": 0,
  //   "promoType": "VIP",
  //   "pageContent": "<div bis_skin_checked=\"1\">\n        <div style=\"\n            display: flex;\n            align-items: center;\n            background: #42B9E440;\n            justify-content: flex-start;\n            border-radius: 4px;\n            padding: 2px 6px;\n            gap: 6px;\n            margin-top: 10px;\n          \" bis_skin_checked=\"1\">\n          <img style=\"width: 29px; height: 29px\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAMAAABhTZc9AAABzlBMVEUAAAD7g0r+3tf/0cD/vX7/toD/uXv9klr/1rz/ybL/v4j/sIj+pW3/2NH/z5P/zLz+tYT9nmf/m137mnj7nnX9m27/yIH+29b93dX7jmX5fEn+18j/4cP91MD+yrf9rHT6g0/+18j+z8L+qW//zZX/wov/wG7/vG//s3j/27D+28v/zLX/0Lj/4sX+07v/z5f/zIn+tHj7nYD/0av/0LX9vJP/zqH9mVL4gE7/xKT/vpv90rr5jlz/yYD/1qj/x6H/zpj/mFD/pnn/5tb/z4v/sIL/2LL/xpP/wn7/tY3/1rj/rnT/yYz/jUL/pGT/z5X0gFX/sYD/i0j/r4r/j0D/vXv/oYb/v3D/v0D/+/z/9vf/+vr/9/j/+Pn/9fX/8/X//v7/8vP//P3/7u//8PH/+fr+5uf+18/+6+z/7ev+4uT9297+39r+3tj+5OP+3uD92tz9zML/unL/8vD+7Oj+6ef+497+4N392Nb92s3+08z/2MH+0rz/zrn/0Z77r5n/t4v+sn76mX7/p2r95eD90Mf+y7j7w7j7xLX/1a7/1qH/xZ//yZn/uZT/x43+u4z8sYT/qoT/yYP/wXv9q3j/r3X8qHX/sXD/tGv/rGZ+Fbx0AAAAWXRSTlMA/fzeQDn+/ODBsHFuIyD+/v7+/fz8+vf08/Hw7+/v7+/s5uXf39/c2dPPz8e/v7+4sq6ro6Cbm5qUlI2If3BkY2NfXVpaVlBPTERCPjo4NTAuLiMgHxMQBL4QruoAAAGASURBVCjPxcllUysxFIDhtLT45bob7u7u7g5Zy2Z96y3u7u7wb+kytA39zvBMcmbOecHbmqjL+pPX8rwMtFomyTiW4TtdPViKAxVNIKFg9fAyvZOosZEPdx++/IpvzCyy1t5G+u59x93BOLK+9Wnj4/Wy06W45v6em6K2bo6ig9V6EWXaWHIhyEu8wCkrZ+tfT1beBer4z8SUBRHyPG/2f0Yy/zd9fh+sYNC6IAqOaUHQBQF6BfzDUlkMQqIVCIVpaJjiINTyAaHDwWgwZBs7LUQtsdG6SvtBY8w6aaWGqNmaLMv+O7e2xtEGMYeov0Vd1WWZ1Tc3MctOeRelCKImaQzFGmYd7JMXNUJhGMyEyFoMUUvd1PwiFaDuM2IVUXvmJYriAo+CvLMfEHLtiMM7nMExQ/M4BpCGVBuam0FIFRHag5R5FLwQr7oxQsgrIYSV710gTOyyxyZKGIs2z25DeEz4llad7Lbb7Z5/ZVfl4bU3tR2Avra45mEACuvBq3sEGECA6pE4qVgAAAAASUVORK5CYII=\"/>\n          <span>Horário de Emissão do Rebate:</span>\n          <span style=\"color: #fff700\">00:30 do dia seguinte</span>\n        </div>\n\n        <div style=\"margin: 12px auto\" bis_skin_checked=\"1\">\n          <table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <th style=\"\n                    background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);\n                    border-radius: 8px 0px 0px 0px;\n                    border-right: 1px solid #ffffff20;\n                  \">\n                  <img style=\"width: 29px; height: 29px; margin: 0 auto; padding: 0px 0px\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAMAAABBJv+bAAACEFBMVEUAAABYZoNnc5bw+/+wxN/D1uq7xdT1/v/G1erO4O3O3uv2///c4+qnu9i0w+L////T4fOpudijqryUqbvN0+bA1+zR5vbw+//I2e1+iLK70OfK0OTw+//FytaTp8ju+v+rv9q5zua2yuPq7vTx/P/V5O+5xNbF2+7x+/+kuNDk6/bw+//u7/W+zuOEibHf6fSFi6G/0ea0vMrF2e27z+aCkqtMV3v2+fxNWYHL3PBwgpiyxtmtwc6+1Om5wdy2yO3x+//T6PjF1Ouwv9vc7/3U6vnH3fDK2e6zw92sttiqu9fm9f/3+v3Y7fzQ5fbM4vS5yeK3xt+qtNamt9Ocqszz+//p8v3b7fvR5/fR4/TG0/DI1+zI0+e+zuW9zOO7y+Orwt2tvdmotNSosdSis9GUpMPv9vvl8PnW6fnO4vTF2vC/ze7D2e3D0ui1z+jAz+ewzOWjtdKlr9KesdGhrs6ktM2dp8yUqciOncF3jLt1hrRugLBqfbD////0/f/r9v/7/P7f8v7g8v3u8/rj7PXX4fTS3PTc5/PI4PPI2fPJ3/Ld4/HR4fHM3fDK1vDW5O29yuzX3eu/1uvB1OqyxOq7yOi3zubP1eWqu+TBzuO7zuCbstynudiwvtaltNWksdOfr9Cjq86hqc6cssugr8mWpcSGnsGVqL6Job5+lrx9jrp/ibN3gKx0g6RqeptTX5ShKSlhAAAAQHRSTlMAXln97NtnVjUkHx0SDQgF/f37+/jz7+7t6eTa2c/Gv7q2rKelo6GWko2MhoSCfXZ1b2pmZV5bWllYVFA+Ox0OZpPgIgAAAYBJREFUKM9ioBPg1LfDI8shmsXKi1OWhzXHzU0dp7ThpJwufz9LHLK8Um5u/hGuYhwMRrJsDAzm0nrIsvy6/o5+fo6+vhJqE7unG2iJLJREktUREmhq9HV09XWJzJ0ZExPj7Lmogg8hrdzi7e3t4uqYkdHr5Jzi4e7hWVZsj5Bmd0jzaXdxDW/ti8pNBEo7e5axIBnOzezgUxvpmh6V7R7rlRLonugZoojsMpm6MB+f9LYJndFxXoWB7p5BC4yRXQ6YSqh3WENz9hTH6HigdHRQ0BwuZGlth3qXsKgZWX5OAV7BAU5JyRCrEW5jDnecOts/EiQdn59cpIQize3gEB6RV9CR6RSfGBwblzTfBDVQxUNdgNJumU6xzsH5gUHzbFGl5UN7EpatLC8OCUlNdU5KFuRElVaN8/BISJg2OcA5pKJk9Ro5PlRpjbT+WYtXlJeWLlmaOrekSAEtQtmE162vqayqXFVdU121drkmRmqxsWJkZGJisjBjNLXmYhgEAAC3JGlY6TfxFAAAAABJRU5ErkJggg==\"/>\n                </th>\n                <th style=\"\n                    background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);\n                    border-radius: 0px 8px 0px 0px;\n                    border-right: 1px solid #ffffff20;\n                    padding: 8px 0px;\n                  \">\n                  Rebate\n                </th>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 0</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">0.1%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 1</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">0.2%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 2</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">0.3%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 3</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">0.4%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 4</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">0.5%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 5</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">0.6%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 6</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">0.7%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 7</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">0.8%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 8</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">0.9%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 9</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">1.0%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 10</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">1.1%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">VIP 11</td>\n                <td style=\"background-color: #4DF6CF38; border: 1px solid #ffffff20\">1.2%</td>\n              </tr>\n              <tr>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">VIP 12</td>\n                <td style=\"background-color: #4AECF526; border: 1px solid #ffffff20\">1.3%</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        \n\n        <ol>\n          <li><p>Receba bônus de reembolso extra com base no nível VIP. Exemplo:O reembolso original do VIP1 é de 0.2%.</p></li><li><p>Aplica-se apenas às apostas em máquinas de slot.</p></li><li><p>Requisito de saque: Para sacar o bônus, você deve completar um turnover de 1x. Por exemplo, se você receber um bônus de R$100, precisa apostar R$100 para ser elegível para o saque.(Apenas o slot conta para a aposta, exceto dois jogos de slot de apostas laterais)</p></li>\n          <li><p>Se algum usuário ou organização se envolver em arbitragem através de métodos impróprios, a plataforma reserva-se o direito de congelar a conta relevante sem aviso prévio e sem reembolsos. O jogador será colocado na lista negra.</p></li>\n          <li><p>A AKB188 reserva-se o direito final de interpretação para este evento e pode modificar os detalhes do evento ou encerrá-lo sem aviso prévio.</p></li>\n        </ol>\n      </div>",
  //   "promoCode": "promo1",
  //   "hasPromo": true,
  //   "privilegeStatus": null,
  //   "status": "0",
  //   "param": "{\"sub\":\"Get cash everyday\",\"hidebottom\":\"1\",\"hidetitle\":\"1\"}",
  //   "vips": null,
  //   "affiliates": null,
  //   "startTime": null,
  //   "endTime": null,
  //   "displayStartTime": 1577847600000,
  //   "displayEndTime": 1893553199000,
  //   "desktopFastAccessIconImgUrl": null,
  //   "desktopFastAccessIconImgUrlDark": null,
  //   "mobileFastAccessIconImgUrl": null,
  //   "mobileFastAccessIconImgUrlDark": null,
  //   "fastAccessSeq": 99
  // },
  // {
  //   "id": 506,
  //   "title": "Reembolso Semanal de Perda em Máquinas de Slot",
  //   "desktopImgUrl": "18/f93d9ca7-b397-4cb1-83da-489726c38cf4.png",
  //   "desktopImgUrlDark": null,
  //   "desktopImgBackgroundUrl": null,
  //   "desktopImgBackgroundUrlDark": null,
  //   "mobileImgUrl": "promo-2.png",
  //   "mobileImgUrlDark": null,
  //   "mobileImgBackgroundUrl": null,
  //   "mobileImgBackgroundUrlDark": null,
  //   "desktopBannerUrl": "18/80d45aa4-f99c-428b-8eb0-8ab0f49cd70a.png",
  //   "desktopBannerUrlDark": null,
  //   "mobileBannerUrl": "promo-2.png",
  //   "mobileBannerUrlDark": null,
  //   "redirectUrl": "promo2",
  //   "labelType": 0,
  //   "promoType": "VIP",
  //   "pageContent": "<p>Ganhe Dinheiro</p><p>Cashback de até 1.5% do valor apostado</p><p>Convide mais amigos e você ganhará mais dinheiro. Cada membro que ingressa no AKB188 tanto jogador quanto agente.</p><p>- Defendemos benefícios e bônus para todos.</p><p>- Membros Ativos: O valor da aposta diária atinge 200.<br/></p><p>- Seu cashback será calculado com base no valor total apostado pelos seus membros ativos. O cashback pode ser retirado ou usado para mais apostas.</p><p>- Ganhe receita vitalícia com seus jogadores indicados.</p><p>-<br/></p><p>- Indique o maior número possível de amigos para obter um desconto maior.</p><p>Para mais detalhes e regras, clique Aqui</p>",
  //   "promoCode": "promo2",
  //   "hasPromo": false,
  //   "privilegeStatus": null,
  //   "status": "0",
  //   "param": "{\"page\":\"/earn-money\"}",
  //   "vips": null,
  //   "affiliates": null,
  //   "startTime": null,
  //   "endTime": null,
  //   "displayStartTime": 1577808000000,
  //   "displayEndTime": 1893513599000,
  //   "desktopFastAccessIconImgUrl": null,
  //   "desktopFastAccessIconImgUrlDark": null,
  //   "mobileFastAccessIconImgUrl": null,
  //   "mobileFastAccessIconImgUrlDark": null,
  //   "fastAccessSeq": 0
  // },
  // {
  //   "id": 507,
  //   "title": "Get RS$100 for free",
  //   "desktopImgUrl": "18/f93d9ca7-b397-4cb1-83da-489726c38cf4.png",
  //   "desktopImgUrlDark": null,
  //   "desktopImgBackgroundUrl": null,
  //   "desktopImgBackgroundUrlDark": null,
  //   "mobileImgUrl": "promo-3.png",
  //   "mobileImgUrlDark": null,
  //   "mobileImgBackgroundUrl": null,
  //   "mobileImgBackgroundUrlDark": null,
  //   "desktopBannerUrl": "18/80d45aa4-f99c-428b-8eb0-8ab0f49cd70a.png",
  //   "desktopBannerUrlDark": null,
  //   "mobileBannerUrl": "promo-3.png",
  //   "mobileBannerUrlDark": null,
  //   "redirectUrl": "receive-earn",
  //   "labelType": 0,
  //   "promoType": "VIP",
  //   "pageContent": "",
  //   "promoCode": "receive-earn",
  //   "hasPromo": true,
  //   "privilegeStatus": null,
  //   "status": "0",
  //   "param": "{\"sub\":\"Get cash everyday\",\"hidebottom\":\"1\",\"hidetitle\":\"1\"}",
  //   "vips": null,
  //   "affiliates": null,
  //   "startTime": null,
  //   "endTime": null,
  //   "displayStartTime": 1577808000000,
  //   "displayEndTime": 1893513599000,
  //   "desktopFastAccessIconImgUrl": null,
  //   "desktopFastAccessIconImgUrlDark": null,
  //   "mobileFastAccessIconImgUrl": null,
  //   "mobileFastAccessIconImgUrlDark": null,
  //   "fastAccessSeq": 0
  // }
]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const ui = useUI();
    const isDisplayLogin = ref(false);
    const isFtdEnded = ref(false);

    const isFetchingPromo = ref(false);
    const extensionState = ref(false);
    const extensionToken = ref("");
    const isOpenExtension = ref(false);

    const checkExtension = () => {
      if (route.path === "/promotion") {
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    const tab = ref("all");
    const tabItems = [

      {name: "all", label: '全部'},
      // { name: "slot game", label: '电子'},
      // { name: "fish", label: '捕鱼'},
      // { name: "live casino", label: '真人'},
      // { name: "poker", label: '棋牌'},

      // {
      //   name: "all",
      //   label: "全部",
      // },
      // {
      //   name: "sport",
      //   label: "体育",
      // },
      // {
      //   name: "esport",
      //   label: "电竞",
      // },
      // {
      //   name: "live casino",
      //   label: "真人",
      // },
      // {
      //   name: "slot game",
      //   label: "电游",
      // },
    ];

    onActivated(() => {
      // if promo name is present, do not show promo list on first load
      if (route.query.name && !isAndroid()) {
        isPromoDetail.value = true;
      }

      loadBanner();
      loadAll();
      updateCountdown();
      store.getUnreadTotal();
    });

    watch(() => route.query, () => {
      if (route.query === null || isAndroid()) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.name
        ui.setScrollPosition("vertical", 0, 200);
      }
    });

    watch(() => vipPromoTab.value, () => {
      if (vipPromoTab.value === 'vip') {
        router.push('/vip');
      }
    })

    watch(() => route.path, () => {
      if (route.path === '/promo') {
        vipPromoTab.value = 'promo';
      }
    })

    const isPromoDetailPage = ref(false);

    const backToPromoList = () => {
      if (window.location.pathname === "/promotion") {
        window.location.href = "xfapp:/promo";
      } else {
        router.push("/promo");
      }
      isPromoDetailPage.value = false
    }

    const isFtdPromoEnded = computed(() => {
      if(selectedPromo.value && selectedPromo.value.promoCode==="br1-slot-ftd" && isFtdEnded.value===true){
        return true;
      }

      return false;
    })

    const loadBanner = () => {
      // loadPromoBanner("PROMO").then((res) => {
      //   if (res.code === 0) {
      //       banner.value = res.data[0]
      //   }
      // })
      api
        .get("/opt-session/promo/banner?category=PROMO")
        .then((response) => {
          if (response.code === 0) {
            banner.value = response.data[0];
            // console.log(banner.value)
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: ret.message,
            //   icon: "report_problem"
            // });
          }
          // banners.value = response.data;
        })
    }
    const showPromoDetails = (promo) => {
      if (!store.token) {
        // isDisplayLogin.value = true

        $q.notify({
          color: "negative",
          position: "top",
          message: 'Please login to continue',
          icon: "report_problem"
        });
        // router.push(`/login`)
        ui.loginView = 'login'
      } else {
        if (promo.redirectUrl && promo.redirectUrl.includes("page-vip")) {
          router.push({path: '/account/vip'});
        }else if (promo.redirectUrl && promo.redirectUrl.includes("SigninBonus")) {
          router.push({path: '/activities-details'});
        } else {
          // if (route.query.fromAccount) {
          //   router.push({path: '/promo', query: {name: promo.redirectUrl, fromAccount: true}})
          // } else {
          //   router.push({path: '/promo', query: {name: promo.redirectUrl}})
          // }
          // isPromoDetail.value = true
          // selectedPromo.value = promo

          if (extensionState.value) {
            isPromoDetail.value = true;

            selectedPromo.value = promo;
            if (isAndroid()) {
              LocalStorage.set("TOKEN", extensionToken.value, 86400);
            } else {
              SessionStorage.set("TOKEN", extensionToken.value);
            }
            store.token = extensionToken.value;
          } else if (isAndroid()) {
            // store.h5Url = "http://192.168.68.86:9090/";
            var preUrl = store.h5Url + `promotion?name=${promo.redirectUrl}&token=${store.token}`;
            // alert(preUrl);
            console.log(preUrl);
            // promoSrc.value= preUrl;
            var ref = cordova.InAppBrowser.open(preUrl, "_blank", "location=no,zoom=no,footer=no,toolbar=no,fullscreen=yes,hidden=yes");
            isOpenExtension.value = true;

            ref.addEventListener('loadstop', function() {
              setTimeout(()=>{
                ref.show();
              },500)
            });

            ref.addEventListener("message", async function(event) {
              if (event.data.action === "qrcode") {
                // alert(event.data.item);
                const dataUrl = event.data.item;
                // alert(dataUrl)
                // Save the image to the photo gallery
                await Filesystem.writeFile({
                  path: `Pictures/myreferral-${Date.now()}.jpg`,
                  data: dataUrl,
                  directory: Directory.Documents,
                  recursive: true
                });

              }
            });

            ref.addEventListener("loadstart", function (event) {
              var url = event.url;
              // alert("This" + url);
              if (url.indexOf("xfapp:") > -1) {
                var message = url.split("xfapp:")[1];
                console.log("Message received from InAppBrowser: ", decodeURIComponent(message));
                // alert(message);
                ref.close();
                router.push(message);
              }
            });

            ref.addEventListener("exit", function () {
              isOpenExtension.value = false;
            });

          } else {
            if (route.query.fromAccount) {
                router.push({ path: "/promo", query: { name: promo.redirectUrl, fromAccount: true } });
              } else {
                router.push({ path: "/promo", query: { name: promo.redirectUrl } });
              }
              if(!isAndroid()){
                isPromoDetail.value = true;
                selectedPromo.value = promo;
                // selectedPromoDate.value = '';
              }
          }

          if(selectedPromo.value.param){
            let promoDate = JSON.parse(selectedPromo.value.param).promoDate;

            // if(promoDate) {
            //   selectedPromoDate.value = promoDate;
            // }
          }
        }
      }
    }
    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return promo.promoType.toLowerCase().split(',').includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList
      }
    };

    const loadAll = () => {
      const randNum = Math.floor(Math.random() * 1000) + 1;
      const platformApiUrl = `/opt-session/promo/page?v=${randNum}`;

      isFetchingPromo.value = window.location.pathname === "/promotion";

      api.get(platformApiUrl).then((res) => {
        if (res.code === 0) {
          promoState.promoList = [];
          var promoItems = res.data;
          // promoState.promoList.push(...res.data);

          promoItems.forEach(element => {
            // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
              // promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            // } else {
              promoState.promoList.push(element);

              if (route.query.name && String(element.redirectUrl) === route.query.name) {
                showPromoDetails(element)
              }
            // }
          });

          switchPromoType(promoState.active)

          isFetchingPromo.value = false;
        }
      }).catch((e) => {
        isFetchingPromo.value = false;
        console.log("error", e);
      });

      api
      .get("/opt-session/getAppTabs")
      .then((res) => {
        // debugger;
        if (res.code === 0) {
          const { data } = res;
          if (data && data.hasOwnProperty("ftd")) {
            isFtdEnded.value = data.ftd;
            store.ftd = data.ftd;
          }
        }
      })
      .catch((e) => {
        console.log("error", e);
      });

    }

    const selectedParam = computed( () => {
      if(selectedPromo.value && selectedPromo.value.param){
        const paramJson = JSON.parse(selectedPromo.value.param);
        return paramJson;
      }else{
        return null;
      }
    })

    const goToJoinNow = () => {
      // console.log(selectedPromo.value);
      if (selectedPromo.value.param) {
        try {
          const paramJson = JSON.parse(selectedPromo.value.param);
          console.log(paramJson);
          if (paramJson && paramJson.page) {
            router.push(paramJson.page)
          } else if (paramJson && paramJson.html) {
            window.open(paramJson.html, "_blank");
          } else if (paramJson && paramJson.game) {
            const openPattern = /^\/open\/(.*)/;
            const extractedUrl = paramJson.game.match(openPattern)[1];
            const [gameName, platformCode, gameCode, gameStatus, gameType, gameId] = extractedUrl.split("/");
            playGame(gameName, platformCode, gameCode, gameStatus, gameType, gameId);
          }else if (paramJson && paramJson.api) {
            const apiParams = (paramJson && paramJson.params) ? paramJson.params : {};
            api.get(paramJson.api, {params: apiParams}).then((res) => {
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "Success.",
                  icon: "check_circle_outline"
                })
              }
            }).catch((e) => {
              $q.notify({
                color: "negative",
                position: "top",
                message: e.message,
                icon: "report_problem"
              })
            });
          }
        } catch (e) {
          console.log("PArse Error");
        }
      } else if (selectedPromo.value.redirectUrl === "EarnMoney") {
        router.push('/earn-money')
      } else if (selectedPromo.value.redirectUrl === "VIPrewards") {
        router.push('/vip')
      } else if (selectedPromo.value.redirectUrl === "Deposit") {
        router.push('/deposit?from=/promo');
      } else if (selectedPromo.value.redirectUrl === "Withdraw") {
        router.push('/withdraw?from=/promo');
      } else if (selectedPromo.value.redirectUrl.indexOf("https://") > -1 || selectedPromo.value.redirectUrl.indexOf("http://") > -1) {
        window.open(selectedPromo.value.redirectUrl, "_blank");
      } else if (selectedPromo.value.redirectUrl) {
        router.push(selectedPromo.value.redirectUrl);
      }
    }

    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
      allGames.value.open(gameName, platformCode, gameCode, gameType);
    };

    const goToVip = () => {
      router.push('/vip')
    }

    // promo timer
    const endDate = new Date('01/8/2024 12:00:00').getTime();
    const countdown = ref('');
    const isPromotionEnded = ref(false);

    function getCountdown() {
      const now = new Date().getTime();
      const timeRemaining = endDate - now;

      if (timeRemaining <= 0) {
        isPromotionEnded.value = true;
        return 'Promotion Ended';
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    const updateCountdown = () => {
      countdown.value = getCountdown();
    };

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Cleanup the interval when the component is unmounted
    onBeforeUnmount(() => {
      clearInterval(countdownInterval);
    });

    onMounted(() => {
      checkExtension();
    });

    const swipeLeft = () => {
      router.push('/vip')
    };

    // Handle swipe right
    const swipeRight = () => {
    };

    const fullGameDialog = ref(false);
    const closeFullGameDialog = () => {
      fullGameDialog.value = false;
    };

    return {
      promoState,
      promoTypes,
      promoTabActive,
      switchPromoType,
      filteredArray,
      isPromoDetail,
      showPromoDetails,
      selectedPromo,
      banner,
      imgURL,
      store,
      tab,
      tabItems,
      isDisplayLogin,
      vipPromoTab,
      backToPromoList,
      isPromotionEnded,
      countdown,
      getCountdown,
      selectedParam,
      updateCountdown,
      countdownInterval,
      goToVip,
      goToJoinNow,
      ui,
      swipeLeft,
      swipeRight,
      route,
      allGames,
      closeFullGameDialog,
      isFtdPromoEnded,
      isFetchingPromo,
      extensionState,
      isOpenExtension
    }
  },
});
</script>
<style lang="scss" scoped>
.vip-promo-tab-wrapper {
  width: 90%;
  margin: 30px auto 0;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    // background: rgba(43, 71, 74, 0.27);
    // background:#2B474A;
    border: 1px solid #4b4943;
    color: #4b4943;
    font-weight: 400;
    margin: 0 8px;
    flex: 1;
  }

  .vip-promo-tab-toggle {
    // background-color: #2b474a;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: #000;
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      box-shadow: 0px 1px 2px 0px #0000000d;
      // border: 2px solid rgba(43, 71, 74, 0.27);
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  .promo-view-container {
    ol {
      padding: 0 15px;
    }

    table {
      margin: 0 15px 20px;
      width: 98%;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      border: 0;

      tr {
        td {
          padding: 10px 20px;
          border-bottom: 1px solid #272c3d;

          p {
            margin: 0;
          }
        }

        &:first-child {
          td {
            color: #db7e42;
            white-space: nowrap;
          }
        }

        td:nth-child(odd) {
          background: #3c3c6a;
        }

        td:nth-child(even) {
          background: #3c3c6a;
        }
      }
    }
  }

  a {
    color: #db7e42;
    font-size: 17px;
  }
}

.back-btn {
  background: rgb(255, 255, 255, 0.4);
  margin: 12px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
}
</style>
<style lang="scss">
.promo-container {
  color: #ffffff;
  min-height: calc(100vh - 160px);
  // background: #101114;
  // background: linear-gradient(180deg, rgba(0, 185, 161, 0.46) 0%, rgba(0, 185, 111, 0) 96.35%);

  .all-promotions {
    padding-bottom: 20px;
    @keyframes fadein {
      100% {
        opacity: 1;
      }
    }

    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center bottom;
      overflow: hidden;
      height: 170px;
      // max-height: 130px;
      margin: 10px;

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      max-width: 1400px;
      width: 90%;
      margin-left: auto;
      margin-right: auto;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        ::-webkit-scrollbar {
          display: none;
        }

        .type-list {
          display: flex;
          align-items: center;
          border-radius: 20px;
          overflow: auto;
          gap: 20px;
          padding: 10px;

          .type-item {
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 20px;
            background: #272c3d;
            box-shadow: 0 0 10px -3px #000000;
            white-space: nowrap;

            svg {
              width: 20px;
              fill: white;
              display: block;
              padding: 0;
            }

            img {
              max-height: 20px;
              filter: grayscale(1);
            }

            &.active,
            &:hover {
              background: #4b4e66;
              box-shadow: 0 0 5px #ffffff;

              img {
                filter: grayscale(0);
              }
            }
          }
        }
      }

      @keyframes scalein {
        from {
          transform: scale(0.5);
        }
        to {
          transform: scale(1);
        }
      }

      .promo-list-wrapper {
        // margin-top: 30px;
        // display: grid;
        // margin-top: 20px;
        // grid-template-columns: 1fr;

        display: flex;
        margin-top: 20px;
        flex-direction: column;

        .promo-item {
          position: relative;
          // overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: 0.4s ease-in;
          margin-bottom: 20px;
          overflow: hidden;
          padding-top: 40px;
          border-radius: 17px;
          background: #123d26;
          box-shadow: 0px 7.5px 20px 0px #1411321a;

          img {
          }

          cursor: pointer;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            // border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              margin: 0;
              // border-radius: 10px 10px 0 0;
              border-radius: 17px;

              &:hover {
                transform: scale(1.2);
              }

              display: flex;
              justify-content: center;
              align-items: center;
              gap: 30px;

              .promo-content {
                width: 100%;
                // width: unset;
                // height: 100%;

                &.isDesktop {
                  display: block;
                }

                &.isMobile {
                  display: none;
                }
              }

              .promo-img {
                height: 200px;
              }
            }
          }

          .promo-info {
            // position: absolute;
            // text-align: right;
            // border-radius: 0 0 10px 10px;

            // left: 0;
            // bottom: 0;
            // width: 100%;
            // background-color: #272c3d;
            // display: flex;
            // justify-content: flex-end;
            // align-items: center;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .viewdetail {
              // background: #002a35;
              color: #ffffff;
              font-size: 14px;
              position: absolute;
              width: 100%;
              z-index: 2;
              top: 0;
              height: 40px;
              overflow: hidden;
              line-height: 40px;
              padding: 0 100px 0 10px;
              font-weight: 500;

              // &:before {
              //   background: #043d4f;
              //   content: "";
              //   display: block;
              //   height: 100%;
              //   position: absolute;
              //   right: 0;
              //   top: 0;
              //   width: 70px;
              // }

              // &:after {
              //   border-left: 20px solid transparent;
              //   border-right: 30px solid transparent;
              //   border-top: 30px solid #043d4f;
              //   clear: both;
              //   content: "";
              //   display: block;
              //   height: 0;
              //   position: absolute;
              //   right: 50px;
              //   top: 0;
              //   transform: rotate(180deg);
              //   width: 0;
              // }
            }

            .detail-arrow {
              margin-right: 20px;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .selected-promo {
    width: 100%;
    // padding-top: 30px;

    .selected-promo-wrapper {
      .banner-container {
        &:after {
          content: "";
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0));
          position: absolute;
          top: 0;
          left: 0;
          height: 80px;
          width: 100%;
        }

        width: 100%;

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          overflow: hidden;
          height: 220px;
        }
      }

      h1,
      h2,
      h3,
      h4 {
        margin-top: 15px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 22px;
      }

      .inner {
        max-width: 1400px;
        width: 90%;
        margin: 20px auto 35px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        padding-bottom: 40px;

        &.isSpinLuckyWheel {
          width: 100%;
          margin-top: 0;
          padding-bottom: 0;

          &.envelope {
            background: url("../assets/images/promotion/spin-lucky-wheel/envelope-stage/bg.png") no-repeat top center;
            background-size: cover;
          }

          &.wheel {
            background: url("../assets/images/promotion/spin-lucky-wheel/wheel-stage/promo-bg.png") no-repeat;
            background-size: 100% auto;
          }
        }

        p {
          font-size: 14px;
        }

        img {
          margin-bottom: 5px;
        }

        ol,
        ul {
          margin: 0;
          padding: 15px;

          li {
            margin-bottom: 20px;
          }
        }

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;

          th {
            padding: 5px;
            text-align: center;
            background-image: linear-gradient(0deg, #07414c 0, #058096 100%), linear-gradient(#d0d1d3, #d0d1d3);
          }

          td {
            padding: 5px;
            text-align: center;
            background-color: #202228;
            border: 1px solid #2e3039;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        .hot-promo-div:not(.isSpinLuckyWheel) img {
          width: initial;
          display: initial;
          margin-bottom: initial;
        }

        .hot-promo {
          //background: #272c3d;
          //border-radius: 10px;
          //display: none;
        }

        .promo-view-container {
          background: #272c3d;
          background-repeat: no-repeat;
          background-position: 95% 90%;
          padding: 20px;
          border-radius: 10px;
          overflow: auto;
          // &.welcome {
          //   background-image: url("../assets/images/promotion/hotpromo/common/welcome.png");
          // }
          // &.sport {
          //   background-image: url("../assets/images/promotion/hotpromo/common/sport.png");
          // }
          // &.esport {
          //   background-image: url("../assets/images/promotion/hotpromo/common/esport.png");
          // }
          // &.fish {
          //   background-image: url("../assets/images/promotion/hotpromo/common/fish.png");
          // }
          // &.livecasino {
          //   background-image: url("../assets/images/promotion/hotpromo/common/livecasino.png");
          // }
          // &.slot {
          //   background-image: url("../assets/images/promotion/hotpromo/common/slot.png");
          // }
        }
      }
    }
  }
}

.pad-title {
  // position: absolute;
  // top: -7px;
  // right: 5px;
  // z-index: 3;
  font-size: 12px;
  // color: #3e5cc0;
  color: #ffffff;
  // right: 5px;
  // top: 5px;
  z-index: 3;
}

.pad-label.label-new {
  //   background: url(../assets/promo/yh_label_new.png) no-repeat;
  // background-size: 100%;
  background-size: 78px 45px;
  font-size: 12px;
  color: #ffffff;
  padding: 12px 7px;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}

.promo {
  .q-tabs {
    // background: rgba(113, 125, 146, 0.2);
    background: #063c50;
    width: 100%;
    margin: 0 auto;
  }

  .q-tab {
    min-height: 40px;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active {
    color: #fff;
  }

  .q-tab__label {
    font-size: 13px;
  }

  .q-tab--active .q-tab__indicator {
    // background: url("../assets/images/promotion/tab_bg.png") no-repeat center center;
    background-size: 20px 10px;
    width: 100%;
    height: 10px;
    // background: salmon !important;
    filter: hue-rotate(311deg);
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
    // padding: 10px;
    padding: 0;
  }

  .q-tab-panel {
    padding: 0;
  }

  .download-item {
    background: #ffffff;
    padding: 10px;

    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;

      img {
        width: 40px;
      }
    }

    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
  }
}

// promo content-inner
.promo-content-inner {
  .content-title {
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    margin-bottom: 8px;
  }
}

// top float
.top-float {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 100%;

  .top-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.2;
  }

  .top-title {
    color: #fff;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    max-width: calc(100% - 60px);
  }
}

// join now
.join-container {
  background: #005348;
  padding: 12px 12px;
  position: fixed;
  //top: calc(100vh - 127px);
  //bottom: 66px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-join-now {
    border-radius: 100px;
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    color: #000;
    font-weight: 600;
    font-size: 12px;
    height: 30px;
  }

  .promo-date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .date-txt {
    color: rgba(255, 255, 255, 0.7);
  }

  .date-timer {
    color: #9afee4;
    display: flex;
    align-items: center;
    line-height: 1 !important;
    gap: 8px;
    font-size: 14px;

    img {
      width: 14px !important;
    }
  }
}

.btn-disabled {
  filter: brightness(0.6);
}

.dark-grey-dialog {
  // background: linear-gradient(180deg, #3e1474 0%, #101114 96.35%);
  background: linear-gradient(180deg, rgba(0, 185, 161, 0.46) 0%, rgba(0, 185, 111, 0) 96.35%);
  // background: #3e1474;
  background-size: contain;

  .dialog-mid-text {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    text-align: center;
    position: relative;
    top: 48%;
  }
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}
</style>

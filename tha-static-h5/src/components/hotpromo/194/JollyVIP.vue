<template>
    <div class="common-promo">
      <div style="display:flex">
        <div>
          <img :src="require(`../../../assets/images/promotion/hotpromo/194/icon.png`)" style="width:50%" />
          <div class="contents">
            {{ $t('lang.festival_bonus') }}
            <q-btn
              class="claim-btn"
              :loading="loadingClaim"
              @click="handleClaim('jolly88-vip-festival')"
              >{{ $t('lang.claim_bonus') }}</q-btn
            >
          </div>
        </div>
        <div>
          <img :src="require(`../../../assets/images/promotion/hotpromo/194/icon.png`)" style="width:50%" />
          <div class="contents">
            {{ $t('lang.birthday_bonus') }}
            <q-btn
              class="claim-btn"
              :loading="loadingClaim"
              @click="handleClaim('jolly88-vip-birthday')"
              >{{ $t('lang.claim_bonus') }}</q-btn
            >
          </div>
        </div>
      </div>

      <q-dialog v-model="isClaimModal" persistent>
        <q-card class="win-rebate-model">
          <q-card-section class="row items-center">
            <div class="bonus-svg-div">
              <span class="claim-amt">{{ claimMsg }}</span>
              <span class="bonus-text">{{ $t("lang.claim") }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat :label="$t('lang.agree')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  <script>
  import { defineComponent, onMounted, ref } from "vue";
  import {useI18n} from "vue-i18n";
  import { useQuasar } from "quasar";
  import { eventapi } from "boot/axios";

  export default defineComponent({
    props: {
      loadingClaim: {
        type: Boolean,
        default: false
      },
      promoId: {
        type: Number,
        default: null
      }
    },
    setup() {
      const {t}= useI18n()
      const $q = useQuasar();
      const claimMsg = ref("");
      const isClaimModal = ref(false);

      const handleClaim = (promoCode) => {
        const eventUrl = "/bonus/claim/" + promoCode;
        
        eventapi
          .put(eventUrl)
          .then((res) => {
            var responseCode = res.data;
            
            if (responseCode.code === 0) {
              claimMsg.value = "$" + responseCode.data;
              isClaimModal.value = true;

              $q.notify({
                color: "positive",
                position: "top",
                message: responseCode.data,
                icon: "check_circle_outline"
              });
            }
          })
          .catch((error) => {
          });
      }
      
      onMounted(() => {
      })
      return {
        t,
        handleClaim,
        claimMsg,
        isClaimModal
      }
    },
  })
  </script>
  <style scoped lang="scss">
  .common-promo {
    background: url('../../../assets/images/promotion/hotpromo/common/bg.png')no-repeat center center;
      .contents {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 20px;
        .orange {
          color: #db7e42;
        }
        .claim-btn {
          color: #ffffff;
          background: $linear-bg-1;
          border: 0;
        }
      }
  }
  </style>
  
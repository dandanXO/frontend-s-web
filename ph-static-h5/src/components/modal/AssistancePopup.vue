<template>
  <div class="popup-container" v-if="popupVisible" @click.stop="onClickPopup">
    <div class="left">
      <div class="alert-icon-wrapper">
        <img class="alert-icon" src="./../../assets/images/common/customer-service.png"/>
      </div>
    </div>
    <div class="right">
      <div class="content" v-if="isLoggedIn">
        <div class="title">How can I help you ？</div>
        <div class="desc">
          Do you need any helping  roam in play4win now? Select your issue.
        </div>
        <div class="action-buttons">
          <button class="action-button" @click="router.push('/finance/deposit');cancelPopup();">Deposit</button>
          <button class="action-button" @click="router.push('/finance/withdraw');cancelPopup();">Withdraw</button>
          <button class="action-button" @click="router.push('/account/personal');cancelPopup();">Account</button>
          <button class="action-button" @click="router.push('/promo');cancelPopup();">Promotion</button>
        </div>
      </div>
      <div class="content" v-else>
        <div class="title">How can I help you ？</div>
        <div class="desc">
          Please contact our 24/7 customer service , Join us now!
        </div>
        <div class="action-buttons">
          <button class="action-button primary" @click="router.push('/register');cancelPopup();">Join now</button>
          <button class="action-button" @click="cancelPopup">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script lang="js">
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";

const soundurl = require("../../assets/audio/assistance-popup-alert-ringtone.mp3");
const audio = new Audio(soundurl);
const inactiveDuration = 30000;
export default defineComponent({
  name: "AssistancePopupView",
  components: {
  },
  setup() {
    const initPopup = ref(false);
    const popupVisible = ref(false);
    const chimeAudible = ref(true);
    const router = useRouter();
    const store = userStore();

    const isLoggedIn = computed(() => !!store.token);

    const cancelPopup = () => {
      popupVisible.value = false;
    }

    const playPopupTriggerSound = () => {
      if (popupVisible.value === true) {
        console.log('popupVisible')
        return;
      }

      if(chimeAudible.value === true && document.hasFocus() && !document.hidden) {
        audio.play().then(() => {
          console.log('playing audio');
          popupVisible.value = true;
        }).catch((err) => {
          popupVisible.value = true;
          console.log('error playing audio', err);
        });
      } else {
        popupVisible.value = true;
      }
    }

    const startPopupTimer = () => {
      console.log('startPopupTimer')
      onInactive(inactiveDuration, playPopupTriggerSound);
    }

    watch(() => initPopup.value, () => {
      if (initPopup.value === true) {
        startPopupTimer();
      }
    });

    const onInactive = (ms, cb) => {
      var wait = setTimeout(cb, ms);
      document.onmousemove = document.mousedown = document.mouseup = document.onkeydown = document.onkeyup = document.focus = function () {
        clearTimeout(wait);
        wait = setTimeout(cb, ms);
      };
    }

    const onClickPopup = () => {
      console.log('clicked popup')
    }

    onMounted(() => {
      // document.addEventListener('click', () => {
      //   if(initPopup.value === true && popupVisible.value === true) {
      //     console.log('outside clicked, closing popup')
      //     popupVisible.value = false;
      //   }

      //   if (initPopup.value !== true) {
      //     console.log('initPopup')
      //     initPopup.value = true;
      //   }
      // })
    })

    return {
      popupVisible,
      cancelPopup,
      isLoggedIn,
      router,
      onClickPopup
    };
  },
});
</script>
    
<style scoped lang="scss">
.popup-container {
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  bottom: 100px;
  max-width: 375px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -5px #0000004d;
  box-shadow: 0px 20px 25px -5px #0000005e;
  z-index: 99999;

  .left {
    margin-left: 30px;
    max-width: 100px;

    .alert-icon-wrapper {
      display: flex;
      justify-content: center;

      .alert-icon {
        width: 80%;
      }
    }

  }

  .right {
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;

      .title {
        color: #111827;
        font-weight: 700;
        font-size: 16px;
      }

      .desc {
        color: #6B7280;
        font-size: 12px;
      }

      .action-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(80px,1fr));
        gap: 10px;

        .action-button {
          min-width: 80px;
          width: 80%;
          height: 38px;
          background-color: #fff;
          border-radius: 6px;
          border: 1px solid #D1D5DB;
          color: #374151;
          font-size: 12px;

          &.primary {
            background-color: #0071ED;
            color: #FFFFFF;
          }
        }
      }
    }
  }
}
</style>
    
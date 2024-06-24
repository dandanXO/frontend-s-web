<template>
  <div class="popup-container" v-if="popupVisible">
    <div class="content" v-if="isLoggedIn">
      <div class="alert-icon-wrapper">
        <img class="alert-icon" src="./../../assets/images/common/customer-service.png" />
      </div>
      <div class="title">How can I help you ？</div>
      <div class="desc">Do you need any helping roam in play4win now? Select your issue.</div>
      <div class="action-buttons">
        <button
          class="action-button"
          @click="
            router.push('/center/top-up');
            cancelPopup();
          "
        >
          Deposit
        </button>
        <button
          class="action-button"
          @click="
            router.push('/center/top-up?tab=withdraw');
            cancelPopup();
          "
        >
          Withdraw
        </button>
        <button
          class="action-button"
          @click="
            router.push('/center/personal');
            cancelPopup();
          "
        >
          Account
        </button>
        <button
          class="action-button"
          @click="
            router.push('/promotion');
            cancelPopup();
          "
        >
          Promotion
        </button>
      </div>
      <button class="close-btn" @click="cancelPopup()">Close</button>
    </div>
    <div class="content" v-else>
      <div class="alert-icon-wrapper">
        <img class="alert-icon" src="./../../assets/images/common/customer-service.png" />
      </div>
      <div class="title">How can I help you ？</div>
      <div class="desc">Please contact our 24/7 customer service , Join us now!</div>
      <div class="action-buttons">
        <button
          class="action-button primary"
          @click="
            router.push('/register');
            cancelPopup();
          "
        >
          Join now
        </button>
        <button class="action-button" @click="cancelPopup">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { userStore } from "@/store";
import { useRouter } from "vue-router";

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
    const store = userStore();
    const router = useRouter();

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

    onMounted(() => {
      // document.addEventListener('click', () => {
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
      router
    };
  },
});
</script>

<style scoped lang="scss">
.popup-container {
  width: 250px;
  position: fixed;
  right: 15px;
  bottom: 100px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -5px #0000004d;
  box-shadow: 0px 20px 25px -5px #0000005e;

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;

    .alert-icon-wrapper {
      display: flex;
      justify-content: center;

      .alert-icon {
        width: 50%;
      }
    }

    .title {
      color: #111827;
      font-size: 18px;
    }

    .desc {
      color: #6b7280;
      font-size: 14px;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;

      .action-button {
        min-width: 100px;
        width: 100%;
        height: 38px;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        color: #374151;
        font-size: 12px;
        &.primary {
          background-color: #0071ed;
          color: #ffffff;
        }
      }
    }

    .close-btn {
      padding: 5px 0px;
      border-radius: 6px;
    }
  }
}
</style>

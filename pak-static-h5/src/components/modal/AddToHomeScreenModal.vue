<template>
  <q-dialog v-model="isAddToHomeScreenModal" @hide="closeDialog" position="bottom">
    <div class="add-to-homescreen-container">
      <q-btn class="close-btn" flat round dense icon="close" @click="closeDialog" />
      <div class="add-to-homescreen-download">
        <img src="../../assets/images/index/download/download-phone.png" />
      </div>
      <div class="add-to-homescreen-top">
        <img class="app-logo" src="../../assets/images/index/download/download-app-logo_2.png" />
        <div class="add-to-homescreen-content">
          {{ $t("modal.addToHomeScreen.addToHomeScreenBonus") }}
        </div>
      </div>
      <div class="continue-to-h5" @click="closeDialog">{{ $t("modal.addToHomeScreen.continueToUseH5") }}</div>

      <div class="add-to-homescreen-btn">
        <div class="more-benefits-emoji">
          <img src="../../assets/images/index/download/benefits-emoji.png" alt="" />
        </div>
        <div class="more-benefits-txt">{{ $t("modal.addToHomeScreen.enjoyMoreBenefits") }}</div>
        <q-btn v-if="Platform.is.ios" no-caps unelevated class="btn-custom" color="#EFFFD1" @click="handleIosBtnClick">
          <img class="os-logo" src="../../assets/images/index/download/ios-logo.png" />
          {{ $t("modal.addToHomeScreen.appAndWeb") }}
        </q-btn>
        <q-btn
          v-else
          no-caps
          unelevated
          class="btn-custom"
          color="#EFFFD1"
          :href="ui.downloadAppUrl"
          @click="closeDialog"
        >
          <img class="os-logo" src="../../assets/images/index/download/android-logo-green.png" />
          {{ $t("modal.addToHomeScreen.app") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
  <q-dialog v-model="isDisplayInstructions" @hide="closeInstructionsDialog" position="bottom">
    <div class="instructions-container">
      <q-btn class="close-btn" flat round dense icon="close" @click="closeInstructionsDialog" />
      <div>{{ $t("modal.addToHomeScreen.addToHomeScreen") }}</div>
      <img src="../../assets/images/index/download/add-homescreen-instructions.png" />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { Platform } from "quasar";
import { useUI } from "stores/ui";

const props = defineProps(["isAddToHomeScreen"]);
const emit = defineEmits(["update:isAddToHomeScreen"]);

const ui = useUI();

const isAddToHomeScreenModal = ref(props.isAddToHomeScreen);
const isDisplayInstructions = ref(false);

const handleIosBtnClick = () => {
  isDisplayInstructions.value = true;
  closeDialog();
};

const closeInstructionsDialog = () => {
  isDisplayInstructions.value = false;
};

const flagLocalStorage = () => {
  sessionStorage.setItem("add_to_homescreen", true);
};

const closeDialog = () => {
  emit("update:isAddToHomeScreen", false);
  flagLocalStorage();
};
watch(
  () => props.isAddToHomeScreen,
  (newValue) => {
    isAddToHomeScreenModal.value = newValue;
  }
);
</script>

<style scoped lang="scss">
.add-to-homescreen-container {
  // background-color: rgba(255, 255, 255, 0.75);
  background-image: url("../../assets/images/index/download/download-bg.png");
  
  background-position: bottom center;
    background-repeat: no-repeat;
  background-size: contain;
  border-radius: 36px !important;
  /* margin: 60px 10px 10px; */
  color: #000;
  padding: 32px 16px 16px;
  height: 310px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 10px;

  max-width: 430px;
  .add-to-homescreen-download {
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: center;
    width: 100%;
    left: 0;
    right: 0;
    margin: auto;
    height: 93px;
    z-index: 9999;
    img {
      display: block;
      width: 100%;
      max-width: 120px;
      height: 93px;
    }
  }
  .add-to-homescreen-top {
    display: flex;
    align-items: center;
    justify-content: center;
    // gap: 15px;
    :not(:last-child) {
      margin-right: 15px;
    }
    .app-logo {
      width: 76px;
      height: 76px;
    }
    .add-to-homescreen-content {
      // margin-right: 15px;
      // font-weight: 600;
      font-size: 14px;
    }
  }

  .continue-to-h5 {
    color: #82d81d;
    text-decoration: none;
    font-weight: 600;
    width: 100%;
    text-align: center;
    margin: 12px 0 60px;
    font-size: 13px;
    cursor: pointer;
  }

  .add-to-homescreen-btn {
    position: relative;
    .more-benefits-emoji {
      position: absolute;
      top: -60px;
      right: 0;
      img {
        display: block;
        width: 46px;
      }
    }
    .more-benefits-txt {
      // background-color: #e84d44;
      background: linear-gradient(90deg, #ffa534 0%, #f4622d 100%);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      position: absolute;
      top: -48px;
      right: 50px;
      z-index: 2;
      font-size: 13px;
      &::after {
        content: "";
        position: absolute;
        bottom: -6px; /* Adjusts position below the bubble */
        right: 10px; /* Moves the triangle towards the right */
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #f4622d; /* Matches the background color */
      }
    }
  }

  // .btn-primary {
  //   background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  //   box-shadow: 0px 2.16px 0px 0px #1cca6a;
  //   color: #333;
  //   font-size: 16px;
  //   height: 46px;
  //   border-radius: 24px;
  //   text-transform: uppercase;
  //   width: 80%;
  //   margin-left: auto;
  //   margin-right: auto;
  //   display: flex;
  // }
  .btn-custom {
    background: url("../../assets/images/index/continue-btn-bg.png") no-repeat center center;
    width: 70%;
    margin: 0 auto;
    background-size: cover;
    padding: 5px;
    display: flex;
  }
  // .btn-secondary {
  //   background-color: transparent;
  //   color: #333;
  //   font-size: 16px;
  //   height: 46px;
  //   // border: 1px solid #4488ff;
  //   border-radius: 10px;
  //   width: 80%;
  //   background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  //   box-shadow: 0px 2.16px 0px 0px #1cca6a;
  //   border-radius: 24px;
  //   text-transform: uppercase;
  //   margin-left: auto;
  //   margin-right: auto;
  //   display: flex;
  // }
  // .btn-secondary::before {
  //   background: none;
  // }

  .os-logo {
    // width: 30px;
    height: 30px;
    margin-right: 8px;
    filter: grayscale(1);
  }
}

.instructions-container {
  background-color: rgba(255, 255, 255, 0.75);
  color: #000;
  padding: 16px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  font-family: Poppins;
  letter-spacing: 0px;
  > img {
    margin-top: 10px;
    max-height: 500px;
    aspect-ratio: 590 / 1002;
  }
}

.close-btn {
  background-color: #9e9e9e;
  color: #fff;
  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 0.6em;
  display: none;
}
</style>

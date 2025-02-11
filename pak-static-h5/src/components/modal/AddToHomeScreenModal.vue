<template>
  <q-dialog v-model="isAddToHomeScreenModal" persistent @hide="closeDialog" position="bottom">
    <div class="add-to-homescreen-container">
      <q-btn class="close-btn" flat round dense icon="close" @click="closeDialog" />
      <div class="add-to-homescreen-top">
        <img class="app-logo" src="../../assets/images/index/download/download-app-logo_2.png" />
        <div class="add-to-homescreen-content">
          We would like to add it to your home screen for the latest free bets and bonus updates
        </div>
      </div>
      <div class="continue-to-h5" @click="closeDialog">Continue to use H5</div>
      <div class="add-to-homescreen-btn">
        <q-btn v-if="Platform.is.ios" no-caps unelevated class="btn-secondary" @click="handleIosBtnClick">
          <img class="os-logo" src="../../assets/images/index/download/ios-logo.png" />
          App + Web
        </q-btn>
        <q-btn
          v-else
          no-caps
          unelevated
          class="btn-primary btn-primary__full"
          :href="ui.downloadAppUrl"
          @click="closeDialog"
        >
          <img class="os-logo" src="../../assets/images/index/download/android-logo.png" />
          App
        </q-btn>
      </div>
    </div>
  </q-dialog>
  <q-dialog v-model="isDisplayInstructions" persistent @hide="closeInstructionsDialog" position="bottom">
    <div class="instructions-container">
      <q-btn class="close-btn" flat round dense icon="close" @click="closeInstructionsDialog" />
      <div>Add to Home Screen</div>
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
  background-color: #fff;
  color: #000;
  padding: 16px;
  .add-to-homescreen-top {
    display: flex;
    align-items: center;
    justify-content: center;
    .app-logo {
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .add-to-homescreen-content {
      margin-right: 15px;
      font-weight: 600;
      font-size: 14px;
    }
  }

  .continue-to-h5 {
    color: #339dff;
    text-decoration: underline;
    font-weight: 600;
    width: 100%;
    text-align: center;
    margin: 18px 0 14px;
    font-size: 13px;
    cursor: pointer;
  }

  .btn-primary {
    background: none;
    background-color: #4488ff;
    color: #fff;
    font-size: 16px;
    height: 46px;
  }
  .btn-secondary {
    background-color: #fff;
    color: #4488ff;
    font-size: 16px;
    height: 46px;
    border: 1px solid #4488ff;
    border-radius: 10px;
    width: 100%;
  }

  .os-logo {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}

.instructions-container {
  background-color: #fff;
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
  background-color: #d4d4d4;
  color: #fff;
  position: absolute;
  right: 10px;
  top: 8px;
  font-size: 0.6em;
}
</style>

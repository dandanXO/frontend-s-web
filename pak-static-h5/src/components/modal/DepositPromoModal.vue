<template>
  <div class="deposit-promo-modal">
    <div class="modal-img">
      <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${depositPromoType}.png`)" />
    </div>
    <div class="modal-btn" @click="btnAction()">
      <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${depositPromoType}-btn.png`)" />
    </div>
    <div class="modal-checkbox">
      <q-checkbox v-model="isRemindAgain">Don't remind me again within a week</q-checkbox>
    </div>
    <div class="modal-close" @click="closeDialog()">
      <q-icon name="highlight_off"></q-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useUI } from "stores/ui";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  isDepositPromo: Boolean,
  depositPromoType: String
});
const emit = defineEmits(["update:isDepositPromo"]);
const ui = useUI();
const isDepositPromoModal = ref(props.isDepositPromo);
const isDisplayInstructions = ref(false);
const isRemindAgain = ref(false);

const flagLocalStorage = () => {
  const now = new Date().getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const data = {
    value: true,
    expiry: now + oneWeek
  };
  sessionStorage.setItem("deposit_modal_popup", JSON.stringify(data));
};

const closeDialog = () => {
  emit("closeDialog");
  if (isRemindAgain.value) {
    flagLocalStorage();
  }
};

const btnAction = () => {
  const type = String(props.depositPromoType);
  switch (type) {
    case "1":
      window.location.href = ui.downloadAppUrl;
      break;
    case "2":
      router.push("/deposit");
      break;
    case "3":
      router.push("/deposit");
      break;
    case "4":
      router.push("/deposit");
      break;
    case "5":
      router.push("/deposit");
      break;
    case "6":
      router.push("/deposit");
      break;
    default:
      break;
  }
};

watch(
  () => props.isDepositPromo,
  (newValue) => {
    isDepositPromoModal.value = newValue;
  }
);
</script>

<style scoped lang="scss">
.deposit-promo-modal {
  .modal-img {
    img {
      display: block;
      width: 100%;
      max-width: 300px;
    }
  }

  .modal-btn {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 160px;
    }
  }

  .modal-close {
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: lighter;
    margin-top: 16px;
  }
}
</style>

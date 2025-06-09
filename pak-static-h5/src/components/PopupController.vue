<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="popup-controller-wrapper" :class="controllerStyle">
    <div class="swiper-btn-prev" @click="handlePrevClick">
      <q-btn icon="chevron_left" round dense flat />
    </div>
    <div class="promo-list-wrapper">
      <a
        v-for="(promo, index) in promoList"
        class="promo-list-item"
        :key="index"
        :class="{ selected: promo.code === modelValue }"
        @click="handlePromoClick(promo.code)"
      >
        {{ promo.name }}
      </a>
    </div>
    <div class="swiper-btn-next" @click="handleNextClick"><q-btn icon="chevron_right" round dense flat /></div>
  </div>
</template>
<script setup>
import { computed, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps(["modelValue", "hasWheel", "hasSpin"]);
const { modelValue } = toRefs(props);

const emit = defineEmits("update:modelValue");

const { t } = useI18n();
const isAdded = ref(false);
const isAddedSpin = ref(false);

const promoList = ref([
  // { code: "money-rain", name: t("home.cashGift") },
  { code: "newplayer-spin-wheel", name: t("home.welcomeNewPlayer") }
]);
if (props.hasWheel && !isAdded.value) {
  promoList.value.push({ code: "mega-sharing-wheel", name: t("home.MegaSharingRoulette") });
}
if (props.hasSpin && !isAddedSpin.value) {
  promoList.value.push({ code: "spin-lucky-wheel", name: t("home.spinLuckyWheel") });
}

watch(props, (newVal, oldVal) => {
  if (newVal.hasWheel === true && isAdded.value === false) {
    isAdded.value = true;
    promoList.value.push({ code: "mega-sharing-wheel", name: t("home.MegaSharingRoulette") });
  }
  if (newVal.hasSpin === true && isAddedSpin.value === false) {
    isAddedSpin.value = true;
    promoList.value.push({ code: "spin-lucky-wheel", name: t("home.spinLuckyWheel") });
  }
});

const currentPromo = computed(() => {
  const index = promoList.value.findIndex((promo) => promo.code === modelValue.value);
  return index === -1 ? 0 : index;
});

const controllerStyle = computed(() => {
  switch (modelValue.value) {
    case "mega-sharing-wheel":
      return "style-2";
    case "money-rain":
      return "style-1";
    case "lucky-spin-wheel":
      return "lucky-spin-wheel";
    case "newplayer-spin-wheel":
      return "newplayer-spin-wheel"
    case "spin-lucky-wheel":
    default:
      return "style-1";
  }
});

const handlePromoClick = (code) => {
  emit("update:modelValue", code);
};

const handlePrevClick = () => {
  if (currentPromo.value === 0) {
    emit("update:modelValue", promoList.value[promoList.value.length - 1].code);
  } else {
    emit("update:modelValue", promoList.value[currentPromo.value - 1].code);
  }
};

const handleNextClick = () => {
  if (currentPromo.value === promoList.value.length - 1) {
    emit("update:modelValue", promoList.value[0].code);
  } else {
    emit("update:modelValue", promoList.value[currentPromo.value + 1].code);
  }
};
</script>
<style lang="scss" scoped>
.popup-controller-wrapper {
  --bg-color: #88dfac;
  --selected-bg-color: #ffed8f;
  --border-color: #ffffffcc;
  --selected-border-color: #1effae;
  --text-color: #fff;
  --selected-text-color: #00b352;
  display: flex;
  // gap: 14px;
  align-items: center;
  .swiper-btn-prev,
  .swiper-btn-next {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #EE4034;
    border: 1px solid #FFFFFF33;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    font-size: 25px;
    cursor: pointer;
  }
  .promo-list-wrapper {
    display: flex;
    // gap: 12px;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    .promo-list-item {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 5px;
      padding: 3px 5px 3px 5px;
      font-size: 10px;
      font-weight: 700;
      place-content: center;
      line-height: 12px;
      text-align: center;
      color: var(--text-color);
      &.selected {
        background: var(--selected-bg-color);
        border-color: var(--selected-border-color);
        border-radius: 5px;
        transform: scale(1.1);
        color: var(--selected-text-color);
      }
    }
  }
  .promo-list-wrapper :not(:last-child) {
      margin-right: 12px;
  }

  &.style-1 {
    --bg-color: #fff;
    --selected-bg-color: linear-gradient(180deg, #BE1F1F 0%, #AA1414 100%);
    --border-color: #ffffffcc;
    --selected-border-color: #fff;
    --text-color: #EE4034;
    --selected-text-color: #fff;
    .swiper-btn-prev,
    .swiper-btn-next {
      background-clip: border-box;
    }

    .promo-list-item {
      background-clip: border-box;
      &.selected {
        border: 1px solid #FFFFFF;
      }
    }
  }
  &.style-2 {
    --bg-color: #24283b;
    --selected-bg-color: linear-gradient(180deg, #ff674d 0%, #fe340a 100%);
    --border-color: #ffffffcc;
    --selected-border-color: #fff;
    --text-color: #fff;
    --selected-text-color: #fff;
  }
  // &.newplayer-spin-wheel{
  //   --bg-color: #fff;
  //   --selected-bg-color: linear-gradient(180deg, #8045FE 0%, #A958FF 100%);
  //   --border-color: #ffffffcc;
  //   --selected-border-color: #fff;
  //   --text-color: rgba(181, 115, 255, 1);
  //   --selected-text-color: #fff;
  // }
  &.newplayer-spin-wheel {
    :deep(.swiper-btn-next),
    :deep(.swiper-btn-prev), {
      background: #88dfac;
    }
  }
}
.popup-controller-wrapper :not(:last-child) {
  margin-right: 4px;
}
</style>

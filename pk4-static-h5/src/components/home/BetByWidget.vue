<template>
 <div ref="betByWidgetRef" @click="onWidgetClick" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { Platform } from "quasar";
import { api } from "src/boot/axios";
import { i18nStore } from "src/router/language";
import { userStore } from "src/stores";
import { onActivated, onDeactivated, ref, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";

const store = userStore();
const { languageVal } = storeToRefs(i18nStore());
const router = useRouter();
const emit = defineEmits(['click'])
const generatedUrl = ref('')
const onWidgetClick = () => {
  if (generatedUrl.value) {
    console.log("Widget clicked with generatedUrl:", generatedUrl.value);
    emit('click', generatedUrl.value);
  }
};

watch(generatedUrl, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    onWidgetClick();
  }
});

const betByWidgetRef = ref(null);
const betByInstance = ref(null);
const exitByClick = ref(false);

const getBetByToken = async () => {
  let way = null;
  if ("standalone" in window.navigator && window.navigator.standalone) {
    way = "IOS";
  } else {
    way = Platform.is.mobile ? "H5" : "WEB";
    if (Platform.is.capacitor) {
      if (Platform.is.android) {
        way = "ANDROID";
      }
    }
    if (store.isFromGooglePackage) {
      way = "ANDROID";
    }
  }

  const apiPath = store.hasToken()
    ? `/session/launch?_time=${new Date().getTime()}`
    : `/game/launch?_time=${new Date().getTime()}`;
  const params = {
    platform: "BetBy",
    gameCode: "",
    isMobile: Platform.is.mobile,
    way
  };
  try {
    const res = await api.get(apiPath, { params });
    const token = res.data;
    return token;
  } catch (e) {
    return null;
  }
};

const loadBetByScript = async () => {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById("btrenderer-script");
    if (existingScript) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://pk1.sptpub.com/bt-renderer.min.js";
    script.id = "btrenderer-script";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = (error) => {
      console.error("Error loading BetBy script:", error);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const generateBetByInstance = (token) => {
  if (!window.BTRenderer) {
    console.error("BTRenderer is not loaded");
    return;
  }
  betByInstance.value = new BTRenderer().initialize({
    brand_id: "2556215528716906501",
    token,
    themeName: "default",
    lang: languageVal.value,
    target: betByWidgetRef.value,
    widgetName: "promo",
    widgetParams: {
      placeholder: "operator_page",
      onBannerClick: ({ url, customAction }) => {
        exitByClick.value = true;
        killBetByInstance();
        router.push("/gamePlay?gameName=BetBy");
      },

      onOutcomeClick: ({ url }) => {
        console.log("Outcome clicked:", url);
        generatedUrl.value = url;
      }
    }
  });
};

const killBetByInstance = () => {
  if (betByInstance.value) {
    betByInstance.value.kill();
    betByInstance.value = null;
  }
};

onActivated(async () => {
  // const token = await getBetByToken();
  const betByScriptStatus = await loadBetByScript();
  if (!betByScriptStatus) return;
  generateBetByInstance();
});

onDeactivated(() => {
  if (!exitByClick.value) {
    killBetByInstance();
  } else {
    exitByClick.value = false;
  }
});
</script>

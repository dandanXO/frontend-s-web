<template>
  <div class="main-body" :class="{ 'dark-theme': globalStore.isDarkMode, 'light-theme': !globalStore.isDarkMode }">
    <router-view :class="{ menuactive: globalStore.isMenuActive }" />
  </div>
</template>
<script setup>
import { defineComponent, onMounted, version } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";

import { globalStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { LANGUAGE_DEFAULT_VALUE, LANGUAGE_KEY } from "./constant/localStorage";
import { useMemberStatistics } from "@/hooks/memberStatistics";

const currentLanguage = useLocalStorage(LANGUAGE_KEY, LANGUAGE_DEFAULT_VALUE);
const { locale } = useI18n();
useMemberStatistics("https://memsta.thilhe946li.com", "pak");

const checkSID = () => {
  const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
  const fpPromise = FingerprintJS.load();
  (async () => {
    const fp = await fpPromise;
    const result = await fp.get();
    const excludes = { value: ["timezone", "timeZoneOffset"] };
    const allComponents = { ...result.components };
    excludes.value.forEach((element) => {
      delete allComponents[element];
    });
    const sidParam = FingerprintJS.hashComponents(allComponents);
    const obj = {
      identifier: sidParam,
      affiliateCode: affiliateItem
    };

    memberAccessLog(obj);
  })();
};

const checkLanguage = () => {
  locale.value = currentLanguage.value;
};

onMounted(() => {
  checkSID();
  checkLanguage();
  console.log("Vue Version:" + version);
  // checkDevice();
});
</script>

<style lang="scss">
#app {
  font-family: "Baloo", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 1920px;
  margin: auto;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
.light-theme,
.dark-theme {
  background-color: var(--body-background-color);
  color: #ffffff;
  background-size: 100% 400%;
  background-position: 100% 0%;
  .light-theme,
  .dark-theme {
    transition: all 1s;
  }
}
.dark-theme {
  background-position: 100% 100%;
  color: #fff;
}

$shine: 0 0 10px white;
$on-bg: rgba(0, 0, 0, 0.15);
$on-dot-color: #ffb200;
$on-border: 2px solid #ffb200;
$off-bg: rgba(255, 255, 255, 0.15);
$off-dot-color: #eee;
$off-border: 2px solid white;
$togglebutton-size: 16px;
$togglebutton-padding: 4px;
$togglebutton-margin: 10px;
$togglebutton-label-padding: 0px;
$togglebutton-label-color: rgba(149, 149, 149, 0.51);
$togglebutton-label-active-color: rgba(250, 250, 250, 0.51);
$togglebutton-label-weight: normal;
$togglebutton-label-active-weight: bold;

.toggle-box-label-left:empty {
  margin-left: -$togglebutton-margin;
}

.toggle-box-label-left:before,
.toggle-box-label-left:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  // transition
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
  outline: none;
}

.toggle-box input[type="checkbox"],
.toggle-box input[type="checkbox"]:active {
  position: absolute;
  top: -5000px;
  height: 0;
  width: 0;
  opacity: 0;
  border: none;
  outline: none;
}

.toggle-box label {
  display: inline-block;
  position: relative;
  padding: $togglebutton-label-padding;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  color: $togglebutton-label-color;
  font-weight: $togglebutton-label-weight;
}

.toggle-box-label-left:before {
  content: "";
  display: block;
  position: absolute;
  z-index: 1;
  line-height: 34px;
  text-indent: 40px;
  height: $togglebutton-size;
  width: $togglebutton-size;
  margin: $togglebutton-padding;
  // border-radius
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  right: ($togglebutton-size + $togglebutton-label-padding + $togglebutton-margin);
  bottom: $togglebutton-label-padding;
  background: $on-dot-color;
  transform: rotate(-45deg);
  box-shadow: $shine;
}

.toggle-box-label-left:after {
  content: "";
  display: inline-block;
  width: ($togglebutton-size * 2) + ($togglebutton-padding * 2);
  height: $togglebutton-size + ($togglebutton-padding * 2);
  // border-radius
  -webkit-border-radius: $togglebutton-size;
  -moz-border-radius: $togglebutton-size;
  border-radius: $togglebutton-size;
  background: $off-bg;
  vertical-align: middle;
  margin: 0 $togglebutton-margin;
  border: $on-border;
}

.toggle-box input[type="checkbox"]:checked + .toggle-box-label-left:before {
  right: 17px;
  box-shadow: 5px 5px 0 0 $off-dot-color;
  background: transparent;
}

.toggle-box input[type="checkbox"]:checked + .toggle-box-label-left:after {
  background: $on-bg;
  border: $off-border;
}

.toggle-box input[type="checkbox"] + .toggle-box-label-left {
  color: $togglebutton-label-active-color;
  font-weight: $togglebutton-label-active-weight;
}

.toggle-box input[type="checkbox"]:checked + .toggle-box-label-left {
  color: $togglebutton-label-color;
  font-weight: $togglebutton-label-weight;
}

.toggle-box input[type="checkbox"]:checked + .toggle-box-label-left + .toggle-box-label {
  color: $togglebutton-label-active-color;
  font-weight: $togglebutton-label-active-weight;
}
</style>

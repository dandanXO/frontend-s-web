<template>
  <div class="q-pa-md">
    <div class="lang-select-container">
      <q-radio class="select-item" v-model="group" val="en" color="purple">
        <template v-slot>
          <div class="radio-label">
            <img :src="require(`../assets/images/auth/country-flag-en.png`)" class="flag" />
            <span class="text">US</span>
          </div>
        </template>
      </q-radio>
      <q-radio class="select-item" v-model="group" val="ur" color="purple">
        <template v-slot>
          <div class="radio-label">
            <img :src="require(`../assets/images/auth/country-flag-ur.png`)" class="flag" />
            <span class="text">Brazil</span>
          </div>
        </template>
      </q-radio>
    </div>

    <div class="bottom-btn">
      <q-btn no-caps unelevated @click="handleConfirmClick('/')">
        {{ $t("btn.confirm") }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const { languageVal } = storeToRefs(i18nStore());
const { setLanguage } = i18nStore();
const router = useRouter();
const group = ref(languageVal.value);

watch(group, (newVal) => {
  setLanguage(group.value);
  // console.log("asdasd" + `t("btn.confirm")`);
});

// const updateLanguage = (lang) => {
//   setLanguage(lang);
// };

const handleConfirmClick = (route) => {
  router.push(route);
};
</script>

<style scoped lang="scss">
.lang-select-container {
  display: flex;
  flex-direction: column;

  .select-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px 0;
    flex-direction: row-reverse;

    &:last-child {
      border-color: transparent;
    }

    :deep(.q-radio__inner) {
      margin-left: auto;
    }
  }
}

.radio-label {
  display: flex;
  align-items: center;

  img {
    display: block;
    width: 28px;
    margin-right: 6px;
  }
}

.bottom-btn {
  display: flex;
  // width: 100%;
  // margin-top: 20px;
  justify-content: center;

  background-color: #8b00ff;
  width: 100%;
  height: 56px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>

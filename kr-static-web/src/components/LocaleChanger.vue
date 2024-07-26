<template>
  <div class="locale-changer" v-if="store.token && (store.memberType === 'TEST' || store.memberType === 'PROMO_TEST')">
    <!-- <el-select style="width: 100px;" v-model="languageVal" @change="handleLanguage" value-key="code">
      <el-option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang.code" :label="lang.text" />
    </el-select> -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <img :src="require(`../assets/images/common/${languageVal}.png`)" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(lang, i) in langs" @click="handleLanguage(lang.code)" :key="i">
            <img :src="require(`../assets/images/common/${lang.code}.png`)" />
            {{ lang.text }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
import { userStore } from "@/store";
export default {
  name: "locale-changer",
  setup() {
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const { setLanguage } = i18nStoreLanguage;
    const store = userStore();

    const handleLanguage = (newLanguage) => {
      setLanguage(newLanguage);
    };
    const langs = [
      { code: "en", text: "English" },
      { code: "kr", text: "Korean" }
    ];
    return {
      languageVal,
      handleLanguage,
      langs,
      store
    };
  }
};
</script>
<style lang="scss">
.locale-changer {
  padding: 20px;

  img {
    width: 40px;
  }
  .el-dropdown {
    outline: none;
    img {
      width: 25px;
    }
  }
  .el-dropdown-menu {
    img {
      width: 25px;
    }
  }
  :focus-visible {
    outline: none;
  }
}
.el-dropdown-menu__item {
  gap: 5px;
  img {
    width: 25px;
  }
}
</style>

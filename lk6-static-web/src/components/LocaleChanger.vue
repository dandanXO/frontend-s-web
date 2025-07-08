<template>
  <div class="locale-changer">
    <!-- <el-select style="width: 100px;" v-model="languageVal" @change="handleLanguage" value-key="code">
      <el-option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang.code" :label="lang.text" />
    </el-select> -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- <img :src="require(`../assets/images/common/${languageVal}.svg`)"> -->
        <div class="locale-icon" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(lang, i) in langs" @click="handleLanguage(lang.code)">
            <div class="lang-item">
              <span>{{ lang.text }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
export default {
  name: "locale-changer",
  setup() {

    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const { setLanguage } = i18nStoreLanguage

    const handleLanguage = (newLanguage) => {
      setLanguage(newLanguage)
    }
    const langs = [
      { code: "en", text: "English" },
      { code: "zh", text: "简体中文" },
    ]
    return {
      languageVal,
      handleLanguage,
      langs
    }
  }
};
</script>
<style lang="scss" scoped>
.locale-changer {
  cursor: pointer;
  display: flex;
  align-items: center;

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

  .el-dropdown-menu__item {
    gap: 5px;

    .lang-item {
      display: grid;
      grid-template-columns: 0.3fr 0.7fr;
      width: 100%;
      gap: 10px;
    }

    img {
      width: 25px;
    }
  }
}

.locale-icon {
  background: url('../assets/images/home/header-icon-set.svg');
  background-position: 98% 0%;
  background-size: auto 100%;
  background-repeat: no-repeat;
  width: 38px;
  height: 38px;
}
</style>
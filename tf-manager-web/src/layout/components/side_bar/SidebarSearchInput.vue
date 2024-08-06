<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { computed, ref, defineProps } from "vue";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isVisible: Boolean,
});

const router = useRouter()
const store = useStore()

const dynamicRoutesOnlyChildren = computed(() => {
  return filterHiddenAndGetMostBottomLevelMenuItems(store.state.menu.dynamicRoutes);
})

const filterHiddenAndGetMostBottomLevelMenuItems = (dynamicRoutes) => {
  const result = [];
  const filterRoutes = (routeList) => {
    routeList.forEach(route => {
      if (route.meta && !route.meta.hidden) {
        if (route.children) {
          filterRoutes(route.children);
        } else {
          result.push(route);
        }
      }
    });
  };

  filterRoutes(dynamicRoutes);
  return result;
}

const { messages, locale } = useI18n();
const localI18nMenuField = computed(() => messages.value[locale.value]?.menu || {}); // 当下语系的menu所有键值对
const localMenuInfoArr = computed(() => {
  return dynamicRoutesOnlyChildren.value.map(route => {
    const i18nValue = localI18nMenuField.value[route.name] || null;
    return i18nValue ? { ...route, i18nValue: i18nValue } : route; // 如果有匹配的多语系，则组合进 route 中
  });
});

const keywordToSearchMenuItem = ref('');

const fetchSuggestions = (keyword, callback) => {
  const results = [];
  if (keyword === '') {
    localMenuInfoArr.value.forEach(route => {
      let value = route.name;
      const path = route.path;
      if (route.i18nValue) {
        value = route.i18nValue;
      }
      results.push({ value, path });
    })
  } else {
    localMenuInfoArr.value.forEach(route => {
      let value = route.name;
      const path = route.path;
      if (route.i18nValue) {
        value = route.i18nValue;
      }
      if (value.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({ value, path });
      }
    })
  }
  callback(results);
};

const handleMenuItemSelect = (entry) => {
  if (entry.path) {
    router.push(entry.path)
  }
};

const autocompleteStyle = computed(() => ({
  padding: '5px 5px',
  width: '100%',
}));
</script>

<template>
  <el-autocomplete
    v-model="keywordToSearchMenuItem"
    v-if="props.isVisible"
    :fetch-suggestions="fetchSuggestions"
    placeholder="Search..."
    @select="handleMenuItemSelect"
    :style="autocompleteStyle"
    :clearable="true"
  />
</template>

<style scoped>

</style>

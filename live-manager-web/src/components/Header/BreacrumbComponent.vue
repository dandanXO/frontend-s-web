<template>
  <div class="card flex justify-center">
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item }">
        <a style="cursor: pointer" @click="navigateTo(item.route)">
          <span :class="item.icon">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}

watch(
  () => route.name,
  () => (items.value = [{ label: route.name }]),
)

const home = ref({
  label: '首页',
  route: '/',
})

const items = ref([{ label: '仪表板', route: '/' }])
</script>

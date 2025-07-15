<template>
  <div class="tabs-wrapper">
    <router-link
      class="tab-wrapper"
      :to="{
        path: '/account/transfer',
        query: {
          redirect: props.redirect
        }
      }"
    >
      <img v-if="props.activeTab === 'transfer'" class="tab" src="../../assets/images/common/common-md-btn.png" />
      <img v-else class="tab" src="../../assets/images/common/common-md-white-btn.png" />
    </router-link>
    <router-link
      class="tab-wrapper"
      :to="{
        path: '/finance/deposit',
        query: {
          redirect: props.redirect
        }
      }"
    >
      <img v-if="props.activeTab === 'deposit'" class="tab" src="../../assets/images/common/common-md-btn.png" />
      <img v-else class="tab" src="../../assets/images/common/common-md-white-btn.png" />
    </router-link>
    <router-link
      class="tab-wrapper"
      :to="{
        path: '/finance/withdraw',
        query: {
          redirect: props.redirect
        }
      }"
    >
      <img v-if="props.activeTab === 'withdraw'" class="tab" src="../../assets/images/common/common-md-btn.png" />
      <img v-else class="tab" src="../../assets/images/common/common-md-white-btn.png" />
    </router-link>
  </div>
</template>

<script setup>
const props = defineProps(["activeTab", "redirect"]);
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
  align-items: center;

  .tab-wrapper {
    display: flex;

    img.tab {
      width: 100%;
      aspect-ratio: 335/96;
      max-width: 157px;
    }
  }
}
</style>

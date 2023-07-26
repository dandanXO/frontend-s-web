<template>
  <div>
    <div class="platform-menu esports">
      <div
        v-for="nav in navigations"
        :key="nav.code"
        @click="navigateToEsportPage"
      >
        <div class="platform-box">
          <img
            :src="
              require('../../assets/esports/esport_logo_' + nav.icon + '.png')
            "
          />
          <div class="contents">
            <p class="platform-title">{{ nav.label }}电竞</p>
            <p class="platform-slogan">{{ nav.slogan }}</p>
          </div>
        </div>
      </div>
      <div class="header-fs-box">
        <p class="fs-title">电竞</p>
        <p class="fs-name">
          ELECTRONIC
          <br />
          SPORT
        </p>
        <p class="fs-desc">返水最高可达</p>
        <div class="fs-percentage"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  data: () => ({
    navigations: [
      {
        code: "TFGAMING",
        icon: "tfgaming",
        label: "兴發",
        slogan: "亚洲先驱 实时滚球"
      }
    ]
  }),
  setup() {
    const router = useRouter();
    const navigateToEsportPage = () => {
      router.push("/esports");
    };

    return {
      navigateToEsportPage
    };
  }
});
</script>

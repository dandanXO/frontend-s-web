<template>
    <div>
        
        <div class="platform-menu games">
            
          <div
              class="platform-box"
              v-for="nav in sortedNavigations"
              :key="nav.code"
            >
                <router-link :to="`/game?plat=${nav.code}`">
                <img :src="require('../../assets/game/header_slot_logo_'+ nav.icon + '.png')" style="width: 75px;">
                <p class="platform-title">{{ nav.label }} 电子</p>
                <div class="platform-img" :class="'slot-' + nav.icon"></div>
                </router-link>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">电子游艺</p>
            <p class="fs-name">SLOT<br>GAME</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage p120"></div>
        </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        list: Array
    },
    data: () => ({
        navigations: [
        { code: "PP", icon: "pp", label: "PP" },
        { code: "MGP", icon: "mg", label: "MG" },
        { code: "PT", icon: "pt", label: "PT" },
        { code: "SW", icon: "sw", label: "SW" },
        { code: "PG", icon: "pg", label: "PG" },
        { code: "SG", icon: "sg", label: "SG" },
        ]
    }),
    computed: {
    sortedNavigations() {
      const orderArray = this.list;

      // Create a map to store the index of each code in the orderArray
      const codeIndexMap = {};
      orderArray.forEach((item, index) => {
        codeIndexMap[item.code] = index;
      });

      // Custom comparison function to sort based on the index in the orderArray
      function compareByCode(a, b) {
        const indexA = codeIndexMap[a.code];
        const indexB = codeIndexMap[b.code];

        return indexA - indexB;
      }
      // Filter navigations to include only those codes that exist in the orderArray
      const filteredNavigations = this.navigations.filter((nav) =>
        orderArray.some((item) => item.code === nav.code)
      );

      // Sort the filteredNavigations array based on the custom comparison function
      return filteredNavigations.slice().sort(compareByCode);
    },
  }
})
</script>
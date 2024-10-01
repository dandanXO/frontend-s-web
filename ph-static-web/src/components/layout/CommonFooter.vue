<template>
  <footer class="footer" :class="{ 'menuactive' : globalStore.isMenuActive }">
    <div class="container">
      <div class="grid">
        <router-link class="footer-link" to="/about">About Play4Win</router-link>

        <router-link class="footer-link" to="/about?id=data-collection">Data Collection</router-link>

        <router-link class="footer-link" to="/about?id=legal-grounds">Legal Grounds</router-link>

        <router-link class="footer-link" to="/about?id=betting-rules">Betting Rules</router-link>

        <router-link class="footer-link" to="/about?id=compensation">Compensation</router-link>

        <router-link class="footer-link footer-nav" to="/register">Join US</router-link>

        <router-link class="footer-link" to="/about?id=responsible-gambling">
          Responsible Gambling
        </router-link>
      </div>

      <div class="partners">
        <img src="../../assets/images/common/logo/JOKER.png" alt="JOKER" />
        <img src="../../assets/images/common/logo/MGP.png" alt="MGP" />
        <img src="../../assets/images/common/logo/BNG.png" alt="BNG" />
        <img src="../../assets/images/common/logo/JILI.png" alt="JILI" />

        <!-- Playstar -->
        <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/fa-chai-logo.png" alt="FC" />
        <img v-else src="../../assets/images/common/logo/FC.png" alt="FC" />

        <img src="../../assets/images/common/logo/CQ9.png" alt="CQ9" />
        <img src="../../assets/images/common/logo/JDB.png" alt="JDB" />

        <!-- KA Gaming -->
        <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/ka-gaming-logo.png" alt="KA" />
        <img v-else src="../../assets/images/common/logo/KA.png" alt="KA" />
        
        <img src="../../assets/images/common/logo/RICH88.png" alt="RICH88" />

        <!-- Play Star -->
        <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/playstar-logo.png" alt="PS" />
        <img v-else src="../../assets/images/common/logo/PS.png" alt="PS" />
        
        <!-- Ezugi -->
        <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/ezugi-logo.png" alt="ezugi" />
        <img v-else src="../../assets/images/common/logo/ezugi.png" alt="ezugi" />

        <img src="../../assets/images/common/logo/AWS.png" alt="AWS" />
        <!-- <img src="../../assets/images/common/logo/EVO.png" alt="EVO" /> -->
        <img src="../../assets/images/common/logo/KingMaker.png" alt="KingMaker" />
      </div>
    </div>

    <div class="text-center footer-notes">
      <div class="container">
        Play4win is a legal gaming company. It has an inland gaming license issued by the PAGCOR Philippines subject to
        it's supervision.
      </div>
    </div>
  </footer>

  <StickyMenu />
</template>

<script setup>
import StickyMenu from "@/components/stickyMenu";

import { globalStore } from '@/store';

</script>

<style scoped lang="scss">
.footer {
  background: #2B2B82;
  color: #000;
  line-height: 2.5;
  padding-top: 2rem;
  font-family: 'Baloo Bhaina';
  &.menuactive {
    margin-left: 200px;
  }
.container {
  width: 95%;
  margin: 0 auto;
}
  a {
    color: #6b7280;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px 0;
    margin: 20px;

    .footer-link {
      color: #83A3CA;
      font-weight: 400;
  font-family: 'Baloo Bhaina';
      &:hover {

      }
    }
  }

  @media (max-width: 767px) {
    line-height: 3;
  }
}
.partners {
  padding-top: 1rem;
  align-items: center;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px 50px;

  img {
    height: 1.35rem;
    padding: 0px 8px;
  }
}

.footer-notes {
  margin-top: 2rem;
  font-size: 0.75rem;
  padding-block: 0.85em;
  background: #1A1A51;
  border-top: $border-settings;
  color: #aaa;

  @media (max-width: 767px) {
    line-height: 1.2;
  }
}
.dark-theme {
  .footer {
    background: #080808;
  }
  .footer-notes {
    border-top: 0;
    background: #101419;
    color: #83A3CA;
  }
}

</style>

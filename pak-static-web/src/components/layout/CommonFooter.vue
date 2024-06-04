<template>
  <footer class="footer" :class="{ menuactive: globalStore.isMenuActive }">
    <div class="container">
      <div class="wrapper">
        <span class="logo">LOGO</span>
        <div class="grid">
          <router-link class="footer-link" to="/about">About B9.Game</router-link>

          <router-link class="footer-link" to="/about?id=data-collection">Collect Information</router-link>

          <router-link class="footer-link" to="/about?id=legal-grounds">Legal Basis</router-link>

          <router-link class="footer-link" to="/about?id=betting-rules">Betting Rules</router-link>

          <router-link class="footer-link" to="/about?id=compensation">Compensation</router-link>

          <router-link class="footer-link" to="/about?id=responsible-gambling">Gambling Responsibly</router-link>

          <a class="footer-link footer-nav" href="">Affiliates</a>
        </div>
      </div>

      <div class="partners">
        <img src="@/assets/images/common/logo/logo-ag.png" alt="AG" />
        <img src="@/assets/images/common/logo/logo-cmd.png" alt="CMD368" />
        <img src="@/assets/images/common/logo/logo-rich88.png" alt="RICH88" />
        <img src="@/assets/images/common/logo/logo-tian-cheng.png" alt="TAIN-CHEN" />
        <img src="@/assets/images/common/logo/logo-10016.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10017.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10018.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10019.png" alt="" />
        <img src="@/assets/images/common/logo/logo-acb.png" alt="ACB" />
        <img src="@/assets/images/common/logo/logo-10015.png" alt="" />
        <img src="@/assets/images/common/logo/logo-world.png" alt="WORLD" />
        <img src="@/assets/images/common/logo/logo-sb.png" alt="SB" />
        <img src="@/assets/images/common/logo/logo-wm.png" alt="WM" />
        <img src="@/assets/images/common/logo/logo-10009.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10010.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10011.png" alt="" />
        <img src="@/assets/images/common/logo/logo-kp.png" alt="KP" />
        <img src="@/assets/images/common/logo/logo-10013.png" alt="" />
        <img src="@/assets/images/common/logo/logo-10014.png" alt="" />
        <!-- <img src="../../assets/images/common/logo/JOKER.png" alt="JOKER" />
        <img src="../../assets/images/common/logo/MGP.png" alt="MGP" />
        <img src="../../assets/images/common/logo/BNG.png" alt="BNG" />
        <img src="../../assets/images/common/logo/JILI.png" alt="JILI" /> -->

        <!-- Playstar -->
        <!-- <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/fa-chai-logo.png" alt="FC" />
        <img v-else src="../../assets/images/common/logo/FC.png" alt="FC" /> -->

        <!-- <img src="../../assets/images/common/logo/CQ9.png" alt="CQ9" />
        <img src="../../assets/images/common/logo/JDB.png" alt="JDB" /> -->

        <!-- KA Gaming -->
        <!-- <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/ka-gaming-logo.png" alt="KA" />
        <img v-else src="../../assets/images/common/logo/KA.png" alt="KA" /> -->

        <!-- <img src="../../assets/images/common/logo/RICH88.png" alt="RICH88" /> -->

        <!-- Play Star -->
        <!-- <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/playstar-logo.png" alt="PS" />
        <img v-else src="../../assets/images/common/logo/PS.png" alt="PS" /> -->

        <!-- Ezugi -->
        <!-- <img v-if="globalStore.isDarkMode" src="../../assets/images/common/logo/dark/ezugi-logo.png" alt="ezugi" />
        <img v-else src="../../assets/images/common/logo/ezugi.png" alt="ezugi" /> -->

        <!-- <img src="../../assets/images/common/logo/AWS.png" alt="AWS" /> -->
        <!-- <img src="../../assets/images/common/logo/EVO.png" alt="EVO" /> -->
        <!-- <img src="../../assets/images/common/logo/KingMaker.png" alt="KingMaker" /> -->
      </div>
    </div>

    <!-- <div class="text-center footer-notes">
      <div class="container">
        Play4win is a legal gaming company. It has an inland gaming license issued by the PAGCOR Philippines subject to
        it's supervision.
      </div>
    </div> -->
  </footer>

  <StickyMenu />
</template>

<script setup>
import StickyMenu from "@/components/stickyMenu";

import { globalStore } from "@/store";
</script>

<style scoped lang="scss">
.footer {
  background: var(--footer-background-color);
  color: #000;
  line-height: 2.5;
  padding: 45px 0;
  font-family: "Baloo Bhaina";

  &.menuactive {
    margin-left: $menu-width;
  }

  .container {
    width: 95%;
    margin: 0 auto;
  }

  .wrapper {
    display: flex;
    gap: 120px;

    .logo {
      font-family: Microsoft YaHei UI;
      font-size: 40px;
      font-weight: 700;
      line-height: 53.2px;
      color: #ffffff;
    }
  }

  a {
    color: #a4aabb;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 20px 0;
    margin: 20px;

    .footer-link {
      color: #a4aabb;
      font-weight: 400;
      font-family: "Baloo Bhaina";
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
    filter: grayscale(100%);
    &:hover {
      filter: none;
    }
  }
}

.footer-notes {
  margin-top: 2rem;
  font-size: 0.75rem;
  padding-block: 0.85em;
  background: #1a1a51;
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
    color: #83a3ca;
  }
}
</style>

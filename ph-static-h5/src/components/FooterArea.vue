<template>
  <footer class="footer" style="display:none;">
    <div class="footer-bg">
      <div class="footer-links">
        <router-link class="footer-link" to="/about">About Play4Win</router-link>
        <router-link class="footer-link" to="/about?id=data-collection">Data Collection</router-link>
        <router-link class="footer-link" to="/about?id=legal-grounds">Legal Grounds</router-link>
        <router-link class="footer-link" to="/about?id=betting-rules">Betting Rules</router-link>
        <router-link class="footer-link" to="/about?id=compensation">Compensation</router-link>
        <router-link class="footer-link footer-nav" to="/register">Join US</router-link>
        <router-link class="footer-link" to="/about?id=responsible-gambling">Responsible Gambling</router-link>
      </div>

      <div class="footer-partners">
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-joker.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-micro-gaming.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-bng.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-jili.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-fa-chai.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-cq9.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-jdb.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-ka-gaming.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-rich-88.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-play-star.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-ezugi.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-ae-sexy.svg" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-evo.png" />
        <img class="partner-logo" src="../assets/images/common/logo/footer/footer-logo-king-maker.svg" />
      </div>
    </div>

    <div class="footer-notes">
      Play4win is a legal gaming company. It has an inland gaming license issued by the PAGCOR Philippines subject to
        it's supervision.
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped lang="scss">
.footer {
  margin-top: 20px;
}
.footer-bg {
  display: grid;
  gap: 20px;
  background-color: #2B2B82;
  padding: 20px;

  .footer-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    font-size: 16px;

    .footer-link {
      color: #83A3CA
    }
  }

  .footer-partners {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    align-items: center;

    .partner-logo {
      width: 80%;
    }
  }
}

.footer-notes {
  font-size: 14px;
  background-color: #1A1A51;
  padding: 20px;
  color: #83a3ca;
  text-align: flex-start;
}
</style>
  
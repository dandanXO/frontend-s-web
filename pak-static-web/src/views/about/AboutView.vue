<template>
  <div>
    <div class="margin-center about-container">
      <a-tabs v-model:activeKey="activeTab" :tab-position="windowSize > 768 ? 'left' : 'top'">
        <!-- <template #tabBarExtraContent v-if="windowSize > 768">
        </template> -->
        <a-tab-pane key="about" tab="About us">
          <div>
            <div class="about-title-container">
              <span class="menu-title">About us</span>
            </div>
            <p>
              play4win's missions and motto: To provide Customer with best betting odds and services: Our advantage:
              Website and market odds are updated timely. Funds transfer are lightning fast, allowing you to freely
              allocate your funds anytime, anywhere in order to wager big money, at the same time, enjoying the best
              odds.
            </p>
            <div class="content-title-container">
              <span class="content-title">PRODUCT VARIETY</span>
            </div>
            <p>
              play4win is Philippines recognized specialist in sport live betting, we provide an average of about 10,000
              live sport matches every month. Moreover, we support more than 400 different football leagues, other than
              just well-known professional leagues. The following league is supported: Greek League / Italian C League
              Cup / Serie A / Russian League / Croatian Cup / Bougainvillea/Leah Cup/Norway Cup/ Bundesliga/Roman
              B/Denmark A/France B/Thailand Copa del Rey/Cyprus Cup/Brazil B-League/Japan A/Korea A/Argentina A... and
              more live events for you to follow.
            </p>
            <p>
              Besides sport product, we offer a wide variety of product including live casino, live dealer, Esports
              which you cannot missed. In order to satisfy members in Philippines. play4win carefully select a variety
              of online games to provide you with the best game and platform choices. We continue to improve our
              products and add more exciting new products, allowing you to enjoy first-class services in live
              entertainment.
            </p>
            <div class="content-title-container">
              <span class="content-title">COMPANY PROFILE</span>
            </div>
            <p>
              play4win holds the Inland gaming license authorized by PAGCOR Philippines and headquartered in metro
              Manila. At present, we are expert in bookmaking, gaming technologies, and possessing a professional team
              of customer support and technical engineer. Through offering excellent products and high-quality customer
              services, we provide customers with best online entertainment experiences. Compare to land-based casino,
              we offer by far better odds! To maintain fairness of the games, when it comes down to picking a platform,
              play4win with professional 24/7 customer service team, facilitating financial team, strong financial
              capacity will be your angel of choice. On top of that, we adopt the best encryption technology and
              firewall system to protect your security, privacy, and to ensure that you enjoy a fair and just gameplay.
              Due to the adoption of enterprise-level encryption technology (1024-bit RSA key exchange and 448-bit
              blowfish), we can provide your data with a higher level of security, more than that of SSL This technology
              is currently adopted by major financial institutions over the world.
            </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="data-collection" tab="Data Collection">
          <div>
            <div class="about-title-container">
              <span class="menu-title">Data collection</span>
            </div>
            <div class="content-title-container">
              <span class="content-title">General information</span>
            </div>
            <p>
              When accessing the Internet, the browser or client software may transmit information to the server of the
              website you are visiting. This information will generate statistical information of website visitors and
              will be used for marketing purposes to help us improve users experience.
            </p>
            <div class="content-title-container">
              <span class="content-title">Personal identifiable information (PII)</span>
            </div>
            <p>
              The personal information we collect from you helps us identify you. This information may include, but not
              limited to: the information you provided when opening an account, such as your name, email address, phone
              number, birthday, and other required information that you may need to provide to enable us to set up and
              manage your account.
            </p>
            <div class="content-title-container">
              <span class="content-title">
                Your data may be processed as, but not limited to the following situations:
              </span>
            </div>
            <ul class="content-list decimal-style">
              <li>Perform account management and process your transactions on our website.</li>
              <li>Provide you with gaming and betting services</li>
              <li>
                For verification and identification purposes, such as ensuring that you have reached the legal age and
                are not in the prohibited jurisdiction specified by the rules and terms of this website.
              </li>
              <li>Customize the event materials according to your preferences.</li>
              <li>Website diagnosis and maintenance.</li>
              <li>Monitor and improve website services.</li>
              <li>Risk management, fraud detection and money laundering compliance.</li>
              <li>Comply with any legal or regulatory requirements.</li>
              <li>
                In the process of providing relevant support and services, in accordance with the requirements of our
                software suppliers (subject to the terms of this policy). We also reserve the right to measure user
                interests and perform statistical analysis of user behavior on the use of different areas of the
                website. In addition, we will also notify advertisers of information such as the number of users viewed
                or clicked on advertising banners. We will only provide the aggregated data of these analyses to third
                parties.
              </li>
              <li>
                play4win cooperates with multiple associations to ensure the fairness and integrity of sports
                competitions, and to prevent artificial competitions. Therefore, all parties reserve the right to
                monitor and share player betting records.
              </li>
            </ul>
            <div class="content-title-container">
              <span class="content-title">Payout information</span>
            </div>
            <p>
              For marketing purposes, we reserve the right to disclose any profits or prizes on the website or other
              promotional media. We may publish your username in abbreviation, profit amount and other information on
              the website when necessary for publicity.
            </p>
            <div class="content-title-container">
              <span class="content-title">Safety</span>
            </div>
            <p>
              We do our best to ensure that your information is stored safely with us. All data transmission will be
              encrypted. When the data is stored on our server, the latest firewall technology will ensure the safety of
              these data. Our website and software will try our best to ensure the accuracy and privacy of the data and
              ensure that your information will not be misused or lost.
            </p>
            <div class="content-title-container">
              <span class="content-title">Data Security</span>
            </div>
            <p>
              Regardless of the information contained, all storage media related to the company's interactive gaming
              website will be required to be handled securely.
            </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="legal-grounds" tab="Legal Grounds">
          <div>
            <div class="about-title-container">
              <span class="menu-title">Legal grounds</span>
            </div>
            <ul class="content-list decimal-style">
              <li>This privacy policy strictly complies with relevant data protection laws;</li>
              <li>
                If you are under the age of 21, you are not allowed to use and/or the website under any circumstances.
              </li>
              <li>
                Some legal jurisdictions do not state the legality of online gambling, while others clearly stipulate
                that online gambling is illegal.
              </li>
              <li>
                We never attempted to allow anyone in the area to be prohibited by law from using the casino and/or
                website.
              </li>
              <li>Casinos are not allowed to be used in any place where it is prohibited by applicable laws.</li>
              <li>
                If we believe that your use of our online gaming violates these terms, we reserve the right to close the
                player's account and take appropriate measures.
              </li>
            </ul>
          </div>
        </a-tab-pane>
        <a-tab-pane key="betting-rules" tab="Betting Rules">
          <div>
            <div class="about-title-container">
              <span class="menu-title">Betting Rules</span>
            </div>
            <ul class="content-list decimal-style">
              <li>
                All offer is restricted to only one free open account per individual, family, household address, email
                address, telephone number, bank account and IP address.
              </li>
              <li>
                Our offers are intended for recreational players only and play4win may in our sole discretion limit the
                eligibility of customers to participate in any promotion.
              </li>
              <li>
                We reserve the right to alter, amend or terminate this Promotion, or any aspect of it, at any time and
                without prior notice. All play4win Terms & Conditions and Rules apply
              </li>
              <li>Only deposit applied for one promotion.</li>
              <li>
                Refunds will be based on the total amount of valid bet (betting turnover) of the members at Sport
                product for each bet and each membership level.
                <ul class="content-list disc-style">
                  <li>Lose All - Refund on stake</li>
                  <li>Lose less than stake - Refund on Win/Loss</li>
                  <li>Win >= 75% - Refund on stake</li>
                  <li>Win &lt; 75% - Cashback on winnings</li>
                </ul>
              </li>
              <li>Rollover must be fulfilled within 30 days to prevent forfeited of Bonus and winning amount.</li>
              <li>
                The determination of what constitutes bonus abuse shall be at the sole discretion of the company, but
                for clarity what will be considered evidence of bonus abuse shall include, but not be limited to, the
                following examples:
                <br />
                Wagering the bonus money on excluded games
                <br />
                Multiple account strategy
                <br />
                Cross platform betting strategy
                <br />
                Arbing of bets
                <br />
                Two tier betting strategy
                <br />
                Affiliate CPA or revenue share abuse
              </li>
              <li>
                We reserve the right to review transaction records and logs from time to time and for any reason. If,
                upon review, we discover a player who has benefited from promotional funds by participating in betting
                patterns or strategies at our sole discretion deems to be abusive, we reserve the right to withdraw the
                bonus amount and any associated winnings
              </li>
              <li>
                Any person deviating from promotional rules may be disqualified, meaning that the bonus and any
                associated winnings will be forfeited.
              </li>
              <li>
                We reserve the right to end or amend any promotion at any time for any reason without giving notice.
              </li>
              <li>
                Withdrawals may be subject to audit and/or identity verification before being processed. You may be
                requested to furnish proof of identification, address, age and/or proof of deposit, proof of game play
                or telephone number. Failure to provide this information to us within 72 hours of a request being made
                may result in the bonus and any associated winnings being withdrawn.
              </li>
              <li>
                Participants must be 18 years old, have intellectual capacity and be able to take responsibility for
                their own decisions.
              </li>
            </ul>
          </div>
        </a-tab-pane>
        <a-tab-pane key="compensation" tab="Compensation">
          <div>
            <div class="about-title-container">
              <span class="menu-title">Compensation</span>
            </div>
            <p>
              play4win's users hereby agree that when connect to our betting website, download or install our betting
              softwares. Place bet and/or use our service and/or betting information through any method that
              violate/against our regulation, and/or cause any damage, loss, claim fee to our shareholders, employees,
              managers, directors, boards, licensees, distributors of play4win. The user shall be required to compensate
              play4win in full The casino (all games) bet the highest payout to any member is Php1,000,000. If all
              non-deposited members have won the progressive jackpot before depositing, the winning pool will be
              considered invalid. (Including free betting members)
            </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="responsible-gambling" tab="Responsible Gambling">
          <div>
            <div class="about-title-container">
              <span class="menu-title">Responsible Gambling</span>
            </div>
            <p>We hope all our valued users have fun at play4win</p>
            <p>Gambling is a form of entertainment and should not burden your financial and emotional life</p>
            <p>
              Borrowing money to play, overspending budget or embezzling money for other purposes is not only unwise,
              but also causes serious problems for you and the people around you.
            </p>
            <p>We hope you have fun at Play4Win, so please bet responsibly and have fun!</p>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="js">
import { ref, onMounted, onUnmounted, defineComponent, watch } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "AboutView",

  setup() {
    const activeTab = ref("about");
    const router = useRoute();
    const windowSize = ref(window.innerWidth)
    onUnmounted(() => { window.removeEventListener('resize', () =>
    {windowSize.value = window.innerWidth}) })

    watch(() => router.query, () => {
      if (router.query === null) {
        activeTab.value === 'about'
      } else {
        activeTab.value = router.query.id; window.scrollTo(0, 0);
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });

    onMounted(() => {
      const router = useRoute();
      if (router.query.id) {
        activeTab.value = router.query.id;
      }
    window.addEventListener('resize', () => {windowSize.value = window.innerWidth} )
    });

    return {
      activeTab,
      windowSize
    };
  }
});
</script>
<style scoped lang="scss">
.about-container {
  max-width: 1300px;
  border-radius: 20px;
  width: 95%;
  margin: 40px auto;
  box-shadow: 0px 4px 10px 0px #0000001a;

  .content-list {
    margin: 0;
    padding: 0;

    > li {
      margin: 5px 20px;
    }

    &.decimal-style {
      list-style-type: decimal;
    }

    &.disc-style {
      list-style-type: disc;
    }
  }

  .about-title-container {
    position: relative;
    font-size: 30px;

    margin-bottom: 30px;
    font-family: "Poppins Bold";
    color: #ffffff;
  }
  li,
  p {
    color: #8c968f;
    margin-left: 25px;
  }
  ol,
  p {
    &:before {
      content: "";
      width: 8px;
      height: 8px;
      position: absolute;
      transform: rotate(45deg);
      background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      margin-left: -20px;
      margin-top: 5px;
    }
  }

  .content-title-container {
    position: relative;
    text-align: left;
    padding: 26px 0;

    .content-title {
      position: relative;
      font-size: 20px;
      font-family: "Poppins Bold";
      text-transform: uppercase;
      // &::before,
      // &::after {
      //   content: "";
      //   position: absolute;
      //   top: 2px;
      //   height: 12px;
      //   width: 12px;
      //   background-image: linear-gradient(0deg, #0471a5 0%, #1bcef1 100%),
      //     linear-gradient(#ffffff, #ffffff);
      // }
      // &::before {
      //   left: -20px;
      // }
      // &::after {
      //   right: -20px;
      // }
    }
  }
}
</style>
<style scoped lang="scss">
.about-container :deep(.ant-tabs) {
  border-radius: 20px;
  background: #171719;
  min-height: 60vh;
  color: #ffffff;
}
.about-container :deep(.ant-tabs .ant-tabs-left) {
  background: #ecf5ff;
}
.about-container :deep(.ant-tabs .ant-tabs-left-content) {
  min-height: 60vh;
}
.about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-nav-container) {
  padding: 25px 0;
}
.about-container :deep(.ant-tabs .ant-tabs-left-bar) {
}

.about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-extra-content) {
  padding: 30px 0;

  img {
    width: 114px;
  }
}

.about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-tab) {
  padding: 14px 40px;
  text-align: left;
  color: #8c968f;
  &:hover {
    color: #ffffff;
  }
}
:deep(.ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane, .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane) {
  padding: 30px;
}

.about-container :deep(.ant-tabs .ant-tabs-nav .ant-tabs-tab-active) {
  color: #ffffff;
  font-family: "Poppins Medium";
  background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
}

.about-container :deep(.ant-tabs-ink-bar) {
  // background-color: $primary-color-lightest;
  background: transparent;
}

.about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-ink-bar) {
  width: 5px;
}

.about-container :deep(.ant-tabs .ant-tabs-left-content) {
  padding: 20px 50px;
  border-color: #0f0b0b;
  background: #0f0b0b;
  // padding-right: 50px;
  // border-left: 4px solid #23263c;
  // margin-left: -4px;
}
.dark-theme .about-container :deep(.ant-tabs .ant-tabs-left-content) {
  background: #ffffff05;
  border: 0;
}
.dark-theme .about-container :deep(.ant-tabs) {
  color: #ffffff;
  background: #ffffff05;
  p,
  li {
    color: #ffffff;
  }
}
.dark-theme .about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-tab) {
  color: #ffffff;
}

.dark-theme .about-container :deep(.ant-tabs .ant-tabs-left-bar) {
  border: 0;
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .about-container :deep(.ant-tabs .ant-tabs-bar) {
    border: 0;
    position: relative;
  }
  .about-container :deep(.ant-tabs .ant-tabs-top-bar) {
    &:before {
      position: absolute;
      content: "";
      bottom: 0;
      height: 4px;
      width: 100%;
      background: #ffffff;
    }
  }

  .about-container :deep(.ant-tabs .ant-tabs-top-content) {
    margin-top: -4px;
  }

  .about-container :deep(.ant-tabs .ant-tabs-left-bar .ant-tabs-extra-content) {
    display: none;
  }
  .about-container :deep(.ant-tabs .ant-tabs-ink-bar) {
    height: 4px;
  }
  .about-container :deep(.ant-tabs-nav .ant-tabs-tab) {
    margin: 0;
  }
}
</style>

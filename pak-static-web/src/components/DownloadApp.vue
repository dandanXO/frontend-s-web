<template>
  <div class="og-download-app-section" ref="ogDownloadAppRef">
    <div class="container">
      <Transition name="slideRight">
        <div class="flex-column flex-grow flex-start" v-show="animate">
          <div class="leftside">
            <div>
              <h2>
                Download the
                <span class="special">APP</span>
              </h2>
              <h3>The future of gaming is here. Great games on all devices. Play4Win App</h3>
            </div>
            <div>
              <div class="table">
                <div class="og-qr-grid">
                  <div class="flex-center">
                    <img
                      :src="require('@/assets/images/index/download-qr-code.png')"
                      alt="Web"
                      width="176"
                      height="176"
                    />
                  </div>
                  <div class="og-qr-phone ios">
                    <img class="is-light" :src="require('@/assets/images/index/appiconiosblue.svg')" />
                    <img class="is-dark" :src="require('@/assets/images/index/appiconios.svg')" />
                    <a-button target="_blank" :href="appDownloadUrl" class="common-btn">App Download</a-button>
                    <!-- <a-button class="common-btn outline">Installation Instructions</a-button> -->
                  </div>
                  <div class="og-qr-phone android">
                    <img class="is-light" :src="require('@/assets/images/index/appiconandroidblue.svg')" />
                    <img class="is-dark" :src="require('@/assets/images/index/appiconandroid.svg')" />
                    <a-button target="_blank" :href="appDownloadUrl" class="common-btn">App Download</a-button>
                    <!-- <a-button class="common-btn outline">Installation Instructions</a-button> -->
                  </div>
                </div>
              </div>
              <h3 class="text-low-piority">Scan to download the APP</h3>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="slideLeft">
        <div class="rgtside" v-show="animate">
          <img
            :src="require('@/assets/images/index/download-app-splash.png')"
            alt="Download App Splash"
            class="img-responsive"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Logo from "@/components/Logo";
import { getAppDownload } from "@/api/personal/common";

const appDownloadUrl = ref();
const ogDownloadAppRef = ref();
const animate = ref(false);
const observer = new IntersectionObserver(
  ([entry]) => {
    animate.value = entry.isIntersecting;
    if (animate.value) observer.unobserve(ogDownloadAppRef.value);
  },
  {
    threshold: 0.1
  }
);

onMounted(() => {
  observer.observe(ogDownloadAppRef.value);

  getAppDownload().then((res) => {
    if (res.code === 0 && res.data) {
      appDownloadUrl.value = res.data;
    }
  });
});
</script>

<style scoped lang="scss">
.og-download-app-section {
  // background: $primary-lightest-linear-background;
  padding-block: 3rem;
  // min-height: 45rem; // since v-if & v-show conditioning for Transition wouldn't take up spaces, force a height.

  .container {
    display: flex;
    width: 95%;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
  }

  h2 {
    font-family: "Baloo Bhaina";
    font-size: 2.4rem;
    line-height: 42px;
    margin: 0;
    .special {
      /* Create the gradient. */
      background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 20.07%);

      /* Set the background size and repeat properties. */
      background-size: 100%;
      background-repeat: repeat;

      /* Use the text as a mask for the background. */
      /* This will show the gradient as a text color rather than element bg. */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-background-clip: text;
      -moz-text-fill-color: transparent;
    }
  }

  h3 {
    margin-bottom: 50px;
    font-size: 1.2rem;
    line-height: 1.5569;
    color: #83a3ca;
    font-family: "Microsoft Yahei UI";
    font-weight: 700;
    &.text-low-piority {
      font-size: 0.9rem;
      line-height: 155.69%;
      font-weight: 400;
      margin: 10px 0;
      color: #83a3ca;
    }
  }
}
.dark-theme {
  .og-download-app-section {
    background: linear-gradient(rgb(16 20 25) 10%, rgb(16 20 25) 10%, rgb(0 23 63 / 60%) 60%, rgb(16 20 25) 100%);
    background-color: #101419;
  }
}

.og-logo {
  margin-block: 0.55rem;
}

.og-qr-grid {
  display: grid;
  gap: 1.3rem 3rem;
  grid-template-columns: repeat(3, 1fr);
}
.og-qr-phone {
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 80px;
  }
  .is-dark {
    display: none;
  }
  .is-light {
    display: block;
  }
}
.dark-theme {
  .og-qr-phone {
    .is-dark {
      display: block;
    }
    .is-light {
      display: none;
    }
  }
}

.slideRight-enter-active,
.slideRight-leave-active,
.slideLeft-enter-active,
.slideLeft-leave-active {
  transition: 0.5s ease;
}

.slideRight-enter-from,
.slideRight-leave-to {
  transform: translate(-1000px, 0);
}

.slideLeft-enter-from,
.slideLeft-leave-to {
  transform: translate(1000px, 0);
}
</style>

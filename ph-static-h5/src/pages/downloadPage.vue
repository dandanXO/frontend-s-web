<template>
  <div class="download-page-container">

    <div class="header-title"><img src="../assets/play4winapp.svg"/></div>

    <div class="description-text">The world's first integrated entertainment nativeAPP showing smooth and perfect operationMassive sports, top e-sports events, liveentertainment, lottery betting and electronicgames, etc., the latest and most completeentertainment items are all in the palm of yourhand to experience the scan code download, youcan have it!</div>

    <div class="download-block">
        <div class="download-group-container">
          <div style="display: flex; width: 50%; justify-content: center; flex-direction: column;">
            <div class="download-icon">
              <img :src="$q.dark.isActive ? require('../assets/download/iphone-dark.png') : require('../assets/download/iphone-light.png')"/>
              </div>
          </div>
          <div style="display: flex; width: 50%; justify-content: center; flex-direction: column;">
            <div class="download-icon">
              <img :src="$q.dark.isActive ? require('../assets/download/android-dark.png') : require('../assets/download/android-light.png')"/>
              </div>
          </div>
        </div>
        <div class="download-group-container">
          <div style="display: flex; width: 50%; justify-content: center; flex-direction: column;">
            <div class="download-device-text">
              iPhone
              </div>
          </div>
          <div style="display: flex; width: 50%; justify-content: center; flex-direction: column;">
            <div class="download-device-text" >
              Android
              </div>
          </div>
        </div>
        <div class="download-group-container">
          <div class="download-app-download">
          <a href="https://p4w.app/" target="_blank">
            <q-btn unelevated style="padding-left: 1rem">
              <img src="../assets/download/app-download.png"/>
            </q-btn>
          </a>
        </div>
        <div class="download-app-download">
          <a href="https://p4w.app/" target="_blank">
            <q-btn unelevated style="padding-left: 0rem">
              <img src="../assets/download/app-download.png"/>
            </q-btn>
          </a>
        </div>
        </div>
        <div class="download-group-container">
          <div class="download-app-download">
            <a href="" target="_blank">
              <q-btn unelevated style="padding-left: 1rem">
                <img :src="$q.dark.isActive ? require('../assets/download/installation-instructions-dark.png') : require('../assets/download/installation-instructions-light.png')"/>
              </q-btn >
            </a>

        </div>
        <div class="download-app-download">
          <a href="" target="_blank">
              <q-btn unelevated style="padding-left: 0rem">
                <img :src="$q.dark.isActive ? require('../assets/download/installation-instructions-dark.png') : require('../assets/download/installation-instructions-light.png')"/>
              </q-btn >
            </a>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="show" class="download-image-block" >
          <img src="../assets/download/bottom-image.png"/>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const show = ref(false);

    onMounted(() => {
      // Set a timeout to allow the initial rendering to complete
      setTimeout(() => {
        show.value = true;
      }, 500);
    });

    return {
      show,
    };
  },
};
</script>




<style scoped lang="scss">
.download-page-container {
  display: flex;
  flex-direction: column;

}
.header-title {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 10px;

  img {
    width: 211px;
    height: 42px;
  }
}

.description-text {
    display: flex;
    width: 100%;
    padding: 1.5rem;
    color: #83A3CA;
    font-weight: 500;
    font-size: 14px;
    line-height: 16.8px;
}

.download-block {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px
}
.download-group-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.download-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.download-device-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter Medium";
  font-weight: 500;
  font-size: 14px;
  line-height: 16.8px;
  color: #2B2B82;
}
.download-app-download {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.download-image-block {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  width: 100%;
  transition: transform 5s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>

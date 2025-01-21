<template>
    <q-dialog width="100%" v-model="showPopupDialog" @update:model-value="offPopupModal">
        <q-card flat style="width: 70%; max-width: 500px; background-color: transparent; margin: 0 auto"
            class="text-white">
            <q-card-section style="background-color: transparent">
                <div class="close-alert" v-close-popup>
                    <q-icon size="24px" name="close"></q-icon>
                </div>
                <q-carousel animated v-model="popupSlide" navigation infinite swipeable height="100%" keep-alive
                    style="background: transparent">
                    <q-carousel-slide v-for="(item, index) in popupList" :key="index" :name="index"
                        class="carousel-slide" style="padding: 0">
                        <div class="promo-banner-container">
                            <div class="promo-banner-content" v-if="item.type === 'TEXT'" v-html="item.content"></div>
                            <div class="promo-banner-img" @click="() => props.clickHomePopupImg(item.path)" v-else>
                                <img :src="formatHomePopupImg(item.mobileImgUrl)" class="alert-img" draggable="false" />
                            </div>
                        </div>
                    </q-carousel-slide>
                </q-carousel>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from "boot/axios";
import { useLocalStorage } from "@vueuse/core";

const showPopupDialog = ref(false);
const popupList = ref([]);
const popupSlide = ref(0);
const popupExpiryMap = ref({});
const props = defineProps(['clickHomePopupImg']);

const formatHomePopupImg = (path) => {
    return useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/" + path;
};

const offPopupModal = () => {
    popupList.value.filter(popup => popup.frequency !== 'EVERYTIME').forEach((popup) => {
        popupExpiryMap.value = {...popupExpiryMap.value, [popup.path]: Date.now() };
    });

    localStorage.setItem('POPUP', JSON.stringify(popupExpiryMap.value));
}

const getPopupList = () => {
    api
        .get("/member/site-popout-list")
        .then((res) => {
            if (res.code === 0) {
                const popupListData = res.data.filter((popup) => {
                    if(popupExpiryMap.value && Object.keys(popupExpiryMap.value).includes(popup.path)) {

                        const now = Date.now();
                        const timestamp = now - popupExpiryMap.value[popup.path];
                        const minutes = Math.floor(timestamp / (1000 * 60));
                        
                        if(popup.frequency === 'EVERYDAY' && minutes <= 1440) {
                            return false;
                        }

                        if(popup.frequency === 'SESSION' && minutes <= 131107.2) {
                            return false;
                        }
                    }

                    return popup;
                });
                popupList.value = popupListData;

                if(popupList.value) {
                    showPopupDialog.value = true;
                }
            }
        })
        .catch(() => { });
}

onMounted(() => {
    try {
        popupExpiryMap.value = JSON.parse(localStorage.getItem('POPUP'));
    } catch {

    }

    getPopupList();
});
</script>

<style>
.close-alert {
  display: block;
  position: absolute;
  top: 7px;
  right: 7px;
  width: 28px;
  padding: 2px;
  height: 28px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  color: #222a34 !important;
}

.promo-banner-container {
  color: #ffffff;

  .promo-banner-content {
    h3 {
      font-size: 20px;
      line-height: 0;
      padding: 20px 0 5px;
    }
  }

  .promo-banner-img {
    img {
      width: 100%;
      display: block;
    }
  }
}

</style>
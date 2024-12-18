<template>
    <div class="promo-container" v-if="selectedPromo">
        <div class="selected-promo">
            <div class="selected-promo-wrapper">
                <div class="banner-container" v-if="selectedPromo?.desktopBannerUrl || selectedPromo?.mobileBannerUrl">
                    <div class="promo-bg isDesktop">
                        <img :src="imgURL + (selectedPromo.desktopBannerUrl ? selectedPromo.desktopBannerUrl : selectedPromo.desktopImgUrl)
                            " />
                    </div>
                </div>

                <div class="inner" :class="{
                    isEurocup24: selectedPromo.redirectUrl === 'vnm-eurocup24',
                    isEurocupLucky: selectedPromo.redirectUrl === 'vnm-eurocup-luckydraw'
                }" :style="selectedPromo?.desktopImgBackgroundUrl
                    ? `background-image: url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
                    : 'background-image: url(' + require(`../../assets/promo/web-bg.jpg`) + '\''
                    ">
                    <div class="hot-promo" v-if="selectedPromo.hasPromo">
                        <HotPromotion :list="selectedPromo" />
                    </div>

                    <div class="promo-view-container" :class="{
                        welcome: selectedPromo.promoType?.toLowerCase() === 'welcome',
                        sport: selectedPromo.promoType?.toLowerCase() === 'sport',
                        eSport: selectedPromo.promoType?.toLowerCase() === 'esport',
                        fish: selectedPromo.promoType?.toLowerCase() === 'fish',
                        liveCasino: selectedPromo.promoType?.toLowerCase() === 'livecasino',
                        slot: selectedPromo.promoType?.toLowerCase() === 'slot game'
                    }">
                        <div v-if="selectedPromo.redirectUrl !== 'vnm-xmas-new-year-lucky-draw'" v-html="selectedPromo.pageContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { ref, defineComponent, inject, computed } from "vue";
import { useRoute } from "vue-router";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import HotPromotion from '@/components/HotPromotion'
import { useLocalStorage } from "@vueuse/core";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";
import PromoList from "@/components/promo/PromoList.vue";

export default defineComponent({
    name: "PromoView",
    components: {
        HotPromotion,
        PromoList
    },
    setup() {
        const selectedPromo = inject('selectedPromo');
        const i18nStoreLanguage = i18nStore()
        const { languageVal } = storeToRefs(i18nStoreLanguage)
        const ui = uiStore()
        const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + '/promo/';
        const banner = ref([]);
        const isPromoDetail = computed(() => {
            if (route.query && route.query?.name) {
                return true;
            }
            return false;
        });
        const route = useRoute();

        return {
            isPromoDetail,
            selectedPromo,
            banner,
            imgURL,
            languageVal,
            ui,
            EDITION
        }
    },
});
</script>
<style lang="scss">
.promo-container {
    min-height: 600px;

    .promo-view-container {
        line-height: 30px;

        ol {
            padding: 0 15px;
        }

        img {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px auto;

            &:nth-child(1) {
                padding-top: 20px;
            }
        }

        table {
            margin: 10px auto;
            min-width: 80%;
            text-align: center;

            tr:first-child td {
                background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
                color: #ffffff;
                border: 0;
            }

            border-collapse: collapse;

            th,
            td {
                padding: 10px;
            }

            tbody {
                display: table;
                table-layout: fixed;
                width: 100%;
            }

            th {
                // background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
                background: #e7f3ff;

                p {
                    margin: 0;
                }

                &:first-child {
                    border-top-left-radius: 20px;
                }

                &:last-child {
                    border-top-right-radius: 20px;
                }
            }

            td {
                // background-color: #202228;
                border: 1px solid #dcdce8;
                color: $font-5;
            }

            tr {
                &:last-child {
                    td:first-child {
                        border-radius: 20px 0 0 0;
                    }
                }
            }
        }
    }

    a {}
}
</style>
<style scoped lang="scss">
.promo-container {
    .selected-promo {
        width: 100%;

        .selected-promo-wrapper {
            .banner-container {
                width: 100%;

                .promo-bg {
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-position: center center;

                    &.isDesktop {
                        display: block;

                        img {
                            width: 100%;
                            display: block;
                        }
                    }
                }
            }

            .inner {
                width: 100%;
                padding: 20px;
                display: flex;
                flex-direction: column;
                background-size: 100% 100%;
                background-position: top center;
                gap: 20px;
                background-repeat: no-repeat;

                &.isEurocup24 {
                    padding: 0px;
                }

                &.isEurocupLucky {
                    background: #e7f1fd;
                }

                .hot-promo {
                    // background: #201f29;
                    border-radius: 10px;
                }

                .promo-view-container {
                    margin: 0 auto;
                    max-width: 1050px;
                    width: 100%;
                    text-align: left;
                    padding: 10px 0;
                    color: $font-5;
                    font-size: 20px;

                    ol {
                        li {
                            margin: 20px 0;
                        }
                    }

                    overflow: auto;

                    .game-title {
                        color: #ffd800;
                        margin: 30px auto 50px;
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>
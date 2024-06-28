<template>
    <q-skeleton v-show="!isImgFullyLoaded" type="rect" style="width:200px;height:365px;" class="scooped-skeleton" />
    <div data-aos="zoom-in" v-show="isImgFullyLoaded" :class="`game-item ${game.name.toLowerCase()}`"
        @click="() => props.onClickGameItem(game)">
        <div class="game-item-content">
            <img @load="() => {
                imgLoadStatus.bg = true;
            }" class="bg-overlay" :src="(() => {
                try {
                    return `${require(`../../assets/home/games/${gameType}/game-bg-${game.name.toLowerCase()}.png`)}`;
                } catch (e) {
                    return `${require(`../../assets/home/games/${gameType}/game-bg-empty.png`)}`;
                }
            })()
                " />
            <img class="active-overlay" :src="require(`../../assets/home/games/game-bg--active.png`)" />
            <div class="game-info-wrapper">
                <img class="arrow" src="../../assets/home/games/game-item-arrow.svg" />
                <div class="game-name">{{ game?.alias || game.name }}</div>
                <img class="game-logo" @load="() => {
                    imgLoadStatus.logo = true;
                }" :src="(() => {
                    try {
                        return `${require(`../../assets/home/games/logo/game-logo-${game.name.toLowerCase()}.png`)}`;
                    } catch (e) {
                        return `${require(`../../assets/home/games/logo/game-logo-empty.png`)}`;
                    }
                })()
                    " />
            </div>
            <div class="avatar-wrapper">
                <img class="avatar-bg" @load="() => {
                    imgLoadStatus.avatarBg = true;
                }" :src="(() => {
                    try {
                        return `${require(`../../assets/home/games/${gameType}/game-rounded-${game.name.toLowerCase()}.png`)
                            }`;
                    } catch (e) {
                        return `${require(`../../assets/home/games/game-rounded.png`)} `;
                    }
                })()
                    " />
                <img class="avatar" @load="() => {
                    imgLoadStatus.avatar = true;
                }" :src="(() => {
                    try {
                        return `${require(`../../assets/home/games/${gameType}/game-${game.name.toLowerCase()}.png`)}`;
                    } catch (e) {
                        return `${require(`../../assets/home/games/${gameType}/game-empty.png`)}`;
                    }
                })()
                    " />
            </div>
            <div class="game-entry-btn">
                <div class="primary-button blue"><img class="star"
                        src="../../assets/home/games/game-entry-button-star.svg" />{{
                            $t('lang.game_item_entry') }}<img class="star"
                        src="../../assets/home/games/game-entry-button-star.svg" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
const props = defineProps(["game", "onClickGameItem", "gameType"]);
const game = ref(props.game);
const imgLoadStatus = reactive({
    bg: false,
    logo: false,
    avatarBg: false,
    avatar: false
})

const isImgFullyLoaded = computed(() => {
    return Object.values(imgLoadStatus).some(status => status === false) === false;
})
</script>
<style lang="scss" scoped>
.game-item {
    background: url('../../assets/home/games/background-placeholder.png') no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    cursor: pointer;
    transition: 0.3s all;
    padding: 20px;
    max-width: 200px;
    width: 100%;
    aspect-ratio: 200 / 365;
    height: fit-content;

    @media (max-width: 769px) {
        max-width: 130px;
    }

    .active-overlay,
    .bg-overlay {
        transition: 0.3s all;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
    }

    .active-overlay {
        opacity: 0;
    }

    .game-item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: 0.3s all;

        .game-info-wrapper {
            position: absolute;
            top: 12%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            @media (max-width: 769px) {
                top: 12%;
            }

            .arrow {
                width: 24px;

                @media (max-width: 769px) {
                    width: 16px;
                }
            }

            .game-name {
                color: #fff;
                font-size: 20px;
                line-height: 1;
                white-space: nowrap;

                @media (max-width: 769px) {
                    font-size: 14px;
                }
            }

            .game-logo {
                max-width: 120px;
                aspect-ratio: 283 / 96;
                // width: 100%;

                @media (max-width: 769px) {
                    max-width: 75px;
                }
            }
        }

        .avatar-wrapper {

            .avatar-bg,
            .avatar {
                width: 100%;
                transition: 0.3s all;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .game-entry-btn {
            position: absolute;
            bottom: 11%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            display: flex;
            justify-content: center;

            .star {
                padding: 0 5px;
            }

            @media (max-width: 769px) {
                bottom: 7%;

                .primary-button.blue {
                    width: 100px;
                    height: 30px;
                    min-width: 100px;
                }
            }

            &:hover {
                filter: brightness(0.9);
            }
        }
    }

    &:hover {
        .active-overlay {
            opacity: 0.3;
        }

        .game-item-content {
            .avatar-wrapper {

                .avatar-bg,
                .avatar {
                    transform: translate(-50%, -50%) scale(1.1);
                }
            }
        }
    }
}



.spin-center {
    display: flex;
    justify-content: center;
    width: 100%;
}

.scooped-skeleton {
    mask: radial-gradient(30px at 40px 40px, transparent 98%, black) -40px -40px
}
</style>
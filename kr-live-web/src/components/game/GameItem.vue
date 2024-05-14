<template>
    <div class="item_list">
        <a v-for="p in props.games" :key="p.id" class="game_item" @click="() => props.onClickGameItem(p)">
            <div class="game_box">
                <div class="game_thumb">
                    <img class="platform-img" :src="(() => {
                            try {
                                return `${require(`../../assets/images/people/people-${p.name.toLowerCase()}.png`)}`;
                            } catch (e) {
                                return `${require(`../../assets/home/slot/StayTuned.png`)}`;
                            }
                        })()" />
                    <div class="platform-company-box">
                        <div class="company-image" :style="{
                            backgroundImage: (() => {
                                try {
                                    return `url(${require(`../../assets/images/footer/logo-${p.name.toLowerCase()}.png`)})`;
                                } catch (e) {
                                    return '';
                                }
                            })()
                        }"></div>
                    </div>
                    <div class="thumb_cover">
                        <img src="../../assets/images/index/kr-logo.png" class="icon_play">
                    </div>
                </div>
                <div class="game_info">
                    <h2>{{ p.alias ? p.alias : p.name }}</h2>
                    <h3>{{ p.alias ? p.alias : p.name }}</h3>
                </div>
            </div>
        </a>
    </div>
</template>
<script setup>
const props = defineProps(['games', 'onClickGameItem']);

</script>
<style lang="scss" scoped>
.item_list {
    padding: 20px 0px 30px 0px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    gap: 10px;
}

a {
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none !important;
    -webkit-transition: .3s;
    transition: .3s
}

.item_list>a {
    position: relative;
    display: block;
    -webkit-transition: 0.3s;;
    transition: 0.3s;
}

.game_item {
    width: calc(25% - 70px)
}

.game_item_sm {
    width: calc(14% - 16px)
}

.item_list .game_item:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    -webkit-transition: 0.3s;;
    transition: 0.3s;;
    opacity: 0;
    z-index: -1
}

a:hover {
    color: #0056b3;
    text-decoration: underline
}

.game_item .game_box {
    height: 100%
}

.game_item .game_box .game_thumb {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 0;
    padding-top: 102%;
    margin-bottom: 10px;
    -webkit-filter: drop-shadow(0 2px 4px rgba(0, 0, 0, .8));
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, .8));
    z-index: 1;

    .platform-img {
      width: 100%;
      height: auto;
      aspect-ratio: 672/648;
      background-size: 100% 100%;
      /* background-size: contain; */
      background-repeat: no-repeat;
      background-position: top center;
    }

    .platform-company-box {
      position: absolute;
      left: 0px;
      bottom: 5px;
      background-color: #0000004d;
      backdrop-filter: blur(5px);
      width: 98%;
      height: 55px;
      -webkit-clip-path: polygon(0 -35%, 100% -25%, 80% 100%, 22% 100%);
      clip-path: polygon(0 -35%, 100% -25%, 80% 100%, 22% 100%);

      .company-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
}

.game_item .game_box .game_info {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    line-height: 1;
    height: 60px;
    margin: 0 10px;
    border: 1px solid #38287b;
    background: #0d0d1d;
    border-radius: var(--radius);
    text-align: center;
    -webkit-transition: 0.3s;;
    transition: 0.3s;;
    -webkit-transform: skewX(var(--deg));
    transform: skewX(var(--deg))
}

.game_item:hover .game_box .game_info {
    border: 1px solid #5128be;
    background: #1d113e;
    -webkit-box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .9);
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .9)
}

.game_item .game_box .game_thumb .thumb_cover {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    -webkit-clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
    clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
    opacity: 0;
    -webkit-transition: 0.3s;;
    transition: 0.3s;;
    z-index: 5;
}

.game_item:hover .game_box .game_thumb .thumb_cover {
    -webkit-transform: scale(.95);
    transform: scale(.95);
    opacity: 1
}

h2 {
    margin-top: 0;
    margin-bottom: .5rem;
    font-weight: 500;
    line-height: 1.2;
    font-size: 2rem
}

.game_item .game_box .game_info h2 {
    display: none;
    color: #eee;
    font-size: 20px;
    font-weight: 500;
    text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000
}

.game_item .game_box .game_info h3 {
    margin: 3px 0 3px 0;
    color: #ddd;
    font-size: 16px;
    font-weight: 500
}

.game_item:hover .game_box .game_info h2 {
    display: block;
    color: #ffc24d
}

.game_item:hover .game_box .game_info h3 {
    display: none
}

.game_item .game_box .game_thumb .icon_play {
    width: 60%;
    height: auto;
    margin: 0 auto;
    -webkit-filter: drop-shadow(0 6px 6px #000);
    filter: drop-shadow(0 6px 6px #000);
    z-index: 1
}

.game_item:hover .game_box .game_thumb .icon_play {
    -webkit-animation: icon_play .6s ease-in-out infinite alternate;
    animation: icon_play .6s ease-in-out infinite alternate;
    z-index: -1
}

@-webkit-keyframes icon_play {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    to {
        -webkit-transform: scale(1.04);
        transform: scale(1.04)
    }
}

@keyframes icon_play {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    to {
        -webkit-transform: scale(1.04);
        transform: scale(1.04)
    }
}

.item_list .game_item .game_box .game_thumb:after {
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(45%, #343067), color-stop(48%, #1d1b3c), color-stop(80%, #5f40b2));
    background: linear-gradient(180deg, #343067 45%, #1d1b3c 48%, #5f40b2 80%);
    background-size: auto 200%;
    z-index: -1
}

.item_list .game_item:hover .game_box .game_thumb:after {
    background-position: bottom
}

h3 {
    margin-top: 0;
    margin-bottom: .5rem;
    font-weight: 500;
    line-height: 1.2;
    font-size: 1.75rem
}

img {
    border: none;
    border-style: none;
    vertical-align: middle
}

.item_list .game_item .game_box .game_thumb:after,
.item_list .game_item .game_box .game_thumb>img {
    position: absolute;
    -webkit-clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
    clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
    -webkit-transition: 0.3s;;
    transition: 0.3s;
}

.item_list .game_item .game_box .game_thumb>img {
    top: 4px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px)
}

.item_list .game_item:hover .game_box .game_thumb>img {
    -webkit-transform: scale(.94);
    transform: scale(.94)
}

ul {
    list-style: none;
    margin-bottom: 1rem;
    margin-top: 0
}

li {
    list-style: none
}

.slide-in-bottom {
    -webkit-animation: slide-in-bottom 1.5s cubic-bezier(.55, .085, .68, .53) both;
    animation: slide-in-bottom 1.5s cubic-bezier(.55, .085, .68, .53) both
}
</style>
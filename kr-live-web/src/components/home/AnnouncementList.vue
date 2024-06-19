<template>
    <q-intersection once @visibility="loadAnnouncement" transition-duration="1000">
        <div class="news-section">
            <div class="news-title">
                <div class="title-text">공지사항</div>
                <router-link class="more-text" :to="store.hasToken() ? '/?page=announcement' : '/?page=login'">+
                    더보기</router-link>
            </div>
            <div class="news-item-box" v-if="isLoading" style="display:flex;justify-content:center;">
                <q-spinner-orbit size="2em" />
            </div>
            <template v-else-if="announcementList.length > 0">
                <div v-for="(item, index) in announcementList" :key="index" class="news-item-box">
                    <div class="news-item-left">
                        <div class="news-item-title" :title="item.title">
                            [
                            {{ item.title }}
                            ] ※
                            {{ item.content }}
                            ※
                        </div>
                    </div>
                    <div class="news-item-right">
                        <div class="news-item-date">{{ item.createTime }}</div>
                    </div>
                </div>
            </template>
            <div v-else class="news-item-box" style="justify-content: center;">
                아직 콘텐츠가 없습니다
            </div>
        </div>
    </q-intersection>
</template>

<script setup>
import { ref } from 'vue';
import { userStore } from "stores/index";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = userStore();
const isLoading = ref(false);
const announcementList = ref([]);

const loadAnnouncement = () => {
    isLoading.value = true;

    store.getAnnouncementList().then((announcements) => {
        announcementList.value = announcements;
        isLoading.value = false;
    }).catch((err) => {
        console.log(err)
        isLoading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.news-section {
    margin-top: 20px;
    padding: 0 16px;
}

.news-split {
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 769px) {
        gap: 10px;
    }

    .news-section {
        width: 100%;

        @media (min-width: 769px) {
            width: calc(50% - 5px);
        }
    }

    .news-item-left {
        width: 100% !important;
    }
}

.news-title {
    // background: linear-gradient(#3f4146, #202226);
    background: linear-gradient(180deg, #384a70 0%, #121c31 100%);

    height: 61px;
    border: 1px #454545 solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;

    &__sub {
        background: linear-gradient(180deg, #385f70 0%, #122931 100%);
    }

    @media (min-width: 769px) {
        padding: 0px 40x;
    }

    .title-text {
        font-size: 14px;
        line-height: 19.6px;

        @media (min-width: 769px) {
            font-size: 20px;
            line-height: 28px;
        }
    }

    .more-text {
        font-size: 14px;
        line-height: 19.6px;
        color: #ff3c3c;
        cursor: pointer;

        @media (min-width: 769px) {
            font-size: 20px;
            line-height: 28px;
        }
    }
}

.news-item-box {
    width: 100%;
    height: 60px;
    background-color: #192235;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 25px;
    font-size: 12px;
    line-height: 16.8px;
    border-bottom: 1px solid #3f3f3f;

    display: grid;
    grid-template-columns: minmax(calc(90% - 100px), 90%) minmax(120px, 10%);

    @media (min-width: 769px) {
        grid-template-columns: minmax(calc(80% - 100px), 90%) minmax(200px, 20%);
    }

    &:hover {

        .news-item-title,
        .news-item-date {
            transform: scale(1.02);
            color: #01e1ff !important;
        }
    }

    @media (min-width: 769px) {
        padding: 0px 40x;
        font-size: 16px;
        line-height: 22px;
    }

    .news-item-left {
        width: 100%;

        @media (min-width: 769px) {
            width: 60%;
        }

        .news-item-sort {
            padding-right: 8px;
        }

        .news-item-title {
            transition: 0.3s all;
            padding-right: 8px;
            padding-left: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 769px) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .news-item-box {
        @media (min-width: 769px) {
            width: 100%;
        }
    }

    .news-item-right {
        .news-item-date {
            transition: 0.3s all;
            color: #92959f;
            text-align: right;
        }
    }
}
</style>
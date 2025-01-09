<template>
    <div class="station-notice-container">
      <div class="station-notice-box">
        <div>
          <RiVolumeUpFill style="fill: #2db9e2; width: 20px !important" @click="openPopup(announcementList)" />
        </div>
        <div class="station-notice">
          <Vue3Marquee :clone="false" :duration="90">
            <div
              v-for="(word, index) in announcementList"
              :key="index"
              v-html="word.content"
              @click="openPopup(word)"
              class="station-notice-item"
            ></div>
          </Vue3Marquee>
        </div>
      </div>
    </div>
    <el-dialog
      class="notice-modal"
      width="100%"
      style="max-width: 800px"
      v-model="isStationNotice"
      :maskClosable="false"
      :footer="null"
      title="公告"
    >
      <el-tabs type="card" class="announcementTabs" v-model="announcementActive" @tab-click="announcementTabChange">
        <el-tab-pane v-for="(tab, ind) in announcementTypes" :key="tab.id" :tab="ind" :label="tab.name">
          <el-collapse accordion v-model="typeActive">
            <template v-for="(ann, idx) in announcementList" :key="idx">
              <template v-if="ann.typeId === tab.id">
                <el-collapse-item :name="idx" :title="ann.title">
                  {{ ann.content }}
                </el-collapse-item>
              </template>
            </template>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </template>
<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncement } from "@/api/personal/personal";
import {Vue3Marquee} from 'vue3-marquee';

import {
  RiVolumeUpFill
} from 'vue-remix-icons';
    const announcementActive = ref('1')
    const announcementList = ref([])
    const announcementTypes = ref([])
    const loadAnnouncement = () => {
      getAnnouncement().then((res) => {
        // console.log(res)
        if (res.code === 0) {
          const d = res.data.announcements
          announcementTypes.value = res.data.type
          if (res.data.length > 0) {
            announcementActive.value = res.data.type[0].id
          }
          announcementList.value = d
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      })
    }
    const announcementTabChange = () => {
      // homeState.tabMatchs.forEach(element => {
      //   if (nk === element.gameId) {
      //     getMatchData(element);
      //   }
      // });
    };
    const isStationNotice = ref(false)
    const noticeTitle = ref('')
    const openPopup = (noticeType) => {
      if (noticeType) {
        announcementActive.value = '0'
        noticeTitle.value = noticeType.title
        isStationNotice.value = true
      }
    }
    onMounted(() => {
        loadAnnouncement();
    })
</script>
<style scoped lang="scss">
.station-notice-container {
    max-width: 1400px;
    margin: -10px auto 0;
    width: 100%;
    border-radius: 100px;
    position: absolute;
    left: 0;
    right: 0;
    top: 580px;
    box-shadow: 0px 4px 8px 0px #000000;
    background: #1B1B1C;

    .station-notice-box {
    display: flex;
    padding: 10px;
    gap: 10px;
    justify-content: center;
    align-items: center;
    svg {
        display: block;
    }
    }
    }

    .station-notice {
    padding-top: 4px;
    width: 100%;

    .station-notice-item {
    margin-right: 50px;
    }
    }
</style>
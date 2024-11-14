<template>
    <el-dialog
        :title="t('fields.affiliateAnnouncement')"
        v-model="dialogVisible"
        width="580px"
        append-to-body
    >
    <el-carousel height="500px"  v-if="affiliateAnnouncementPopupList.length" :autoplay="false" arrow="always">
      <el-carousel-item v-for="announcement in affiliateAnnouncementPopupList" :key="announcement.id">
        <div class="announcement-item">
            <div class="title">{{ announcement.title }}</div>
            <div>
              <img class="popup-img" :src="`${imageDir}/announcement/${announcement.popUpImage}`" />
            </div>
            <div v-html="announcement.content"></div>
            <div class="dismiss-checkbox">
              <el-checkbox
                v-model="announcement.isChecked"
                :label="$t('fields.dismiss')"
                size="large"
                @input="dismissAnnouncement(announcement.id)"
              />
            </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAffAnnouncementPopupList, readAffAnnouncementDetails } from '../../api/affiliate-announcement';
import { useI18n } from 'vue-i18n';
import { getId } from "@/utils/cookies";

const { t } = useI18n();
const dialogVisible = ref(true);
const affiliateAnnouncementPopupList = ref([]);
const imageDir = process.env.VUE_APP_IMAGE_CDN;
const affiliateId = getId();

const dismissAnnouncement = (announcementId) => {
  readAffAnnouncementDetails(affiliateId, announcementId).then((res) => {
    const { code } = res;
        
    if(code === 0) {
      fetchAnnouncementListPopup();
    }
  })
}

const fetchAnnouncementListPopup = () => {
  getAffAnnouncementPopupList(affiliateId).then((res) => {
      const { code, data } = res;
      
      if(code === 0) {
        affiliateAnnouncementPopupList.value = data;
      }
  });
}

onMounted(() => {
  fetchAnnouncementListPopup();
})
</script>

<style lang="scss" scoped>
.announcement-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "NanumNeo";

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .popup-img {
    width: 100%;
  }

  .dismiss-checkbox {
    display: flex;
    margin: 0 auto;
  }
}
</style>
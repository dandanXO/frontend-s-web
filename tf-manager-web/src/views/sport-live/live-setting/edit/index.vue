<template>
  <div class="event-editor-container">
    <el-card shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        size="small"
        class="event-form"
        v-if="teams.length > 0"
      >
        <el-form-item :label="t('fields.sportType')" prop="sportId">
          <el-select v-model="form.sportId" style="width: 300px">
            <el-option v-for="item in uiControl.sport" :key="item.id" :label="item.display" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 300px" maxlength="100" />
        </el-form-item>

        <el-form-item v-if="teams.length > 0" :label="t('fields.homeTeam')" prop="homeId">
          <el-select v-model="form.homeId" style="width: 300px">
            <el-option
              v-for="team in teams"
              :key="team.id"
              :label="team.nameZh"
              :value="team.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="promoDir + team.icon" style="width: 20px; height: 20px; margin-right: 10px">
                {{ team.nameZh }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="teams.length > 0" :label="t('fields.awayTeam')" prop="awayId">
          <el-select v-model="form.awayId" style="width: 300px" @focus="loadTeams">
            <el-option v-for="team in teams" :key="team.id" :label="team.nameZh" :value="team.id">
              <div style="display: flex; align-items: center">
                <img :src="promoDir + team.icon" style="width: 20px; height: 20px; margin-right: 8px" alt="">
                {{ team.nameZh }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.sequence')" prop="sort">
          <el-input-number v-model.number="form.sort" :min="0" />
        </el-form-item>

        <el-form-item :label="t('fields.matchTime')" prop="matchTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.eventStartTime"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.status')" prop="liveStatus">
          <el-select v-model="form.liveStatus" style="width: 300px">
            <el-option
              v-for="item in uiControl.liveStatus"
              :key="item.id"
              :label="item.display"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
          <el-button @click="$router.back()">{{ t('fields.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getTeamById, getEvents, updateSportLiveEvent } from '@/api/sport-live';
import { required } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import { useSessionStorage } from "@vueuse/core";
import dayjs from "dayjs";

const route = useRoute();
const { t } = useI18n();

const eventId = Number(route.query.id);
const formRef = ref(null);
const teams = ref([]);
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'

const uiControl = reactive({
  sport: [
    { id: 1, name: 'FOOTBALL', display: '足球' },
    { id: 2, name: 'BASKETBALL', display: '篮球' },
    { name: 'LOL', display: 'LOL', id: 3 },
    { name: 'CSGO', display: 'CSGO', id: 4 },
    { name: 'DOTA2', display: 'DOTA2', id: 5 },
    { name: 'KOG', display: '王者荣耀', id: 6 },
  ],
  liveStatus: [
    { id: 0, display: t('status.uefaMatch.PENDING') },
    { id: 1, display: t('status.uefaMatch.ONGOING') },
    { id: 2, display: t('status.uefaMatch.ENDED') },
    { id: 3, display: t('status.uefaMatch.CANCEL') },
  ],
});

const form = reactive({
  id: eventId,
  sportId: null,
  title: '',
  homeId: null,
  awayId: null,
  sort: 0,
  eventStartTime: '',
  liveStatus: null,
});

const formRules = reactive({
  sportId: [required(t('fields.sportTypeRequired'))],
  title: [required(t('fields.matchTitleRequired'))],
  homeId: [required(t('fields.homeTeamRequired'))],
  awayId: [required(t('fields.awayTeamRequired'))],
  eventStartTime: [required(t('fields.matchTimeRequired'))],
});

const request = reactive({
  size: 30,
  current: 1,
  id: null,
});

async function loadEventDetail() {
  request.id = eventId;
  const { data } = await getEvents(request);
  const record = data.records?.[0];
  if (record) {
    record.eventStartTime = dayjs(record.eventStartTime).format('YYYY-MM-DD HH:mm:ss');
    Object.assign(form, record);
  }
}

async function loadTeams() {
  const { data } = await getTeamById(form.sportId);
  teams.value = data;
}

async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    await updateSportLiveEvent(form);
    ElMessage.success(t('message.updateSuccess'));
  });
}

onMounted(async () => {
  await loadEventDetail();
  await loadTeams();
});
</script>

<style scoped>
.event-editor-container {
  padding: 20px;
}
</style>

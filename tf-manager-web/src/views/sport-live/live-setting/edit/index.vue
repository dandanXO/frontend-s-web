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
      >
        <el-form-item :label="t('fields.sportType')" prop="sportId">
          <el-select v-model="form.sportId" style="width: 300px">
            <el-option v-for="item in uiControl.sport" :key="item.id" :label="item.display" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 300px" maxlength="100" />
        </el-form-item>

        <el-form-item :label="t('fields.homeTeam')" prop="homeId">
          <el-select
            v-model="form.homeId"
            filterable
            allow-create
            default-first-option
            :placeholder="form.homeName || form.homeNameZh || '请输入或选择队伍'"
            style="width: 300px"
            @change="val => {
              const match = teams.find(t => t.id === val);
              form.homeName = match ? match.nameZh : val;
            }"
            @focus="handleTeamSelectorFocus('home')"
            @blur="e => {
              if (typeof form.homeId === 'string' && !isInTeamList(form.homeId)) {
                form.homeName = form.homeId;
                form.homeId = null;
              }
              handleTeamSelectorBlur()
            }"
          >
            <el-option
              v-for="team in displayTeams"
              :key="team.id"
              :label="team.nameZh"
              :value="team.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="(team.icon?.startsWith('http://') || team.icon?.startsWith('https://')) ? team.icon : promoDir + team.icon"
                     style="width: 20px; height: 20px; margin-right: 10px"
                >
                {{ team.nameZh }}
              </div>
            </el-option>
            <div v-if="teamSelectorStatus === 'home'" ref="teamSelectorBottomRef" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.awayTeam')" prop="awayId">
          <el-select
            v-model="form.awayId"
            filterable
            allow-create
            default-first-option
            :placeholder="form.awayName || form.awayNameZh || '请输入或选择队伍'"
            style="width: 300px"
            @change="val => {
              const match = teams.find(t => t.id === val);
              form.awayName = match ? match.nameZh : val;
            }"
            @focus="handleTeamSelectorFocus('away')"
            @blur="e => {
              if (typeof form.awayId === 'string' && !isInTeamList(form.awayId)) {
                form.awayName = form.awayId;
                form.awayId = null;
              }
              handleTeamSelectorBlur()
            }"
          >
            <el-option
              v-for="team in displayTeams"
              :key="team.id"
              :label="team.nameZh"
              :value="team.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="(team.icon?.startsWith('http://') || team.icon?.startsWith('https://')) ? team.icon : promoDir + team.icon"
                     style="width: 20px; height: 20px; margin-right: 10px"
                >
                {{ team.nameZh }}
              </div>
            </el-option>
            <div v-if="teamSelectorStatus === 'away'" ref="teamSelectorBottomRef" />
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
        <el-form-item :label="t('fields.endTime')" prop="endTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.eventEndTime"
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
        <el-form-item :label="t('fields.isTestEvent')" prop="isTest">
          <el-switch
            v-model="form.isTest"
            :active-text="t('fields.yes')"
            :inactive-text="t('fields.no')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.isPopularEvent')" prop="isPopular">
          <el-switch
            v-model="form.isPopular"
            :active-text="t('fields.yes')"
            :inactive-text="t('fields.no')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.cover')" prop="cover">
          <div style="display: flex; flex-direction: column;">
            <el-image
              v-if="form.cover"
              :src="`${promoDir2}${form.cover}`"
              style="width: 120px; height: 68px; border: 1px solid #ccc; margin-bottom: 8px;"
              class="preview"
            />
            <el-button
              v-if="form.cover"
              type="danger"
              size="small"
              style="margin-bottom: 8px; width: fit-content;"
              @click="form.cover = ''"
            >
              {{ t('fields.remove') }}
            </el-button>
            <input type="file" accept="image/*" @change="attachImage">
          </div>
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
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue';
import { useStore } from "@/store";
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getTeamById, getEvents, updateSportLiveEvent } from '@/api/sport-live';
import { required } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import { useSessionStorage } from "@vueuse/core";
import { uploadImage } from "@/api/image";
import dayjs from "dayjs";

const TEAMS_PER_VIEW = 20

const route = useRoute();
const { t } = useI18n();

const eventId = Number(route.query.id);
const formRef = ref(null);
const teams = ref([]);
const displayTeams = ref([]);
const teamSelectorStatus = ref(null)
const teamSelectorBottomRef = ref(null);
const teamSelectorScrollObserver = ref(null);
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const promoDir2 = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value
const store = useStore();
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
  eventEndTime: '',
  liveStatus: null,
  isTest: false,
  isPopular: false,
  cover: ''
});

const formRules = reactive({
  sportId: [required(t('fields.sportTypeRequired'))],
  title: [required(t('fields.validateMatchTitleRequired'))],
  homeId: [
    {
      validator: (_, value, callback) => {
        if (!value && !form.homeName) {
          callback(new Error(t('fields.validateHomeTeamRequired')));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  awayId: [
    {
      validator: (_, value, callback) => {
        if (!value && !form.awayName) {
          callback(new Error(t('fields.validateAwayTeamRequired')));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  eventStartTime: [required(t('fields.validateMatchTimeRequired'))],
  eventEndTime: [required(t('fields.validateMatchTimeRequired'))],
});

const request = reactive({
  size: 30,
  current: 1,
  id: null,
});

async function attachImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  if (data) {
    form.cover = `/live/event/${store.state.user.siteId}/${data}`;
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' });
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0];
  if (!files) return;

  const fr = new FileReader();
  fr.onload = function () {
    const img = new Image();
    img.onload = function () {
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(files);

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowFileType.includes(files.type)) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' });
    return null;
  }

  const formData = new FormData();
  formData.append('files', files);
  formData.append('dir', `live/event/${store.state.user.siteId}`);
  formData.append('overwrite', false);

  try {
    const response = await uploadImage(formData);
    return response.code === 0 ? response.data : null;
  } catch (error) {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    return null;
  }
}

function isInTeamList(id) {
  return teams.value.some(t => t.id === id);
}

function fallbackTeamName(fieldId, nameZhField) {
  if (!isInTeamList(form[fieldId]) && form[nameZhField]) {
    form[fieldId.replace('Id', 'Name')] = form[nameZhField];
    form[fieldId] = null;
  }
}

async function loadTeams() {
  const { data } = await getTeamById(form.sportId);
  teams.value = data;
}

async function loadEventDetail() {
  request.id = eventId;
  const { data } = await getEvents(request);
  const record = data.records?.[0];
  if (record) {
    record.eventStartTime = dayjs(record.eventStartTime).format('YYYY-MM-DD HH:mm:ss');
    if (record.eventEndTime) {
      record.eventEndTime = dayjs(record.eventEndTime).format('YYYY-MM-DD HH:mm:ss');
    } else {
      record.eventEndTime = '';
    }
    record.isTest = !!record.isTest;
    record.isPopular = !!record.isPopular;
    Object.assign(form, record);

    // fallback team names if not in list
    fallbackTeamName('homeId', 'homeNameZh');
    fallbackTeamName('awayId', 'awayNameZh');
  }
}

const handleTeamSelectorFocus = (target) => {
  displayTeams.value = teams.value.slice(0, TEAMS_PER_VIEW);
  teamSelectorStatus.value = target;
  nextTick(() => {
    if (!teamSelectorBottomRef.value) return;
    teamSelectorScrollObserver.value.observe(teamSelectorBottomRef.value);
  })
}

const handleTeamSelectorBlur = () => {
  displayTeams.value = []
  teamSelectorStatus.value = null;
  teamSelectorScrollObserver.value.unobserve(teamSelectorBottomRef.value);
}

async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const payload = {
      id: form.id,
      sportId: form.sportId,
      title: form.title,
      eventStartTime: form.eventStartTime && form.eventStartTime.trim() !== '' ? form.eventStartTime : null,
      eventEndTime: form.eventEndTime && form.eventEndTime.trim() !== '' ? form.eventEndTime : null,
      liveStatus: form.liveStatus,
      sort: form.sort,
      isTest: form.isTest,
      isPopular: form.isPopular,
      cover: form.cover
    };

    if (isInTeamList(form.homeId)) {
      payload.homeId = form.homeId;
    } else if (form.homeName) {
      payload.homeName = form.homeName;
    }

    if (isInTeamList(form.awayId)) {
      payload.awayId = form.awayId;
    } else if (form.awayName) {
      payload.awayName = form.awayName;
    }

    await updateSportLiveEvent(payload);
    ElMessage.success(t('message.updateSuccess'));
  });
}

const registerTeamSelectorScrollObserver = () => {
  teamSelectorScrollObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        displayTeams.value = teams.value.slice(0, displayTeams.value.length + TEAMS_PER_VIEW);
      }
    })
  })
}

onMounted(async () => {
  await loadEventDetail();
  await loadTeams();
  registerTeamSelectorScrollObserver();
});

onUnmounted(() => {
  if (teamSelectorScrollObserver.value) {
    teamSelectorScrollObserver.value.disconnect();
  }
})
</script>

<style scoped>
.event-editor-container {
  padding: 20px;
}
</style>

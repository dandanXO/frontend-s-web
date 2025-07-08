<template>
  <div class="card">
    <form @submit.prevent="submit" :model="form" class="p-fluid">
      <!-- Sport Type Dropdown -->
      <div class="p-field">
        <label for="sportId">{{ t('fields.sportType') }}</label>
        <Dropdown 
          v-model="form.sportId" 
          :options="uiControl.sport" 
          optionLabel="display" 
          optionValue="id" 
          style="width: 300px"
        />
        <small v-if="formErrors.sportId" class="p-error">{{ formErrors.sportId }}</small>
      </div>

      <!-- Title Input -->
      <div class="p-field">
        <label for="title">{{ t('fields.title') }}</label>
        <InputText 
          v-model="form.title" 
          id="title" 
          maxlength="100" 
          style="width: 300px" 
        />
        <small v-if="formErrors.title" class="p-error">{{ formErrors.title }}</small>
      </div>

      <!-- Home Team Selector -->
      <div class="p-field">
        <label for="homeTeam">{{ t('fields.homeTeam') }}</label>
        <Dropdown
          v-model="form.homeId"
          :options="homeDisplayTeams"
          optionLabel="nameZh"
          optionValue="id"
          filter
          :placeholder="form.homeName || t('fields.enterOrSelectTeam')"
          style="width: 300px"
          @change="(val) => handleTeamSelect(val, 'home')"
          @filter="(event) => searchTeams(event, 'home')"
          @blur="handleBlur('home')" 
        >
          <template #option="slotProps">
            <div style="display: flex; align-items: center">
              <img
                :src="(slotProps.option.icon?.startsWith('http') ? slotProps.option.icon : promoDir + slotProps.option.icon)"
                style="width: 20px; height: 20px; margin-right: 10px"
              />
              {{ slotProps.option.nameZh }}
            </div>
          </template>
        </Dropdown>
      </div>

      <!-- Away Team Selector -->
      <div class="p-field">
        <label for="awayTeam">{{ t('fields.awayTeam') }}</label>
        <Dropdown
          v-model="form.awayId"
          :options="awayDisplayTeams"
          optionLabel="nameZh"
          optionValue="id"
          filter
          :placeholder="form.awayName || t('fields.enterOrSelectTeam')"
          style="width: 300px"
          @change="(val) => handleTeamSelect(val, 'away')"
          @filter="(event) => searchTeams(event, 'away')"
          @blur="handleBlur('away')" 
        >
          <template #option="slotProps">
            <div style="display: flex; align-items: center">
              <img
                :src="(slotProps.option.icon?.startsWith('http') ? slotProps.option.icon : promoDir + slotProps.option.icon)"
                style="width: 20px; height: 20px; margin-right: 10px"
              />
              {{ slotProps.option.nameZh }}
            </div>
          </template>
        </Dropdown>
      </div>
      
      <!-- Sequence Input -->
      <div class="p-field">
        <label for="sort">{{ t('fields.sequence') }}</label>
        <InputNumber 
          v-model="form.sort" 
          id="sort" 
          :min="0" 
          showButtons
        />
      </div>

      <!-- Match Time Picker -->
      <div class="p-field">
        <label for="matchTime">{{ t('fields.matchTime') }}</label>
        <Calendar
          v-model="form.eventStartTime"
          showTime
          hourFormat="24"
          dateFormat="yy-mm-dd"
          :timeOnly="false"
          style="width: 350px"
        />
        <small v-if="formErrors.eventStartTime" class="p-error">{{ formErrors.eventStartTime }}</small>
      </div>

      <!-- End Time Picker -->
      <div class="p-field">
        <label for="endTime">{{ t('fields.endTime') }}</label>
        <Calendar
          v-model="form.eventEndTime"
          showTime
          hourFormat="24"
          dateFormat="yy-mm-dd"
          :timeOnly="false"
          style="width: 350px"
        />
      </div>

      <!-- Status Dropdown -->
      <div class="p-field">
        <label for="status">{{ t('fields.status') }}</label>
        <Dropdown
          v-model="form.liveStatus"
          :options="uiControl.liveStatus"
          optionLabel="display"
          optionValue="id"
          style="width: 300px"
        />
      </div>

      <!-- Event Code Input -->
      <div class="p-field">
        <label for="eventCode">{{ t('fields.eventCode') }}</label>
        <InputText
          v-model="form.eventCode"
          id="eventCode"
          maxlength="100"
          style="width: 300px"
        />
      </div>

      <!-- Is Test Switch -->
      <div class="p-field-checkbox">
        <label>{{ t('fields.isTestEvent') }}</label>
        <InputSwitch v-model="form.isTest" />
        <span style="margin-left: 10px">
          {{ form.isTest ? t('fields.yes') : t('fields.no') }}
        </span>
      </div>

      <!-- Is Popular Switch -->
      <div class="p-field-checkbox">
        <label>{{ t('fields.isPopularEvent') }}</label>
        <InputSwitch v-model="form.isPopular" />
        <span style="margin-left: 10px">
          {{ form.isPopular ? t('fields.yes') : t('fields.no') }}
        </span>
      </div>

      <!-- Cover Upload -->
      <div class="p-field">
        <label>{{ t('fields.cover') }}</label>
        <div style="display: flex; flex-direction: column;">
          <Image
            v-if="form.cover"
            :src="promoDir2 + form.cover"
            alt="cover preview"
            width="120"
            height="68"
            preview
            class="preview"
            style="margin-bottom: 8px; border: 1px solid #ccc"
          />
          <Button
            v-if="form.cover"
            :label="t('fields.remove')"
            icon="pi pi-times"
            class="p-button-danger p-button-sm"
            @click="form.cover = ''"
            style="margin-bottom: 8px; width: fit-content;"
          />
          <FileUpload
            mode="basic"
            name="cover"
            accept="image/*"
            :maxFileSize="1000000"
            @select="attachImage"
            chooseLabel="Upload Cover"
          />
        </div>
      </div>
        <div class="p-field">
          <label for="operator"></label>
          <Button :label="t('fields.confirm')" icon="pi pi-check" type="submit" class="p-button-primary" />
          <Button :label="t('fields.cancel')" icon="pi pi-times" class="p-button-secondary" @click="$router.back()" style="margin-left: 10px" />
        </div>
    </form>
  </div>
</template>

<script setup>
import { DashboardService } from '@/service/DashboardService.js'
import { ref, reactive, onMounted, nextTick, onUnmounted, computed } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { required } from '@/utils/validate';
import { useToast } from 'primevue/usetoast'
import { useStorage } from '@vueuse/core'
import { useUserStore } from '@/stores/userStore'

const { getEvents, getTeamById, uploadImage, updateSportLiveEvent } = DashboardService
import dayjs from "dayjs";
import { liveSportTyps } from "@/utils/live"
const toast = useToast()
const TEAMS_PER_VIEW = 20
const store = useUserStore()
const route = useRoute();
const { t } = useI18n();

const eventId = Number(route.query.id);
const formRef = ref(null);
const teams = ref([]);
const loadedTeams = ref([]);
const displayTeams = ref([]);
const hasMoreTeams = ref(true);
const searchedTeams = ref([]);
const teamSelectorStatus = ref(null)
const teamSelectorBottomRef = ref(null);
const teamSelectorScrollObserver = ref(null);
//const imageUrl = `https://file-admin.fwabm4gvc.com`
//const promoDir = imageUrl + '/promo/'
const promoDir = useStorage('IMAGE_CDN', '', sessionStorage).value + '/promo/'
const promoDir2 = useStorage('IMAGE_CDN', '', sessionStorage).value

const homeLoadedTeams = ref([]);
const awayLoadedTeams = ref([]);
const homeDisplayTeams = ref([]);
const awayDisplayTeams = ref([]);
const homeHasMoreTeams = ref(true);
const awayHasMoreTeams = ref(true);
const homeLoaderRef = ref(null);
const awayLoaderRef = ref(null);

const uiControl = reactive({
  sport: liveSportTyps,
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
  cover: '',
  eventCode: ''
});

const formRules = reactive({
  sportId: [required(t('message.sportTypeRequired'))],
  title: [required(t('message.validateMatchTitleRequired'))],
  homeId: [
    {
      validator: (_, value, callback) => {
        if (!value && !form.homeName) {
          callback(new Error(t('message.validateHomeTeamRequired')));
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
          callback(new Error(t('message.validateAwayTeamRequired')));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  eventStartTime: [required(t('message.validateMatchTimeRequired'))],
  eventEndTime: [required(t('message.validateMatchTimeRequired'))],
});

const request = reactive({
  size: 30,
  current: 1,
  id: null,
});

// const displayTeams = computed(() => {
//   const _searchedTeams = searchedTeams.value.map(team => ({ ...team, _sid: `search-${team.id}` }))
//   const _loadedTeams = loadedTeams.value.map(team => ({ ...team, _sid: `loaded-${team.id}` }));
//   const allTeams = _searchedTeams.concat(_loadedTeams);
//   const result = new Map()
//   allTeams.forEach(team => {
//     if (result.has(team.id)) return;
//     result.set(team.id, team);
//   })
//   return Array.from(result.values());
// })

async function attachImage(event) {
  const file = event.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  console.log("attachImage ::: data : ", data)
  if (data) {
    form.cover = `/live/event/${store.siteId}/${data}`;
  } else {
    toast.add({ severity: 'error', summary: t('message.failedToUploadImage'), life: 3000 })
  }
}

async function attachPhoto(event) {
  const files = event.files[0];
  console.log("attachPhoto ::: files : ", files)
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
    toast.add({ severity: 'error', summary: t('message.invalidFileType'), life: 3000 })
    return null;
  }
  console.log("attachPhoto ::: files : ", files)
  const formData = new FormData();
  formData.append('files', files);
  formData.append('dir', `live/event/${store.siteId}`);
  formData.append('overwrite', false);
  console.log("attachPhoto ::: formData : ", formData)
  try {
    const response = await uploadImage(formData);
    return response.code === 0 ? response.data : null;
  } catch (error) {
    toast.add({ severity: 'error', summary: t('message.failedToUploadImage'), life: 3000 })
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
  loadInitialTeams('home');
  loadInitialTeams('away');
}

// 初始化分页加载（home 或 away）
const loadInitialTeams = (type) => {
  const displayTeams = type === 'home' ? homeDisplayTeams : awayDisplayTeams;
  displayTeams.value = teams.value
};

// 搜索过滤
const searchTeams = (event, type) => {
  const displayTeams = type === 'home' ? homeDisplayTeams : awayDisplayTeams;
  if (!event.value) {
    displayTeams.value = teams.value.slice(0, TEAMS_PER_VIEW);
  } else {
    displayTeams.value = teams.value.filter(team =>
      team.nameZh.toLowerCase().includes(event.value.toLowerCase())
    );
  }
};

// 处理选中队伍
const handleTeamSelect = (val, type) => {
  if (type === 'home') {
    const match = teams.value.find(t => t.id === val.value);
    form.homeName = match ? match.nameZh : val.value;
    form.homeId = match ? match.id : null;
  } else {
    const match = teams.value.find(t => t.id === val.value);
    form.awayName = match ? match.nameZh : val.value;
    form.awayId = match ? match.id : null;
  }
};

const handleBlur = (type) => {
  if (type === 'home') {
    // 如果未选中队伍且输入框有值，保存到 homeName
    if (!form.homeId && form.homeName) {
      form.homeName = form.homeName.trim();
    }
  } else {
    // 如果未选中队伍且输入框有值，保存到 awayName
    if (!form.awayId && form.awayName) {
      form.awayName = form.awayName.trim();
    }
  }
};

async function loadEventWithSite(sportId, target) {
  const { data: team } = await getTeamById(sportId)
  teams.list = team

  handleTeamSelectorFocus(target)
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

    console.log(form);
    // fallback team names if not in list
    fallbackTeamName('homeId', 'homeNameZh');
    fallbackTeamName('awayId', 'awayNameZh');
  }
}

const handleTeamSelectorFocus = (target) => {
  loadedTeams.value = teams.value.slice(0, TEAMS_PER_VIEW);
  teamSelectorStatus.value = target;
  nextTick(() => {
    if (!teamSelectorBottomRef.value) return;
    teamSelectorScrollObserver.value.observe(teamSelectorBottomRef.value);
  })
}

// Add this at the top of your script
const formErrors = reactive({
  sportId: '',
  title: '',
  homeId: '',
  awayId: '',
  eventStartTime: '',
  eventEndTime: ''
});

function validateForm() {
  let isValid = true;

  Object.keys(formErrors).forEach(key => formErrors[key] = '');

  if (!form.sportId) {
    formErrors.sportId = t('message.sportTypeRequired');
    isValid = false;
  }

  if (!form.title) {
    formErrors.title = t('message.validateMatchTitleRequired');
    isValid = false;
  }

  if (!form.homeId && !form.homeName) {
    formErrors.homeId = t('message.validateHomeTeamRequired');
    isValid = false;
  }

  if (!form.awayId && !form.awayName) {
    formErrors.awayId = t('message.validateAwayTeamRequired');
    isValid = false;
  }

  if (!form.eventStartTime) {
    formErrors.eventStartTime = t('message.validateMatchTimeRequired');
    isValid = false;
  }

  return isValid;
}

// Update your submit function
async function submit() {
  if (!validateForm()) {
    return ;
  }
  
  const payload = {
    id: form.id,
    sportId: form.sportId,
    title: form.title,
    eventStartTime: form.eventStartTime ? dayjs(form.eventStartTime).format("YYYY-MM-DD HH:mm:ss") : null,
    eventEndTime: form.eventEndTime ? dayjs(form.eventEndTime).format("YYYY-MM-DD HH:mm:ss") : null,
    liveStatus: form.liveStatus,
    sort: form.sort,
    isTest: form.isTest,
    isPopular: form.isPopular,
    cover: form.cover,
    eventCode: form.eventCode
  };


  if (isInTeamList(form.homeId)) {
    console.log("isInTeamList ::: form.homeId : ", form.homeId)
    payload.homeId = form.homeId;
  } else if (form.homeName) {
    console.log("isInTeamList ::: form.homeName : ", form.homeName)
    payload.homeName = form.homeName;
  }

  if (isInTeamList(form.awayId)) {
    payload.awayId = form.awayId;
  } else if (form.awayName) {
    payload.awayName = form.awayName;
  }

  try {
    await updateSportLiveEvent(payload);
    toast.add({ severity: 'success', summary: t('message.updateSuccess'), life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('message.updateFailed'), life: 3000 });
  }
}

// 1. 定义观察器
const registerTeamSelectorScrollObserver = () => {
  teamSelectorScrollObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const newTeams = teams.value.slice(
            loadedTeams.value.length,
            loadedTeams.value.length + TEAMS_PER_VIEW
          );
          if (newTeams.length > 0) {
            loadedTeams.value = [...loadedTeams.value, ...newTeams];
          }
        }
      });
    },
    { threshold: 0.1 }
  );
};

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

<style scoped lang="scss">
.event-editor-container {
  padding: 20px;
}

.team-selector {
  :deep(.el-select__caret) {
    &::before {
      content: "\e6e1";
    }
  }
  :deep(.is-focus) {
    .el-select__caret {
      transform: rotateZ(0deg)
    }
  }
}

.p-field {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-bottom: 15px; /* 底部間距 */
}

.p-field label {
  flex: 0 0 150px; /* 固定寬度 */
  text-align: right;
  margin-right: 20px;
}

.p-field-checkbox {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-bottom: 15px; /* 底部間距 */
}

.p-field-checkbox label {
  flex: 0 0 150px; /* 固定寬度 */
  text-align: right;
  margin-right: 20px;
}
</style>

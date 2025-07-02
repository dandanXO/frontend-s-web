<template>
  2
<!--  <div class="event-editor-container">-->
<!--    <Card>-->
<!--      <form @submit.prevent="submit" class="p-fluid">-->
<!--        &lt;!&ndash; Sport Type Dropdown &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="sportId">{{ t('fields.sportType') }}</label>-->
<!--          <Dropdown v-model="form.sportId" :options="uiControl.sport" optionLabel="display" optionValue="id" inputId="sportId" style="width: 300px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Title Input &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="title">{{ t('fields.title') }}</label>-->
<!--          <InputText v-model="form.title" id="title" maxlength="100" style="width: 300px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Home Team Selector &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="homeTeam">{{ t('fields.homeTeam') }}</label>-->
<!--          <AutoComplete-->
<!--            v-model="form.homeId"-->
<!--            :suggestions="displayTeams"-->
<!--            field="nameZh"-->
<!--            :completeMethod="searchTeams"-->
<!--            forceSelection-->
<!--            dropdown-->
<!--            style="width: 300px"-->
<!--            @item-select="e => selectTeam('home', e.value)"-->
<!--            @blur="() => validateTeam('home')"-->
<!--          >-->
<!--            <template #item="slotProps">-->
<!--              <div style="display: flex; align-items: center">-->
<!--                <img :src="resolveIcon(slotProps.item.icon)" style="width: 20px; height: 20px; margin-right: 10px" />-->
<!--                {{ slotProps.item.nameZh }}-->
<!--              </div>-->
<!--            </template>-->
<!--          </AutoComplete>-->
<!--        </div>-->

<!--        &lt;!&ndash; Away Team Selector &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="awayTeam">{{ t('fields.awayTeam') }}</label>-->
<!--          <AutoComplete-->
<!--            v-model="form.awayId"-->
<!--            :suggestions="displayTeams"-->
<!--            field="nameZh"-->
<!--            :completeMethod="searchTeams"-->
<!--            forceSelection-->
<!--            dropdown-->
<!--            style="width: 300px"-->
<!--            @item-select="e => selectTeam('away', e.value)"-->
<!--            @blur="() => validateTeam('away')"-->
<!--          >-->
<!--            <template #item="slotProps">-->
<!--              <div style="display: flex; align-items: center">-->
<!--                <img :src="resolveIcon(slotProps.item.icon)" style="width: 20px; height: 20px; margin-right: 10px" />-->
<!--                {{ slotProps.item.nameZh }}-->
<!--              </div>-->
<!--            </template>-->
<!--          </AutoComplete>-->
<!--        </div>-->

<!--        &lt;!&ndash; Sequence &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="sort">{{ t('fields.sequence') }}</label>-->
<!--          <InputNumber v-model="form.sort" id="sort" :min="0" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Match Time &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="matchTime">{{ t('fields.matchTime') }}</label>-->
<!--          <Calendar v-model="form.eventStartTime" showTime hourFormat="24" dateFormat="yy-mm-dd" style="width: 350px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; End Time &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="endTime">{{ t('fields.endTime') }}</label>-->
<!--          <Calendar v-model="form.eventEndTime" showTime hourFormat="24" dateFormat="yy-mm-dd" style="width: 350px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Status Dropdown &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="liveStatus">{{ t('fields.status') }}</label>-->
<!--          <Dropdown v-model="form.liveStatus" :options="uiControl.liveStatus" optionLabel="display" optionValue="id" style="width: 300px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Event Code &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label for="eventCode">{{ t('fields.eventCode') }}</label>-->
<!--          <InputText v-model="form.eventCode" id="eventCode" maxlength="100" style="width: 300px" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Is Test Switch &ndash;&gt;-->
<!--        <div class="p-field-checkbox">-->
<!--          <label>{{ t('fields.isTestEvent') }}</label>-->
<!--          <InputSwitch v-model="form.isTest" /> {{ form.isTest ? t('fields.yes') : t('fields.no') }}-->
<!--        </div>-->

<!--        &lt;!&ndash; Is Popular Switch &ndash;&gt;-->
<!--        <div class="p-field-checkbox">-->
<!--          <label>{{ t('fields.isPopularEvent') }}</label>-->
<!--          <InputSwitch v-model="form.isPopular" /> {{ form.isPopular ? t('fields.yes') : t('fields.no') }}-->
<!--        </div>-->

<!--        &lt;!&ndash; Cover Upload &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <label>{{ t('fields.cover') }}</label>-->
<!--          <div style="display: flex; flex-direction: column;">-->
<!--            <Image-->
<!--              v-if="form.cover"-->
<!--              :src="promoDir2 + form.cover"-->
<!--              alt="cover preview"-->
<!--              width="120"-->
<!--              height="68"-->
<!--              preview-->
<!--              class="preview"-->
<!--              style="margin-bottom: 8px; border: 1px solid #ccc"-->
<!--            />-->
<!--            <Button v-if="form.cover" label="{{ t('fields.remove') }}" icon="pi pi-times" class="p-button-danger p-button-sm" @click="form.cover = ''" style="margin-bottom: 8px; width: fit-content;" />-->
<!--            <input type="file" accept="image/*" @change="attachImage" />-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Submit Buttons &ndash;&gt;-->
<!--        <div class="p-field">-->
<!--          <Button label="{{ t('fields.confirm') }}" icon="pi pi-check" type="submit" class="p-button-primary" />-->
<!--          <Button label="{{ t('fields.cancel') }}" icon="pi pi-times" class="p-button-secondary" @click="$router.back()" style="margin-left: 10px" />-->
<!--        </div>-->
<!--      </form>-->
<!--    </Card>-->
<!--  </div>-->
</template>

<script setup>
import { DashboardService } from '@/service/DashboardService.js'
import { ref, reactive, onMounted, nextTick, onUnmounted, computed } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { required } from '@/utils/validate';
import { useToast } from 'primevue/usetoast'
import { useSessionStorage, useStorage } from '@vueuse/core'

const { getEvents, getTeamById, uploadImage, updateSportLiveEvent } = DashboardService
import dayjs from "dayjs";
import { liveSportTyps } from "@/utils/live"
const toast = useToast()
const TEAMS_PER_VIEW = 20

const route = useRoute();
const { t } = useI18n();

const eventId = Number(route.query.id);
const formRef = ref(null);
const teams = ref([]);
const loadedTeams = ref([]);
const searchedTeams = ref([]);
const teamSelectorStatus = ref(null)
const teamSelectorBottomRef = ref(null);
const teamSelectorScrollObserver = ref(null);
const imageUrl = `https://file-admin.fwabm4gvc.com`
const promoDir = imageUrl + '/promo/'
const promoDir2 = imageUrl

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

const displayTeams = computed(() => {
  const _searchedTeams = searchedTeams.value.map(team => ({ ...team, _sid: `search-${team.id}` }))
  const _loadedTeams = loadedTeams.value.map(team => ({ ...team, _sid: `loaded-${team.id}` }));
  const allTeams = _searchedTeams.concat(_loadedTeams);
  const result = new Map()
  allTeams.forEach(team => {
    if (result.has(team.id)) return;
    result.set(team.id, team);
  })
  return Array.from(result.values());
})

async function attachImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  if (data) {
    form.cover = `/live/event/7/${data}`;
  } else {
    toast.add({ severity: 'error', summary: t('message.failedToUploadImage'), life: 3000 })
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
    toast.add({ severity: 'error', summary: t('message.invalidFileType'), life: 3000 })
    return null;
  }

  const formData = new FormData();
  formData.append('files', files);
  formData.append('dir', `live/event/7`);
  formData.append('overwrite', false);

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
  loadedTeams.value = teams.value.slice(0, TEAMS_PER_VIEW);
  teamSelectorStatus.value = target;
  nextTick(() => {
    if (!teamSelectorBottomRef.value) return;
    teamSelectorScrollObserver.value.observe(teamSelectorBottomRef.value);
  })
}

const afterTeamSelectorChanged = () => {
  nextTick(() => {
    loadedTeams.value = []
    teamSelectorStatus.value = null;
    teamSelectorScrollObserver.value.unobserve(teamSelectorBottomRef.value);
  })
}

const searchTeams = (query) => {
  if (!query) {
    searchedTeams.value = [];
  } else {
    searchedTeams.value = teams.value.filter(team => team.nameZh?.toLowerCase().includes(query.toLowerCase()) || team.nameEn?.toLowerCase().includes(query.toLowerCase()))
  }
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
      cover: form.cover,
      eventCode: form.eventCode
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
    toast.add({ severity: 'success', summary: t('message.updateSuccess'), life: 3000 })

  });
}

const registerTeamSelectorScrollObserver = () => {
  teamSelectorScrollObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadedTeams.value = teams.value.slice(0, loadedTeams.value.length + TEAMS_PER_VIEW);
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
</style>

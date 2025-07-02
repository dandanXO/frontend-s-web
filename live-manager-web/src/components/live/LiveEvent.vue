<template>
  <div class="roles-main">
    <ConfirmDialog></ConfirmDialog>

    <DataTable :value="page.records" :loading="page.loading" responsiveLayout="scroll" scrollable scrollWidth="100%">

      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Dropdown
            v-model="request.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('fields.sportType')"
            :showClear="true"
            class="p-inputtext-sm"
          />
          <Dropdown
            v-model="request.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            optionValue="id"
            :placeholder="t('fields.tfEventStatusName')"
            :showClear="true"
            class="p-inputtext-sm"
          />
          <InputText
            v-model="request.title"
            :placeholder="t('fields.eventName')"
            class="p-inputtext-sm"
            style="width: 180px"
          />

          <DatePicker
            id="eventStartTime"
            v-model="uiControl.eventStartTime"
            showTime
            :showSeconds="true"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            fluid
          />
          <DatePicker
            id="eventEndTime"
            v-model="uiControl.eventEndTime"
            showTime
            :showSeconds="true"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            fluid
            placeholder="請選擇結束時間" />

          <Button
            :label="t('fields.search')"
            :size="'small'"
            severity="success"
            icon="pi pi-search"
            @click="loadList"
          />
          <Button
            :label="t('fields.reset')"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            :label="t('fields.add')"
            :size="'small'"
            severity="info"
            icon="pi pi-plus"
            @click="showDialog('CREATE')"
          />
        </div>
      </template>

      <Column field="id" :header="t('fields.platformMatchId')" style="min-width: 120px" />
      <Column field="sportId" :header="t('fields.sportType')" style="min-width: 100px">
        <template #body="slotProps">
          {{ formatSportType(slotProps.data) }}
        </template>
      </Column>
      <Column field="title" :header="t('fields.title')" style="min-width: 250px" />
      <Column field="homeNameZh" :header="t('fields.homeTeam')" style="min-width: 200px">
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <Image
              v-if="slotProps.data.homeIcon"
              :src="slotProps.data.homeIcon?.startsWith('http') ? slotProps.data.homeIcon : promoDir + slotProps.data.homeIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
              preview
            />
            <span>{{ slotProps.data.homeNameZh || slotProps.data.homeName }}</span>
          </div>
        </template>
      </Column>
      <Column field="awayNameZh" :header="t('fields.awayTeam')" style="min-width: 200px">
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <Image
              v-if="slotProps.data.awayIcon"
              :src="slotProps.data.awayIcon?.startsWith('http') ? slotProps.data.awayIcon : promoDir + slotProps.data.awayIcon"
              preview
              style="width: 20px; height: 20px; margin-right: 10px"
            />
            <span>{{ slotProps.data.awayNameZh || slotProps.data.awayName }}</span>
          </div>
        </template>
      </Column>
      <Column field="cover" :header="t('fields.cover')" style="min-width: 80px">
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <Image
              v-if="slotProps.data.cover"
              :src="promoDir2 + slotProps.data.cover"
              style="width: 20px; height: 20px; margin-right: 10px"
              preview
            />
          </div>
        </template>
      </Column>
      <Column field="sort" :header="t('fields.sequence')" style="min-width: 80px" />
      <Column field="liveStatus" :header="t('fields.status')" style="min-width: 120px">
        <template #body="slotProps">
          <Tag v-if="slotProps.data.liveStatus === 2" severity="success">{{ t('status.uefaMatch.ENDED') }}</Tag>
          <Tag v-else-if="slotProps.data.liveStatus === 1" severity="warning">{{ t('status.uefaMatch.ONGOING') }}</Tag>
          <Tag v-else-if="slotProps.data.liveStatus === 3" severity="danger">{{ t('status.uefaMatch.CANCEL') }}</Tag>
          <Tag v-else severity="info">{{ t('status.uefaMatch.PENDING') }}</Tag>
        </template>
      </Column>
      <Column field="eventStartTime" :header="t('fields.matchTime')" style="min-width: 160px">
        <template #body="slotProps">
          <span v-if="!slotProps.data.eventStartTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.eventStartTime) }}</span>
        </template>
      </Column>
      <Column field="eventEndTime" :header="t('fields.endTime')" style="min-width: 160px">
        <template #body="slotProps">
          <span v-if="!slotProps.data.eventEndTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.eventEndTime) }}</span>
        </template>
      </Column>
      <Column field="isTest" :header="t('fields.isTestEvent')" style="min-width: 120px">
        <template #body="slotProps">
          <Tag :severity="slotProps.data.isTest ? 'success' : 'info'">
            {{ slotProps.data.isTest ? t('fields.yes') : t('fields.no') }}
          </Tag>
        </template>
      </Column>
      <Column field="isPopular" :header="t('fields.isPopularEvent')" style="min-width: 120px">
        <template #body="slotProps">
          <Tag :severity="slotProps.data.isPopular ? 'success' : 'info'">
            {{ slotProps.data.isPopular ? t('fields.yes') : t('fields.no') }}
          </Tag>
        </template>
      </Column>
      <Column field="eventCode" :header="t('fields.eventCode')" style="min-width: 120px" />
      <Column field="createTime" :header="t('fields.createTime')" style="min-width: 160px">
        <template #body="slotProps">
          <span v-if="!slotProps.data.createTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.createTime) }}</span>
        </template>
      </Column>
      <Column field="createBy" :header="t('fields.createBy')" style="min-width: 120px" />
      <Column field="updateTime" :header="t('fields.updateTime')" style="min-width: 160px">
        <template #body="slotProps">
          <span v-if="!slotProps.data.updateTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.updateTime) }}</span>
        </template>
      </Column>
      <Column field="updateBy" :header="t('fields.updateBy')" style="min-width: 120px" /><Column :header="t('fields.operate')" frozen alignFrozen="right">
        <template #body="slotProps">
          <div style="display: flex; gap: 8px; flex-wrap: nowrap;">
            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" style="width: 50px"  @click="confirmDelete(slotProps.data.id)">
              {{ t('fields.delete') }}
            </Button>
            <router-link
              :to="{
                path: '/live-sport/live-setting',
                query: { id: slotProps.data.id },
              }"
            >
              <Button icon="pi pi-video" class="p-button-text p-button-sm p-button-success" style="width: 100px">
                {{ t('fields.manageStream') }}
              </Button>
            </router-link>
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="request.size"
      :totalRecords="page.total"
      :rowsPerPageOptions="[10, 20, 50]"
      :first="(request.current - 1) * request.size"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      @page="changePage"
      class="p-mt-2"
    />

    <Dialog
      :header="ui.dialogTitle"
      v-model:visible="ui.dialogVisible"
      modal
      class="p-dialog-md live-event-dialog"
      appendTo="body"
    >
      <form @submit.prevent="submit" class="p-fluid">
        <!-- Sport Type -->
        <div class="p-field">
          <label :for="t('fields.sportType')">{{ t('fields.sportType') }}</label>
          <Dropdown
            v-model="form.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('fields.sportType')"
            class="w-full"
            :class="{ 'p-invalid': validationErrors.sportId }"
            filter
          />
          <small class="p-error" v-if="validationErrors.sportId">1111{{ validationErrors.sportId }}</small>
        </div>

        <!-- Title -->
        <div class="p-field">
          <label :for="t('fields.title')">{{ t('fields.title') }}</label>
          <InputText
            id="title"
            v-model="form.title"
            :class="{ 'p-invalid': validationErrors.title }"
            maxlength="100"
          />
          <small class="p-error" v-if="validationErrors.title">{{ validationErrors.title }}</small>
        </div>

        <!-- Home Team -->
        <div class="p-field">
          <label :for="t('fields.homeTeam')">{{ t('fields.homeTeam') }}</label>
          <AutoComplete
            v-model="form.homeName"
            :suggestions="displayTeams"
            @complete="searchTeams"
            field="nameZh"
            :placeholder="t('fields.homeTeam')"
            :dropdown="true"
            :forceSelection="false"
            :allow-create="true"
            @item-select="val => { form.homeId = val.value.id; form.homeName = val.value.nameZh; afterTeamSelectorChanged(); }"
            @change="
              val => {
                if (typeof val === 'string') form.homeName = val
                else form.homeName = ''
                afterTeamSelectorChanged()
              }
            "
            @focus="loadEventWithSite(form.sportId, 'home')"
            :class="{ 'p-invalid': validationErrors.homeId }"
          >
            <template #option="slotProps">
              <div style="display: flex; align-items: center">
                <img
                  :src="
                    slotProps.option.icon?.startsWith('http://') ||
                      slotProps.option.icon?.startsWith('https://')
                      ? slotProps.option.icon
                      : promoDir + slotProps.option.icon
                  "
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ slotProps.option.nameZh }}</span>
              </div>
            </template>
            <template #footer v-if="teamSelectorStatus === 'home'">
              <div ref="teamSelectorBottomRef" />
            </template>
          </AutoComplete>
          <small class="p-error" v-if="validationErrors.homeId">{{ validationErrors.homeId }}</small>
        </div>

        <!-- Away Team -->
        <div class="p-field">
          <label :for="t('fields.awayTeam')">{{ t('fields.awayTeam') }}</label>
          <AutoComplete
            v-model="form.awayName"
            :suggestions="displayTeams"
            @complete="searchTeams"
            field="nameZh"
            :placeholder="t('fields.awayTeam')"
            :dropdown="true"
            :forceSelection="false"
            :allow-create="true"
            @item-select="val => { form.awayId = val.value.id; form.awayName = val.value.nameZh; afterTeamSelectorChanged(); }"
            
            @change="
              val => {
                if (typeof val === 'string') form.awayName = val
                else form.awayName = ''
                afterTeamSelectorChanged()
              }
            "
            @focus="loadEventWithSite(form.sportId, 'away')"
            :class="{ 'p-invalid': validationErrors.awayId }"
          >
            <template #option="slotProps">
              <div style="display: flex; align-items: center">
                <img
                  :src="
                    slotProps.option.icon?.startsWith('http://') ||
                      slotProps.option.icon?.startsWith('https://')
                      ? slotProps.option.icon
                      : promoDir + slotProps.option.icon
                  "
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ slotProps.option.nameZh }}</span>
              </div>
            </template>
            <template #footer v-if="teamSelectorStatus === 'away'">
              <div ref="teamSelectorBottomRef" />
            </template>
          </AutoComplete>
          <small class="p-error" v-if="validationErrors.awayId">{{ validationErrors.awayId }}</small>
        </div>

        <!-- Sequence -->
        <div class="p-field">
          <label :for="t('fields.sequence')">{{ t('fields.sequence') }}</label>
          <InputNumber
            id="sequence"
            v-model.number="form.sort"
            :min="0"
            mode="decimal"
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            :class="{ 'p-invalid': validationErrors.sort }"
            @keypress="restrictInput($event)"
          />
          <small class="p-error" v-if="validationErrors.sort">{{ validationErrors.sort }}</small>
        </div>

        <!-- Match Time -->
        <div class="p-field">
          <label :for="t('fields.matchTime')">{{ t('fields.matchTime') }}</label>
          <Calendar
            v-model="uiForm.eventStartTime"
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            :showSeconds="true"
            :class="{ 'p-invalid': validationErrors.eventStartTime }"
          />
          <small class="p-error" v-if="validationErrors.eventStartTime">{{ validationErrors.eventStartTime }}</small>
        </div>

        <!-- End Time -->
        <div class="p-field">
          <label :for="t('fields.endTime')">{{ t('fields.endTime') }}</label>
          <Calendar
            v-model="uiForm.eventEndTime"
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            :showSeconds="true"
            :class="{ 'p-invalid': validationErrors.eventEndTime }"
          />
          <small class="p-error" v-if="validationErrors.eventEndTime">{{ validationErrors.eventEndTime }}</small>
        </div>

        <!-- Status -->
        <div class="p-field">
          <label :for="t('fields.status')">{{ t('fields.status') }}</label>
          <Dropdown
            v-model="form.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            optionValue="id"
            :placeholder="t('fields.status')"
            class="w-full"
            :class="{ 'p-invalid': validationErrors.liveStatus }"
          />
          <small class="p-error" v-if="validationErrors.liveStatus">{{ validationErrors.liveStatus }}</small>
        </div>

        <!-- Is Test Event -->
        <div class="p-field flex align-items-center">
          <label :for="t('fields.isTestEvent')" class="mr-3">{{ t('fields.isTestEvent') }}</label>
          <InputSwitch v-model="form.isTest" />
          <span class="ml-2">{{ form.isTest ? t('fields.yes') : t('fields.no') }}</span>
          <small class="p-error" v-if="validationErrors.isTest">{{ validationErrors.isTest }}</small>
        </div>

        <!-- Is Popular Event -->
        <div class="p-field flex align-items-center">
          <label :for="t('fields.isPopularEvent')" class="mr-3">{{ t('fields.isPopularEvent') }}</label>
          <InputSwitch v-model="form.isPopular" />
          <span class="ml-2">{{ form.isPopular ? t('fields.yes') : t('fields.no') }}</span>
          <small class="p-error" v-if="validationErrors.isPopular">{{ validationErrors.isPopular }}</small>
        </div>

        <!-- Cover -->
        <div class="p-field">
          <label :for="t('fields.cover')">{{ t('fields.cover') }}</label>
          <div class="flex flex-column">
            <Image
              v-if="form.cover"
              :src="`${promoDir2}/live/event/${store.siteId}/` + form.cover"
              alt="Cover Image"
              width="150"
              preview
              class="border-1 border-round surface-border"
              style="max-width: 150px; max-height: 100px; object-fit: contain;"
            />
            <input
              type="file"
              accept="image/*"
              @change="attachImage"
              class="mt-3"
            >
          </div>
          <small class="p-error" v-if="validationErrors.cover">{{ validationErrors.cover }}</small>
        </div>

      </form>
      <template #footer>
        <Button
          :label="t('fields.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDialog"
        />
        <Button
          :label="t('fields.confirm')"
          icon="pi pi-check"
          autofocus
          @click="submit"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useSessionStorage } from '@vueuse/core'
import { ref, reactive, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import { useI18n } from "vue-i18n";
import { liveSportTyps } from '@/utils/live.js';
import { DashboardService } from '@/service/DashboardService.js'
import { uploadImage } from '@/service/image'
import { SiteService } from '@/service/SiteService.js'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/userStore.js'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import DatePicker from 'primevue/datepicker';

const store = useUserStore()
const TEAMS_PER_VIEW = 20
const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
//const const imageUrl = useSessionStorage('IMAGE_CDN', process.env.VUE_APP_IMAGE).value
const imageUrl = `https://file-admin.fwabm4gvc.com`
const promoDir = imageUrl + '/promo/'
const promoDir2 = imageUrl

const getStartOfDayDate = (date) => {
  return dayjs(date).startOf('day').toDate();
};
const getEndOfDayDate = (date) => {
  return dayjs(date).endOf('day').toDate();
};
const formatToStartOfDayString = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
const uiControl = reactive({
  eventStartTime:  getStartOfDayDate(new Date()),
  eventEndTime: getEndOfDayDate(new Date()),
  sport: liveSportTyps,
  liveStatus: [
    {
      name: '1',
      display: t('status.uefaMatch.PENDING'),
      id: 0,
    },
    {
      name: '2',
      display: t('status.uefaMatch.ONGOING'),
      id: 1,
    },
    {
      name: '3',
      display: t('status.uefaMatch.ENDED'),
      id: 2,
    },
    {
      name: '4',
      display: t('status.uefaMatch.CANCEL'),
      id: 3,
    },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
  eventStartTime: [],
});

const timezone = ref(null)
const teams = reactive({
  list: [],
})

const page = reactive({
  total: 0,
  records: [],
  loading: false
});

function formatSportType(row) {
  switch (row.sportId) {
    case 1:
      return t('fields.football')
    case 2:
      return t('fields.basketball')
    default: {
      const item = liveSportTyps.find(item => item.id === row.sportId)
      return item ? item.display : '-'
    }
  }
}
const form = reactive({
  id: null,
  homeId: null,
  homeNameZh: null,
  awayId: null,
  awayNameZh: null,
  sportId: null,
  liveStatus: null,
  sort: null,
  title: null,
  eventStartTime: null,
  eventEndTime: null,
  homeName: '',
  awayName: '',
  isTest: false,
  cover: '',
  isPopular: false,
});

const loadedTeams = ref([])
const searchedTeams = ref([])
const teamSelectorStatus = ref(null)
const teamSelectorBottomRef = ref(null)
const teamSelectorScrollObserver = ref(null)


const displayTeams = computed(() => {
  const _searchedTeams = searchedTeams.value.map(team => ({
    ...team,
    _sid: `search-${team.id}`,
  }))
  const _loadedTeams = loadedTeams.value.map(team => ({
    ...team,
    _sid: `loaded-${team.id}`,
  }))
  const allTeams = _searchedTeams.concat(_loadedTeams)
  const result = new Map()
  allTeams.forEach(team => {
    if (result.has(team.id)) return
    result.set(team.id, team)
  })
  return Array.from(result.values())
})


function isInTeamList(value) {
  return teams.list.some(t => t.id === value)
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}
const ui = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
});

const uiForm = reactive({
  eventStartTime: null,
  eventEndTime: null,
});

const validationErrors = reactive({
  title: null,
  cover: null
})

const registerTeamSelectorScrollObserver = () => {
  teamSelectorScrollObserver.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadedTeams.value = teams.list.slice(
          0,
          loadedTeams.value.length + TEAMS_PER_VIEW
        )
      }
    })
  })
}
async function loadEventWithSite(sportId, target) {

  teams.list = [];
  loadedTeams.value = [];
  searchedTeams.value = [];
  
  if (sportId) {
    const { data: team } = await DashboardService.getSportLiveTeamById(sportId)
    teams.list = team
  } else {
    const { data: team } = await DashboardService.getSportLiveTeamById(request.sportId)
    teams.list = team
  }
  handleTeamSelectorFocus(target)
}

async function loadList() {
  page.loading = true;
  try {
    const res = await DashboardService.getSportLiveEvents({ ...request });
    page.records = res.data.records || [];
    page.total = res.data.total || 0;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('message.loadFailed'), life: 3000 });
  } finally {
    page.loading = false;
  }
}
const handleTeamSelectorFocus = target => {
  loadedTeams.value = teams.list.slice(0, TEAMS_PER_VIEW)
  teamSelectorStatus.value = target
  nextTick(() => {
    if (!teamSelectorBottomRef.value) return
    teamSelectorScrollObserver.value.observe(teamSelectorBottomRef.value)
  })
}

function resetQuery() {
  request.sportId = null
  request.nameEn = null
  request.title = null
}


function resetDialogContent() {
  validationErrors.title = null;
  validationErrors.cover = null;
  uiForm.eventStartTime = null
  uiForm.eventEndTime = null
  Object.assign(form, {
    id: null,
    homeId: null,
    homeNameZh: null,
    awayId: null,
    awayNameZh: null,
    sportId: null,
    liveStatus: null,
    sort: null,
    title: null,
    eventStartTime: null,
    eventEndTime: null,
    homeName: '',
    awayName: '',
    isTest: false,
    cover: '',
    isPopular: false,
  })
}

function showDialog() {
  ui.dialogVisible = true;
  resetDialogContent()
}
function closeDialog() {
  ui.dialogVisible = false;
  resetDialogContent()
}

async function attachImage(event) {
  const file = event.target.files[0]
  if (!file) return

  const data = await attachPhoto(event)
  console.log(data)
  if (data) {
    form.cover = data
  } else {
    validationErrors.cover = t('message.failedToUploadImage');
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  if (!files) return

  const fr = new FileReader()
  fr.onload = function() {
    const img = new Image()
    img.onload = function() {}
    img.src = fr.result
  }
  fr.readAsDataURL(files)

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowFileType.includes(files.type)) {
    validationErrors.cover = t('message.invalidFileType');
    return null
  }

  const formData = new FormData()
  formData.append('files', files)
  formData.append('dir', `live/event/${store.siteId}`)
  formData.append('overwrite', false)

  try {
    const response = await uploadImage(formData)
    return response.code === 0 ? response.data : null
  } catch (error) {
    validationErrors.cover = t('message.failedToUploadImage');
    return null
  }
}
async function submit() {
  
  validationErrors.title = null;
  if (!form.title) {
    validationErrors.title = t('message.validateTitleRequired');
    return;
  }


  if (!isInTeamList(form.homeId)) {
    form.homeName = form.homeId
    form.homeId = null
  }
  if (!isInTeamList(form.awayId)) {
    form.awayName = form.awayId
    form.awayId = null
  }

  form.icon = form.icon?.startsWith('http')
    ? store.siteId + '/' + form.icon.split('/').pop()
    : form.icon
  if (form.cover) {
    form.cover = form.cover.startsWith('/live/event/')
      ? form.cover
      : `/live/event/${store.siteId}/${form.cover}`
  }
  console.log(form)
  
  
  try {
    await DashboardService.createSportLiveEvent(form);
    toast.add({ severity: 'success', summary: 'Success', detail: t('message.addSuccess'), life: 3000 });
    closeDialog()
    await loadList();
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: t('fields.fail'), life: 3000 });
  }
}

function formatTime(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

function confirmDelete(id) {
  confirm.require({
    message: t('message.confirmDelete'),
    header: t('fields.remove'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await DashboardService.deleteSportLiveEvent(id);
        toast.add({ severity: 'success', summary: 'Success', detail: t('message.deleteSuccess'), life: 3000 });
        await loadList();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: t('message.deleteFailed'), life: 3000 });
      }
    }
  });
}

function changePage(event) {
  request.current = event.page + 1;
  request.size = event.rows;
  loadList();
}


const afterTeamSelectorChanged = () => {
  nextTick(() => {
    loadedTeams.value = []
    teamSelectorStatus.value = null

    if (teamSelectorScrollObserver.value && teamSelectorBottomRef.value) {
      teamSelectorScrollObserver.value.unobserve(teamSelectorBottomRef.value)
    }
  })
}

const searchTeams = (obj) => {
  const query = obj.query || ''
  if (!query) {
    searchedTeams.value = []
  } else {
    searchedTeams.value = teams.list.filter(team => {
      return (
        team.nameZh?.toLowerCase().includes(query.toLowerCase()) ||
        team.nameEn?.toLowerCase().includes(query.toLowerCase())
      )
    })
  }
}

watch(() => uiControl.eventStartTime, (newValue) => {
  request.eventStartTime[0] = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiControl.eventEndTime, (newValue) => {
  request.eventStartTime[1] = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiForm.eventStartTime, (newValue) => {
  form.eventStartTime = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiForm.eventEndTime, (newValue) => {
  form.eventStartTime = formatToStartOfDayString(newValue);
}, { immediate: true });


onMounted(async () => {
  const { data: timeZone } = await SiteService.getSiteTimeZoneById(store.siteId) || "+08:00"
  timezone.value = timeZone

  await loadList()
  registerTeamSelectorScrollObserver()
})
onUnmounted(() => {
  if (teamSelectorScrollObserver.value) {
    teamSelectorScrollObserver.value.disconnect()
  }
})
</script>

<style scoped>
.roles-main {
  overflow-x: auto;
  width: 99%;
}

.header-container {
  display: flex;
  justify-content: flex-end; /* Align to right for search and add buttons */
  margin-bottom: 10px;
}

.search .p-button {
  margin-left: 10px; /* Spacing between buttons */
}

/* PrimeVue P-field for form items */
.p-field {
  margin-bottom: 1rem;
  label {
    width: 150px;
    display: inline-block;
  }
}

.p-dialog-md {
  width: 700px; /* Equivalent to Element Plus width */
}
</style>

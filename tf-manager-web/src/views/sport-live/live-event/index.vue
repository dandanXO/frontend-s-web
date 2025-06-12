<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportId"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.sport"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.liveStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.liveStatus"
            :key="item.name"
            :label="item.display"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.matchTitle')"
        />
        <el-date-picker
          v-model="request.eventStartTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />

        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadEvent">
          {{ t('fields.search') }}
        </el-button>

        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="780px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.sportType')" prop="sportId">
          <el-select
            v-model="form.sportId"
            size="small"
            :placeholder="t('fields.sportType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.sport"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
          <el-select
            v-model="form.homeId"
            size="small"
            allow-create
            filterable
            remote
            :placeholder="t('fields.homeTeam')"
            :remote-method="searchTeams"
            remote-show-suffix
            class="filter-item team-selector"
            style="width: 350px;"
            default-first-option
            @change="val => {
              if (typeof val === 'string') form.homeName = val;
              else form.homeName = '';
              afterTeamSelectorChanged()
            }"
            @focus="loadEventWithSite(form.sportId, 'home')"
          >
            <el-option
              v-for="item in displayTeams"
              :key="item.nameZh"
              :label="item.nameZh"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img
                  :src="(item.icon?.startsWith('http://') || item.icon?.startsWith('https://')) ? item.icon : promoDir + item.icon"
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ item.nameZh }}</span>
              </div>
            </el-option>
            <div v-if="teamSelectorStatus === 'home'" ref="teamSelectorBottomRef" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
          <el-select
            v-model="form.awayId"
            size="small"
            remote
            :placeholder="t('fields.awayTeam')"
            :remote-method="searchTeams"
            allow-create
            filterable
            remote-show-suffix
            class="filter-item team-selector"
            style="width: 350px;"
            default-first-option
            @change="val => {
              if (typeof val === 'string') form.awayName = val;
              else form.awayName = '';
              afterTeamSelectorChanged()
            }"
            @focus="loadEventWithSite(form.sportId, 'away')"
          >
            <el-option
              v-for="item in displayTeams"
              :key="item.nameZh"
              :label="item.nameZh"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img
                  :src="(item.icon?.startsWith('http://') || item.icon?.startsWith('https://')) ? item.icon : promoDir + item.icon"
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ item.nameZh }}</span>
              </div>
            </el-option>
            <div v-if="teamSelectorStatus === 'away'" ref="teamSelectorBottomRef" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sort"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
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
          <el-select
            v-model="form.liveStatus"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 120px;"
          >
            <el-option
              v-for="item in uiControl.liveStatus"
              :key="item.display"
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
              :src="`${promoDir2}/live/event/${store.state.user.siteId}/` + form.cover"
              style="width: 150px; height: 100px; border: 1px solid #ccc;"
              class="preview"
            />
            <input type="file" accept="image/*" @change="attachImage" style="margin-top: 10px;">
          </div>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row
              :empty-text="t('fields.noData')"
    >
      <el-table-column prop="id" :label="t('fields.platformMatchId')" width="50" />
      <el-table-column prop="sportId" :label="t('fields.sportType')" width="50" :formatter="formatSportType" />
      <el-table-column prop="title" :label="t('fields.title')" width="250" />
      <el-table-column prop="homeNameZh" :label="t('fields.homeTeam')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              v-if="scope.row.homeIcon"
              :src="scope.row.homeIcon.startsWith('http:') || scope.row.homeIcon.startsWith('https:')
                ? scope.row.homeIcon
                : promoDir + scope.row.homeIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            >
            <span>{{ scope.row.homeNameZh || scope.row.homeName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="awayNameZh" :label="t('fields.awayTeam')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              v-if="scope.row.awayIcon"
              :src="scope.row.awayIcon.startsWith('http:') || scope.row.awayIcon.startsWith('https:')
                ? scope.row.awayIcon
                : promoDir + scope.row.awayIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            >
            <span>{{ scope.row.awayNameZh || scope.row.awayName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cover" :label="t('fields.cover')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              v-if="scope.row.cover"
              :src="promoDir2 + scope.row.cover"
              style="width: 20px; height: 20px; margin-right: 10px"
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="t('fields.sequence')" width="50" />
      <el-table-column prop="liveStatus" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.liveStatus === 2" type="success">{{ t('status.uefaMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 1" type="warning">{{ t('status.uefaMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 3" type="danger">{{ t('status.uefaMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 0" type="info">{{ t('status.uefaMatch.PENDING') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventStartTime" :label="t('fields.matchTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.eventStartTime === null">-</span>
          <span
            v-if="scope.row.eventStartTime !== null"
            v-formatter="{
              data: scope.row.eventStartTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="eventEndTime" :label="t('fields.endTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.eventEndTime === null">-</span>
          <span
            v-if="scope.row.eventEndTime !== null"
            v-formatter="{
              data: scope.row.eventEndTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="isTest" :label="t('fields.isTestEvent')" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isTest ? 'success' : 'info'">
            {{ scope.row.isTest ? t('fields.yes') : t('fields.no') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isPopular" :label="t('fields.isPopularEvent')" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isPopular ? 'success' : 'info'">
            {{ scope.row.isPopular ? t('fields.yes') : t('fields.no') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="120" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="120"/>
      <
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="300"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteTeam(scope.row.id)"
          >
            {{ t('fields.delete') }}
          </el-button>
          <router-link :to="{ path: '/live-sport/live-setting', query: { id: scope.row.id } }">
            <el-button icon="el-icon-video-camera" size="mini" type="success">
              {{ t('fields.manageStream') }}
            </el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
</template>

<script setup>

import { onMounted, reactive, ref, computed, nextTick, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import { getTeamById, getEvents, createSportLiveEvent, deleteSportLiveEvent } from "@/api/sport-live";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { useSessionStorage } from "@vueuse/core";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment/moment";
import { uploadImage } from "@/api/image";
import { liveSportTyps } from "@/utils/live"

const TEAMS_PER_VIEW = 20

const { t } = useI18n();
const shortcuts = getShortcuts(t);
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const promoDir2 = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  dialogLoading: false,
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
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
});

function formatSportType(row) {
  switch (row.sportId) {
    case 1:
      return t('fields.football');
    case 2:
      return t('fields.basketball');
    case 3:
      return 'LOL'
    case 4:
      return 'CSGO'
    case 5:
      return 'DOTA2'
    default:
      return '-';
  }
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
  eventStartTime: [convertStartDate(new Date()), convertDate(new Date())],
});

const timezone = ref(null);
const teams = reactive({
  list: [],
})
const formRef = ref(null);
const store = useStore()
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

const loadedTeams = ref([]);
const searchedTeams = ref([]);
const teamSelectorStatus = ref(null)
const teamSelectorBottomRef = ref(null);
const teamSelectorScrollObserver = ref(null);

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

function resetQuery() {
  request.sportId = null;
  request.nameEn = null;
  request.title = null;
}

function isInTeamList(value) {
  return teams.list.some(t => t.id === value);
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function loadEventWithSite(sportId, target) {
  console.log(sportId)
  if (sportId) {
    console.log(sportId)
    const { data: team } = await getTeamById(sportId);
    teams.list = team;
  } else {
    const { data: team } = await getTeamById(request.sportId);
    teams.list = team;
  }
  handleTeamSelectorFocus(target)
}

async function loadEvent() {
  page.loading = true;
  const { data: ret } = await getEvents(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function deleteTeam(eventId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      console.log(eventId)
      await deleteSportLiveEvent(eventId);
      ElMessage({
        message: t("message.deleteSuccess"),
        type: "success",
      });
      await loadEvent();
    } catch (error) {
      ElMessage({
        message: t("message.deleteFailed"),
        type: "error",
      });
    }
  }).catch(() => {
  });
}

async function attachImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  console.log(data);
  if (data) {
    form.cover = data;
  } else {
    ElMessage({
      message: t('message.failedToUploadImage'),
      type: 'error',
    });
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
    ElMessage({
      message: t('message.invalidFileType'),
      type: 'error',
    });
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
    ElMessage({
      message: t('message.failedToUploadImage'),
      type: 'error',
    })
    return null;
  }
}

function submit() {
  create();
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (!isInTeamList(form.homeId)) {
        form.homeName = form.homeId;
        form.homeId = null;
      }
      if (!isInTeamList(form.awayId)) {
        form.awayName = form.awayId;
        form.awayId = null;
      }

      form.icon = form.icon?.startsWith("http") ? store.state.user.siteId + "/" + form.icon.split('/').pop() : form.icon;
      if (form.cover) {
        form.cover = form.cover.startsWith('/live/event/')
          ? form.cover
          : `/live/event/${store.state.user.siteId}/${form.cover}`;
      }
      await createSportLiveEvent(form);
      uiControl.dialogVisible = false;
      await loadEvent();
      ElMessage({
        message: t('message.addSuccess'),
        type: "success",
      });
    }
  });
}

function changePage(page) {
  request.current = page;
  loadEvent();
}

function showDialog(type, row) {
  uiControl.dialogVisible = true;
  uiControl.dialogType = type;
  Object.assign(form, {
    id: null,
    sportId: null,
    homeId: null,
    homeNameZh: null,
    awayId: null,
    awayNameZh: null,
    sort: null,
    eventStartTime: null,
    eventEndTime: null,
    liveStatus: null,
    title: null,
    isTest: null,
    isPopular: null,
  });
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

const formRules = reactive({
  title: [required(t('message.validateTeamNameRequired'))],
  nameEn: [required(t('message.validateTeamNameRequired'))],
  icon: [required(t('message.validateTeamIconRequired'))],
});

const handleTeamSelectorFocus = (target) => {
  loadedTeams.value = teams.list.slice(0, TEAMS_PER_VIEW);
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
    searchedTeams.value = teams.list.filter(team => {
      return team.nameZh?.toLowerCase().includes(query.toLowerCase()) || team.nameEn?.toLowerCase().includes(query.toLowerCase())
    })
  }
}

const registerTeamSelectorScrollObserver = () => {
  teamSelectorScrollObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadedTeams.value = teams.list.slice(0, loadedTeams.value.length + TEAMS_PER_VIEW);
      }
    })
  })
}

onMounted(async () => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId,
  )
  timezone.value = timeZone

  await loadEvent();
  registerTeamSelectorScrollObserver();
});

onUnmounted(() => {
  if (teamSelectorScrollObserver.value) {
    teamSelectorScrollObserver.value.disconnect();
  }
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
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

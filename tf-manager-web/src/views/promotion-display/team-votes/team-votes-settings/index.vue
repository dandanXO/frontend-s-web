<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadTeamVotesSettings"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:team-votes:create']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="warning"
          v-permission="['sys:team-votes:update']"
          :disabled="uiControl.awardBtn"
          @click="showDialog('UPDATE_AWARD')"
        >
          {{ t('fields.updateAwards') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="votesForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sequence"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameEn')" prop="teamNameEn">
          <el-input v-model="form.teamNameEn" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameLocal')" prop="teamNameLocal">
          <el-input v-model="form.teamNameLocal" style="width: 350px" />
        </el-form-item>

        <el-form-item :label="t('fields.countryImage')" prop="countryImgUrl">
          <el-row :gutter="5" style="width: 350px">
            <el-col v-if="form.homeTeamIcon" :span="18">
              <el-image
                v-if="form.countryImgUrl"
                :src="promoDir + form.countryImgUrl"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.countryImgUrl]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage()"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form
        v-else
        ref="awardsFormRef"
        :model="awardsForm"
        :rules="awardsFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.awards')" prop="totalVoteReal">
          <el-input-number
            type="number"
            v-model.number="awardsForm.totalVoteReal"
            :min="1"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateTeamAwards">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column prop="sequence" :label="t('fields.sequence')">
        <template #default="scope">
          <el-input v-model="scope.row.sequence" />
        </template>
      </el-table-column>
      <el-table-column prop="teamNameLocal" :label="t('fields.teamName')" />
      <el-table-column prop="totalVotesRealVirtual" :label="t('fields.realVirtualVotes')">
        <template #default="scope">
          <el-input disabled v-model="scope.row.totalVotesRealVirtual" />
        </template>
      </el-table-column>
      <el-table-column prop="totalVotesVirtual" :label="t('fields.virtualVotes')">
        <template #default="scope">
          <el-input v-model="scope.row.totalVotesVirtual" />
        </template>
      </el-table-column>
      <el-table-column type="title" :label="t('fields.action')" v-if="hasPermission(['sys:team-votes:update'])">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            v-permission="['sys:team-votes:update']"
            @click="editVoteRecord(scope.row)"
          >{{ t('fields.update') }}</el-button>
          <el-button
            size="mini"
            type="danger"
            v-permission="['sys:team-votes:del']"
            @click="deleteVoteRecord(scope.row)"
          >{{ t('fields.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
  <el-dialog
    :title="uiControl.imageSelectionTitle"
    v-model="uiControl.imageSelectionVisible"
    append-to-body
    width="50%"
    :close-on-press-escape="false"
  >
    <div class="search">
      <el-input
        v-model="imageRequest.name"
        size="small"
        style="width: 200px"
        :placeholder="t('fields.imageName')"
      />
      <el-select
        v-model="imageRequest.siteId"
        size="small"
        :placeholder="t('fields.site')"
        class="filter-item"
        style="width: 120px; margin-left: 5px"
      >
        <el-option
          v-for="item in siteList.list"
          :key="item.id"
          :label="item.siteName"
          :value="item.id"
        />
      </el-select>
      <el-button
        style="margin-left: 20px"
        icon="el-icon-search"
        size="mini"
        type="success"
        ref="searchImage"
        @click="loadSiteImage"
      >
        {{ t('fields.search') }}
      </el-button>
      <el-button
        icon="el-icon-refresh"
        size="mini"
        type="warning"
        @click="resetImageQuery()"
      >
        {{ t('fields.reset') }}
      </el-button>
    </div>
    <div class="grid-container">
      <div
        v-for="item in imageList.list"
        :key="item"
        class="grid-item"
        :class="item.id === selectedImage.id ? 'selected' : ''"
      >
        <el-image
          :src="promoDir + item.path"
          fit="contain"
          style="aspect-ratio: 1/1"
          @click="selectImage(item)"
        />
      </div>
    </div>
    <el-pagination
      class="pagination"
      @current-change="changeImagePage"
      layout="prev, pager, next"
      :page-size="imageRequest.size"
      :page-count="imageList.pages"
      :current-page="imageRequest.current"
    />
    <div class="image-info" v-if="selectedImage.id !== 0">
      <el-row>
        <el-col :span="4">
          <h3>{{ t('fields.selectedImage') }}</h3>
        </el-col>
        <el-col :span="20">
          <el-image
            :src="promoDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[promoDir + selectedImage.path]"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageSite') }} :</el-col>
        <el-col :span="20">{{ selectedImage.siteName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageName') }} :</el-col>
        <el-col :span="20">{{ selectedImage.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageRemark') }} :</el-col>
        <el-col :span="20">{{ selectedImage.remark }}</el-col>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="uiControl.imageSelectionVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitImage">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  getTeamVotesSettings,
  createTeamVotes,
  updateVotes,
  deleteTeamVotes,
  updateAwards,
  getTeamVotesAwardsSettings
} from '../../../../api/team-votes'
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { hasPermission } from '../../../../utils/util'
import { required } from "../../../../utils/validate";
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../../api/site';
import { TENANT } from '../../../../store/modules/user/action-types';
import { getSiteImage } from '../../../../api/site-image';

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const site = ref(null);
const votesForm = ref(null)
const awardsFormRef = ref(null)
const totalVirtualVote = ref()
const siteList = reactive({
  list: [],
})
const awards = ref(null)
const route = useRoute()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  awardBtn: true,
  imageSelectionTitle: '',
  imageSelectionVisible: false
})

async function loadTeamVotesSettings() {
  const { data: ret } = await getTeamVotesSettings(request)
  page.pages = ret.pages
  page.records = ret.records
  ret.records.forEach(reco => {
    reco.totalVotesRealVirtual = getTotalAndVirtual(reco)
  });
  const { data: awardSettings } = await getTeamVotesAwardsSettings(request.siteId)
  awards.value = awardSettings;
  console.log(awards.value)
  if (awards.value) {
    console.log('award button enable')
    uiControl.awardBtn = false
  } else {
    uiControl.awardBtn = true
  }
};

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
  promoType: 'TEAM_ICON',
})

const imageList = reactive({
  list: [],
  pages: 0,
})

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

const form = reactive({
  siteId: null,
  teamNameEn: "",
  teamNameLocal: "",
  countryImgUrl: null,
  sequence: 0
})

const awardsForm = reactive({
  siteId: null,
  totalVoteReal: null
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  teamNameEn: [required(t('message.validateTeamNameEnRequired'))],
  teamNameLocal: [required(t('message.validateTeamNameLocalRequired'))],
  countryImgUrl: [required(t('message.validateCountryImageRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
});

const awardsFormRules = reactive({
  totalVoteReal: [required(t('message.validateAwardsRequired'))]
})

const page = reactive({
  pages: 0,
  records: [],
})

function changePage(page) {
  request.current = page
  loadTeamVotesSettings()
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function getTotalAndVirtual(row) {
  totalVirtualVote.value = Number(row.totalVotesReal) + Number(row.totalVotesVirtual)
  return totalVirtualVote.value
}

function create() {
  votesForm.value.validate(async valid => {
    if (valid) {
      await createTeamVotes(form)
      uiControl.dialogVisible = false
      await loadTeamVotesSettings()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    // edit()
  }
}

function deleteVoteRecord(value) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (value) {
      deleteTeamVotes(value.id).then((res) => {
        if (res.code === 0) {
          loadTeamVotesSettings()
          ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
        }
      })
    }
  });
}

function editVoteRecord(value) {
  if (value.totalVotesVirtual >= 0) {
    updateVotes(value).then((res) => {
      if (res.code === 0) {
        totalVirtualVote.value = Number(value.totalVotesReal) + Number(value.totalVotesVirtual)
        loadTeamVotesSettings()
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
      }
    })
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (votesForm.value) {
      votesForm.value.resetFields()
      form.id = null
    }
    form.siteId = request.siteId
    uiControl.dialogTitle = t('fields.createVote')
  } else if (type === 'UPDATE_AWARD') {
    console.log(awards.value)
    if (awards.value) {
      awardsForm.totalVoteReal = awards.value.totalVotesReal
    } else {
      awardsForm.totalVoteReal = 1
    }
    uiControl.dialogTitle = t('fields.updateAwards')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage() {
  await loadSiteImage()
  uiControl.imageSelectionTitle = t('fields.countryImage')
  uiControl.imageSelectionVisible = true
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  form.countryImgUrl = selectedImage.path
  uiControl.imageSelectionVisible = false
}

async function updateTeamAwards() {
  awardsFormRef.value.validate(async valid => {
    if (valid) {
      awardsForm.siteId = request.siteId
      await updateAwards(awardsForm)
      uiControl.dialogVisible = false
      await loadTeamVotesSettings()
      ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    }
  })
}

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id
  }
  await loadTeamVotesSettings();
})
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
</style>

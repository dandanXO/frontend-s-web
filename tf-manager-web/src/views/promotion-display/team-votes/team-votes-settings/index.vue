<template>
  <div class="roles-main">
    <div class="header-container">
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
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="votesForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.teamNameEn')" prop="teamNameEn">
          <el-input v-model="form.teamNameEn" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameLocal')" prop="teamNameLocal">
          <el-input v-model="form.teamNameLocal" style="width: 350px" />
        </el-form-item>

        <el-form-item :label="t('fields.countryImage')" prop="countryImgUrl">
          <el-row :gutter="24">
            <el-col :span="18">
              <el-input
                :readonly="true"
                v-model="form.countryImgUrl"
                autocomplete="off"
              />
            </el-col>
            <el-col :span="6">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input1"
                style="display: none"
                accept="image/*"
                @change="attachPhoto($event)"
              />
              <el-button
                style="display: block"
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.input1.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <el-input v-model="ruleForm.countryImgUrl" autocomplete="off" /> -->
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
</template>

<script setup>
import {
  getTeamVotesSettings,
  createTeamVotes,
  updateVotes,
  deleteTeamVotes
} from '../../../../api/team-votes'
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { hasPermission } from '../../../../utils/util'
import { uploadImage } from '../../../../api/image'
import { required } from "../../../../utils/validate";
// import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const votesForm = ref(null)

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dirPaymentLabel = 'payment/label'

  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dirPaymentLabel)
    formData.append('overwrite', false)
    const data = await uploadImage(formData)
    if (data.code === 0) {
      form.countryImgUrl = data.data[0]
    } else {
      ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    }
  }
};
async function loadTeamVotesSettings() {
  const { data: ret } = await getTeamVotesSettings(request)
  page.pages = ret.pages
  page.records = ret.records
  ret.records.forEach(reco => {
    reco.totalVotesRealVirtual = getTotalAndVirtual(reco)
  });
};
const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null
})

const form = reactive({
  teamNameEn: "",
  teamNameLocal: "",
  countryImgUrl: null,
})

const formRules = reactive({
  teamNameEn: [required(t('message.validateTeamNameEnRequired'))],
  teamNameLocal: [required(t('message.validateTeamNameLocalRequired'))],
  countryImgUrl: [required(t('message.validateCountryImageRequired'))],
});

const page = reactive({
  pages: 0,
  records: [],
})

function changePage(page) {
  request.current = page
  loadTeamVotesSettings()
}
const totalVirtualVote = ref()
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
  if (value.totalVotesVirtual) {
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
    uiControl.dialogTitle = t('fields.createVote')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

const route = useRoute()
// const router = useRouter()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
})
onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
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

/* eslint-disable no-alert */
<template>
  <div class="roles-main">
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      custom-class="dialog400"
      width="90%"
    >
      <el-form
        ref="memberTagForm"
        :model="form"
        :rules="formRules"
        @submit.prevent
      >
        <el-form-item :label="t('fields.memberTag')" prop="description">
          <el-input v-model="form.description" :placeholder="t('fields.memberTagDescription')" />
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ $t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit()">
          {{ $t('fields.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <div class="header-back-container">
        <div class="back">
          <el-link @click="$router.go(-1)">
            <i class="el-icon-arrow-left" />
            {{ $t('fields.back') }}
          </el-link>
        </div>
      </div>
      <div class="header-container">
        <div class="search">
          <div>
            <el-button
              size="normal"
              type="success"
              icon="el-icon-circle-plus"
              @click="showDialog('CREATE')"
            >
              {{ t('fields.createTag') }}
            </el-button>
          </div>
        </div>
      </div>
      <table class="custom-table" cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.sequence') }}</th>
            <th scope="col">{{ t('fields.memberTag') }}</th>
            <th scope="col">{{ t('fields.memberAmount') }}</th>
            <th scope="col">{{ t('fields.operate') }}</th>
          </tr>
        </thead>
        <tbody v-if="tagList.records.length > 0">
          <tr v-for="(tag, index) in tagList.records" :key="tag.id">
            <td :data-label="t('fields.sequence')">{{ index + 1 }}</td>
            <td :data-label="t('fields.memberTag')">{{ tag.description }}</td>
            <td :data-label="t('fields.memberAmount')">{{ tag.totalMember }}</td>
            <td :data-label="t('fields.operate')">
              <div>
                <el-button size="small" type="primary" plain @click="showEdit(tag)">{{ t('fields.edit') }}</el-button>
                <el-button size="small" type="danger" @click="deleteTag(tag)">{{ t('fields.delete') }}</el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="tagList.records.length === 0">
        <emptyComp />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import {
  getAffiliateTagList,
  createAffiliateTag,
  editAffiliateTag,
  deleteAffiliateTag,
} from '../../../../api/affiliate-tag'
import { required, size } from '../../../../utils/validate'
import emptyComp from '@/components/empty'

const { t } = useI18n()
const store = useStore()
const memberTagForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
  dialogType: '',
})

const form = reactive({
  id: null,
  description: null,
})

const formRules = reactive({
  description: [
    required(t('message.validateTagDescriptionRequired')),
    size(1, 10, t('message.validateTagDescriptionLength'))
  ],
})

const tagList = reactive({
  records: [],
  loading: false,
})

async function loadAllTag() {
  tagList.loading = true
  uiControl.dialogVisible = false
  const { data: ret } = await getAffiliateTagList(store.state.user.id)
  tagList.records = ret
  tagList.loading = false
}

function showEdit(tag) {
  showDialog('EDIT')
  if (!tag) {
    tag = tagList.records[0]
  }
  nextTick(() => {
    for (const key in tag) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = tag[key]
      }
    }
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (memberTagForm.value) {
      memberTagForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.createTag')
  } else {
    uiControl.dialogTitle = t('fields.editTag')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function deleteTag(tag) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteAffiliateTag(tag.id)
    await loadAllTag()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function submit() {
  memberTagForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.dialogType === 'CREATE') {
        await createAffiliateTag(store.state.user.id, form.description)
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      } else {
        const selectedTag = tagList.records.filter(i => i.id === form.id)
        if (form.description !== selectedTag[0].description) {
          await editAffiliateTag(form.id, store.state.user.id, form.description)
        }
        ElMessage({ message: t('message.editSuccess'), type: 'success' })
      }
      await loadAllTag()
    }
  })
}

onMounted(async () => {
  await loadAllTag()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.back {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 40px;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
<style>
.dialog400 {
  max-width: 400px;
}
</style>

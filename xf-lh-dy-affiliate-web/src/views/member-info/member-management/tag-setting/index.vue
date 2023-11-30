/* eslint-disable no-alert */
<template>
  <div class="roles-main">
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
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
              size="mini"
              type="success"
              icon="el-icon-circle-plus"
              @click="showDialog('CREATE')"
            >
              {{ t('fields.createTag') }}
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        size="mini"
        :resizable="true"
        :data="tagList.records"
        row-key="id"
        :empty-text="t('fields.noData')"
        v-loading="tagList.loading"
      >
        <el-table-column
          :label="t('fields.sequence')"
          align="left"
          min-width="120"
        >
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="t('fields.memberTag')"
          align="left"
          min-width="120"
        />
        <el-table-column
          prop="totalMember"
          :label="t('fields.memberAmount')"
          align="left"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="230"
        >
          <template #default="scope">
            <el-button size="mini" type="success" @click="showEdit(scope.row)">
              {{ t('fields.edit') }}
            </el-button>
            <el-button size="mini" type="danger" @click="deleteTag(scope.row)">
              {{ t('fields.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  justify-content: flex-end;
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

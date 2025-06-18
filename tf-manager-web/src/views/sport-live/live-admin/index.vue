<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-right: 10px"
          :placeholder="t('fields.account')"
        />
        <el-button icon="el-icon-search" size="mini" type="success" @click="loadAdmin">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="500px">
      <el-form
        v-if="uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item :label="t('fields.account')" prop="loginName">
          <el-input v-model="form.loginName" maxlength="100" />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.password')" prop="password">
          <el-input v-model="form.password" type="password" show-password maxlength="100" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-model="changePasswordDialog.visible"
      :title="t('fields.updatePassword')"
      width="500px"
    >
      <el-form :model="changePasswordDialog.form" :rules="changePasswordRules" ref="changePasswordRef" label-width="100px">
        <el-form-item :label="t('fields.newPassword')" prop="newPassword">
          <el-input v-model="changePasswordDialog.form.newPassword" type="password" />
        </el-form-item>
        <el-form-item :label="t('fields.confirmPassword')" prop="confirmPassword">
          <el-input v-model="changePasswordDialog.form.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changePasswordDialog.visible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submitChangePassword">{{ t('fields.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="loginName" :label="t('fields.account')" />
      <el-table-column prop="siteId" :label="t('fields.site')" />
      <el-table-column :label="t('fields.operate')" align="right" width="120">
        <template #default="scope">
          <div>
            <el-button
              icon="el-icon-key"
              size="mini"
              type="info"
              style="margin-bottom: 4px"
              @click="showChangePasswordDialog(scope.row)"
            >
              {{ t('fields.updatePassword') }}
            </el-button>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              style="margin-bottom: 4px"
              @click="showDialog('EDIT', scope.row)"
            >
              {{ t('fields.edit') }}
            </el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteAdmin(scope.row.id)"
            >
              {{ t('fields.delete') }}
            </el-button>
          </div>
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
import { reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAdmins, createAdmin, updateAdmin, deleteAdminById } from '@/api/sport-live';
import { required, size } from '@/utils/validate';

const { t } = useI18n();
const store = useStore();

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE'
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  loginName: null
});

const form = reactive({
  id: null,
  loginName: null,
  password: null,
  siteId: store.state.user.siteId
});

const formRef = ref(null);

function resetQuery() {
  request.loginName = null;
  loadAdmin();
}

const changePasswordDialog = reactive({
  visible: false,
  userId: null,
  form: {
    newPassword: '',
    confirmPassword: ''
  }
});

const changePasswordRef = ref(null);

function showChangePasswordDialog(row) {
  changePasswordDialog.userId = row.id;
  changePasswordDialog.form.newPassword = '';
  changePasswordDialog.form.confirmPassword = '';
  changePasswordDialog.visible = true;
}

const changePasswordRules = {
  newPassword: [
    required(t('message.validatePasswordRequired')),
    size(6, 20, t('message.validatePasswordSize'))
  ],
  confirmPassword: [
    required(t('message.validatePasswordRequired')),
    size(6, 20, t('message.validatePasswordSize')),
    {
      validator: (rule, value, callback) => {
        if (value !== changePasswordDialog.form.newPassword) {
          callback(new Error(t('message.passwordNotMatch')));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

async function submitChangePassword() {
  await changePasswordRef.value.validate(async (valid) => {
    if (!valid) return;
    await updateAdmin({
      id: changePasswordDialog.userId,
      password: changePasswordDialog.form.newPassword
    });
    ElMessage.success(t('message.updateSuccess'));
    changePasswordDialog.visible = false;
    await loadAdmin();
  });
}

function showDialog(type, row = null) {
  uiControl.dialogType = type;
  uiControl.dialogTitle = type === 'CREATE' ? t('fields.add') : t('fields.edit');
  uiControl.dialogVisible = true;

  if (type === 'EDIT' && row) {
    Object.assign(form, row);
  } else {
    Object.assign(form, {
      id: null,
      loginName: null,
      password: null,
      siteId: store.state.user.siteId
    });
  }
}

function submit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    if (uiControl.dialogType === 'CREATE') {
      await createAdmin(form);
    } else {
      await updateAdmin(form);
    }
    uiControl.dialogVisible = false;
    ElMessage.success(t('message.success'));
    loadAdmin();
  });
}

async function deleteAdmin(id) {
  await ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning'
  });
  await deleteAdminById(id);
  ElMessage.success(t('message.success'));
  await loadAdmin();
}

async function loadAdmin() {
  page.loading = true;
  const { data: ret } = await getAdmins(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(pageNo) {
  request.current = pageNo;
  loadAdmin();
}

const formRules = reactive({
  loginName: [required(t('message.validateLoginNameRequired')), size(6, 20, t('message.validateLoginNameSize'))],
  password: [
    {
      required: uiControl.dialogType === 'CREATE',
      message: t('message.validatePasswordRequired'),
      trigger: 'blur'
    },
    size(6, 20, t('message.validatePasswordSize'))
  ]
});

onMounted(() => {
  loadAdmin();
});
</script>

<style scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-button
          :native-type="'button'"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="loadList()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>

    <el-dialog :title="ui.dialogTitle" v-model="ui.dialogVisible" width="700px" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
        <el-form-item :label="t('fields.sensitiveWord')" prop="word">
          <el-input v-model="form.word" maxlength="255" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false"> {{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit"> {{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-table :data="page.records" stripe v-loading="page.loading" size="small" style="margin-top: 10px">
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="word" :label="t('fields.sensitiveWord')" />
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
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="showDialog('EDIT', scope.row)"> {{ t('fields.edit') }}</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)"> {{ t('fields.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :current-page="request.current"
      :page-size="request.size"
      :total="page.total"
      @current-change="changePage"
    />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getSensitiveWord, addSensitiveWord, updateSensitiveWord, deleteSensitiveWord } from '@/api/sport-live-sensitive-word';
import { useStore } from "@/store";

const { t } = useI18n();
const store = useStore()
const request = reactive({
  siteId: '',
  size: 10,
  current: 1
});

const page = reactive({
  total: 0,
  records: [],
  loading: false
});

const form = reactive({
  id: null,
  word: ''
});

const ui = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE'
});

const formRef = ref();

const rules = {
  word: [{ required: true, message: t('message.inputSensitiveWords'), trigger: 'blur' }]
};

async function loadList() {
  page.loading = true;
  request.siteId = store.state.user.siteId
  await getSensitiveWord({ siteId: request.siteId, size: request.size, current: request.current }).then(res => {
    page.records = res.data.records;
    page.total = res.data.total;
    page.loading = false;
  });
}

onMounted(async () => {
  await loadList();
});

function showDialog(type, row = null) {
  ui.dialogType = type;
  ui.dialogVisible = true;
  if (type === 'EDIT' && row) {
    form.id = row.id;
    form.word = row.word;
  } else {
    form.id = null;
    form.word = '';
  }
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    const payload = { siteId: request.siteId, word: form.word };
    if (ui.dialogType === 'EDIT') {
      payload.id = form.id;
      payload.siteId = store.state.user.siteId;
      updateSensitiveWord(payload).then(() => {
        ElMessage.success(t('message.updateSuccess'));
        ui.dialogVisible = false;
        loadList();
      });
    } else {
      payload.siteId = store.state.user.siteId;
      addSensitiveWord(payload).then(() => {
        ElMessage({ message: t('message.addSuccess'), type: "success" });
        ui.dialogVisible = false;
        loadList();
      });
    }
  });
}

function handleDelete(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), '', { type: 'warning' }).then(() => {
    request.siteId = store.state.user.siteId
    deleteSensitiveWord({ siteId: request.siteId, id: id }).then(() => {
      ElMessage.success(t("message.deleteSuccess"));
      loadList();
    });
  });
}

function changePage(pageNo) {
  request.current = pageNo;
  loadList();
}
</script>

<style scoped>
.roles-main {
  padding: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search {
  display: flex;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

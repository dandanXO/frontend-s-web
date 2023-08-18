<template>
  <div class="header-container">
    <div class="search">
      <el-input v-model="request.jobName" size="small" style="width: 200px;" :placeholder="t('fields.jobName')" />
      <el-select
        clearable
        v-model="request.state"
        size="small"
        :placeholder="t('fields.state')"
        class="filter-item"
        style="width: 120px;margin-left: 5px"
      >
        <el-option
          v-for="item in uiControl.state"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
        />
      </el-select>
      <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadJobs">
        {{ t('fields.search') }}
      </el-button>
      <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
        {{ t('fields.reset') }}
      </el-button>
    </div>
    <div class="btn-group">
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
        {{ t('fields.add') }}
      </el-button>
      <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit()" :disabled="uiControl.editBtn">
        {{ t('fields.edit') }}
      </el-button>
      <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeJob()"
                 :disabled="uiControl.removeBtn"
      >
        {{ t('fields.delete') }}
      </el-button>
    </div>
  </div>
  <el-table :data="page.records" ref="table" style="margin-top: 15px"
            row-key="id"
            size="small"
            highlight-current-row
            @selection-change="handleSelectionChange"
            :empty-text="t('fields.noData')"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="jobName" :label="t('fields.jobName')" />
    <el-table-column prop="beanName" :label="t('fields.beanName')" />
    <el-table-column prop="cronExpression" :label="t('fields.cronExpression')" />
    <el-table-column prop="state" :label="t('fields.state')">
      <template #default="scope">
        <el-tag v-if="scope.row.state === 1" type="success">RUN</el-tag>
        <el-tag v-if="scope.row.state === 0" type="danger">STOP</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createBy" :label="t('fields.createBy')" />
    <el-table-column prop="createTime" :label="t('fields.createTime')" />
    <el-table-column :label="t('fields.operate')">
      <template #default="scope">
        <el-link type="primary" @click="showEdit(scope.row)" style="margin-right: 10px">{{ t('fields.edit') }}</el-link>
        <el-link v-if="scope.row.state === 0" type="success" @click="runScheduleJob(scope.row.id)" style="margin-right: 10px">{{ t('fields.run') }}</el-link>
        <el-link v-if="scope.row.state === 1" type="warning" @click="stopScheduleJob(scope.row.id)" style="margin-right: 10px">{{ t('fields.pause') }}</el-link>
        <el-link type="danger" @click="removeJob(scope.row)">{{ t('fields.delete') }}</el-link>
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
  <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="700px">
    <el-form ref="jobForm" :model="scheduleForm" :rules="formRules" :inline="true" size="small" label-width="150px">
      <el-form-item :label="t('fields.jobName')" prop="jobName">
        <el-input v-model="scheduleForm.jobName"
                  style="width: 350px;"
        />
      </el-form-item>
      <el-form-item :label="t('fields.beanName')" prop="beanName">
        <el-input v-model="scheduleForm.beanName" style="width: 350px;" @blur="populateParam" />
      </el-form-item>
      <el-form-item :label="t('fields.param')" prop="params">
        <!-- <el-input v-model="scheduleForm.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in param" :key="index">
          <el-input style="width: 170px; margin-top: 5px;" v-model="item.key" :disabled="disableKey(item.key)" /> : <el-input style="width: 170px " v-model="item.value" />
          <el-button v-if="index === param.length - 1" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam()" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-else-if="!disableKey(item.key)" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="t('fields.cronExpression')" prop="cronExpression">
        <el-input v-model="scheduleForm.cronExpression" style="width: 350px;" />
      </el-form-item>
      <el-form-item :label="t('fields.state')" prop="state">
        <el-radio-group
          v-model="scheduleForm.state"
          class="form-input"
          style="width: 350px;"
        >
          <el-radio v-for="s in uiControl.state" :label="s.key" :key="s.key">{{ s.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('fields.stopAfterFailure')" prop="stopAfterFailure">
        <el-radio-group v-model="scheduleForm.stopAfterFailure" style="width: 350px;">
          <el-radio
            v-for="s in uiControl.stopAfterFailure"
            :key="s.key"
            :label="s.key"
          >{{ s.value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('fields.description')" prop="description">
        <el-input type="textarea" :rows="4" v-model="scheduleForm.description" style="width: 350px;" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createJob, getAllJob, updateJob, deleteJob, runJob, stopJob } from "../../../api/schedule";
import { useI18n } from "vue-i18n";
import moment from "moment";

const { t } = useI18n();
const jobForm = ref(null);
const param = ref([]);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  state: [
    { key: 1, displayName: "Run", value: "RUN" },
    { key: 0, displayName: "Stop", value: "STOP" }
  ],
  stopAfterFailure: [
    { key: true, value: "YES" },
    { key: false, value: "NO" },
  ]
});
const request = reactive({
  size: 30,
  current: 1,
  jobName: null,
  state: null
});
const page = reactive({
  pages: 0,
  records: []
});
const scheduleForm = reactive({
  id: null,
  jobName: null,
  beanName: null,
  params: null,
  cronExpression: null,
  state: 2,
  stopAfterFailure: true,
  description: ""
});

const formRules = reactive({
  jobName: [required(t('message.validateJobNameRequired'))],
  beanName: [required(t('message.validateBeanNameRequired'))],
  cronExpression: [required(t('message.validateCronExpressionRequired')), {
    pattern: "^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$",
    message: t('message.validateCronExpressionFormat')
  }],
  state: [required(t('message.validateStateRequired'))],
  stopAfterFailure: [required(t('message.validateStopAfterFailureRequired'))]
});

let chooseJob = [];

function resetQuery() {
  request.jobName = null;
  request.state = null;
}

function handleSelectionChange(val) {
  chooseJob = val;
  if (chooseJob.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseJob.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadJobs() {
  const { data: ret } = await getAllJob(request);
  page.pages = ret.pages;
  page.records = ret.records;
}

function showDialog(type) {
  if (type === "CREATE") {
    if (jobForm.value) {
      jobForm.value.resetFields();
    }
    param.value = [];
    addParam();
    scheduleForm.id = null;
    uiControl.dialogTitle = t('fields.addJob');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editJob');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(job) {
  showDialog("EDIT");
  if (!job) {
    job = chooseJob[0];
  }
  nextTick(() => {
    for (const key in job) {
      if (Object.keys(scheduleForm).find(k => k === key)) {
        scheduleForm[key] = job[key];
      }
    }

    param.value = [];
    if (scheduleForm.params) {
      Object.entries(JSON.parse(scheduleForm.params)).forEach(([key, value]) => {
        const json = {};
        json.key = key;
        json.value = value;
        param.value.push(json);
      })
      addParam();
    }
  });
}

function create() {
  jobForm.value.validate(async (valid) => {
    if (valid) {
      scheduleForm.params = constructParam();
      await createJob(scheduleForm);
      uiControl.dialogVisible = false;
      await loadJobs();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  jobForm.value.validate(async (valid) => {
    if (valid) {
      scheduleForm.params = constructParam();
      await updateJob(scheduleForm);
      uiControl.dialogVisible = false;
      await loadJobs();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeJob(job) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (job) {
      await deleteJob([job.id]);
    } else {
      await deleteJob(chooseJob.map(u => u.id));
    }
    await loadJobs();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

async function stopScheduleJob(id) {
  await stopJob(id);
  await loadJobs();
}

async function runScheduleJob(id) {
  await runJob(id);
  await loadJobs();
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

function populateParam() {
  if (uiControl.dialogType === "CREATE" && scheduleForm.beanName === 'gameBetRecordFetchTask') {
    param.value = [
      { key: "barrierCondition", value: 960000 },
      { key: "maxPeriod", value: 900000 },
      { key: "minInterval", value: 300000 },
      { key: "minPeriod", value: 180000 },
      { key: "nextGetBetStartTime", value: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss') },
      { key: "nextGetBetEndTime", value: moment(new Date()).startOf('day').add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss') },
      { key: "nextGetBetIndex", value: 1 },
      { key: "lastGetBetIndex", value: 1 },
      { key: "nextGetBetPage", value: 1 },
      { key: "platformAccountId", value: 0 },
      { key: "", value: "" }
    ];
  }
}

function addParam() {
  param.value.push({
    key: "",
    value: ""
  })
}

function delParam(index) {
  param.value.splice(index, 1);
}

function constructParam() {
  const json = {};
  Object.values(param.value).forEach((item) => {
    if (item.key) {
      json[item.key] = item.value;
    }
  });
  return JSON.stringify(json);
}

function disableKey(key) {
  return scheduleForm.beanName === 'gameBetRecordFetchTask' &&
  (key === 'barrierCondition' || key === 'maxPeriod' || key === 'minInterval' || key === 'minPeriod' || key === 'nextGetBetEndTime' ||
  key === 'nextGetBetIndex' || key === 'lastGetBetIndex' || key === 'nextGetBetStartTime' || key === 'platformAccountId' || key === 'nextGetBetPage')
}

function changePage(page) {
  request.current = page;
  loadJobs();
}

onMounted(() => {
  loadJobs();
});

</script>

<style scoped>

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

</style>

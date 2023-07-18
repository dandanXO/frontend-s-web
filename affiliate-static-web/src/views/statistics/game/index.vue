<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Game Stats') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-date-picker
          v-model="dateRange"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          class="input-small"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <div class="btn-grp">
          <el-button icon="el-icon-search" type="primary" @click="loadGameStats()" size="mini">
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="dateRange=[]">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane :label="t('fields.affiliate')" name="affiliate">
          <AffiliateTab ref="aForm" :aff-id="id" :date="dateRange" />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.member')" name="member">
          <MemberTab ref="mForm" :aff-id="id" :date="dateRange" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/store";
import moment from "moment";
import { useI18n } from "vue-i18n";
import AffiliateTab from "./affiliate/index.vue";
import MemberTab from "./member/index.vue";

const store = useStore();
const { t } = useI18n();
const activeName = ref('affiliate');
const id = ref(store.state.user.id);
const aForm = ref();
const mForm = ref();
const defaultDate = convertDate(new Date());
const dateRange = ref([defaultDate, defaultDate]);

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').format('x'));
      end.setTime(moment(end).subtract(1, 'days').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('isoWeek').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
      end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
      return [start, end];
    }
  }
];

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

function loadGameStats() {
  aForm.value.loadAffiliateSummary();
  mForm.value.loadMemberSummary();
}
</script>

<style rel="stylesheet/scss" lang="scss">
.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
    &.el-range-editor--small.el-input__inner {
      max-width: unset;
    }
    }
  }
}
</style>

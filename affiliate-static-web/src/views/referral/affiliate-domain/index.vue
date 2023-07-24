<template>
  <div class="roles-main">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.domainAffiliate') }}</span>
        </div>
      </template>
      <div class="card-panel-description">
        <div class="card-panel-link-text">{{ $t('fields.domainWeb') }}</div>
        <span v-for="item in webDomain" :key="item">
          <el-row>
            <span class="domain">{{ item }}</span>
            <el-button
              class="copy-btn"
              icon="el-icon-copy-document"
              size="mini"
              type="primary"
              @click="copy(item, 'PC')"
              :disabled="webDomain.length < 1"
            >
              {{ $t('fields.copy') }}
            </el-button>
          </el-row>
        </span>
      </div>

      <div class="card-panel-description">
        <div class="card-panel-link-text">{{ $t('fields.domainApp') }}</div>
        <span v-for="item in appDomain" :key="item">
          <el-row>
            <span class="domain">{{ item }}</span>
            <el-button
              class="copy-btn"
              icon="el-icon-copy-document"
              size="mini"
              type="primary"
              @click="copy(item, 'MOBILE')"
              :disabled="appDomain.length < 1"
            >
              {{ $t('fields.copy') }}
            </el-button>
          </el-row>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted, ref } from '@vue/runtime-core'
import { getAffiliateDomain } from "../../../api/affiliate";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const webDomain = ref([]);
const appDomain = ref([]);

async function loadAffiliateDomain() {
  const { data: aff } = await getAffiliateDomain(store.state.user.id);
  aff.forEach(a => {
    if (a.way === 'PC') {
      webDomain.value.push(a.domain);
    } else if (a.way === 'MOBILE') {
      appDomain.value.push(a.domain);
    }
  })
}

function copy(text, type) {
  navigator.clipboard.writeText(text);
  if (type === 'PC') {
    ElMessage({ message: t('message.domainWebCopied'), type: "success" });
  } else if (type === 'MOBILE') {
    ElMessage({ message: t('message.domainAppCopied'), type: "success" });
  }
};

onMounted(() => {
  loadAffiliateDomain();
})
</script>

<style scoped>

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.domain {
  border: solid;
  width: 400px;
  font-size: 16px;
  height: 28px;
  border-radius: 5px;
  color: var(--el-text-color-regular);
  border-width: 1px;
  padding: 5px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 25px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 20px;
  margin-right: 20px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.copy-btn {
  height: 28px;
  margin-left: 10px;
  margin-bottom: 20px;
}
</style>

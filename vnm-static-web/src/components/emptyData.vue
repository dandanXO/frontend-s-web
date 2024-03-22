<template>
<div>
<el-empty :description="t('common.noRecordFound')" :image-size="100" :image="Empty" />
</div>
</template>

<script setup id="emptyData">
import Empty from '../assets/images/common/empty.png'
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>
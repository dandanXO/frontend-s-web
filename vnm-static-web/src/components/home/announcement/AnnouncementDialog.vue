<template>
    <div class="notice-header">
        {{ $t("home.announcementList") }}
        <div @click="props.closeAnnouncementDialog">
            <img src="../../../assets//home/announcement/close-btn.png" />
        </div>
    </div>

    <div>
        <el-tabs type="card" class="announcement-tabs" v-model="props.announcementActive">
            <el-tab-pane v-for="(tab, ind) in props.announcementTypes" :key="tab.id" :tab="ind" :label="tab.name"
                :name="tab.name">
                <el-collapse accordion v-model="typeActive">
                    <template v-for="(ann, idx) in props.announcementList" :key="idx">
                        <template v-if="ann.typeId === tab.id">
                            <el-collapse-item :name="idx" :title="ann.title" class="announcement-content">
                                <p class="announcement-p">{{ ann.content }}</p>
                            </el-collapse-item>
                        </template>
                    </template>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref } from "vue";

const typeActive = ref("");

const props = defineProps(['closeAnnouncementDialog', 'announcementList', 'announcementTypes', 'announcementActive'])
</script>

<style scoped lang="scss">
.notice-header {
    color: #468cff;
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: left;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.announcement-tabs {
    width: 100%;
}

.announcement-content {
    color: #7a80a1;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: left;
    max-width: 1150px;
    height: auto;
    margin-top: 20px;
    padding: 0px 10px;

    .announcement-p {
        color: #7a80a1;
    }
}
</style>
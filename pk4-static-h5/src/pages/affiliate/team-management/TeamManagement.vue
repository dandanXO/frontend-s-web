<template>
    <div class="team-management-container">
        <div class="header">
            <div class="username">
                <img src="../../../assets/images/affiliate/team-management/username-icon.png" />
                <div>{{ store.nickName }}</div>
            </div>
            <div class="filter">
                <div class="filter-value">All subordinates</div>
                <img src="../../../assets/images/affiliate/team-management/filter-icon.png" />
            </div>
        </div>

        <InputField :isDark="true">
            <template #input>
                <q-input class="input" v-model="formDetail.realName" outlined clearable hide-bottom-space>
                    <template v-slot:append>
                        <q-btn class="confirm-btn" color="primary" :label="$t('btn.confirm')" @click="() => { }" />
                    </template>
                </q-input>
            </template>
        </InputField>

        <div class="detailed-stats panel bordered" v-for="record, index in page.records" :key="index">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-management/green-icon.png" />
                    <img src="../../../assets/images/affiliate/team-management/avatar-group-icon.png" />
                    <span>{{ record.nickName }}</span>
                </div>
                <div class="vip">{{ record.vip }}</div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <!-- <div class="num">4362</div> -->
                    </div>
                    <div class="label">Net amount receives</div>
                    <div class="value">{{ record.myCommission }}</div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">Last login time</div>
                    <div class="value">{{ record.lastLoginTime }}</div>
                </div>
                <div class="row">
                    <div class="label">Registration date</div>
                    <div class="value">{{ record.regTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive, onMounted } from 'vue';
import { api } from 'boot/axios';
import { userStore } from 'src/stores';

const store = userStore();

const formDetail = reactive([]);

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
});

onMounted(() => {
    api.get('/session/affiliate/downline-simple-list', {
        params: {
            current: 1,
            size: 50
        }
    }).then((res) => {
        const data = res.data;
        page.records = data.records;
    })
})
</script>

<style lang="scss" scoped>
.team-management-container {
    display: flex;
    flex-direction: column;
}

.dropdown,
.input {
    margin-bottom: 10px;
}

.dropdown {
    width: 70%;
}

.separator {
    border: 0.97px solid #FFFFFF1A;
}

.header {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 15px;
    line-height: 11px;
    letter-spacing: 0px;
    margin-bottom: 15px;

    .username {
        display: flex;
        align-items: center;

        > * {
            margin-right: 10px;
        }
    }

    .filter {
        display: flex;
        align-items: center;

        .filter-value {
            color: #B2BDBF;
            font-weight: 400;
            font-size: 12px;
            line-height: 100%;

        }

        > * {
            margin-left: 10px;
        }
    }

    .group {
        display: flex;
        align-items: center;

        >* {
            margin-right: 18px;
        }
    }

    .vip {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 8px;
        background-color: #413729;
        color: #FBAB1B;
    }
}

.detailed-stats {
    margin-top: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;
    padding: 10px;



    .row {
        display: flex;
        justify-content: space-between;
        font-weight: 400;
        font-size: 13px;
        line-height: 15px;
        letter-spacing: 0px;
        color: #B2BDBF;
        width: 100%;
        margin-bottom: 10px;

        .icon,
        .label,
        .value {
            display: flex;
            align-items: center;
        }

        .icon {
            width: 15%;
            justify-content: center;

            .num {
                background-color: #49283A;
                color: #FF3434;
                padding: 2px 5px;
                border-radius: 20px;
            }
        }

        .label {
            width: 55%;
            text-align: left;
        }

        .value {
            width: 30%;
            text-align: right;
            justify-content: flex-end;
        }
    }
}

.info {
    margin-top: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;

    .card-desc {
        text-align: center;
        margin: 15px 10px;
    }

    .card-title {
        background: url("../../../assets/images/earn-money/panel-header-bg.png") center center no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 14px;
        line-height: 15px;
        vertical-align: middle;
        text-transform: uppercase;
        text-align: center;
        padding: 10px 40px;
        width: fit-content;
        margin: -13px auto 0px auto;
    }

    .card-table {
        text-align: center;
        font-family: "Manrope", sans-serif;
        font-size: 10px;
        color: #000;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        thead {
            th {
                color: #ffffff80;
                font-weight: 700;
                font-size: 12px;
                min-width: 100px;
            }
        }

        tbody {
            td {
                color: #fff;
                padding: 10px 4px;
                font-size: 12px;
            }

            tr {
                &:nth-child(odd) {
                    background: #ffffff0d;
                }
            }
        }
    }
}

.confirm-btn {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    box-shadow: 0px 0.5px 2px 0px #0667D599;
    min-width: 100px;
    max-width: 120px;
    font-weight: bold;
}
</style>
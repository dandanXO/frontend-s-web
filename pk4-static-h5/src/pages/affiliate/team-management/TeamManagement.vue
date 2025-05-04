<template>
    <div class="my-dividend-container">
        <div class="header">
            <div class="username">
                <img src="../../../assets/images/affiliate/team-management/username-icon.png" />
                <div>Happy888</div>
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
                        <q-btn class="get-code-btn" color="primary" :label="$t('btn.confirm')" @click="() => { }" />
                    </template>
                </q-input>
            </template>
        </InputField>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-management/green-icon.png" />
                    <img src="../../../assets/images/affiliate/team-management/avatar-group-icon.png" />
                    <span>Happy888(self)</span>
                </div>
                <div class="vip">VIP 0</div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <div class="num">4362</div>
                    </div>
                    <div class="label">Net amount receives</div>
                    <div class="value">5,500.07</div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">Last login time</div>
                    <div class="value">2025-04-28 10:46:23</div>
                </div>
                <div class="row">
                    <div class="label">Registration date</div>
                    <div class="value">2023-01-15 05:44:28</div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-management/gray-icon.png" />
                    <img src="../../../assets/images/affiliate/team-management/avatar-icon.png" />
                    <span>Rhiana1234</span>
                </div>
                <div class="vip">VIP 0.5</div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <!-- <div class="num">4362</div> -->
                    </div>
                    <div class="label">banlance: 0.40</div>
                    <div class="value"></div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">Last login time</div>
                    <div class="value">2025-04-28 10:46:23</div>
                </div>
                <div class="row">
                    <div class="label">Registration date</div>
                    <div class="value">2023-01-15 05:44:28</div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-management/gray-icon.png" />
                    <img src="../../../assets/images/affiliate/team-management/avatar-icon.png" />
                    <span>Iriesdm</span>
                </div>
                <div class="vip">VIP 0.5</div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <!-- <div class="num">4362</div> -->
                    </div>
                    <div class="label">banlance: 0.00</div>
                    <div class="value"></div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">Last login time</div>
                    <div class="value">2025-04-28 10:46:23</div>
                </div>
                <div class="row">
                    <div class="label">Registration date</div>
                    <div class="value">2023-01-15 05:44:28</div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-management/gray-icon.png" />
                    <img src="../../../assets/images/affiliate/team-management/avatar-icon.png" />
                    <span>Joh1984</span>
                </div>
                <div class="vip">VIP 0</div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <!-- <div class="num">4362</div> -->
                    </div>
                    <div class="label">banlance: 0.95</div>
                    <div class="value"></div>
                </div>
                <hr class="separator" />
                <div class="row">
                    <div class="label">Last login time</div>
                    <div class="value">2025-04-28 10:46:23</div>
                </div>
                <div class="row">
                    <div class="label">Registration date</div>
                    <div class="value">2023-01-15 05:44:28</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive } from 'vue';

const formDetail = reactive([]);
const model = ref('Consolidated Weekly');
const options = ref(['Consolidated Weekly']);

</script>

<style lang="scss" scoped>
.my-dividend-container {
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

.get-code-btn {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    box-shadow: 0px 0.5px 2px 0px #0667D599;
    min-width: 100px;
    max-width: 120px;
    font-weight: bold;
}
</style>
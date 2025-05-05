<template>
    <div class="my-dividend-container">

        <div class="tabs">
            <div class="tab-item" :class="{ active: selectedTab === 'All' }" @click="selectedTab = 'All'">All</div>
            <div class="tab-item" :class="{ active: selectedTab === 'Slot' }" @click="selectedTab = 'Slot'">Slot</div>
            <div class="tab-item" :class="{ active: selectedTab === 'Live' }" @click="selectedTab = 'Live'">Live</div>
            <div class="tab-item" :class="{ active: selectedTab === 'Fish' }" @click="selectedTab = 'Fish'">Fish</div>
            <div class="tab-item" :class="{ active: selectedTab === 'Poker' }" @click="selectedTab = 'Poker'">Poker</div>
        </div>

        <div class="filter">
            <InputField :isDark="true">
                <template #input>
                    <q-input class="input" v-model="formDetail.realName" outlined clearable hide-bottom-space>
                        <template v-slot:append>
                            <q-btn class="get-code-btn" color="primary" :label="$t('btn.confirm')" @click="() => { }" />
                        </template>
                    </q-input>
                </template>
            </InputField>
        </div>

        <div class="date-filter filter">
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="model" :options="options" dense :display-value="'Types'" />
                </template>
            </InputField>
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="model" :options="options" dense :display-value="'Vendors'" />
                </template>
            </InputField>
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="model" :options="options" dense  :display-value="'Date'"/>
                </template>
            </InputField>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-betting/jili-logo.png" />
                    <span>/solt</span>
                </div>
                <div class="link">zakkur2005</div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Super Ace</div>
                        <div class="value green-text">6 Rounds</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value red-text">117</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value blue-text">-48.20</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-betting/jili-logo.png" />
                    <span>/solt</span>
                </div>
                <div class="link">zakkur2005</div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Super Ace</div>
                        <div class="value green-text">6 Rounds</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value red-text">117</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value blue-text">-48.20</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <img src="../../../assets/images/affiliate/team-betting/jili-logo.png" />
                    <span>/solt</span>
                </div>
                <div class="link">zakkur2005</div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Super Ace</div>
                        <div class="value green-text">6 Rounds</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value red-text">117</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value blue-text">-48.20</div>
                    </div>
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
const selectedTab = ref('All');

</script>

<style lang="scss" scoped>
.date-filter {
    :deep(.landing-input) {
        width: 33%;

        .dropdown {
            width: 95%;
        }
    }
}

.filter {
    :deep(.landing-input) {
        width: 100%;
    }
}

.tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .tab-item {
        padding: 2px 20px;
        border-radius: 20px;

        &.active {
            text-align: center;
            background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        }
    }
}

.filter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .datetime-dropdown {
        color: #FFFFFF80;
    }
}

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
    align-items: center;
    font-weight: 700;
    font-size: 15px;
    line-height: 11px;
    letter-spacing: 0px;
    margin-bottom: 15px;

    .username {
        display: flex;
        align-items: center;

        >* {
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

        >* {
            margin-left: 10px;
        }
    }

    .group {
        display: flex;
        align-items: center;

        >* {
            margin-right: 10px;
        }
    }

    .link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 8px;
        background-color: #42392A;
        color: #FBAB1B;
    }
}

.detailed-stats {
    margin-bottom: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;
    padding: 10px;


    .col {
        display: flex;
        justify-content: space-between;

        .col-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .label {
                font-weight: 400;
                font-size: 13px;
                line-height: 15px;
                letter-spacing: 0px;
                color: #B2BDBF;
                width: 100%;
                margin-bottom: 10px;
            }

            .red-text {
                color: #EF2121;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .blue-text {
                color: #218FEF;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .green-text {
                color: #21EF89;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }
        }
    }

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
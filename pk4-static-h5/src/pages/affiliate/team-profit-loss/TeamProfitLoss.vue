<template>
    <div class="my-dividend-container">

        <div class="tabs">
            <div class="tab-item" :class="{active: selectedTab === 'All'}" @click="selectedTab = 'All'">All</div>
            <div class="tab-item" :class="{active: selectedTab === 'Slot'}" @click="selectedTab = 'Slot'">Slot</div>
            <div class="tab-item" :class="{active: selectedTab === 'Live'}" @click="selectedTab = 'Live'">Live</div>
            <div class="tab-item" :class="{active: selectedTab === 'Fish'}" @click="selectedTab = 'Fish'">Fish</div>
            <div class="tab-item" :class="{active: selectedTab === 'Poker'}" @click="selectedTab = 'Poker'">Poker</div>
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

        <q-btn class="datetime-dropdown" @click="() => {}" flat unelevated>
            Today&nbsp;
            <q-icon class="forward-icon" name="keyboard_arrow_down" size="small" />
          </q-btn>
        </div>

        <div class="header">
            <div class="username">
                <img src="../../../assets/images/affiliate/team-management/username-icon.png" />
                <div>Happy888</div>
            </div>
            <div style="color: #21EF89;">Total: 3</div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <span>Happy888</span>
                </div>
                <div class="link">direct player 0 ></div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="row">
                    <div class="label">Deposit</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Withdrawal</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Bonus</div>
                    <div class="value">-</div>
                </div>
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value valid-bet">-1475.50</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value win-loss">-1418.17</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Profit and Loss</div>
                        <div class="value profit-loss">57.33</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <span>vip56567</span>
                </div>
                <div style="visibility: hidden;" class="link">direct player 0 ></div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="row">
                    <div class="label">Deposit</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Withdrawal</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Bonus</div>
                    <div class="value">-</div>
                </div>
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value valid-bet">-1475.50</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value win-loss">-1418.17</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Profit and Loss</div>
                        <div class="value profit-loss">57.33</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div class="group">
                    <span>Happy888</span>
                </div>
                <div style="visibility: hidden;" class="link">direct player 0 ></div>
            </div>

            <div class="stats">
                <hr class="separator" />
                <div class="row">
                    <div class="label">Deposit</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Withdrawal</div>
                    <div class="value">0.00</div>
                </div>
                <div class="row">
                    <div class="label">Bonus</div>
                    <div class="value">-</div>
                </div>
                <hr class="separator" />
                <div class="col">
                    <div class="col-item">
                        <div class="label">Valid Bet</div>
                        <div class="value valid-bet">-1475.50</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Win/Loss</div>
                        <div class="value win-loss">-1418.17</div>
                    </div>
                    <div class="col-item">
                        <div class="label">Profit and Loss</div>
                        <div class="value profit-loss">57.33</div>
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
            margin-right: 18px;
        }
    }

    .link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 8px;
        background-color: #252C46;
        color: #fff;
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

            .valid-bet {
                color: #EF2121;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .win-loss {
                color: #218FEF;
                font-weight: 700;
                font-size: 14px;
                line-height: 14px;
            }

            .profit-loss {
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
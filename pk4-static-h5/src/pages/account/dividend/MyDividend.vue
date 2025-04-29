<template>
    <div class="my-dividend-container">
        <InputField :isDark="true">
            <template #input>
                <q-select class="dropdown" outlined v-model="model" :options="options" dense />
            </template>
        </InputField>

        <InputField :isDark="true" >
            <template #input>
                <q-input class="input" v-model="formDetail.realName" outlined clearable hide-bottom-space>
                    <template v-slot:append>
                        <q-btn class="get-code-btn" color="primary" :label="$t('btn.confirm')" @click="() => { }" />
                    </template>
                </q-input>
            </template>
        </InputField>

        <div class="info panel bordered">
            <div class="card-title">Weekly</div>

            <div class="card-desc">Poker,slot,sports,live,fish,e-lottery - weekly</div>

            <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%"
                style="text-align: center">
                <thead>
                    <tr>
                        <th>{{ $t("dividend.activeMember") }}</th>
                        <th>{{ $t("dividend.dividendRate") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background:#0665D3">
                        <td>3</td>
                        <td>45%</td>
                    </tr>
                    <tr>
                        <td colspan="2">excluded vendors：DS88，Lottery</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="detailed-stats panel bordered">
            <div class="header">
                <div>2025/04/27-2025/05/03</div>
                <div class="collapse">
                    <span>Current</span>
                    <img class="collapse-icon" src="../../../assets/images/account/dividend/collapse-icon.png" />
                </div>
            </div>

            <div class="stats">
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Net amount receives</div>
                    <div class="value">5,500.07</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Status</div>
                    <div class="value">-</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Active member</div>
                    <div class="value">26</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Period valid bet</div>
                    <div class="value">269,284.42</div>
                </div>
                <hr class="separator"/>
                <div class="row">
                    <div class="icon">
                        <img src="../../../assets/images/account/dividend/expand-icon.png" />
                    </div>
                    <div class="label">Period P&L</div>
                    <div class="value">17,263.54</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <img src="../../../assets/images/account/dividend/expand-icon.png" />
                    </div>
                    <div class="label">Period settled P&L</div>
                    <div class="value">17,263.54</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <img src="../../../assets/images/account/dividend/expand-icon.png" />
                    </div>
                    <div class="label">Dividend amount</div>
                    <div class="value">7,768.59</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Downline dividends to pay</div>
                    <div class="value">2,268.52</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Net amount receives</div>
                    <div class="value">5,500.07</div>
                </div>
                <div class="row">
                    <div class="icon">
                        <!-- <img src="../../../assets/images/account/dividend/expand-icon.png" /> -->
                    </div>
                    <div class="label">Disbursement time</div>
                    <div class="value">-</div>
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

.dropdown, .input {
    margin-bottom: 10px;
}

.dropdown {
    width: 70%;
}

.separator {
    border: 0.97px solid #FFFFFF1A;
}

.detailed-stats {
    margin-top: 26px;
    border-radius: 10px;
    border: 1px solid #FFFFFF1A;
    padding: 20px 10px;

    .header {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 15px;
        line-height: 11px;
        letter-spacing: 0px;
        margin-bottom: 15px;

        .collapse {
            display: flex;
            align-items: center;

            .collapse-icon {
                margin-left: 10px;
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

        .icon, .label, .value {
            display: flex;
            align-items: center;
        }

        .icon {
            width: 7%;
            justify-content: center;
        }

        .label {
            width: 60%;
            text-align: left;
        }

        .value {
            width: 33%;
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
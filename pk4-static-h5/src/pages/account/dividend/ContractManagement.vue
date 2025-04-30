<template>
    <div class="my-dividend-container">

        <div class="filters">
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="model" :options="options" dense />
                </template>
            </InputField>
            &nbsp;&nbsp;
            <InputField :isDark="true">
                <template #input>
                    <q-select class="dropdown" outlined v-model="model2" :options="options2" dense />
                </template>
            </InputField>
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

        <div class="info panel bordered">
            <table class="card-table" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="text-align: center">
                <tbody>
                    <tr>
                        <td><img src="../../../assets/images/account/dividend/avatar-icon.png" /></td>
                        <td class="user">May2288</td>
                        <td class="create-contract-btn">create contract</td>
                    </tr>
                    <tr>
                        <td><img src="../../../assets/images/account/dividend/avatar-icon.png" /></td>
                        <td class="user">Sihai</td>
                        <td class="create-contract-btn">create contract</td>
                    </tr>
                    <tr>
                        <td><img src="../../../assets/images/account/dividend/avatar-icon.png" /></td>
                        <td class="user">May2288</td>
                        <td class="create-contract-btn">create contract</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import InputField from 'src/components/auth/InputField.vue';
import { ref, reactive } from 'vue';

const formDetail = reactive([]);
const model = ref('Consolidated Weekly');
const options = ref(['Consolidated Weekly']);
const model2 = ref('Not Signed');
const options2 = ref(['Not Signed']);

</script>

<style lang="scss" scoped>
.my-dividend-container {
    display: flex;
    flex-direction: column;
}

.filters {
    display: flex;
    justify-content: space-between;
}

.dropdown,
.input {
    margin-bottom: 10px;
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

        .icon,
        .label,
        .value {
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

                &.user {
                    text-align: left;
                }

                &.create-contract-btn {
                    color: #FF9500;
                    font-weight: 700;
                    text-align: right;
                    padding-right: 10px;
                }
            }

            tr {
                &:nth-child(odd) {
                    background: #ffffff0d;
                }

                &:nth-child(even) {
                    background:#0665D3;
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
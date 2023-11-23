<template>
    <div>
        <q-dialog v-model="isCastVoteModalVisible" :title="castVoteFormData.teamName" width="100%" align-center
            style="max-width: 800px" @close="toggleCastVoteModal(false)">
            <q-card style="width: 100%">
                <!-- <el-form :rules="castVoteFormValidationRules" ref="castVoteFormRef" style="padding: 20px;"
                    :model="castVoteFormData">
                    <el-form-item prop="votes" label="投票数量" :label-width="formLabelWidth">
                        <el-input v-model="castVoteFormData.votes" type="number" min="1" max="10" />
                    </el-form-item>
                    <div style="text-align: center">
                        <el-button class="common-btn grey" color="#ff0000" @click="castVoteFormData.votes = '1'">
                            重置
                        </el-button>
                        <el-button :loading="isSubmitting" class="common-btn" @click.prevent="submit(castVoteFormRef)">
                            提交
                        </el-button>
                    </div>
                </el-form> -->
                <q-form class="rounded-borders" ref="castVoteFormRef" id="vote-form">
                    <div class="vote-form-header">
                        <span>{{ castVoteFormData.teamName }}</span>
                        <div>
                            <button type="button" class="close-btn" @click="toggleCastVoteModal(false)">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                    </div>
                    <div class="vote-form-content">
                        <span><span class="text-red">*&nbsp;</span>投票数量:</span>

                        <q-input class="vote-input" standout bg-color="white" hide-bottom-space type="number" ref="voteRef"
                            v-model="castVoteFormData.votes" :rules="castVoteValidationRules" label-color="" />

                        <button type="submit" class="vote-btn" @click.prevent="submit">提交</button>
                    </div>

                </q-form>
            </q-card>
        </q-dialog>

        <div class="center-numbers">
            <!--<div class="center-title">总奖金</div>-->
            <div id="prizePool" class="center-number">
                {{ votesData.award }}
            </div>
        </div>
        <div class="countries-wrapper pattern-wrapper">
            <div class="pattern-wrapper-bottom"></div>
            <div class="point">为你喜欢的战队投票，票数越高，竞猜成功之后，奖金越高哦！</div>
            <div class="right-count">我的选票数量: <span id="myVotes">{{ votesData.myVotes }}</span></div>
            <div class="country-list" id="countrylist">
                <div id="btn_1" class="country-item" v-for="votesListItem in votesData.votesList" :key="votesListItem.id">
                    <div class="country-item-bottom-pattern"></div>
                    <div class="c-flag"><img :src="votesListItem.countryImgUrl">
                    </div>
                    <div class="c-name">{{ votesListItem.teamNameEn }}</div>
                    <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
                    <div class="c-button" @click="castVote({
                        teamId: votesListItem.id,
                        teamName: votesListItem.teamNameEn
                    })">投票</div>
                </div>
            </div>
        </div>
        <div class="table-details pattern-wrapper">
            <div class="pattern-wrapper-bottom"></div>
            <table id="rankTable">
                <thead>
                    <tr>
                        <td>队伍名称 </td>
                        <td>投票次数 </td>
                        <td>投票时间 </td>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <!-- <div id="table-pagination"></div> -->

            <div class="listing-footer">
                <div class="footer-div">
                    <span class="pointer-s prev-page">&nbsp;&lt;&nbsp;&nbsp;</span>
                    <div class="footer-page">
                        <span id="record_page">1/1</span>
                    </div>
                    <span class="pointer-s next-page">&nbsp;&nbsp;&gt;&nbsp;</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { onMounted, ref, defineComponent, reactive } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "../../../api/promotion/poolPrizeVote";
import { useQuasar } from "quasar";

export default defineComponent({
    name: "PrizePoolVotePromo",
    components: {
    },
    setup() {
        var qs = require("qs");
        const allowedVoteRangeRule = (val) => {
            return /^(\b([1-9]|10)\b)$/.test(val) || '投票数量只能输入1-10之内的数字'
        }
        const castVoteValidationRules = [
            allowedVoteRangeRule
        ]
        const $q = useQuasar();
        const voteRef = ref(null);
        const castVoteFormRef = ref();
        const isSubmitting = ref(false);
        const isCastVoteModalVisible = ref(false);
        const castVoteFormData = reactive({
            teamId: undefined,
            teamName: '',
            votes: '1'
        })
        const votesData = ref({
            award: 0,
            myVotes: 0,
            votesList: [],
            votesRecord: [],
        });
        const castVote = ({ teamId, teamName }) => {
            toggleCastVoteModal(true)
            castVoteFormData.teamId = teamId
            castVoteFormData.teamName = teamName
        }
        const toggleCastVoteModal = (status) => {
            if (status === true) {
                castVoteFormData.teamId = undefined;
                castVoteFormData.teamName = '';
                castVoteFormData.votes = '1';
            }

            isCastVoteModalVisible.value = status;
        }
        const submit = async () => {
            voteRef.value.validate();

            if (voteRef.value.hasError) {
                return;
            }

            if (Number(castVoteFormData.votes) > votesData.value.myVotes) {
                $q.notify({
                    color: "negative",
                    position: "top",
                    message: "选票数量不足",
                    icon: "report_problem"
                });
                return;
            }

            isSubmitting.value = true;
            const params = {
                teamId: castVoteFormData.teamId,
                votes: Number(castVoteFormData.votes)
            }
            const res = await poolPrizeCastVote(qs.stringify(params));

            if (res.code === 0) {
                $q.notify({
                    color: "positive",
                    position: "top",
                    message: "成功",
                    icon: "check_circle_outline"
                });
            }

            isSubmitting.value = false;
        }

        onMounted(() => {
            poolPrizeVoteInit().then((res) => {
                votesData.value = res.data;
            });
        })



        return {
            votesData,
            isCastVoteModalVisible,
            castVoteFormData,
            castVoteValidationRules,
            castVoteFormRef,
            castVote,
            submit,
            voteRef
        }
    }
});




</script>

<style scoped lang="scss">
.center-numbers {
    position: relative;
    background: url("../../../assets/images/promotion/hotpromo/prizePoolVote/topboard_new_0930.png") no-repeat center center;
    background-size: contain;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Arial';
}

.center-numbers .center-title {
    padding-top: 10px;
    font-size: 25px;
    line-height: 30px;
    font-weight: bold;
    color: #fff;
    margin-left: 30px;
}

.center-numbers .center-number {
    font-size: 25px;
    line-height: 30px;
    font-weight: bold;
    color: #fff;
    margin-top: 40px;
    /* margin-left: 30px; */
}

.countries-wrapper {
    background-color: #f7f7f7;
    border-radius: 30px;
    border: solid 1px #53abff;
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    position: relative;
}

.pattern-wrapper:before,
.pattern-wrapper:after,
.pattern-wrapper-bottom:before,
.pattern-wrapper-bottom:after {
    background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 14px 14px;
    content: "";
    width: 14px;
    height: 14px;
    display: inline-block;
    position: absolute;
}

.pattern-wrapper:before {
    transform: rotateZ(0deg);
    top: 0;
    left: 0;
}

.pattern-wrapper:after {
    transform: rotateZ(90deg);
    top: 0;
    right: 0;
}

.pattern-wrapper-bottom:before {
    transform: rotateZ(270deg);
    bottom: 0;
    left: 0;
}

.pattern-wrapper-bottom:after {
    transform: rotateZ(180deg);
    bottom: 0;
    right: 0;
}

.countries-wrapper .point {
    color: #232323;
}

/* .countries-wrapper .point:before {
    content: "";
    width: 8px;
    height: 8px;
    display: inline-block;
    transform: rotateZ(45deg);
    margin-right: 10px;
    background-color: #ffffff;
} */
.countries-wrapper .right-count {
    text-align: right;
    color: #232323;
    margin-top: -25px;
    font-weight: normal;
}

.countries-wrapper .country-list {
    display: grid;
    gap: 10px;
    padding: 10px 0;
    grid-template-columns: repeat(3, 1fr);
}

.countries-wrapper .country-list .country-item:before,
.countries-wrapper .country-list .country-item:after,
.countries-wrapper .country-list .country-item .country-item-bottom-pattern:before,
.countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
    background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 12px 12px;
    content: "";
    width: 12px;
    height: 12px;
    display: inline-block;
    position: absolute;
}

.countries-wrapper .country-list .country-item:before {
    transform: rotateZ(0deg);
    top: 0;
    left: 0;
}

.countries-wrapper .country-list .country-item:after {
    transform: rotateZ(90deg);
    top: 0;
    right: 0;
}

.countries-wrapper .country-list .country-item .country-item-bottom-pattern:before {
    transform: rotateZ(270deg);
    bottom: 0;
    left: 0;
}

.countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
    transform: rotateZ(180deg);
    bottom: 0;
    right: 0;
}

.countries-wrapper .country-list .country-item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background: #DDEEFF;
    padding: 10px;
    overflow: hidden;
    position: relative;
}

.countries-wrapper .country-list .country-item:hover .c-button {
    background: #2b5b6c;
    color: #fff;
}

.countries-wrapper .country-list .country-item .c-flag {
    background: #eeeee4;
    border: 3px solid #53ABFF;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.countries-wrapper .country-list .country-item .c-flag img {
    max-width: 100%;
    max-height: 100%;
    /* border: 1px solid #d4c164; */
}

.countries-wrapper .country-list .country-item .c-name {
    padding: 5px;
    color: #232323;
    font-size: 12px;
    font-weight: bold;
}

.countries-wrapper .country-list .country-item .c-price {
    background: #ffffff;
    color: #11131F;
    font-size: 10px;
    font-weight: normal;
    padding: 0 5px;
    border-left: 2px solid #53ABFF;
    border-right: 2px solid #53ABFF;
    width: 100%;
    text-align: center;
    padding: 5px 5px 2px;
}

.countries-wrapper .country-list .country-item .c-button {
    border: 2px solid #22578b;
    padding: 2px 10px;
    border-radius: 20px;
    display: block;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #22578b;
    font-size: 10px;
    line-height: 16px;
}

.table-details {
    background-color: #f7f7f7;
    border-radius: 30px;
    border: solid 1px #53abff;
    max-width: 1298px;
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
    position: relative;
}

.table-details table {
    width: 100%;
}

.table-details table thead {
    border-bottom: 1px solid #232323;
}

.table-details table thead td {
    text-align: center;
    color: #232323;
    padding: 10px;
}

.table-details table tbody {
    border-bottom: 1px solid #232323;
}

.table-details table tbody td {
    color: #232323;
    padding: 10px;
    text-align: center;
    font-weight: normal;
}

.footer-div {
    color: #232323;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
}

#vote-form {
    display: flex;
    flex-direction: column;

    .vote-form-header {
        padding: 15px;
        border-bottom: 1px solid #e5e5e5;
        display: inline-block;
        font-weight: 700;
        color: #2b5b6c;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .close-btn {
            cursor: pointer;
            background: none;
            border: none;
            float: right;
            font-size: 21px;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            filter: alpha(opacity=20);
            opacity: .2;
        }
    }

    .vote-form-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .vote-btn {
        padding: 10px 20px;
        border: 0;
        background-image: linear-gradient(90deg, #00cdc1 0%, #2b5b6c 100%), linear-gradient(#2b5b6c, #2b5b6c);
        box-shadow: 0px 3px 4px 0px rgba(13, 110, 200, 0.29);
        border-radius: 8px;
        font-size: 16px;
        color: #fff;
        line-height: .7rem;
        text-align: center;
        cursor: pointer;
        width: fit-content;
    }

    .vote-btn:hover {
        background-image: linear-gradient(90deg, #2b5b6c 0%, #2b5b6c 100%), linear-gradient(#2b5b6c, #2b5b6c);
    }
}


.custom-modal-header h5 {
    display: inline-block;
    font-weight: bold;
    color: #2b5b6c;
}

.modal-content {
    width: 95%;
}

.modal.in .modal-dialog {
    width: 100%;
}
</style>

<style lang="scss">
#vote-form {
    .q-field {
        width: 100%;
    }

    .q-field .q-field__control {
        border: 1px solid #d7d7d7;
        color: black;
        background-color: #fff;
        width: 100%;
    }

    input.q-field__native {
        color: #000;
    }
}
</style>
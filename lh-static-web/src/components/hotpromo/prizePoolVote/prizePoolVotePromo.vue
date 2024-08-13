<template>
    <div>

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
                <div id="btn_1" class="country-item" v-for="votesListItem in votesData.votesList">
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
                    <tr class="table-row">
                        <td colspan="3">暂无数据</td>
                    </tr>
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

        <el-dialog align-center v-model="isCastVoteModalVisible" :title="castVoteFormData.teamName" width="500">
            <el-form :rules="castVoteFormValidationRules" ref="castVoteFormRef" style="padding: 20px;"
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
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { onMounted, ref, defineComponent, reactive } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "@/api/promotion/poolPrizeVote";
import { useNotify } from "@/hooks/notify";
const notify = useNotify();

export default defineComponent({
    name: "PrizePoolVotePromo",
    components: {
    },
    setup() {
        const castVoteFormValidationRules = {
            votes: [
                {
                    required: true,
                    message: "请输入投票数量",
                    trigger: "blur",
                },
                {
                    pattern: "^([1-9]|1[0])$",
                    message: "投票数量只能输入1-10之内的数字",
                    trigger: "blur",
                },
            ],
        }
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
            isCastVoteModalVisible.value = true;
            castVoteFormData.teamId = teamId
            castVoteFormData.teamName = teamName
        }
        const submit = async (elForm) => {
            if (!elForm) return

            await elForm.validate(async (valid) => {
                if (Number(castVoteFormData.votes) > votesData.value.myVotes) {
                    notify.error({
                        type: "error",
                        message: "选票数量不足"
                    })
                    return;
                }
                if (valid) {
                    isSubmitting.value = true;
                    const params = {
                        teamId: castVoteFormData.teamId,
                        votes: Number(castVoteFormData.votes)
                    }
                    const res = await poolPrizeCastVote(params);

                    if (res.code === 0) {
                        notify.success({
                            type: "success",
                            message: "success"
                        })
                    } else {
                        notify.error(res.message)
                    }

                    isSubmitting.value = false;
                }
            })
        }

        onMounted(() => {
            if (!store.token) {
                // notify({
                // message: "请登录后操作",
                // type: "error"
                // });
                return;
            }
            poolPrizeVoteInit().then((res) => {
                votesData.value = res.data;
            });
        })



        return {
            votesData,
            isCastVoteModalVisible,
            castVoteFormData,
            castVoteFormValidationRules,
            castVoteFormRef,
            castVote,
            submit
        }
    }
});




</script>

<style scoped lang="scss">
.center-numbers {
    margin: 0px auto;
    position: relative;
    background: url("../../../assets/images/promotion/hotpromo/prizePoolVote/topboard_new_0930.png") no-repeat center center;
    background-size: contain;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Arial';
    padding-top: 82px;
}

.center-numbers .center-title {
    margin-left: 60px;
    font-size: 72px;
    line-height: 72px;
    font-weight: bold;
    color: #fff;
}

.center-numbers .center-number {
    margin-left: 6px;
    font-size: 72px;
    line-height: 80px;
    font-weight: bold;
    color: #fff;
}

.countries-wrapper {
    background-color: #f7f7f7;
    border-radius: 30px;
    border: 1px solid #53abff;
    max-width: 1298px;
    margin: 50px auto;
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
    position: relative;
}

.countries-wrapper .point {
    color: #232323;
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

.countries-wrapper .right-count {
    text-align: right;
    color: #232323;
    margin-top: -25px;
    font-weight: normal;
}

.countries-wrapper .country-list {
    display: grid;
    gap: 10px;
    padding: 10px;
    grid-template-columns: repeat(8, 1fr);
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

.countries-wrapper .country-list .country-item:hover .c-button {
    background-color: #ffffff;
    border-radius: 10px;
    color: #498BCB;
}

.countries-wrapper .country-list .country-item .c-flag {
    background: #eeeee4;
    border: 5px solid #53ABFF;
    border-radius: 50%;
    height: 80px;
    width: 80px;
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
    padding: 5px 0;
    color: #232323;
}

.countries-wrapper .country-list .country-item .c-price {
    background: #ffffff;
    color: #11131F;
    font-size: 14px;
    font-weight: normal;
    border-left: 2px solid #53ABFF;
    border-right: 2px solid #53ABFF;
    width: 100%;
    text-align: center;
}

.countries-wrapper .country-list .country-item .c-button {
    border: 2px solid #22578b;
    padding: 2px 0px;
    border-radius: 20px;
    display: block;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #22578b;
    line-height: 16px;
    transition: 0.3s all;
}

.table-details {
    background-color: #f7f7f7;
    border-radius: 30px;
    border: 1px solid #53abff;
    margin: 50px auto;
    max-width: 1298px;
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px auto;
    color: #232323;
}
</style>

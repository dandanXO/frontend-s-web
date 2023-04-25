<template>
  <div>
    <div class="center-numbers">
      <div class="center-title">โบนัสรวม</div>
      <div class="center-number">
        {{ prizePool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
      </div>
    </div>
    <div class="countries-wrapper">
      <div class="point">
        เลือกทีมโปรดของคุณยิ่งคุณได้รับคะแนนโหวดมากเท่าไหร่
        ยิ่งมีสิทธิ์ได้ลุ้นรับรางวัลมากขึ้น
      </div>
      <div class="right-count">
        โหวตของฉัน: <span>{{ myVotes }}</span>
      </div>
      <div class="country-list" id="countrylist">
        <div
          v-for="(country, i) in countriesList"
          :key="i"
          class="country-item"
          @click="voteModal(country)"
        >
          <div class="c-flag">
            <img
              v-if="country.countryImgUrl"
              :src="`${imgURL}${country.countryImgUrl}`"
            />
          </div>
          <div class="c-name">{{ country.teamNameLocal }}</div>
          <div class="c-price">{{ country.totalVotes }} โหวด</div>
          <div class="c-button">โหวด</div>
        </div>
      </div>
    </div>
    <div class="table-details">
      <a-table
        :columns="tableColumns.votesRecord"
        :data-source="dataSource"
        :row-key="(record) => record.teamVotesId"
        :loading="loading"
        :pagination="pagination"
      >
        <template #teamVotesId="{ text, record }">
          {{ getCountryName(text, record) }}
          <!-- <span>{{ getCountryName(text) }}</span> -->
        </template>
      </a-table>
    </div>

    <a-modal class="votesm" v-model:visible="voteModalVisible" centered>
      <div>
        <div class="game-title sub">{{ selectedCountry }}</div>
        <span class="img-item">
          <div class="inner-contents">
            <a-form ref="formRef" :model="voteForm" :rules="votingRules">
              <a-form-item ref="voteCount" name="voteCount">
                <a-input
                  type="number"
                  placeholder="จํานวนคะแนนเสียง"
                  v-model:value="voteForm.voteCount"
                />
              </a-form-item>
              <a-button
                :loading="btnLoading"
                @click="submitVotes"
                class="common-btn vote-submit"
                >ส่ง</a-button
              >
            </a-form>
          </div>
        </span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { message } from "ant-design-vue";
import { defineComponent, ref, reactive, onMounted } from "vue";
import { getSJBList, postVote } from "../../../api/index/promo";
import moment from "moment";

export default defineComponent({
  name: "SJBPromo",
  setup() {
    const imgURL = process.env.VUE_APP_IMAGE_CDN + "/";
    const btnLoading = ref(false);
    const loading = ref(true);
    const pagination = reactive({
      pageSize: 5,
      total: 5,
    });
    const prizePool = ref("");
    const tableColumns = {
      votesRecord: [
        {
          title: "ชื่อทีม",
          dataIndex: "teamVotesId",
          slots: { customRender: "teamVotesId" },
        },
        {
          title: "จํานวนคะแนนเสียง",
          dataIndex: "votes",
        },
        {
          title: "เวลาโหวต",
          dataIndex: "voteTime",
        },
      ],
    };
    const dataSource = [];
    // const recordPage = (pagination) => {
    //   searchForm[recordActive.value].current = pagination.current;
    // };
    const selectedCountry = ref(null);
    const selectedTeamId = ref();
    const countriesList = ref([]);
    const myVotes = ref("");
    const voteModalVisible = ref(false);
    const voteModal = (ctry) => {
      voteModalVisible.value = true;
      selectedCountry.value = ctry.teamNameLocal;
      voteForm.voteCount = null;
      voteForm.teamId = ctry.id;
    };
    const loadCountryList = () => {
      dataSource.value = [];
      getSJBList().then((res) => {
        if (res.code === 0) {
          prizePool.value = res.data.award;
          countriesList.value = res.data.votesList;
          myVotes.value = res.data.myVotes;
          dataSource.push(...res.data.votesRecord);
          pagination.total = res.data.votesRecord.length;
          loading.value = false;
        }
      });
    };
    const formRef = ref();
    const voteForm = reactive([
      {
        voteCount: 0,
        teamId: null,
      },
    ]);
    const submitVotes = () => {
      formRef.value.validate().then(() => {
        btnLoading.value = true;
        if (myVotes.value > 0) {
          postVote(voteForm)
            .then((res) => {
              console.log(res);
              message.success("Success", 4);
              countriesList.value.forEach((element) => {
                if (Number(element.id) === Number(voteForm.teamId)) {
                  if (myVotes.value >= voteForm.voteCount) {
                    element.totalVotes =
                      Number(element.totalVotes) + Number(voteForm.voteCount);
                    myVotes.value =
                      Number(myVotes.value) - Number(voteForm.voteCount);
                    const obj = {
                      teamVotesId: voteForm.teamId,
                      votes: voteForm.voteCount,
                      voteTime: moment(new Date()).format(
                        "YYYY/MM/DD, hh:mm A"
                      ),
                    };
                    dataSource.push(obj);
                  }
                }
              });
              voteModalVisible.value = false;
              btnLoading.value = false;
            })
            .catch((err) => {
              console.log(err);
              btnLoading.value = false;
            });
        } else {
          btnLoading.value = false;
          message.error("You don't have enough votes.", 4);
        }
      });
    };
    const votingRules = {
      voteCount: [
        {
          required: true,
          message: "Please enter the number you want to vote for.",
          trigger: "blur",
        },
        {
          min: 1,
          message: "The number you wish to vote must be an integer.",
        },
      ],
    };
    onMounted(() => {
      loadCountryList();
    });

    const getCountryName = (text) => {
      let teamNameEquivalent = countriesList.value.find(
        (ctry) => ctry.id === text
      );

      if (teamNameEquivalent && teamNameEquivalent.teamNameLocal) {
        return teamNameEquivalent.teamNameLocal;
      }
    };
    return {
      prizePool,
      dataSource,
      tableColumns,
      // recordPage,
      pagination,
      countriesList,
      loading,
      voteModal,
      voteModalVisible,
      selectedCountry,
      voteForm,
      submitVotes,
      myVotes,
      formRef,
      votingRules,
      loadCountryList,
      selectedTeamId,
      btnLoading,
      getCountryName,
      imgURL,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.ant-table-content) {
  min-width: 400px;
}
.votesm .vote-submit {
  margin: 20px auto 0;
  display: block;
}
.center-numbers {
  margin: 20px auto;
  gap: 20px;
  position: relative;
  background: url("../../../assets/images/promotion/hotpromo/40/fifa.png")
    no-repeat center center;
  background-size: contain;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Arial";
  .center-title {
    padding-top: 40px;
    font-size: 36px;
    color: #ffffff;
    font-weight: bold;
  }
  .center-number {
    font-size: 72px;
    line-height: 80px;
    font-weight: bold;
    color: #ffffff;
  }
}
.countries-wrapper {
  font-family: "Arial";
  background-color: #290315;
  border-radius: 10px;
  border: solid 1px #a81538;
  max-width: 1298px;
  margin: 50px auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  .point {
    color: #ffffff;
    &:before {
      content: "";
      width: 8px;
      height: 8px;
      display: inline-block;
      transform: rotateZ(45deg);
      margin-right: 10px;
      background-color: #ff004c;
    }
  }
  .right-count {
    text-align: right;
    color: #ffffff;
    margin-top: -25px;
    font-weight: normal;
  }
  .country-list {
    display: flex;
    gap: 30px;
    padding: 20px 0;
    flex-wrap: wrap;
    justify-content: flex-start;
    .country-item {
      width: 130px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px;
      background: #ffffff;
      padding: 10px;
      border-radius: 10px;
      overflow: hidden;
      &:hover {
        .c-button {
          background: #a81538;
          color: #ffffff;
        }
      }
      .c-flag {
        background: #eeeee4;
        padding: 10px;
        border-radius: 10px;
        height: 60px;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 100%;
          max-height: 100%;
          border: 1px solid #d4c164;
        }
      }
      .c-name {
        padding: 5px 0;
        color: #a81538;
      }
      .c-price {
        background: #eeeee4;
        color: #000000;
        font-size: 14px;
        font-weight: normal;
        padding: 0 5px;
        border-left: 2px solid #d4c164;
        border-right: 2px solid #d4c164;
        width: 100%;
        text-align: center;
      }
      .c-button {
        border: 2px solid #a81538;
        padding: 2px 10px;
        border-radius: 20px;
        display: block;
        margin-top: 10px;
        width: 100%;
        text-align: center;
        color: #a81538;
        line-height: 16px;
      }
    }
  }
}
.table-details {
  font-family: "Arial";
  background-color: #290315;
  border-radius: 10px;
  border: solid 1px #a81538;
  max-width: 1298px;
  margin: 50px auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  table {
    width: 100%;

    thead {
      border-bottom: 1px solid #ffffff;
      td {
        text-align: center;
        color: #ffffff;
        padding: 10px;
      }
    }
    tbody {
      border-bottom: 1px solid #ffffff;
      td {
        color: #ffffff;
        padding: 10px;
        text-align: center;
        font-weight: normal;
      }
    }
  }
}
@media (max-width: 768px) {
}
</style>

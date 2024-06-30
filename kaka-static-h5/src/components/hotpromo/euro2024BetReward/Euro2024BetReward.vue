<template>
  <div class="container">
    <div class="euro2024Bet">
      <div class="section-title">
        <img class="decor" src="../../../assets/images/promo/hotpromo/eurocup24/section-title-decor-left.svg" />
        <span>BÙNG NỔ CUP CHÂU ÂU 2024</span>
        <img class="decor" src="../../../assets/images/promo/hotpromo/eurocup24/section-title-decor-right.svg" />
      </div>
      <div class="moneyBg" @click="postClaimSummon">
        <div class="moneyText">
          <div>NHẬN THƯỞNG</div>
          <div class="money">{{ betMoney }} VNDP</div>
          <div>MỖI NGÀY</div>
        </div>
        <img src="../../../assets/promo/vnm-euro-2024-bet-reward/moneyBg.png" alt="" />
        <div class="btnText" >Nhận ngay</div>
      </div>

    </div>
    <div class="wrapper border">
      <div class="section-title">
        <img class="decor" src="../../../assets/images/promo/hotpromo/eurocup24/section-title-decor-left.svg" />
        <span>Quy tắc hoạt động</span>
        <img class="decor" src="../../../assets/images/promo/hotpromo/eurocup24/section-title-decor-right.svg" />
      </div>

      <div class="bullet-points">
        <div class="point">
          <div class="blue-hexagon">Thời gian</div>
          <div>Chương trình khuyến mãi bắt đầu từ ngày 15/06/2024 – 15/07/2024</div>
        </div>

        <div class="point">
          <div class="blue-hexagon">Áp dụng</div>
          <div>Cho tất cả các thành viên của TF88</div>
        </div>

        <div class="point">
          <div class="blue-hexagon">Sản phẩm</div>
          <div>Tất cả các trận đấu của giải bóng đá CUP Châu Âu 2024</div>
        </div>
      </div>

      <div class="section-wrapper border">
        <div class="title">
          <div class="title-prefix" />
          Chi tiết khuyến mãi
        </div>
        <div class="content">
          Mỗi ngày Thành Viên tham gia cược tại các trận đấu của giải bóng đá vô địch Châu Âu 2024 và đạt số tiền đặt
          cược hợp lệ từ 1,800 VNDP, Thành Viên sẽ nhận được tiền thưởng lên đến 6,888 VNDP, chi tiết như sau
        </div>
        <div class="table">
          <table class="table">
            <tr>
              <th>Số tiền đặt cược hợp lệ</th>
              <th>Số Tiền Thưởng</th>
              <th>Vòng cược yêu cầu</th>
            </tr>

            <tr>
              <td>≥1,800 VNDP</td>
              <td>28 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥3,800 VNDP</td>
              <td>68 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥10,800 VNDP</td>
              <td>138 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥38,000 VNDP</td>
              <td>588 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥108,000 VNDP</td>
              <td>1,188 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥280,000 VNDP</td>
              <td>3,888 VNDP</td>
              <td>3</td>
            </tr>
            <tr>
              <td>≥580,000 VNDP</td>
              <td>6,888 VNDP</td>
              <td>3</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="section-wrapper border">
        <div class="title">
          <div class="title-prefix" />
          Ví Dụ
        </div>
        <div class="content">
          Từ 00:00:00 đến 23:59:59 ngày 15/06/2024, thành viên có tổng doanh thu cược tại giải bóng đá vô địch Châu Âu
          2024 là 4,000 VNDP thì Thành Viên sẽ nhận được tiền thưởng là 68 VNDP vào ngày 16/06/2004 và tiền thưởng này
          cần cược 3 vòng trước khi có thể rút tiền.
        </div>
      </div>
      <div class="section-wrapper border">
        <div class="title">
          <div class="title-prefix" />
          Cách thức tham gia
        </div>
        <div class="content">
          Thành viên cần tham gia đặt cược tại các trận đấu thuộc giải bóng đá vô địch Châu Âu 2024, sau khi hoàn thành
          doanh thu cược, vào ngày hôm sau, Thành Viên cần đến trang khuyến mãi này để yêu cần nhận thưởng.
        </div>
      </div>

      <div class="section-wrapper border">
        <div class="title">
          <div class="title-prefix" />
          Điều khoản và điều kiện
        </div>
        <div class="content">
          <ol>
            <li>
              Mỗi ngày Thành Viên đều có thể tham gia khuyến mãi này khi hoàn thành doanh thu cược của ngày hôm trước.
            </li>
            <li>Thành Viên có thể đến trang khuyến mãi này để yêu cầu nhận thưởng sau 5AM mỗi ngày.</li>
            <li>Tiền thưởng cần trải qua 3 vòng cược tại Thể Thao trước khi có thể rút tiền</li>
            <li>
              Nếu TF88 kiểm tra thấy mỗi thành viên, mỗi địa chỉ email, mỗi số điện thoại sử dụng cùng một tài khoản
              ngân hàng hoặc trùng địa chỉ IP thì chỉ có một tài khoản được nhận tiền thưởng của Khuyến mãi này (nếu có
              nhiều thông đồng hoặc sử dụng nhiều tài khoản thì tất cả tiền thắng cược sẽ bị mất).
            </li>
            <li>
              Nếu TF88 phát hiện thành viên liên tục đăng ký tài khoản, lợi dụng sơ hở của trò chơi hoặc cố ý vi phạm,
              TF88 có quyền hủy hoặc rút lại tiền thưởng của Thành viên.
            </li>
            <li>
              Tất cả cược HÒA, cược HỦY, cược 2 BÊN, vé cược đặt tại tỷ lệ cược: DEC {{ "<" }} 1.75, MY -0.6 đến 0.75,
              Thể thao ảo, Đua ngựa, Number Game sẽ không được áp dụng cho chương trình này.
            </li>
            <li>
              Các tài khoản có cùng IP hoặc thông tin dữ liệu tương tự sẽ không được tham gia chương trình khuyến mãi
              này.
            </li>
            <li>Chương trình không thể kết hợp cùng các khuyến mãi nạp khác tại TF88.</li>
            <li>
              TF88 có quyền chỉnh sửa, từ chối hoặc hủy bỏ chương trình Khuyến mãi này bất cứ thời gian nào mà không cần
              báo trước.
            </li>
            <li>Điều khoản & Điều kiện khuyến mãi chung được áp dụng.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getBetDetail, claimSummon } from "../../../api/index/promo.js";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import { useI18n } from "vue-i18n";
const $q = useQuasar();

const betMoney = ref(0);
const clickBtn = ref(false);
const store= userStore();
const { t } = useI18n();

const getBetDetailData = () => {
  getBetDetail("vnm-euro-2024-bet-reward").then((res) => {
    console.log(res);
    if (res.code === 0) {
      betMoney.value = res.data.betAmount;
      clickBtn.value = res.data.canClaim;
    }
  });
};

const postClaimSummon = () => {
  if(!store.token){
    $q.notify({
      type: "negative",
      position: "top",
      message: t("lang.system_please_login"),
      icon: "report_problem"
    });
    return;
  }

  if (clickBtn.value) {
    claimSummon("vnm-euro-2024-bet-reward")
      .then((res) => {
        if (res.code === 0) {
        }
      })
      .catch(() => {});
  }
};

onMounted(() => {
  getBetDetailData();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .border {
    border: 1px solid #f2f8fe;
  }
  .euro2024Bet {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .section-title {
      display: flex;
      width: 100%;
      color: #0080ff;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      align-items: center;
      margin: 0 auto;
      text-align: center;
      justify-content: space-between;

      span{
        white-space: nowrap;
      }

      .decor {
        aspect-ratio: 195/44;
        width: 10%;
      }
    }
    .moneyBg {
      width: 234px;
      position: relative;

      &:hover{
        filter:brightness(0.9);
      }
      &:active{
        filter:brightness(0.8);
        transform: translate(0px, 1px);
      }


      .moneyText {
        font-family: Inter;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        text-align: center;
        color: #a17a5e;
        position: absolute;
        top: 46px;
        left: 50%;
        transform: translateX(-50%);
        .money {
          color: #f53e33;
        }
      }
      .btnText {
        font-family: Inter;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        text-align: center;
        color: #a17a5e;
        position: absolute;
        bottom: 46px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
      }
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #f2f8fe;
    padding: 20px;
    margin: 12px;
    border-radius: 6px;

    .section-title {
      display: flex;
      width: 100%;
      color: #0080ff;
      font-size: 20px;
      font-weight: 800;
      line-height: 20px;
      gap: 20px;
      align-items: center;
      margin: 0 auto;
      text-align: center;
      justify-content: space-between;

      span{
        white-space: nowrap;
      }

      .decor {
        aspect-ratio: 195/44;
        width: 10%;
      }
    }

    .bullet-points {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .point {
        display: grid;
        grid-template-columns: 120px 1fr;
        align-items: center;

        .blue-hexagon {
          font-weight: bold;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px 15px;
          width: 100px;
          height: 25px;
          background: url("../../../assets/images/promo/hotpromo/eurocup24/blue-hexagon.svg") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    .section-wrapper {
      .title {
        display: flex;
        color: #0080ff;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
        gap: 8px;

        .title-prefix {
          width: 4px;
          height: 20px;
          background-color: #4ba5ff;
        }
      }

      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: #ffffff;
      padding: 20px;
      border: 1px solid #acd4f6;
      border-radius: 8px;

      .content {
        color: #000000;

        .pill {
          white-space: nowrap;
          border-radius: 100px;
          padding: 2px 8px;
          color: #ffffff;
          background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        }

        ol {
          list-style: none;
          counter-reset: item;
          padding-left: 0;
        }

        li {
          counter-increment: item;
          margin-bottom: 10px;
        }

        li:before {
          margin-right: 10px;
          content: counter(item);
          background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
          border-radius: 100%;
          color: white;
          width: 1.6em;
          text-align: center;
          display: inline-block;
        }
      }
    }
  }
}

.table {
  border-collapse: separate !important;
  border-spacing: 0;
  th {
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    color: #fff;
    :first-child {
      border-top-left-radius: 6px;
    }
  }
  /*第一欄第一列：左上*/
  tr:first-child th:first-child {
    border-top-left-radius: 10px;
  }
  /*第一欄最後列：左下*/
  tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }
  /*最後欄第一列：右上*/
  tr:first-child th:last-child {
    border-top-right-radius: 10px;
  }
  /*最後欄第一列：右下*/
  tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
  td {
    border: 1px solid #acd4f6 !important;
  }
}
</style>

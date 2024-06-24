<template>
  <div class="container">
    <div class="jackpot-container">
      <div class="jackpot-title">TỔNG JACKPOT LÊN ĐẾN 3.8 TỶ</div>
      <div class="jackpot-box">
        <div class="jackpot-numbers">
          <div
            v-for="(char, index) in jackpotNumber"
            :key="index"
            :class="{ 'jackpot-numbers__comma': char === ',', 'jackpot-numbers__num': char !== ',' }"
          >
            {{ char }}
          </div>
        </div>
        <div class="seperator"></div>
        <div class="jackpot-details">
          <div class="jackpot-details__content">Kỳ I: từ 15-30/06/2024, nạp 1,800 VNDP mỗi ngày/lượt chọn số</div>
          <div class="jackpot-details__date">Ngày mở thưởng: 01/07/2024</div>
        </div>
        <div class="number-container">
          <el-input
            v-for="(input, index) in inputs"
            v-model="inputValues[index]"
            :key="index"
            ref="inputRefs"
            @update:modelValue="handleInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
            class="number-input"
          ></el-input>
        </div>
        <el-button :loading="isLoadingJackpot" @click="onSubmitJackpot" class="jackpot-button">CHỌN SỐ</el-button>
      </div>
      <div class="jackpot-note">
        <div class="note">
        Lưu ý: Vui lòng xác định số của bạn và không thể thay đổi sau khi gửi</div>
 
<!--        <div class="more" @click="openTableDialog">-->
<!--          「Xem hồ sơ」-->
<!--        </div>-->
      </div>       </div>
    <div class="luckydraw-details">
        <div class="luckydraw-title">Quy tắc hoạt động</div>
        <div class="luckydraw-info">
            <div class="luckydraw-line">
                <span class="luckydraw-line__head">Thời gian</span>
                <span class="luckydraw-line__sub">Chương trình khuyến mãi bắt đầu từ ngày 16/06/2024 – 15/07/2024</span>
            </div>
            <div class="luckydraw-line">
                <span class="luckydraw-line__head">Áp dụng</span>
                <span class="luckydraw-line__sub">Cho tất cả các thành viên của TF88</span>
            </div>
            <div class="luckydraw-line">
                <span class="luckydraw-line__head">Sản phẩm</span>
                <span class="luckydraw-line__sub">Tất cả các trận đấu của giải bóng đá CUP Châu Âu 2024</span>
            </div>
        </div>
        <div class="section-list">
            <div class="section section1">
                <div class="section-title">Chi tiết khuyến mãi</div>
                <p class="likeli"><span class="point">1</span>Trong thời gian diễn ra sự kiện, Thành Viên hoàn thành điều kiện gửi tiền hàng ngày có thể chọn 1 số có 3 chữ số bất kỳ từ 000 – 999 làm số xổ số.</p>
                <p class="likeli"><span class="point">2</span>Cùng 1 người chọn 2 số giống nhau sẽ được tính là 1 số. </p>
                <p class="likeli"><span class="point">3</span>Nếu có nhiều người trùng số thì giải thưởng sẽ được chia theo thứ tự và tỉ lệ tương ứng với điều kiện của giải thưởng.</p>
                <p class="likeli"><span class="point">4</span>Ngày diễn ra rút thăm trúng thưởng sẽ được chia làm 2 đợt</p>
            </div>
            <div class="section pt1">
                <div class="section-title">Đợt I</div>
                <p>Ngày chọn số từ 16/06/2024 – 30/06/2024, ngày mở thưởng là 01/07/2024.</p>
                <p>Tổng tiền thưởng Jackpot lên đến 1,555,552 VNDP, tổng nạp yêu cầu trong ngày là 1,800 VNDP để đủ điều kiện chọn số tham gia.</p>
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <th width="30%">Giải Thưởng</th>
                        <th width="30%">Tổng Tiền Thưởng</th>
                        <th>Điều Kiện Thắng Cược</th>
                    </tr>
                    <tr>
                        <td>Triệu Phú</td>
                        <td>688,888 VNDP</td>
                        <td>3 chữ số đã chọn trùng khớp với 3 chữ số cuối của Giải Đặc Biệt</td>
                    </tr>
                    <tr>
                        <td>Nhóm 3</td>
                        <td>388,888 VNDP</td>
                        <td>2/3 chữ số cuối Giải Đặc Biệt là số kép và 3 chữ số được chọn trùng khớp với dãy số này theo thứ tự bất kì</td>
                    </tr>
                    <tr>
                        <td>Nhóm 6</td>
                        <td>288,888 VNDP</td>
                        <td>3 chữ số được chọn trùng khớp với 3 chữ số cuối trong Giải Đặc Biệt theo thứ tự bất kì</td>
                    </tr>
                    <tr>
                        <td>2D</td>
                        <td>188,888 VNDP</td>
                        <td>2 chữ số cuối trong dãy 3 chữ số được chọn trùng với 2 chữ số cuối trong dãy số Giải đặc biệt</td>
                    </tr>
                </table>
            </div>
            <div class="section pt2">
                <div class="section-title">Đợt II</div>
                <p>Ngày chọn số từ 01/07/2024 – 15/07/2024, ngày mở thưởng là 16/07/2024.</p>
                <p>Tổng tiền thưởng Jackpot lên đến 2,255,552 VNDP, tổng nạp yêu cầu trong ngày là 3,500 VNDP để đủ điều kiện chọn số tham gia.</p>
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <th width="30%">Giải Thưởng</th>
                        <th width="30%">Tổng Tiền Thưởng</th>
                        <th>Điều Kiện Thắng Cược</th>
                    </tr>
                  <tr>
                    <td>Triệu Phú</td>
                    <td>888,888 VNDP</td>
                    <td>3 chữ số đã chọn trùng khớp với 3 chữ số cuối của Giải Đặc Biệt</td>
                  </tr>
                  <tr>
                    <td>Nhóm 3</td>
                    <td>688,888 VNDP</td>
                    <td>2/3 chữ số cuối Giải Đặc Biệt là số kép và 3 chữ số được chọn trùng khớp với dãy số này theo thứ tự bất kì</td>
                  </tr>
                  <tr>
                    <td>Nhóm 6</td>
                    <td>388,888 VNDP</td>
                    <td>3 chữ số được chọn trùng khớp với 3 chữ số cuối trong Giải Đặc Biệt theo thứ tự bất kì</td>
                  </tr>
                  <tr>
                    <td>2D</td>
                    <td>288,888 VNDP</td>
                    <td>2 chữ số cuối trong dãy 3 chữ số được chọn trùng với 2 chữ số cuối trong dãy số Giải đặc biệt</td>
                  </tr>
                </table>
            </div>
            <div class="section example">
                <div class="section-title">Ví Dụ: </div>
                <p class="likeli">
                    <span class="point">A</span>
                    
                    <span class="wSub">
                    Kết quả xổ số Miền Bắc ngày 01/07/2024 là 272935 thì:
                        
                       <span class="sub">- Triệu Phú: 935</span>
                        <span class="sub">- Nhóm 3: Không có trúng thưởng</span>
                        <span class="sub">- Nhóm 6 là: 953; 539; 593; 359; 395</span>
                        <span class="sub">- 2D: 035; 135; 235; 335; 435; 535; 635; 735; 835</span>
                    </span>
                </p>
                <p class="likeli">
                    <span class="point">B</span>
                    <span class="wSub">
                    Kết quả xổ số Miền Bắc ngày 01/07/2024 là 128335 thì:
                        
                       <span class="sub">- Triệu Phú: 335</span>
                        <span class="sub">- Nhóm 3: 353; 533</span>
                        <span class="sub">- Nhóm 6 là: Không có trúng thưởng  </span>
                        <span class="sub">- 2D: 035; 135; 235; 435; 535; 635; 735; 835; 935</span>
                    </span>
                </p>
                <p>Tiền thưởng sẽ được dựa theo tổng tiền nạp của Thành Viên trong mỗi đợt xố số, chi tiết như sau:</p>
                <table cellpadding="0" cellspacing="0" border="0">
                    <thead>
                        <tr>
                            <th>Tổng Nạp</th>
                            <th>Tiền Thưởng</th>
                            <th>Vòng Cược Yêu Cầu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1,800 VNDP</td>
                            <td>18 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>2,800 VNDP</td>
                            <td>28 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>3,800 VNDP</td>
                            <td>38 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>7,800 VNDP</td>
                            <td>68 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>10,800 VNDP</td>
                            <td>88 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>18,000 VNDP</td>
                            <td>108 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>28,000 VNDP</td>
                            <td>188 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>38,000 VNDP</td>
                            <td>288 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>70,000 VNDP</td>
                            <td>388 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>180,000 VNDP</td>
                            <td>1,088 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>350,000 VNDP</td>
                            <td>1,888 VNDP</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>700,000 VNDP</td>
                            <td>3,888 VNDP</td>
                            <td>3</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="section participate">
                <div class="section-title">Cách thức tham gia</div>
                <p class="likeli"><span class="point">1</span>Trong thời gian sự kiện diễn ra, mỗi ngày Thành viên cần tích lũy tổng nạp tối thiểu 1,800 VNDP cho đợt I và 3,500 VNDP cho đợt II để có thể tham gia chọn số may mắn.</p>
                <p class="likeli"><span class="point">2</span>Thành Viên sẽ chọn 1 số có 3 chữ số bất kỳ từ 000 – 999 làm số may mắn.</p>
                <p class="likeli"><span class="point">3</span>Giải thưởng trong Ngày Mở Thưởng sẽ được lấy theo Giải Đặc Biệt của Xổ Số Kiến Thiết Miền Bắc, và chia làm 2 đợt như sau:</p>
                <ul>
                    <li>I: Ngày chọn số từ 16/06/2024 – 30/06/2024, ngày mở thưởng là 01/07/2024.</li>
                    <li>II: Ngày chọn số từ 01/07/2024 – 15/07/2024, ngày mở thưởng là 16/07/2024.</li>
                </ul>
                <p class="likeli"><span class="point">4</span>Thông qua việc hoàn thành yêu cầu nạp tiền mỗi ngày, Thành Viên đều có thể chọn 1 số may mắn, tối đa 15 số cho 1 đợt. </p>
                <p class="likeli"><span class="point">5</span><span>Thành viên sẽ nhận được 3 lần chọn số may mắn khi đăng ký hợp lệ khuyến mãi TRAO MAY MẮN TỚI ĐỘI BÓNG YÊU THÍCH và sẽ nhận được thêm 1 lần chọn số sau khi đội bóng yêu thích mà thành viên đã chọn và đặt cược chiến thắng trận đấu đó <a href="https://docs.google.com/forms/d/e/1FAIpQLSeIgng8JZ2zoX4MMCNVksVD8v1MBjJ2aNUCa5r-qGJhq3F1HA/viewform" target="_blank" class="pill">TẠI ĐÂY</a></span></p>
                <p class="likeli"><span class="point">6</span>Sau khi có kết quả trúng thưởng, tiền thưởng sẽ được cộng trực tiếp vào tài khoản của người chơi.</p>
            </div>
            <div class="section tnc">
                <div class="section-title">Điều khoản và điều kiện</div>
                <p class="likeli"><span class="point">1</span> Mỗi Thành Viên đều có thể tham gia cả 2 đợt mở thưởng.</p>
                <p class="likeli"><span class="point">2</span> Kết quả mở thưởng sẽ được dựa theo kết quả xổ số Miền Bắc của ngày 01/07/2024 và ngày 16/07/2024.</p>
                <p class="likeli"><span class="point">3</span> Sau khi có kết quả mở thưởng, chúng tôi sẽ tiến hành kiểm tra và xác nhận trong vòng 24h, tiền thưởng sẽ được cộng trực tiếp vào tài khoản người chơi.</p>
                <p class="likeli"><span class="point">4</span> Tất cả số may mắn Thành Viên đã chọn tại đợt 1 sẽ không áp dụng chung đợt mở thưởng lần 2.</p>
                <p class="likeli"><span class="point">5</span> Trường hợp có quá nhiều Thành Viên trúng thưởng cùng 1 giải, tiền thưởng sẽ được chia theo thứ tự người đến trước nhận trước.</p>
                <p class="likeli"><span class="point">6</span> Số may mắn đã chọn thành công sẽ không thể thay đổi.</p>
                <p class="likeli"><span class="point">7</span> Tiền thưởng cần trải qua 03 vòng cược tại Thể Thao trước khi có thể rút tiền.</p>
                <p class="likeli"><span class="point">8</span> Nếu TF88 kiểm tra thấy mỗi thành viên, mỗi địa chỉ email, mỗi số điện thoại sử dụng cùng một tài khoản ngân hàng hoặc trùng địa chỉ IP thì chỉ có một tài khoản được nhận tiền thưởng của Khuyến mãi này (nếu có nhiều thông đồng hoặc sử dụng nhiều tài khoản thì tất cả tiền thắng cược sẽ bị mất).</p>
                <p class="likeli"><span class="point">9</span> Nếu TF88 phát hiện thành viên liên tục đăng ký tài khoản, lợi dụng sơ hở của trò chơi hoặc cố ý vi phạm, TF88 có quyền hủy hoặc rút lại tiền thưởng của Thành viên.</p>
                <p class="likeli"><span class="point">10</span> Tất cả cược HÒA, cược HỦY, cược 2 BÊN,  vé cược đặt tại tỷ lệ cược: DEC < 1.75, MY -0.6 đến 0.75, Thể thao ảo, Đua ngựa, Number Game sẽ không được áp dụng cho chương trình này.</p>
                <p class="likeli"><span class="point">11</span> Các tài khoản có cùng IP hoặc thông tin dữ liệu tương tự sẽ không được tham gia chương trình khuyến mãi này.</p>
                <p class="likeli"><span class="point">12</span> Chương trình không thể kết hợp cùng các khuyến mãi nạp khác tại TF88.</p>
                <p class="likeli"><span class="point">13</span> TF88 có quyền chỉnh sửa, từ chối hoặc hủy bỏ chương trình Khuyến mãi này bất cứ thời gian nào mà không cần báo trước.</p>
                <p class="likeli"><span class="point">14</span> Điều khoản & Điều kiện khuyến mãi chung được áp dụng.</p>
            </div>
        </div>
    </div>
      <el-dialog class="votewinModal" width="600" v-model="isDialogShow" :footer="null">
        <div class="close-btn" @click="isDialogShow = !isDialogShow"><img style="position: absolute; z-index: 2; cursor: pointer; right: 10px;
        top: 10px;" src="../../../assets/promo/eurocup-luckydraw/close.png"></div>
        <el-tabs v-model="tab" class="demo-tabs">
        <el-tab-pane label="Hồ sơ bỏ phiếu" name="voting">
          
              <el-table :data="votingDataSource">
                <template #empty>
                  <emptyData />
                </template>
                <el-table-column prop="loginName" :label="t('promo.list_of_winners')" />
                <el-table-column prop="number" :label="t('promo.lucky_number_of_win')" />
                <el-table-column prop="winStatus" :label="t('promo.record_win_status')">
                  <template #default="scope">
                    <span :class="{ win: scope.row.winStatus === 'WIN', loss: scope.row.winStatus === 'LOSS'}">{{ getWinStatus(scope.row.winStatus) }}</span>
                  </template>
                </el-table-column>
               <el-table-column prop="recordTime" :label="t('promo.date_of_win')" />
                <el-table-column prop="winPrize" :label="t('promo.record_win_prize')">
                  <template #default="scope">
                    {{ getWinPrize(scope.row.winPrize) }}
                  </template>
                </el-table-column>
              </el-table>
        </el-tab-pane>
        <el-tab-pane label="Kỷ lục chiến thắng" name="winning">
              <el-table :data="winnerDataSource">
                <template #empty>
                  <emptyData />
                </template>
                <el-table-column prop="loginName" :label="t('promo.list_of_winners')" />
                <el-table-column prop="resultTime" :label="t('promo.date_of_win')" />
                <el-table-column prop="number" :label="t('promo.lucky_number_of_win')" />
                <el-table-column prop="winStatus" :label="t('promo.record_win_status')">
                  <template #default="scope">
                    <span :class="{ win: scope.row.winStatus === 'WIN', loss: scope.row.winStatus === 'LOSS'}">{{ getWinStatus(scope.row.winStatus) }}</span>
                  </template>
                </el-table-column>
              </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { selectNumber, getSelectedNumber, getWinners, getPrizeAmount } from "@/api/index/promo";

import { useI18n } from "vue-i18n";

const tab = ref('voting');
const { t } = useI18n();
const inputs = [1, 2, 3]; // Three inputs
const inputValues = ref(["", "", ""]); // Reactive array to store input values
const inputRefs = ref([]);
const isLoadingJackpot = ref(false);
const jackpotNumber = ref();
const promoCode = ref('vnm-euro-2024-lottery-stage-one')
// JACKPOT
const handleInput = (index, value) => {
  if (value.length > 1) {
    inputValues.value[index] = value.slice(-1);
  } else {
    inputValues.value[index] = value;
  }
  // Move focus to the next input if it exists and a character is entered
  if (value.length === 1 && index < inputs.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1].focus();
    });
  }
};
const handleKeyDown = (index, event) => {
  if (event.key === "Backspace" && inputValues.value[index] === "" && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1].focus();
    });
  }
};
const getJackpotAmt = () => {
    getPrizeAmount(promoCode.value).then((res) => {
        if (res.code === 0) {
            console.log(res.data)
        }
    })
  const jackpotNum = 3811104;
  jackpotNumber.value = jackpotNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const onSubmitJackpot = () => {
  isLoadingJackpot.value = true;
  const number = inputValues.value.join("");
  selectNumber("vnm-euro-2024-lottery-stage-one", number).then((res) => {
    if (res.code === 0) {
      ElMessage.success(t("status.success"));
      isLoadingJackpot.value = false;
    } else {
      ElMessage.error(res.message);
      isLoadingJackpot.value = false;
    }
  });
};
const votingDataSource = ref([]);
const winnerDataSource = ref([]);
const initSelectedNumber = () => {
  votingDataSource.value = [];
    getSelectedNumber().then((res) => {
        if (res.code === 0) {
        res.data.forEach(element => {
          votingDataSource.value.push(element);
        });
        } else {
          ElMessage.error(res.message)
        }
    })

}
const initGetWinners = () => {
  winnerDataSource.value = [];
    getWinners(promoCode.value).then((res) => {
        if (res.code === 0) {
          res.data.forEach((element) => {
            element.winners.forEach((win) => {
              win.resultTime = element.resultTime;
              winnerDataSource.value.push(win);
            });
          });
        } else {
          ElMessage.error(res.message)
        }
    })
}
const getWinStatus = (status) => {
  switch (status) {
    case 'WIN':
      return 'Thua';
    case 'LOSS':
      return 'Thắng';
    case 'BET':
      return 'Cược';
    default:
      return '';
  }
}
const getWinPrize = (prize) => {
  switch (prize) {
    case 'FIRST_PRIZE':
      return 'Giải nhất';
    case 'GROUP_THREE':
      return 'Nhóm ba';
    case 'GROUP_SIX':
      return 'Nhóm sáu';
    case 'TWO_D':
      return 'Hai chữ số';
    default:
      return '';
  }
}
const isDialogShow = ref(false);
const openTableDialog = () => {
  isDialogShow.value = true;
  initSelectedNumber();
  initGetWinners();
}
onMounted(() => {
  getJackpotAmt();
  nextTick(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus();
    }
  });
});
</script>
<style lang="scss" scoped>
.container {
  font-family: Inter;
  .jackpot-container {
    margin: 20px auto;
    width: 95%;
    max-width: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .jackpot-title {
      font-weight: 700;
      padding: 5px;
      color: #ffffff;
      width: 100%;
      max-width: 680px;
      text-align: center;
      font-size: 28px;
      border-radius: 12px 12px 0 0;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    }
    .jackpot-box {
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: center;
      align-items: center;
      border: 5px solid #ffffff;
      box-shadow: 0px 0px 20px 6px #3e86e4 inset;
      width: 100%;
      padding: 20px;
      border-radius: 12px;
      background: #d8edfc;
      .jackpot-numbers {
        display: flex;
        height: 100px;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 10px;
        &__num {
          font-size: 48px;
          font-weight: 600;
          line-height: 58.09px;
          text-align: center;
          padding: 20px;
          background: url(../../../assets/promo/eurocup-luckydraw/num.png) no-repeat center center;
          background-size: contain;
        }
        &__comma {
          font-size: 60px;
          font-weight: 400;
          padding: 10px;
        }
      }
      .seperator {
        border: 1px solid #0080ff;
        width: 100%;
      }
      .jackpot-details {
        text-align: center;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #000000;
        font-size: 16px;
        &__content {
          font-weight: 500;
        }
        &__date {
          font-weight: 400;
        }
      }
      .number-container {
        display: flex;
        justify-content: center;
        width: 220px;
        gap: 10px; /* Space between inputs */
      }

      .number-input {
        width: 70px; /* Set a specific width for the inputs */
        height: 70px; /* Set a specific height for the inputs */
        text-align: center; /* Center the text inside the inputs */
        border-radius: 12px; /* Rounded corners */
        /* Default border */
        transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition for border color and shadow */
        :deep(.el-input__wrapper) {
          border: 1px solid #408ae9;
          border-radius: 12px;
        }
        :deep(.el-input__inner) {
          text-align: center;
          font-size: 30px;
        }
      }

      .number-input:focus-within {
        box-shadow: 0 0 5px rgba(64, 158, 255, 0.5); /* Subtle shadow on focus */
      }
      .jackpot-button {
        color: #d9d9d9;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        width: 220px;
        border-radius: 100px;
        font-size: 24px;
        padding: 8px;
        min-height: unset;
        height: unset;
      }
    }
    .jackpot-note {
      font-family: Inter;
      font-size: 16px;
      font-weight: 500;
      line-height: 19.36px;
      text-align: left;
      width: 100%;
      margin-top: 5px;
      color: #000000;
      display: flex;
      justify-content: space-between;
      gap:10px;
      .note {
        flex: 2;
        text-align: left;
      }
      .more { flex: 1; text-align: right;
        font-family: Inter;
        font-size: 14px;
        font-weight: 700;
        line-height: 19.36px; color: #0080FF;
        cursor: pointer;
        }
    }
  }
  .luckydraw-details {
    border: 1px solid #ACD4F6;
    width: 95%;
    max-width: 1200px;
    margin: 20px auto;
    border-radius: 12px;
    padding: 30px;
    background: #F2F8FE;
    .luckydraw-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #0080FF;
        font-size: 32px;
        font-weight: 700;
        gap: 30px;
        &:before, &:after {
            content: "";
            background: url(../../../assets/promo/eurocup-luckydraw/titledecal.png)no-repeat center center;
            background-size: cover;
            padding: 20px 100px;
        }
        &:after {
            
        transform: rotateY(180deg);
        }
    }
    .luckydraw-info {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
            gap: 15px;
        margin: 20px auto;
        .luckydraw-line {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 10px;
            &__head {
            background: url(../../../assets/promo/eurocup-luckydraw/line.png)no-repeat center center;
            background-size: contain;
            padding: 2px 20px;
            font-weight: 700;
            font-size: 16px;
            color: #ffffff;
            width: 130px;
            text-align: center;
            }
            &__sub {
                color: #000000;
                font-size: 16px;
            }
        }
    }
    .section-list {
        color: #000000;
        display: flex;
        flex-direction: column; 
        gap: 10px;
        margin: 20px auto;
        .section {
            border-radius: 12px;
            width: 100%;
            border: 1px solid #ACD4F6;
            padding: 20px;
            font-size: 16px;
            font-weight: 400;
            line-height: 28px;
            background: #FFFFFF;


            .section-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                color: #0080FF;
                font-weight: 600;
                font-size: 20px;
                margin-bottom: 20px;
                &:before {
                    content: "";
                    height: 20px;
                    width: 5px;
                    background: #0080ff;
                }
            }
            p.likeli {
                padding: 0;
                margin: 0;
                margin-bottom: 4px;
                display: grid;
                grid-template-columns: 30px 1fr;
                gap: 10px;

                .pill {
                    white-space: nowrap;
                    border-radius: 100px;
                    padding: 4px 8px;
                    color: #FFFFFF;
                    width: fit-content;
                    display: inline-block;
                    background: linear-gradient(180deg, #70CBFB 0%, #4AA5FF 49%, #4AA5FF 91.5%, #6EC7FD 100%);
                }
                .point {
                    width: 100%;
                    color: #ffffff;
                    border-radius: 50%;
                    height: 30px;
                    display: block;
                    text-align: center;
                    background: linear-gradient(180deg, #70CBFB 0%, #4AA5FF 49%, #4AA5FF 91.5%, #6EC7FD 100%);

                }
                .wSub {
                    display: flex;
                    flex-direction: column;
                }
                .sub {
                    color: #00000099;
                }
            }
            p {
                margin: 0 0 4px;
            }
            li {
                list-style-type: none;
                padding-left: 15px;
            }
            table {
                width: 100%;
                th {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24.2px;
                    text-align: center;
                    background: linear-gradient(180deg, #70CBFB 0%, #4AA5FF 49%, #4AA5FF 91.5%, #6EC7FD 100%);
                    color: #ffffff;
                    padding: 10px;
                    &:first-child { 
                        border-radius: 12px 0 0 0;
                    }
                    &:last-child { 
                        border-radius: 0 12px 0 0;
                    }
                }
                td {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 19.36px;
                    text-align: center;
                    padding: 10px;
                    border: 1px solid #ACD4F6;

                }
            }
        }
    }
  }
}
:deep(.el-table .el-table__cell) {
  border-color:  #ACD4F6;
  .win {
    color: #51ACFF;
  }
  .loss {
    color: #FF5151;
  }
}
:deep(.el-table:not(.el-table--border) .el-table__cell) {
  border-right: none;
}
</style>
<style lang="scss">
body .votewinModal .el-tabs__nav {
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}
.votewinModal .el-tabs__header {
  margin: 0;
}

body .votewinModal .el-tabs__item {
  border: 1px solid #51ACFF;
  color: #51ACFF; 
  padding: 10px !important;
}
.votewinModal .el-table th .cell {
  color: #51acff;
}
body .votewinModal .el-tabs__item.is-active {
  background: linear-gradient(180deg, #70CBFB 0%, #4AA5FF 49%, #4AA5FF 91.5%, #6EC7FD 100%);
  color: #ffffff;

}
body .votewinModal .el-tabs__item.is-active:after {
  display: none;
}
</style>
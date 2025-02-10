<template>
    <div class="deposit-spinner-rewards">
        <div class="top">
            <div class="side-buttons">
                <RouterLink to="/spinnerRules" class="individual-btn">Rules</RouterLink>
                <!-- <RouterLink to="/spinnerHistory" class="individual-btn">History</RouterLink> -->
            </div>
            <div class="instructions">
                Complete the deposit task to participate in the wheel activity and get a bonus of up to <span class="orange">7777PKR</span>
            </div>
        </div>
        <RouterLink to="/deposit" class="deposit-now">
            Deposit Now
        </RouterLink>

        <div class="tab-buttons">
            <button 
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="setTab(index)"
            :class="{ active: activeTab === index, lock: index === 3 }"
            >
            <img class="spinwheel" :src="require(`./img/spin-${index+1}.png`)">
            <span class="upto">UP to </span> <span class="uptonum">{{ tab.upto }}</span>
            </button>
        </div>
        <div class="slider-container" ref="sliderRef" v-touch="onSwipe">
            <div class="bg"><img :src="require(`./img/tab${activeTab+1}.png`)"></div> 
            <div class="slider" 
            :style="{
            transform: `translateX(calc(-${activeTab * 80}vw + 10vw))`
            }">
            
            <div v-for="(tab, index) in tabs" :key="index" 
                    class="tab-content" 
                    :class="['tab' + index, { active: index === activeTab, inactive: index !== activeTab }]"
                    :style="{transformOrigin: index === activeTab - 1 ? 'right' : 'left' }"
                    >
                    <div class="onlyactiveshow">

                        <div class="ins">Deposit Rs {{ tab.min }} to get 1 spin.</div>
                        <div class="bar">
                            <div class="outerbar">
                                <div class="innerbar" :style="{ width: progressBarWidth }"></div>
                            </div>
                            <div class="barnumbers">
                            <div class="indicator first"><span class="indicator-num">0</span></div>
                            <div class="indicator wbar mid" :class="{center: index !== 0}">
                                <img src="./img/indicator-bar.png">
                                <span class="indicator-num">
                                    {{ tab.min }}
                                </span>
                                <span class="indicator-spin">
                                    +1spin
                                </span>   </div>
                            <div class="indicator wbar last">
                                <img src="./img/indicator-bar.png">
                                <span class="indicator-num">
                                    {{ tab.max }}
                                </span></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- <img :src="`img/spin-${index+1}`"> -->
                    <div class="spinwheel">
                        <img :class="{wheel: rolling}" :style="`transform: rotate(${tab.wheelDeg}deg)`" :src="require(`./img/bigspin-${index+1}.png`)">
                        <img class="spintop" :src="require(`./img/spin-top-${index+1}.png`)">
                        <img class="spingo" @click="onClickRotate" @touchstart="onClickRotate" :src="require(`./img/spingo-${index+1}.png`)">
                        <span class="spinnum" @click="onClickRotate" @touchstart="onClickRotate">{{ 'Spin *' + (tab.times1 + tab.times2 ) }}</span>
                    </div>
                    <div class="onlyactiveshow">
                        <span class="remaining">Remaining times:</span> 
                        <span class="remainingamt">{{ tab.times1 + tab.times2 }}</span></div>
                </div>
            </div>
        </div>
        <q-dialog v-model="showDialog" persistent>
            <div class="prize-popup">
            <!-- <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" /> -->
            <div class="prize-gold">
                <div class="prize-get"> {{ prizePopupBonusAmt }} PRK</div>

                <div class="prize-amount"> {{ prizePopupBonusAmt }} PRK</div>

            </div>

            <q-btn no-caps unelevated class="btn-primary" @click="closeDialog">{{ $t("btn.claim") }}</q-btn>
            </div>
        </q-dialog>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive, nextTick, computed } from "vue";
import { useSwipe } from "@vueuse/core";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";


const rolling = ref(false);
const activeTab = ref(0);
const $q = useQuasar();
const tabs = reactive([{
    upto: "377",
    times1: 2,
    times2: 2,
    min: "500",
    max: "1500",
    title: "silver",
    wheelDeg: 0,
    prizeList: [
        {
            name: "377",
        },
        {
            name: "37",
        },
        {
            name: "X1",
        },
        {
            name: "177",
        },
        {
            name: "277",
        },
        {
            name: "17",
        },
        {
            name: "X2",
        },
        {
            name: "57",
        },

    ]
},{
    upto: "777",
    times1: 2,
    times2: 2,
    min: "3000",
    max: "6000",
    title: "gold",
    wheelDeg: 0,
    prizeList: [
        {
            name: "377",
        },
        {
            name: "77",
        },
        {
            name: "X2",
        },
        {
            name: "37",
        },
        {
            name: "577",
        },
        {
            name: "57",
        },
        {
            name: "777",
        },
        {
            name: "X1",
        }
    ]
    
}, {
    upto: "3777",
    times1: 2,
    times2: 2,
    min: "10000",
    max: "20000",
    title: "diamond",
    wheelDeg: 0,
    prizeList: [
        {
            name: "X1",
        },
        {
            name: "177",
        },
        {
            name: "X2",
        },
        {
            name: "777",
        },
        {
            name: "77",
        },
        {
            name: "3777",
        },
        {
            name: "7777",
        },
        {
            name: "377",
        },
    ]
}, {
    upto: "?????",
    times1: 2,
    times2: 2,
    title: "supreme",
    wheelDeg: 0,
}])
const selectedSpinWheel = ref('silver');

const setTab = (index) => {
    let name = 'silver'
    if (index === 0) {
        name = 'silver'
    }
    if (index === 1) {
        name = 'gold'
    }
    if (index === 2) {
        name = 'diamond'
    }
    if (index === 3) {
        name = 'supreme'
    }
  selectedSpinWheel.value = name
  activeTab.value = index
};
const prizePopupBonusAmt = ref(0)
const sliderRef = ref(null);
const showDialog = ref(false);
const prizeResult = ref("");
const { lengthX } = useSwipe(sliderRef, {
  passive: false,
  onSwipeEnd() {
    if (lengthX.value > 50) {
      // Swipe right → Move to previous tab
      if (activeTab.value + 1 === 3) {
        return
      }
      setTab(Math.min(tabs.length - 1, activeTab.value + 1)); 
    } else if (lengthX.value < -50) {
        if (activeTab.value )
      // Swipe left → Move to next tab
      setTab(Math.max(0, activeTab.value - 1));
    }
  },
});
const spinWheelDetails = ref();
const depositAmount = ref(0)

const progressBarWidth = computed(() => {
  if (!selectedTab.value || !selectedTab.value.max) return "0%"; // Avoid errors

  const maxAmount = selectedTab.value.max;
  const percentage = Math.min((depositAmount.value / maxAmount) * 100, 100); // Limit to 100%
  return `${percentage}%`;
});
const selectedTab = computed(() => {
  return tabs.find(tab => tab.title === selectedSpinWheel.value) || {}; // Default to empty object if not found
});
const getSpinWheelType = (selectedTab) => {
  if (selectedTab.value.times1 > 0) {
    return `${selectedTab.value.title.toUpperCase()}-1`; // Use times1 first
  } else if (selectedTab.value.times2 > 0) {
    return `${selectedTab.value.title.toUpperCase()}-2`; // Use times2 next
  } else {
    return null; // No spins left
  }
};
const checkRemainingSpins = (selectedTab) => {
  return selectedTab.value.times1 > 0 || selectedTab.value.times2 > 0;
};
const onClickRotate = () => {
  if (rolling.value) {
    return;
  }
  if (!checkRemainingSpins(selectedTab)) {
    console.log(selectedTab)
    $q.notify({
        color: "warning",
        position: "top",
        message: "No spins left",
        icon: "report_problem"
    });
    return;
  }

  //   const result = Math.floor(Math.random() * prizeList.value.length);

  //     // Usage example
  //     const result = getIndexByName(res.prize);
  //     roll(result);
  //   }
  
  const getIndexByName = (name) => {
    return selectedTab.value.prizeList.findIndex(item => item.name === name);
  };
  const wheelType = getSpinWheelType(selectedTab);
    if (!wheelType) {
        $q.notify({
          color: "warning",
          position: "top",
          message: "No spins left",
          icon: "report_problem"
        });
        return;
    }
  eventapi.post(`/session/deposit-wheel/spin?promoCode=pak-deposit-wheel&wheelType=${wheelType}`).then((res) => {
    if (res.code === 0) {
      
      var result = getIndexByName(res.data.bonus.toString());

      if (res.data.spinType === 'FREESPIN') {
        if (res.data.freeSpinWheelType === wheelType) {
            result = 'X2'
        } else {
            result = 'X1'
        }
      }
      
      roll(result);
    }
  });
    // const result = getIndexByName('17');
    // roll(result);
};
const roll = (result) => {
  rolling.value = true;
  
  const wheelDegValue = selectedTab.value.wheelDeg;
  const prizeListValue = selectedTab.value.prizeList;
  console.log(result)
  // Ensure prizeListValue is defined and result is within a valid range
  if (prizeListValue && prizeListValue[result]) {
    const length = prizeListValue.length;
    const segmentAngle = 360 / length;
    const targetAngle = segmentAngle * result + segmentAngle / 2; // Center the prize
    const newWheelDeg = wheelDegValue - (wheelDegValue % 360) + 6 * 360 - targetAngle;
    // Update the reactive wheelDeg value
    selectedTab.value.wheelDeg = newWheelDeg;

    setTimeout(() => {
      rolling.value = false;
      prizeResult.value = prizeListValue[result].name;
      if (prizeResult.value === 'X1' || prizeResult.value === 'X2') {
        resetWheel();   
      } else {
        showDialog.value = true;
        prizePopupBonusAmt.value = prizeResult.value
      }
      
      //   alert("Result：" + prizeListValue[result].name);
    }, 4500);
  }
};
const init = () => {
  return new Promise((resolve, reject) => {
    return eventapi.get("/session/deposit-wheel/init?promoCode=pak-deposit-wheel")
      .then((res) => {
        if (res.code === 0) {
            spinWheelDetails.value = res.data;
            depositAmount.value = res.data.totalDepositAmount;
            res.data.wheels.forEach((wheel) => {
            const wheelType = wheel.wheelType; // e.g., "SILVER-1"
            const availableSpin = wheel.availableSpin;

            const [baseType, suffix] = wheelType.split('-'); // ["SILVER", "1"]

            // Iterate through all tabs and update based on the baseType and suffix
            tabs.forEach(tab => {
            if (tab.title.toUpperCase() === baseType) {
                // Update times1 and times2 based on the suffix
                if (suffix === "1") {
                tab.times1 = availableSpin;  // Update times1
                } else if (suffix === "2") {
                tab.times2 = availableSpin;  // Update times2
                }
            }
            });
        });
        }

        return resolve();
      })
      .catch((err) => {
        console.log(err);
        return resolve();
      });
  });
};
const closeDialog = () => {
    showDialog.value = false
    resetWheel();
}
const resetWheel = () => {
  const tabIndex = tabs.findIndex(tab => tab.title === selectedSpinWheel.value);
  if (tabIndex === -1) return;

  const wheelElement = document.querySelector(".wheel"); // Adjust selector based on your HTML

  if (wheelElement) {
    wheelElement.style.transition = "none"; // Disable animation
  }

  tabs[tabIndex].wheelDeg = 0; // Instantly reset to starting position

  nextTick(() => {
    if (wheelElement) {
      void wheelElement.offsetWidth; // Force browser reflow (trick to apply the change)
      wheelElement.style.transition = "transform 4s ease-out"; // Re-enable animation
    }
    rolling.value = false;
  });
  init();
};
onMounted(() => {
    init();
})
</script>
<style lang="scss" scoped>
    .deposit-spinner-rewards {
        font-family: "Poppins";
        background: url(img/bg-img.png)no-repeat center top;
        .top {
            display: flex;
            gap: 10px;
            margin: 20px 0px;
            .side-buttons {
                font-weight: 600;
                margin-left: -50px;
                padding-left: 50px;
                display: flex;
                flex-direction: column;
                gap: 15px;

                .individual-btn {
                    background: #30AF88;
                    padding: 5px;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
font-size: 12px;
font-weight: 500;
line-height: 18px;
                    border-radius: 0 10px 10px 0;
                }
            }
            .instructions {
                font-family: Poppins;
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;
                background: linear-gradient(92.28deg, #28AE90 0.45%, #70BF56 65.68%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                span.orange {
                    background:
linear-gradient(180deg, #FF7527 0%, #FFA011 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

                }
            }
        }
        .deposit-now {
            text-decoration: none;
            background: linear-gradient(180deg, #1BAA99 0%, #8AC542 100%);
            width: 148px;
            height: 40px;
            color: #000A01;
            font-family: Poppins;
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            margin: 20px auto;

        }
        .slider-container {
            width: 100%;
            // overflow: hidden;
            position: relative;
            height: 570px;
            touch-action: pan-y; /* Allow vertical scrolling */
            
            border-top: 1px solid #FFE667;
            background:#032519;
            background-image: url(img/spinner-bg.png);
            background-position: center center;
            background-size: cover;
            }
            .bg {
                margin-top: -85px;
                height: 100%;
    position: absolute;
    z-index: 0;
            }
            .slider {
                display: flex;
                transition: transform 0.5s ease-in-out;
                margin: 10px auto;
                width: calc(100vw * 4); 
            }
            .tab-content {
                width: calc(100vw - 20vw); /* Each tab width minus the amount to peek out */
                // height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: white;
                padding: 10px;
                flex-direction: column;
                gap: 20px;
                transition: transform 0.3s ease-in-out;
                &.active {
                transform: scale(1); /* Active tab stays full size */
                .onlyactiveshow {opacity: 1;}
                }
                &.inactive {
                transform: scale(0.7); /* Non-active tabs shrink to 80% */
                opacity: .6;
                .onlyactiveshow {opacity: 0;}
                }
                .ins {
                    font-family: Poppins;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 18px;
                    text-align: center;
                    margin: 5px auto;
                }
                .bar {
                    width: 100%;
                    .outerbar {
                        width: 85vw;
                        height: 17px;
                        background: linear-gradient(180deg, #0B4400 0%, #1C751C 100%);
                        border: 1px solid #5EA361;
                        border-radius: 10px;
                        .innerbar {
                            height: 15px;
                            background: linear-gradient(180deg, #1BAA99 0%, #8AC542 100%);
                            border-radius: 10px;
                        }
                    }
                    .barnumbers {
                        display: flex;
                        width: 100%;
                    }
                    .indicator {
                        font-family: Poppins;
                        font-size: 10px;
                        font-weight: 700;
                        line-height: 15px; 
                        &-num {
                            color: #FFEE56;
                        }
                        &.first{ 
                            padding-top:26px;
                        }
                        &.mid {
                            position: absolute;
                            left: 26%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            &.center {
                                left: 43%;
                            }
                        }
                        &.last {
                            position: absolute;
                            right: -5%;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                        }
                        &.wbar {
                            margin-top: -18px;
                            img {
                                width:17px;
                            }
                        }
                    }
                }
                .spinwheel {
                    margin: 15px auto 0;
                    position: relative;
                    .wheel {
                        transition: transform 4s ease-out;
                    }
                    .spintop {
                        position: absolute;
                        top: -10px;
                        width: 40%;
                        left: 0;
                        right: 0;
                        margin: auto;
                    }
                    
                    .spingo {
                        position: absolute;
                        top: -10%;
                        bottom: 0;
                        width: 30%;
                        left: 0;
                        right: 0;
                        margin: auto;
                    }
                    .spinnum {
                        position: absolute;
                        top: 53%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        margin: auto;
                        font-family: Inter;
                        font-size: 11.69px;
                        font-weight: 400;
                        line-height: 14.14px;
                        color: #B2501F;
                    }
                }
                .remaining, .remainingamt {
                    font-family: Poppins;
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 18px;
                    background: linear-gradient(92.28deg, #28AE90 0.45%, #70BF56 65.68%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .remainingamt {
                    color: #FFEE56;
                    margin-left: 5px;
                    -webkit-text-fill-color: #FFEE56;
                }
            }
            
            // .tab0 { background-color: #9a9a9a; }
            // .tab1 { background-color: #ff5733; }
            // .tab2 { background-color: #33c3ff; }
            // .tab3 { background-color: #33ff77; }

            .tab-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            gap: 10px;
            z-index: 999;
            position: relative;
            }
            .tab-buttons button {
                position: relative;
            padding: 10px 0px;
            margin-bottom: -1.5px;
            border: none;
            cursor: pointer;
            width: 100%;
            height: 84px;
            color: white;
            border-radius: 10px 10px 0 0;
            background: radial-gradient(50% 40.87% at 50% 59.13%, #001501 0%, #002417 100%);
            border: 1.5px solid #8C7B32;
            img.spinwheel {
                width: 30px;
                margin: 0 auto;
            }
            .upto {
                font-family: Poppins;
                font-size: 12px;
                font-weight: 500;
                line-height: 18px;
            }
            .uptonum {
                font-family: Poppins;
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;color: #FFEE56;
            }
            }
            
            .tab-buttons button.lock
                {
                    position: relative;
                    pointer-events: none;
                    &:before {
                        content: "";
                        background: url(img/lock.png)no-repeat center center;
                        position: absolute;
                        width: 16px;
                        height: 100%;
                        background-size: contain;
                        margin: auto;
                        z-index: 1;
                        left: 0;
                        top: 0;
                        right: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        
                    }
                    &:after {
                        content:"";
                background: linear-gradient(135.38deg, rgba(255, 255, 255, 0.2) 2.16%, rgba(255, 255, 255, 0.07) 32.7%, rgba(0, 0, 0, 0.47) 33.12%, rgba(0, 0, 0, 0.7) 100.95%);
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                
            }
                }
            .tab-buttons button.active {
                // background: #032519;
                // border: 1.5px solid #FFE667;
                // border-bottom: 0;
                background: transparent;
                border: 0;
                
                &:before {
                    content: "";
                    background: url(img/triangle.png)no-repeat center center;
                    position: absolute;
                    top: 0px;
                    left: 0;
                    right: 0;
                    width: 16px;
                    height: 8px;
                    margin: auto;
                    background-size: contain;
                }


            }
    }
    .prize-popup {
        width: 100%;
    }
    .prize-gold {
        width: 95%;
        height: 400px;
        background: url(./img/congrats.png)no-repeat center center;
        background-size: contain;
        position: relative;
        .prize-get {
            position: absolute;
            bottom: 90px;
            font-family: Manrope;
            font-size: 13px;
            font-weight: 700;
            line-height: 22.1px;
            text-align: center;
            color: #ffffff;

        }
        .prize-amount {
            position: absolute;
            bottom: 15px;
            font-family: Poppins;
            font-size: 30px;
            font-weight: 900;
            line-height: 45px;
            text-align: center;
            color: #FFF96F;
            text-shadow: 1px 1px #0000008A;


        }
    }
</style>
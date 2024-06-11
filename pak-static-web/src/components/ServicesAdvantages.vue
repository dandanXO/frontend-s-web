<template>
  <section id="advantage" class="section-advantage">
    <div class="fluid container">
      <div class="centername">
        <h2>
          SERVICE
          <span class="special">ADVANTAGES</span>
        </h2>
      </div>
      <div class="item-group">
        <div class="aos-item aos-init aos-animate" data-aos="fade-up">
          <div class="items hvr-icon-up hvr-shutter-out-horizontal hvr-shadow aos-item">
            <div class="icon hvr-icon">
              <img src="../assets/images/index/serv1.svg" />
            </div>
            <div class="txt">
              <h3>Network Security</h3>
              <p>Information Confidential Safe without loopholes Frequent update for protection</p>
            </div>
          </div>
        </div>

        <div class="aos-item aos-init aos-animate" data-aos="fade-up">
          <div class="items aos-item hvr-icon-up hvr-shutter-out-horizontal hvr-shadow">
            <div class="icon hvr-icon">
              <img src="../assets/images/index/serv2.svg" />
            </div>
            <div class="txt">
              <h3>TrustWorthy</h3>
              <p>Offical government license Good user reputation Excellent product experience</p>
            </div>
          </div>
        </div>

        <div class="aos-item aos-init aos-animate" data-aos="fade-up">
          <div class="items aos-item hvr-icon-up hvr-shutter-out-horizontal hvr-shadow">
            <div class="icon hvr-icon">
              <img src="../assets/images/index/serv3.svg" />
            </div>
            <div class="txt">
              <h3>Product</h3>
              <p>Best in the world The most abundant products Diverse selection</p>
            </div>
          </div>
        </div>
      </div>
      <div class="item-percent">
        <div class="aos-item" data-aos="fade-up">
          <div class="items">
            <div class="txt">
              <h3>60's</h3>
              <p>Average deposit time</p>
            </div>
          </div>
          <div class="items">
            <div class="txt">
              <h3>76's</h3>
              <p>Average withdrawal time</p>
            </div>
          </div>
          <div class="items">
            <div class="txt">
              <h3>14</h3>
              <p>Cooperative payment platform</p>
            </div>
          </div>
          <div class="items">
            <div class="txt">
              <h3>90k</h3>
              <p>Amount of client downloads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.section-advantage {
  background-attachment: fixed;
  position: relative;
  padding-block: 3rem;
  .fluid {
    width: 95%;
    margin: 0 auto;
  }

  h2 {
    font-size: 2.4rem;
    line-height: 42px;
    margin: 0;
    .special {
      /* Create the gradient. */
      background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 20.07%);

      /* Set the background size and repeat properties. */
      background-size: 100%;
      background-repeat: repeat;

      /* Use the text as a mask for the background. */
      /* This will show the gradient as a text color rather than element bg. */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-background-clip: text;
      -moz-text-fill-color: transparent;
    }
  }

  .item-group {
    display: flex;
    justify-content: space-between;
    padding: 10px 0 50px;
    width: 100%;
    margin: 0 auto;
    gap: 50px;
    .aos-item {
      flex: 1;
    }

    .title {
      width: 100%;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        height: 1px;
        width: 100%;
        left: 0;
        margin-top: 20px;
      }
    }
    .subintro {
      font-size: 16px;
      width: 100%;
      margin: auto;
      font-weight: 100;
      color: #eee;
    }
    .items {
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: left;
      padding: 30px;
      border-radius: 20px;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1019607843);
      background: linear-gradient(0deg, #ecf5ff, #ecf5ff),
        linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
      border-radius: 20px;
      border: 3px solid #ffffff;

      .icon {
        svg {
          fill: $primary-color;
          width: 85px;
        }
      }
      img {
        width: 100px;
        // filter: brightness(1) invert(1);
      }
      h3 {
        font-weight: bold;
        font-size: 24px;
        text-align: center;
      }
      p {
        color: #83a3ca;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
  .item-percent {
    padding: 10px 0;
    .aos-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      .items {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: relative;
        color: #ffffff;
        .txt {
          padding: 30px;
          padding-bottom: 10px;
        }

        h3 {
          font-size: 40px;
          line-height: 40px;
          margin: 0;
          color: #ffffff;
        }
        p {
          font-size: 15px;
          line-height: 15px;
        }

        &:before {
          content: "";
          // position: absolute;
          // box-shadow: inset 2px 1px 3px 0px $primary-color;
          width: 100%;
          height: 100%;
          // border-radius: 100%;
          // transform: rotate(155deg);
          // transition: all 0.3s ease-in;
          position: absolute;
          z-index: -1;
          top: 0;
          background: url(../assets/images/index/service-light.png) no-repeat center center;
        }

        &:hover:before {
          transform: rotate(0);
        }
      }
    }
  }

  @media (max-width: 767px) {
    padding-block: 4.5rem;

    .game-title {
      margin-bottom: 0.5em;
    }

    .item-group {
      flex-wrap: wrap;
      padding: 0 0 50px;
      gap: 20px;

      .items {
        flex-direction: column;
        text-align: center;
        .txt {
          padding: 0;
        }
      }
    }
    .item-percent {
      overflow: hidden;
      width: 90%;

      .aos-item {
        flex-wrap: wrap;
        gap: 30px;
      }
    }
  }
}
.dark-theme {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #ffffff;
  }
  .section-advantage {
    background: #101419;

    .item-group {
      .items {
        background: linear-gradient(180deg, #055ee84d 0%, rgba(14, 20, 26, 0) 100%);
        border: 0;
        box-shadow: none;
      }
    }

    // .item-percent {
    //   .aos-item {
    //     .items {
    //       &:before {
    //         background: url(../assets/images/index/service-dark.png) no-repeat center center;
    //         background-size: cover;
    //       }
    //     }
    //   }
    // }
  }
}
</style>

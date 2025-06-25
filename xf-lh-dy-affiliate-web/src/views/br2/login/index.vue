<template>
  <Swiper
    v-if="!isMobileView"
    :key="swiperKey"
    :slides-per-view="1"
    :direction="'vertical'"
    :pagination="{clickable: true}"
    :mousewheel="true"
    :autoHeight="true"
  >
    <SwiperSlide>
      <LoginRegisterPage siteId="28" />
    </SwiperSlide>
    <!--    <SwiperSlide>-->
    <!--      <CustomerServicePage />-->
    <!--    </SwiperSlide>-->
    <!--    <SwiperSlide>-->
    <!--      <SupportPage />-->
    <!--    </SwiperSlide>-->
    <!--    <Navigation />-->
    <!--    <Pagination />-->
    <!--    <Mousewheel />-->
    <!--    <Scrollbar />-->
  </Swiper>
  <div v-if="isMobileView">
    <LoginRegisterPage siteId="28" />
    <!--    <CustomerServicePage />-->
    <!--    <SupportPage />-->
  </div>
</template>
<script>
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Scrollbar,
} from 'swiper'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import LoginRegisterPage from '@/components/login-register'
// extra components
SwiperCore.use([Mousewheel, Pagination, Navigation, Scrollbar])
export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    LoginRegisterPage,
  },
  setup() {
    const isMobileView = ref(false)
    const onSwiper = swiper => {
      console.log(swiper)
    }
    const onSlideChange = () => {}
    onMounted(() => {
      window.addEventListener('resize', handleResize)
      // Check if the window width is greater than 768 initially
      if (window.innerWidth > 768) {
        isMobileView.value = false
      } else {
        isMobileView.value = true
      }
    })
    const handleResize = () => {
      // Handle the resize event here
      if (window.innerWidth > 768) {
        // Do something when the window is wider than 768
        isMobileView.value = false
      } else {
        isMobileView.value = true
      }
    }
    onBeforeUnmount(() => {
      // Remove the event listener before the component is unmounted
      window.removeEventListener('resize', handleResize)
    })
    const swiperKey = ref(0)

    return {
      onSwiper,
      onSlideChange,
      swiperKey,
      isMobileView,
    }
  },
})
</script>

<style scoped>
body {
  overflow: hidden;
}
.dialog400 {
  max-width: 400px;
}
.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.swiper-pagination {
  right: 20px !important;
  position: fixed;
}

.swiper-pagination .swiper-pagination-bullet {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  margin: 16px 0 !important;
  background: none;
  font-size: 0;
  color: transparent;
  opacity: 1;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.swiper-pagination .swiper-pagination-bullet:before {
  display: inline-block;
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #c8c9ce;
}

.swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active {
  border-color: #509cfc;
}

.swiper-pagination
  .swiper-pagination-bullet.swiper-pagination-bullet-active:before {
  background-color: #509cfc;
}

.swiper-pagination:after,
.swiper-pagination:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 30vh;
  background-color: #e3e4e6;
}

.swiper-pagination:before {
  transform: translate(-50%, calc(-100% - 84px));
}

.swiper-pagination:after {
  transform: translate(-50%, 84px);
}
@media (max-width: 768px) {
  body {
    overflow-y: auto;
  }
}
</style>

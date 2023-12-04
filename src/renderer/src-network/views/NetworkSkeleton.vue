<script setup lang="ts">
import NetworkHeader from "./NetworkHeader.vue";
import NetworkFooter from "./NetworkFooter.vue";
import NetworkSidebar from "./NetworkSidebar.vue";
import NetworkSection from "./NetworkSection.vue";
import NetworkChecks from "../components/screen/NetworkChecks.vue";
import { useNetworkStore } from "../store/networkStore";
import { WEBSITES } from "../../assets/checks/_networkValues";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import { onMounted, ref } from "vue";
import 'swiper/css';
import NetworkDeviceSelection from "./NetworkDeviceSelection.vue";

function up() {
  swiperRef.value.$el.swiper.slideNext(500)
}

function navigateTo(index: number) {
  swiperRef.value.$el.swiper.slideTo(index, 500)
}

function down() {
  swiperRef.value.$el.swiper.slidePrev(500)
}

const swiperRef = ref(null)
const swiper = ref(null)

function setSwiper(s) {
  console.log(s)
  swiper.value = s
}

const networkStore = useNetworkStore();

const populateReportTracker = async () => {
  for (const website of WEBSITES) {
    networkStore.reportTracker[website.name] ||= {
      type: "website",
      checkingStatus: "unchecked",
      passedStatus: "",
      message: "",
      id: website.name,
    };
  }
}

onMounted(() => {
  populateReportTracker();
});
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between">
    <div class="flex flex-row">
      <NetworkHeader/>
    </div>
    <div class="flex flex-row w-full h-full">
      <NetworkSidebar class="w-32 pt-10" :number-of-sections="4" :current-section="swiper?.activeIndex" @select="navigateTo"/>
      <Swiper ref="swiperRef" @swiper="setSwiper" direction="vertical" :pagination="{ clickable: true }" :slides-per-view="1" class="w-full h-auto pt-10">
        <SwiperSlide>
          <NetworkDeviceSelection/>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="w-full">
            <template v-slot:step>Step 2</template>
            <template v-slot:heading>Short</template>
            <template v-slot:body><NetworkChecks/></template>
          </NetworkSection>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="w-full">
            <template v-slot:step>Step 3</template>
            <template v-slot:body><p>Oh my god<br/>
              so much text<br/>
              it is overwhelming<br/>
              pls no more<br/>
              text</p></template>
          </NetworkSection>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="w-full">
            <template v-slot:step>Step 4</template>
            <template v-slot:heading>Short</template>
          </NetworkSection>
        </SwiperSlide>
      </Swiper>
    </div>
<!--    <NetworkFooter/>-->
  </div>
</template>

<style>
.swiper-slide{
  height: 100%!important;
}
</style>
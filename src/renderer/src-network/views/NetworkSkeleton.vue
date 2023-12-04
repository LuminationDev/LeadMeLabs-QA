<script setup lang="ts">
import NetworkHeader from "./NetworkHeader.vue";
import NetworkFooter from "./NetworkFooter.vue";
import NetworkSidebar from "./NetworkSidebar.vue";
import NetworkSection from "./NetworkSection.vue";
import {Swiper, SwiperSlide, useSwiper} from "swiper/vue";
import {ref} from "vue";
import 'swiper/css';

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

</script>

<template>
  <div class="w-full h-full flex flex-col justify-between">
    <div class="flex flex-row">
      <NetworkHeader class="h-20"/>
      <button @click="down">Back</button>
      <button @click="up">Next</button>
    </div>
    <div class="flex flex-row w-full h-full">
      <NetworkSidebar class="w-32" :number-of-sections="4" :current-section="swiper?.activeIndex" @select="navigateTo"/>

      <Swiper ref="swiperRef" @swiper="setSwiper" direction="vertical" :pagination="{ clickable: true }" :slides-per-view="1" class="w-full h-full">
        <SwiperSlide>
          <NetworkSection class="bg-red-100 w-full h-full">
            <template v-slot:step>Step 1</template>
            <template v-slot:heading>Heading for page 1</template>
          </NetworkSection>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="bg-green-100 w-full h-full">
            <template v-slot:step>Step 2</template>
            <template v-slot:heading>Short</template>
          </NetworkSection>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="bg-blue-100 w-full h-full">
            <template v-slot:step>Step 3</template>
            <template v-slot:body><p>Oh my god<br/>
              so much text<br/>
              it is overwhelming<br/>
              pls no more<br/>
              text</p></template>
          </NetworkSection>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection class="bg-yellow-100 w-full h-full">
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
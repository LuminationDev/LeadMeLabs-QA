<script setup lang="ts">
import NetworkHeader from "./NetworkHeader.vue";
import NetworkFooter from "./NetworkFooter.vue";
import NetworkSidebar from "./NetworkSidebar.vue";
import NetworkSection from "./NetworkSection.vue";
import NetworkChecks from "../components/screen/NetworkChecks.vue";
import { useNetworkStore } from "../store/networkStore";
import { PORTS, WEBSITES } from "../../assets/checks/_networkValues";
import { Swiper, SwiperSlide } from "swiper/vue";
import { onMounted, ref } from "vue";
import 'swiper/css';
import NetworkDeviceSelection from "./NetworkDeviceSelection.vue";
import NetworkDeviceConnection from "../components/screen/NetworkDeviceConnection.vue";
import NetworkReport from "../components/screen/NetworkReport.vue";
import {useRoute} from "vue-router";
import ConnectedToNetwork from '../../assets/guidesImages/ConnectedToNetwork.png'
import RunOnStation from '../../assets/guidesImages/RunOnStation.png'
import Ports from '../../assets/guidesImages/Ports.png'

const route = useRoute();

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

//TODO clean this up
const populateReportTracker = async () => {
  //Add the network checks
  networkStore.reportTracker["Network"] ||= {};
  networkStore.reportTracker["Network"]["Internet"] ||= {
    type: "Network",
    checkingStatus: "unchecked",
    passedStatus: "skipped",
    message: "",
    id: "Internet",
  };

  //Add the ports to check
  networkStore.reportTracker["Ports"] ||= {};
  for (const port of PORTS) {
    networkStore.reportTracker["Ports"][port.name] ||= {
      type: "Ports",
      checkingStatus: "unchecked",
      passedStatus: "skipped",
      message: "",
      id: port.value,
    };
  }

  //Add the websites to check
  networkStore.reportTracker["Firewall"] ||= {};
  for (const website of WEBSITES) {
    networkStore.reportTracker["Firewall"][website.name] ||= {
      type: "Firewall",
      checkingStatus: "unchecked",
      passedStatus: "skipped",
      message: "",
      id: website.name,
    };
  }

  //Add the speed test
  networkStore.reportTracker["Speed Test"] ||= {};
  networkStore.reportTracker["Speed Test"]["Download"] ||= {
    type: "Download",
    checkingStatus: "unchecked",
    passedStatus: "skipped",
    message: "",
    id: "Download",
  };
}

onMounted(() => {
  populateReportTracker();
});

const guideContent = [
  [
    {
      imageSource: ConnectedToNetwork,
      text: '<h3 class="text-lg text-black font-semibold">Test your local network</h3><p>Make sure the device is connected to the network you are trying to test</p>'
    },
    {
      imageSource: RunOnStation,
      text: '<h3 class="text-lg text-black font-semibold">Run test on a station</h3><p>If you have access to a Lumination Learning Lab, it is preferred you test your network from a Station PC</p>'
    }
  ],
  [
    {
      imageSource: ConnectedToNetwork,
      text: '<h3 class="text-lg text-black font-semibold">Connect to the internet</h3><p>To pass the network check, ensure that the device is connected to the internet</p>'
    },
    {
      imageSource: Ports,
      text: '<h3 class="text-lg text-black font-semibold">Open required ports</h3><p>To pass the port checks, ensure that the required ports are able to be used the your device</p>'
    },
    {
      imageSource: null,
      text: '<h3 class="text-lg text-black font-semibold">Allowlist required websites</h3><p>To pass the website checks, ensure that all required websites are allowlisted</p>'
    }
  ],
  [
    {
      imageSource: null,
      text: '<h3 class="text-lg text-black font-semibold">Upload your report</h3><p>Either use the upload function in app, or download the report and send it to your Lumination contact</p>'
    }
  ]
]

</script>

<template>
  <div class="w-full h-full flex flex-col justify-between overflow-hidden">
    <div class="flex flex-row">
      <NetworkHeader/>
    </div>
    <div class="flex flex-row w-full h-full relative">
      <NetworkSidebar class="w-32 pt-10" :number-of-sections="3" :current-section="swiper?.activeIndex" @select="navigateTo"/>
      <Swiper ref="swiperRef" @swiper="setSwiper" direction="vertical" :pagination="{ clickable: true }" :slides-per-view="1" class="w-full h-auto mb-44">
        <SwiperSlide>
          <NetworkDeviceSelection :guide="guideContent[0]"/>
        </SwiperSlide>
        <SwiperSlide>
          <NetworkSection :guide="guideContent[1]">
            <template v-slot:step>Step 2</template>
            <template v-slot:heading>Running network checks</template>
            <template v-slot:subheading>Checking connection between devices and requisite websites</template>
            <template v-slot:body><NetworkChecks/></template>
          </NetworkSection>
        </SwiperSlide>
<!--        <SwiperSlide>-->
<!--          <NetworkSection :guide="guideContent[2]">-->
<!--            <template v-slot:step>Step 3</template>-->
<!--            <template v-slot:heading>Connect to a device <span class="font-medium italic">(Optional)</span></template>-->
<!--            <template v-slot:subheading>Test your connection to another device on the network</template>-->
<!--            <template v-slot:body><NetworkDeviceConnection/></template>-->
<!--          </NetworkSection>-->
<!--        </SwiperSlide>-->
        <SwiperSlide>
          <NetworkSection :guide="guideContent[2]">
            <template v-slot:step>Step 4</template>
            <template v-slot:heading>Upload your report</template>
            <template v-slot:subheading>Send your generated report to Lumination</template>
            <template v-slot:body><NetworkReport/></template>
          </NetworkSection>
        </SwiperSlide>
      </Swiper>
    </div>
    <NetworkFooter
        :current-page="swiper?.activeIndex"
        :number-of-pages="3"
        @back="down"
        @next="up"
    />
  </div>
</template>

<style>
.swiper-slide{
  height: 100%!important;
}
</style>
<script setup lang="ts">
import FullCheckItem from "@renderer/layout/SideBar/FullCheck/FullCheckItem.vue";
import logo from '@renderer/assets/images/tool-logo.svg';
import * as CONSTANT from "@renderer/assets/constants";
import { useRoute, useRouter } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
// import { navigation } from "@renderer/router/checkRoutes";

const fullStore = useFullStore();

const saveCurrentProgress = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: CONSTANT.MESSAGE.SAVE_PROGRESS,
    data: JSON.stringify(fullStore.reportTracker)
  });
};

const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden scrollbar-hide">
    <div class="flex justify-center mt-5 sticky flex-shrink-0">
      <router-link to="/settings">
        <img class="h-full" :src="logo" alt="LeadMe Labs Logo" />
      </router-link>
    </div>

    <nav class="flex flex-col w-full h-full text-black overflow-y-auto gray-scrollbar">
      <!--Navbar Title with sub-categories below-->
<!--      <FullCheckItem v-for="(nav, index) in navigation"-->
<!--                     @click="router.push(nav.route)"-->
<!--                     :active="route.path.includes(nav.route)"-->
<!--                     :title="nav.title"-->
<!--                     :object-values="nav.screens"-->
<!--                     :last-item="(navigation.length - 1) === index"/>-->
    </nav>

    <div class="flex h-20 sticky items-center flex-col flex-shrink-0 justify-center">
      <div class="flex flex-row w-48 justify-between mb-2">
        <div class="text-sm font-semibold">QA Test</div>

        <div @click="saveCurrentProgress" class="bg-blue-50 text-blue-600 rounded-xl px-1.5 py-0.5 cursor-pointer border-[1px]
                    border-blue-400 font-semibold text-xs hover:bg-gray-50">
          Save & Exit
        </div>
      </div>

      <div class="flex flex-row items-center">
        <div class="w-40 relative">
          <div
              class="bg-slate-800 rounded-full h-2 absolute z-10"
              :style="{ width: route.meta['progress'] + '%' }"
          ></div>
          <div class="w-40 bg-zinc-300 rounded-full h-2 absolute"></div>
        </div>
        <div class="flex justify-start h-3.5 ml-3 w-6">
          <span class="text-sm font-semibold">{{ route.meta['progress'] }}%</span>
        </div>
      </div>
    </div>

  </div>
</template>

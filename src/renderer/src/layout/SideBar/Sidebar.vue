<script setup lang="ts">
import welcome from '@renderer/assets/images/sidebar_welcome.svg';
import logo from '@renderer/assets/images/logo.svg';
import FullCheckRoutes from '@renderer/layout/SideBar/FullCheck/FullCheckRoutes.vue';
import ConfigToolRoutes from '@renderer/layout/SideBar/ConfigToolRoutes.vue';
import { useRoute } from 'vue-router'
import {computed} from "vue";

const route = useRoute();
const routes = ['welcome', 'selection', 'check-selection', 'report-handover'];
const showImage = computed(() => {
  return route.name === undefined || routes.includes(route.name.toString());
});
</script>
<template>
    <div class="flex flex-col h-full overflow-hidden scrollbar-hide">
        <div class="flex justify-center h-20 mt-5 mb-5 sticky flex-shrink-0">
          <router-link to="/settings">
            <img class="w-48" :src="logo" alt="LeadMe Labs Logo" />
          </router-link>
        </div>
        <div
            v-if="showImage || route.path.includes('check/quick') || route.path === '/check/full'"
            class="w-full overflow-y-hidden border-t-gray-100 border-t-2"
        >
            <img class="h-full w-full object-cover rounded-3xl" :src="welcome" alt="LeadMe Labs Logo" />
        </div>

        <!--Full check routes-->
        <FullCheckRoutes v-else-if="route.path.includes('check/full/')"/>

        <!--Config tool routes-->
        <ConfigToolRoutes v-else/>
    </div>
</template>

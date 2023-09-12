<script setup lang="ts">
import welcome from '@renderer/assets/images/sidebar_welcome.svg'
import { useRoute } from 'vue-router'
import FullCheckRoutes from "@renderer/layout/SideBar/FullCheck/FullCheckRoutes.vue";
import ConfigToolRoutes from "@renderer/layout/SideBar/ConfigToolRoutes.vue";

const route = useRoute();
</script>
<template>
    <div class="flex flex-col h-full overflow-hidden scrollbar-hide">
        <div class="flex justify-center h-20 mt-5 mb-5 sticky flex-shrink-0">
            <!--TODO replace with the proper section below when design is ready-->
            <!--<img class="h-full" :src="logo" alt="LeadMe Labs Logo" />-->
            <img class="h-full" src="../../assets/deleteLater/logo.png" alt="LeadMe Labs Logo" />
        </div>
        <div
            v-if="route.name === 'welcome' || route.name === 'selection'
              || route.path.includes('check/quick') || route.path === '/check/full'"
            class="w-full overflow-y-hidden border-t-gray-100 border-t-2"
        >
            <!--TODO replace with the proper section below when design is ready-->
            <!--<img class="h-full w-full object-cover" :src="welcome" alt="LeadMe Labs Logo" />-->
            <img class="h-full w-full object-cover" src="../../assets/deleteLater/sideBar.png" alt="LeadMe Labs Logo" />
        </div>

        <!--Full check routes-->
        <FullCheckRoutes v-else-if="route.path.includes('check/full/')"/>

        <!--Config tool routes-->
        <ConfigToolRoutes v-else/>
    </div>
</template>

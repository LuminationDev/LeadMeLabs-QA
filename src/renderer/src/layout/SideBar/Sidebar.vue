<script setup lang="ts">
import welcome from '@renderer/assets/images/sidebar-welcome.png';
import logo from '@renderer/assets/icons/leadmeLabsLogo.svg';
import FullCheckRoutes from '@renderer/layout/SideBar/FullCheck/FullCheckRoutes.vue';
import ConfigToolRoutes from '@renderer/layout/SideBar/ConfigTool/ConfigToolRoutes.vue';
import { useRoute } from 'vue-router'

const route = useRoute();
</script>
<template>
    <!--Config tool routes-->
    <ConfigToolRoutes v-if="route.path.startsWith('/config')"/>

    <!--Full check manual routes-->
    <FullCheckRoutes v-else-if="route.path.includes('check/full')"/>

    <div v-else class="flex flex-col h-full max-w-[220px] overflow-hidden scrollbar-hide">
      <div v-if="route.path.includes('/config')" class="flex justify-center h-10 mt-5 mb-5 sticky flex-shrink-0">
        <router-link to="/settings">
          <img class="h-full" :src="logo" alt="LeadMe Labs Logo" />
        </router-link>
      </div>

      <div class="w-full h-full overflow-y-hidden border-t-gray-100 border-t-2">
          <img class="h-full w-56 object-cover rounded-3xl" :src="welcome" alt="LeadMe Labs Logo" />
      </div>
    </div>
</template>

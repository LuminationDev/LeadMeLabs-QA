<script setup lang="ts">
import NavItems from './NavItems.vue'
import logo from '@renderer/assets/icons/leadmeLabsLogo.svg'
import welcome from '@renderer/assets/images/sidebar_welcome.svg'
import { useRoute } from 'vue-router'

const route = useRoute();
</script>
<template>
    <div class="flex flex-col h-full overflow-hidden scrollbar-hide">
        <div class="flex justify-center h-20 mt-5 mb-5 sticky flex-shrink-0">
            <!--TODO replace with the proper section below when design is ready-->
            <!--<img class="h-full" :src="logo" alt="LeadMe Labs Logo" />-->
            <img class="h-full" src="../assets/deleteLater/logo.png" alt="LeadMe Labs Logo" />
        </div>
        <div
            v-if="route.name === 'welcome' || route.name === 'selection' || route.path.includes('check')"
            class="w-full overflow-y-hidden border-t-gray-100 border-t-2"
        >
            <!--TODO replace with the proper section below when design is ready-->
            <!--<img class="h-full w-full object-cover" :src="welcome" alt="LeadMe Labs Logo" />-->
            <img class="h-full w-full object-cover" src="../assets/deleteLater/sideBar.png" alt="LeadMe Labs Logo" />
        </div>

        <!--TODO Below is the full check routes-->
<!--        <nav-->
<!--            v-else-if="route.path.includes('check/full')"-->
<!--            class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-scroll gray-scrollbar"-->
<!--        >-->
<!--          <NavItems :completion="false" target="/check/full/networking">-->
<!--            Networking-->
<!--          </NavItems>-->
<!--        </nav>-->

        <!--TODO Below is the config tool routes-->
<!--        <nav-->
<!--            v-else-->
<!--            class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-scroll gray-scrollbar"-->
<!--        >-->
<!--            <NavItems :completion="{ valid: true, count: 1 }" target="/welcome">Welcome</NavItems>-->
<!--            <NavItems :completion="checklistStore.getCompletedStatus" target="/checklist"-->
<!--                >Checklist-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.rooms" target="/rooms"-->
<!--                >Rooms</NavItems-->
<!--            >-->
<!--            <NavItems :completion="labStore.getCompletedStatus.lights" target="/lights"-->
<!--                >Lights-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.blinds" target="/blinds"-->
<!--                >Blinds-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.projectors" target="/projectors"-->
<!--                >Projectors-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.splicers" target="/splicers"-->
<!--                >Splicers-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.ledRings" target="/ledRings"-->
<!--                >LED Rings-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.stations" target="/stations"-->
<!--                >Stations-->
<!--            </NavItems>-->
<!--            <NavItems :completion="labStore.getCompletedStatus.scenes" target="/scenes"-->
<!--                >Scenes-->
<!--            </NavItems>-->
<!--            <NavItems target="/final">Final</NavItems>-->
<!--        </nav>-->
<!--        <div class="flex h-20 sticky items-center flex-col flex-shrink-0 justify-center">-->
<!--            <div class="flex justify-start w-11/12">-->
<!--                <span class="text-xs">{{ route.meta.progress }}%</span>-->
<!--            </div>-->
<!--            <div class="w-11/12 relative">-->
<!--                <div-->
<!--                    class="bg-slate-800 rounded-full h-2 absolute z-10"-->
<!--                    :style="{ width: route.meta.progress + '%' }"-->
<!--                ></div>-->
<!--                <div class="w-full bg-zinc-300 rounded-full h-2 absolute"></div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

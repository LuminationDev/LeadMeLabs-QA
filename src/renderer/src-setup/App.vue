<script setup lang="ts">
import { RouterView } from 'vue-router'
import ShowState from './components/helpers/showState.vue'
import Sidebar from '../layout/Sidebar/Sidebar.vue'
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import BottomBar from './components/BottomBar.vue'
import { useConfigStore } from './store/configStore'
import { storeToRefs } from 'pinia'
import router from './router/router'

const route = useRoute()

onBeforeMount(() => {
  router.push('/');
})

const mainStore = useConfigStore()
const { showPreview } = storeToRefs(mainStore)
</script>

<template>
  <div class="flex flex-row w-full justify-between max-h-[95vh]">
    <div class="flex-col bg-white min-w-[220px] rounded-3xl">
      <Sidebar />
    </div>
    <div
        class="content flex-col bg-white ml-2 rounded-3xl w-full min-w-[30rem] justify-between overflow-scroll pt-0"
    >
      <RouterView class="mx-2 px-4" />
      <div
          class="sticky bottom-0 w-full h-20 flex-row justify-between items-center border-t-2 px-4 bg-white"
      >
        <BottomBar :meta="route.meta" />
      </div>
    </div>
    <div
        v-if="showPreview"
        class="content flex flex-col bg-white w-96 flex-shrink-0 max-h-[98vh] rounded-3xl ml-2"
    >
      <ShowState />
    </div>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.css';
</style>

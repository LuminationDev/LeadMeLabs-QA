<script setup lang="ts">
import FullCheckNavItem from "@renderer/layout/SideBar/FullCheck/FullCheckNavItem.vue";
import { useRoute } from "vue-router";

interface NavItem {
  title: string;
  objectName: string;
  progress: number;
  routeName: string;
}

defineProps({
  active: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  objectValues: {
    type: Array as () => NavItem[],
    required: true
  },
  lastItem: {
    type: Boolean,
    required: false,
    default: false
  }
});

const route = useRoute();
</script>

<template>
  <div class="flex flex-col ml-4 relative">
    <FullCheckNavItem class="my-3" :class="{'font-semibold': active}" :title="title" :object-names="objectValues.map(item => item.objectName)"/>

    <div v-if="active" v-for="(item, index) in objectValues" :key="item.title" class="ml-5 flex flex-col relative">
      <FullCheckNavItem class="my-3" :class="{'font-semibold': route.name === item.routeName}"  :title="item.title" :object-names="[item.objectName]"/>
      <div v-if="index < objectValues.length - 1"
        class="absolute top-9 -bottom-3"
        :class="{
          'left-[7px] border-l-[1px] border-gray-300': route.meta['progress'] <= item.progress,
          'left-[6px] border-l-[3px] border-blue-600': route.meta['progress'] > item.progress,
        }"/>
    </div>

    <div v-if="!lastItem"
      class="absolute top-9 -bottom-3"
       :class="{
        'left-[7px] border-l-[1px] border-gray-300': route.meta['progress'] <= objectValues[objectValues.length - 1]?.progress,
        'left-[6px] border-l-[3px] border-blue-600': route.meta['progress'] > objectValues[objectValues.length - 1]?.progress,
      }"/>
  </div>
</template>

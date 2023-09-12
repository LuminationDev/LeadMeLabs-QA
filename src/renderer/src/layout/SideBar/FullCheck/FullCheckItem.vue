<script setup lang="ts">
import FullCheckNavItem from "@renderer/layout/SideBar/FullCheck/FullCheckNavItem.vue";
import { ref } from "vue";

interface NavItem {
  title: string;
  objectName: string;
}

defineProps({
  title: {
    type: String,
    required: true
  },
  objectValues: {
    type: Array as () => NavItem[],
    required: true
  }
});
</script>

<template>
  <FullCheckNavItem :title="title" :object-names="objectValues.map(item => item.objectName)"/>
  <div class="ml-5 flex flex-col">
    <FullCheckNavItem v-for="item in objectValues" :key="item.title" :title="item.title" :object-names="[item.objectName]"/>
  </div>
</template>

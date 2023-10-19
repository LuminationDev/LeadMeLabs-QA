<script setup lang="ts">
import MenuItem from "@renderer/layout/SideBar/FullCheck/components/MenuItem.vue";
import MenuSeparator from "@renderer/layout/SideBar/FullCheck/components/MenuSeparator.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const router = useRouter();
const route = useRoute();
const fullStore = useFullStore();

/**
 * Check if the main category is currently active.
 */
const isActive = computed(() => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`full-setup`);
});

/**
 * Check if a manual check sub-category is currently active.
 */
const isSubActive = (page: string) => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`full-setup-devices-${page}`);
};

/**
 * Check if the separator between menu items should be highlighted.
 * @param localRoute A string of the menu item direct before the current separator.
 */
const isSeparatorActive = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = <number|undefined>pageRoute?.meta['progress'];

  if (pageProgress === undefined) {
    return false;
  }

  return pageProgress < fullStore.maxProgress;
}

const currentTitleStatus = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = <number|undefined>pageRoute?.meta['progress'];

  if (pageProgress === undefined) {
    return 'pending';
  }

  //Progress is equal to the screen's progress OR it is on the same local page but different tab
  if (route.path.includes(localRoute)) {
    return 'active';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < fullStore.maxProgress) {
    return 'complete';
  } else {
    return 'pending';
  }
}

const currentSubStatus = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = <number|undefined>pageRoute?.meta['progress'];
  const currentProgress = <number|undefined>route?.meta['progress'];

  if (pageProgress === undefined || currentProgress === undefined) {
    return 'pending';
  }

  //Progress is less than the screen's progress
  if (pageProgress > fullStore.maxProgress) {
    return 'pending';

    //Progress is equal to the screen's progress OR it is on the same local page but different tab
  } else if ((pageProgress === currentProgress) || (route.path.includes(localRoute) && pageProgress === fullStore.maxProgress)) {
    return 'active';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < fullStore.maxProgress || (!route.path.includes(localRoute) && pageProgress === fullStore.maxProgress)) {
    return 'complete';
  }

  return "pending";
}
</script>

<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem title="Setup" route="/check/full/setup/details"
              :current="isActive"
              :status="currentTitleStatus('/check/full/setup')"/>

    <template v-if="isActive">
      <!--Sub-categories-->
      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Details"
                  route="/check/full/setup/details"
                  :current="isSubActive('details')"
                  :status="currentTitleStatus('/check/full/setup/details')"/>

        <MenuSeparator :active="isSeparatorActive('/check/full/setup/details')"/>
      </div>

      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Devices"
                  route="/check/full/setup/devices"
                  :current="isSubActive('nuc')"
                  :status="currentTitleStatus('/check/full/setup/devices')"/>

        <MenuSeparator :active="isSeparatorActive('/check/full/setup/devices')"/>
      </div>

      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Appliances" route="/check/full/setup/appliances"
                  :current="isSubActive('appliances')"
                  :status="currentSubStatus('/check/full/setup/appliances')"/>
      </div>

      <!--Category separator-->
      <MenuSeparator :active="isSeparatorActive('/check/full/setup/appliances')"/>
    </template>

    <MenuSeparator :active="isSeparatorActive('/check/full/setup/appliances')"/>
  </div>
</template>

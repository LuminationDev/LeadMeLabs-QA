<script setup lang="ts">
import MenuItem from "@renderer/layout/SideBar/FullCheck/components/MenuItem.vue";
import MenuSeparator from "@renderer/layout/SideBar/FullCheck/components/MenuSeparator.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

/**
 * Check if the main category is currently active.
 */
const isActive = computed(() => {
  return route.name.toString().includes(`full-setup`)
});

/**
 * Check if a manual check sub-category is currently active.
 */
const isSubActive = (page: string) => {
  return route.name.toString().includes(`full-setup-${page}`)
};

/**
 * Check if the separator between menu items should be highlighted.
 * @param localRoute A string of the menu item direct before the current separator.
 */
const isSeparatorActive = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = pageRoute.meta['progress'];
  const currentProgress = route.meta['progress'];

  return pageProgress < currentProgress;
}

const currentTitleStatus = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = pageRoute.meta['progress'];
  const currentProgress = route.meta['progress'];

  //Progress is equal to the screen's progress OR it is on the same local page but different tab
  if (route.path.includes(localRoute)) {
    return 'active';
    //TODO relies on a report structure so not implemented yet
  } else if (false) {
    return 'complete';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < currentProgress) {
    return 'incomplete';
  } else {
    return 'pending';
  }
}

const currentSubStatus = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = pageRoute.meta['progress'];
  const currentProgress = route.meta['progress'];

  //Progress is less than the screen's progress
  if (pageProgress > currentProgress) {
    return 'pending';

    //Progress is equal to the screen's progress OR it is on the same local page but different tab
  } else if ((pageProgress === currentProgress) || route.path.includes(localRoute)) {
    return 'active';

    //TODO relies on a report structure so not implemented yet
  } else if (false) {
    return 'complete';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < currentProgress) {
    return 'incomplete';
  }
}
</script>

<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem title="Setup" route="/check/full/setup/devices" :current="isActive" :status="currentTitleStatus('/check/full/setup')" :setup="true"/>

    <template v-if="isActive">
      <!--Sub-categories-->
      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Devices" route="/check/full/setup/devices"  :current="isSubActive('devices')" :status="currentSubStatus('/check/full/setup/devices')" :setup="true"/>

        <MenuSeparator :active="isSeparatorActive('/check/full/setup/devices')" :setup="true"/>
      </div>

      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Config" route="/check/full/setup/config"  :current="isSubActive('config')" :status="currentSubStatus('/check/full/setup/config')" :setup="true"/>
      </div>

      <!--Category separator-->
      <MenuSeparator v-if="!isSeparatorActive('/check/full/setup/config')" :active="false" :setup="true"/>
    </template>
  </div>
</template>

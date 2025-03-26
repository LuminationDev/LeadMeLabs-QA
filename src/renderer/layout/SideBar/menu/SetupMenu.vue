<script setup lang="ts">
import MenuItem from "./MenuItem.vue";
import MenuSeparator from "./MenuSeparator.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStateStore } from "../../../store/stateStore";
import * as CONSTANT from "../../../assets/constants";

const router = useRouter();
const route = useRoute();
const stateStore = useStateStore();
const tempStore = stateStore.getStore;

let routePrefix: string;
let namePrefix: string;

if (stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  routePrefix = "experiences";
  namePrefix = "experiences";
} else {
  routePrefix = "check/full";
  namePrefix = "full";
}

/**
 * Check if the main category is currently active.
 */
const isActive = computed(() => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`${namePrefix}-setup`);
});

/**
 * Check if a manual check sub-category is currently active.
 */
const isSubActive = (page: string) => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`${namePrefix}-setup-devices-${page}`);
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

  return pageProgress < tempStore.maxProgress;
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
  else if (pageProgress < tempStore.maxProgress) {
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
  if (pageProgress > tempStore.maxProgress) {
    return 'pending';

    //Progress is equal to the screen's progress OR it is on the same local page but different tab
  } else if ((pageProgress === currentProgress) || (route.path.includes(localRoute) && pageProgress === tempStore.maxProgress)) {
    return 'active';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < tempStore.maxProgress || (!route.path.includes(localRoute) && pageProgress === tempStore.maxProgress)) {
    return 'complete';
  }

  return "pending";
}
</script>

<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem title="Setup"
              :route="`/${routePrefix}/setup/details`"
              :current="isActive"
              :status="currentTitleStatus(`/${routePrefix}/setup`)"/>

    <template v-if="isActive">
      <!--Sub-categories-->
      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Details"
                  :route="`/${routePrefix}/setup/details`"
                  :current="isSubActive('details')"
                  :status="currentTitleStatus(`/${routePrefix}/setup/details`)"/>

        <MenuSeparator :active="isSeparatorActive(`/${routePrefix}/setup/details`)"/>
      </div>

      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Devices"
                  :route="`/${routePrefix}/setup/devices/nuc`"
                  :current="isSubActive('nuc')"
                  :status="currentTitleStatus(`/${routePrefix}/setup/devices`)"/>

        <MenuSeparator v-if="stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER" :active="isSeparatorActive(`/${routePrefix}/setup/devices`)"/>
      </div>

      <!--Only show if not using the experience launcher-->
      <template v-if="stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER">
        <div class="ml-5 flex flex-col relative">
          <MenuItem title="Appliances"
                    :route="`/${routePrefix}/setup/appliances`"
                    :current="isSubActive('appliances')"
                    :status="currentSubStatus(`/${routePrefix}/setup/appliances`)"/>
        </div>

        <!--Category separator-->
        <MenuSeparator :active="isSeparatorActive(`/${routePrefix}/setup/appliances`)"/>
      </template>
    </template>

    <MenuSeparator :active="isSeparatorActive(`/${routePrefix}/setup/appliances`)"/>
  </div>
</template>

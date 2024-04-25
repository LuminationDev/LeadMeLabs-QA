<script setup lang="ts">
import MenuItem from "./MenuItem.vue";
import MenuSeparator from "./MenuSeparator.vue";
import * as CONSTANT from "../../../assets/constants";
import { useStateStore } from "../../../store/stateStore";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { CheckObject } from "../../../interfaces/_routeItems";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  category: {
    type: Array<CheckObject>,
    required: true
  },
  autoChecks: {
    type: Array<String>,
    required: false,
    default: []
  },
  separator: {
    type: Boolean,
    required: false,
    default: true
  },
  preCheck: {
    type: Boolean,
    required: false,
    default: false
  },
})

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const router = useRouter();
const route = useRoute();

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

  return route.name.toString().includes(`${namePrefix}-${props.title.toLowerCase()}`)
});

/**
 * Check if a manual check sub-category is currently active.
 */
const isSubActive = (index: number) => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`${namePrefix}-${props.title.toLowerCase()}-${props.category[index].page}`)
};

/**
 * Check if an auto check sub-category is currently active.
 */
const isAutoSubActive = (index: number) => {
  if (route.name === undefined || route.name === null) {
    return false;
  }

  return route.name.toString().includes(`${namePrefix}-${props.title.toLowerCase()}-${props.autoChecks[index]}`)
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

/**
 * Generate the route a main menu item should direct a user to if clicked on. This returns the check section and the
 * first category for that section.
 */
const generateRoute = () => {
  if (props.autoChecks.length > 0) {
    return `/${routePrefix}/${props.title.toLowerCase()}/${props.autoChecks[0]}`;
  } else {
    return `/${routePrefix}/${props.title.toLowerCase()}/${props.category[0]['page']}/${Object.keys(props.category[0].category[0])[0].toLowerCase()}`;
  }
}

/**
 * Calculate the current status of a category. NOTE: this is almost the same as the currentSubStatus however there will
 * be a difference in calculating the 'complete' status which is why it is separate.
 * This depends on the current route progress, all sub-items progress and
 * what the route path is. An override factory will be when the category in the report has been completed, then the user
 * will likely be looking back over the details.
 * @param localRoute A string of the route associated with the category.
 */
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

/**
 * Calculate the current status of a sub item. This depends on the current route progress, the sub-items progress and
 * what the route path is. An override factory will be when the category in the report has been completed, then the user
 * will likely be looking back over the details.
 * @param localRoute A string of the route associated with a sub-item.
 */
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
  } else if ((pageProgress === currentProgress) || (route.path.includes(localRoute) || pageProgress === tempStore.maxProgress)) {
    return 'active';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < tempStore.maxProgress) {
    return 'complete';
  }

  return 'pending';
}
</script>

<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem :title="title"
              :route="generateRoute()"
              :current="isActive"
              :status="currentTitleStatus(`/${routePrefix}/${props.title.toLowerCase()}`)"/>

    <!--Sub-categories-->
    <!--Auto-checks-->
    <div v-if="isActive" v-for="(subtitle, index) in autoChecks" :key="index" class="ml-5 flex flex-col relative">
      <MenuItem v-if="preCheck === false || (preCheck === true && index !== 0)" :title="stateStore.generateTitle(<string>subtitle)"
                :route="`/${routePrefix}/${title.toLowerCase()}/${subtitle}`"
                :current="isAutoSubActive(index)"
                :status="currentSubStatus(`/${routePrefix}/${title.toLowerCase()}/${subtitle}`)"/>

      <MenuSeparator v-if="category.length > 0" :active="isSeparatorActive(`/${routePrefix}/${title.toLowerCase()}/${subtitle}`)"/>
    </div>

    <!--Manual-checks-->
    <div v-if="isActive" v-for="(object, index) in category" :key="index" class="ml-5 flex flex-col relative">
      <template v-if="object.category !== undefined">
        <MenuItem :title="stateStore.generateTitle(object['page'])"
                  :route="`/${routePrefix}/${title.toLowerCase()}/${object['page']}/${Object.keys(object.category[0])[0].toLowerCase()}`"
                  :current="isSubActive(index)"
                  :status="currentSubStatus(`/${routePrefix}/${title.toLowerCase()}/${object['page']}`)"/>

        <MenuSeparator v-if="index < category.length - 1" :active="isSeparatorActive(`/${routePrefix}/${title.toLowerCase()}/${object['page']}`)"/>
      </template>
    </div>

    <!--Category separator-->
    <template v-if="category.length > 0"> <!--Used for categories with auto and manual checks, or just manual checks-->
      <MenuSeparator v-if="separator" :active="isSeparatorActive(`/${routePrefix}/${title.toLowerCase()}/${category[category.length-1]['page']}`)"/>
    </template>
    <template v-else> <!--Used for categories with only auto checks-->
      <MenuSeparator v-if="separator" :active="isSeparatorActive(`/${routePrefix}/${title.toLowerCase()}/${autoChecks[0]}`)"/>
    </template>
  </div>
</template>

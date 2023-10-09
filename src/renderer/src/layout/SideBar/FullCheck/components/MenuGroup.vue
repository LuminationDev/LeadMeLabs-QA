<script setup lang="ts">
import MenuItem from "@renderer/layout/SideBar/FullCheck/components/MenuItem.vue";
import MenuSeparator from "@renderer/layout/SideBar/FullCheck/components/MenuSeparator.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  category: {
    type: Array<Object>,
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
  }
})

const stateStore = useStateStore();
const fullStore = useFullStore();
const router = useRouter();
const route = useRoute();

/**
 * Check if the main category is currently active.
 */
const isActive = computed(() => {
  return route.name.toString().includes(`full-${props.title.toLowerCase()}`)
});

/**
 * Check if a manual check sub-category is currently active.
 */
const isSubActive = (index: number) => {
  return route.name.toString().includes(`full-${props.title.toLowerCase()}-${props.category[index].page}`)
};

/**
 * Check if an auto check sub-category is currently active.
 */
const isAutoSubActive = (index: number) => {
  return route.name.toString().includes(`full-${props.title.toLowerCase()}-${props.autoChecks[index]}`)
};

/**
 * Check if the separator between menu items should be highlighted.
 * @param localRoute A string of the menu item direct before the current separator.
 */
const isSeparatorActive = (localRoute: string) => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(localRoute));
  const pageProgress = pageRoute.meta['progress'];

  return pageProgress < fullStore.maxProgress;
}

/**
 * Generate the route a main menu item should direct a user to if clicked on. This returns the check section and the
 * first category for that section.
 */
const generateRoute = () => {
  if (props.autoChecks.length > 0) {
    return `/check/full/${props.title.toLowerCase()}/${props.autoChecks[0]}`;
  } else {
    return `/check/full/${props.title.toLowerCase()}/${props.category[0].page}/${Object.keys(props.category[0].category[0])[0].toLowerCase()}`;
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
  const pageProgress = pageRoute.meta['progress'];

  //Progress is equal to the screen's progress OR it is on the same local page but different tab
  if (route.path.includes(localRoute)) {
    return 'active';
    //TODO relies on a report structure so not implemented yet
  } else if (false) {
    return 'complete';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < fullStore.maxProgress) {
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
  const pageProgress = pageRoute.meta['progress'];
  const currentProgress = route.meta['progress'];

  //Progress is less than the screen's progress
  if (pageProgress > fullStore.maxProgress) {
    return 'pending';

  //Progress is equal to the screen's progress OR it is on the same local page but different tab
  } else if ((pageProgress === currentProgress) || (route.path.includes(localRoute) || pageProgress === fullStore.maxProgress)) {
    return 'active';

  //TODO relies on a report structure so not implemented yet
  } else if (false) {
    return 'complete';
  }
  //Progress is further than the screen's progress and the report is not complete
  else if (pageProgress < fullStore.maxProgress) {
    return 'complete';
  }
}
</script>

<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem :title="title" :route="generateRoute()" :current="isActive" :status="currentTitleStatus(`/check/full/${props.title.toLowerCase()}`)"/>

    <!--Sub-categories-->
    <!--Auto-checks-->
    <div v-if="isActive" v-for="(subtitle, index) in autoChecks" :key="index" class="ml-5 flex flex-col relative">
      <MenuItem :title="stateStore.generateTitle(subtitle)"
                :route="`/check/full/${title.toLowerCase()}/${subtitle}`"
                :current="isAutoSubActive(index)"
                :status="currentSubStatus(`/check/full/${title.toLowerCase()}/${subtitle}`)"/>

      <MenuSeparator v-if="category.length > 0" :active="isSeparatorActive(`/check/full/${title.toLowerCase()}/${subtitle}`)"/>
    </div>

    <!--Manual-checks-->
    <div v-if="isActive" v-for="(object, index) in category" :key="index" class="ml-5 flex flex-col relative">
      <MenuItem :title="stateStore.generateTitle(object.page)"
                :route="`/check/full/${title.toLowerCase()}/${object.page}/${Object.keys(object.category[0])[0].toLowerCase()}`"
                :current="isSubActive(index)"
                :status="currentSubStatus(`/check/full/${title.toLowerCase()}/${object.page}`)"/>

      <MenuSeparator v-if="index < category.length - 1" :active="isSeparatorActive(`/check/full/${title.toLowerCase()}/${object.page}`)"/>
    </div>

    <!--Category separator-->
    <MenuSeparator v-if="separator" :active="isSeparatorActive(`/check/full/${title.toLowerCase()}/${category[category.length-1].page}`)"/>
  </div>
</template>

<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const fullStore = useFullStore();
</script>

<template>
  <div>
    <div class="flex flex-col">
      <div class="flex flex-col mb-3" v-for="(categories, categoryKey) in fullStore.reportTracker" :key="categoryKey">
        <h2 class="font-semibold text-lg">{{ categoryKey }}</h2>
        <div v-if="categories['comment'] !== undefined" class="mb-2 flex flex-row">
          <div class="font-semibold mr-2 text-amber-800">
            Comments:
          </div>
          <div>
            {{categories['comment']}}
          </div>
        </div>

        <ul>
          <li class="mb-2" v-for="(item, index) in categories" :key="index">
            <div class="font-semibold">
              {{ item.id }}:
            </div>
            <div class="ml-2">
               {{ item.message }}
            </div>
            <div class="ml-2" :class="{
              'text-red-500': item['passedStatus'] !== 'passed',
              'text-green-500': item['passedStatus'] === 'passed',
            }">
              Status: {{item['passedStatus'] ?? 'Unknown'}}
            </div>
          </li>
        </ul>
        <hr>
      </div>
    </div>
  </div>
</template>

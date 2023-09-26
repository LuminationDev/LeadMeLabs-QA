<script setup lang="ts">
import StatusHover from "@renderer/tool-qa/components/fullCheck/StatusHover.vue";
import ItemHover from "@renderer/tool-qa/components/fullCheck/Report/ItemHover.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";

const fullStore = useFullStore();
const stateStore = useStateStore();

const props = defineProps({
  auto: {
    type: String,
    required: false
  },
  currentlySelected: {
    type: String,
    required: false
  },
  stationId: {
    type: [String, Number],
    required: false
  },
  stationChecks: {
    type: Array<any>,
    required: false
  },
  quickRef: {
    type: String,
    required: false
  },
  failedCount: {
    type: Number
  },
  passedStatusCount: {
    type: Number
  },
  totalEntries: {
    type: Number
  }
});

const addComment = (comment: string) => {
  //Update the original tracker
  fullStore.reportTracker[props.auto][props.stationId].find(item => item.id === props.currentlySelected)['comment'] = comment;
}
</script>

<template>
  <div class="w-full mt-4 flex flex-col rounded-lg border-2 border-gray-200">
    <div class="flex flex-row items-center">
      <!--Category Title-->
      <h2 class="font-semibold text-lg p-3">Station {{stationId}}</h2>

      <!--Quick look at category status-->
      <div class="flex items-center rounded-xl w-fit h-5 text-sm px-2 font-semibold" :class="{
                  'bg-red-100 border-[1px] border-red-300 text-red-700': failedCount > 0,
                  'bg-green-100 border-[1px] border-green-300 text-green-700': passedStatusCount === totalEntries,
                  'bg-blue-100 border-[1px] border-blue-300 text-blue-700': failedCount + passedStatusCount !== totalEntries,
                }">
        {{quickRef}}
      </div>
    </div>

    <table class="w-full border-collapse">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>
        <th class="p-3">Date</th>
        <th class="p-3">Status</th>
        <th></th> <!--Empty on purpose-->
      </tr>

      <tr v-for="(check, index) in stationChecks" :key="index" class="text-sm border border-gray-200">
        <ItemHover :title="check.displayName" :message="check.description ?? 'No details provided'"/>

        <td class="p-3 w-36">
          <div>{{stateStore.formattedDate()}}</div>
        </td>

        <StatusHover :message="check.message ?? 'No details provided'" :checking-status="check['checkingStatus']" :passed-status="check['passedStatus']"/>

        <td class="p-3 w-28" v-on:click="$emit('update', check.id)">
          <CommentModal :mode="check['comment'] !== undefined && check['comment'].length > 0 ? 'icon' : 'icon-empty'"
                        :current-comment="check['comment']"
                        :callback="addComment"/>
        </td>
      </tr>
    </table>
  </div>
</template>

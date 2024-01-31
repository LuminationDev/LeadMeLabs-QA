<script setup lang="ts">
import ItemHover from "../../../components/statuses/ItemHover.vue";
import StatusHover from "../../../components/statuses/StatusHover.vue";
import { useFullStore } from "../../store/fullStore";
import {computed, onMounted, ref, onBeforeMount, onBeforeUnmount } from "vue";
import { QaCheck } from "../../interfaces";
import * as CONSTANT from "../../../assets/constants";
import CheckStatus from "@renderer/components/statuses/CheckStatus.vue";
import * as Sentry from "@sentry/electron";

Sentry.init({
  dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
});

const fullStore = useFullStore();
const checking = ref("done");

var deepDiffMapper = function () {
  return {
    VALUE_CREATED: 'created',
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    map: function(obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          type: this.compareValues(obj1, obj2),
          data: obj1 === undefined ? obj2 : obj1
        };
      }

      var diff = {};
      for (var key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        var value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (var key in obj2) {
        if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      return diff;

    },
    compareValues: function (value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
        return this.VALUE_UNCHANGED;
      }
      if (value1 === undefined) {
        return this.VALUE_CREATED;
      }
      if (value2 === undefined) {
        return this.VALUE_DELETED;
      }
      return this.VALUE_UPDATED;
    },
    isFunction: function (x) {
      return Object.prototype.toString.call(x) === '[object Function]';
    },
    isArray: function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    },
    isDate: function (x) {
      return Object.prototype.toString.call(x) === '[object Date]';
    },
    isObject: function (x) {
      return Object.prototype.toString.call(x) === '[object Object]';
    },
    isValue: function (x) {
      return !this.isObject(x) && !this.isArray(x);
    }
  }
}();

var prev = null;


const checks = computed(() => {
  let checks = {}
  console.log('computing checks')
  console.log(deepDiffMapper.map(prev, fullStore.stations))
  console.log(JSON.stringify(deepDiffMapper.map(prev, fullStore.stations)))
  prev = fullStore.stations
  fullStore.stations.forEach(station => {
    console.log(station)
    station.getComputedChecks().forEach((check) => {
      console.log(check)
      try {
        if (!checks[check.id]) {
          //Add the check to the report
          // fullStore.addCheckToReportTracker("connection", "station_details",
          //     { key: check.id, description: check.displayName },
          //     { station: true, tablet: false, nuc: false, cbus: false });

          checks[check.id] = {
            displayName: check.displayName,
            stations: []
          }
        }

        //Update the report
        // fullStore.updateReport("connection", "station_details",
        //     { passedStatus: check.passedStatus, message: check.message }, check.id, station.id);

        checks[check.id].stations.push(check)
      } catch (e) {
        Sentry.captureException(e);
      }
    })
  });

  return checks
});

Sentry.captureMessage("pre retryStationConnection creation")

const retryStationConnection = () => {
  checking.value = "testing";
  fullStore.stations.forEach(station => {
    fullStore.sendStationMessage(station.id, {
      action: CONSTANT.ACTION.CONNECT_STATION,
      actionData: {
        expectedStationId: station.id
      }
    })
  });
  setTimeout(() => { checking.value = "done" }, 1000);
}

Sentry.captureMessage("done all set up")

</script>

<template>
  <div class="flex flex-col">
    <!--Loading-->
    <CheckStatus :callback="retryStationConnection" :checking="checking"/>

    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>

        <th class="w-16 text-center p-3" v-for="station in fullStore.stations">
          S{{station.id}}
        </th>
      </tr>

      <template>
        {{ checks }}
<!--        <tr v-for="(check, id) in checks" :key="id" class="text-sm border border-gray-200">-->
<!--          <ItemHover :title="check['displayName']" :message="check['extendedDescription'] ?? 'No details provided'"/>-->

<!--          <template v-for="(station, _index) in check['stations'] as QaCheck[]" :key="_index">-->
<!--            <StatusHover :message="station.message ?? 'No details provided'"-->
<!--                         :checking-status="'not checked'"-->
<!--                         :passed-status="station.passedStatus ?? 'unknown'"/>-->
<!--          </template>-->
<!--        </tr>-->
      </template>
    </table>
  </div>
</template>
<script setup lang="ts">
import * as CONSTANT from "../../../assets/constants";
import PDFStructure from "../pdf/PDFStructure.vue";
import { useStateStore } from "../../../store/stateStore";
import { generateHtml } from "../../../assets/html/htmlContent";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const props = defineProps({
  fileType: {
    type: String,
    required: true
  }
});

let fileName: string;
if (stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  fileName = `QAReport_ExperienceLaunches_${tempStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}`;
} else {
  fileName = `QAReport_${tempStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}`;
}

/**
 * Send a message to the backend to generate and download the report as the requested type. The accepted values are
 * either 'json', 'csv' or 'pdf'.
 */
const downloadReport = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: props.fileType,
    fileName,
    data: createHtmlContent()
  });
};

/**
 * Scrap the head from the current document and the 'report' section creating a new html page that represents just the
 * report.
 */
const createHtmlContent = () => {
  //Grab the report part of the current html
  const reportDivContent = document.getElementById('report')?.innerHTML;
  return generateHtml(reportDivContent ?? "Report corruption");
}
</script>

<template>
  <div class="flex flex-row justify-between p-5 h-20 mt-4 border border-gray-300 rounded-lg">
    <div>
      <img class="w-10 mr-2" alt="pdf icon" src="../../../assets/icons/report-file-type-pdf.svg"/>
      <p class="font-semibold text-sm">{{fileName}}.pdf</p>
    </div>

    <div class="w-32 flex justify-center items-center cursor-pointer rounded-lg
                border border-gray-500 hover:bg-gray-200"
        @click="downloadReport"
    >
      Download
    </div>
  </div>

  <!--Generate the report to convert to pdf, can be kept hidden and the content is picked up by the id-->
  <div class="flex flex-col hidden" id="report">
    <p class="text-center text-2xl text-black font-semibold mb-3">QA Lab Report</p>
    <p class="text-black mb-1"><span class="font-semibold">Lab Location: </span>{{tempStore.reportTracker['labLocation']}}</p>
    <p class="text-black mb-1"><span class="font-semibold">Lab Type: </span>{{tempStore.reportTracker['labType'] ?? "Online"}}</p>
    <p class="text-black mb-2"><span class="font-semibold">Prepared by: </span>{{tempStore.reportTracker['technicianName']}}</p>
    <p class="text-black mb-2"><span class="font-semibold">Headset Type: </span>{{tempStore.reportTracker['headsetType']}}</p>

    <p class="text-black mb-2"><span class="font-semibold">Comments:</span></p>
    <div class="bg-gray-50 text-xs" v-for="comment in tempStore.reportTracker['comments']">
      <div class="py-3">
        <div>
          {{comment.date}}
        </div>
        <div>
          <span class="font-semibold mr-1">Comment:</span> {{comment.content}}
        </div>
      </div>
    </div>

    <p class="text-black font-semibold">Tablet map:</p>
    <div v-for="device in tempStore.deviceMap">
      <div v-if="device.type === 'tablet'" class="flex flex-row text-sm ml-3">
        <span class="mr-1">{{device.prefix}}{{device.id}}:</span>
        <span>{{device.ipAddress}}</span>
      </div>
    </div>

    <PDFStructure v-for="title in tempStore.getReportTitles" class="mt-5" :parent="<string>title" :key="title"/>
  </div>
</template>

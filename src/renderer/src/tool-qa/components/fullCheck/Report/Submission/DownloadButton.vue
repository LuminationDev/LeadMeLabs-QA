<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import PDFStructure from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFStructure.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { generateHtml } from "@renderer/assets/html/htmlContent";

const stateStore = useStateStore();
const fullStore = useFullStore();
const props = defineProps({
  fileType: {
    type: String,
    required: true
  }
});

const fileName = `QAReport_${fullStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}`;

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
  return generateHtml(reportDivContent);
}
</script>

<template>
  <div class="flex flex-row justify-between p-5 h-20 mt-4 border border-gray-300 rounded-lg">
    <div>
      <img class="w-10 mr-2" alt="pdf icon" src="../../../../../assets/icons/report-file-type-pdf.svg"/>
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
    <p class="text-black mb-1"><span class="font-semibold">Lab Location: </span>{{fullStore.reportTracker['labLocation']}}</p>
    <p class="text-black mb-1"><span class="font-semibold">Lab Type: </span>{{fullStore.reportTracker['labType'] ?? "Online"}}</p>
    <p class="text-black mb-5"><span class="font-semibold">Prepared by: </span>{{fullStore.reportTracker['technicianName']}}</p>

    <PDFStructure v-for="title in fullStore.getReportTitles" :parent="<string>title" :key="title"/>
  </div>
</template>

<script setup lang="ts">
import * as CONSTANT from "../../../assets/constants";
import NetworkIconDownload from "../../../assets/icons/NetworkIconDownload.vue";
import { useStateStore } from "../../../store/stateStore";
import { generateHtml } from "../../../assets/html/htmlContent";
import { useNetworkStore } from "../../store/networkStore";
import PDFStructure from "../report/PDFStructure.vue";

const stateStore = useStateStore();
const networkStore = useNetworkStore();

const fileName = `Network_Report_${stateStore.getCurrentDate()}`;

/**
 * Send a message to the backend to generate and download the report as the requested type. The accepted values are
 * either 'json', 'csv' or 'pdf'.
 */
const downloadReport = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: 'pdf',
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
  <div class="flex flex-col w-full">
    <div class="flex flex-row justify-between item w-full p-5 h-20 border border-gray-300 rounded-lg">
      <div  class="flex flex-row items-center">
        <img class="w-10 mr-2" alt="pdf icon" src="../../../assets/icons/report-file-type-pdf.svg"/>
        <p class="font-semibold text-sm">Network Report</p>
      </div>

      <div class="w-auto flex justify-center items-center cursor-pointer rounded-lg
                  border border-gray-500 hover:bg-gray-200"
           @click="downloadReport"
      >
        <NetworkIconDownload class="w-10" fill="black"/>
      </div>
    </div>

    <!--Generate the report to convert to pdf, can be kept hidden and the content is picked up by the id-->
    <div class="flex flex-col hidden" id="report">
      <PDFStructure v-for="title in networkStore.getReportTitles" class="mt-5" :parent="<string>title" :key="title"/>
    </div>
  </div>
</template>

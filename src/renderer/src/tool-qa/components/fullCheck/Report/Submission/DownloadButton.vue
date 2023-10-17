<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import PDFStructure from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFStructure.vue";

const fullStore = useFullStore();
const props = defineProps({
  fileType: {
    type: String,
    required: true
  }
});

//TODO generate this somehow
const fileName = "QAReport_LOCATION_DATE";

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
  const head = document.head.outerHTML;

  //Grab the report part of the current html?
  const reportDivContent = document.getElementById('report').innerHTML;

  return `
        <!DOCTYPE html>
        <html lang="en">
            ${head}

            <body style="background-color:white;">
                ${reportDivContent}
            </body>
        </html>
    `;
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
    <PDFStructure v-for="(sections, title) in fullStore.reportTracker" :parent="title" />
  </div>
</template>

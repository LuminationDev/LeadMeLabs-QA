<script setup lang="ts">
import * as CONSTANT from "../../../assets/constants";
import NetworkIconDownload from "../../../assets/icons/vue/NetworkIconDownload.vue";
import { useStateStore } from "../../../store/stateStore";
import { generateHtml } from "../../../assets/html/htmlContent";
import { useNetworkStore } from "../../store/networkStore";
import PDFStructure from "../report/PDFStructure.vue";
import {computed, ref, watch} from "vue";
import UploadReportModal from "../UploadReportModal.vue";
import UploadResultModal from "../UploadResultModal.vue";

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

const canReachFirebase = computed(() => {
  return networkStore?.reportTracker?.Firewall?.Firebase?.passedStatus === 'passed'
})

const emailRef = ref(null);
const siteNameRef = ref(null);
const uploading = ref(false)
const showUploadResult = ref(false)
const uploadMessage = ref("")

watch(() => networkStore.uploadResult, (newValue) => {
  uploading.value = false
  if (newValue === 'success' || newValue === 'failed') {
    uploadMessage.value = newValue
    showUploadResult.value = true
  }
  networkStore.uploadResult = ""
})

async function uploadReport(email: string, siteName: string) {
  //@ts-ignore
  emailRef.value = email
  //@ts-ignore
  siteNameRef.value = siteName
  uploading.value = true
  setTimeout(() => {
    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
      channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
      type: 'upload_pdf',
      fileName,
      data: createHtmlContent(),
      reportType: 'network',
      email,
      siteName
    });
  }, 100)
}

</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-row justify-between item w-full p-5 h-20 border border-gray-300 rounded-lg">
      <div  class="flex flex-row items-center">
        <img class="w-10 mr-2" alt="pdf icon" src="../../../assets/icons/report-file-type-pdf.svg"/>
        <p class="font-semibold text-sm">Network Report</p>
      </div>

      <div class="flex flex-row justify-end">
        <div class="w-auto flex justify-center items-center cursor-pointer rounded-lg
                  border border-gray-500 hover:bg-gray-200 h-10"
             @click="downloadReport"
        >
          <NetworkIconDownload class="w-10" fill="black"/><span class="mr-3" v-if="!canReachFirebase">Download</span>
        </div>
        <UploadReportModal v-if="canReachFirebase" @success="uploadReport" :uploading="uploading" />
        <UploadResultModal v-if="showUploadResult" :message="uploadMessage" @close="() => { showUploadResult = false }" />
      </div>
    </div>

    <div class="flex flex-row w-full rounded-xl mt-5" v-if="!canReachFirebase">
      <img src="../../../assets/images/offline-upload.png" class="w-52 rounded-l-xl"/>
      <div class="flex flex-col justify-center px-5 border-2 border-gray-200 rounded-r-xl border-l-0">
        <span class="font-semibold text-black font-lg">Your device is offline, please send us your report.</span>
        <span>We could not contact our upload location. Simply download your report and send it to your Lumination ICT contact</span>
      </div>
    </div>

    <!--Generate the report to convert to pdf, can be kept hidden and the content is picked up by the id-->
    <div class="flex flex-col hidden" id="report">
      <div v-if="emailRef">
        Creator Email: {{ emailRef }}
      </div>
      <div v-if="siteNameRef">
        Provided Site Name: {{ siteNameRef }}
      </div>
      <PDFStructure v-for="title in networkStore.getReportTitles" class="mt-5" :parent="<string>title" :key="title"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as CONSTANT from "../../../../../../constants";
import CheckStatus from "@renderer/tool-qa/components/_generic/statuses/CheckStatus.vue";
import DownloadButton from "@renderer/tool-qa/components/fullCheck/Report/Submission/DownloadButton.vue";
import LoginModal from "@renderer/tool-qa/modals/LoginModal.vue";
import { getStorage, ref, uploadString } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { computed, onMounted, ref as vueRef, watch } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { generateHtml } from "../../../../../assets/html/htmlContent";

const stateStore = useStateStore();
const fullStore = useFullStore();
const status = vueRef("uploading");
const auth = getAuth();
const userMessage = computed(() => {
  if (fullStore.online) {
    return 'Your test report is available to download';
  } else {
    return 'Please download your report files';
  }
});

/**
 * Check if a user is currently logged in and that the report has not already been uploaded.
 * Otherwise, attempt to upload the report data.
 */
const checkUserStatus = () => {
  const user = auth.currentUser;
  if (user && fullStore.uploadFileResult === false) {
    console.log("User is logged in");
    uploadReport();
  } else {
    console.log("No user logged in")
    fullStore.online = false;
  }
};

/**
 * Upload both the raw JSON data and the PDF file.
 */
const uploadReport = () => {
  fullStore.uploadFileResult = false; //Reset to await new confirmation
  uploadJSON();
  uploadPDF();
}

/**
 * Upload the JSON string of the report tracker. This is more of a data dump than a report upload.
 */
const uploadJSON = () => {
  const storage = getStorage();
  status.value = "uploading";
  const fileName = `report_${fullStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}.json`
  const storageRef = ref(storage, `QA/${fullStore.reportTracker['labLocation']}/${fileName}`);

  uploadString(storageRef, JSON.stringify(fullStore.reportTracker), "raw")
      .then(() => {
        console.log(`File ${fileName} uploaded successfully`);
      })
      .catch((error) => {
        console.error(`Error uploading file ${fileName}: ${error}`);

        status.value = "error";
      });
}

/**
 * Download a copy of the PDF as a temporary file that is used to upload to firebase.
 */
const uploadPDF = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: 'upload_pdf',
    location: fullStore.reportTracker['labLocation'],
    fileName: `report_${fullStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}`,
    data: createHtmlContent()
  });
};

/**
 * Grab the content that has been created in the DownloadButton component.
 */
const createHtmlContent = () => {
  //Grab the report part of the current html
  const reportDivContent = document.getElementById('report')?.innerHTML;
  return generateHtml(reportDivContent ?? "Report corruption");
}

/**
 * Detect any changes in the upload path. This is updated when the backend saves the temporary pdf and sends back a
 * success confirmation.
 */
watch(() => fullStore.uploadFileResult, (newValue) => {
  console.log(`File has been uploaded? Success: ${newValue}`);
  status.value = newValue ? "submitted" : "error";
});

/**
 * Attempt to upload the report on component mount. The user must be signed in to upload a
 * document automatically.
 */
onMounted(() => {
  checkUserStatus();
});
</script>

<template>
  <div class="flex flex-col mt-4">
    <CheckStatus v-if="fullStore.online" :checking="status"/>
    <LoginModal v-else :online="fullStore.online" :callback="uploadReport"/>

    <div class="flex flex-col p-5 h-auto mt-8 border border-gray-300 rounded-lg">
      <p class="text-lg font-semibold mb-1">{{userMessage}}</p>
      <p class="text-sm">Download report as JSON, PDF or CSV</p>

      <DownloadButton file-type="pdf"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as CONSTANT from "../../../assets/constants";
import CheckStatus from "../../../components/statuses/CheckStatus.vue";
import DownloadButton from "./DownloadButton.vue";
import LoginModal from "../../../modals/LoginModal.vue";
import { getStorage, ref, uploadString } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { computed, onMounted, ref as vueRef, watch } from "vue";
import { useStateStore } from "../../../store/stateStore";
import { generateHtml } from "../../../assets/html/htmlContent";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const status = vueRef("uploading");
const auth = getAuth();
const userMessage = computed(() => {
  if (tempStore.online) {
    return 'Your test report is available to download';
  } else {
    return 'Please download your report files';
  }
});

let filePrefix: string;
if (stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  filePrefix = `report_experiences_launched`;
} else {
  filePrefix = `report`;
}

/**
 * Check if a user is currently logged in and that the report has not already been uploaded.
 * Otherwise, attempt to upload the report data.
 */
const checkUserStatus = () => {
  const user = auth.currentUser;
  if (user && tempStore.uploadFileResult === false) {
    console.log("User is logged in");
    uploadReport();
  } else {
    console.log("No user logged in")
    tempStore.online = false;
  }
};

/**
 * Upload both the raw JSON data and the PDF file.
 */
const uploadReport = () => {
  tempStore.uploadFileResult = false; //Reset to await new confirmation
  uploadJSON();
  uploadPDF();
}

/**
 * Upload the JSON string of the report tracker. This is more of a data dump than a report upload.
 */
const uploadJSON = () => {
  const storage = getStorage();
  status.value = "uploading";
  const fileName = `${filePrefix}_${tempStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}.json`
  const storageRef = ref(storage, `QA/${tempStore.reportTracker['labLocation']}/${fileName}`);

  uploadString(storageRef, JSON.stringify(tempStore.reportTracker), "raw")
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
    location: tempStore.reportTracker['labLocation'],
    fileName: `${filePrefix}_${tempStore.reportTracker['labLocation']}_${stateStore.getCurrentDate()}`,
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
watch(() => tempStore.uploadFileResult, (newValue) => {
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
    <CheckStatus v-if="tempStore.online" :checking="status"/>
    <LoginModal v-else title="QA Tool" description="Run a Quality Assurance Test" :online="tempStore.online" :callback="uploadReport"/>

    <div class="flex flex-col p-5 h-auto mt-8 border border-gray-300 rounded-lg">
      <p class="text-lg font-semibold mb-1">{{userMessage}}</p>
      <p class="text-sm">Download report as JSON, PDF or CSV</p>

      <DownloadButton file-type="pdf"/>
    </div>
  </div>
</template>

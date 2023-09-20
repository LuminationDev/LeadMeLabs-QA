<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import { ref } from 'vue';

const props = defineProps({
  dynamicContent: {
    type: String,
    required: true
  }
})

const generatePDF = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: "pdf",
    data: props.dynamicContent
  });
};

const generateCSV = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: "csv",
    data: props.dynamicContent
  });
};
</script>

<template>
  <div class="flex flex-col mt-4">
    <!-- Your dynamic content here -->
    <div>{{ dynamicContent }}</div>

    <div class="flex flex-row mt-5">
      <GenericButton class="mr-6" type="primary" :callback="generatePDF">
        Generate PDF
      </GenericButton>

      <GenericButton type="primary" :callback="generateCSV">
        Generate CVS
      </GenericButton>
    </div>
  </div>
</template>

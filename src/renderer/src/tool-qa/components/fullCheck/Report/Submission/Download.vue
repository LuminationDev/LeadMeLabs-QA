<script setup lang="ts">
import CheckStatus from "@renderer/tool-qa/components/fullCheck/CheckStatus.vue";
import DownloadButton from "@renderer/tool-qa/components/fullCheck/Report/Submission/DownloadButton.vue";
</script>

<template>
  <div class="flex flex-col mt-4">
    <CheckStatus checking="submitted"/>

    <div class="flex flex-col p-5 h-auto mt-8 border border-gray-300 rounded-lg">
      <p class="text-lg font-semibold mb-1">Your test report is available to download</p>
      <p class="text-sm">Download report as JSON, PDF or CSV</p>

      <DownloadButton file-type="pdf"/>
    </div>
  </div>
</template>

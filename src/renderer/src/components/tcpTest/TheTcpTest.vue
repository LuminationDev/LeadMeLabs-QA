<script setup lang="ts">
import TcpServer from './TcpServer.vue';
import TcpClient from './TcpClient.vue';
import TcpKey from './TcpKey.vue';
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <p class="text-lg text-black mb-3">TCP Testing</p>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <TcpKey />

      <hr class="my-4">

      <TcpServer />

      <hr class="my-4">

      <TcpClient />
    </div>
  </div>
</template>
<script setup lang="ts">
import PasswordHeader from "./PasswordHeader.vue";
import PasswordFooter from "./PasswordFooter.vue";

const back = () => {
  console.log("back");
}

const next = () => {
  console.log("next");
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between overflow-hidden">
    <div class="flex flex-row">
      <PasswordHeader/>
    </div>
    <div class="flex flex-row w-full h-full relative">
      Passwords and stuff
    </div>
    <PasswordFooter
        :current-page="1"
        :number-of-pages="3"
        @back="back"
        @next="next"
    />
  </div>
</template>

<style>

</style>
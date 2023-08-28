<script setup lang="ts">
import NavItems from './NavItems.vue'
</script>

<template>
    <header class="navbar">
        <nav class="flex flex-row w-full p-5 pt-5 text-black">
            <div class="sidebar-title mr-8">
                <h2 class="title font-bold text-lg text-center">LeadMe QA</h2>
            </div>
            <NavItems target="/">Home</NavItems>
            <NavItems target="/settings">Settings</NavItems>
        </nav>
    </header>
</template>
